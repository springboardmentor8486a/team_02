import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
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
  Trash2
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
  status: 'active' | 'inactive';
}

interface AdminPanelProps {
  user: User;
  accessToken: string;
}

export function AdminPanel({ user, accessToken }: AdminPanelProps) {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 1247,
    totalComplaints: 389,
    resolvedComplaints: 267,
    pendingComplaints: 122,
    activeVolunteers: 45,
    resolutionRate: 68.6,
    avgResolutionTime: 4.2,
    monthlyGrowth: 12.5
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
      status: 'active'
    },
    {
      id: '4',
      name: 'John Smith',
      email: 'john.smith@email.com',
      location: 'East Side',
      role: 'user',
      joinedAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
      lastActive: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      complaintsCount: 2,
      status: 'inactive'
    }
  ]);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Shield className="w-4 h-4 text-purple-600" />;
      case 'volunteer':
        return <Users className="w-4 h-4 text-blue-600" />;
      default:
        return <User className="w-4 h-4 text-gray-600" />;
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'volunteer':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleUserRoleChange = async (userId: string, newRole: string) => {
    try {
      setLoading(true);
      
      // Demo implementation - in real app, this would make an API call
      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, role: newRole as 'user' | 'volunteer' | 'admin' } : user
      ));
      
      toast.success('User role updated successfully!');
    } catch (error) {
      console.error('Role update error:', error);
      toast.error('Failed to update user role');
    } finally {
      setLoading(false);
    }
  };

  const handleUserStatusToggle = async (userId: string) => {
    try {
      setLoading(true);
      
      setUsers(prev => prev.map(user => 
        user.id === userId 
          ? { ...user, status: user.status === 'active' ? 'inactive' : 'active' as 'active' | 'inactive' } 
          : user
      ));
      
      toast.success('User status updated successfully!');
    } catch (error) {
      console.error('Status update error:', error);
      toast.error('Failed to update user status');
    } finally {
      setLoading(false);
    }
  };

  const handleExportData = () => {
    // Demo implementation - in real app, this would generate and download actual data
    toast.success('Export initiated! Download will start shortly.');
  };

  const getTimeAgo = (date: string) => {
    const now = new Date();
    const then = new Date(date);
    const diffInMinutes = Math.floor((now.getTime() - then.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minutes ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)} hours ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)} days ago`;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Admin Panel</h1>
          <p className="text-gray-600">Manage users, monitor system performance, and analyze platform data</p>
        </div>
        <Button 
          onClick={handleExportData}
          variant="outline"
          className="hover:bg-primary hover:text-white hover:border-primary transition-all duration-200"
        >
          <Download className="w-4 h-4 mr-2" />
          Export Data
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
              {stats.pendingComplaints} pending resolution
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
              {stats.resolvedComplaints} resolved issues
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
              {stats.activeVolunteers} active volunteers
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-white shadow-sm border border-gray-200">
          <TabsTrigger value="overview" className="data-[state=active]:bg-primary data-[state=active]:text-white">
            <BarChart3 className="w-4 h-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="users" className="data-[state=active]:bg-primary data-[state=active]:text-white">
            <Users className="w-4 h-4 mr-2" />
            Users
          </TabsTrigger>
          <TabsTrigger value="analytics" className="data-[state=active]:bg-primary data-[state=active]:text-white">
            <TrendingUp className="w-4 h-4 mr-2" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="settings" className="data-[state=active]:bg-primary data-[state=active]:text-white">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="hover:shadow-lg transition-all duration-200">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="w-5 h-5 text-primary" />
                  <span>Platform Health</span>
                </CardTitle>
                <CardDescription>System performance and user activity metrics</CardDescription>
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
                    <span>Active User Engagement</span>
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
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-200">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  <span>Recent Activity</span>
                </CardTitle>
                <CardDescription>Latest platform activities and milestones</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <div className="flex-1 text-sm">
                      <div className="font-medium text-green-900">15 issues resolved today</div>
                      <div className="text-green-700">Great progress by the volunteer team</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                    <Users className="w-5 h-5 text-blue-600" />
                    <div className="flex-1 text-sm">
                      <div className="font-medium text-blue-900">23 new users registered</div>
                      <div className="text-blue-700">Community growth continues strong</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-orange-600" />
                    <div className="flex-1 text-sm">
                      <div className="font-medium text-orange-900">8 issues need attention</div>
                      <div className="text-orange-700">High priority issues pending review</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-6">
          {/* User Management Controls */}
          <Card className="hover:shadow-lg transition-all duration-200">
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Search, filter, and manage platform users</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="Search users by name, email, or location..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 border-gray-300 focus:border-primary"
                    />
                  </div>
                </div>
                
                <Select value={filterRole} onValueChange={setFilterRole}>
                  <SelectTrigger className="w-40 border-gray-300 focus:border-primary">
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
                  <SelectTrigger className="w-40 border-gray-300 focus:border-primary">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Users Table */}
              <div className="space-y-3">
                {filteredUsers.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No users found matching your criteria</p>
                  </div>
                ) : (
                  filteredUsers.map((userData) => (
                    <div key={userData.id} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors duration-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="flex-shrink-0">
                            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                              <span className="text-white font-medium">
                                {userData.name.split(' ').map(n => n[0]).join('')}
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-1">
                              <h3 className="font-medium text-gray-900">{userData.name}</h3>
                              <div className="flex items-center space-x-1">
                                {getRoleIcon(userData.role)}
                                <Badge className={`${getRoleBadgeColor(userData.role)} border text-xs`}>
                                  {userData.role}
                                </Badge>
                              </div>
                              <Badge className={`${getStatusBadgeColor(userData.status)} border text-xs`}>
                                {userData.status}
                              </Badge>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-600">
                              <div className="flex items-center space-x-1">
                                <Mail className="w-3 h-3" />
                                <span>{userData.email}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <MapPin className="w-3 h-3" />
                                <span>{userData.location}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <FileText className="w-3 h-3" />
                                <span>{userData.complaintsCount} reports</span>
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                              <span>Joined {new Date(userData.joinedAt).toLocaleDateString()}</span>
                              <span>Last active {getTimeAgo(userData.lastActive)}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Select 
                            value={userData.role} 
                            onValueChange={(value) => handleUserRoleChange(userData.id, value)}
                          >
                            <SelectTrigger className="w-32 h-8 text-xs border-gray-300 focus:border-primary">
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
                            onClick={() => handleUserStatusToggle(userData.id)}
                            disabled={loading}
                            className={`${userData.status === 'active' ? 'hover:bg-red-50 hover:text-red-600 hover:border-red-600' : 'hover:bg-green-50 hover:text-green-600 hover:border-green-600'} transition-all duration-200`}
                          >
                            {userData.status === 'active' ? 'Deactivate' : 'Activate'}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="hover:shadow-lg transition-all duration-200">
              <CardHeader>
                <CardTitle>Platform Growth</CardTitle>
                <CardDescription>User registration and engagement trends</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                    <div>
                      <div className="font-medium text-blue-900">New Users This Month</div>
                      <div className="text-2xl font-bold text-blue-600">156</div>
                    </div>
                    <TrendingUp className="w-8 h-8 text-blue-600" />
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <div>
                      <div className="font-medium text-green-900">Issues Reported</div>
                      <div className="text-2xl font-bold text-green-600">89</div>
                    </div>
                    <FileText className="w-8 h-8 text-green-600" />
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                    <div>
                      <div className="font-medium text-purple-900">Community Engagement</div>
                      <div className="text-2xl font-bold text-purple-600">92%</div>
                    </div>
                    <Activity className="w-8 h-8 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-200">
              <CardHeader>
                <CardTitle>Issue Categories</CardTitle>
                <CardDescription>Most reported issue types</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Potholes</span>
                    <span className="text-sm font-medium">34%</span>
                  </div>
                  <Progress value={34} className="h-2" />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Streetlights</span>
                    <span className="text-sm font-medium">28%</span>
                  </div>
                  <Progress value={28} className="h-2" />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Garbage</span>
                    <span className="text-sm font-medium">19%</span>
                  </div>
                  <Progress value={19} className="h-2" />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Water Leaks</span>
                    <span className="text-sm font-medium">12%</span>
                  </div>
                  <Progress value={12} className="h-2" />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Other</span>
                    <span className="text-sm font-medium">7%</span>
                  </div>
                  <Progress value={7} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <Card className="hover:shadow-lg transition-all duration-200">
            <CardHeader>
              <CardTitle>System Settings</CardTitle>
              <CardDescription>Configure platform behavior and preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Platform Configuration</h4>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">Auto-assign Issues</div>
                        <div className="text-sm text-gray-600">Automatically assign new issues to volunteers</div>
                      </div>
                      <input type="checkbox" defaultChecked className="h-4 w-4 text-primary" />
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">Email Notifications</div>
                        <div className="text-sm text-gray-600">Send email updates for issue status changes</div>
                      </div>
                      <input type="checkbox" defaultChecked className="h-4 w-4 text-primary" />
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">Public Statistics</div>
                        <div className="text-sm text-gray-600">Show platform statistics on public pages</div>
                      </div>
                      <input type="checkbox" defaultChecked className="h-4 w-4 text-primary" />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Moderation Settings</h4>
                  
                  <div className="space-y-3">
                    <div className="p-3 border rounded-lg">
                      <div className="font-medium mb-2">Issue Auto-Resolution</div>
                      <Select defaultValue="30">
                        <SelectTrigger className="border-gray-300 focus:border-primary">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="7">7 days</SelectItem>
                          <SelectItem value="14">14 days</SelectItem>
                          <SelectItem value="30">30 days</SelectItem>
                          <SelectItem value="never">Never</SelectItem>
                        </SelectContent>
                      </Select>
                      <div className="text-sm text-gray-600 mt-1">Auto-close unresolved issues after specified time</div>
                    </div>
                    
                    <div className="p-3 border rounded-lg">
                      <div className="font-medium mb-2">Comment Moderation</div>
                      <Select defaultValue="auto">
                        <SelectTrigger className="border-gray-300 focus:border-primary">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">No moderation</SelectItem>
                          <SelectItem value="auto">Auto-moderate</SelectItem>
                          <SelectItem value="manual">Manual review</SelectItem>
                        </SelectContent>
                      </Select>
                      <div className="text-sm text-gray-600 mt-1">How to handle user comments</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <Button className="bg-primary hover:bg-primary/90">
                  Save Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}