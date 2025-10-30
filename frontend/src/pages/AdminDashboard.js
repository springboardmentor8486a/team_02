// AdminDashboard.js
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import * as XLSX from "xlsx";
import AdminHeader from '../components/AdminHeader';
import AdminFooter from '../components/AdminFooter';
import { 
    LayoutDashboard, AlertCircle, Users, FileText, 
    Clock, CheckCircle, TrendingUp, Timer, ThumbsUp,
    Settings, ArrowRight, Download, Printer, Calendar, 
    BarChart3, PieChart as PieChartIcon, Home
} from 'lucide-react';
import {
    BarChart, Bar, PieChart, Pie, LineChart, Line,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend,
    ResponsiveContainer, Cell
} from 'recharts';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const { user, signOut } = useAuth();
    const [dateRange, setDateRange] = useState('all');
    const [reportData, setReportData] = useState(null);
    const [loading, setLoading] = useState(false);

    // Check if user is admin
    useEffect(() => {
        if (!user) {
            navigate('/login');
        } else if (user.role !== 'admin') {
            navigate('/dashboard');
        }
    }, [user, navigate]);

    // Mock data for demonstration/fallback
    const getMockReportData = useCallback(() => ({
        issuesOverview: [
            { name: 'Total Issues', value: 156, color: '#3b82f6' },
            { name: 'Pending', value: 23, color: '#f97316' },
            { name: 'In Progress', value: 41, color: '#8b5cf6' },
            { name: 'Resolved', value: 92, color: '#22c55e' }
        ],
        statusDistribution: [
            { name: 'Resolved', value: 59, color: '#22c55e' },
            { name: 'In Progress', value: 26, color: '#8b5cf6' },
            { name: 'Pending', value: 15, color: '#f97316' }
        ],
        monthlyTrend: [
            { month: 'Jan', issues: 45 },
            { month: 'Feb', issues: 52 },
            { month: 'Mar', issues: 48 },
            { month: 'Apr', issues: 61 },
            { month: 'May', issues: 75 },
            { month: 'Jun', issues: 82 },
            { month: 'Jul', issues: 95 },
            { month: 'Aug', issues: 118 },
            { month: 'Sep', issues: 134 },
            { month: 'Oct', issues: 156 }
        ],
        usersVolunteers: [
            { category: 'Total Users', count: 1247 },
            { category: 'Volunteers', count: 189 },
            { category: 'Active Today', count: 342 },
            { category: 'New This Month', count: 67 }
        ],
        systemMetrics: {
            resolutionRate: 89,
            avgResponseTime: '2.3h',
            pendingReviews: 5
        }
    }), []);

    // Fetch report data from API
    const fetchReportData = useCallback(async () => {
        setLoading(true);
        try {
            // FIX: Ensure API URL logic handles the dateRange query parameter
            const response = await fetch(
                `http://localhost:3000/api/v1/admin/reports?range=${dateRange}`,
                {
                    // CRITICAL: Include credentials (cookies) for authenticated requests
                    credentials: 'include' 
                }
            );

            if (response.ok) {
                const result = await response.json();
                setReportData(result.data); 
            } else {
                console.error('Failed to fetch reports with status:', response.status);
                setReportData(getMockReportData());
            }
        } catch (error) {
            console.error('Error fetching report data:', error);
            setReportData(getMockReportData());
        } finally {
            setLoading(false);
        }
    }, [dateRange, getMockReportData]);

    useEffect(() => {
        // This effect runs whenever fetchReportData changes (i.e., when dateRange state changes)
        fetchReportData();
    }, [fetchReportData]);

    const handleLogout = () => {
        if (window.confirm('Are you sure you want to logout?')) {
            signOut();
            navigate('/');
        }
    };

    const getUserInitials = (name) => {
        if (!name) return 'MJ';
        return name.split(' ').map(part => part[0]).join('').toUpperCase();
    };

    // Export functions
    const handleExportPDF = () => {
        window.print();
    };

    const handleExportCSV = () => {
        if (!reportData) return;

        let csvContent = "data:text/csv;charset=utf-8,";
        csvContent += "Report Type,Category,Value\n";

        reportData.issuesOverview.forEach(item => {
            csvContent += `Issues Overview,${item.name},${item.value}\n`;
        });

        reportData.statusDistribution.forEach(item => {
            csvContent += `Status Distribution,${item.name},${item.value}%\n`;
        });

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `clean_street_report_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleExportExcel = () => {
        if (!reportData) return;

        // Create workbook
        const workbook = XLSX.utils.book_new();

        // Issues Overview Sheet
        const issuesData = reportData.issuesOverview.map(item => ({
            'Category': item.name,
            'Count': item.value
        }));
        const issuesSheet = XLSX.utils.json_to_sheet(issuesData);
        XLSX.utils.book_append_sheet(workbook, issuesSheet, 'Issues Overview');

        // Status Distribution Sheet
        const statusData = reportData.statusDistribution.map(item => ({
            'Status': item.name,
            'Percentage': `${item.value}%`
        }));
        const statusSheet = XLSX.utils.json_to_sheet(statusData);
        XLSX.utils.book_append_sheet(workbook, statusSheet, 'Status Distribution');

        // Monthly Trend Sheet
        const trendSheet = XLSX.utils.json_to_sheet(reportData.monthlyTrend);
        XLSX.utils.book_append_sheet(workbook, trendSheet, 'Monthly Trend');

        // Users & Volunteers Sheet
        const usersSheet = reportData.usersVolunteers.map(item => ({
            'Category': item.category,
            'Count': item.count
        }));
        XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(usersSheet), 'Users & Volunteers');

        // System Metrics Sheet
        const metricsData = [
            { 'Metric': 'Resolution Rate', 'Value': `${reportData.systemMetrics.resolutionRate}%` },
            { 'Metric': 'Average Response Time', 'Value': reportData.systemMetrics.avgResponseTime },
            { 'Metric': 'Pending Reviews', 'Value': reportData.systemMetrics.pendingReviews }
        ];
        const metricsSheet = XLSX.utils.json_to_sheet(metricsData);
        XLSX.utils.book_append_sheet(workbook, metricsSheet, 'System Metrics');

        // Generate filename with current date
        const filename = `Clean_Street_Report_${new Date().toISOString().split('T')[0]}.xlsx`;

        // Save file
        XLSX.writeFile(workbook, filename);
        
        // Show success message
        alert('Excel report downloaded successfully!');
    };

    if (!user || user.role !== 'admin') {
        return null;
    }

    const data = reportData || getMockReportData();

    // Dashboard stats (using real data if available)
    const stats = [
        {
            label: 'Total Issues',
            value: data.issuesOverview.find(i => i.name === 'Total Issues')?.value || '156',
            icon: AlertCircle,
            color: '#3b82f6',
            bgColor: '#dbeafe'
        },
        {
            label: 'Pending Review',
            value: data.issuesOverview.find(i => i.name === 'Pending')?.value || '23',
            icon: Clock,
            color: '#f97316',
            bgColor: '#ffedd5'
        },
        {
            label: 'Resolved',
            value: data.issuesOverview.find(i => i.name === 'Resolved')?.value || '92',
            icon: CheckCircle,
            color: '#22c55e',
            bgColor: '#dcfce7'
        },
        {
            label: 'Active Users',
            value: data.usersVolunteers.find(i => i.category === 'Total Users')?.count || '1247',
            icon: Users,
            color: '#a855f7',
            bgColor: '#f3e8ff'
        }
    ];

    // System overview metrics
    const systemMetrics = [
        {
            label: 'Resolution Rate',
            value: data.systemMetrics?.resolutionRate ? `${data.systemMetrics.resolutionRate}%` : '89%',
            icon: TrendingUp,
            iconColor: '#22c55e'
        },
        {
            label: 'Avg Response',
            value: data.systemMetrics?.avgResponseTime || '2.3h',
            icon: Timer,
            iconColor: '#3b82f6'
        },
        {
            label: 'Satisfaction',
            value: '4.7/5',
            icon: ThumbsUp,
            iconColor: '#f59e0b'
        }
    ];

    // Administrative tools
    const adminTools = [
        {
            title: 'All Issues',
            description: 'Manage system-wide issues',
            icon: AlertCircle,
            bgColor: '#dbeafe',
            iconColor: '#3b82f6',
            route: '/admin-all-issues'
        },
        {
            title: 'Users & Volunteers',
            description: 'Manage user accounts',
            icon: Users,
            bgColor: '#dcfce7',
            iconColor: '#22c55e',
            route: '/admin-users-volunteers'
        },
        {
            title: 'Admin Requests',
            description: 'Review access requests',
            icon: FileText,
            bgColor: '#f3e8ff',
            iconColor: '#a855f7',
            route: '/admin-requests'
        },
        {
            title: 'Issue Updates',
            description: 'Approve status changes',
            icon: Clock,
            bgColor: '#ffedd5',
            iconColor: '#f97316',
            route: '/admin-issues-updates'
        }
    ];

    return (
        <div className="admin-dashboard">
            {/* Header */}
            <AdminHeader />

            {/* Hero Section */}
            <div className="admin-hero">
                <div className="admin-hero-content">
                    <h1>Welcome back, {user?.fullName || user?.name || user?.username || 'Admin'}!</h1>
                    <p>Comprehensive system performance metrics</p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="admin-stats-grid">
                {stats.map((stat, idx) => {
                    const Icon = stat.icon;
                    return (
                        <div key={idx} className="admin-stat-card" style={{ backgroundColor: stat.color }}>
                            <div className="admin-stat-content">
                                <div className="admin-stat-info">
                                    {/* These elements now inherit the white text color from the card background */}
                                    <div className="admin-stat-label">{stat.label}</div>
                                    <div className="admin-stat-value">{stat.value}</div>
                                </div>
                                <div className="admin-stat-icon" style={{ backgroundColor: stat.bgColor }}>
                                    <Icon size={32} color={stat.color} />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Report Controls */}
            <div className="report-controls">
                <div className="report-filters">
                    <Calendar size={20} color="#2c5292" />
                    <select
                        value={dateRange}
                        onChange={(e) => setDateRange(e.target.value)}
                        className="date-range-select"
                    >
                        <option value="all">All Time</option>
                        <option value="today">Today</option>
                        <option value="week">This Week</option>
                        <option value="month">This Month</option>
                        <option value="quarter">This Quarter</option>
                        <option value="year">This Year</option>
                    </select>
                </div>

                <div className="report-actions">
                    <button onClick={handleExportPDF} className="report-btn">
                        <Printer size={18} />
                        <span>Print</span>
                    </button>
                    <button onClick={handleExportCSV} className="report-btn">
                        <Download size={18} />
                        <span>CSV</span>
                    </button>
                    <button onClick={handleExportExcel} className="report-btn">
                        <Download size={18} />
                        <span>Excel</span>
                    </button>
                </div>
            </div>

            {/* Charts Section */}
            <div className="reports-section">
                <h2 className="reports-title">
                    <BarChart3 size={24} color="#2c5292" />
                    Analytics & Reports
                </h2>

                {loading ? (
                    <div className="loading-reports">Loading reports...</div>
                ) : (
                    <div className="charts-grid">
                        {/* Issues Overview - Bar Chart */}
                        <div className="chart-card">
                            <div className="chart-header">
                                <BarChart3 size={20} color="#3b82f6" />
                                <h3>Issues Overview</h3>
                            </div>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={data.issuesOverview}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                    <XAxis dataKey="name" stroke="#6b7280" />
                                    <YAxis stroke="#6b7280" />
                                    <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0' }} />
                                    <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                                        {data.issuesOverview.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Issue Status Distribution - Pie Chart */}
                        <div className="chart-card">
                            <div className="chart-header">
                                <PieChartIcon size={20} color="#f97316" />
                                <h3>Issue Status Distribution</h3>
                            </div>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={data.statusDistribution}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, value }) => `${name}: ${value}%`}
                                        outerRadius={100} 
                                        dataKey="value"
                                    >
                                        {data.statusDistribution.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0' }} />
                                    <Legend layout="vertical" align="right" verticalAlign="middle" wrapperStyle={{ paddingLeft: '20px' }} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Monthly Trend - Line Chart */}
                        <div className="chart-card chart-card-wide">
                            <div className="chart-header">
                                <TrendingUp size={20} color="#a855f7" />
                                <h3>Monthly Trend</h3>
                            </div>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={data.monthlyTrend}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                    <XAxis dataKey="month" stroke="#6b7280" />
                                    <YAxis stroke="#6b7280" />
                                    <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0' }} />
                                    <Legend />
                                    <Line
                                        type="monotone"
                                        dataKey="issues"
                                        stroke="#3b82f6"
                                        strokeWidth={3}
                                        dot={{ fill: '#2c5292', r: 4 }}
                                        activeDot={{ r: 6 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Users & Volunteers - Bar Chart */}
                        <div className="chart-card chart-card-wide">
                            <div className="chart-header">
                                <Users size={20} color="#22c55e" />
                                <h3>Users & Volunteers</h3>
                            </div>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={data.usersVolunteers}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                    <XAxis dataKey="category" stroke="#6b7280" />
                                    <YAxis stroke="#6b7280" />
                                    <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0' }} />
                                    <Bar dataKey="count" fill="#a855f7" radius={[8, 8, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                )}
            </div>

            
            
            <AdminFooter />
        </div>
    );
};

export default AdminDashboard;
