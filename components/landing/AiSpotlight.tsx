'use client'

import { useEffect, useState } from 'react'
import { useApp } from '@/lib/app-context'
import { translations } from '@/lib/translations'
import { Lock, ShieldCheck, Sparkles, Terminal, CheckCircle2 } from 'lucide-react'
import { ScrollReveal, SpotlightCard } from '@/components/landing/ScrollReveal'

export function AiSpotlight() {
  const { language } = useApp()
  const isAr = language === 'ar'
  const t = translations[language].aiSpotlight

  const [isVisible, setIsVisible] = useState(false)
  const fullText = t.userQuery
  const [typedText, setTypedText] = useState('')

  useEffect(() => {
    setTypedText('')
  }, [language, fullText])

  useEffect(() => {
    const handleScroll = () => {
      const el = document.getElementById('ai-spotlight')
      if (el) {
        const rect = el.getBoundingClientRect()
        if (rect.top < window.innerHeight * 0.75) {
          setIsVisible(true)
        }
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (isVisible && typedText.length < fullText.length) {
      const timeout = setTimeout(() => {
        setTypedText(fullText.slice(0, typedText.length + 1))
      }, 40)
      return () => clearTimeout(timeout)
    }
  }, [isVisible, typedText, fullText])

  const privacyGuarantees = [
    {
      title: isAr ? 'تجميع الإحصائيات مجهولة الهوية' : '100% Anonymized Aggregation',
      desc: isAr
        ? 'لا يمكن للموارد البشرية أو مسؤولي السلامة رؤية إجابات الموظف الفردية إطلاقاً. تُعرض النتائج فقط في شكل إحصائيات مجمعة للشركة.'
        : 'Individual employee responses are strictly confidential. HR and Safety Officers only see anonymized aggregate metrics.',
      icon: Lock
    },
    {
      title: isAr ? 'تشفير البيانات وحمايتها' : 'Enterprise Encryption at Rest',
      desc: isAr
        ? 'تتم معالجة التقييمات وتشفيرها في قاعدة البيانات باستخدام أحدث معايير التشفير والأمان.'
        : 'All telemetry and posture assessments are encrypted in transit and at rest using enterprise security controls.',
      icon: ShieldCheck
    },
    {
      title: isAr ? 'معالجة محلية بدون تتبع شخصي' : 'Zero Raw PII Sent to LLMs',
      desc: isAr
        ? 'تُرسل مؤشرات بيئة العمل فقط لمحرك Groq AI بدون أي أسماء أو معرفات شخصية للحفاظ على خصوصيتك.'
        : 'Only sanitized biomechanical indicators are sent to Groq AI. No employee PII is ever shared or stored by LLMs.',
      icon: CheckCircle2
    }
  ]

  return (
    <section id="ai-spotlight" className="py-28 bg-slate-100 dark:bg-[#030712] relative overflow-hidden isolate border-b border-slate-200 dark:border-slate-800/80 transition-colors duration-300">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-tr from-teal-500/10 dark:from-teal-950/30 via-transparent dark:via-slate-950 to-cyan-500/10 dark:to-cyan-950/20 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Header */}
        <ScrollReveal className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold font-mono tracking-widest uppercase text-teal-600 dark:text-teal-400 bg-teal-500/10 px-3.5 py-1.5 rounded-full border border-teal-500/20 mb-4 inline-block">
            {isAr ? 'الذكاء الاصطناعي مع حماية الخصوصية' : 'Groq AI Engine & Privacy By Design'}
          </span>
          <h2 className="font-sora text-3xl md:text-5xl font-bold text-slate-900 dark:text-white tracking-tight mt-2">
            {isAr ? 'مساعد الذكاء الاصطناعي الخاص بالسلامة المهنية' : 'Intelligent Ergonomics Copilot'}
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm md:text-base mt-4 leading-relaxed">
            {isAr
              ? 'حلول فورية لتحليل مخاطر الأقسام وتوليد التوصيات مع ضمان الخصوصية السرية التامة للموظفين.'
              : 'Real-time hazard query engine backed by Groq LLMs while strictly safeguarding individual employee privacy.'}
          </p>
        </ScrollReveal>

        <div className="grid lg:grid-cols-12 gap-10 items-center">
          
          {/* AI Terminal Window */}
          <ScrollReveal direction="left" delay={0.1} className="lg:col-span-7">
            <SpotlightCard className="bg-slate-50 dark:bg-[#0b1329] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden font-sans relative">
              <div className="h-12 bg-slate-200/80 dark:bg-slate-900 border-b border-slate-300 dark:border-slate-800 flex items-center justify-between px-5">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono text-slate-600 dark:text-slate-400">
                  <Terminal className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                  <span>ergonoai-copilot-v2.1</span>
                </div>
              </div>

              <div className="p-6 md:p-8 space-y-6 min-h-[380px] bg-white dark:bg-slate-950/90">
                
                {/* User Prompt */}
                <div className="flex justify-end">
                  <div className="bg-teal-600/90 text-white rounded-2xl rounded-tr-sm px-5 py-3.5 max-w-[85%] text-xs md:text-sm font-sans shadow-lg">
                    <p className="leading-relaxed">
                      {typedText}
                      <span className="inline-block w-1.5 h-4 bg-white ml-1 animate-pulse align-middle"></span>
                    </p>
                  </div>
                </div>

                {/* AI Output */}
                {typedText === fullText && (
                  <div className="flex justify-start animate-in fade-in slide-in-from-bottom-3 duration-500">
                    <div className="bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-slate-200 rounded-2xl rounded-tl-sm p-6 max-w-[95%] border border-slate-200 dark:border-slate-800 space-y-4 shadow-md">
                      <div className="flex items-center gap-2 text-xs font-mono text-teal-600 dark:text-teal-400">
                        <Sparkles className="w-4 h-4" />
                        <span>{t.copilotTitle}</span>
                      </div>

                      <p className="text-xs md:text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                        {t.aiIntro}
                      </p>

                      <div className="bg-slate-200/60 dark:bg-slate-950/80 border border-slate-300 dark:border-slate-800 rounded-xl p-4 space-y-2 text-xs">
                        <div className="flex justify-between items-center border-b border-slate-300 dark:border-slate-800/80 pb-2">
                          <span className="font-bold text-slate-900 dark:text-white font-sora">{t.issuesTitle}</span>
                          <span className="bg-rose-500/20 text-rose-700 dark:text-rose-300 px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold border border-rose-500/30">
                            {t.riskLabel}
                          </span>
                        </div>
                        <div className="space-y-1 text-slate-700 dark:text-slate-300 pt-1">
                          <p>• <span className="text-slate-500 dark:text-slate-400">{t.primaryIssue}:</span> {t.primaryIssueVal}</p>
                          <p>• <span className="text-slate-500 dark:text-slate-400">{t.secondaryIssue}:</span> {t.secondaryIssueVal}</p>
                          <p>• <span className="text-slate-500 dark:text-slate-400">{t.impact}:</span> {t.impactVal}</p>
                        </div>
                      </div>

                      <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                        {t.aiFooter}
                      </p>
                    </div>
                  </div>
                )}

              </div>
            </SpotlightCard>
          </ScrollReveal>

          {/* Privacy Engine Box */}
          <ScrollReveal direction="right" delay={0.2} className="lg:col-span-5">
            <SpotlightCard className="bg-white dark:bg-slate-900/80 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 backdrop-blur-xl shadow-xl space-y-6">
              <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
                <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-600 dark:text-teal-300">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-sora font-bold text-slate-900 dark:text-white text-base">
                    {isAr ? 'الخصوصية بالتصميم' : 'Privacy-By-Design Guarantee'}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">ISO 27001 & GDPR Compliant</p>
                </div>
              </div>

              <div className="space-y-4">
                {privacyGuarantees.map((p, idx) => {
                  const Icon = p.icon
                  return (
                    <div key={idx} className="flex items-start gap-3.5">
                      <div className="w-7 h-7 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center shrink-0 text-teal-600 dark:text-teal-400 mt-0.5">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white font-sora mb-0.5">{p.title}</h4>
                        <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed font-sans">{p.desc}</p>
                      </div>
                    </div>
                  )
                })}
              </div>

            </SpotlightCard>
          </ScrollReveal>

        </div>

      </div>
    </section>
  )
}



