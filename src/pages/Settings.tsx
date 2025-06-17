
import React, { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Settings as SettingsIcon, 
  Shield, 
  Bell, 
  Mail, 
  Users, 
  Database,
  Lock,
  AlertTriangle
} from 'lucide-react';

interface SettingsProps {
  userRole?: string;
  onLogout?: () => void;
}

const Settings: React.FC<SettingsProps> = ({ userRole = 'user', onLogout }) => {
  const [notifications, setNotifications] = useState(true);
  const [autoScan, setAutoScan] = useState(true);
  const [realTimeProtection, setRealTimeProtection] = useState(true);

  const isAdmin = userRole === 'admin';
  const isAnalyst = userRole === 'analyst' || userRole === 'admin';

  return (
    <Layout userRole={userRole} onLogout={onLogout}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Settings
            </h1>
            <p className="text-muted-foreground mt-2">
              Configure your security preferences and system settings
            </p>
          </div>
          <Badge className={`${
            isAdmin ? 'bg-red-500/20 text-red-400 border-red-500/30' : 
            isAnalyst ? 'bg-purple-500/20 text-purple-400 border-purple-500/30' : 
            'bg-blue-500/20 text-blue-400 border-blue-500/30'
          }`}>
            {userRole.toUpperCase()} Access
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* User Preferences */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <SettingsIcon className="w-5 h-5 text-blue-400" />
                User Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="notifications">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive alerts for new threats</p>
                </div>
                <Switch
                  id="notifications"
                  checked={notifications}
                  onCheckedChange={setNotifications}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="auto-scan">Auto-Scan Emails</Label>
                  <p className="text-sm text-muted-foreground">Automatically scan incoming emails</p>
                </div>
                <Switch
                  id="auto-scan"
                  checked={autoScan}
                  onCheckedChange={setAutoScan}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="real-time">Real-time Protection</Label>
                  <p className="text-sm text-muted-foreground">Monitor threats in real-time</p>
                </div>
                <Switch
                  id="real-time"
                  checked={realTimeProtection}
                  onCheckedChange={setRealTimeProtection}
                />
              </div>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-green-400" />
                Security Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="threat-threshold">Threat Detection Threshold</Label>
                <Select defaultValue="medium">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low (30%)</SelectItem>
                    <SelectItem value="medium">Medium (50%)</SelectItem>
                    <SelectItem value="high">High (70%)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="quarantine">Quarantine Action</Label>
                <Select defaultValue="auto">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="auto">Auto-quarantine</SelectItem>
                    <SelectItem value="notify">Notify only</SelectItem>
                    <SelectItem value="block">Block completely</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button className="w-full" variant="outline">
                <Lock className="w-4 h-4 mr-2" />
                Change Password
              </Button>
            </CardContent>
          </Card>

          {/* Admin/Analyst Only Settings */}
          {isAnalyst && (
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-purple-400" />
                  Advanced Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="scan-frequency">Scan Frequency</Label>
                  <Select defaultValue="realtime">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="realtime">Real-time</SelectItem>
                      <SelectItem value="hourly">Hourly</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="log-retention">Log Retention Period</Label>
                  <Select defaultValue="90days">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30days">30 Days</SelectItem>
                      <SelectItem value="90days">90 Days</SelectItem>
                      <SelectItem value="1year">1 Year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button className="w-full" variant="outline">
                  <Database className="w-4 h-4 mr-2" />
                  Export Logs
                </Button>
              </CardContent>
            </Card>
          )}

          {/* System Status */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-400" />
                System Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">AI Engine Status</span>
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                  Online
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm">Last Update</span>
                <span className="text-sm text-muted-foreground">2 hours ago</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm">Threat Database</span>
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                  Current
                </Badge>
              </div>

              <Button className="w-full" variant="outline">
                <Shield className="w-4 h-4 mr-2" />
                Check for Updates
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;
