import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { 
  Search, 
  Camera, 
  MapPin, 
  Users, 
  Shield, 
  Clock,
  MessageCircle,
  Book,
  Video,
  Mail,
  ArrowRight
} from 'lucide-react';

interface HelpPageProps {
  onGetStarted: () => void;
}

export function HelpPage({ onGetStarted }: HelpPageProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    {
      icon: <Camera className="w-6 h-6" style={{ color: '#3A5393' }} />,
      title: "Reporting Issues",
      description: "Learn how to report civic issues effectively"
    },
    {
      icon: <MapPin className="w-6 h-6" style={{ color: '#3A5393' }} />,
      title: "Location & GPS",
      description: "Understanding location services and accuracy"
    },
    {
      icon: <Users className="w-6 h-6" style={{ color: '#3A5393' }} />,
      title: "Community Features",
      description: "Voting, commenting, and community engagement"
    },
    {
      icon: <Shield className="w-6 h-6" style={{ color: '#3A5393' }} />,
      title: "Account & Privacy",
      description: "Managing your account and privacy settings"
    }
  ];

  const faqs = [
    {
      category: "General",
      question: "What is Clean Street?",
      answer: "Clean Street is a civic engagement platform that allows citizens to report local issues like potholes, broken streetlights, garbage dumps, and other community problems. It facilitates communication between residents and local authorities to ensure issues are addressed efficiently."
    },
    {
      category: "Reporting",
      question: "How do I report an issue?",
      answer: "To report an issue: 1) Sign up for a free account, 2) Click 'Report Issue' in the main navigation, 3) Select the issue category, 4) Add a descriptive title and detailed description, 5) Take or upload a photo, 6) Add location information, and 7) Submit your report. You'll receive updates on the status of your report."
    },
    {
      category: "Reporting",
      question: "What types of issues can I report?",
      answer: "You can report various civic issues including: potholes and road damage, broken or malfunctioning streetlights, garbage dumps and waste management issues, water leaks and drainage problems, graffiti and vandalism, damaged public property, and other infrastructure problems that affect your community."
    },
    {
      category: "Reporting",
      question: "Do I need to include a photo?",
      answer: "While photos are not mandatory, they are highly recommended as they help authorities understand the severity and nature of the issue. Photos provide visual evidence that can speed up the resolution process and help assign the right resources to fix the problem."
    },
    {
      category: "Location",
      question: "How accurate does my location need to be?",
      answer: "The more accurate your location, the better. We recommend using the 'Use Current Location' feature when you're at the exact spot of the issue. If you're reporting from elsewhere, try to be as specific as possible with the address and include nearby landmarks in your description."
    },
    {
      category: "Location",
      question: "Can I report issues in other neighborhoods?",
      answer: "Yes, you can report issues anywhere, but you'll need to manually enter the address since the GPS location might not match. Make sure to provide accurate address information and detailed descriptions to help authorities locate the problem."
    },
    {
      category: "Community",
      question: "How does the voting system work?",
      answer: "Community members can upvote or downvote reported issues to show support or priority. Each user can vote once per issue. Issues with more upvotes may receive higher priority from local authorities, as they indicate broader community concern."
    },
    {
      category: "Community",
      question: "Can I comment on other people's reports?",
      answer: "Yes! Comments are a great way to add additional information, show support, or provide updates about an issue. All comments are public and help build community engagement around resolving local problems."
    },
    {
      category: "Account",
      question: "What's the difference between user roles?",
      answer: "Citizens can report issues, vote, and comment. Volunteers can do everything citizens can do, plus help manage and coordinate responses. Administrators have full access to manage issues, view analytics, and coordinate with government departments."
    },
    {
      category: "Account",
      question: "How do I track my reported issues?",
      answer: "Your dashboard shows all issues you've reported with their current status: 'Received' (newly submitted), 'In Review' (being processed by authorities), and 'Resolved' (completed). You'll also receive notifications when the status changes."
    },
    {
      category: "Privacy",
      question: "Is my personal information safe?",
      answer: "Yes, we take privacy seriously. Your email and personal details are never shared publicly. Only your name (which you can set to a display name) appears on your reports and comments. Your location data is only used to place issues accurately on the map."
    },
    {
      category: "Privacy",
      question: "Can I delete my reports?",
      answer: "You cannot delete reports once submitted, as they become part of the public record. However, you can contact support if you need to make corrections or have concerns about a specific report."
    }
  ];

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const resources = [
    {
      icon: <Book className="w-8 h-8" style={{ color: '#3A5393' }} />,
      title: "User Guide",
      description: "Complete step-by-step guide to using Clean Street",
      link: "#"
    },
    {
      icon: <Video className="w-8 h-8" style={{ color: '#3A5393' }} />,
      title: "Video Tutorials",
      description: "Watch how-to videos for common tasks",
      link: "#"
    },
    {
      icon: <MessageCircle className="w-8 h-8" style={{ color: '#3A5393' }} />,
      title: "Community Forum",
      description: "Connect with other users and share tips",
      link: "#"
    },
    {
      icon: <Mail className="w-8 h-8" style={{ color: '#3A5393' }} />,
      title: "Contact Support",
      description: "Get help from our support team",
      link: "#"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-20" style={{ background: 'linear-gradient(to bottom right, rgba(58, 83, 147, 0.05), white, rgba(58, 83, 147, 0.03))' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            How Can We Help?
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Find answers to common questions and learn how to make the most of Clean Street.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-lg mx-auto relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search for help topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-3 text-lg"
            />
          </div>
        </div>
      </section>

      {/* Help Categories */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Browse Help Topics
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4">
                    {category.icon}
                  </div>
                  <CardTitle className="text-lg">{category.title}</CardTitle>
                  <CardDescription>{category.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Frequently Asked Questions
          </h2>
          
          {searchQuery && (
            <div className="mb-6">
              <p className="text-gray-600">
                Showing {filteredFaqs.length} result{filteredFaqs.length !== 1 ? 's' : ''} for "{searchQuery}"
              </p>
            </div>
          )}
          
          <Accordion type="single" collapsible className="space-y-4">
            {filteredFaqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="bg-white border rounded-lg">
                <AccordionTrigger className="px-6 py-4 hover:no-underline">
                  <div className="flex items-center space-x-3 text-left">
                    <Badge variant="outline">{faq.category}</Badge>
                    <span className="font-medium">{faq.question}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          
          {filteredFaqs.length === 0 && searchQuery && (
            <div className="text-center py-8">
              <p className="text-gray-500">No results found for "{searchQuery}". Try different keywords or browse the categories above.</p>
            </div>
          )}
        </div>
      </section>

      {/* Resources Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Additional Resources
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {resources.map((resource, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4">
                    {resource.icon}
                  </div>
                  <CardTitle className="text-lg">{resource.title}</CardTitle>
                  <CardDescription>{resource.description}</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <Button variant="outline" className="w-full">
                    Learn More
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Support */}
      <section className="py-16 text-white" style={{ backgroundColor: '#3A5393' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-white opacity-80 mb-8">
            Join thousands of citizens already using Clean Street to make their communities better.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button variant="secondary" size="lg" className="px-8" onClick={onGetStarted}>
              Start Reporting Issues
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <div className="flex items-center justify-center space-x-2 text-white opacity-80">
              <Clock className="w-4 h-4" />
              <span>Free to use • No credit card required</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}