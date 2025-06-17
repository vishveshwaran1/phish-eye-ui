
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Mail, 
  AlertTriangle, 
  Shield, 
  Eye, 
  Flag,
  Clock,
  User,
  Globe
} from 'lucide-react';

interface EmailItem {
  id: string;
  subject: string;
  sender: string;
  domain: string;
  time: string;
  riskScore: number;
  category: 'phishing' | 'suspicious' | 'safe' | 'spam';
  status: 'new' | 'reviewed' | 'flagged';
}

const mockEmails: EmailItem[] = [
  {
    id: '1',
    subject: 'Urgent: Verify Your Account Now',
    sender: 'security@fake-bank.com',
    domain: 'fake-bank.com',
    time: '2 min ago',
    riskScore: 95,
    category: 'phishing',
    status: 'new'
  },
  {
    id: '2',
    subject: 'Weekly Newsletter - Tech Updates',
    sender: 'newsletter@techcorp.com',
    domain: 'techcorp.com',
    time: '15 min ago',
    riskScore: 15,
    category: 'safe',
    status: 'reviewed'
  },
  {
    id: '3',
    subject: 'Limited Time Offer - 90% Off!',
    sender: 'deals@suspicious-shop.biz',
    domain: 'suspicious-shop.biz',
    time: '1 hour ago',
    riskScore: 72,
    category: 'suspicious',
    status: 'flagged'
  },
  {
    id: '4',
    subject: 'Re: Meeting Tomorrow',
    sender: 'colleague@company.com',
    domain: 'company.com',
    time: '2 hours ago',
    riskScore: 8,
    category: 'safe',
    status: 'reviewed'
  }
];

export const EmailFeed: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'phishing':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'suspicious':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'spam':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default:
        return 'bg-green-500/20 text-green-400 border-green-500/30';
    }
  };

  const getRiskScoreColor = (score: number) => {
    if (score >= 80) return 'text-red-400 bg-red-500/10';
    if (score >= 50) return 'text-orange-400 bg-orange-500/10';
    if (score >= 30) return 'text-yellow-400 bg-yellow-500/10';
    return 'text-green-400 bg-green-500/10';
  };

  const filteredEmails = selectedCategory === 'all' 
    ? mockEmails 
    : mockEmails.filter(email => email.category === selectedCategory);

  const getCategoryCount = (category: string) => {
    return category === 'all' 
      ? mockEmails.length 
      : mockEmails.filter(email => email.category === category).length;
  };

  return (
    <Card className="glass-card h-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Mail className="w-5 h-5 text-blue-400" />
            Email Activity Feed
          </CardTitle>
          <Badge variant="outline" className="bg-background/50">
            Live
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
          <div className="px-6 pb-4">
            <TabsList className="grid w-full grid-cols-5 bg-background/50">
              <TabsTrigger value="all" className="text-xs">
                All ({getCategoryCount('all')})
              </TabsTrigger>
              <TabsTrigger value="phishing" className="text-xs">
                Phishing ({getCategoryCount('phishing')})
              </TabsTrigger>
              <TabsTrigger value="suspicious" className="text-xs">
                Suspicious ({getCategoryCount('suspicious')})
              </TabsTrigger>
              <TabsTrigger value="spam" className="text-xs">
                Spam ({getCategoryCount('spam')})
              </TabsTrigger>
              <TabsTrigger value="safe" className="text-xs">
                Safe ({getCategoryCount('safe')})
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value={selectedCategory} className="mt-0">
            <div className="max-h-[400px] overflow-y-auto">
              {filteredEmails.map((email) => (
                <div
                  key={email.id}
                  className="flex items-center gap-4 p-4 border-b border-border/20 hover:bg-accent/30 transition-colors group"
                >
                  {/* Risk Score Circle */}
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm ${getRiskScoreColor(email.riskScore)}`}>
                    {email.riskScore}
                  </div>

                  {/* Email Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-sm text-foreground truncate">
                        {email.subject}
                      </h4>
                      <Badge className={`${getCategoryColor(email.category)} text-xs px-2 py-0.5`}>
                        {email.category}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        <span className="truncate">{email.sender}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Globe className="w-3 h-3" />
                        <span>{email.domain}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{email.time}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Flag className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Status Indicator */}
                  {email.status === 'new' && (
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                  )}
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
