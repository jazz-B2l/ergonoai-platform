'use client'

import { createContext, useContext, useEffect, useState, useRef, ReactNode } from 'react';
import { CompanyContext } from './CompanyProvider';
import { supabase } from '@/lib/supabase';
import { AIProviderType } from '@/lib/ai/types';

interface AIProviderContextType {
  aiProvider: AIProviderType;
  aiModel: string;
  allowedProviders: AIProviderType[];
  loadingSettings: boolean;
  providersHealth: Record<'gemini' | 'groq', 'healthy' | 'unhealthy' | 'checking'>;
  updateAiPreference: (provider: AIProviderType, model: string) => Promise<void>;
  updateAllowedProviders: (providers: AIProviderType[]) => Promise<void>;
  checkProvidersHealth: (force?: boolean) => Promise<void>;
}

export const AIProviderContext = createContext<AIProviderContextType | undefined>(undefined);

export function AIProviderProvider({ children }: { children: ReactNode }) {
  const companyCtx = useContext(CompanyContext);
  const activeOrgId = companyCtx?.activeCompany?.id;

  const [aiProvider, setAiProvider] = useState<AIProviderType>('auto');
  const [aiModel, setAiModel] = useState<string>('');
  const [allowedProviders, setAllowedProviders] = useState<AIProviderType[]>(['gemini', 'groq']);
  const [loadingSettings, setLoadingSettings] = useState<boolean>(true);
  const [providersHealth, setProvidersHealth] = useState<Record<'gemini' | 'groq', 'healthy' | 'unhealthy' | 'checking'>>({
    gemini: 'checking',
    groq: 'checking',
  });

  const lastHealthCheckRef = useRef<number>(0);
  const cachedUserIdRef = useRef<string | null>(null);
  const HEALTH_CACHE_MS = 30000; // 30 seconds cache

  // 1. Initial quick-boot from localStorage
  useEffect(() => {
    const cachedProvider = localStorage.getItem('ai-preference-provider') as AIProviderType | null;
    const cachedModel = localStorage.getItem('ai-preference-model');
    const cachedAllowed = localStorage.getItem('ai-preference-allowed');

    if (cachedProvider) setAiProvider(cachedProvider);
    if (cachedModel) setAiModel(cachedModel);
    if (cachedAllowed) {
      try {
        setAllowedProviders(JSON.parse(cachedAllowed));
      } catch {
        // ignore fallback
      }
    }
  }, []);

  // 2. Load from database organization_settings when activeOrgId changes
  useEffect(() => {
    if (!activeOrgId) {
      setLoadingSettings(false);
      return;
    }

    async function loadDbSettings() {
      setLoadingSettings(true);
      try {
        const { data, error } = await supabase
          .from('organization_settings')
          .select('extra_settings')
          .eq('organization_id', activeOrgId)
          .maybeSingle();

        if (data?.extra_settings) {
          const config = data.extra_settings as any;
          const ai = config.ai || {};
          if (ai.provider) {
            setAiProvider(ai.provider);
            localStorage.setItem('ai-preference-provider', ai.provider);
          }
          if (ai.model) {
            setAiModel(ai.model);
            localStorage.setItem('ai-preference-model', ai.model);
          }
          if (ai.allowedProviders) {
            setAllowedProviders(ai.allowedProviders);
            localStorage.setItem('ai-preference-allowed', JSON.stringify(ai.allowedProviders));
          }
        }
      } catch (err) {
        console.error('[AI PROVIDER CONTEXT] Failed to load settings:', err);
      } finally {
        setLoadingSettings(false);
      }
    }

    loadDbSettings();
  }, [activeOrgId]);

  // Cache the user ID once when org context is ready — avoids calling
  // supabase.auth.getUser() on every preference save (rate limit risk).
  useEffect(() => {
    if (!cachedUserIdRef.current) {
      supabase.auth.getSession().then(({ data }) => {
        cachedUserIdRef.current = data.session?.user?.id ?? null;
      });
    }
  }, []);

  // 3. Health Checks with 30-sec Cache
  const checkProvidersHealth = async (force = false) => {
    const now = Date.now();
    if (!force && now - lastHealthCheckRef.current < HEALTH_CACHE_MS) {
      console.log('[AI PROVIDER CONTEXT] Returning cached health check states.');
      return;
    }

    setProvidersHealth({ gemini: 'checking', groq: 'checking' });
    lastHealthCheckRef.current = now;

    try {
      const res = await fetch('/api/ai/health');
      if (res.ok) {
        const data = await res.json();
        setProvidersHealth({
          gemini: data.providers?.gemini?.status === 'healthy' ? 'healthy' : 'unhealthy',
          groq: data.providers?.groq?.status === 'healthy' ? 'healthy' : 'unhealthy',
        });
      } else {
        setProvidersHealth({ gemini: 'unhealthy', groq: 'unhealthy' });
      }
    } catch (err) {
      console.error('[AI PROVIDER CONTEXT] Health check query failed:', err);
      setProvidersHealth({ gemini: 'unhealthy', groq: 'unhealthy' });
    }
  };

  // Run health check initially
  useEffect(() => {
    checkProvidersHealth();
  }, []);

  // 4. Update preferences
  const updateAiPreference = async (provider: AIProviderType, model: string) => {
    setAiProvider(provider);
    const resolvedModel = provider === 'auto' ? '' : model;
    setAiModel(resolvedModel);

    localStorage.setItem('ai-preference-provider', provider);
    localStorage.setItem('ai-preference-model', resolvedModel);

    if (activeOrgId) {
      try {
        const { data: current } = await supabase
          .from('organization_settings')
          .select('extra_settings')
          .eq('organization_id', activeOrgId)
          .maybeSingle();

        const extra = current?.extra_settings || {};
        const ai = extra.ai || {};
        const newExtra = {
          ...extra,
          ai: {
            ...ai,
            provider,
            model: resolvedModel,
          }
        };

        const { data: { user } } = await supabase.auth.getUser();

        await supabase
          .from('organization_settings')
          .upsert({
            organization_id: activeOrgId,
            extra_settings: newExtra,
            updated_at: new Date().toISOString(),
            updated_by: user?.id,
          }, {
            onConflict: 'organization_id'
          });
      } catch (err) {
        console.error('[AI PROVIDER CONTEXT] Failed to persist preference update:', err);
      }
    }
  };

  // 5. Update allowed providers (Admin control)
  const updateAllowedProviders = async (providers: AIProviderType[]) => {
    setAllowedProviders(providers);
    localStorage.setItem('ai-preference-allowed', JSON.stringify(providers));

    if (activeOrgId) {
      try {
        const { data: current } = await supabase
          .from('organization_settings')
          .select('extra_settings')
          .eq('organization_id', activeOrgId)
          .maybeSingle();

        const extra = current?.extra_settings || {};
        const ai = extra.ai || {};
        const newExtra = {
          ...extra,
          ai: {
            ...ai,
            allowedProviders: providers,
          }
        };

        await supabase
          .from('organization_settings')
          .upsert({
            organization_id: activeOrgId,
            extra_settings: newExtra,
            updated_at: new Date().toISOString(),
            updated_by: cachedUserIdRef.current,
          }, {
            onConflict: 'organization_id'
          });
      } catch (err) {
        console.error('[AI PROVIDER CONTEXT] Failed to persist allowed providers update:', err);
      }
    }
  };

  return (
    <AIProviderContext.Provider
      value={{
        aiProvider,
        aiModel,
        allowedProviders,
        loadingSettings,
        providersHealth,
        updateAiPreference,
        updateAllowedProviders,
        checkProvidersHealth,
      }}
    >
      {children}
    </AIProviderContext.Provider>
  );
}

export const useAIProvider = () => {
  const context = useContext(AIProviderContext);
  if (context === undefined) {
    throw new Error('useAIProvider must be used within an AIProviderProvider');
  }
  return context;
};
