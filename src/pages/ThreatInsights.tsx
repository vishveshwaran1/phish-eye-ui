import React from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Globe, Users, Activity, AlertTriangle, Shield } from 'lucide-react';

interface ThreatInsightsProps {
  userRole?: string;
  onLogout?: () => void;
}

const ThreatInsights: React.FC<ThreatInsightsProps> = ({ userRole, onLogout }) => {
  const topThreats = [
    { type: "Business Email Compromise", count: 156, trend: "+23%" },
    { type: "Credential Harvesting", count: 134, trend: "+18%" },
    { type: "Malware Attachments", count: 89, trend: "-12%" },
    { type: "Invoice Fraud", count: 67, trend: "+34%" },
    { type: "CEO Impersonation", count: 45, trend: "+8%" }
  ];

  const threatSources = [
    { country: "Russia", count: 234, percentage: 35 },
    { country: "China", count: 187, percentage: 28 },
    { country: "North Korea", count: 123, percentage: 18 },
    { country: "Iran", count: 89, percentage: 13 },
    { country: "Other", count: 67, percentage: 6 }
  ];

  const insights = [
    {
      title: "Peak Attack Hours",
      description: "Most phishing attacks occur between 9-11 AM when employees check emails",
      icon: Activity,
      color: "text-blue-400"
    },
    {
      title: "Target Demographics",
      description: "Finance and HR departments are 3x more likely to be targeted",
      icon: Users,
      color: "text-purple-400"
    },
    {
      title: "Attack Sophistication",
      description: "AI-generated phishing emails increased by 127% this quarter",
      icon: TrendingUp,
      color: "text-red-400"
    },
    {
      title: "Geographic Trends",
      description: "Attacks from Eastern Europe increased by 45% in the last month",
      icon: Globe,
      color: "text-green-400"
    }
  ];

  return (
    <Layout userRole={userRole} onLogout={onLogout}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Threat Insights
            </h1>
            <p className="text-muted-foreground mt-2">
              Advanced analytics and threat intelligence
            </p>
          </div>
          <Badge className="cyber-glow">
            <Activity className="w-3 h-3 mr-1" />
            Live Analysis
          </Badge>
        </div>

        {/* Key Insights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {insights.map((insight, index) => (
            <Card key={index} className="glass-card hover-lift">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg bg-background/20 ${insight.color}`}>
                    <insight.icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground mb-2">{insight.title}</h3>
                    <p className="text-sm text-muted-foreground">{insight.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Threat Types */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-400" />
                Top Threat Types
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topThreats.map((threat, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-background/20">
                    <div className="flex-1">
                      <p className="font-medium">{threat.type}</p>
                      <p className="text-sm text-muted-foreground">{threat.count} incidents</p>
                    </div>
                    <Badge className={threat.trend.startsWith('+') ? 'threat-critical' : 'threat-safe'}>
                      {threat.trend}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Geographic Distribution */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-blue-400" />
                Attack Sources
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {threatSources.map((source, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{source.country}</span>
                      <span className="text-sm text-muted-foreground">{source.count} attacks</span>
                    </div>
                    <div className="w-full bg-background/20 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-red-500 to-orange-500 h-2 rounded-full"
                        style={{ width: `${source.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Analysis Summary */}
        <Card className="glass-card cyber-glow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-cyan-400" />
              AI-Powered Analysis Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20">
                <h4 className="font-semibold text-cyan-400 mb-2">Current Threat Landscape</h4>
                <p className="text-sm text-muted-foreground">
                  Our AI analysis indicates a 34% increase in sophisticated phishing campaigns targeting financial institutions. 
                  The majority of attacks are leveraging social engineering tactics combined with credential harvesting techniques. 
                  We recommend enhanced employee training and implementing additional MFA layers for sensitive operations.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 rounded-lg bg-background/20">
                  <p className="text-2xl font-bold text-red-400">High</p>
                  <p className="text-sm text-muted-foreground">Current Threat Level</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-background/20">
                  <p className="text-2xl font-bold text-cyan-400">98.7%</p>
                  <p className="text-sm text-muted-foreground">Detection Accuracy</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-background/20">
                  <p className="text-2xl font-bold text-green-400">2.3s</p>
                  <p className="text-sm text-muted-foreground">Avg Analysis Time</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default ThreatInsights;
