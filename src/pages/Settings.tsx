
import React from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Settings as SettingsIcon, Shield, Bell, User, Globe, Lock } from 'lucide-react';

const Settings = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
            Settings
          </h1>
          <p className="text-muted-foreground mt-2">
            Configure your security preferences and system settings
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Security Settings */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-green-400" />
                Security Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Two-Factor Authentication</Label>
                  <p className="text-xs text-muted-foreground">Add an extra layer of security</p>
                </div>
                <Switch />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Auto-Lock Sessions</Label>
                  <p className="text-xs text-muted-foreground">Automatically lock after inactivity</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Session Timeout</Label>
                <Select defaultValue="30min">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15min">15 minutes</SelectItem>
                    <SelectItem value="30min">30 minutes</SelectItem>
                    <SelectItem value="1hour">1 hour</SelectItem>
                    <SelectItem value="2hours">2 hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-blue-400" />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Email Alerts</Label>
                  <p className="text-xs text-muted-foreground">Get notified of new threats</p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Real-time Notifications</Label>
                  <p className="text-xs text-muted-foreground">Instant threat detection alerts</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Weekly Reports</Label>
                  <p className="text-xs text-muted-foreground">Automated weekly summaries</p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>

          {/* Profile Settings */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5 text-purple-400" />
                Profile Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input id="fullName" defaultValue="Security Admin" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" defaultValue="admin@company.com" />
              </div>

              <div className="space-y-2">
                <Label>Role</Label>
                <Select defaultValue="admin">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Administrator</SelectItem>
                    <SelectItem value="analyst">Security Analyst</SelectItem>
                    <SelectItem value="user">User</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button className="w-full">Update Profile</Button>
            </CardContent>
          </Card>

          {/* System Settings */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <SettingsIcon className="w-5 h-5 text-orange-400" />
                System Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Default Language</Label>
                <Select defaultValue="en">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                    <SelectItem value="de">German</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Timezone</Label>
                <Select defaultValue="utc">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="utc">UTC</SelectItem>
                    <SelectItem value="est">EST</SelectItem>
                    <SelectItem value="pst">PST</SelectItem>
                    <SelectItem value="gmt">GMT</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Dark Mode</Label>
                  <p className="text-xs text-muted-foreground">Toggle dark/light theme</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Danger Zone */}
        <Card className="glass-card border-red-500/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-400">
              <Lock className="w-5 h-5" />
              Danger Zone
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-red-500/10 border border-red-500/20">
              <div>
                <p className="font-medium text-red-400">Reset All Settings</p>
                <p className="text-xs text-muted-foreground">This will restore all settings to default values</p>
              </div>
              <Button variant="destructive">Reset</Button>
            </div>
            
            <div className="flex items-center justify-between p-4 rounded-lg bg-red-500/10 border border-red-500/20">
              <div>
                <p className="font-medium text-red-400">Delete Account</p>
                <p className="text-xs text-muted-foreground">Permanently delete your account and all data</p>
              </div>
              <Button variant="destructive">Delete</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Settings;
