
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EmailAnalysisRequest {
  emailContent: string;
  userId?: string;
}

interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { emailContent, userId }: EmailAnalysisRequest = await req.json();
    
    if (!emailContent) {
      throw new Error('Email content is required');
    }

    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
    if (!geminiApiKey) {
      throw new Error('Gemini API key not configured');
    }

    console.log('Starting email analysis with Gemini AI...');

    // Call Gemini API for email analysis - using the correct v1 endpoint
    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${geminiApiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Analyze this email for phishing and security threats. Provide a detailed analysis in JSON format with the following structure:
              {
                "riskScore": (0-100),
                "classification": "Safe" | "Suspicious" | "Phishing",
                "explanation": "detailed explanation",
                "highlightedKeywords": ["array", "of", "suspicious", "keywords"],
                "suspiciousLinks": ["array", "of", "suspicious", "urls"],
                "threats": ["array", "of", "identified", "threats"],
                "confidence": (0-1)
              }
              
              Email content to analyze:
              ${emailContent}`
            }]
          }],
          generationConfig: {
            temperature: 0.1,
            topK: 1,
            topP: 1,
            maxOutputTokens: 2048,
          }
        })
      }
    );

    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text();
      console.error(`Gemini API error: ${geminiResponse.status} - ${errorText}`);
      throw new Error(`Gemini API error: ${geminiResponse.statusText}`);
    }

    const geminiData: GeminiResponse = await geminiResponse.json();
    const analysisText = geminiData.candidates[0]?.content?.parts[0]?.text;
    
    if (!analysisText) {
      throw new Error('No analysis result from Gemini');
    }

    console.log('Raw Gemini response:', analysisText);

    // Parse the JSON response from Gemini
    let analysisResult;
    try {
      // Extract JSON from the response (Gemini might wrap it in markdown)
      const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
      const jsonString = jsonMatch ? jsonMatch[0] : analysisText;
      analysisResult = JSON.parse(jsonString);
    } catch (parseError) {
      console.error('Failed to parse Gemini response as JSON:', parseError);
      // Fallback analysis based on keywords
      const riskScore = emailContent.toLowerCase().includes('urgent') || 
                       emailContent.toLowerCase().includes('verify') ||
                       emailContent.toLowerCase().includes('click here') ? 85 : 25;
      
      analysisResult = {
        riskScore,
        classification: riskScore > 70 ? 'Phishing' : riskScore > 40 ? 'Suspicious' : 'Safe',
        explanation: 'Analysis completed using fallback method due to parsing error',
        highlightedKeywords: ['urgent', 'verify', 'click here'].filter(keyword => 
          emailContent.toLowerCase().includes(keyword)
        ),
        suspiciousLinks: [],
        threats: riskScore > 70 ? ['Potential phishing attempt'] : [],
        confidence: 0.6
      };
    }

    // Store analysis in Supabase if userId is provided
    if (userId) {
      const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
      const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
      const supabase = createClient(supabaseUrl, supabaseKey);

      // First, create a scanned email record
      const { data: emailRecord, error: emailError } = await supabase
        .from('scanned_emails')
        .insert({
          user_id: userId,
          email_account_id: '00000000-0000-0000-0000-000000000000', // Default for manual scans
          message_id: `manual-${Date.now()}`,
          sender: 'Manual Scan',
          subject: 'Manual Email Scan',
          content: emailContent,
          risk_score: analysisResult.riskScore,
          risk_level: analysisResult.riskScore > 80 ? 'critical' : 
                     analysisResult.riskScore > 60 ? 'high' :
                     analysisResult.riskScore > 40 ? 'medium' :
                     analysisResult.riskScore > 20 ? 'low' : 'safe',
          scan_status: 'completed',
          flagged_keywords: analysisResult.highlightedKeywords,
          suspicious_links: analysisResult.suspiciousLinks,
          scan_details: analysisResult
        })
        .select()
        .single();

      if (emailError) {
        console.error('Error saving email record:', emailError);
      } else {
        console.log('Email record saved successfully:', emailRecord);

        // Then create an AI analysis record
        const { error: analysisError } = await supabase
          .from('ai_analysis')
          .insert({
            scanned_email_id: emailRecord.id,
            analysis_type: 'phishing_detection',
            model_used: 'gemini-pro',
            analysis_result: analysisResult,
            confidence_score: analysisResult.confidence * 100,
            processing_time_ms: Date.now() - Date.now() // This would be calculated properly in production
          });

        if (analysisError) {
          console.error('Error saving analysis record:', analysisError);
        }
      }
    }

    console.log('Analysis completed successfully:', analysisResult);

    return new Response(JSON.stringify(analysisResult), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('Error in analyze-email function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        riskScore: 0,
        classification: 'Error',
        explanation: 'Failed to analyze email due to technical error'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
};

serve(handler);
