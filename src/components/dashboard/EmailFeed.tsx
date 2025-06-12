
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Flag, Search } from 'lucide-react';

const emailData = [
  {
    id: 1,
    subject: 'Urgent: Verify Your Account Now',
    sender: 'security@fake-bank.com',
    date: '2024-06-12 14:30',
    riskScore: 92,
    status: 'Phishing',
    classification: 'high'
  },
  {
    id: 2,
    subject: 'Your Amazon Order #123456',
    sender: 'orders@amazon.com',
    date: '2024-06-12 14:15',
    riskScore: 15,
    status: 'Safe',
    classification: 'safe'
  },
  {
    id: 3,
    subject: 'Limited Time Offer - Click Now!',
    sender: 'promo@suspicious-site.net',
    date: '2024-06-12 14:00',
    riskScore: 78,
    status: 'Suspicious',
    classification: 'medium'
  },
  {
    id: 4,
    subject: 'Password Reset Request',
    sender: 'noreply@microsoft.com',
    date: '2024-06-12 13:45',
    riskScore: 35,
    status: 'Low Risk',
    classification: 'low'
  },
];

const getStatusBadge = (status: string, classification: string) => {
  const variants = {
    high: 'threat-high',
    medium: 'threat-medium', 
    low: 'threat-low',
    safe: 'threat-safe'
  };
  
  return (
    <Badge className={variants[classification as keyof typeof variants] || 'threat-safe'}>
      {status}
    </Badge>
  );
};

const getRiskScoreColor = (score: number) => {
  if (score >= 80) return 'text-red-400';
  if (score >= 50) return 'text-orange-400';
  if (score >= 30) return 'text-yellow-400';
  return 'text-green-400';
};

export const EmailFeed: React.FC = () => {
  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Real-Time Email Feed</span>
          <Button variant="outline" size="sm" className="bg-background/50">
            View All
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {emailData.map((email) => (
            <div
              key={email.id}
              className="flex items-center justify-between p-4 rounded-lg border border-border/50 hover:bg-accent/20 transition-colors duration-200"
            >
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-3">
                  <h4 className="font-medium text-foreground truncate max-w-xs">
                    {email.subject}
                  </h4>
                  {getStatusBadge(email.status, email.classification)}
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>{email.sender}</span>
                  <span>•</span>
                  <span>{email.date}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-sm text-muted-foreground">Risk Score</div>
                  <div className={`text-lg font-bold ${getRiskScoreColor(email.riskScore)}`}>
                    {email.riskScore}
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm">
                    <Search className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Flag className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
