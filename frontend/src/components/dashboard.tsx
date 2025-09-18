import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { 
  BarChart3, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  MapPin, 
  Users, 
  FileText,
  Calendar,
  Target,
  Award,
  Eye
} from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  location: string;
  role: 'user' | 'volunteer' | 'admin';
  profilePhoto?: string;
}

interface Complaint {
  id: string;
  userId: string;
  title: string;
  description: string;
  photo?: string;
  locationCoords: { lat: number; lng: number };
  address: string;
  assignedTo?: string;
  status: 'received' | 'in_review' | 'resolved';
  createdAt: string;
  updatedAt: string;
  votes: number;
}

interface DashboardProps {
  user: User;
  accessToken: string;
  complaints: Complaint[];
  onComplaintSelect: (complaint: Complaint) => void;
  onRefresh: () => void;
}

export function Dashboard({ user, accessToken, complaints, onComplaintSelect, onRefresh }: DashboardProps) {
  const [stats, setStats] = useState({
    totalIssues: 0,
    resolvedIssues: 0,
    pendingIssues: 0,
    myIssues: 0,
    myVotes: 0,
    resolutionRate: 0
  });

  useEffect(() => {
    calculateStats();
  }, [complaints, user.id]);

  const calculateStats = () => {
    const totalIssues = complaints.length;
    const resolvedIssues = complaints.filter(c => c.status === 'resolved').length;
    const pendingIssues = complaints.filter(c => c.status !== 'resolved').length;
    const myIssues = complaints.filter(c => c.userId === user.id).length;
    const myVotes = complaints.filter(c => c.userId === user.id).reduce((sum, c) => sum + (c.votes || 0), 0);
    const resolutionRate = totalIssues > 0 ? Math.round((resolvedIssues / totalIssues) * 100) : 0;

    setStats({
      totalIssues,
      resolvedIssues,
      pendingIssues,
      myIssues,
      myVotes,
      resolutionRate
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'received':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case 'in_review':
        return <Clock className="w-4 h-4 text-blue-500" />;
      case 'resolved':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'received':
        return 'bg-yellow-100 text-yellow-800';
      case 'in_review':
        return 'bg-blue-100 text-blue-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const recentIssues = complaints
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const myRecentIssues = complaints
    .filter(c => c.userId === user.id)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary to-primary/80 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold mb-2">Welcome back, {user.name}!</h1>
            <p className="text-primary-foreground/90">
              {user.role === 'admin' 
                ? 'Monitor and manage community issues from your dashboard.'
                : user.role === 'volunteer' 
                ? 'Help resolve community issues and make a difference.'
                : 'Track your reports and community progress.'
              }
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm text-primary-foreground/80">Your Location</div>
            <div className="flex items-center space-x-1 text-primary-foreground">
              <MapPin className="w-4 h-4" />
              <span>{user.location}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-primary">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Issues</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{stats.totalIssues}</div>
            <p className="text-xs text-muted-foreground">
              Community-wide reports
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.resolvedIssues}</div>
            <p className="text-xs text-muted-foreground">
              {stats.resolutionRate}% resolution rate
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-yellow-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.pendingIssues}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting resolution
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Reports</CardTitle>
            <Target className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.myIssues}</div>
            <p className="text-xs text-muted-foreground">
              {stats.myVotes} total votes received
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Progress Overview */}
      <Card className="hover:shadow-lg transition-all duration-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="w-5 h-5 text-primary" />
            <span>Community Progress</span>
          </CardTitle>
          <CardDescription>
            Track how well your community is resolving issues
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Resolution Rate</span>
              <span className="font-medium">{stats.resolutionRate}%</span>
            </div>
            <Progress value={stats.resolutionRate} className="h-2" />
          </div>
          
          {user.role !== 'user' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">{complaints.filter(c => c.status === 'received').length}</div>
                <div className="text-sm text-muted-foreground">New Reports</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{complaints.filter(c => c.status === 'in_review').length}</div>
                <div className="text-sm text-muted-foreground">In Review</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{complaints.filter(c => c.status === 'resolved').length}</div>
                <div className="text-sm text-muted-foreground">Completed</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Community Issues */}
        <Card className="hover:shadow-lg transition-all duration-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                <span>Recent Community Issues</span>
              </CardTitle>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onRefresh}
                className="hover:bg-primary hover:text-white transition-all duration-200"
              >
                Refresh
              </Button>
            </div>
            <CardDescription>
              Latest issues reported in your community
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentIssues.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No issues reported yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentIssues.map((complaint) => (
                  <div 
                    key={complaint.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors duration-200"
                    onClick={() => onComplaintSelect(complaint)}
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        {getStatusIcon(complaint.status)}
                        <h4 className="font-medium text-sm line-clamp-1">{complaint.title}</h4>
                      </div>
                      <p className="text-xs text-gray-600 line-clamp-1">{complaint.address}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(complaint.status)}>
                        {complaint.status.replace('_', ' ')}
                      </Badge>
                      <Button variant="ghost" size="sm" className="p-1">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* My Recent Reports */}
        <Card className="hover:shadow-lg transition-all duration-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Award className="w-5 h-5 text-primary" />
              <span>My Recent Reports</span>
            </CardTitle>
            <CardDescription>
              Your latest issue reports and their status
            </CardDescription>
          </CardHeader>
          <CardContent>
            {myRecentIssues.length === 0 ? (
              <div className="text-center py-8">
                <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">You haven't reported any issues yet</p>
                <Button 
                  size="sm" 
                  className="bg-primary hover:bg-primary/90 text-white"
                  onClick={() => {/* Navigate to report tab */}}
                >
                  Report Your First Issue
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {myRecentIssues.map((complaint) => (
                  <div 
                    key={complaint.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors duration-200"
                    onClick={() => onComplaintSelect(complaint)}
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        {getStatusIcon(complaint.status)}
                        <h4 className="font-medium text-sm line-clamp-1">{complaint.title}</h4>
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-600">
                        <span className="line-clamp-1">{complaint.address}</span>
                        <span>{complaint.votes || 0} votes</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(complaint.status)}>
                        {complaint.status.replace('_', ' ')}
                      </Badge>
                      <Button variant="ghost" size="sm" className="p-1">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      {user.role !== 'user' && (
        <Card className="hover:shadow-lg transition-all duration-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-primary" />
              <span>Quick Actions</span>
            </CardTitle>
            <CardDescription>
              {user.role === 'admin' ? 'Administrative tools and reports' : 'Volunteer actions and assignments'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button 
                variant="outline" 
                className="flex items-center space-x-2 hover:bg-primary hover:text-white transition-all duration-200"
                onClick={() => {/* Navigate to pending issues */}}
              >
                <Clock className="w-4 h-4" />
                <span>View Pending Issues</span>
              </Button>
              
              {user.role === 'admin' && (
                <>
                  <Button 
                    variant="outline" 
                    className="flex items-center space-x-2 hover:bg-primary hover:text-white transition-all duration-200"
                    onClick={() => {/* Navigate to admin panel */}}
                  >
                    <BarChart3 className="w-4 h-4" />
                    <span>View Analytics</span>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="flex items-center space-x-2 hover:bg-primary hover:text-white transition-all duration-200"
                    onClick={() => {/* Navigate to user management */}}
                  >
                    <Users className="w-4 h-4" />
                    <span>Manage Users</span>
                  </Button>
                </>
              )}
              
              {user.role === 'volunteer' && (
                <>
                  <Button 
                    variant="outline" 
                    className="flex items-center space-x-2 hover:bg-primary hover:text-white transition-all duration-200"
                    onClick={() => {/* Navigate to assigned issues */}}
                  >
                    <Target className="w-4 h-4" />
                    <span>My Assignments</span>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="flex items-center space-x-2 hover:bg-primary hover:text-white transition-all duration-200"
                    onClick={() => {/* Navigate to volunteer resources */}}
                  >
                    <Award className="w-4 h-4" />
                    <span>Volunteer Hub</span>
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}