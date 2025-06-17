import React from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Download, Calendar, TrendingUp, AlertCircle, Shield } from 'lucide-react';

interface ReportsProps {
  userRole?: string;
  onLogout?: () => void;
}

const Reports: React.FC<ReportsProps> = ({ userRole, onLogout }) => {
  const reports = [
    {
      id: 1,
      title: "Weekly Threat Summary",
      description: "Comprehensive analysis of phishing attempts and security incidents",
      date: "2024-01-15",
      type: "Weekly",
      status: "Ready",
      threats: 45,
      color: "text-blue-400"
    },
    {
      id: 2,
      title: "Monthly Security Report",
      description: "Detailed monthly overview of email security metrics",
      date: "2024-01-01",
      type: "Monthly",
      status: "Ready",
      threats: 187,
      color: "text-purple-400"
    },
    {
      id: 3,
      title: "Incident Response Report",
      description: "Analysis of critical phishing incidents and response actions",
      date: "2024-01-14",
      type: "Incident",
      status: "Processing",
      threats: 12,
      color: "text-red-400"
    }
  ];

  const metrics = [
    {
      title: "Total Reports Generated",
      value: "1,247",
      change: "+12%",
      icon: FileText,
      color: "text-blue-400"
    },
    {
      title: "Critical Incidents",
      value: "23",
      change: "-8%",
      icon: AlertCircle,
      color: "text-red-400"
    },
    {
      title: "Threats Blocked",
      value: "3,456",
      change: "+24%",
      icon: Shield,
      color: "text-green-400"
    },
    {
      title: "Report Accuracy",
      value: "97.8%",
      change: "+2.1%",
      icon: TrendingUp,
      color: "text-purple-400"
    }
  ];

  return (
    <Layout userRole={userRole} onLogout={onLogout}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Security Reports
            </h1>
            <p className="text-muted-foreground mt-2">
              Generate and download comprehensive security reports
            </p>
          </div>
          <Button className="cyber-glow">
            <FileText className="w-4 h-4 mr-2" />
            Generate New Report
          </Button>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((metric, index) => (
            <Card key={index} className="glass-card hover-lift">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{metric.title}</p>
                    <p className="text-2xl font-bold mt-1">{metric.value}</p>
                    <p className={`text-sm mt-1 ${metric.change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                      {metric.change} from last period
                    </p>
                  </div>
                  <metric.icon className={`w-8 h-8 ${metric.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Reports List */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-400" />
              Available Reports
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reports.map((report) => (
                <div
                  key={report.id}
                  className="p-4 rounded-lg border border-border/30 hover:border-blue-500/30 transition-all duration-200 hover-lift"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-foreground">{report.title}</h3>
                        <Badge variant={report.status === 'Ready' ? 'default' : 'secondary'}>
                          {report.status}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {report.type}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{report.description}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {report.date}
                        </span>
                        <span className={`font-medium ${report.color}`}>
                          {report.threats} threats analyzed
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" disabled={report.status !== 'Ready'}>
                        <Download className="w-4 h-4 mr-1" />
                        Download PDF
                      </Button>
                      <Button variant="outline" size="sm" disabled={report.status !== 'Ready'}>
                        View Details
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

export default Reports;
