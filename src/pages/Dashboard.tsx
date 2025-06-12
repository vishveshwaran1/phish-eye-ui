
import React from 'react';
import { Layout } from '@/components/layout/Layout';
import { MetricsCard } from '@/components/dashboard/MetricsCard';
import { ThreatChart } from '@/components/dashboard/ThreatChart';
import { EmailFeed } from '@/components/dashboard/EmailFeed';
import { Search, Flag, Bell, Settings } from 'lucide-react';

const Dashboard: React.FC = () => {
  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Security Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              AI-Powered Phishing Detection & Email Security
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm text-muted-foreground">Last updated</div>
            <div className="text-sm font-medium text-foreground">
              {new Date().toLocaleTimeString()}
            </div>
          </div>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricsCard
            title="Emails Scanned Today"
            value="2,847"
            change="+12%"
            changeType="increase"
            icon={Search}
            description="from yesterday"
          />
          <MetricsCard
            title="Phishing Detected"
            value="23"
            change="+3"
            changeType="increase"
            icon={Flag}
            description="threats blocked"
          />
          <MetricsCard
            title="Average Threat Score"
            value="34.2"
            change="-5.1"
            changeType="decrease"
            icon={Bell}
            description="risk reduced"
          />
          <MetricsCard
            title="Top Threat Domain"
            value="fake-bank.com"
            change="8 attempts"
            changeType="neutral"
            icon={Settings}
            description="most targeted"
          />
        </div>

        {/* Chart and Feed Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <ThreatChart />
          <EmailFeed />
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
