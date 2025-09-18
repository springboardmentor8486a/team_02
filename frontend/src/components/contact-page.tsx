import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { toast } from 'sonner@2.0.3';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  MessageSquare,
  Users,
  Building,
  Send,
  ArrowRight
} from 'lucide-react';

interface ContactPageProps {
  onGetStarted: () => void;
}

export function ContactPage({ onGetStarted }: ContactPageProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    category: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast.success('Message sent successfully! We\'ll get back to you within 24 hours.');
    setFormData({
      name: '',
      email: '',
      subject: '',
      category: '',
      message: ''
    });
    setLoading(false);
  };

  const contactMethods = [
    {
      icon: <Mail className="w-6 h-6" style={{ color: '#3A5393' }} />,
      title: "Email Support",
      description: "Get help via email",
      contact: "support@cleanstreet.org",
      response: "Within 24 hours"
    },
    {
      icon: <Phone className="w-6 h-6" style={{ color: '#3A5393' }} />,
      title: "Phone Support",
      description: "Speak with our team",
      contact: "(555) 123-4567",
      response: "Mon-Fri, 9AM-5PM EST"
    },
    {
      icon: <MapPin className="w-6 h-6" style={{ color: '#3A5393' }} />,
      title: "Office Location",
      description: "Visit us in person",
      contact: "123 Civic Ave, Suite 100",
      response: "By appointment only"
    }
  ];

  const departments = [
    {
      title: "General Support",
      description: "Questions about using the platform, account issues, or general inquiries",
      email: "support@cleanstreet.org"
    },
    {
      title: "Partnership Inquiries",
      description: "Local governments or organizations interested in implementing Clean Street",
      email: "partnerships@cleanstreet.org"
    },
    {
      title: "Technical Issues",
      description: "Bug reports, technical problems, or platform performance issues",
      email: "tech@cleanstreet.org"
    },
    {
      title: "Media & Press",
      description: "Media inquiries, press releases, and interview requests",
      email: "media@cleanstreet.org"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-20" style={{ background: 'linear-gradient(to bottom right, rgba(58, 83, 147, 0.05), white, rgba(58, 83, 147, 0.03))' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Get in Touch
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Have questions, suggestions, or need support? We're here to help and would love to hear from you.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Send us a Message</CardTitle>
                <CardDescription>
                  Fill out the form below and we'll get back to you as soon as possible.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        type="text"
                        placeholder="Your full name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select inquiry type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General Support</SelectItem>
                        <SelectItem value="technical">Technical Issue</SelectItem>
                        <SelectItem value="partnership">Partnership Inquiry</SelectItem>
                        <SelectItem value="media">Media & Press</SelectItem>
                        <SelectItem value="feedback">Feedback & Suggestions</SelectItem>
                        <SelectItem value="bug">Bug Report</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject *</Label>
                    <Input
                      id="subject"
                      type="text"
                      placeholder="Brief description of your inquiry"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      placeholder="Provide details about your inquiry, question, or issue..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      rows={6}
                      required
                    />
                  </div>

                  <Button type="submit" disabled={loading} className="w-full">
                    {loading ? (
                      <>Sending...</>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            {/* Contact Methods */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Methods</CardTitle>
                <CardDescription>
                  Choose the best way to reach us
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {contactMethods.map((method, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="flex-shrink-0">
                      {method.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{method.title}</h4>
                      <p className="text-sm text-gray-600 mb-1">{method.description}</p>
                      <p className="text-sm font-medium text-gray-900">{method.contact}</p>
                      <p className="text-xs text-gray-500">{method.response}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Office Hours */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="w-5 h-5" />
                  <span>Office Hours</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Monday - Friday</span>
                  <span className="font-medium">9:00 AM - 5:00 PM EST</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Saturday</span>
                  <span className="font-medium">10:00 AM - 2:00 PM EST</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Sunday</span>
                  <span className="font-medium">Closed</span>
                </div>
                <div className="pt-2 border-t">
                  <p className="text-sm text-gray-500">
                    Emergency technical issues are monitored 24/7
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Quick Links */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Users className="w-4 h-4 mr-2" />
                  Community Forum
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Building className="w-4 h-4 mr-2" />
                  For Government Partners
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Report a Bug
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Department Contact Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Contact by Department
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get in touch with the right team for your specific needs.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {departments.map((dept, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{dept.title}</CardTitle>
                  <CardDescription>{dept.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">{dept.email}</Badge>
                    <Button variant="outline" size="sm">
                      <Mail className="w-4 h-4 mr-2" />
                      Email
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Response Time Section */}
      <section className="py-16 text-white" style={{ backgroundColor: '#3A5393' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Start Making a Difference?
          </h2>
          <p className="text-xl text-white opacity-80 mb-8">
            Join thousands of citizens already using Clean Street to improve their communities.
          </p>
          <div className="flex justify-center mb-8">
            <Button variant="secondary" size="lg" className="px-8" onClick={onGetStarted}>
              Get Started Free
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
            <div>
              <div className="text-lg font-bold mb-2">24 Hours</div>
              <div className="text-white opacity-80">General inquiries</div>
            </div>
            <div>
              <div className="text-lg font-bold mb-2">4 Hours</div>
              <div className="text-white opacity-80">Technical issues</div>
            </div>
            <div>
              <div className="text-lg font-bold mb-2">1 Hour</div>
              <div className="text-white opacity-80">Critical platform issues</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}