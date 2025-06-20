
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, Mail, Lock, AlertCircle, User, Users, UserCheck } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Alert, AlertDescription } from '@/components/ui/alert';

export const AuthPage: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = isSignUp 
        ? await signUp(email, password)
        : await signIn(email, password);

      if (error) {
        setError(error.message);
      } else if (!isSignUp) {
        navigate('/');
      } else {
        setError('Please check your email for a confirmation link.');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Guest login with predefined credentials
      const { error } = await signIn('guest@phishguard.com', 'guest123456');
      
      if (error) {
        setError('Guest login temporarily unavailable');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError('Guest login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleAdminLogin = async () => {
    setEmail('admin@phishguard.com');
    setPassword('admin123456');
    setLoading(true);
    setError(null);
    
    try {
      const { error } = await signIn('admin@phishguard.com', 'admin123456');
      
      if (error) {
        setError('Admin credentials not configured');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError('Admin login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleAnalystLogin = async () => {
    setEmail('analyst@phishguard.com');
    setPassword('analyst123456');
    setLoading(true);
    setError(null);
    
    try {
      const { error } = await signIn('analyst@phishguard.com', 'analyst123456');
      
      if (error) {
        setError('Analyst credentials not configured');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError('Analyst login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-card/50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-500 rounded-2xl mb-4 shadow-2xl shadow-blue-500/25">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">
            PhishGuard AI
          </h1>
          <p className="text-muted-foreground">AI-Powered Email Security Platform</p>
        </div>

        <Card className="glass-card cyber-glow border-blue-500/30">
          <CardHeader>
            <CardTitle className="text-2xl text-blue-400 mb-2 text-center">
              Choose Your Access Method
            </CardTitle>
            <p className="text-sm text-muted-foreground text-center">
              Select how you'd like to access PhishGuard AI
            </p>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="standard" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="standard" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Standard
                </TabsTrigger>
                <TabsTrigger value="admin" className="flex items-center gap-2">
                  <UserCheck className="w-4 h-4" />
                  Admin
                </TabsTrigger>
                <TabsTrigger value="analyst" className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Analyst
                </TabsTrigger>
                <TabsTrigger value="guest" className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Guest
                </TabsTrigger>
              </TabsList>

              {error && (
                <Alert className="border-red-500/50 bg-red-500/10">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Standard User Login */}
              <TabsContent value="standard" className="space-y-4">
                <div className="p-4 rounded-lg bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 mb-4">
                  <h3 className="text-lg font-semibold text-blue-400 mb-2">Standard User Access</h3>
                  <p className="text-sm text-muted-foreground">
                    Full email scanning and basic threat detection capabilities
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        id="password"
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10"
                        required
                        minLength={6}
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-blue-500 hover:bg-blue-600"
                    disabled={loading}
                  >
                    {loading ? 'Processing...' : (isSignUp ? 'Create Account' : 'Sign In')}
                  </Button>

                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => setIsSignUp(!isSignUp)}
                      className="text-sm text-blue-400 hover:text-blue-300"
                    >
                      {isSignUp 
                        ? 'Already have an account? Sign in'
                        : "Don't have an account? Sign up"
                      }
                    </button>
                  </div>
                </form>
              </TabsContent>

              {/* Admin Login */}
              <TabsContent value="admin" className="space-y-4">
                <div className="p-4 rounded-lg bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500/30 mb-4">
                  <h3 className="text-lg font-semibold text-red-400 mb-2">Administrator Access</h3>
                  <p className="text-sm text-muted-foreground">
                    Full system access, user management, and advanced configuration
                  </p>
                </div>

                <Button
                  onClick={handleAdminLogin}
                  className="w-full bg-red-500 hover:bg-red-600"
                  disabled={loading}
                >
                  {loading ? 'Authenticating...' : 'Login as Administrator'}
                </Button>

                <div className="text-xs text-center text-muted-foreground">
                  <p>Demo Admin: admin@phishguard.com</p>
                </div>
              </TabsContent>

              {/* Analyst Login */}
              <TabsContent value="analyst" className="space-y-4">
                <div className="p-4 rounded-lg bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 mb-4">
                  <h3 className="text-lg font-semibold text-purple-400 mb-2">Security Analyst Access</h3>
                  <p className="text-sm text-muted-foreground">
                    Advanced threat analysis, reporting tools, and system monitoring
                  </p>
                </div>

                <Button
                  onClick={handleAnalystLogin}
                  className="w-full bg-purple-500 hover:bg-purple-600"
                  disabled={loading}
                >
                  {loading ? 'Authenticating...' : 'Login as Security Analyst'}
                </Button>

                <div className="text-xs text-center text-muted-foreground">
                  <p>Demo Analyst: analyst@phishguard.com</p>
                </div>
              </TabsContent>

              {/* Guest Login */}
              <TabsContent value="guest" className="space-y-4">
                <div className="p-4 rounded-lg bg-gradient-to-r from-green-500/20 to-teal-500/20 border border-green-500/30 mb-4">
                  <h3 className="text-lg font-semibold text-green-400 mb-2">Guest Access</h3>
                  <p className="text-sm text-muted-foreground">
                    Limited demo access to explore PhishGuard AI features
                  </p>
                </div>

                <Button
                  onClick={handleGuestLogin}
                  className="w-full bg-green-500 hover:bg-green-600"
                  disabled={loading}
                >
                  {loading ? 'Connecting...' : 'Continue as Guest'}
                </Button>

                <div className="p-3 rounded-lg bg-background/20 border border-border/30">
                  <p className="text-xs text-muted-foreground text-center">
                    Guest access includes limited features and demo data only
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="text-center mt-6 text-xs text-muted-foreground">
          <p>Protected by enterprise-grade security</p>
          <p className="mt-1">© 2024 PhishGuard AI Security Platform</p>
        </div>
      </div>
    </div>
  );
};
