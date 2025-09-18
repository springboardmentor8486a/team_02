import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Checkbox } from './ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Progress } from './ui/progress';
import { MapPin, Users, Shield, Mail, Lock, User, Phone, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react';
import { ForgotPassword } from './forgot-password';

// Social Media Icon Components
const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const FacebookIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const TwitterIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
  </svg>
);

interface AuthFormProps {
  onSignIn: (email: string, password: string) => void;
  onSignUp: (email: string, password: string, name: string, location: string, role: string) => void;
}

export function AuthForm({ onSignIn, onSignUp }: AuthFormProps) {
  const [activeTab, setActiveTab] = useState('signin');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [signInData, setSignInData] = useState({
    email: '',
    password: ''
  });

  const [signUpData, setSignUpData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    username: '',
    phone: '',
    location: '',
    role: 'user'
  });

  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [agreesToTerms, setAgreesToTerms] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [socialLoading, setSocialLoading] = useState<string | null>(null);

  const calculatePasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[a-z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password) || /[^A-Za-z0-9]/.test(password)) strength += 25;
    return strength;
  };

  const getPasswordStrengthColor = (strength: number) => {
    if (strength < 25) return 'bg-red-500';
    if (strength < 50) return 'bg-orange-500';
    if (strength < 75) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getPasswordStrengthText = (strength: number) => {
    if (strength < 25) return 'Weak';
    if (strength < 50) return 'Fair';
    if (strength < 75) return 'Good';
    return 'Strong';
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSignIn(signInData.email, signInData.password);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (signUpData.password !== signUpData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    
    if (passwordStrength < 50) {
      alert('Please choose a stronger password');
      return;
    }
    
    if (!agreesToTerms) {
      alert('Please agree to the terms and conditions');
      return;
    }
    
    if (!signUpData.location.trim()) {
      alert('Please enter your location');
      return;
    }
    
    setLoading(true);
    try {
      await onSignUp(
        signUpData.email,
        signUpData.password,
        signUpData.name,
        signUpData.location,
        signUpData.role
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = (password: string) => {
    setSignUpData({ ...signUpData, password });
    setPasswordStrength(calculatePasswordStrength(password));
  };

  const handleSocialLogin = async (provider: 'google' | 'facebook' | 'twitter') => {
    setSocialLoading(provider);
    try {
      // Show credential input dialog
      const credentials = await showSocialLoginDialog(provider);
      
      if (!credentials) {
        setSocialLoading(null);
        return;
      }

      // Simulate social login process with provided credentials
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Validate credentials (demo validation)
      if (!credentials.email || !credentials.password) {
        alert('Please provide both email and password');
        setSocialLoading(null);
        return;
      }

      // In a real app, this would integrate with OAuth providers
      // For demo purposes, we'll simulate successful login with provided data
      const userData = {
        email: credentials.email,
        name: credentials.name || `${provider.charAt(0).toUpperCase() + provider.slice(1)} User`,
        location: credentials.location || 'Demo City',
        role: 'user'
      };

      // Show success message with provider-specific details
      const providerName = provider.charAt(0).toUpperCase() + provider.slice(1);
      const credentialType = provider === 'google' ? 'Gmail' : 
                           provider === 'facebook' ? 'Facebook' : 
                           provider === 'twitter' ? 'Twitter' : 'Account';
      
      alert(`Successfully signed in with ${providerName}!\n\n${credentialType} Email: ${userData.email}\nName: ${userData.name}\nLocation: ${userData.location}`);
      
      // In a real app, you would call the onSignIn function with the social login data
      // onSignIn(userData.email, 'social_login_token');
      
    } catch (error) {
      alert(`Failed to sign in with ${provider.charAt(0).toUpperCase() + provider.slice(1)}. Please try again.`);
    } finally {
      setSocialLoading(null);
    }
  };

  const showSocialLoginDialog = (provider: string): Promise<{email: string, password: string, name?: string, location?: string} | null> => {
    return new Promise((resolve) => {
      const dialog = document.createElement('div');
      dialog.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
      
      // Provider-specific content
      const getProviderContent = (provider: string) => {
        switch (provider) {
          case 'google':
            return {
              icon: 'G',
              bgColor: 'bg-red-500',
              buttonColor: 'bg-red-500 hover:bg-red-600 focus:ring-red-500',
              title: 'Sign in with Google',
              description: 'Please enter your Google account credentials to continue:',
              emailPlaceholder: 'Enter your Gmail address',
              passwordPlaceholder: 'Enter your Google password',
              helpText: 'Use your Gmail address and Google account password'
            };
          case 'facebook':
            return {
              icon: 'f',
              bgColor: 'bg-blue-600',
              buttonColor: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
              title: 'Sign in with Facebook',
              description: 'Please enter your Facebook account credentials to continue:',
              emailPlaceholder: 'Enter your Facebook email/phone',
              passwordPlaceholder: 'Enter your Facebook password',
              helpText: 'Use your Facebook email or phone number and Facebook password'
            };
          case 'twitter':
            return {
              icon: 'T',
              bgColor: 'bg-sky-400',
              buttonColor: 'bg-sky-400 hover:bg-sky-500 focus:ring-sky-500',
              title: 'Sign in with Twitter',
              description: 'Please enter your Twitter account credentials to continue:',
              emailPlaceholder: 'Enter your Twitter email/username',
              passwordPlaceholder: 'Enter your Twitter password',
              helpText: 'Use your Twitter email or username and Twitter password'
            };
          default:
            return {
              icon: '?',
              bgColor: 'bg-gray-500',
              buttonColor: 'bg-gray-500 hover:bg-gray-600 focus:ring-gray-500',
              title: 'Sign in',
              description: 'Please enter your account credentials:',
              emailPlaceholder: 'Enter your email',
              passwordPlaceholder: 'Enter your password',
              helpText: 'Enter your account credentials'
            };
        }
      };

      const providerContent = getProviderContent(provider);

      dialog.innerHTML = `
        <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-2xl">
          <div class="flex items-center mb-4">
            <div class="w-8 h-8 rounded-lg flex items-center justify-center mr-3 ${providerContent.bgColor} text-white font-bold">
              ${providerContent.icon}
            </div>
            <h3 class="text-lg font-semibold text-gray-900">
              ${providerContent.title}
            </h3>
          </div>
          <p class="text-sm text-gray-600 mb-2">
            ${providerContent.description}
          </p>
          <p class="text-xs text-gray-500 mb-4">
            ${providerContent.helpText}
          </p>
          <form id="social-login-form" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                ${provider === 'facebook' ? 'Email or Phone' : provider === 'twitter' ? 'Email or Username' : 'Email Address'}
              </label>
              <input 
                type="${provider === 'facebook' ? 'text' : 'email'}" 
                id="social-email" 
                required 
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="${providerContent.emailPlaceholder}"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input 
                type="password" 
                id="social-password" 
                required 
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="${providerContent.passwordPlaceholder}"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Full Name (Optional)</label>
              <input 
                type="text" 
                id="social-name" 
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your full name"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Location (Optional)</label>
              <input 
                type="text" 
                id="social-location" 
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your city/location"
              />
            </div>
            <div class="flex justify-end space-x-3 pt-4">
              <button 
                type="button" 
                id="cancel-social-login"
                class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Cancel
              </button>
              <button 
                type="submit"
                class="px-4 py-2 text-sm font-medium text-white ${providerContent.buttonColor} rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2"
              >
                Sign In with ${provider.charAt(0).toUpperCase() + provider.slice(1)}
              </button>
            </div>
          </form>
        </div>
      `;

      document.body.appendChild(dialog);

      const form = dialog.querySelector('#social-login-form') as HTMLFormElement;
      const cancelBtn = dialog.querySelector('#cancel-social-login') as HTMLButtonElement;

      const cleanup = () => {
        document.body.removeChild(dialog);
      };

      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = (dialog.querySelector('#social-email') as HTMLInputElement).value;
        const password = (dialog.querySelector('#social-password') as HTMLInputElement).value;
        const name = (dialog.querySelector('#social-name') as HTMLInputElement).value;
        const location = (dialog.querySelector('#social-location') as HTMLInputElement).value;
        
        cleanup();
        resolve({ email, password, name, location });
      });

      cancelBtn.addEventListener('click', () => {
        cleanup();
        resolve(null);
      });

      // Close on outside click
      dialog.addEventListener('click', (e) => {
        if (e.target === dialog) {
          cleanup();
          resolve(null);
        }
      });
    });
  };

  // Show forgot password view
  if (showForgotPassword) {
    return <ForgotPassword onBackToLogin={() => setShowForgotPassword(false)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex flex-col lg:flex-row relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-300/5 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>
      
      {/* Login View */}
      {activeTab === 'signin' && (
        <>
          {/* Left Side - Login Form */}
          <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-4 sm:p-6 lg:p-8 relative z-10">
            <div className="w-full max-w-md">
              {/* Glassmorphism Card */}
              <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-4 sm:p-6 lg:p-8 transition-all duration-300 hover:shadow-3xl">
                <div className="mb-8 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg transform hover:scale-105 transition-transform duration-300">
                    <MapPin className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">Welcome Back</h2>
                  <p className="text-gray-600">Sign in to continue to CleanStreet</p>
                </div>

                <form onSubmit={handleSignIn} className="space-y-6">
                  <div className="space-y-5">
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-blue-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-hover:text-primary transition-colors duration-200" />
                        <Input
                          type="email"
                          placeholder="Email Address"
                          value={signInData.email}
                          onChange={(e) => setSignInData({ ...signInData, email: e.target.value })}
                          className="pl-12 pr-4 py-4 bg-gray-50/50 border border-gray-200/50 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all duration-300 placeholder:text-gray-500"
                          required
                        />
                      </div>
                    </div>

                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-blue-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-hover:text-primary transition-colors duration-200" />
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Password"
                          value={signInData.password}
                          onChange={(e) => setSignInData({ ...signInData, password: e.target.value })}
                          className="pl-12 pr-12 py-4 bg-gray-50/50 border border-gray-200/50 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all duration-300 placeholder:text-gray-500"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-primary transition-colors duration-200"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm mt-6">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="remember" 
                        checked={rememberMe}
                        onCheckedChange={setRememberMe}
                        className="data-[state=checked]:bg-primary border-gray-300"
                      />
                      <label htmlFor="remember" className="text-gray-600 cursor-pointer hover:text-gray-800 transition-colors">Remember me</label>
                    </div>
                    <button 
                      type="button" 
                      onClick={() => setShowForgotPassword(true)}
                      className="text-primary hover:text-primary/80 font-medium transition-colors duration-200"
                    >
                      Forgot password?
                    </button>
                  </div>

                  <div className="pt-2">
                    <Button 
                      type="submit" 
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white rounded-xl py-4 px-8 font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 disabled:transform-none disabled:hover:scale-100"
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                          Signing In...
                        </>
                      ) : (
                        'Sign In'
                      )}
                    </Button>
                  </div>
                </form>

                <div className="mt-8">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-white/80 text-gray-500">or continue with</span>
                    </div>
                  </div>
                  
                  <div className="mt-6 grid grid-cols-3 gap-3">
                    <button 
                      onClick={() => handleSocialLogin('google')}
                      disabled={socialLoading !== null}
                      className="w-full h-12 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl flex items-center justify-center space-x-2 hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 font-semibold disabled:opacity-50 disabled:transform-none disabled:hover:scale-100"
                    >
                      {socialLoading === 'google' ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      ) : (
                        <GoogleIcon />
                      )}
                      <span className="hidden sm:inline">
                        {socialLoading === 'google' ? 'Signing in...' : 'Google'}
                      </span>
                    </button>
                    <button 
                      onClick={() => handleSocialLogin('facebook')}
                      disabled={socialLoading !== null}
                      className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl flex items-center justify-center space-x-2 hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 font-semibold disabled:opacity-50 disabled:transform-none disabled:hover:scale-100"
                    >
                      {socialLoading === 'facebook' ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      ) : (
                        <FacebookIcon />
                      )}
                      <span className="hidden sm:inline">
                        {socialLoading === 'facebook' ? 'Signing in...' : 'Facebook'}
                      </span>
                    </button>
                    <button 
                      onClick={() => handleSocialLogin('twitter')}
                      disabled={socialLoading !== null}
                      className="w-full h-12 bg-gradient-to-r from-sky-400 to-sky-500 text-white rounded-xl flex items-center justify-center space-x-2 hover:from-sky-500 hover:to-sky-600 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 font-semibold disabled:opacity-50 disabled:transform-none disabled:hover:scale-100"
                    >
                      {socialLoading === 'twitter' ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      ) : (
                        <TwitterIcon />
                      )}
                      <span className="hidden sm:inline">
                        {socialLoading === 'twitter' ? 'Signing in...' : 'Twitter'}
                      </span>
                    </button>
                  </div>
                </div>

                <div className="mt-8 text-center">
                  <p className="text-gray-600">
                    Don't have an account?{' '}
                    <button 
                      onClick={() => setActiveTab('signup')}
                      className="text-primary font-semibold hover:text-primary/80 transition-colors duration-200"
                    >
                      Create Account
                    </button>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Welcome Panel */}
          <div className="flex-1 bg-gradient-to-br from-primary via-primary/95 to-blue-700 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/90 to-blue-700/90"></div>
            {/* Decorative Elements */}
            <div className="absolute top-20 right-20 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            <div className="absolute bottom-20 left-20 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
            <div className="absolute top-1/2 right-10 w-16 h-16 bg-white/5 rounded-full blur-lg"></div>
            
            <div className="text-center text-white max-w-lg relative z-10">
              <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center mx-auto mb-8 backdrop-blur-md shadow-2xl transform hover:scale-110 transition-transform duration-300">
                <MapPin className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                Welcome Back!
              </h2>
              <p className="text-xl opacity-90 leading-relaxed mb-8">
                Report civic issues, track progress, and help build a better community together.
              </p>
              <div className="flex items-center justify-center space-x-8 text-white/80">
                <div className="text-center">
                  <div className="text-2xl font-bold">1.2K+</div>
                  <div className="text-sm">Issues Resolved</div>
                </div>
                <div className="w-px h-12 bg-white/30"></div>
                <div className="text-center">
                  <div className="text-2xl font-bold">850+</div>
                  <div className="text-sm">Active Citizens</div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Registration View */}
      {activeTab === 'signup' && (
        <>
          {/* Left Side - Registration Form */}
          <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative z-10 overflow-y-auto">
            <div className="w-full max-w-lg">
              {/* Glassmorphism Card */}
              <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-4 sm:p-6 lg:p-8 transition-all duration-300 hover:shadow-3xl">
                <div className="mb-8 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg transform hover:scale-105 transition-transform duration-300">
                    <MapPin className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">Join CleanStreet</h2>
                  <p className="text-gray-600">Help make your community cleaner and better</p>
                  
                  {/* Enhanced Progress indicator */}
                  <div className="mt-6">
                    <div className="flex justify-center items-center space-x-3 mb-4">
                      <div className={`w-3 h-3 rounded-full transition-all duration-300 ${currentStep >= 1 ? 'bg-gradient-to-r from-primary to-primary/80 shadow-lg' : 'bg-gray-200'}`}></div>
                      <div className={`w-12 h-1 rounded-full transition-all duration-300 ${currentStep >= 2 ? 'bg-gradient-to-r from-primary to-primary/80' : 'bg-gray-200'}`}></div>
                      <div className={`w-3 h-3 rounded-full transition-all duration-300 ${currentStep >= 2 ? 'bg-gradient-to-r from-primary to-primary/80 shadow-lg' : 'bg-gray-200'}`}></div>
                      <div className={`w-12 h-1 rounded-full transition-all duration-300 ${currentStep >= 3 ? 'bg-gradient-to-r from-primary to-primary/80' : 'bg-gray-200'}`}></div>
                      <div className={`w-3 h-3 rounded-full transition-all duration-300 ${currentStep >= 3 ? 'bg-gradient-to-r from-primary to-primary/80 shadow-lg' : 'bg-gray-200'}`}></div>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-primary">
                        Step {currentStep} of 3: {' '}
                        <span className="text-gray-600">
                          {currentStep === 1 && "Personal Information"}
                          {currentStep === 2 && "Account Security"}
                          {currentStep === 3 && "Location & Role"}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleSignUp} className="space-y-6">
                  {/* Step 1: Personal Information */}
                  {currentStep === 1 && (
                    <>
                      <div className="space-y-5">
                        <div className="relative group">
                          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-blue-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          <div className="relative">
                            <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-hover:text-primary transition-colors duration-200" />
                            <Input
                              type="text"
                              placeholder="Full Name"
                              value={signUpData.name}
                              onChange={(e) => setSignUpData({ ...signUpData, name: e.target.value })}
                              className="pl-12 pr-4 py-4 bg-gray-50/50 border border-gray-200/50 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all duration-300 placeholder:text-gray-500"
                              required
                            />
                          </div>
                        </div>

                        <div className="relative group">
                          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-blue-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          <div className="relative">
                            <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-hover:text-primary transition-colors duration-200" />
                            <Input
                              type="email"
                              placeholder="Email Address"
                              value={signUpData.email}
                              onChange={(e) => setSignUpData({ ...signUpData, email: e.target.value })}
                              className="pl-12 pr-4 py-4 bg-gray-50/50 border border-gray-200/50 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all duration-300 placeholder:text-gray-500"
                              required
                            />
                          </div>
                        </div>

                        <div className="relative group">
                          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-blue-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          <div className="relative">
                            <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-hover:text-primary transition-colors duration-200" />
                            <Input
                              type="tel"
                              placeholder="Phone Number (optional)"
                              value={signUpData.phone}
                              onChange={(e) => setSignUpData({ ...signUpData, phone: e.target.value })}
                              className="pl-12 pr-4 py-4 bg-gray-50/50 border border-gray-200/50 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all duration-300 placeholder:text-gray-500"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="pt-2">
                        <Button 
                          type="button"
                          onClick={() => setCurrentStep(2)}
                          disabled={!signUpData.name || !signUpData.email}
                          className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white rounded-xl py-4 px-8 font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:transform-none disabled:hover:scale-100"
                        >
                          Continue to Security
                        </Button>
                      </div>
                    </>
                  )}

                  {/* Step 2: Account Security */}
                  {currentStep === 2 && (
                    <>
                      <div className="space-y-5">
                        <div className="relative group">
                          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-blue-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          <div className="relative">
                            <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-hover:text-primary transition-colors duration-200" />
                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder="Create Password"
                              value={signUpData.password}
                              onChange={(e) => handlePasswordChange(e.target.value)}
                              className="pl-12 pr-12 py-4 bg-gray-50/50 border border-gray-200/50 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all duration-300 placeholder:text-gray-500"
                              required
                              minLength={6}
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-primary transition-colors duration-200"
                            >
                              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                          </div>
                        </div>

                        {/* Enhanced Password Strength Indicator */}
                        {signUpData.password && (
                          <div className="bg-gray-50/80 rounded-xl p-4 space-y-3 border border-gray-200/50">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-700 font-medium">Password Strength</span>
                              <span className={`font-semibold ${passwordStrength < 50 ? 'text-red-600' : passwordStrength < 75 ? 'text-yellow-600' : 'text-green-600'}`}>
                                {getPasswordStrengthText(passwordStrength)}
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                              <div 
                                className={`h-2 rounded-full transition-all duration-500 ease-out ${getPasswordStrengthColor(passwordStrength)}`}
                                style={{ width: `${passwordStrength}%` }}
                              ></div>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <div className={`flex items-center space-x-1 ${signUpData.password.length >= 8 ? 'text-green-600' : 'text-gray-400'}`}>
                                <CheckCircle className="w-3 h-3" />
                                <span>8+ characters</span>
                              </div>
                              <div className={`flex items-center space-x-1 ${/[A-Z]/.test(signUpData.password) ? 'text-green-600' : 'text-gray-400'}`}>
                                <CheckCircle className="w-3 h-3" />
                                <span>Uppercase</span>
                              </div>
                              <div className={`flex items-center space-x-1 ${/[a-z]/.test(signUpData.password) ? 'text-green-600' : 'text-gray-400'}`}>
                                <CheckCircle className="w-3 h-3" />
                                <span>Lowercase</span>
                              </div>
                              <div className={`flex items-center space-x-1 ${/[0-9]/.test(signUpData.password) || /[^A-Za-z0-9]/.test(signUpData.password) ? 'text-green-600' : 'text-gray-400'}`}>
                                <CheckCircle className="w-3 h-3" />
                                <span>Number/Symbol</span>
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="relative group">
                          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-blue-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          <div className="relative">
                            <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-hover:text-primary transition-colors duration-200" />
                            <Input
                              type={showConfirmPassword ? "text" : "password"}
                              placeholder="Confirm Password"
                              value={signUpData.confirmPassword}
                              onChange={(e) => setSignUpData({ ...signUpData, confirmPassword: e.target.value })}
                              className="pl-12 pr-16 py-4 bg-gray-50/50 border border-gray-200/50 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all duration-300 placeholder:text-gray-500"
                              required
                            />
                            <button
                              type="button"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              className="absolute right-12 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-primary transition-colors duration-200"
                            >
                              {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                            {signUpData.confirmPassword && (
                              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                                {signUpData.password === signUpData.confirmPassword ? 
                                  <CheckCircle className="w-5 h-5 text-green-500" /> : 
                                  <AlertCircle className="w-5 h-5 text-red-500" />
                                }
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex space-x-3 pt-2">
                        <Button 
                          type="button"
                          onClick={() => setCurrentStep(1)}
                          variant="outline"
                          className="flex-1 border-primary/30 text-primary hover:bg-primary hover:text-white rounded-xl py-4 px-6 font-semibold transition-all duration-300 hover:border-primary"
                        >
                          Back
                        </Button>
                        <Button 
                          type="button"
                          onClick={() => setCurrentStep(3)}
                          disabled={!signUpData.password || !signUpData.confirmPassword || signUpData.password !== signUpData.confirmPassword || passwordStrength < 50}
                          className="flex-1 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white rounded-xl py-4 px-6 font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:transform-none disabled:hover:scale-100"
                        >
                          Continue to Location
                        </Button>
                      </div>
                    </>
                  )}

                  {/* Step 3: Location & Role */}
                  {currentStep === 3 && (
                    <>
                      <div className="space-y-6">
                        <div className="relative group">
                          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-blue-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          <div className="relative">
                            <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-hover:text-primary transition-colors duration-200" />
                            <Input
                              type="text"
                              placeholder="Your City/Location"
                              value={signUpData.location}
                              onChange={(e) => setSignUpData({ ...signUpData, location: e.target.value })}
                              className="pl-12 pr-4 py-4 bg-gray-50/50 border border-gray-200/50 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all duration-300 placeholder:text-gray-500"
                              required
                            />
                          </div>
                        </div>

                        <div className="space-y-3">
                          <Label className="text-base font-semibold text-gray-700">How would you like to participate?</Label>
                          <div className="grid gap-3">
                            {['user', 'volunteer', 'admin'].map((roleOption) => (
                              <div
                                key={roleOption}
                                className={`relative p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 hover:shadow-md ${
                                  signUpData.role === roleOption
                                    ? 'border-primary bg-primary/5 shadow-md'
                                    : 'border-gray-200 hover:border-primary/50'
                                }`}
                                onClick={() => setSignUpData({ ...signUpData, role: roleOption })}
                              >
                                <div className="flex items-center space-x-3">
                                  <div className={`p-2 rounded-lg ${signUpData.role === roleOption ? 'bg-primary text-white' : 'bg-gray-100 text-gray-400'} transition-colors duration-300`}>
                                    {roleOption === 'user' && <User className="w-5 h-5" />}
                                    {roleOption === 'volunteer' && <Users className="w-5 h-5" />}
                                    {roleOption === 'admin' && <Shield className="w-5 h-5" />}
                                  </div>
                                  <div className="flex-1">
                                    <div className="font-semibold text-gray-900 mb-1">
                                      {roleOption === 'user' && 'Citizen'}
                                      {roleOption === 'volunteer' && 'Volunteer'}
                                      {roleOption === 'admin' && 'Administrator'}
                                    </div>
                                    <div className="text-sm text-gray-600">
                                      {roleOption === 'user' && 'Report issues and vote on community problems'}
                                      {roleOption === 'volunteer' && 'Help resolve issues and assist the community'}
                                      {roleOption === 'admin' && 'Manage the platform and oversee operations'}
                                    </div>
                                  </div>
                                  {signUpData.role === roleOption && (
                                    <CheckCircle className="w-6 h-6 text-primary" />
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200/50">
                          <div className="flex items-start space-x-3">
                            <Checkbox 
                              id="terms" 
                              checked={agreesToTerms}
                              onCheckedChange={setAgreesToTerms}
                              className="mt-1 data-[state=checked]:bg-primary border-primary/30"
                            />
                            <div className="flex-1">
                              <label htmlFor="terms" className="text-sm text-gray-700 cursor-pointer leading-relaxed">
                                I agree to the{' '}
                                <button type="button" className="text-primary font-semibold hover:text-primary/80 transition-colors">
                                  Terms of Service
                                </button>{' '}
                                and{' '}
                                <button type="button" className="text-primary font-semibold hover:text-primary/80 transition-colors">
                                  Privacy Policy
                                </button>
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex space-x-3 pt-2">
                        <Button 
                          type="button"
                          onClick={() => setCurrentStep(2)}
                          variant="outline"
                          className="flex-1 border-primary/30 text-primary hover:bg-primary hover:text-white rounded-xl py-4 px-6 font-semibold transition-all duration-300 hover:border-primary"
                        >
                          Back
                        </Button>
                        <Button 
                          type="submit" 
                          disabled={loading || !signUpData.location || !agreesToTerms}
                          className="flex-1 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white rounded-xl py-4 px-6 font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:transform-none disabled:hover:scale-100"
                        >
                          {loading ? (
                            <>
                              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                              Creating Account...
                            </>
                          ) : (
                            'Create Account'
                          )}
                        </Button>
                      </div>
                    </>
                  )}
                </form>

                <div className="mt-8">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-white/80 text-gray-500">or continue with</span>
                    </div>
                  </div>
                  
                  <div className="mt-6 grid grid-cols-3 gap-3">
                    <button 
                      onClick={() => handleSocialLogin('google')}
                      disabled={socialLoading !== null}
                      className="w-full h-12 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl flex items-center justify-center space-x-2 hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 font-semibold disabled:opacity-50 disabled:transform-none disabled:hover:scale-100"
                    >
                      {socialLoading === 'google' ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      ) : (
                        <GoogleIcon />
                      )}
                      <span className="hidden sm:inline">
                        {socialLoading === 'google' ? 'Signing up...' : 'Google'}
                      </span>
                    </button>
                    <button 
                      onClick={() => handleSocialLogin('facebook')}
                      disabled={socialLoading !== null}
                      className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl flex items-center justify-center space-x-2 hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 font-semibold disabled:opacity-50 disabled:transform-none disabled:hover:scale-100"
                    >
                      {socialLoading === 'facebook' ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      ) : (
                        <FacebookIcon />
                      )}
                      <span className="hidden sm:inline">
                        {socialLoading === 'facebook' ? 'Signing up...' : 'Facebook'}
                      </span>
                    </button>
                    <button 
                      onClick={() => handleSocialLogin('twitter')}
                      disabled={socialLoading !== null}
                      className="w-full h-12 bg-gradient-to-r from-sky-400 to-sky-500 text-white rounded-xl flex items-center justify-center space-x-2 hover:from-sky-500 hover:to-sky-600 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 font-semibold disabled:opacity-50 disabled:transform-none disabled:hover:scale-100"
                    >
                      {socialLoading === 'twitter' ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      ) : (
                        <TwitterIcon />
                      )}
                      <span className="hidden sm:inline">
                        {socialLoading === 'twitter' ? 'Signing up...' : 'Twitter'}
                      </span>
                    </button>
                  </div>
                </div>

                <div className="mt-8 text-center">
                  <p className="text-gray-600">
                    Already have an account?{' '}
                    <button 
                      onClick={() => {
                        setActiveTab('signin');
                        setCurrentStep(1);
                      }}
                      className="text-primary font-semibold hover:text-primary/80 transition-colors duration-200"
                    >
                      Sign In
                    </button>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Welcome Panel */}
          <div className="flex-1 bg-gradient-to-br from-green-500 via-emerald-600 to-teal-700 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/90 to-teal-700/90"></div>
            {/* Decorative Elements */}
            <div className="absolute top-16 right-16 w-28 h-28 bg-white/10 rounded-full blur-2xl animate-pulse delay-1000"></div>
            <div className="absolute bottom-16 left-16 w-20 h-20 bg-white/10 rounded-full blur-xl animate-pulse delay-2000"></div>
            <div className="absolute top-1/3 right-8 w-14 h-14 bg-white/5 rounded-full blur-lg animate-pulse"></div>
            
            <div className="text-center text-white max-w-lg relative z-10">
              <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center mx-auto mb-8 backdrop-blur-md shadow-2xl transform hover:scale-110 transition-transform duration-300">
                <Users className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-white to-green-100 bg-clip-text text-transparent">
                Join Our Community!
              </h2>
              <p className="text-xl opacity-90 leading-relaxed mb-8">
                Sign up today to start reporting issues, tracking progress, and helping your community thrive.
              </p>
              <div className="flex items-center justify-center space-x-8 text-white/80">
                <div className="text-center">
                  <div className="text-2xl font-bold">15K+</div>
                  <div className="text-sm">Community Members</div>
                </div>
                <div className="w-px h-12 bg-white/30"></div>
                <div className="text-center">
                  <div className="text-2xl font-bold">3.2K</div>
                  <div className="text-sm">Issues Resolved</div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Demo Credentials Card - Floating */}
      <div className="fixed bottom-6 right-6 max-w-sm z-50">
        <div className="bg-white/90 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-4 transform hover:scale-105 transition-all duration-300">
          <div className="flex items-center space-x-2 mb-3">
            <div className="w-8 h-8 bg-gradient-to-r from-primary to-primary/80 rounded-lg flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <h3 className="font-semibold text-gray-900">Demo Credentials</h3>
          </div>
          <div className="space-y-2 text-sm">
            <div className="bg-gray-50/80 rounded-lg p-2">
              <div className="text-xs text-gray-500 mb-1">Admin</div>
              <div className="text-primary font-medium">admin@cleanstreet.com</div>
              <div className="text-gray-600 font-mono text-xs">password123</div>
            </div>
            <div className="bg-gray-50/80 rounded-lg p-2">
              <div className="text-xs text-gray-500 mb-1">Volunteer</div>
              <div className="text-primary font-medium">volunteer@cleanstreet.com</div>
              <div className="text-gray-600 font-mono text-xs">password123</div>
            </div>
            <div className="bg-gray-50/80 rounded-lg p-2">
              <div className="text-xs text-gray-500 mb-1">Citizen</div>
              <div className="text-primary font-medium">citizen@cleanstreet.com</div>
              <div className="text-gray-600 font-mono text-xs">password123</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}