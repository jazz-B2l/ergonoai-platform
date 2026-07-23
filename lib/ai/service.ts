import { supabase } from '@/lib/supabase';
import { ProviderFactory } from './provider-factory';
import { AUTO_ROUTING, PROVIDER_PRIORITY, ROUTING_POLICIES } from './routing';
import { safeParseJson } from './parser';
import {
  GEMINI_MODELS,
  GROQ_MODELS,
  DEFAULT_GEMINI_CHAT_MODEL,
  DEFAULT_GEMINI_ANALYSIS_MODEL,
  DEFAULT_GROQ_CHAT_MODEL,
  DEFAULT_GROQ_ANALYSIS_MODEL,
  DEFAULT_CHAT_CONFIG,
  DEFAULT_ANALYSIS_CONFIG
} from './models';
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
  RagQueryOptions,
  AIProviderType,
  AiCompletionResponse,
  AiModelConfig
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
  let sanitized = text.substring(0, maxLength);
  sanitized = sanitized.replace(/```/g, '` ` `');
  return sanitized;
}

/**
 * RAG context retriever placeholder.
 */
export async function retrieveRagContext(query: string, options?: RagQueryOptions): Promise<RagDocument[]> {
  const sources = options?.sources || ['ISO 7730', 'NMQ', 'RULA', 'REBA', 'OSHA'];
  const limit = options?.limit || 3;
  console.log(`[RAG SEARCH] Searching vector space for: "${query}" | Sources: ${sources.join(', ')} | Limit: ${limit}`);
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

  private constructor() {}

  public static getInstance(): AiService {
    if (!AiService.instance) {
      AiService.instance = new AiService();
    }
    return AiService.instance;
  }

  /**
   * Fetches AI preferences (provider, model, allowed providers) for an organization from Supabase
   */
  private async getOrganizationAiPreferences(organizationId?: string) {
    const defaults = {
      provider: 'auto' as AIProviderType,
      model: undefined as string | undefined,
      allowedProviders: ['gemini', 'groq'] as AIProviderType[]
    };

    if (!organizationId) return defaults;

    try {
      const { data } = await supabase
        .from('organization_settings')
        .select('extra_settings')
        .eq('organization_id', organizationId)
        .maybeSingle();

      if (data?.extra_settings) {
        const config = data.extra_settings as any;
        const ai = config.ai || {};
        return {
          provider: (ai.provider || 'auto') as AIProviderType,
          model: ai.model || undefined,
          allowedProviders: (ai.allowedProviders || ['gemini', 'groq']) as AIProviderType[],
        };
      }
    } catch (err) {
      console.error('[AI SERVICE] Failed to fetch organization settings:', err);
    }

    return defaults;
  }

  /**
   * Executes completion request with retry, timeout, fallback, and telemetry logic.
   */
  private async executeCompletion(
    task: 'chat' | 'assessment' | 'recommendations' | 'report',
    messages: ChatCompletionMessage[],
    userConfig: AiModelConfig,
    preference?: { provider?: AIProviderType; model?: string; allowedProviders?: AIProviderType[] }
  ): Promise<AiCompletionResponse> {
    let targetProvider = preference?.provider || 'auto';
    let targetModel = preference?.model;

    // 1. Resolve Auto Routing if selected
    if (targetProvider === 'auto') {
      const route = AUTO_ROUTING[task];
      targetProvider = route.provider;
      targetModel = route.model;
    }

    // 2. Filter allowed providers (Organization Admin restriction check)
    const allowed = preference?.allowedProviders || ['gemini', 'groq'];
    if (!allowed.includes(targetProvider)) {
      console.warn(`[AI SERVICE WARNING] Selected provider "${targetProvider}" is disabled by organization admin. Finding fallback.`);
      const fallbackProv = PROVIDER_PRIORITY.find(p => allowed.includes(p));
      if (!fallbackProv) {
        throw new Error('Critical Setup Error: All AI Providers are disabled for this organization.');
      }
      targetProvider = fallbackProv;
      targetModel = undefined; // trigger default model resolution below
    }

    // 3. Resolve default model if none specified
    if (!targetModel) {
      if (targetProvider === 'groq') {
        targetModel = task === 'chat' ? DEFAULT_GROQ_CHAT_MODEL : DEFAULT_GROQ_ANALYSIS_MODEL;
      } else {
        targetModel = task === 'chat' ? DEFAULT_GEMINI_CHAT_MODEL : DEFAULT_GEMINI_ANALYSIS_MODEL;
      }
    }

    // 4. Formulate Execution chain (primary target first, followed by others in priority order)
    const executionChain: Exclude<AIProviderType, 'auto'>[] = [
      targetProvider as Exclude<AIProviderType, 'auto'>,
      ...PROVIDER_PRIORITY.filter(p => p !== targetProvider && allowed.includes(p)) as Exclude<AIProviderType, 'auto'>[]
    ];

    let lastError: any = null;
    const startTime = Date.now();

    for (let i = 0; i < executionChain.length; i++) {
      const providerId = executionChain[i];
      const isFallback = i > 0;

      let modelId = isFallback ? undefined : targetModel;
      if (!modelId) {
        if (providerId === 'groq') {
          modelId = task === 'chat' ? DEFAULT_GROQ_CHAT_MODEL : DEFAULT_GROQ_ANALYSIS_MODEL;
        } else {
          modelId = task === 'chat' ? DEFAULT_GEMINI_CHAT_MODEL : DEFAULT_GEMINI_ANALYSIS_MODEL;
        }
      }

      const activeProvider = ProviderFactory.get(providerId);
      const maxRetries = ROUTING_POLICIES.maxRetries;
      const timeoutMs = userConfig.timeoutMs || ROUTING_POLICIES.timeoutMs;
      const temperature = userConfig.temperature;
      const maxTokens = userConfig.maxTokens;

      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        const requestStartTime = Date.now();
        try {
          const result = await activeProvider.chatCompletion(messages, {
            modelId,
            temperature,
            maxTokens,
            timeoutMs,
          });

          const latencyMs = Date.now() - startTime;
          const resultWithTelemetry: AiCompletionResponse = {
            ...result,
            providerUsed: providerId,
            latencyMs,
            fallbackOccurred: isFallback,
            fallbackDetails: isFallback ? `Dynamic fallback triggered after failure of initial provider. Initial error: ${lastError?.message}` : undefined,
          };

          // Telemetry Logging
          console.log(JSON.stringify({
            event: 'ai_completion_telemetry',
            timestamp: new Date().toISOString(),
            task,
            providerUsed: providerId,
            modelUsed: modelId,
            latencyMs,
            success: true,
            fallbackOccurred: isFallback,
            promptTokens: result.promptTokens || 0,
            completionTokens: result.completionTokens || 0,
            totalTokens: result.totalTokens || 0,
          }));

          return resultWithTelemetry;
        } catch (error: any) {
          const duration = Date.now() - requestStartTime;
          lastError = error;

          console.error(JSON.stringify({
            event: 'ai_completion_telemetry_error',
            timestamp: new Date().toISOString(),
            task,
            providerUsed: providerId,
            modelUsed: modelId,
            latencyMs: duration,
            success: false,
            error: error.message || error,
          }));

          const isRetryable = ROUTING_POLICIES.fallbackOnErrors.some(errName => 
            error.message?.includes(errName)
          );

          if (!isRetryable) {
            throw error; // non-retryable error
          }
        }
      }
    }

    throw new Error(`All configured AI Providers failed to complete request. Last error: ${lastError?.message}`);
  }

  /**
   * Chat Assistant
   */
  async chat(
    conversationId: string | null,
    organizationId: string,
    userId: string,
    message: string,
    options?: { modelId?: string; provider?: AIProviderType; allowedProviders?: AIProviderType[] }
  ) {
    const startTime = Date.now();
    const sanitizedMsg = sanitizeInput(message, 1000);

    const pref = await this.getOrganizationAiPreferences(organizationId);
    const provider = options?.provider || pref.provider;
    const modelId = options?.modelId || (provider !== 'auto' ? pref.model : undefined);
    const allowedProviders = options?.allowedProviders || pref.allowedProviders;

    try {
      let activeConversationId = conversationId;

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
        await supabase
          .from('ai_conversations')
          .update({ last_message_at: new Date().toISOString() })
          .eq('id', activeConversationId);
      }

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

      const { data: history, error: historyErr } = await supabase
        .from('ai_messages')
        .select('role, content')
        .eq('conversation_id', activeConversationId)
        .order('created_at', { ascending: true })
        .limit(20);

      if (historyErr || !history) {
        throw new Error(`Failed to load chat history: ${historyErr?.message}`);
      }

      const ragDocs = await retrieveRagContext(sanitizedMsg);
      const ragContextText = formatRagContext(ragDocs);

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

      const response = await this.executeCompletion('chat', messages, {
        modelId: modelId || '',
        temperature: DEFAULT_CHAT_CONFIG.temperature,
        maxTokens: DEFAULT_CHAT_CONFIG.maxTokens,
        timeoutMs: DEFAULT_CHAT_CONFIG.timeoutMs,
      }, {
        provider,
        model: modelId,
        allowedProviders
      });

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

      return {
        conversationId: activeConversationId,
        content: response.content,
        tokensUsed: response.totalTokens,
        providerUsed: response.providerUsed,
        modelUsed: response.modelUsed,
        fallbackOccurred: response.fallbackOccurred,
      };
    } catch (error: any) {
      throw error;
    }
  }

  /**
   * Assessment Analysis
   */
  async analyzeAssessment(
    responseId: string,
    options?: { modelId?: string; provider?: AIProviderType; allowedProviders?: AIProviderType[] }
  ): Promise<AssessmentAnalysisResult & { fallbackOccurred?: boolean; providerUsed?: string }> {
    const startTime = Date.now();

    try {
      const { data: response, error: respErr } = await supabase
        .from('assessment_responses')
        .select('*')
        .eq('id', responseId)
        .single();

      if (respErr || !response) {
        throw new Error(`${AI_CONSTANTS.ERRORS.RECORD_NOT_FOUND} (Response: ${responseId})`);
      }

      const { data: assignment, error: assignErr } = await supabase
        .from('assessment_assignments')
        .select('*')
        .eq('id', response.assignment_id)
        .single();

      if (assignErr || !assignment) {
        throw new Error(`${AI_CONSTANTS.ERRORS.RECORD_NOT_FOUND} (Assignment: ${response.assignment_id})`);
      }

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

      const { data: department } = member.department_id
        ? await supabase.from('departments').select('*').eq('id', member.department_id).maybeSingle()
        : { data: null };

      const { data: site } = member.site_id
        ? await supabase.from('sites').select('*').eq('id', member.site_id).maybeSingle()
        : { data: null };

      const { data: organization } = campaign.organization_id
        ? await supabase.from('organizations').select('*').eq('id', campaign.organization_id).maybeSingle()
        : { data: null };

      const { data: answers, error: answersErr } = await supabase
        .from('response_answers')
        .select('*, assessment_questions(*), question_options(*)')
        .eq('response_id', responseId);

      if (answersErr || !answers) {
        throw new Error(`Failed to load answers for response: ${answersErr?.message}`);
      }

      const formattedAnswers = answers.map((a: any) => ({
        questionText: a.assessment_questions?.question_text || 'N/A',
        questionCode: a.assessment_questions?.question_code || 'N/A',
        category: a.assessment_questions?.category || '',
        value: a.answer_text || a.numeric_answer?.toString() || a.question_options?.value || 'N/A',
        label: a.question_options?.label || '',
        note: ''
      }));

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

      const pref = await this.getOrganizationAiPreferences(campaign.organization_id);
      const provider = options?.provider || pref.provider;
      const modelId = options?.modelId || (provider !== 'auto' ? pref.model : undefined);
      const allowedProviders = options?.allowedProviders || pref.allowedProviders;

      const systemPrompt = Prompts.ASSESSMENT_ANALYSIS_SYSTEM_PROMPT;
      const responseObj = await this.executeCompletion('assessment', [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ], {
        modelId: modelId || '',
        temperature: DEFAULT_ANALYSIS_CONFIG.temperature,
        maxTokens: DEFAULT_ANALYSIS_CONFIG.maxTokens,
        timeoutMs: DEFAULT_ANALYSIS_CONFIG.timeoutMs,
      }, {
        provider,
        model: modelId,
        allowedProviders
      });

      const parsedResult = safeParseJson<AssessmentAnalysisResult>(responseObj.content);

      const { data: existingAnalysis } = await supabase
        .from('assessment_ai_analysis')
        .select('id')
        .eq('response_id', responseId)
        .maybeSingle();

      const analysisData = {
        response_id: responseId,
        ai_model: responseObj.providerUsed,
        ai_model_version: responseObj.modelUsed,
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

      await supabase.from('assessment_ai_findings').delete().eq('analysis_id', analysisId);
      await supabase.from('assessment_ai_recommendations').delete().eq('analysis_id', analysisId);

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

      if (parsedResult.recommendations && parsedResult.recommendations.length > 0) {
        const recsData = parsedResult.recommendations.map(r => ({
          analysis_id: analysisId,
          title: r.substring(0, 80) + (r.length > 80 ? '...' : ''),
          description: r,
          priority: parsedResult.riskLevel.toUpperCase(),
          category: 'Ergonomics',
          status: 'PENDING'
        }));

        const { error: recErr } = await supabase.from('assessment_ai_recommendations').insert(recsData);
        if (recErr) {
          console.error('Failed to insert assessment recommendations:', recErr);
        }
      }

      await supabase
        .from('assessment_responses')
        .update({ ai_risk_score: parsedResult.overallRiskScore })
        .eq('id', responseId);

      return {
        ...parsedResult,
        fallbackOccurred: responseObj.fallbackOccurred,
        providerUsed: responseObj.providerUsed
      };
    } catch (error: any) {
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
    options?: { modelId?: string; provider?: AIProviderType; allowedProviders?: AIProviderType[]; organizationId?: string }
  ): Promise<RecommendationItem[] & { fallbackOccurred?: boolean; providerUsed?: string }> {
    const pref = await this.getOrganizationAiPreferences(options?.organizationId);
    const provider = options?.provider || pref.provider;
    const modelId = options?.modelId || (provider !== 'auto' ? pref.model : undefined);
    const allowedProviders = options?.allowedProviders || pref.allowedProviders;

    try {
      const userPrompt = Prompts.generateRecommendationsUserPrompt({ findings, hazards, context });
      const response = await this.executeCompletion('recommendations', [
        { role: 'system', content: Prompts.RECOMMENDATIONS_SYSTEM_PROMPT },
        { role: 'user', content: userPrompt }
      ], {
        modelId: modelId || '',
        temperature: DEFAULT_ANALYSIS_CONFIG.temperature,
        maxTokens: DEFAULT_ANALYSIS_CONFIG.maxTokens,
        timeoutMs: DEFAULT_ANALYSIS_CONFIG.timeoutMs,
      }, {
        provider,
        model: modelId,
        allowedProviders
      });

      const parsed = safeParseJson<RecommendationItem[]>(response.content);
      const output = parsed as any;
      output.fallbackOccurred = response.fallbackOccurred;
      output.providerUsed = response.providerUsed;
      return output;
    } catch (error: any) {
      throw error;
    }
  }

  /**
   * Generate Executive Report
   */
  async generateExecutiveReport(
    organizationId: string,
    options?: { modelId?: string; provider?: AIProviderType; allowedProviders?: AIProviderType[] }
  ): Promise<ExecutiveReportResult & { fallbackOccurred?: boolean; providerUsed?: string }> {
    const startTime = Date.now();

    try {
      const { data: organization, error: orgErr } = await supabase
        .from('organizations')
        .select('*')
        .eq('id', organizationId)
        .single();

      if (orgErr || !organization) {
        throw new Error(`${AI_CONSTANTS.ERRORS.RECORD_NOT_FOUND} (Organization: ${organizationId})`);
      }

      const { data: campaigns } = await supabase
        .from('assessment_campaigns')
        .select('id')
        .eq('organization_id', organizationId);

      const campaignIds = (campaigns || []).map((c: any) => c.id);

      if (campaignIds.length === 0) {
        throw new Error('No assessment campaign found. You must create an assessment campaign before generating an executive report.');
      }

      const { data: assignments } = await supabase
        .from('assessment_assignments')
        .select('id')
        .in('campaign_id', campaignIds);

      const assignmentIds = (assignments || []).map((a: any) => a.id);

      if (assignmentIds.length === 0) {
        throw new Error('No employee assessment assignments found. Employees must be assigned to an assessment campaign first.');
      }

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

      const responseIds = (responses || []).map((r: any) => r.id);
      let recentFindings: string[] = [];

      if (responseIds.length > 0) {
        const { data: analyses } = await supabase
          .from('assessment_ai_analysis')
          .select('summary, recommendations')
          .in('response_id', responseIds)
          .order('generated_at', { ascending: false })
          .limit(10);

        if (analyses) {
          recentFindings = analyses.map((a: any) => {
            const recs = typeof a.recommendations === 'string' ? JSON.parse(a.recommendations) : (a.recommendations || []);
            return `${a.summary} Recommendations: ${recs.slice(0, 2).join(', ')}`;
          });
        }
      }

      const { data: departments } = await supabase
        .from('departments')
        .select('id, name, employee_count')
        .eq('organization_id', organizationId);

      const deptMap = new Map<string, any>((departments || []).map((d: any) => [d.id, { name: d.name, employeeCount: d.employee_count || 0, scores: [] as number[] }]));

      const { data: members } = await supabase
        .from('organization_members')
        .select('id, department_id')
        .eq('organization_id', organizationId);
      
      const memberDeptMap = new Map<string, any>((members || []).map((m: any) => [m.id, m.department_id]));

      if (campaignIds.length > 0) {
        const { data: assignments } = await supabase
          .from('assessment_assignments')
          .select('id, member_id')
          .in('campaign_id', campaignIds);
        
        const assignmentMemberMap = new Map<string, any>((assignments || []).map((a: any) => [a.id, a.member_id]));

        if (assignments && assignments.length > 0) {
          const { data: responses } = await supabase
            .from('assessment_responses')
            .select('assignment_id, ai_risk_score')
            .in('assignment_id', assignments.map((a: any) => a.id))
            .not('ai_risk_score', 'is', null);

          if (responses) {
            responses.forEach((r: any) => {
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

      const deptStats = Array.from(deptMap.values()).map(d => {
        const avgScore = d.scores.length > 0
          ? d.scores.reduce((sum: any, s: any) => sum + s, 0) / d.scores.length
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

      const pref = await this.getOrganizationAiPreferences(organizationId);
      const provider = options?.provider || pref.provider;
      const modelId = options?.modelId || (provider !== 'auto' ? pref.model : undefined);
      const allowedProviders = options?.allowedProviders || pref.allowedProviders;

      const userPrompt = Prompts.generateReportUserPrompt({
        organizationName: organization.name,
        departmentStats: deptStats,
        recentFindingsList: recentFindings,
        totalAssessmentsCount: totalAssessments
      });

      const responseObj = await this.executeCompletion('report', [
        { role: 'system', content: Prompts.REPORT_SYSTEM_PROMPT },
        { role: 'user', content: userPrompt }
      ], {
        modelId: modelId || '',
        temperature: DEFAULT_ANALYSIS_CONFIG.temperature,
        maxTokens: DEFAULT_ANALYSIS_CONFIG.maxTokens,
        timeoutMs: DEFAULT_ANALYSIS_CONFIG.timeoutMs,
      }, {
        provider,
        model: modelId,
        allowedProviders
      });

      const parsed = safeParseJson<ExecutiveReportResult>(responseObj.content);

      const { data: hazards } = await supabase
        .from('hazard_occurrences')
        .select('*, hazard_catalog(title, description, severity), departments(name)')
        .eq('organization_id', organizationId);

      if (hazards && hazards.length > 0) {
        parsed.hazardsDetail = hazards.map((h: any) => ({
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
        const { data: allAnalyses } = await supabase
          .from('assessment_ai_analysis')
          .select('id')
          .in('response_id', responseIds);

        if (allAnalyses && allAnalyses.length > 0) {
          const analysisIds = allAnalyses.map((a: any) => a.id);
          const { data: recs } = await supabase
            .from('assessment_ai_recommendations')
            .select('*')
            .in('analysis_id', analysisIds);

          if (recs && recs.length > 0) {
            parsed.recommendationsDetail = recs.map((r: any) => ({
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

      return {
        ...parsed,
        fallbackOccurred: responseObj.fallbackOccurred,
        providerUsed: responseObj.providerUsed
      };
    } catch (error: any) {
      throw error;
    }
  }

  /**
   * Explain Hazards
   */
  async summarizeHazards(
    hazardTitle: string,
    description?: string,
    options?: { modelId?: string; provider?: AIProviderType; allowedProviders?: AIProviderType[]; organizationId?: string }
  ): Promise<HazardExplanationResult & { fallbackOccurred?: boolean; providerUsed?: string }> {
    const pref = await this.getOrganizationAiPreferences(options?.organizationId);
    const provider = options?.provider || pref.provider;
    const modelId = options?.modelId || (provider !== 'auto' ? pref.model : undefined);
    const allowedProviders = options?.allowedProviders || pref.allowedProviders;

    try {
      const userPrompt = Prompts.generateHazardExplanationUserPrompt(hazardTitle, description);
      const response = await this.executeCompletion('chat', [
        { role: 'system', content: Prompts.HAZARD_EXPLANATION_SYSTEM_PROMPT },
        { role: 'user', content: userPrompt }
      ], {
        modelId: modelId || '',
        temperature: DEFAULT_CHAT_CONFIG.temperature,
        maxTokens: DEFAULT_CHAT_CONFIG.maxTokens,
        timeoutMs: DEFAULT_CHAT_CONFIG.timeoutMs,
      }, {
        provider,
        model: modelId,
        allowedProviders
      });

      const parsed = safeParseJson<HazardExplanationResult>(response.content);
      const output = parsed as any;
      output.fallbackOccurred = response.fallbackOccurred;
      output.providerUsed = response.providerUsed;
      return output;
    } catch (error: any) {
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
    options?: { modelId?: string; provider?: AIProviderType; allowedProviders?: AIProviderType[]; organizationId?: string }
  ): Promise<CorrectiveActionItem[] & { fallbackOccurred?: boolean; providerUsed?: string }> {
    const pref = await this.getOrganizationAiPreferences(options?.organizationId);
    const provider = options?.provider || pref.provider;
    const modelId = options?.modelId || (provider !== 'auto' ? pref.model : undefined);
    const allowedProviders = options?.allowedProviders || pref.allowedProviders;

    try {
      const userPrompt = Prompts.generateCorrectiveActionsUserPrompt(hazardTitle, riskLevel, context);
      const response = await this.executeCompletion('recommendations', [
        { role: 'system', content: Prompts.CORRECTIVE_ACTIONS_SYSTEM_PROMPT },
        { role: 'user', content: userPrompt }
      ], {
        modelId: modelId || '',
        temperature: DEFAULT_ANALYSIS_CONFIG.temperature,
        maxTokens: DEFAULT_ANALYSIS_CONFIG.maxTokens,
        timeoutMs: DEFAULT_ANALYSIS_CONFIG.timeoutMs,
      }, {
        provider,
        model: modelId,
        allowedProviders
      });

      const parsed = safeParseJson<CorrectiveActionItem[]>(response.content);
      const output = parsed as any;
      output.fallbackOccurred = response.fallbackOccurred;
      output.providerUsed = response.providerUsed;
      return output;
    } catch (error: any) {
      throw error;
    }
  }
}

export const getAiService = (): AiService => AiService.getInstance();
