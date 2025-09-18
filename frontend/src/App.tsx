import React, { useState, useEffect, useCallback } from 'react';
import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from './utils/supabase/info';

// Website Components
import { LandingPage } from './components/landing-page';
import { AboutPage } from './components/about-page';
import { ContactPage } from './components/contact-page';
import { HelpPage } from './components/help-page';
import { WebsiteHeader } from './components/website-header';
import { WebsiteFooter } from './components/website-footer';
import { ScrollToTop } from './components/scroll-to-top';

// App Components
import { AuthForm } from './components/auth-form';
import { Dashboard } from './components/dashboard';
import { ReportIssue } from './components/report-issue';
import { IssueDetails } from './components/issue-details';
import { EnhancedAdminPanel } from './components/enhanced-admin-panel';
import { ProfileEdit } from './components/profile-edit';

// UI Components
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner@2.0.3';
import { Button } from './components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { Badge } from './components/ui/badge';
import { 
  MapPin, 
  FileText, 
  Users, 
  BarChart3, 
  LogOut,
  Plus,
  AlertCircle,
  CheckCircle,
  Clock,
  ArrowLeft,
  User,
  Menu,
  X
} from 'lucide-react';

const supabase = createClient(
  `https://${projectId}.supabase.co`,
  publicAnonKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

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

interface AdminLog {
  id: string;
  action: string;
  userId: string;
  targetUserId?: string;
  targetComplaintId?: string;
  details?: string;
  createdAt: string;
}

export default function App() {
  // App State
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [votes, setVotes] = useState<Vote[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  
  // Website State
  const [currentPage, setCurrentPage] = useState('auth'); // 'home', 'about', 'help', 'contact', 'auth', 'app'
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const fetchComplaints = useCallback(async () => {
    if (!accessToken) return;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-8e7bdd01/complaints`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const { complaints } = await response.json();
        setComplaints(complaints || []);
      } else {
        console.error('Failed to fetch complaints:', response.status);
        setComplaints([
          {
            id: '1',
            userId: user?.id || 'demo',
            title: 'Pothole on Main Street',
            description: 'Large pothole causing damage to vehicles',
            locationCoords: { lat: 40.7128, lng: -74.0060 },
            address: '123 Main Street, Demo City',
            status: 'received',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            votes: 5,
            upvotes: 8,
            downvotes: 3,
            commentCount: 4
          },
          {
            id: '2',
            userId: user?.id || 'demo',
            title: 'Broken Streetlight',
            description: 'Streetlight not working on Oak Avenue',
            locationCoords: { lat: 40.7589, lng: -73.9851 },
            address: '456 Oak Avenue, Demo City',
            status: 'in_review',
            createdAt: new Date(Date.now() - 86400000).toISOString(),
            updatedAt: new Date().toISOString(),
            votes: 12,
            upvotes: 15,
            downvotes: 3,
            commentCount: 7
          }
        ]);
      }
    } catch (error) {
      console.error('Failed to fetch complaints:', error);
      setComplaints([
        {
          id: '1',
          userId: user?.id || 'demo',
          title: 'Pothole on Main Street',
          description: 'Large pothole causing damage to vehicles',
          locationCoords: { lat: 40.7128, lng: -74.0060 },
          address: '123 Main Street, Demo City',
          status: 'received',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          votes: 5
        }
      ]);
    }
  }, [accessToken, user?.id]);

  useEffect(() => {
    checkSession();
  }, []);

  useEffect(() => {
    if (user && accessToken) {
      fetchComplaints();
    }
  }, [user, accessToken, fetchComplaints]);

  const checkSession = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (session?.access_token) {
        setAccessToken(session.access_token);
        await fetchUserProfile(session.user.id, session.access_token);
        setCurrentPage('app'); // Auto-navigate to app if already logged in
      } else if (error) {
        console.error('Session error:', error);
        setCurrentPage('auth'); // Show auth page if no session
      } else {
        setCurrentPage('auth'); // Show auth page if no session
      }
    } catch (error) {
      console.error('Session check error:', error);
      setCurrentPage('auth'); // Show auth page on error
    } finally {
      setLoading(false);
    }
  };

  const fetchUserProfile = async (userId: string, token: string) => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-8e7bdd01/user/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const { user: userProfile } = await response.json();
        setUser(userProfile);
      } else {
        console.error('Failed to fetch user profile:', response.status);
        setUser({
          id: userId,
          name: 'Demo User',
          email: 'user@example.com',
          location: 'Demo City',
          role: 'user'
        });
      }
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      setUser({
        id: userId,
        name: 'Demo User',
        email: 'user@example.com',
        location: 'Demo City',
        role: 'user'
      });
    }
  };

  const handleSignIn = async (email: string, password: string) => {
    try {
      const { data: { session }, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast.error(`Sign in failed: ${error.message}`);
        return;
      }

      if (session?.access_token) {
        setAccessToken(session.access_token);
        await fetchUserProfile(session.user.id, session.access_token);
        setCurrentPage('app');
        setActiveTab('dashboard');
        toast.success('Signed in successfully!');
      }
    } catch (error) {
      console.error('Sign in error:', error);
      toast.error('Failed to sign in');
    }
  };

  const handleSignUp = async (email: string, password: string, name: string, location: string, role: string) => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-8e7bdd01/signup`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password, name, location, role }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const { user: newUser } = await response.json();
        toast.success('Account created successfully! Please sign in.');
      } else {
        const { error } = await response.json();
        toast.error(`Registration failed: ${error}`);
      }
    } catch (error) {
      console.error('Sign up error:', error);
      if (error.name === 'AbortError') {
        toast.error('Registration timed out. Please try again.');
      } else {
        toast.error('Failed to create account');
      }
    }
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setAccessToken(null);
      setComplaints([]);
      setSelectedComplaint(null);
      setActiveTab('dashboard');
      setCurrentPage('auth'); // Redirect to auth page instead of home
      toast.success('Signed out successfully');
    } catch (error) {
      console.error('Sign out error:', error);
      toast.error('Failed to sign out');
    }
  };

  const handleProfileUpdate = (updatedUser: User) => {
    setUser(updatedUser);
  };

  const handleNavigation = (page: string) => {
    // Only allow navigation to website pages if user is authenticated
    if (!user || !accessToken) {
      if (page === 'auth') {
        setCurrentPage('auth');
      }
      return;
    }
    setCurrentPage(page);
    setSelectedComplaint(null);
    window.scrollTo(0, 0);
  };

  const handleGetStarted = () => {
    setCurrentPage('auth');
  };

  const handleLearnMore = () => {
    setCurrentPage('about');
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Clean Street...</p>
        </div>
      </div>
    );
  }

  // Authentication Page - Show first for unauthenticated users
  if (!user || !accessToken) {
    return (
      <div className="min-h-screen">
        <AuthForm onSignIn={handleSignIn} onSignUp={handleSignUp} />
        <Toaster />
      </div>
    );
  }

  // Website Pages (Landing, About, Contact, Help) - Only accessible after authentication
  if (currentPage !== 'app' && currentPage !== 'auth') {
    return (
      <div className="min-h-screen bg-white">
        <WebsiteHeader 
          currentPage={currentPage} 
          onNavigate={handleNavigation}
          onGetStarted={handleGetStarted}
        />
        
        <main>
          {currentPage === 'home' && (
            <LandingPage onGetStarted={handleGetStarted} onLearnMore={handleLearnMore} />
          )}
          {currentPage === 'about' && <AboutPage onGetStarted={handleGetStarted} />}
          {currentPage === 'help' && <HelpPage onGetStarted={handleGetStarted} />}
          {currentPage === 'contact' && <ContactPage onGetStarted={handleGetStarted} />}
        </main>
        
        <WebsiteFooter onNavigate={handleNavigation} />
        <ScrollToTop />
        <Toaster />
      </div>
    );
  }

  // Issue Details View
  if (selectedComplaint) {
    return (
      <div className="min-h-screen bg-gray-50">
        <IssueDetails
          complaint={selectedComplaint}
          user={user!}
          accessToken={accessToken!}
          onBack={() => setSelectedComplaint(null)}
          onUpdate={fetchComplaints}
        />
        <Toaster />
      </div>
    );
  }

  // Main Application (Dashboard)
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-sm">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-semibold text-gray-900">Clean Street</h1>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                Welcome, <span className="font-medium text-gray-900">{user?.name}</span>
                <Badge variant="outline" className="ml-2 border-primary text-primary hover:bg-primary hover:text-white transition-colors duration-200">
                  {user?.role}
                </Badge>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleNavigation('home')}
                className="hover:bg-primary hover:text-white hover:border-primary transition-all duration-200"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Website
              </Button>
              <Button variant="outline" size="sm" onClick={handleSignOut} className="hover:bg-primary hover:text-white hover:border-primary transition-all duration-200">
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="hover:bg-primary hover:text-white hover:border-primary transition-all duration-200"
              >
                {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-gray-200 py-4">
              <div className="space-y-4">
                <div className="text-sm text-gray-600">
                  Welcome, <span className="font-medium text-gray-900">{user?.name}</span>
                  <Badge variant="outline" className="ml-2 border-primary text-primary">
                    {user?.role}
                  </Badge>
                </div>
                <div className="flex flex-col space-y-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      handleNavigation('home');
                      setMobileMenuOpen(false);
                    }}
                    className="justify-start hover:bg-primary hover:text-white hover:border-primary transition-all duration-200"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Website
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => {
                      handleSignOut();
                      setMobileMenuOpen(false);
                    }}
                    className="justify-start hover:bg-primary hover:text-white hover:border-primary transition-all duration-200"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className={`grid w-full ${user?.role === 'admin' ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-5' : 'grid-cols-2 sm:grid-cols-4'} bg-white shadow-sm border border-gray-200 rounded-lg p-1`}>
            <TabsTrigger value="dashboard" className="flex items-center justify-center space-x-1 sm:space-x-2 data-[state=active]:bg-primary data-[state=active]:text-white transition-all duration-200 text-xs sm:text-sm py-3 px-2 rounded-md">
              <BarChart3 className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="report" className="flex items-center justify-center space-x-1 sm:space-x-2 data-[state=active]:bg-primary data-[state=active]:text-white transition-all duration-200 text-xs sm:text-sm py-3 px-2 rounded-md">
              <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Report</span>
            </TabsTrigger>
            <TabsTrigger value="issues" className="flex items-center justify-center space-x-1 sm:space-x-2 data-[state=active]:bg-primary data-[state=active]:text-white transition-all duration-200 text-xs sm:text-sm py-3 px-2 rounded-md">
              <FileText className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Issues</span>
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center justify-center space-x-1 sm:space-x-2 data-[state=active]:bg-primary data-[state=active]:text-white transition-all duration-200 text-xs sm:text-sm py-3 px-2 rounded-md">
              <User className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Profile</span>
            </TabsTrigger>
            {user?.role === 'admin' && (
              <TabsTrigger value="admin" className="flex items-center justify-center space-x-1 sm:space-x-2 data-[state=active]:bg-primary data-[state=active]:text-white transition-all duration-200 text-xs sm:text-sm py-3 px-2 rounded-md col-span-2 sm:col-span-1">
                <Users className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Admin</span>
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="dashboard" className="mt-6">
            <Dashboard
              user={user!}
              accessToken={accessToken!}
              complaints={complaints}
              onComplaintSelect={setSelectedComplaint}
              onRefresh={fetchComplaints}
            />
          </TabsContent>

          <TabsContent value="report" className="mt-6">
            <ReportIssue
              user={user!}
              accessToken={accessToken!}
              onSuccess={() => {
                fetchComplaints();
                setActiveTab('issues');
              }}
            />
          </TabsContent>

          <TabsContent value="issues" className="mt-6">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold text-gray-900">All Issues</h2>
                <Button onClick={fetchComplaints} variant="outline" className="hover:bg-primary hover:text-white hover:border-primary transition-all duration-200">
                  Refresh
                </Button>
              </div>

              <div className="grid gap-4">
                {complaints.length === 0 ? (
                  <Card>
                    <CardContent className="flex items-center justify-center py-8">
                      <div className="text-center">
                        <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">No issues reported yet</p>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  complaints.map((complaint) => (
                    <Card 
                      key={complaint.id} 
                      className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:border-primary/20 bg-white"
                      onClick={() => setSelectedComplaint(complaint)}
                    >
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg">{complaint.title}</CardTitle>
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(complaint.status)}
                            <Badge className={getStatusColor(complaint.status)}>
                              {complaint.status.replace('_', ' ')}
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600 mb-2 line-clamp-2">{complaint.description}</p>
                        <div className="flex justify-between items-center text-sm text-gray-500">
                          <span>{complaint.address}</span>
                          <span>{new Date(complaint.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between items-center mt-2 text-sm">
                          <div className="flex items-center space-x-4">
                            <span className="text-gray-500">Net Votes: {complaint.votes || 0}</span>
                            <span className="text-gray-500">Comments: {complaint.commentCount || 0}</span>
                          </div>
                          {complaint.assignedTo && (
                            <span className="text-primary font-medium">Assigned: {complaint.assignedTo}</span>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="profile" className="mt-6">
            <ProfileEdit
              user={user!}
              accessToken={accessToken!}
              onUpdate={handleProfileUpdate}
            />
          </TabsContent>

          {user?.role === 'admin' && (
            <TabsContent value="admin" className="mt-6">
              <EnhancedAdminPanel user={user} accessToken={accessToken!} />
            </TabsContent>
          )}
        </Tabs>
      </main>

      <Toaster />
    </div>
  );
}