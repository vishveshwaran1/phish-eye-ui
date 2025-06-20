
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Scan, Mail, AlertTriangle, Shield, Clock, CheckCircle } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ScannedEmail {
  id: string;
  subject: string;
  sender: string;
  risk_level: 'safe' | 'low' | 'medium' | 'high' | 'critical';
  risk_score: number;
  scan_status: 'pending' | 'scanning' | 'completed' | 'failed';
  created_at: string;
  flagged_keywords: string[];
  suspicious_links: string[];
}

export const EmailScanner: React.FC = () => {
  const [scanning, setScanning] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: scannedEmails, isLoading } = useQuery({
    queryKey: ['scanned-emails'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('scanned_emails')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      return data as ScannedEmail[];
    },
  });

  const scanEmailsMutation = useMutation({
    mutationFn: async () => {
      // Call the email scanning edge function
      const { data, error } = await supabase.functions.invoke('scan-emails', {
        body: { action: 'scan_recent' }
      });
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scanned-emails'] });
      toast({
        title: "Email scan completed",
        description: "Your recent emails have been analyzed for threats.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Scan failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleScanEmails = async () => {
    setScanning(true);
    try {
      await scanEmailsMutation.mutateAsync();
    } finally {
      setScanning(false);
    }
  };

  const getRiskBadge = (riskLevel: string, riskScore: number) => {
    const colors = {
      safe: 'bg-green-500',
      low: 'bg-yellow-500',
      medium: 'bg-orange-500',
      high: 'bg-red-500',
      critical: 'bg-red-700'
    };

    return (
      <Badge className={`${colors[riskLevel as keyof typeof colors]} text-white`}>
        {riskLevel.toUpperCase()} ({riskScore}%)
      </Badge>
    );
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'scanning':
        return <Scan className="w-4 h-4 text-blue-500 animate-spin" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Scan className="w-5 h-5" />
            Email Security Scanner
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-4">
            <p className="text-muted-foreground">
              Scan your recent emails for phishing attempts, malware, and other security threats.
            </p>
            <Button
              onClick={handleScanEmails}
              disabled={scanning || scanEmailsMutation.isPending}
              className="bg-blue-500 hover:bg-blue-600"
              size="lg"
            >
              {scanning ? (
                <>
                  <Scan className="w-4 h-4 mr-2 animate-spin" />
                  Scanning Emails...
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4 mr-2" />
                  Start Email Scan
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Scan Results</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-4">Loading scan results...</div>
          ) : scannedEmails?.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Mail className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No emails scanned yet.</p>
              <p className="text-sm">Start a scan to see results here.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {scannedEmails?.map((email) => (
                <div
                  key={email.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1">
                    {getStatusIcon(email.scan_status)}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">
                        {email.subject || 'No Subject'}
                      </p>
                      <p className="text-sm text-muted-foreground truncate">
                        From: {email.sender}
                      </p>
                      {email.flagged_keywords?.length > 0 && (
                        <div className="flex gap-1 mt-1 flex-wrap">
                          {email.flagged_keywords.slice(0, 3).map((keyword) => (
                            <Badge key={keyword} variant="outline" className="text-xs">
                              {keyword}
                            </Badge>
                          ))}
                          {email.flagged_keywords.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{email.flagged_keywords.length - 3} more
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {email.risk_level && email.risk_score !== null && 
                      getRiskBadge(email.risk_level, email.risk_score)
                    }
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
