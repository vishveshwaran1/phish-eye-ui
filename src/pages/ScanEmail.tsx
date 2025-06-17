import React, { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle, Mail, Scan } from 'lucide-react';

interface ScanEmailProps {
  userRole?: string;
  onLogout?: () => void;
}

const ScanEmail: React.FC<ScanEmailProps> = ({ userRole, onLogout }) => {
  const [emailContent, setEmailContent] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null);

  const handleScan = async () => {
    if (!emailContent.trim()) return;
    
    setIsScanning(true);
    
    // Simulate AI scanning
    setTimeout(() => {
      const riskScore = Math.floor(Math.random() * 100);
      const result = {
        riskScore,
        classification: riskScore > 70 ? 'Phishing' : riskScore > 40 ? 'Suspicious' : 'Safe',
        explanation: riskScore > 70 
          ? 'Contains urgency indicators, suspicious links, and credential harvesting attempts'
          : riskScore > 40 
          ? 'Some suspicious elements detected but not definitively malicious'
          : 'No significant threats detected',
        highlightedKeywords: ['urgent', 'verify', 'click here', 'account suspended']
      };
      setScanResult(result);
      setIsScanning(false);
    }, 2000);
  };

  return (
    <Layout userRole={userRole} onLogout={onLogout}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Email Scanner
            </h1>
            <p className="text-muted-foreground mt-2">
              Paste an email to scan for potential threats
            </p>
          </div>
        </div>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-blue-400" />
              Paste Email Content
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Label htmlFor="email-content">Email Content</Label>
            <Textarea
              id="email-content"
              placeholder="Paste the email content here..."
              className="resize-none h-48"
              value={emailContent}
              onChange={(e) => setEmailContent(e.target.value)}
            />
            <Button
              className="w-full cyber-glow"
              onClick={handleScan}
              disabled={isScanning}
            >
              {isScanning ? (
                <>
                  <Scan className="w-4 h-4 mr-2 animate-spin" />
                  Scanning...
                </>
              ) : (
                <>
                  <Scan className="w-4 h-4 mr-2" />
                  Scan Email
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {scanResult && (
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {scanResult.classification === 'Phishing' ? (
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                ) : (
                  <CheckCircle className="w-5 h-5 text-green-400" />
                )}
                Scan Result
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">Risk Score:</span>
                <span className="text-2xl font-bold">
                  {scanResult.riskScore}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">Classification:</span>
                <Badge className={
                    scanResult.classification === 'Phishing' ? 'threat-critical' :
                    scanResult.classification === 'Suspicious' ? 'threat-high' :
                    'threat-safe'
                  }>
                  {scanResult.classification}
                </Badge>
              </div>
              <div>
                <span className="font-medium">Explanation:</span>
                <p className="text-sm text-muted-foreground">
                  {scanResult.explanation}
                </p>
              </div>
              {scanResult.highlightedKeywords && scanResult.highlightedKeywords.length > 0 && (
                <div>
                  <span className="font-medium">Highlighted Keywords:</span>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {scanResult.highlightedKeywords.map((keyword: string, index: number) => (
                      <Badge key={index} variant="secondary">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default ScanEmail;
