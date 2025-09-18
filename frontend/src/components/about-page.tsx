import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { 
  Heart, 
  Target, 
  Users, 
  Award, 
  MapPin, 
  Lightbulb,
  Shield,
  Globe,
  ArrowRight
} from 'lucide-react';

interface AboutPageProps {
  onGetStarted: () => void;
}

export function AboutPage({ onGetStarted }: AboutPageProps) {
  const values = [
    {
      icon: <Heart className="w-8 h-8" style={{ color: '#3A5393' }} />,
      title: "Community First",
      description: "We believe that strong communities are built when citizens actively participate in making their neighborhoods better."
    },
    {
      icon: <Shield className="w-8 h-8" style={{ color: '#3A5393' }} />,
      title: "Transparency",
      description: "Every report, vote, and resolution is tracked openly, ensuring accountability from submission to completion."
    },
    {
      icon: <Users className="w-8 h-8" style={{ color: '#3A5393' }} />,
      title: "Collaboration",
      description: "Bringing together citizens, volunteers, and local authorities to work towards common goals."
    },
    {
      icon: <Lightbulb className="w-8 h-8" style={{ color: '#3A5393' }} />,
      title: "Innovation",
      description: "Using technology to modernize civic engagement and make reporting issues simple and effective."
    }
  ];

  const team = [
    {
      name: "Alex Johnson",
      role: "Founder & CEO",
      description: "Former city planner with 10+ years of experience in urban development and community engagement.",
      expertise: "Urban Planning, Public Policy"
    },
    {
      name: "Maria Santos",
      role: "CTO",
      description: "Full-stack developer passionate about using technology to solve real-world community problems.",
      expertise: "Software Architecture, Mobile Development"
    },
    {
      name: "David Kim",
      role: "Community Manager",
      description: "Community organizer dedicated to building bridges between citizens and local government.",
      expertise: "Community Outreach, Stakeholder Engagement"
    },
    {
      name: "Rachel Thompson",
      role: "UX Designer",
      description: "Design leader focused on creating accessible and inclusive digital experiences for all users.",
      expertise: "User Experience, Accessibility Design"
    }
  ];

  const milestones = [
    {
      year: "2022",
      title: "Concept Development",
      description: "Initial research and prototype development began after identifying gaps in civic engagement platforms."
    },
    {
      year: "2023",
      title: "Beta Launch",
      description: "Launched beta version in 5 pilot cities, gathering feedback from 500+ early adopters."
    },
    {
      year: "2024",
      title: "Public Release",
      description: "Official launch with enhanced features, mobile app, and partnerships with local governments."
    },
    {
      year: "2024",
      title: "Growing Impact",
      description: "Now serving 50+ communities with over 1,500 issues reported and 1,200+ successfully resolved."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-20" style={{ background: 'linear-gradient(to bottom right, rgba(58, 83, 147, 0.05), white, rgba(58, 83, 147, 0.03))' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge variant="outline" className="mb-4">
            About Clean Street
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Empowering Communities Through Technology
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Clean Street was born from a simple belief: when citizens have the right tools and platform, 
            they can work together with local authorities to create meaningful, lasting change in their communities.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                To bridge the gap between citizens and local government by providing a transparent, 
                efficient platform where community issues can be reported, tracked, and resolved collaboratively.
              </p>
              <p className="text-lg text-gray-600">
                We envision communities where every voice is heard, every issue matters, and every citizen 
                feels empowered to contribute to positive change.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <Card className="text-center">
                <CardContent className="pt-6">
                  <Target className="w-12 h-12 mx-auto mb-4" style={{ color: '#3A5393' }} />
                  <h3 className="font-semibold text-gray-900 mb-2">Clear Goals</h3>
                  <p className="text-sm text-gray-600">Focused on measurable community improvements</p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="pt-6">
                  <Globe className="w-12 h-12 mx-auto mb-4" style={{ color: '#3A5393' }} />
                  <h3 className="font-semibold text-gray-900 mb-2">Global Impact</h3>
                  <p className="text-sm text-gray-600">Scalable solutions for communities worldwide</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Core Values
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              These principles guide everything we do and how we serve our communities.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="mx-auto mb-4">
                    {value.icon}
                  </div>
                  <CardTitle className="text-lg">{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{value.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Journey
            </h2>
            <p className="text-xl text-gray-600">
              From idea to impact - here's how Clean Street has evolved to serve communities better.
            </p>
          </div>
          
          <div className="space-y-8">
            {milestones.map((milestone, index) => (
              <div key={index} className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 text-white rounded-full flex items-center justify-center font-bold" style={{ backgroundColor: '#3A5393' }}>
                    {milestone.year}
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{milestone.title}</h3>
                  <p className="text-gray-600">{milestone.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Meet Our Team
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Passionate individuals dedicated to making civic engagement accessible and effective for everyone.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-4" style={{ background: 'linear-gradient(to bottom right, #3A5393, #4A6BA8)' }}>
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <CardTitle className="text-center text-lg">{member.name}</CardTitle>
                  <CardDescription className="text-center font-medium" style={{ color: '#3A5393' }}>
                    {member.role}
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-sm text-gray-600 mb-3">{member.description}</p>
                  <Badge variant="outline" className="text-xs">
                    {member.expertise}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-20 text-white" style={{ backgroundColor: '#3A5393' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Our Growing Impact
            </h2>
            <p className="text-xl text-white opacity-80 max-w-2xl mx-auto">
              Every day, Clean Street helps communities become better places to live, work, and thrive.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <Award className="w-12 h-12 mx-auto mb-4 text-yellow-400" />
              <div className="text-2xl font-bold mb-2">2024 Civic Tech Award</div>
              <div className="text-white opacity-80">Best Community Engagement Platform</div>
            </div>
            <div>
              <Users className="w-12 h-12 mx-auto mb-4 text-green-400" />
              <div className="text-2xl font-bold mb-2">50+ Partner Cities</div>
              <div className="text-white opacity-80">Across North America and Europe</div>
            </div>
            <div>
              <MapPin className="w-12 h-12 mx-auto mb-4 text-red-400" />
              <div className="text-2xl font-bold mb-2">80% Resolution Rate</div>
              <div className="text-white opacity-80">Of reported community issues</div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-white border-t">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Ready to Join Our Mission?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Whether you're a citizen looking to improve your community or a local government interested in partnership, 
            we'd love to have you as part of the Clean Street community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Button size="lg" onClick={onGetStarted} className="px-8 py-3">
              Get Started Today
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center text-sm text-gray-600">
            <div>
              <strong>Email:</strong> hello@cleanstreet.org
            </div>
            <div>
              <strong>Phone:</strong> (555) 123-4567
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}