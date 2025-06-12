
import React, { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Search, Upload, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

const ScanEmail: React.FC = () => {
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
        classification: riskScore >= 80 ? 'Phishing' : riskScore >= 50 ? 'Suspicious' : riskScore >= 30 ? 'Low Risk' : 'Safe',
        explanation: riskScore >= 80 
          ? 'Contains multiple phishing indicators: urgency keywords, suspicious sender domain, and credential harvesting attempts.'
          : riskScore >= 50
          ? 'Detected suspicious patterns: promotional language and unverified sender domain.'
          : 'Email appears to be legitimate with no major threat indicators.',
        keywords: riskScore >= 50 ? ['urgent', 'verify now', 'click here', 'limited time'] : ['newsletter', 'update', 'information'],
        threats: riskScore >= 80 ? ['Credential Harvesting', 'Fake Login Page', 'Domain Spoofing'] : []
      };
      setScanResult(result);
      setIsScanning(false);
    }, 2000);
  };

  const getClassificationIcon = (classification: string) => {
    switch (classification) {
      case 'Phishing':
        return <XCircle className="w-6 h-6 text-red-400" />;
      case 'Suspicious':
        return <AlertTriangle className="w-6 h-6 text-orange-400" />;
      default:
        return <CheckCircle className="w-6 h-6 text-green-400" />;
    }
  };

  const getClassificationColor = (classification: string) => {
    switch (classification) {
      case 'Phishing':
        return 'threat-high';
      case 'Suspicious':
        return 'threat-medium';
      case 'Low Risk':
        return 'threat-low';
      default:
        return 'threat-safe';
    }
  };

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Email Scanner</h1>
          <p className="text-muted-foreground mt-1">
            Analyze emails for phishing threats using AI-powered detection
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="w-5 h-5 text-primary" />
                Email Content
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Paste your email content here (headers, body, HTML)..."
                value={emailContent}
                onChange={(e) => setEmailContent(e.target.value)}
                className="min-h-[300px] bg-background/50 border-border/50 focus:border-primary/50"
              />
              
              <div className="flex gap-3">
                <Button 
                  onClick={handleScan}
                  disabled={!emailContent.trim() || isScanning}
                  className="bg-primary hover:bg-primary/90 cyber-glow"
                >
                  {isScanning ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Scanning...
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4 mr-2" />
                      Scan Email
                    </>
                  )}
                </Button>
                
                <Button variant="outline" className="bg-background/50">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload .eml
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Results Section */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-primary" />
                Scan Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!scanResult && !isScanning && (
                <div className="text-center py-12 text-muted-foreground">
                  <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Enter email content and click "Scan Email" to analyze</p>
                </div>
              )}

              {isScanning && (
                <div className="space-y-4 py-8">
                  <div className="text-center">
                    <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-foreground font-medium">Analyzing email content...</p>
                    <p className="text-sm text-muted-foreground">Using AI and ML models</p>
                  </div>
                  <Progress value={75} className="w-full" />
                </div>
              )}

              {scanResult && (
                <div className="space-y-6">
                  {/* Risk Score */}
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-3 mb-2">
                      {getClassificationIcon(scanResult.classification)}
                      <Badge className={getClassificationColor(scanResult.classification)}>
                        {scanResult.classification}
                      </Badge>
                    </div>
                    <div className="text-3xl font-bold text-foreground mb-1">
                      {scanResult.riskScore}/100
                    </div>
                    <p className="text-sm text-muted-foreground">Risk Score</p>
                  </div>

                  {/* AI Explanation */}
                  <div className="p-4 rounded-lg bg-background/50 border border-border/50">
                    <h4 className="font-medium text-foreground mb-2">AI Analysis</h4>
                    <p className="text-sm text-muted-foreground">{scanResult.explanation}</p>
                  </div>

                  {/* Keywords */}
                  <div>
                    <h4 className="font-medium text-foreground mb-3">Detected Keywords</h4>
                    <div className="flex flex-wrap gap-2">
                      {scanResult.keywords.map((keyword: string, index: number) => (
                        <Badge 
                          key={index} 
                          variant="outline" 
                          className="bg-background/50"
                        >
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Threats */}
                  {scanResult.threats.length > 0 && (
                    <div>
                      <h4 className="font-medium text-foreground mb-3">Identified Threats</h4>
                      <div className="space-y-2">
                        {scanResult.threats.map((threat: string, index: number) => (
                          <div 
                            key={index}
                            className="flex items-center gap-2 p-2 rounded bg-red-500/10 border border-red-500/20"
                          >
                            <XCircle className="w-4 h-4 text-red-400" />
                            <span className="text-sm text-red-400">{threat}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default ScanEmail;
