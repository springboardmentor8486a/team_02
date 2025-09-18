import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { toast } from 'sonner@2.0.3';
import { 
  ThumbsUp, 
  ThumbsDown, 
  MessageCircle, 
  Send,
  User,
  Heart,
  MessageSquare
} from 'lucide-react';

interface Vote {
  id: string;
  userId: string;
  complaintId: string;
  voteType: 'upvote' | 'downvote';
  createdAt: string;
}

interface Comment {
  id: string;
  userId: string;
  complaintId: string;
  content: string;
  createdAt: string;
  user?: {
    name: string;
    profilePhoto?: string;
  };
}

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

interface VotingCommentSystemProps {
  complaint: Complaint;
  user: User;
  accessToken: string;
  onUpdate: () => void;
}

export function VotingCommentSystem({ complaint, user, accessToken, onUpdate }: VotingCommentSystemProps) {
  const [userVote, setUserVote] = useState<Vote | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loadingVote, setLoadingVote] = useState(false);
  const [loadingComment, setLoadingComment] = useState(false);
  const [loadingComments, setLoadingComments] = useState(true);

  useEffect(() => {
    fetchUserVote();
    fetchComments();
  }, [complaint.id]);

  const fetchUserVote = async () => {
    try {
      // In a real app, this would fetch from the database
      // For demo purposes, we'll use localStorage
      const storedVotes = JSON.parse(localStorage.getItem('userVotes') || '[]');
      const vote = storedVotes.find((v: Vote) => 
        v.userId === user.id && v.complaintId === complaint.id
      );
      setUserVote(vote || null);
    } catch (error) {
      console.error('Failed to fetch user vote:', error);
    }
  };

  const fetchComments = async () => {
    try {
      setLoadingComments(true);
      // In a real app, this would fetch from the database
      // For demo purposes, we'll use localStorage
      const storedComments = JSON.parse(localStorage.getItem('comments') || '[]');
      const complaintComments = storedComments
        .filter((c: Comment) => c.complaintId === complaint.id)
        .sort((a: Comment, b: Comment) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      
      setComments(complaintComments);
    } catch (error) {
      console.error('Failed to fetch comments:', error);
      setComments([]);
    } finally {
      setLoadingComments(false);
    }
  };

  const handleVote = async (voteType: 'upvote' | 'downvote') => {
    if (loadingVote) return;
    
    setLoadingVote(true);
    try {
      const storedVotes = JSON.parse(localStorage.getItem('userVotes') || '[]');
      
      // Remove existing vote if any
      const filteredVotes = storedVotes.filter((v: Vote) => 
        !(v.userId === user.id && v.complaintId === complaint.id)
      );
      
      let newVote: Vote | null = null;
      
      // Add new vote if different from current or if no current vote
      if (!userVote || userVote.voteType !== voteType) {
        newVote = {
          id: Date.now().toString(),
          userId: user.id,
          complaintId: complaint.id,
          voteType,
          createdAt: new Date().toISOString()
        };
        filteredVotes.push(newVote);
      }
      
      localStorage.setItem('userVotes', JSON.stringify(filteredVotes));
      setUserVote(newVote);
      
      // Update complaint vote counts in localStorage
      const storedComplaints = JSON.parse(localStorage.getItem('complaints') || '[]');
      const updatedComplaints = storedComplaints.map((c: Complaint) => {
        if (c.id === complaint.id) {
          const allVotes = JSON.parse(localStorage.getItem('userVotes') || '[]');
          const complaintVotes = allVotes.filter((v: Vote) => v.complaintId === complaint.id);
          const upvotes = complaintVotes.filter((v: Vote) => v.voteType === 'upvote').length;
          const downvotes = complaintVotes.filter((v: Vote) => v.voteType === 'downvote').length;
          
          return {
            ...c,
            upvotes,
            downvotes,
            votes: upvotes - downvotes
          };
        }
        return c;
      });
      localStorage.setItem('complaints', JSON.stringify(updatedComplaints));
      
      onUpdate();
      toast.success(newVote ? `${voteType === 'upvote' ? 'Upvoted' : 'Downvoted'}!` : 'Vote removed');
    } catch (error) {
      console.error('Failed to vote:', error);
      toast.error('Failed to vote');
    } finally {
      setLoadingVote(false);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || loadingComment) return;
    
    setLoadingComment(true);
    try {
      const newCommentObj: Comment = {
        id: Date.now().toString(),
        userId: user.id,
        complaintId: complaint.id,
        content: newComment.trim(),
        createdAt: new Date().toISOString(),
        user: {
          name: user.name,
          profilePhoto: user.profilePhoto
        }
      };
      
      const storedComments = JSON.parse(localStorage.getItem('comments') || '[]');
      storedComments.push(newCommentObj);
      localStorage.setItem('comments', JSON.stringify(storedComments));
      
      // Update complaint comment count
      const storedComplaints = JSON.parse(localStorage.getItem('complaints') || '[]');
      const updatedComplaints = storedComplaints.map((c: Complaint) => {
        if (c.id === complaint.id) {
          return {
            ...c,
            commentCount: storedComments.filter((comment: Comment) => comment.complaintId === complaint.id).length
          };
        }
        return c;
      });
      localStorage.setItem('complaints', JSON.stringify(updatedComplaints));
      
      setComments(prev => [newCommentObj, ...prev]);
      setNewComment('');
      onUpdate();
      toast.success('Comment added successfully!');
    } catch (error) {
      console.error('Failed to add comment:', error);
      toast.error('Failed to add comment');
    } finally {
      setLoadingComment(false);
    }
  };

  const getVoteCount = (type: 'upvote' | 'downvote') => {
    const storedVotes = JSON.parse(localStorage.getItem('userVotes') || '[]');
    return storedVotes.filter((v: Vote) => 
      v.complaintId === complaint.id && v.voteType === type
    ).length;
  };

  const upvoteCount = getVoteCount('upvote');
  const downvoteCount = getVoteCount('downvote');

  return (
    <div className="space-y-6">
      {/* Voting Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Heart className="w-5 h-5 text-primary" />
            <span>Community Voting</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center space-x-8">
            <div className="text-center">
              <Button
                variant={userVote?.voteType === 'upvote' ? 'default' : 'outline'}
                size="lg"
                onClick={() => handleVote('upvote')}
                disabled={loadingVote}
                className={`w-20 h-20 rounded-full ${
                  userVote?.voteType === 'upvote' 
                    ? 'bg-green-500 hover:bg-green-600 text-white' 
                    : 'hover:bg-green-50 hover:border-green-300 hover:text-green-600'
                } transition-all duration-200`}
              >
                <div className="flex flex-col items-center">
                  <ThumbsUp className="w-6 h-6 mb-1" />
                  <span className="text-xs font-medium">{upvoteCount}</span>
                </div>
              </Button>
              <p className="text-sm text-gray-600 mt-2">Helpful</p>
            </div>

            <div className="text-center">
              <div className="text-3xl font-bold text-primary">
                {upvoteCount - downvoteCount}
              </div>
              <p className="text-sm text-gray-600">Net Score</p>
            </div>

            <div className="text-center">
              <Button
                variant={userVote?.voteType === 'downvote' ? 'default' : 'outline'}
                size="lg"
                onClick={() => handleVote('downvote')}
                disabled={loadingVote}
                className={`w-20 h-20 rounded-full ${
                  userVote?.voteType === 'downvote' 
                    ? 'bg-red-500 hover:bg-red-600 text-white' 
                    : 'hover:bg-red-50 hover:border-red-300 hover:text-red-600'
                } transition-all duration-200`}
              >
                <div className="flex flex-col items-center">
                  <ThumbsDown className="w-6 h-6 mb-1" />
                  <span className="text-xs font-medium">{downvoteCount}</span>
                </div>
              </Button>
              <p className="text-sm text-gray-600 mt-2">Not Helpful</p>
            </div>
          </div>

          {userVote && (
            <div className="mt-4 text-center">
              <Badge variant="outline" className="border-primary text-primary">
                You {userVote.voteType === 'upvote' ? 'upvoted' : 'downvoted'} this issue
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Comments Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MessageSquare className="w-5 h-5 text-primary" />
            <span>Community Comments</span>
            <Badge variant="secondary">{comments.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Add Comment */}
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <Avatar className="w-8 h-8">
                <AvatarImage src={user.profilePhoto} />
                <AvatarFallback>
                  <User className="w-4 h-4" />
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-2">
                <Textarea
                  placeholder="Share your thoughts about this issue..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="min-h-[100px] resize-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">
                    {newComment.length}/500 characters
                  </span>
                  <Button
                    onClick={handleAddComment}
                    disabled={!newComment.trim() || loadingComment || newComment.length > 500}
                    className="bg-primary hover:bg-primary/90"
                  >
                    {loadingComment ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    ) : (
                      <Send className="w-4 h-4 mr-2" />
                    )}
                    Post Comment
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Comments List */}
          <div className="space-y-4">
            {loadingComments ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-gray-500">Loading comments...</p>
              </div>
            ) : comments.length === 0 ? (
              <div className="text-center py-8">
                <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No comments yet. Be the first to share your thoughts!</p>
              </div>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={comment.user?.profilePhoto} />
                    <AvatarFallback>
                      <User className="w-4 h-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-900">
                        {comment.user?.name || 'Anonymous User'}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(comment.createdAt).toLocaleDateString()} at{' '}
                        {new Date(comment.createdAt).toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </span>
                    </div>
                    <p className="text-gray-700 leading-relaxed">{comment.content}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}