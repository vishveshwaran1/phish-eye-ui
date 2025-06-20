
import React from 'react';
import { Layout } from '@/components/layout/Layout';
import { EmailConnector } from '@/components/email/EmailConnector';
import { EmailScanner } from '@/components/email/EmailScanner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, Mail, Scan } from 'lucide-react';

interface EmailSecurityProps {
  userRole?: string;
  onLogout?: () => void;
}

const EmailSecurity: React.FC<EmailSecurityProps> = ({ userRole = 'user', onLogout }) => {
  return (
    <Layout userRole={userRole} onLogout={onLogout}>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Shield className="w-8 h-8 text-blue-500" />
          <div>
            <h1 className="text-3xl font-bold">Email Security Center</h1>
            <p className="text-muted-foreground">
              Connect your email accounts and scan for security threats with AI
            </p>
          </div>
        </div>

        <Tabs defaultValue="connect" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="connect" className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Connect Emails
            </TabsTrigger>
            <TabsTrigger value="scan" className="flex items-center gap-2">
              <Scan className="w-4 h-4" />
              Scan & Analyze
            </TabsTrigger>
          </TabsList>

          <TabsContent value="connect">
            <EmailConnector />
          </TabsContent>

          <TabsContent value="scan">
            <EmailScanner />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default EmailSecurity;
