// AdminDashboard.js
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import * as XLSX from 'xlsx';
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
      const response = await fetch(
        `http://localhost:3000/api/v1/admin/reports?range=${dateRange}`,
        {
          credentials: 'include'
        }
      );

      if (response.ok) {
        const result = await response.json();
        setReportData(result.data); // Access the 'data' property from ApiResponse
      } else {
        console.error('Failed to fetch reports');
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
    const usersSheet = XLSX.utils.json_to_sheet(reportData.usersVolunteers);
    XLSX.utils.book_append_sheet(workbook, usersSheet, 'Users & Volunteers');

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
      value: data.issuesOverview[0]?.value || '156',
      icon: AlertCircle,
      color: '#3b82f6',
      bgColor: '#dbeafe'
    },
    {
      label: 'Pending Review',
      value: data.issuesOverview[1]?.value || '23',
      icon: Clock,
      color: '#f97316',
      bgColor: '#ffedd5'
    },
    {
      label: 'Resolved',
      value: data.issuesOverview[3]?.value || '92',
      icon: CheckCircle,
      color: '#22c55e',
      bgColor: '#dcfce7'
    },
    {
      label: 'Active Users',
      value: data.usersVolunteers[0]?.count || '1247',
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
      <header className="admin-header">
        <div className="admin-header-left">
          <div className="admin-logo">
            <img src="/images/logo.png" alt="Clean Street" className="admin-logo-img" />
            <div className="admin-logo-text">
              <div className="admin-logo-title">Clean Street</div>
              <div className="admin-logo-subtitle">Civic Platform</div>
            </div>
          </div>
          <nav className="admin-nav" col-mod-3 >

            <Link to="/admin-dashboard" className="admin-nav-link active">
              <LayoutDashboard size={18} />
              Dashboard
            </Link>
            <Link to="/admin-all-issues" className="admin-nav-link">
              <AlertCircle size={18} />
              All Issues
            </Link>
            <Link to="/admin-users-volunteers" className="admin-nav-link">
              <Users size={18} />
              Users & Volunteers
            </Link>
            <Link to="/admin-requests" className="admin-nav-link">
              <FileText size={18} />
              Admin Requests
            </Link>
          </nav>
        </div>
        <div className="user-profile">
          <Link to="/admin-profile" className="profile-link">
            <div className="user-initials">{getUserInitials(user.name)}</div>
            <span className="user-name">{user.name}</span>
          </Link>
          <button onClick={handleLogout} className="logout-btn-header">
            <ArrowRight size={20} />
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <div className="admin-hero">
        <div className="admin-hero-content">
          <h1>Welcome back, {user?.name}!</h1>
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
          <Calendar size={20} />
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
          <BarChart3 size={24} />
          Analytics & Reports
        </h2>

        {loading ? (
          <div className="loading-reports">Loading reports...</div>
        ) : (
          <div className="charts-grid">
            {/* Issues Overview - Bar Chart */}
            <div className="chart-card">
              <div className="chart-header">
                <BarChart3 size={20} />
                <h3>Issues Overview</h3>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data.issuesOverview}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
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
                <PieChartIcon size={20} />
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
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {data.statusDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Monthly Trend - Line Chart */}
            <div className="chart-card chart-card-wide">
              <div className="chart-header">
                <TrendingUp size={20} />
                <h3>Monthly Trend</h3>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data.monthlyTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="issues"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={{ fill: '#3b82f6', r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Users & Volunteers - Bar Chart */}
            <div className="chart-card">
              <div className="chart-header">
                <Users size={20} />
                <h3>Users & Volunteers</h3>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data.usersVolunteers}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#a855f7" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>

      {/* System Overview */}
      <div className="admin-system-overview">
        <div className="admin-section-header">
          <Settings size={24} color="#5b6fa8" />
          <h2>System Overview</h2>
        </div>
        <p className="admin-section-description">
          Monitor and manage the entire Clean Street platform. Track community engagement, oversee issue resolution,
          and ensure efficient operations across all departments.
        </p>

        <div className="admin-metrics-grid">
          {systemMetrics.map((metric, idx) => {
            const Icon = metric.icon;
            return (
              <div key={idx} className="admin-metric-card">
                <div className="admin-metric-icon">
                  <Icon size={24} color={metric.iconColor} />
                </div>
                <div className="admin-metric-content">
                  <div className="admin-metric-label">{metric.label}</div>
                  <div className="admin-metric-value">{metric.value}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Admin Profile Image */}
        <div className="admin-profile-section">
          <img
            src="/images/admin-profile.jpg"
            alt="Admin Profile"
            className="admin-profile-img"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        </div>
      </div>

      {/* Administrative Tools */}
      <div className="admin-tools-section">
        <h2 className="admin-tools-title">Administrative Tools</h2>
        <div className="admin-tools-grid">
          {adminTools.map((tool, idx) => {
            const Icon = tool.icon;
            return (
              <div
                key={idx}
                className="admin-tool-card"
                onClick={() => navigate(tool.route)}
              >
                <div className="admin-tool-icon" style={{ backgroundColor: tool.bgColor }}>
                  <Icon size={28} color={tool.iconColor} />
                </div>
                <div className="admin-tool-content">
                  <h3 className="admin-tool-title">{tool.title}</h3>
                  <p className="admin-tool-description">{tool.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;