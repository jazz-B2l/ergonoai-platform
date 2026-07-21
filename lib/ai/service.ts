import { supabase } from '@/lib/supabase';
import { getGroqProvider, getGroqClient } from './groq';
import { safeParseJson } from './parser';
import { DEFAULT_CHAT_MODEL, DEFAULT_ANALYSIS_MODEL, DEFAULT_CHAT_CONFIG, DEFAULT_ANALYSIS_CONFIG } from './models';
import { AI_CONSTANTS } from './constants';
import * as Prompts from './prompts';
import {
  ChatCompletionMessage,
  AssessmentAnalysisResult,
  RecommendationItem,
  ExecutiveReportResult,
  HazardExplanationResult,
  CorrectiveActionItem,
  RagDocument,
  RagQueryOptions
} from './types';

// Simple in-memory rate limiter
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

/**
 * Checks rate limits for a given user or IP key.
 */
export function checkRateLimit(key: string, limit: number = AI_CONSTANTS.MAX_REQUESTS_PER_MINUTE, windowMs: number = 60000) {
  const now = Date.now();
  const entry = rateLimitMap.get(key);

  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(key, { count: 1, resetTime: now + windowMs });
    return { allowed: true, remaining: limit - 1, resetTime: now + windowMs };
  }

  if (entry.count >= limit) {
    return { allowed: false, remaining: 0, resetTime: entry.resetTime };
  }

  entry.count += 1;
  return { allowed: true, remaining: limit - entry.count, resetTime: entry.resetTime };
}

/**
 * Sanitize input text to mitigate prompt injection.
 */
