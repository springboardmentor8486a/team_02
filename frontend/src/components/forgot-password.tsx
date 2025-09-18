import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent } from './ui/card';
import { toast } from 'sonner@2.0.3';
import { ArrowLeft, Mail, Shield, Zap } from 'lucide-react';

interface ForgotPasswordProps {
  onBackToLogin: () => void;
}

export function ForgotPassword({ onBackToLogin }: ForgotPasswordProps) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    try {
      setLoading(true);
      
      // Demo implementation - in real app, this would send reset email
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
      
      setResetSent(true);
      toast.success('Password reset link sent to your email!');
    } catch (error) {
      console.error('Password reset error:', error);
      toast.error('Failed to send reset link. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-300/5 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Left Side - Forgot Password Form */}
      <div className="flex-1 flex items-center justify-center p-8 relative z-10">
        <div className="w-full max-w-md">
          {/* Glassmorphism Card */}
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 transition-all duration-300 hover:shadow-3xl">
            {!resetSent ? (
              <>
                <div className="mb-8 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg transform hover:scale-105 transition-transform duration-300">
                    <Mail className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">Forgot Password?</h2>
                  <p className="text-gray-600">No worries! Enter your email address and we'll send you a reset link.</p>
                </div>

                <form onSubmit={handleResetPassword} className="space-y-6">
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-gray-700">Email Address</label>
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-blue-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-hover:text-primary transition-colors duration-200" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="Enter your email address"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="pl-12 pr-4 py-4 bg-gray-50/50 border border-gray-200/50 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all duration-300 placeholder:text-gray-500"
                          required
                        />
                      </div>
                    </div>
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
                          Sending Reset Link...
                        </>
                      ) : (
                        'Send Reset Link'
                      )}
                    </Button>
                  </div>
                </form>

                <div className="mt-6 text-center">
                  <p className="text-gray-600 mb-4">Remember your password?</p>
                  <button 
                    onClick={onBackToLogin}
                    className="inline-flex items-center text-primary font-semibold hover:text-primary/80 transition-colors duration-200"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Login
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Mail className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-4">Check Your Email!</h2>
                <p className="text-gray-600 mb-6">
                  We've sent a password reset link to <strong>{email}</strong>. 
                  Please check your email and follow the instructions to reset your password.
                </p>
                
                <div className="space-y-3">
                  <Button 
                    onClick={onBackToLogin}
                    className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white rounded-xl py-4 px-8 font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Login
                  </Button>
                  
                  <Button 
                    variant="outline"
                    onClick={() => {
                      setResetSent(false);
                      setEmail('');
                    }}
                    className="w-full border-primary/30 text-primary hover:bg-primary hover:text-white rounded-xl py-4 px-8 font-semibold transition-all duration-300 hover:border-primary"
                  >
                    Try Different Email
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Side - Welcome Panel */}
      <div className="flex-1 bg-gradient-to-br from-primary via-primary/95 to-blue-700 flex items-center justify-center p-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 to-blue-700/90"></div>
        {/* Decorative Elements */}
        <div className="absolute top-20 right-20 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute top-1/2 right-10 w-16 h-16 bg-white/5 rounded-full blur-lg"></div>
        
        <div className="text-center text-white max-w-lg relative z-10">
          <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center mx-auto mb-8 backdrop-blur-md shadow-2xl transform hover:scale-110 transition-transform duration-300">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
            Welcome Back!
          </h2>
          <p className="text-xl opacity-90 leading-relaxed mb-8">
            We're here to help you get back into your CleanStreet account. Just enter your email and we'll send you a secure reset link.
          </p>
          
          <div className="grid grid-cols-1 gap-4 max-w-sm mx-auto">
            <div className="flex items-center space-x-3 bg-white/10 rounded-xl p-4 backdrop-blur-sm">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <div className="text-left">
                <div className="font-semibold">Secure & Private</div>
                <div className="text-sm opacity-80">Your data is protected</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 bg-white/10 rounded-xl p-4 backdrop-blur-sm">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <div className="text-left">
                <div className="font-semibold">Quick Recovery</div>
                <div className="text-sm opacity-80">Reset in minutes</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}