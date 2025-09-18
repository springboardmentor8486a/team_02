import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import { Textarea } from './ui/textarea';
import { Switch } from './ui/switch';
import { Separator } from './ui/separator';
import { Alert, AlertDescription } from './ui/alert';
import { toast } from 'sonner@2.0.3';
import { 
  Users, 
  BarChart3, 
  FileText, 
  Settings, 
  Shield, 
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  AlertCircle,
  User,
  Mail,
  MapPin,
  Calendar,
  Activity,
  Download,
  Filter,
  Search,
  Eye,
  Edit,
  Trash2,
  Plus,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Target,
  PieChart,
  BarChart,
  Users2,
  Building,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  location: string;
  role: 'user' | 'volunteer' | 'admin';
  profilePhoto?: string;
}

interface AdminStats {
  totalUsers: number;
  totalComplaints: number;
  resolvedComplaints: number;
  pendingComplaints: number;
  activeVolunteers: number;
  resolutionRate: number;
  avgResolutionTime: number;
  monthlyGrowth: number;
  totalVotes: number;
  totalComments: number;
  activeToday: number;
}

interface AdminUser {
  id: string;
  name: string;
  email: string;
  location: string;
  role: 'user' | 'volunteer' | 'admin';
  joinedAt: string;
  lastActive: string;
  complaintsCount: number;
  votesCount: number;
  commentsCount: number;
  status: 'active' | 'inactive' | 'suspended';
}

interface Zone {
  id: string;
  name: string;
  description: string;
  coordinatorId?: string;
  coordinatorName?: string;
  issueCount: number;
  resolvedCount: number;
  area: string;
  population: number;
}

interface AdminLog {
  id: string;
  action: string;
  userId: string;
  adminName: string;
  targetUserId?: string;
  targetUserName?: string;
  targetComplaintId?: string;
  details?: string;
  createdAt: string;
}

interface EnhancedAdminPanelProps {
  user: User;
  accessToken: string;
}