function sanitizeInput(text: string, maxLength: number = 2000): string {
  if (!text) return '';
  // Trim and limit length
  let sanitized = text.substring(0, maxLength);
  // Remove markdown code block delimiters that could close prompt fences
  sanitized = sanitized.replace(/```/g, '` ` `');
  return sanitized;
}

/**
 * RAG context retriever placeholder.
 * This establishes the abstraction points for ISO standards, OSHA, NMQ, RULA, REBA, etc.
 */
export async function retrieveRagContext(query: string, options?: RagQueryOptions): Promise<RagDocument[]> {
  const sources = options?.sources || ['ISO 7730', 'NMQ', 'RULA', 'REBA', 'OSHA'];
  const limit = options?.limit || 3;
  
  console.log(`[RAG SEARCH] Searching vector space for: "${query}" | Sources: ${sources.join(', ')} | Limit: ${limit}`);
  
  // Future implementation:
  // const { data, error } = await supabase.rpc('match_documents', { query_embedding, match_threshold, match_count });
  
  // Returns empty mock context as required for RAG prep
  return [];
}

/**
 * Formats RAG documents as prompt context text.
 */
function formatRagContext(docs: RagDocument[]): string {
  if (!docs || docs.length === 0) return '';
  return `### Supplemental Reference Information (RAG Context)
The following verified safety/ergonomics reference material is provided:
${docs.map((d, i) => `[Source ${i + 1}]: ${d.source}\n${d.content}`).join('\n\n')}\n`;
}

export class AiService {
  private static instance: AiService | null = null;
  private provider = getGroqProvider();

  private constructor() {}

  public static getInstance(): AiService {
    if (!AiService.instance) {
      AiService.instance = new AiService();
    }
    return AiService.instance;
  }

  /**
   * Log execution metrics securely
   */
  private logMetric(action: string, model: string, latencyMs: number, tokens?: number, error?: string) {
    console.log(JSON.stringify({
      timestamp: new Date().toISOString(),
      requestId: crypto.randomUUID(),
      action,
      model,
      latencyMs,
      tokensUsed: tokens || 0,
      status: error ? 'ERROR' : 'SUCCESS',
      error: error || null,
    }));
  }

  /**
   * Chat Assistant
   */
  async chat(
    conversationId: string | null,
    organizationId: string,
    userId: string,
    message: string,
    options?: { modelId?: string }
  ) {
    const startTime = Date.now();
    const modelId = options?.modelId || DEFAULT_CHAT_MODEL;
    const sanitizedMsg = sanitizeInput(message, 1000);

    try {
      let activeConversationId = conversationId;

      // 1. Create conversation if it does not exist
      if (!activeConversationId) {
        const title = sanitizedMsg.length > 30 ? sanitizedMsg.substring(0, 30) + '...' : sanitizedMsg;
        const { data: newConv, error: newConvErr } = await supabase
          .from('ai_conversations')
          .insert({
            organization_id: organizationId,
            user_id: userId,
            title,
            last_message_at: new Date().toISOString()
          })
          .select('id')
          .single();

        if (newConvErr || !newConv) {
          throw new Error(`Failed to create conversation in Supabase: ${newConvErr?.message}`);
        }
        activeConversationId = newConv.id;
      } else {
        // Update conversation activity timestamp
        await supabase
          .from('ai_conversations')
          .update({ last_message_at: new Date().toISOString() })
          .eq('id', activeConversationId);
      }

      // 2. Insert user message in database
      const { error: userMsgErr } = await supabase
        .from('ai_messages')
        .insert({
          conversation_id: activeConversationId,
          role: 'user',
          content: sanitizedMsg
        });

      if (userMsgErr) {
        throw new Error(`Failed to insert user message in Supabase: ${userMsgErr.message}`);
      }

      // 3. Load historical messages (limit to last 20 for context size management)
      const { data: history, error: historyErr } = await supabase
        .from('ai_messages')
        .select('role, content')
        .eq('conversation_id', activeConversationId)
        .order('created_at', { ascending: true })
        .limit(20);

      if (historyErr || !history) {
        throw new Error(`Failed to load chat history: ${historyErr?.message}`);
      }

      // 4. Retrieve RAG context if applicable
      const ragDocs = await retrieveRagContext(sanitizedMsg);
      const ragContextText = formatRagContext(ragDocs);

      // Assemble completion messages
      const messages: ChatCompletionMessage[] = [
        { role: 'system', content: Prompts.CHAT_SYSTEM_PROMPT },
      ];

      if (ragContextText) {
        messages.push({ role: 'system', content: ragContextText });
      }

      messages.push(...history.map((h: any) => ({
        role: h.role as 'user' | 'assistant' | 'system',
        content: h.content
      })));

      // 5. Invoke provider
      const response = await this.provider.chatCompletion(messages, {
        modelId,
        temperature: DEFAULT_CHAT_CONFIG.temperature,
        maxTokens: DEFAULT_CHAT_CONFIG.maxTokens,
        timeoutMs: DEFAULT_CHAT_CONFIG.timeoutMs,
      });

      // 6. Save assistant response to DB
      const { error: assistantMsgErr } = await supabase
        .from('ai_messages')
        .insert({
          conversation_id: activeConversationId,
          role: 'assistant',
          content: response.content,
          tokens_used: response.totalTokens
        });

      if (assistantMsgErr) {
        throw new Error(`Failed to insert assistant message in Supabase: ${assistantMsgErr.message}`);
      }

      this.logMetric('chat', modelId, Date.now() - startTime, response.totalTokens);

      return {
        conversationId: activeConversationId,
        content: response.content,
        tokensUsed: response.totalTokens,
      };
    } catch (error: any) {
      this.logMetric('chat', modelId, Date.now() - startTime, 0, error.message);
      throw error;
    }
  }

  /**
   * Assessment Analysis
   */
  async analyzeAssessment(
    responseId: string,
    options?: { modelId?: string }
  ): Promise<AssessmentAnalysisResult> {
    const startTime = Date.now();
    const modelId = options?.modelId || DEFAULT_ANALYSIS_MODEL;

    try {
      // 1. Fetch response
      const { data: response, error: respErr } = await supabase
        .from('assessment_responses')
        .select('*')
        .eq('id', responseId)
        .single();

      if (respErr || !response) {
        throw new Error(`${AI_CONSTANTS.ERRORS.RECORD_NOT_FOUND} (Response: ${responseId})`);
      }

      // 2. Fetch assignment
      const { data: assignment, error: assignErr } = await supabase
        .from('assessment_assignments')
        .select('*')
        .eq('id', response.assignment_id)
        .single();

      if (assignErr || !assignment) {
        throw new Error(`${AI_CONSTANTS.ERRORS.RECORD_NOT_FOUND} (Assignment: ${response.assignment_id})`);
      }

      // 3. Fetch campaign & template
      const { data: campaign, error: campErr } = await supabase
        .from('assessment_campaigns')
        .select('*')
        .eq('id', assignment.campaign_id)
        .single();

      if (campErr || !campaign) {
        throw new Error(`${AI_CONSTANTS.ERRORS.RECORD_NOT_FOUND} (Campaign: ${assignment.campaign_id})`);
      }

      const { data: template, error: tempErr } = await supabase
        .from('assessment_templates')
        .select('*')
        .eq('id', campaign.template_id)
        .single();

      if (tempErr || !template) {
        throw new Error(`${AI_CONSTANTS.ERRORS.RECORD_NOT_FOUND} (Template: ${campaign.template_id})`);
      }

      // 4. Fetch Employee member details (with profile) and biometric profile
      const { data: member, error: memberErr } = await supabase
        .from('organization_members')
        .select('*, profiles!organization_members_profile_id_fkey(*)')
        .eq('id', assignment.member_id)
        .single();

      if (memberErr || !member) {
        throw new Error(`${AI_CONSTANTS.ERRORS.RECORD_NOT_FOUND} (Member: ${assignment.member_id})`);
      }

      const { data: employeeProfile } = await supabase
        .from('employee_profiles')
        .select('*')
        .eq('member_id', assignment.member_id)
        .maybeSingle();

      // 5. Fetch structural locations (department & site & organization)
      const { data: department } = member.department_id
        ? await supabase.from('departments').select('*').eq('id', member.department_id).maybeSingle()
        : { data: null };

      const { data: site } = member.site_id
        ? await supabase.from('sites').select('*').eq('id', member.site_id).maybeSingle()
        : { data: null };

      const { data: organization } = campaign.organization_id
        ? await supabase.from('organizations').select('*').eq('id', campaign.organization_id).maybeSingle()
        : { data: null };

      // 6. Fetch answers, question text details, and options
      const { data: answers, error: answersErr } = await supabase
        .from('response_answers')
        .select('*, assessment_questions(*), question_options(*)')
        .eq('response_id', responseId);

      if (answersErr || !answers) {
        throw new Error(`Failed to load answers for response: ${answersErr?.message}`);
      }

      // Format answers context
      const formattedAnswers = answers.map((a: any) => ({
        questionText: a.assessment_questions?.question_text || 'N/A',
        questionCode: a.assessment_questions?.question_code || 'N/A',
        category: a.assessment_questions?.category || '',
        value: a.answer_text || a.numeric_answer?.toString() || a.question_options?.value || 'N/A',
        label: a.question_options?.label || '',
        note: '' // Optional text notes if present
      }));

      // Construct user prompt
      const userPrompt = Prompts.generateAssessmentAnalysisUserPrompt({
        employee: {
          jobTitle: member.job_title,
          gender: employeeProfile?.gender,
          heightCm: employeeProfile?.height_cm,
          weightKg: employeeProfile?.weight_kg,
          dominantHand: employeeProfile?.dominant_hand,
          workingHoursPerDay: employeeProfile?.extra_characteristics?.working_hours_per_day,
          notes: employeeProfile?.notes
        },
        organization,
        department,
        site,
        assessment: { title: campaign.title },
        template,
        answers: formattedAnswers
      });

      // 7. Invoke Groq
      const systemPrompt = Prompts.ASSESSMENT_ANALYSIS_SYSTEM_PROMPT;
      const responseObj = await this.provider.chatCompletion([
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ], {
        modelId,
        temperature: DEFAULT_ANALYSIS_CONFIG.temperature,
        maxTokens: DEFAULT_ANALYSIS_CONFIG.maxTokens,
        timeoutMs: DEFAULT_ANALYSIS_CONFIG.timeoutMs,
      });

      // 8. Parse JSON response safely
      const parsedResult = safeParseJson<AssessmentAnalysisResult>(responseObj.content);

      // 9. Save analysis result in DB (assessment_ai_analysis)
      const { data: existingAnalysis } = await supabase
        .from('assessment_ai_analysis')
        .select('id')
        .eq('response_id', responseId)
        .maybeSingle();

      const analysisData = {
        response_id: responseId,
        ai_model: this.provider.name,
        ai_model_version: modelId,
        overall_risk_score: parsedResult.overallRiskScore,
        risk_level: parsedResult.riskLevel,
        confidence_score: parsedResult.confidenceScore,
        summary: parsedResult.summary,
        recommendations: JSON.stringify(parsedResult.recommendations),
        detected_risks: parsedResult.detectedRisks,
        body_part_scores: parsedResult.bodyPartScores || {},
        category_scores: parsedResult.categoryScores || {},
        generated_at: new Date().toISOString()
      };

      let analysisId: string;

      if (existingAnalysis) {
        const { error: updateErr } = await supabase
          .from('assessment_ai_analysis')
          .update(analysisData)
          .eq('id', existingAnalysis.id);

        if (updateErr) {
          throw new Error(`${AI_CONSTANTS.ERRORS.TRANSACTION_FAILED} Details: ${updateErr.message}`);
        }
        analysisId = existingAnalysis.id;
      } else {
        const { data: insertedAnalysis, error: insertErr } = await supabase
          .from('assessment_ai_analysis')
          .insert(analysisData)
          .select('id')
          .single();

        if (insertErr || !insertedAnalysis) {
          throw new Error(`${AI_CONSTANTS.ERRORS.TRANSACTION_FAILED} Details: ${insertErr?.message}`);
        }
        analysisId = insertedAnalysis.id;
      }

      // 10. Clean up any existing records for findings/recommendations (cascade updates)
      await supabase.from('assessment_ai_findings').delete().eq('analysis_id', analysisId);
      await supabase.from('assessment_ai_recommendations').delete().eq('analysis_id', analysisId);

      // 11. Write individual findings to `assessment_ai_findings`
      if (parsedResult.detectedRisks && parsedResult.detectedRisks.length > 0) {
        const findingsData = parsedResult.detectedRisks.map(r => ({
          analysis_id: analysisId,
          body_part: r.body_part || null,
          category: r.category || null,
          finding: r.finding,
          severity: r.severity.toUpperCase(),
          score: r.score || null
        }));

        const { error: findErr } = await supabase.from('assessment_ai_findings').insert(findingsData);
        if (findErr) {
          console.error('Failed to insert assessment findings:', findErr);
        }
      }

      // 12. Write recommendations to `assessment_ai_recommendations`
      if (parsedResult.recommendations && parsedResult.recommendations.length > 0) {
        const recsData = parsedResult.recommendations.map(r => ({
          analysis_id: analysisId,
          title: r.substring(0, 80) + (r.length > 80 ? '...' : ''),
          description: r,
          priority: parsedResult.riskLevel.toUpperCase(), // default to risk level severity priority
          category: 'Ergonomics',
          status: 'PENDING'
        }));

        const { error: recErr } = await supabase.from('assessment_ai_recommendations').insert(recsData);
        if (recErr) {
          console.error('Failed to insert assessment recommendations:', recErr);
        }
      }

      // 13. Update overall risk score on the main response table for UI queries
      await supabase
        .from('assessment_responses')
        .update({ ai_risk_score: parsedResult.overallRiskScore })
        .eq('id', responseId);

      this.logMetric('analyzeAssessment', modelId, Date.now() - startTime, responseObj.totalTokens);

      return parsedResult;
    } catch (error: any) {
      this.logMetric('analyzeAssessment', modelId, Date.now() - startTime, 0, error.message);
      throw error;
    }
  }

  /**
   * Generate recommendations
   */
  async generateRecommendations(
    findings: string[],
    hazards?: string[],
    context?: string,
    options?: { modelId?: string }
  ): Promise<RecommendationItem[]> {
    const startTime = Date.now();
    const modelId = options?.modelId || DEFAULT_ANALYSIS_MODEL;

    try {
      const userPrompt = Prompts.generateRecommendationsUserPrompt({ findings, hazards, context });
      const response = await this.provider.chatCompletion([
        { role: 'system', content: Prompts.RECOMMENDATIONS_SYSTEM_PROMPT },
        { role: 'user', content: userPrompt }
      ], {
        modelId,
        temperature: DEFAULT_ANALYSIS_CONFIG.temperature,
        maxTokens: DEFAULT_ANALYSIS_CONFIG.maxTokens,
        timeoutMs: DEFAULT_ANALYSIS_CONFIG.timeoutMs,
      });

      const parsed = safeParseJson<RecommendationItem[]>(response.content);
      this.logMetric('generateRecommendations', modelId, Date.now() - startTime, response.totalTokens);
      return parsed;
    } catch (error: any) {
      this.logMetric('generateRecommendations', modelId, Date.now() - startTime, 0, error.message);
      throw error;
    }
  }

  /**
   * Generate Executive Report
   */
  async generateExecutiveReport(
    organizationId: string,
    options?: { modelId?: string }
  ): Promise<ExecutiveReportResult> {
    const startTime = Date.now();
    const modelId = options?.modelId || DEFAULT_ANALYSIS_MODEL;

    try {
      // 1. Fetch organization details
      const { data: organization, error: orgErr } = await supabase
        .from('organizations')
        .select('*')
        .eq('id', organizationId)
        .single();

      if (orgErr || !organization) {
        throw new Error(`${AI_CONSTANTS.ERRORS.RECORD_NOT_FOUND} (Organization: ${organizationId})`);
      }

      // 2. Fetch all campaigns linked to this organization
      const { data: campaigns } = await supabase
        .from('assessment_campaigns')
        .select('id')
        .eq('organization_id', organizationId);

      const campaignIds = (campaigns || []).map(c => c.id);

      if (campaignIds.length === 0) {
        throw new Error('No assessment campaign found. You must create an assessment campaign before generating an executive report.');
      }

      // Fetch all assignments
      const { data: assignments } = await supabase
        .from('assessment_assignments')
        .select('id')
        .in('campaign_id', campaignIds);

      const assignmentIds = (assignments || []).map(a => a.id);

      if (assignmentIds.length === 0) {
        throw new Error('No employee assessment assignments found. Employees must be assigned to an assessment campaign first.');
      }

      // Fetch responses
      const { data: responses } = await supabase
        .from('assessment_responses')
        .select('id')
        .in('assignment_id', assignmentIds);

      const totalAssessments = responses?.length || 0;
      const totalAssignments = assignmentIds.length;

      if (totalAssessments === 0) {
        throw new Error('No completed employee assessments found. Employees must finish answering their assessments before generating an executive report.');
      }

      if (totalAssessments < totalAssignments) {
        throw new Error(`Assessment campaign is still in progress (${totalAssessments} of ${totalAssignments} employees completed). All assigned employees must finish answering their assessments before generating an executive report.`);
      }

      const responseIds = (responses || []).map(r => r.id);
      let recentFindings: string[] = [];

      if (responseIds.length > 0) {
        // Fetch recent assessment analyses
        const { data: analyses } = await supabase
          .from('assessment_ai_analysis')
          .select('summary, recommendations')
          .in('response_id', responseIds)
          .order('generated_at', { ascending: false })
          .limit(10);

        if (analyses) {
          recentFindings = analyses.map(a => {
            const recs = typeof a.recommendations === 'string' ? JSON.parse(a.recommendations) : (a.recommendations || []);
            return `${a.summary} Recommendations: ${recs.slice(0, 2).join(', ')}`;
          });
        }
      }

      // 3. Fetch departments and compute statistics dynamically
      const { data: departments } = await supabase
        .from('departments')
        .select('id, name, employee_count')
        .eq('organization_id', organizationId);

      const deptMap = new Map((departments || []).map(d => [d.id, { name: d.name, employeeCount: d.employee_count || 0, scores: [] as number[] }]));

      // Fetch organization members to map member_id to department_id
      const { data: members } = await supabase
        .from('organization_members')
        .select('id, department_id')
        .eq('organization_id', organizationId);
      
      const memberDeptMap = new Map((members || []).map(m => [m.id, m.department_id]));

      if (campaignIds.length > 0) {
        // Fetch assignments for these campaigns
        const { data: assignments } = await supabase
          .from('assessment_assignments')
          .select('id, member_id')
          .in('campaign_id', campaignIds);
        
        const assignmentMemberMap = new Map((assignments || []).map(a => [a.id, a.member_id]));

        if (assignments && assignments.length > 0) {
          // Fetch responses containing AI risk scores
          const { data: responses } = await supabase
            .from('assessment_responses')
            .select('assignment_id, ai_risk_score')
            .in('assignment_id', assignments.map(a => a.id))
            .not('ai_risk_score', 'is', null);

          if (responses) {
            responses.forEach(r => {
              const memberId = assignmentMemberMap.get(r.assignment_id);
              if (memberId) {
                const deptId = memberDeptMap.get(memberId);
                if (deptId) {
                  const deptObj = deptMap.get(deptId);
                  if (deptObj && r.ai_risk_score !== null) {
                    deptObj.scores.push(Number(r.ai_risk_score));
                  }
                }
              }
            });
          }
        }
      }

      // Compile stats with calculated averages
      const deptStats = Array.from(deptMap.values()).map(d => {
        const avgScore = d.scores.length > 0
          ? d.scores.reduce((sum, s) => sum + s, 0) / d.scores.length
          : 0;
        return {
          name: d.name,
          riskScore: Math.round(avgScore),
          headcount: d.employeeCount
        };
      });

      if (recentFindings.length === 0) {
        recentFindings = [
          'No individual assessment findings recorded yet for this organization.'
        ];
      }

      // 4. Generate report via Groq
      const userPrompt = Prompts.generateReportUserPrompt({
        organizationName: organization.name,
        departmentStats: deptStats,
        recentFindingsList: recentFindings,
        totalAssessmentsCount: totalAssessments
      });

      const response = await this.provider.chatCompletion([
        { role: 'system', content: Prompts.REPORT_SYSTEM_PROMPT },
        { role: 'user', content: userPrompt }
      ], {
        modelId,
        temperature: DEFAULT_ANALYSIS_CONFIG.temperature,
        maxTokens: DEFAULT_ANALYSIS_CONFIG.maxTokens,
        timeoutMs: DEFAULT_ANALYSIS_CONFIG.timeoutMs,
      });

      const parsed = safeParseJson<ExecutiveReportResult>(response.content);

      // 4.5 Fetch all active hazards and AI recommendations for this org
      const { data: hazards } = await supabase
        .from('hazard_occurrences')
        .select('*, hazard_catalog(title, description, severity), departments(name)')
        .eq('organization_id', organizationId);

      if (hazards && hazards.length > 0) {
        parsed.hazardsDetail = hazards.map(h => ({
          title: h.hazard_catalog?.title || 'Unknown Hazard',
          status: h.status,
          severity: h.hazard_catalog?.severity || 'medium',
          description: h.hazard_catalog?.description || '',
          department: h.departments?.name || 'Unknown Department'
        }));
      } else {
        parsed.hazardsDetail = [];
      }

      if (responseIds && responseIds.length > 0) {
        // We fetch all analyses for these responses (not just limit 10)
        const { data: allAnalyses } = await supabase
          .from('assessment_ai_analysis')
          .select('id')
          .in('response_id', responseIds);

        if (allAnalyses && allAnalyses.length > 0) {
          const analysisIds = allAnalyses.map(a => a.id);
          const { data: recs } = await supabase
            .from('assessment_ai_recommendations')
            .select('*')
            .in('analysis_id', analysisIds);

          if (recs && recs.length > 0) {
            parsed.recommendationsDetail = recs.map(r => ({
              title: r.title,
              status: r.status || 'PENDING',
              priority: r.priority || 'medium',
              description: r.description
            }));
          } else {
            parsed.recommendationsDetail = [];
          }
        } else {
          parsed.recommendationsDetail = [];
        }
      } else {
        parsed.recommendationsDetail = [];
      }

      // 5. Store report in generated_reports table
      const reportContentString = JSON.stringify(parsed);
      const latencyMs = Date.now() - startTime;

      await supabase
        .from('generated_reports')
        .insert({
          organization_id: organizationId,
          name: parsed.title || 'Executive Ergonomic Summary Report',
          type: 'AI_EXECUTIVE',
          storage_path: `reports/${crypto.randomUUID()}.json`,
          parameters: {
            totalAssessments,
            departmentCount: deptStats.length,
            reportData: parsed
          },
          status: 'COMPLETED',
          generation_time_ms: latencyMs,
          file_size: reportContentString.length
        });

      this.logMetric('generateExecutiveReport', modelId, latencyMs, response.totalTokens);
      return parsed;
    } catch (error: any) {
      this.logMetric('generateExecutiveReport', modelId, Date.now() - startTime, 0, error.message);
      throw error;
    }
  }

  /**
   * Explain Hazards
   */
  async summarizeHazards(
    hazardTitle: string,
    description?: string,
    options?: { modelId?: string }
  ): Promise<HazardExplanationResult> {
    const startTime = Date.now();
    const modelId = options?.modelId || DEFAULT_CHAT_MODEL; // explanation is fast and can use chat model

    try {
      const userPrompt = Prompts.generateHazardExplanationUserPrompt(hazardTitle, description);
      const response = await this.provider.chatCompletion([
        { role: 'system', content: Prompts.HAZARD_EXPLANATION_SYSTEM_PROMPT },
        { role: 'user', content: userPrompt }
      ], {
        modelId,
        temperature: DEFAULT_CHAT_CONFIG.temperature,
        maxTokens: DEFAULT_CHAT_CONFIG.maxTokens,
        timeoutMs: DEFAULT_CHAT_CONFIG.timeoutMs,
      });

      const parsed = safeParseJson<HazardExplanationResult>(response.content);
      this.logMetric('summarizeHazards', modelId, Date.now() - startTime, response.totalTokens);
      return parsed;
    } catch (error: any) {
      this.logMetric('summarizeHazards', modelId, Date.now() - startTime, 0, error.message);
      throw error;
    }
  }

  /**
   * Generate Corrective Actions
   */
  async generateCorrectiveActions(
    hazardTitle: string,
    riskLevel: string,
    context?: string,
    options?: { modelId?: string }
  ): Promise<CorrectiveActionItem[]> {
    const startTime = Date.now();
    const modelId = options?.modelId || DEFAULT_ANALYSIS_MODEL;

    try {
      const userPrompt = Prompts.generateCorrectiveActionsUserPrompt(hazardTitle, riskLevel, context);
      const response = await this.provider.chatCompletion([
        { role: 'system', content: Prompts.CORRECTIVE_ACTIONS_SYSTEM_PROMPT },
        { role: 'user', content: userPrompt }
      ], {
        modelId,
        temperature: DEFAULT_ANALYSIS_CONFIG.temperature,
        maxTokens: DEFAULT_ANALYSIS_CONFIG.maxTokens,
        timeoutMs: DEFAULT_ANALYSIS_CONFIG.timeoutMs,
      });

      const parsed = safeParseJson<CorrectiveActionItem[]>(response.content);
      this.logMetric('generateCorrectiveActions', modelId, Date.now() - startTime, response.totalTokens);
      return parsed;
    } catch (error: any) {
      this.logMetric('generateCorrectiveActions', modelId, Date.now() - startTime, 0, error.message);
      throw error;
    }
  }
}

export const getAiService = (): AiService => AiService.getInstance();
export { getGroqClient };
