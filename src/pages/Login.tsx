
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Shield, User, Lock, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface LoginProps {
  onLogin: (role: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [userRole, setUserRole] = useState('user');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple demo authentication
    const validCredentials = {
      'user@company.com': { password: 'user123', role: 'user' },
      'analyst@company.com': { password: 'analyst123', role: 'analyst' },
      'admin@company.com': { password: 'admin123', role: 'admin' }
    };

    const user = validCredentials[email as keyof typeof validCredentials];
    
    if (user && user.password === password && user.role === userRole) {
      onLogin(userRole);
      navigate('/');
    } else {
      alert('Invalid credentials. Please check the demo credentials below.');
    }
  };

  const getRoleInfo = (role: string) => {
    switch (role) {
      case 'admin':
        return {
          title: 'Administrator Login',
          description: 'Full system access and management capabilities',
          color: 'text-red-400',
          bgColor: 'from-red-500/20 to-orange-500/20',
          borderColor: 'border-red-500/30'
        };
      case 'analyst':
        return {
          title: 'Security Analyst Login',
          description: 'Advanced threat analysis and reporting tools',
          color: 'text-purple-400',
          bgColor: 'from-purple-500/20 to-pink-500/20',
          borderColor: 'border-purple-500/30'
        };
      default:
        return {
          title: 'User Login',
          description: 'Email scanning and basic threat detection',
          color: 'text-blue-400',
          bgColor: 'from-blue-500/20 to-cyan-500/20',
          borderColor: 'border-blue-500/30'
        };
    }
  };

  const roleInfo = getRoleInfo(userRole);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-card/50 flex items-center justify-center p-4">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-500 rounded-2xl mb-4 shadow-2xl shadow-blue-500/25">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">
            PhishGuard
          </h1>
          <p className="text-muted-foreground">AI Security Platform</p>
        </div>

        {/* Login Card */}
        <Card className={`glass-card cyber-glow ${roleInfo.borderColor}`}>
          <CardHeader className="pb-4">
            <div className={`p-4 rounded-lg bg-gradient-to-r ${roleInfo.bgColor} border ${roleInfo.borderColor} mb-4`}>
              <CardTitle className={`text-xl ${roleInfo.color} mb-2`}>
                {roleInfo.title}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {roleInfo.description}
              </p>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-6">
              {/* Role Selection */}
              <div className="space-y-2">
                <Label htmlFor="role">Access Level</Label>
                <Select value={userRole} onValueChange={setUserRole}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Standard User
                      </div>
                    </SelectItem>
                    <SelectItem value="analyst">
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4" />
                        Security Analyst
                      </div>
                    </SelectItem>
                    <SelectItem value="admin">
                      <div className="flex items-center gap-2">
                        <Lock className="w-4 h-4" />
                        Administrator
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Email Input */}
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <Eye className="w-4 h-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Login Button */}
              <Button
                type="submit"
                className={`w-full cyber-glow font-medium ${
                  userRole === 'admin' ? 'bg-red-500 hover:bg-red-600' :
                  userRole === 'analyst' ? 'bg-purple-500 hover:bg-purple-600' :
                  'bg-blue-500 hover:bg-blue-600'
                }`}
              >
                <Lock className="w-4 h-4 mr-2" />
                Secure Login
              </Button>

              {/* Demo Credentials */}
              <div className="mt-6 p-4 rounded-lg bg-background/20 border border-border/30">
                <p className="text-xs text-muted-foreground text-center mb-2">Demo Credentials:</p>
                <div className="text-xs space-y-1">
                  <p><strong className="text-blue-400">User:</strong> user@company.com / user123</p>
                  <p><strong className="text-purple-400">Analyst:</strong> analyst@company.com / analyst123</p>
                  <p><strong className="text-red-400">Admin:</strong> admin@company.com / admin123</p>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6 text-xs text-muted-foreground">
          <p>Protected by enterprise-grade security</p>
          <p className="mt-1">© 2024 PhishGuard Security Platform</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
