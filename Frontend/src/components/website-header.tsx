import React, { useState } from 'react';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { Badge } from './ui/badge';
import { 
  MapPin, 
  Menu, 
  X, 
  Home,
  Info,
  HelpCircle,
  Phone,
  LogIn
} from 'lucide-react';

interface WebsiteHeaderProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  onGetStarted: () => void;
}

export function WebsiteHeader({ currentPage, onNavigate, onGetStarted }: WebsiteHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Home', id: 'home', icon: <Home className="w-4 h-4" /> },
    { name: 'About', id: 'about', icon: <Info className="w-4 h-4" /> },
    { name: 'Help', id: 'help', icon: <HelpCircle className="w-4 h-4" /> },
    { name: 'Contact', id: 'contact', icon: <Phone className="w-4 h-4" /> },
  ];

  const handleNavClick = (pageId: string) => {
    onNavigate(pageId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="bg-white/95 backdrop-blur-sm shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div 
            className="flex items-center space-x-3 cursor-pointer"
            onClick={() => handleNavClick('home')}
          >
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#3A5393' }}>
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Clean Street</h1>
              <p className="text-xs text-gray-500 hidden sm:block">Civic Engagement Platform</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentPage === item.id
                    ? 'bg-blue-50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
                style={currentPage === item.id ? { color: '#3A5393' } : {}}
              >
                {item.icon}
                <span>{item.name}</span>
              </button>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="outline" onClick={onGetStarted}>
              <LogIn className="w-4 h-4 mr-2" />
              Sign In
            </Button>
            <Button onClick={onGetStarted}>
              Get Started
            </Button>
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm">
                  <Menu className="w-4 h-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="flex flex-col h-full">
                  {/* Mobile Header */}
                  <div className="flex items-center justify-between pb-4 border-b">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#3A5393' }}>
                        <MapPin className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-gray-900">Clean Street</h2>
                        <p className="text-xs text-gray-500">Civic Engagement Platform</p>
                      </div>
                    </div>
                  </div>

                  {/* Mobile Navigation */}
                  <nav className="flex-1 py-6">
                    <div className="space-y-2">
                      {navigation.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => handleNavClick(item.id)}
                          className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left font-medium transition-colors ${
                            currentPage === item.id
                              ? 'bg-blue-50'
                              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                          }`}
                          style={currentPage === item.id ? { color: '#3A5393' } : {}}
                        >
                          {item.icon}
                          <span>{item.name}</span>
                          {currentPage === item.id && (
                            <Badge variant="secondary" className="ml-auto">
                              Current
                            </Badge>
                          )}
                        </button>
                      ))}
                    </div>
                  </nav>

                  {/* Mobile CTA */}
                  <div className="border-t pt-4 space-y-3">
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => {
                        onGetStarted();
                        setMobileMenuOpen(false);
                      }}
                    >
                      <LogIn className="w-4 h-4 mr-2" />
                      Sign In
                    </Button>
                    <Button 
                      className="w-full"
                      onClick={() => {
                        onGetStarted();
                        setMobileMenuOpen(false);
                      }}
                    >
                      Get Started Free
                    </Button>
                    <p className="text-xs text-gray-500 text-center">
                      Join thousands of citizens making their communities better
                    </p>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}