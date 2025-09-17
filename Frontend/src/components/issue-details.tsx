import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { VotingCommentSystem } from './voting-comment-system';
import { toast } from 'sonner@2.0.3';
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  User, 
  MessageSquare, 
  ThumbsUp, 
  ThumbsDown, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Send,
  Eye,
  Users,
  FileText
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

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
  upvotes: number;
  downvotes: number;
  commentCount: number;
}

interface Comment {
  id: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: string;
  userRole: string;
}

interface IssueDetailsProps {
  complaint: Complaint;
  user: User;
  accessToken: string;
  onBack: () => void;
  onUpdate: () => void;
}

export function IssueDetails({ complaint, user, accessToken, onBack, onUpdate }: IssueDetailsProps) {
  const [loading, setLoading] = useState(false);
  const [comments, setComments] = useState<Comment[]>([
    {
      id: '1',
      userId: 'demo-user-1',
      userName: 'Alice Johnson',
      content: 'I\'ve noticed this issue too. It\'s been getting worse over the past few weeks.',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      userRole: 'user'
    },
    {
      id: '2',
      userId: 'demo-volunteer-1',
      userName: 'Mike Wilson',
      content: 'I can help coordinate with the local authorities to get this resolved quickly.',
      createdAt: new Date(Date.now() - 43200000).toISOString(),
      userRole: 'volunteer'
    }
  ]);
  const [newComment, setNewComment] = useState('');
  const [userVote, setUserVote] = useState<'up' | 'down' | null>(null);
  const [newStatus, setNewStatus] = useState(complaint.status);
  const [assignedVolunteer, setAssignedVolunteer] = useState(complaint.assignedTo || '');

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'received':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'in_review':
        return <Clock className="w-5 h-5 text-blue-500" />;
      case 'resolved':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      default:
        return <AlertCircle className="w-5 h-5" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'received':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'in_review':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'resolved':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityFromStatus = (status: string) => {
    // This is a demo function - in real app, priority would be stored separately
    switch (status) {
      case 'resolved':
        return 'low';
      case 'in_review':
        return 'medium';
      default:
        return 'high';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'urgent':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleVote = async (voteType: 'up' | 'down') => {
    try {
      setLoading(true);
      
      // Demo implementation - in real app, this would make an API call
      setUserVote(userVote === voteType ? null : voteType);
      toast.success(`Vote ${voteType === 'up' ? 'added' : 'recorded'} successfully!`);
      
    } catch (error) {
      console.error('Vote error:', error);
      toast.error('Failed to record vote');
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      setLoading(true);
      
      const comment: Comment = {
        id: Date.now().toString(),
        userId: user.id,
        userName: user.name,
        content: newComment.trim(),
        createdAt: new Date().toISOString(),
        userRole: user.role
      };
      
      setComments(prev => [...prev, comment]);
      setNewComment('');
      toast.success('Comment added successfully!');
      
    } catch (error) {
      console.error('Comment error:', error);
      toast.error('Failed to add comment');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    if (newStatus === complaint.status) return;

    try {
      setLoading(true);
      
      // Demo implementation - in real app, this would make an API call
      toast.success(`Status updated to ${newStatus.replace('_', ' ')}`);
      onUpdate();
      
    } catch (error) {
      console.error('Status update error:', error);
      toast.error('Failed to update status');
    } finally {
      setLoading(false);
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Users className="w-4 h-4 text-purple-600" />;
      case 'volunteer':
        return <Users className="w-4 h-4 text-blue-600" />;
      default:
        return <User className="w-4 h-4 text-gray-600" />;
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-800';
      case 'volunteer':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <Button
              variant="outline"
              onClick={onBack}
              className="flex items-center space-x-2 hover:bg-primary hover:text-white hover:border-primary transition-all duration-200"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Issues</span>
            </Button>
            
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-sm">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <span className="font-semibold text-gray-900">Issue Details</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Issue Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Issue Info Card */}
            <Card className="shadow-lg">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-2">{complaint.title}</CardTitle>
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(complaint.status)}
                        <Badge className={`${getStatusColor(complaint.status)} border`}>
                          {complaint.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      <Badge className={getPriorityColor(getPriorityFromStatus(complaint.status))}>
                        {getPriorityFromStatus(complaint.status)} priority
                      </Badge>
                    </div>
                  </div>

                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                  <p className="text-gray-700 leading-relaxed">{complaint.description}</p>
                </div>

                {complaint.photo && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Photo Evidence</h4>
                    <div className="rounded-lg overflow-hidden shadow-md">
                      <ImageWithFallback
                        src={complaint.photo}
                        alt="Issue photo"
                        className="w-full h-64 object-cover"
                      />
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{complaint.address}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>Reported {new Date(complaint.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Eye className="w-4 h-4" />
                    <span>{complaint.votes + 15} views</span>
                  </div>
                  {complaint.assignedTo && (
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Users className="w-4 h-4" />
                      <span>Assigned to {complaint.assignedTo}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Voting and Comments System */}
            <VotingCommentSystem
              complaint={complaint}
              user={user}
              accessToken={accessToken}
              onUpdate={onUpdate}
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status Management (Admin/Volunteer only) */}
            {(user.role === 'admin' || user.role === 'volunteer') && (
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg">Manage Issue</CardTitle>
                  <CardDescription>
                    Update status and assignment details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Status</label>
                    <Select value={newStatus} onValueChange={setNewStatus}>
                      <SelectTrigger className="border-gray-300 focus:border-primary">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="received">
                          <div className="flex items-center space-x-2">
                            <AlertCircle className="w-4 h-4 text-yellow-500" />
                            <span>Received</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="in_review">
                          <div className="flex items-center space-x-2">
                            <Clock className="w-4 h-4 text-blue-500" />
                            <span>In Review</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="resolved">
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span>Resolved</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {user.role === 'admin' && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Assign to Volunteer</label>
                      <Select value={assignedVolunteer} onValueChange={setAssignedVolunteer}>
                        <SelectTrigger className="border-gray-300 focus:border-primary">
                          <SelectValue placeholder="Select volunteer..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">Unassigned</SelectItem>
                          <SelectItem value="john-doe">John Doe</SelectItem>
                          <SelectItem value="jane-smith">Jane Smith</SelectItem>
                          <SelectItem value="mike-wilson">Mike Wilson</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <Button
                    onClick={handleStatusUpdate}
                    disabled={loading || (newStatus === complaint.status && assignedVolunteer === complaint.assignedTo)}
                    className="w-full bg-primary hover:bg-primary/90"
                  >
                    {loading ? 'Updating...' : 'Update Issue'}
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Issue Stats */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Issue Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{complaint.votes || 0}</div>
                    <div className="text-sm text-gray-600">Net Votes</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{complaint.commentCount || 0}</div>
                    <div className="text-sm text-gray-600">Comments</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{complaint.votes + 15}</div>
                    <div className="text-sm text-gray-600">Views</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">
                      {Math.floor((Date.now() - new Date(complaint.createdAt).getTime()) / (1000 * 60 * 60 * 24))}
                    </div>
                    <div className="text-sm text-gray-600">Days Old</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Location Info */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Location Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm">
                  <div className="font-medium text-gray-700 mb-1">Address</div>
                  <p className="text-gray-600">{complaint.address}</p>
                </div>
                <div className="text-sm">
                  <div className="font-medium text-gray-700 mb-1">Coordinates</div>
                  <p className="text-gray-600 font-mono text-xs">
                    {complaint.locationCoords.lat.toFixed(6)}, {complaint.locationCoords.lng.toFixed(6)}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full hover:bg-primary hover:text-white hover:border-primary transition-all duration-200"
                  onClick={() => {
                    const url = `https://www.google.com/maps?q=${complaint.locationCoords.lat},${complaint.locationCoords.lng}`;
                    window.open(url, '_blank');
                  }}
                >
                  <MapPin className="w-4 h-4 mr-2" />
                  View on Map
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}