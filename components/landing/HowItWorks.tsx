'use client'

import { useApp } from '@/lib/app-context'
import { translations } from '@/lib/translations'
import { Building2, UserPlus, Sparkles, CheckCircle2 } from 'lucide-react'
import { ScrollReveal, StaggerContainer, StaggerItem, SpotlightCard } from '@/components/landing/ScrollReveal'

export function HowItWorks() {
  const { language } = useApp()
  const isAr = language === 'ar'

  const steps = [
    {
      num: '01',
      title: isAr ? 'إنشاء حساب المؤسسة والأقسام' : '1. Setup Workspace & Departments',
      actor: isAr ? 'مسؤول السلامة / HR' : 'HR & Safety Officer',
      desc: isAr
        ? 'تسجيل المؤسسة، إضافة الأقسام المختلفة (مثل التطوير، التصنيع، المكاتب)، وتحديد إعدادات حد الخصوصية.'
        : 'Register your organization, configure departments (Engineering, Operations, Admin), and set privacy aggregation thresholds.',
      icon: Building2
    },
    {
      num: '02',
      title: isAr ? 'دعوة الموظفين وإطلاق التقييم' : '2. Deploy Role-Based Assessment',
      actor: isAr ? 'الموظفون' : 'Employees',
      desc: isAr
        ? 'يتلقى الموظفون رموز دعوة فريدة للدخول وإكمال تقييم بيئة العمل الذاتي بدون الحاجة لتنزيل أي تطبيق.'
        : 'Employees access their role-specific questionnaire via secure invite codes on any device without installing apps.',
      icon: UserPlus
    },
    {
      num: '03',
      title: isAr ? 'تحليل Gemini AI والربط بالمعايير' : '3. AI Risk Scoring & Hazard Matching',
      actor: isAr ? 'محرك الذكاء الاصطناعي' : 'Gemini AI Engine',
      desc: isAr
        ? 'يقوم محرك الذكاء الاصطناعي بتحليل إجابات الوضعية فورا وحساب درجات خطورة ISO 7730 و RULA/REBA وتوليد قوائم التفقد.'
        : 'Gemini AI evaluates posture telemetry, maps 9 body discomfort zones, calculates RULA/REBA indices, and seeds hazard checklists.',
      icon: Sparkles
    },
    {
      num: '04',
      title: isAr ? 'تطبيق التوصيات واستخراج التقارير' : '4. Actionable Mitigation & OSH Reporting',
      actor: isAr ? 'لجنة الصحة والسلامة' : 'OSH Committee & Management',
      desc: isAr
        ? 'استلام توصيات تحسين بيئة العمل الفردية وتصدير تقارير الامتثال التنفيذية لضمان سلامة بيئة العمل.'
        : 'Track hazard remediation velocity, distribute personalized employee posture tips, and export executive PDF reports.',
      icon: CheckCircle2
    }
  ]

  return (
    <section className="py-28 bg-white dark:bg-[#020617] relative overflow-hidden isolate border-b border-slate-200 dark:border-slate-800/80 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Header */}
        <ScrollReveal className="text-center max-w-3xl mx-auto mb-20">
          <span className="text-xs font-bold font-mono tracking-widest uppercase text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3.5 py-1.5 rounded-full border border-emerald-500/20 mb-4 inline-block">
            {isAr ? 'خطوات العمل البسيطة' : 'Seamless Operational Workflow'}
          </span>
          <h2 className="font-sora text-3xl md:text-5xl font-bold text-slate-900 dark:text-white tracking-tight mt-2">
            {isAr ? 'كيف تعمل منصة ErgonoAI؟' : 'How ErgonoAI Transforms Workplace Safety'}
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm md:text-base mt-4 leading-relaxed">
            {isAr
              ? 'منظومة عمل متكاملة تبدأ من إطلاق التقييم وتمر بتحليل الذكاء الاصطناعي حتى الوصول لبيئة عمل آمنة وممتثلة.'
              : 'From initial organization onboarding to audit-ready compliance in 4 intuitive steps.'}
          </p>
        </ScrollReveal>

        {/* Timeline grid */}
        <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon
            return (
              <StaggerItem key={idx}>
                <SpotlightCard className="bg-slate-50 dark:bg-slate-900/70 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 relative space-y-4 hover:border-teal-500/40 hover:bg-white dark:hover:bg-slate-900 transition-all flex flex-col justify-between group shadow-lg h-full">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-geist-mono text-2xl font-bold text-teal-600 dark:text-teal-400 opacity-80 group-hover:opacity-100 transition-opacity">
                        {step.num}
                      </span>
                      <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-600 dark:text-teal-300">
                        <Icon className="w-5 h-5" />
                      </div>
                    </div>

                    <span className="inline-block text-[10px] font-mono font-bold uppercase text-slate-600 dark:text-slate-400 bg-slate-200 dark:bg-slate-950 px-2.5 py-1 rounded-md border border-slate-300 dark:border-slate-800">
                      {step.actor}
                    </span>

                    <h3 className="font-sora text-base font-bold text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-300 transition-colors">
                      {step.title}
                    </h3>

                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-sans">
                      {step.desc}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-200 dark:border-slate-800/80 flex items-center gap-1.5 text-[11px] text-teal-600 dark:text-teal-400/80 font-mono mt-4">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-400"></span>
                    <span>Step {idx + 1} of 4</span>
                  </div>
                </SpotlightCard>
              </StaggerItem>
            )
          })}
        </StaggerContainer>

      </div>
    </section>
  )
}



