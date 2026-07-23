'use client'

import { useApp } from '@/lib/app-context'
import { translations } from '@/lib/translations'
import { AlertOctagon, CheckCircle2, Clock, FileX, Cpu, BarChart3, ShieldCheck } from 'lucide-react'
import { ScrollReveal, SpotlightCard } from '@/components/landing/ScrollReveal'

export function Problem() {
  const { language } = useApp()
  const isAr = language === 'ar'

  const painPoints = [
    {
      title: isAr ? 'استبيانات ورقية يدويّة بطيئة' : 'Manual Paper Assessments',
      desc: isAr
        ? 'تستغرق الاستبيانات الورقية والتحليل اليدوي أسابيع طويلة لجمعها، وتتسبب في أخطاء تجميع بشرية غير دقيقة.'
        : 'Paper-based forms and manual scoring take weeks per department, creating heavy administrative overhead and human error.',
      icon: FileX
    },
    {
      title: isAr ? 'جداول بيانات معزولة ومشتتة' : 'Siloed Excel Spreadsheets',
      desc: isAr
        ? 'بيانات السلامة محاصرة في ملفات إكسل منفصلة، مما يجعل اكتشاف اتجاهات وإصابات الشركة أمراً مستحيلاً.'
        : 'Safety data trapped in isolated spreadsheets makes tracking organization-wide musculoskeletal trends impossible.',
      icon: Clock
    },
    {
      title: isAr ? 'إدارة تفاعلية بعد وقوع الإصابات' : 'Reactive Post-Injury Response',
      desc: isAr
        ? 'تكتشف المؤسسات المخاطر الجسدية فقط بعد تسجيل مطالبة طبية أو إصابة رسمية للموظف.'
        : 'Organizations discover ergonomic hazards only after medical claims occur and employee injuries are logged.',
      icon: AlertOctagon
    }
  ]

  const solutions = [
    {
      title: isAr ? 'حملات تقييم ذكية مؤتمتة' : 'Automated Assessment Campaigns',
      desc: isAr
        ? 'إرسال حملات تقييم بيئة العمل للأجهزة والمكاتب بضغطة زر واحدة مع متابعة معدلات الإنجاز.'
        : 'Deploy role-specific digital campaigns across worksites with real-time completion tracking.',
      icon: CheckCircle2
    },
    {
      title: isAr ? 'تحليل فوري عبر Gemini AI' : 'Real-time Gemini AI Analytics',
      desc: isAr
        ? 'تقييم مخاطر الوضعية والبيئة فورياً مع توليد توصيات تصحيحية مخصصة لكل موظف.'
        : 'Instant evaluation of posture risks, body discomfort, and environmental factors with tailored remediation.',
      icon: Cpu
    },
    {
      title: isAr ? 'لوحة تحكم وسجلات معتمدة' : 'Audit-Ready OSH Dashboards',
      desc: isAr
        ? 'مراقبة خطورة كل قسم، إنشاء قوائم تفقد المخاطر، واستخراج تقارير تنفيذية معتمدة للسلامة.'
        : 'Monitor department risk indices, auto-generate hazard checklists, and export audit-ready PDF reports.',
      icon: BarChart3
    }
  ]

  return (
    <section className="py-28 bg-white dark:bg-[#020617] relative overflow-hidden isolate border-b border-slate-200 dark:border-slate-800/80 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Header */}
        <ScrollReveal className="text-center max-w-3xl mx-auto mb-20">
          <span className="text-xs font-bold font-mono tracking-widest uppercase text-rose-600 dark:text-rose-400 bg-rose-500/10 px-3.5 py-1.5 rounded-full border border-rose-500/20 mb-4 inline-block">
            {isAr ? 'الواقع الحالي مقابل المستقبلي' : 'The Ergonomic Management Shift'}
          </span>
          <h2 className="font-sora text-3xl md:text-5xl font-bold text-slate-900 dark:text-white tracking-tight mt-2">
            {isAr
              ? 'لماذا تفشل الطرق التقليدية في إدارة بيئة العمل؟'
              : 'Traditional Safety Methods Are Broken. Here is How ErgonoAI Solves It.'}
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm md:text-base mt-4 leading-relaxed">
            {isAr
              ? 'معظم المنظمات تعتمد على ردود الفعل المتأخرة، بينما توفر المنصة نظام حماية استباقي يقضي على المخاطر قبل حدوثها.'
              : 'Shift from slow reactive injury logging to continuous, AI-driven workplace risk prevention.'}
          </p>
        </ScrollReveal>

        {/* Side-by-side comparison */}
        <div className="grid lg:grid-cols-2 gap-10 items-stretch">
          
          {/* Traditional Way (Problem) */}
          <ScrollReveal direction="left" delay={0.1}>
            <SpotlightCard 
              spotlightColor="rgba(244, 63, 94, 0.12)"
              className="bg-slate-50 dark:bg-slate-900/50 rounded-3xl p-8 border border-rose-500/20 relative space-y-6 flex flex-col justify-between h-full"
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-rose-500/20 pb-4">
                  <span className="font-sora font-bold text-rose-600 dark:text-rose-400 text-lg flex items-center gap-2">
                    <AlertOctagon className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                    {isAr ? 'الطريقة التقليدية القديمة' : 'Traditional Manual Approach'}
                  </span>
                  <span className="text-xs font-mono bg-rose-500/10 text-rose-700 dark:text-rose-300 px-2.5 py-1 rounded-full border border-rose-500/20">
                    {isAr ? 'تفاعلي متأخر' : 'Reactive & Slow'}
                  </span>
                </div>

                <div className="space-y-4">
                  {painPoints.map((item, idx) => {
                    const Icon = item.icon
                    return (
                      <div key={idx} className="flex items-start gap-4 p-4 rounded-xl bg-white dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 shadow-sm">
                        <div className="w-10 h-10 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center shrink-0 text-rose-600 dark:text-rose-400 mt-0.5">
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1 font-sora">{item.title}</h4>
                          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{item.desc}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-rose-500/5 border border-rose-500/10 text-xs text-rose-700 dark:text-rose-300/80 font-mono text-center mt-4">
                {isAr ? 'النتيجة: ارتفاع معدل إصابات الإجهاد وإهدار آلاف الساعات' : 'Result: High MSD injury rates, high absenteeism, and zero audit visibility.'}
              </div>
            </SpotlightCard>
          </ScrollReveal>

          {/* ErgonoAI Way (Solution) */}
          <ScrollReveal direction="right" delay={0.2}>
            <SpotlightCard 
              spotlightColor="rgba(20, 184, 166, 0.2)"
              className="bg-slate-100 dark:bg-slate-900/90 rounded-3xl p-8 border border-teal-500/30 relative space-y-6 flex flex-col justify-between shadow-xl dark:shadow-teal-950/40 h-full"
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-teal-500/30 pb-4">
                  <span className="font-sora font-bold text-teal-700 dark:text-teal-300 text-lg flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                    {isAr ? 'منصة ErgonoAI الذكية' : 'The ErgonoAI Platform'}
                  </span>
                  <span className="text-xs font-mono bg-teal-500/10 text-teal-700 dark:text-teal-300 px-2.5 py-1 rounded-full border border-teal-500/30">
                    {isAr ? 'استباقي ذكي' : 'Continuous & Proactive'}
                  </span>
                </div>

                <div className="space-y-4">
                  {solutions.map((item, idx) => {
                    const Icon = item.icon
                    return (
                      <div key={idx} className="flex items-start gap-4 p-4 rounded-xl bg-white dark:bg-slate-950/80 border border-teal-500/20 shadow-sm">
                        <div className="w-10 h-10 rounded-lg bg-teal-500/20 border border-teal-500/40 flex items-center justify-center shrink-0 text-teal-600 dark:text-teal-300 mt-0.5">
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1 font-sora">{item.title}</h4>
                          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">{item.desc}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-teal-500/10 border border-teal-500/20 text-xs text-teal-700 dark:text-teal-300 font-mono text-center mt-4">
                {isAr ? 'النتيجة: انخفاض المخاطر بنسبة ٢١٪ وتوفر سجلات معتمدة بالكامل' : 'Result: 21% average risk reduction, 100% privacy compliance, audit-ready OSH.'}
              </div>
            </SpotlightCard>
          </ScrollReveal>

        </div>
      </div>
    </section>
  )
}



