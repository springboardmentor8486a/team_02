import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { 
  MapPin, 
  Camera, 
  Users, 
  TrendingUp, 
  CheckCircle, 
  ArrowRight,
  Star,
  Shield,
  Clock,
  MessageSquare,
  BarChart3,
  Smartphone
} from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
  onLearnMore: () => void;
}

export function LandingPage({ onGetStarted, onLearnMore }: LandingPageProps) {
  const features = [
    {
      icon: <Camera className="w-6 h-6" style={{ color: '#3A5393' }} />,
      title: "Photo Reports",
      description: "Upload photos to document issues clearly and help authorities understand the problem."
    },
    {
      icon: <MapPin className="w-6 h-6" style={{ color: '#3A5393' }} />,
      title: "GPS Location",
      description: "Automatically capture precise location data to ensure issues are addressed at the right spot."
    },
    {
      icon: <Users className="w-6 h-6" style={{ color: '#3A5393' }} />,
      title: "Community Voting",
      description: "Let the community vote on issues to prioritize the most important problems."
    },
    {
      icon: <Clock className="w-6 h-6" style={{ color: '#3A5393' }} />,
      title: "Real-time Tracking",
      description: "Track the status of your reports from submission to resolution in real-time."
    },
    {
      icon: <MessageSquare className="w-6 h-6" style={{ color: '#3A5393' }} />,
      title: "Community Discussion",
      description: "Engage with neighbors and officials through comments and discussions on issues."
    },
    {
      icon: <BarChart3 className="w-6 h-6" style={{ color: '#3A5393' }} />,
      title: "Analytics Dashboard",
      description: "Administrators can monitor trends and generate reports for better city management."
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Resident",
      content: "Clean Street made it so easy to report the pothole on my street. It was fixed within a week!",
      rating: 5
    },
    {
      name: "Mike Chen",
      role: "Community Volunteer",
      content: "I love how I can track all the issues in my neighborhood and help coordinate with city officials.",
      rating: 5
    },
    {
      name: "Dr. Emily Rodriguez",
      role: "City Administrator",
      content: "The analytics dashboard gives us invaluable insights into community needs and helps us prioritize resources.",
      rating: 5
    }
  ];

  const steps = [
    {
      step: "1",
      title: "Report an Issue",
      description: "Take a photo and describe the civic issue you've encountered in your neighborhood."
    },
    {
      step: "2",
      title: "Community Engagement",
      description: "Other residents can vote and comment on your report to show community support."
    },
    {
      step: "3",
      title: "Official Response",
      description: "Local authorities review and assign the issue to appropriate departments."
    },
    {
      step: "4",
      title: "Resolution Tracking",
      description: "Track progress and receive updates until the issue is completely resolved."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden" style={{ background: 'linear-gradient(to bottom right, rgba(58, 83, 147, 0.05), white, rgba(58, 83, 147, 0.03))' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <Badge variant="outline" className="mb-4">
                Empowering Communities Since 2024
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                Make Your <span style={{ color: '#3A5393' }}>Community</span> Better
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Clean Street is a smart civic engagement platform that empowers citizens to report local issues, 
                track their resolution, and build stronger communities through collaborative action.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button size="lg" onClick={onGetStarted} className="px-8 py-3">
                  Get Started Free
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button size="lg" variant="outline" onClick={onLearnMore} className="px-8 py-3">
                  Learn More
                </Button>
              </div>
              
              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-gray-200">
                <div className="text-center lg:text-left">
                  <div className="text-2xl font-bold" style={{ color: '#3A5393' }}>1,500+</div>
                  <div className="text-sm text-gray-500">Issues Reported</div>
                </div>
                <div className="text-center lg:text-left">
                  <div className="text-2xl font-bold" style={{ color: '#3A5393' }}>80%</div>
                  <div className="text-sm text-gray-500">Resolution Rate</div>
                </div>
                <div className="text-center lg:text-left">
                  <div className="text-2xl font-bold" style={{ color: '#3A5393' }}>50+</div>
                  <div className="text-sm text-gray-500">Partner Cities</div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="relative z-10">
                <img
                  src="https://images.unsplash.com/photo-1555069855-e580a9adbf43?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaXZpYyUyMGVuZ2FnZW1lbnQlMjBjb21tdW5pdHklMjBtZWV0aW5nfGVufDF8fHx8MTc1NzY4NDI1M3ww&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Community engagement and civic participation"
                  className="rounded-2xl shadow-2xl w-full max-w-lg mx-auto"
                />
              </div>
              <div className="absolute inset-0 rounded-2xl transform rotate-6" style={{ background: 'linear-gradient(to right, rgba(58, 83, 147, 0.2), rgba(58, 83, 147, 0.1))' }}></div>
              
              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 bg-white rounded-lg shadow-lg p-3 z-20">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5" style={{ color: '#3A5393' }} />
                  <span className="text-sm font-medium">Issue Resolved!</span>
                </div>
              </div>
              <div className="absolute -bottom-4 -left-4 bg-white rounded-lg shadow-lg p-3 z-20">
                <div className="flex items-center space-x-2">
                  <Smartphone className="w-5 h-5" style={{ color: '#3A5393' }} />
                  <span className="text-sm font-medium">Mobile Ready</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Powerful Features for Civic Engagement
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to report, track, and resolve community issues effectively.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    {feature.icon}
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How Clean Street Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From reporting to resolution, here's how we make civic engagement simple and effective.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            <div className="space-y-8">
              {steps.map((step, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="w-12 h-12 text-white rounded-full flex items-center justify-center text-lg font-bold flex-shrink-0" style={{ backgroundColor: '#3A5393' }}>
                    {step.step}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1710993011836-108ba89ebe51?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFydHBob25lJTIwbW9iaWxlJTIwYXBwJTIwaW50ZXJmYWNlfGVufDF8fHx8MTc1NzY4NDI1Nnww&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Clean Street mobile app interface"
                className="rounded-2xl shadow-xl w-full max-w-sm mx-auto"
              />
              <div className="absolute inset-0 rounded-2xl" style={{ background: 'linear-gradient(to top, rgba(58, 83, 147, 0.1), transparent)' }}></div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-20 text-white" style={{ backgroundColor: '#3A5393' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Making a Real Impact
            </h2>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              Join thousands of citizens who are already making their communities better.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">1,500+</div>
              <div className="text-white/80">Issues Reported</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">1,200+</div>
              <div className="text-white/80">Issues Resolved</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">5,000+</div>
              <div className="text-white/80">Active Citizens</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">50+</div>
              <div className="text-white/80">Partner Cities</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What People Are Saying
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Real stories from real people making a difference in their communities.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center space-x-1 mb-2">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <CardDescription className="text-base italic">
                    "{testimonial.content}"
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-500">{testimonial.role}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white border-t">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Ready to Make a Difference?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join your community in building a better neighborhood. Report issues, track progress, and see real change happen.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={onGetStarted} className="px-8 py-3">
              Sign Up Now
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
              <Shield className="w-4 h-4" />
              <span>Free to use • No credit card required</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}