export function EnhancedAdminPanel({ user, accessToken }: EnhancedAdminPanelProps) {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [reportType, setReportType] = useState('users');
  const [reportPeriod, setReportPeriod] = useState('month');

  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 1247,
    totalComplaints: 389,
    resolvedComplaints: 267,
    pendingComplaints: 122,
    activeVolunteers: 45,
    resolutionRate: 68.6,
    avgResolutionTime: 4.2,
    monthlyGrowth: 12.5,
    totalVotes: 1256,
    totalComments: 834,
    activeToday: 89
  });

  const [users, setUsers] = useState<AdminUser[]>([
    {
      id: '1',
      name: 'Alice Johnson',
      email: 'alice.johnson@email.com',
      location: 'Downtown District',
      role: 'user',
      joinedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      complaintsCount: 5,
      votesCount: 23,
      commentsCount: 12,
      status: 'active'
    },
    {
      id: '2',
      name: 'Mike Wilson',
      email: 'mike.wilson@email.com',
      location: 'North Side',
      role: 'volunteer',
      joinedAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
      lastActive: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      complaintsCount: 12,
      votesCount: 67,
      commentsCount: 34,
      status: 'active'
    },
    {
      id: '3',
      name: 'Sarah Davis',
      email: 'sarah.davis@email.com',
      location: 'West End',
      role: 'admin',
      joinedAt: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(),
      lastActive: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
      complaintsCount: 8,
      votesCount: 45,
      commentsCount: 28,
      status: 'active'
    }
  ]);

  const [zones, setZones] = useState<Zone[]>([
    {
      id: '1',
      name: 'Downtown District',
      description: 'Central business and commercial area',
      coordinatorId: '2',
      coordinatorName: 'Mike Wilson',
      issueCount: 45,
      resolvedCount: 32,
      area: '5.2 km²',
      population: 15000
    },
    {
      id: '2',
      name: 'North Side Residential',
      description: 'Primarily residential neighborhoods',
      coordinatorId: undefined,
      coordinatorName: undefined,
      issueCount: 23,
      resolvedCount: 18,
      area: '12.8 km²',
      population: 28000
    },
    {
      id: '3',
      name: 'Industrial Zone',
      description: 'Manufacturing and industrial facilities',
      issueCount: 12,
      resolvedCount: 9,
      area: '8.5 km²',
      population: 3500
    }
  ]);

  const [adminLogs, setAdminLogs] = useState<AdminLog[]>([
    {
      id: '1',
      action: 'User role changed from user to volunteer',
      userId: user.id,
      adminName: user.name,
      targetUserId: '2',
      targetUserName: 'Mike Wilson',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
    },
    {
      id: '2',
      action: 'Issue status updated to resolved',
      userId: user.id,
      adminName: user.name,
      targetComplaintId: 'complaint-123',
      details: 'Pothole on Main Street - repair completed',
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
    }
  ]);

  const filteredUsers = users.filter(userData => {
    const matchesSearch = userData.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         userData.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         userData.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || userData.role === filterRole;
    const matchesStatus = filterStatus === 'all' || userData.status === filterStatus;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const generateReport = async () => {
    setLoading(true);
    try {
      // Simulate report generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const reportData = {
        period: reportPeriod,
        type: reportType,
        generated: new Date().toISOString(),
        stats: stats
      };
      
      // In a real app, this would generate and download an actual file
      const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `clean-street-report-${reportType}-${reportPeriod}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast.success('Report generated and downloaded successfully!');
    } catch (error) {
      console.error('Report generation error:', error);
      toast.error('Failed to generate report');
    } finally {
      setLoading(false);
    }
  };

  const handleUserAction = async (userId: string, action: 'role' | 'status' | 'delete', value?: string) => {
    setLoading(true);
    try {
      const targetUser = users.find(u => u.id === userId);
      if (!targetUser) return;

      if (action === 'role' && value) {
        setUsers(prev => prev.map(u => 
          u.id === userId ? { ...u, role: value as 'user' | 'volunteer' | 'admin' } : u
        ));
        
        // Log the action
        const newLog: AdminLog = {
          id: Date.now().toString(),
          action: `User role changed from ${targetUser.role} to ${value}`,
          userId: user.id,
          adminName: user.name,
          targetUserId: userId,
          targetUserName: targetUser.name,
          createdAt: new Date().toISOString()
        };
        setAdminLogs(prev => [newLog, ...prev]);
        
        toast.success(`User role updated to ${value}`);
      } else if (action === 'status') {
        const newStatus = targetUser.status === 'active' ? 'suspended' : 'active';
        setUsers(prev => prev.map(u => 
          u.id === userId ? { ...u, status: newStatus as 'active' | 'inactive' | 'suspended' } : u
        ));
        
        const newLog: AdminLog = {
          id: Date.now().toString(),
          action: `User ${newStatus === 'suspended' ? 'suspended' : 'activated'}`,
          userId: user.id,
          adminName: user.name,
          targetUserId: userId,
          targetUserName: targetUser.name,
          createdAt: new Date().toISOString()
        };
        setAdminLogs(prev => [newLog, ...prev]);
        
        toast.success(`User ${newStatus === 'suspended' ? 'suspended' : 'activated'} successfully`);
      }
    } catch (error) {
      console.error('User action error:', error);
      toast.error('Failed to update user');
    } finally {
      setLoading(false);
    }
  };

  const handleZoneCoordinatorChange = async (zoneId: string, coordinatorId: string) => {
    try {
      const coordinator = users.find(u => u.id === coordinatorId);
      setZones(prev => prev.map(zone => 
        zone.id === zoneId 
          ? { ...zone, coordinatorId, coordinatorName: coordinator?.name }
          : zone
      ));
      toast.success('Zone coordinator updated successfully');
    } catch (error) {
      console.error('Coordinator update error:', error);
      toast.error('Failed to update zone coordinator');
    }
  };

  return (
    <div className="space-y-6">
      {/* Enhanced Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Enhanced Admin Panel</h1>
          <p className="text-gray-600">Comprehensive platform management and analytics</p>
        </div>
        <div className="flex items-center space-x-3">
          <Select value={reportType} onValueChange={setReportType}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="users">Users</SelectItem>
              <SelectItem value="issues">Issues</SelectItem>
              <SelectItem value="analytics">Analytics</SelectItem>
            </SelectContent>
          </Select>
          <Select value={reportPeriod} onValueChange={setReportPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Button 
            onClick={generateReport}
            disabled={loading}
            className="bg-primary hover:bg-primary/90"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            ) : (
              <Download className="w-4 h-4 mr-2" />
            )}
            Generate Report
          </Button>
        </div>
      </div>

      {/* Enhanced Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        <Card className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-primary">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{stats.totalUsers.toLocaleString()}</div>
            <div className="flex items-center text-xs text-green-600 mt-1">
              <TrendingUp className="w-3 h-3 mr-1" />
              +{stats.monthlyGrowth}% this month
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Issues</CardTitle>
            <FileText className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.totalComplaints}</div>
            <div className="text-xs text-muted-foreground mt-1">
              {stats.pendingComplaints} pending
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolution Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.resolutionRate}%</div>
            <div className="text-xs text-muted-foreground mt-1">
              {stats.resolvedComplaints} resolved
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-orange-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Resolution</CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.avgResolutionTime} days</div>
            <div className="text-xs text-muted-foreground mt-1">
              {stats.activeVolunteers} volunteers
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Community Engagement</CardTitle>
            <MessageSquare className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats.totalVotes + stats.totalComments}</div>
            <div className="text-xs text-muted-foreground mt-1">
              {stats.totalVotes} votes, {stats.totalComments} comments
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-indigo-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Today</CardTitle>
            <Activity className="h-4 w-4 text-indigo-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-indigo-600">{stats.activeToday}</div>
            <div className="text-xs text-muted-foreground mt-1">
              users online now
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 bg-white shadow-sm border border-gray-200">
          <TabsTrigger value="overview" className="data-[state=active]:bg-primary data-[state=active]:text-white flex items-center justify-center space-x-1 sm:space-x-2 text-xs sm:text-sm">
            <BarChart3 className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Overview</span>
          </TabsTrigger>
          <TabsTrigger value="users" className="data-[state=active]:bg-primary data-[state=active]:text-white flex items-center justify-center space-x-1 sm:space-x-2 text-xs sm:text-sm">
            <Users className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Users</span>
          </TabsTrigger>
          <TabsTrigger value="zones" className="data-[state=active]:bg-primary data-[state=active]:text-white flex items-center justify-center space-x-1 sm:space-x-2 text-xs sm:text-sm">
            <Building className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Zones</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="data-[state=active]:bg-primary data-[state=active]:text-white flex items-center justify-center space-x-1 sm:space-x-2 text-xs sm:text-sm">
            <PieChart className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Analytics</span>
          </TabsTrigger>
          <TabsTrigger value="logs" className="data-[state=active]:bg-primary data-[state=active]:text-white flex items-center justify-center space-x-1 sm:space-x-2 text-xs sm:text-sm">
            <Shield className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Logs</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="data-[state=active]:bg-primary data-[state=active]:text-white flex items-center justify-center space-x-1 sm:space-x-2 text-xs sm:text-sm">
            <Settings className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Settings</span>
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="w-5 h-5 text-primary" />
                  <span>Performance Metrics</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Issue Resolution Rate</span>
                    <span className="font-medium">{stats.resolutionRate}%</span>
                  </div>
                  <Progress value={stats.resolutionRate} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>User Engagement Rate</span>
                    <span className="font-medium">78%</span>
                  </div>
                  <Progress value={78} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Volunteer Participation</span>
                    <span className="font-medium">85%</span>
                  </div>
                  <Progress value={85} className="h-2" />
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Community Satisfaction</span>
                    <span className="font-medium">92%</span>
                  </div>
                  <Progress value={92} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5 text-orange-500" />
                  <span>Priority Alerts</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      8 high-priority issues require immediate attention
                    </AlertDescription>
                  </Alert>
                  
                  <Alert>
                    <Users className="h-4 w-4" />
                    <AlertDescription>
                      3 zones are without assigned coordinators
                    </AlertDescription>
                  </Alert>
                  
                  <Alert>
                    <Clock className="h-4 w-4" />
                    <AlertDescription>
                      Average resolution time increased by 15% this week
                    </AlertDescription>
                  </Alert>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Enhanced Users Tab */}
        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Enhanced User Management</CardTitle>
              <CardDescription>Comprehensive user administration with advanced analytics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col lg:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="Search users by name, email, or location..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <Select value={filterRole} onValueChange={setFilterRole}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="user">Citizens</SelectItem>
                    <SelectItem value="volunteer">Volunteers</SelectItem>
                    <SelectItem value="admin">Admins</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                {filteredUsers.map((userData) => (
                  <Card key={userData.id} className="hover:shadow-md transition-all duration-200">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                            <span className="text-white font-medium">
                              {userData.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="font-medium text-gray-900">{userData.name}</h3>
                              <Badge className={`${userData.role === 'admin' ? 'bg-purple-100 text-purple-800' : userData.role === 'volunteer' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'} text-xs`}>
                                {userData.role}
                              </Badge>
                              <Badge className={`${userData.status === 'active' ? 'bg-green-100 text-green-800' : userData.status === 'suspended' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'} text-xs`}>
                                {userData.status}
                              </Badge>
                            </div>
                            
                            <div className="grid grid-cols-1 lg:grid-cols-4 gap-2 text-sm text-gray-600">
                              <div className="flex items-center space-x-1">
                                <Mail className="w-3 h-3" />
                                <span className="truncate">{userData.email}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <MapPin className="w-3 h-3" />
                                <span>{userData.location}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <FileText className="w-3 h-3" />
                                <span>{userData.complaintsCount} reports</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <MessageSquare className="w-3 h-3" />
                                <span>{userData.votesCount} votes, {userData.commentsCount} comments</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Select 
                            value={userData.role} 
                            onValueChange={(value) => handleUserAction(userData.id, 'role', value)}
                          >
                            <SelectTrigger className="w-32 h-8 text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="user">Citizen</SelectItem>
                              <SelectItem value="volunteer">Volunteer</SelectItem>
                              <SelectItem value="admin">Admin</SelectItem>
                            </SelectContent>
                          </Select>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleUserAction(userData.id, 'status')}
                            disabled={loading}
                            className={`${userData.status === 'active' ? 'hover:bg-red-50 hover:text-red-600' : 'hover:bg-green-50 hover:text-green-600'} transition-all duration-200`}
                          >
                            {userData.status === 'active' ? 'Suspend' : 'Activate'}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Zone Management Tab */}
        <TabsContent value="zones" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Building className="w-5 h-5 text-primary" />
                <span>Zone Management</span>
              </CardTitle>
              <CardDescription>Manage geographical zones and assign coordinators</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                {zones.map((zone) => (
                  <Card key={zone.id} className="hover:shadow-md transition-all duration-200">
                    <CardHeader>
                      <CardTitle className="text-lg">{zone.name}</CardTitle>
                      <CardDescription>{zone.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Area:</span>
                          <div className="font-medium">{zone.area}</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Population:</span>
                          <div className="font-medium">{zone.population.toLocaleString()}</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Total Issues:</span>
                          <div className="font-medium">{zone.issueCount}</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Resolved:</span>
                          <div className="font-medium text-green-600">{zone.resolvedCount}</div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Resolution Rate</span>
                          <span className="font-medium">{Math.round((zone.resolvedCount / zone.issueCount) * 100)}%</span>
                        </div>
                        <Progress value={(zone.resolvedCount / zone.issueCount) * 100} className="h-2" />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Zone Coordinator</label>
                        <Select 
                          value={zone.coordinatorId || ''} 
                          onValueChange={(value) => handleZoneCoordinatorChange(zone.id, value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select coordinator..." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">Unassigned</SelectItem>
                            {users.filter(u => u.role === 'volunteer' || u.role === 'admin').map(volunteer => (
                              <SelectItem key={volunteer.id} value={volunteer.id}>
                                {volunteer.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Admin Logs Tab */}
        <TabsContent value="logs" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-primary" />
                <span>Admin Activity Logs</span>
              </CardTitle>
              <CardDescription>Track all administrative actions and system changes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {adminLogs.map((log) => (
                  <div key={log.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{log.action}</p>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                          <span>Admin: {log.adminName}</span>
                          {log.targetUserName && <span>Target: {log.targetUserName}</span>}
                          <span>{new Date(log.createdAt).toLocaleString()}</span>
                        </div>
                        {log.details && (
                          <p className="text-sm text-gray-600 mt-1">{log.details}</p>
                        )}
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {new Date(log.createdAt).toLocaleDateString()}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Enhanced Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Platform Configuration</CardTitle>
                <CardDescription>System-wide settings and preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="font-medium">Auto-assign Issues</label>
                    <p className="text-sm text-gray-600">Automatically assign new issues to volunteers</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <label className="font-medium">Email Notifications</label>
                    <p className="text-sm text-gray-600">Send email updates to users</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <label className="font-medium">Public Analytics</label>
                    <p className="text-sm text-gray-600">Allow public access to platform statistics</p>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Communication Settings</CardTitle>
                <CardDescription>Configure how the platform communicates</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="font-medium">Default Issue Assignment</label>
                  <Select defaultValue="auto">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="auto">Auto-assign by location</SelectItem>
                      <SelectItem value="manual">Manual assignment only</SelectItem>
                      <SelectItem value="volunteer">Volunteer self-assignment</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="font-medium">Notification Frequency</label>
                  <Select defaultValue="daily">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="instant">Instant</SelectItem>
                      <SelectItem value="daily">Daily digest</SelectItem>
                      <SelectItem value="weekly">Weekly summary</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}