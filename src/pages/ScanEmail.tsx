
import React, { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle, Mail, Scan, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ScanEmailProps {
  userRole?: string;
  onLogout?: () => void;
}

interface AnalysisResult {
  riskScore: number;
  classification: string;
  explanation: string;
  highlightedKeywords: string[];
  suspiciousLinks?: string[];
  threats?: string[];
  confidence?: number;
}

const ScanEmail: React.FC<ScanEmailProps> = ({ userRole, onLogout }) => {
  const [emailContent, setEmailContent] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<AnalysisResult | null>(null);
  const { toast } = useToast();

  const handleScan = async () => {
    if (!emailContent.trim()) {
      toast({
        title: "Error",
        description: "Please enter email content to scan",
        variant: "destructive",
      });
      return;
    }
    
    setIsScanning(true);
    setScanResult(null);
    
    try {
      console.log('Starting email analysis...');
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data, error } = await supabase.functions.invoke('analyze-email', {
        body: { 
          emailContent: emailContent.trim(),
          userId: user?.id 
        },
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw error;
      }

      if (data?.error) {
        console.error('Analysis error:', data.error);
        throw new Error(data.error);
      }

      console.log('Analysis result:', data);
      setScanResult(data);
      
      toast({
        title: "Analysis Complete",
        description: `Email classified as: ${data.classification}`,
        variant: data.riskScore > 70 ? "destructive" : "default",
      });

    } catch (error: any) {
      console.error('Error during email analysis:', error);
      toast({
        title: "Analysis Failed",
        description: error.message || "Failed to analyze email. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsScanning(false);
    }
  };

  const getRiskColor = (score: number) => {
    if (score >= 80) return 'text-red-400';
    if (score >= 60) return 'text-orange-400';
    if (score >= 40) return 'text-yellow-400';
    return 'text-green-400';
  };

  const getClassificationBadge = (classification: string) => {
    switch (classification.toLowerCase()) {
      case 'phishing':
        return 'threat-critical';
      case 'suspicious':
        return 'threat-high';
      case 'safe':
        return 'threat-safe';
      default:
        return 'threat-medium';
    }
  };

  return (
    <Layout userRole={userRole} onLogout={onLogout}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              AI Email Scanner
            </h1>
            <p className="text-muted-foreground mt-2">
              Powered by Google Gemini AI - Paste an email to scan for potential threats
            </p>
          </div>
        </div>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-blue-400" />
              Email Content Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Paste the email content here for AI-powered threat analysis..."
              className="resize-none h-48 font-mono text-sm"
              value={emailContent}
              onChange={(e) => setEmailContent(e.target.value)}
            />
            <Button
              className="w-full cyber-glow"
              onClick={handleScan}
              disabled={isScanning || !emailContent.trim()}
            >
              {isScanning ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing with Gemini AI...
                </>
              ) : (
                <>
                  <Scan className="w-4 h-4 mr-2" />
                  Scan with AI
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
                ) : scanResult.classification === 'Safe' ? (
                  <CheckCircle className="w-5 h-5 text-green-400" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-yellow-400" />
                )}
                AI Analysis Results
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Risk Score:</span>
                    <span className={`text-2xl font-bold ${getRiskColor(scanResult.riskScore)}`}>
                      {scanResult.riskScore}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-500 ${
                        scanResult.riskScore >= 80 ? 'bg-red-500' :
                        scanResult.riskScore >= 60 ? 'bg-orange-500' :
                        scanResult.riskScore >= 40 ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${scanResult.riskScore}%` }}
                    />
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="font-medium">Classification:</span>
                  <Badge className={getClassificationBadge(scanResult.classification)}>
                    {scanResult.classification}
                  </Badge>
                </div>
              </div>

              <div>
                <span className="font-medium block mb-2">AI Explanation:</span>
                <p className="text-sm text-muted-foreground bg-accent/30 p-3 rounded-lg">
                  {scanResult.explanation}
                </p>
              </div>

              {scanResult.highlightedKeywords && scanResult.highlightedKeywords.length > 0 && (
                <div>
                  <span className="font-medium block mb-2">Flagged Keywords:</span>
                  <div className="flex flex-wrap gap-2">
                    {scanResult.highlightedKeywords.map((keyword: string, index: number) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {scanResult.threats && scanResult.threats.length > 0 && (
                <div>
                  <span className="font-medium block mb-2">Identified Threats:</span>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    {scanResult.threats.map((threat: string, index: number) => (
                      <li key={index}>{threat}</li>
                    ))}
                  </ul>
                </div>
              )}

              {scanResult.confidence && (
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Analysis Confidence:</span>
                  <span>{Math.round(scanResult.confidence * 100)}%</span>
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
