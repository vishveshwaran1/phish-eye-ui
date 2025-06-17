import React, { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, AlertTriangle, Shield, Clock, Flag } from 'lucide-react';

interface SuspiciousInboxProps {
  userRole?: string;
  onLogout?: () => void;
}

const SuspiciousInbox: React.FC<SuspiciousInboxProps> = ({ userRole, onLogout }) => {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const suspiciousEmails = [
    {
      id: 1,
      subject: "Urgent: Verify Your Bank Account",
      sender: "no-reply@bank-security.net",
      date: "2024-01-15 14:30",
      riskScore: 95,
      status: "phishing",
      category: "Financial Fraud"
    },
    {
      id: 2,
      subject: "Your Package Delivery Failed",
      sender: "delivery@fedx-tracking.com",
      date: "2024-01-15 13:45",
      riskScore: 87,
      status: "suspicious",
      category: "Package Scam"
    },
    {
      id: 3,
      subject: "Account Suspension Notice",
      sender: "security@microsoft-support.org",
      date: "2024-01-15 12:20",
      riskScore: 92,
      status: "phishing",
      category: "Tech Support Scam"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'phishing': return 'threat-critical';
      case 'suspicious': return 'threat-high';
      case 'safe': return 'threat-safe';
      default: return 'threat-medium';
    }
  };

  const getRiskColor = (score: number) => {
    if (score >= 90) return 'text-red-400';
    if (score >= 70) return 'text-orange-400';
    if (score >= 50) return 'text-yellow-400';
    return 'text-green-400';
  };

  return (
    <Layout userRole={userRole} onLogout={onLogout}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
              Suspicious Inbox
            </h1>
            <p className="text-muted-foreground mt-2">
              Review and manage flagged emails
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge className="threat-critical">
              <AlertTriangle className="w-3 h-3 mr-1" />
              {suspiciousEmails.filter(e => e.status === 'phishing').length} Critical
            </Badge>
            <Badge className="threat-high">
              <Flag className="w-3 h-3 mr-1" />
              {suspiciousEmails.filter(e => e.status === 'suspicious').length} Suspicious
            </Badge>
          </div>
        </div>

        {/* Filters */}
        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search emails..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Emails</SelectItem>
                  <SelectItem value="phishing">Phishing</SelectItem>
                  <SelectItem value="suspicious">Suspicious</SelectItem>
                  <SelectItem value="pending">Pending Review</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Email List */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              Flagged Emails
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {suspiciousEmails.map((email) => (
                <div
                  key={email.id}
                  className="p-4 rounded-lg border border-border/30 hover:border-red-500/30 transition-all duration-200 hover-lift"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-foreground">{email.subject}</h3>
                        <Badge className={getStatusColor(email.status)}>
                          {email.status.toUpperCase()}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {email.category}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>From: {email.sender}</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {email.date}
                        </span>
                        <span className={`font-medium ${getRiskColor(email.riskScore)}`}>
                          Risk: {email.riskScore}%
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        Investigate
                      </Button>
                      <Button variant="outline" size="sm" className="text-green-400 hover:text-green-300">
                        <Shield className="w-4 h-4 mr-1" />
                        Mark Safe
                      </Button>
                      <Button variant="destructive" size="sm">
                        <Flag className="w-4 h-4 mr-1" />
                        Report
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default SuspiciousInbox;
