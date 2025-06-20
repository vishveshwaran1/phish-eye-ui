
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailData {
  subject: string;
  sender: string;
  content: string;
  headers?: any;
}

interface AIAnalysisResult {
  riskLevel: 'safe' | 'low' | 'medium' | 'high' | 'critical';
  riskScore: number;
  flaggedKeywords: string[];
  suspiciousLinks: string[];
  reasoning: string;
}

// Mock email data for demonstration
const mockEmails: EmailData[] = [
  {
    subject: "Urgent: Verify Your Account Now",
    sender: "security@bank-update.com",
    content: "Your account will be suspended unless you verify immediately. Click here: http://suspicious-bank-link.com"
  },
  {
    subject: "Weekly Newsletter",
    sender: "newsletter@company.com", 
    content: "Here's your weekly update with the latest news and updates from our team."
  },
  {
    subject: "You've Won $1,000,000!",
    sender: "lottery@winner.biz",
    content: "Congratulations! You've won our lottery. Send us your banking details to claim your prize."
  }
];

function analyzeEmail(email: EmailData): AIAnalysisResult {
  let riskScore = 0;
  const flaggedKeywords: string[] = [];
  const suspiciousLinks: string[] = [];
  
  // Check for phishing keywords
  const phishingKeywords = [
    'urgent', 'verify', 'suspended', 'click here', 'banking details', 
    'won', 'lottery', 'congratulations', 'claim', 'prize'
  ];
  
  phishingKeywords.forEach(keyword => {
    if (email.subject?.toLowerCase().includes(keyword) || 
        email.content?.toLowerCase().includes(keyword)) {
      flaggedKeywords.push(keyword);
      riskScore += 15;
    }
  });
  
  // Check for suspicious links
  const linkPattern = /https?:\/\/[^\s]+/g;
  const links = email.content?.match(linkPattern) || [];
  
  links.forEach(link => {
    if (!link.includes('https://') || 
        link.includes('suspicious') || 
        !link.includes('.com') && !link.includes('.org')) {
      suspiciousLinks.push(link);
      riskScore += 20;
    }
  });
  
  // Check sender reputation
  if (email.sender?.includes('update') || 
      email.sender?.includes('security') || 
      email.sender?.includes('.biz')) {
    riskScore += 10;
  }
  
  // Determine risk level
  let riskLevel: 'safe' | 'low' | 'medium' | 'high' | 'critical';
  if (riskScore >= 80) riskLevel = 'critical';
  else if (riskScore >= 60) riskLevel = 'high';
  else if (riskScore >= 40) riskLevel = 'medium';
  else if (riskScore >= 20) riskLevel = 'low';
  else riskLevel = 'safe';
  
  riskScore = Math.min(riskScore, 100);
  
  return {
    riskLevel,
    riskScore,
    flaggedKeywords,
    suspiciousLinks,
    reasoning: `Email analysis based on content patterns, sender reputation, and link safety.`
  };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data: { user } } = await supabaseClient.auth.getUser(token);

    if (!user) {
      throw new Error("Unauthorized");
    }

    const { action } = await req.json();

    if (action === 'scan_recent') {
      // Get user's email accounts
      const { data: emailAccounts } = await supabaseClient
        .from('email_accounts')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true);

      if (!emailAccounts || emailAccounts.length === 0) {
        throw new Error('No active email accounts found');
      }

      // For demo purposes, analyze mock emails
      const results = [];
      
      for (const email of mockEmails) {
        const analysis = analyzeEmail(email);
        
        // Store the scanned email
        const { data: scannedEmail } = await supabaseClient
          .from('scanned_emails')
          .insert({
            email_account_id: emailAccounts[0].id,
            user_id: user.id,
            message_id: `mock_${Date.now()}_${Math.random()}`,
            subject: email.subject,
            sender: email.sender,
            content: email.content,
            risk_level: analysis.riskLevel,
            risk_score: analysis.riskScore,
            scan_status: 'completed',
            flagged_keywords: analysis.flaggedKeywords,
            suspicious_links: analysis.suspiciousLinks,
            scanned_at: new Date().toISOString()
          })
          .select()
          .single();

        if (scannedEmail) {
          // Store AI analysis details
          await supabaseClient
            .from('ai_analysis')
            .insert({
              scanned_email_id: scannedEmail.id,
              model_used: 'PhishGuard AI v1.0',
              analysis_type: 'content_analysis',
              confidence_score: analysis.riskScore,
              analysis_result: {
                reasoning: analysis.reasoning,
                patterns_detected: analysis.flaggedKeywords,
                links_analyzed: analysis.suspiciousLinks.length
              }
            });
        }

        results.push({
          email: email.subject,
          risk: analysis.riskLevel,
          score: analysis.riskScore
        });
      }

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: `Scanned ${results.length} emails`,
          results 
        }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    throw new Error('Invalid action');

  } catch (error) {
    console.error('Error in scan-emails function:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Internal server error' 
      }),
      { 
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
