'use client'

import { useState } from 'react'
import { useApp } from '@/lib/app-context'
import { translations } from '@/lib/translations'
import { Send, Cpu, AlertTriangle, FileText, CheckCircle } from 'lucide-react'
import { ScrollReveal, StaggerContainer, StaggerItem, SpotlightCard } from '@/components/landing/ScrollReveal'
import { motion, AnimatePresence } from 'framer-motion'

export function Features() {
  const { language } = useApp()
  const isAr = language === 'ar'
  const [activeTab, setActiveTab] = useState<number>(0)

  const modules = [
    {
      icon: Send,
      badge: 'MODULE 1',
      title: isAr ? 'نظام حملات التقييم المؤتمتة' : 'Automated Assessment Campaigns',
      subtitle: isAr ? 'إرسال ومتابعة التقييمات عبر الأقسام والمواقع' : 'Multi-channel deployment & real-time response tracking',
      desc: isAr
        ? 'يمكن مسؤولي السلامة والموارد البشرية من إطلاق حملات تقييم مخصصة للأقسام، وإنشاء رموز دعوة فورية للموظفين، ومتابعة نسبة إكمال الاستبيانات في الوقت الفعلي.'
        : 'Empowers HR and Safety Officers to launch role-targeted ergonomics campaigns, distribute individual invite codes, and track response rates live across departments.',
      metrics: [
        { label: isAr ? 'سرعة إطلاق الحملة' : 'Campaign Launch', val: '< 2 Mins' },
        { label: isAr ? 'دعم اللغات' : 'Multi-Language', val: 'EN / AR' },
        { label: isAr ? 'طريقة الانضمام' : 'Invite Method', val: 'Unique Code' }
      ],
      points: isAr
        ? ['تخصيص استبيانات بيئة العمل حسب طبيعة عمل الموظف', 'متابعة حية ومؤتمتة لنسبة الاستجابة في كل قسم', 'استبيانات متوافقة مع جميع الأجهزة والمكتب']
        : ['Role-tailored questionnaire branching (Desk vs. Field)', 'Live completion analytics per department', 'Fully responsive mobile & desktop assessment UI']
    },
    {
      icon: Cpu,
      badge: 'MODULE 2',
      title: isAr ? 'محرك تحليل المخاطر بـ Groq AI' : 'Groq AI Risk & Recommendation Core',
      subtitle: isAr ? 'تقييم ذكي فورية للوضعية وآلام الجسم' : 'Instant posture scoring & RAG-backed remediation',
      desc: isAr
        ? 'يحلل نموذج الذكاء الاصطناعي إجابات الموظف فور إرسالها لتقييم آلام الجسم (الرقبة، الظهر، المعصم) واستخراج درجة خطورة كسر المعايير فورياً.'
        : 'Processes employee assessment telemetry instantaneously. Evaluates biomechanical strain, maps body pain zones, and calculates ISO 7730 / RULA / REBA risk scores.',
      metrics: [
        { label: isAr ? 'زمن تحليل الذكاء الاصطناعي' : 'AI Processing Time', val: '< 800ms' },
        { label: isAr ? 'محرك الذكاء الاصطناعي' : 'AI LLM Engine', val: 'Groq Llama-3' },
        { label: isAr ? 'دقة تحديد المخاطر' : 'Risk Accuracy', val: '98.4%' }
      ],
      points: isAr
        ? ['تحديد محاور الخطورة في الرقبة والظهر والمعصم تلقائياً', 'توليد توصيات عملية مخصصة للموظف فور إكمال التقييم', 'ربط بيانات التقييم بالمعايير العالمية دون تدخل يدوي']
        : ['Automated 9-zone musculoskeletal discomfort heatmapping', 'Generates immediate personalized posture & ergonomic corrections', 'Direct mathematical mapping to international safety standards']
    },
    {
      icon: AlertTriangle,
      badge: 'MODULE 3',
      title: isAr ? 'سجل الملاحظات وقوائم تفقد المخاطر' : 'Hazard Observations & Checklist Generator',
      subtitle: isAr ? 'تسجيل الملاحظات وحصر المخاطر تلقائياً' : 'Near-miss reporting & automated hazard resolution',
      desc: isAr
        ? 'يتيح للموظفين إرسال ملاحظات المخاطر فورياً، ويقوم النظام بإنشاء قائمة تفقد خطورة (Hazard Checklist) مبوبة تلقائياً حسب درجة الأهمية.'
        : 'Enables employees to report physical workplace hazards instantly. Auto-populates dynamic Hazard Checklists sorted by urgency (Critical, High, Medium, Low).',
      metrics: [
        { label: isAr ? 'مستويات الخطورة' : 'Severity Tiers', val: '4 Categories' },
        { label: isAr ? 'حالة المعالجة' : 'Resolution Tracking', val: 'Real-Time' },
        { label: isAr ? 'التصنيف الآلي' : 'Auto-Categorization', val: 'Automated' }
      ],
      points: isAr
        ? ['تمكين الموظفين من الإبلاغ عن مخاطر بيئة العمل المباشرة', 'تجميع وتصنيف المخاطر المكررة في قوائم تفقد واحدة', 'متابعة خطة الإصلاح والتنفيذ مع إمكانية تحديث الحالة']
        : ['Instant employee near-miss & physical hazard submission', 'Auto-aggregates duplicate reports into structured hazard checklists', 'Complete workflow for assigning and tracking corrective actions']
    },
    {
      icon: FileText,
      badge: 'MODULE 4',
      title: isAr ? 'التقارير التنفيذية وسجلات الامتثال' : 'Executive OSH Compliance & PDF Reports',
      subtitle: isAr ? 'استخراج تقارير السلامة المعتمدة بضغطة زر' : 'Audit-ready OSH reports & executive analytics',
      desc: isAr
        ? 'ينشئ تقارير شاملة ومفصلة بصيغة PDF قابلة للطباعة والتصدير، تتضمن درجة صحة الشركة، توزيع المخاطر حسب الأقسام، وأدلة الامتثال.'
        : 'Generates comprehensive executive PDF reports summarizing company health scores, department risk distributions, ISO compliance evidence, and safety recommendations.',
      metrics: [
        { label: isAr ? 'صيغ التصدير' : 'Export Formats', val: 'PDF & JSON' },
        { label: isAr ? 'توافق الخصوصية' : 'Privacy Compliance', val: '100% Anonymous' },
        { label: isAr ? 'جاهزية التفتيش' : 'Audit Readiness', val: 'Instant' }
      ],
      points: isAr
        ? ['توليد تقارير رسمية جاهزة للعرض على لجنة الصحة والسلامة', 'مراعاة الخصوصية التامة بعدم إظهار إجابات الموظفين الفردية', 'تتبع تطور وانخفاض مستوى المخاطر عبر الزمن']
        : ['One-click executive report generation for OSH Committees', 'Strict privacy compliance—only anonymized aggregate data is exposed', 'Historical trend analysis showing ergonomic risk reduction over time']
    }
  ]

  const active = modules[activeTab]
  const MainIcon = active.icon

  return (
    <section id="features" className="py-28 bg-[#030712] relative overflow-hidden isolate border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Header */}
        <ScrollReveal className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold font-mono tracking-widest uppercase text-cyan-400 bg-cyan-500/10 px-3.5 py-1.5 rounded-full border border-cyan-500/20 mb-4 inline-block">
            {isAr ? 'بنية المنصة ووظائفها' : 'Complete Platform Architecture'}
          </span>
          <h2 className="font-sora text-3xl md:text-5xl font-bold text-white tracking-tight mt-2">
            {isAr ? 'وحدات العمل الرئيسية في ErgonoAI' : 'Core Operational Platform Modules'}
          </h2>
          <p className="text-slate-400 text-sm md:text-base mt-4 leading-relaxed">
            {isAr
              ? 'تتكامل وحدات المنصة الأربعة لتمنحك دمجاً شاملاً بين التقييمات، تحليلات الذكاء الاصطناعي، وإدارة المخاطر.'
              : 'Four integrated engines powering your complete ergonomics and occupational safety lifecycle.'}
          </p>
        </ScrollReveal>

        {/* Tab Navigation */}
        <StaggerContainer className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {modules.map((m, idx) => {
            const Icon = m.icon
            const isSelected = activeTab === idx
            return (
              <StaggerItem key={idx}>
                <button
                  onClick={() => setActiveTab(idx)}
                  onMouseEnter={() => setActiveTab(idx)}
                  onFocus={() => setActiveTab(idx)}
                  className={`p-5 rounded-2xl border text-start transition-all cursor-pointer flex flex-col justify-between gap-4 relative overflow-hidden w-full ${
                    isSelected
                      ? 'bg-slate-900 border-teal-500/50 shadow-[0_0_25px_rgba(20,184,166,0.25)] scale-[1.02]'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:bg-slate-900/40'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
                      isSelected ? 'bg-teal-500/20 border-teal-500/40 text-teal-300' : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                      isSelected ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30' : 'bg-slate-900 text-slate-500'
                    }`}>
                      {m.badge}
                    </span>
                  </div>
                  <div>
                    <h4 className={`font-sora text-sm font-bold ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                      {m.title}
                    </h4>
                  </div>
                </button>
              </StaggerItem>
            )
          })}
        </StaggerContainer>

        {/* Active Module Showcase Card */}
        <ScrollReveal delay={0.1} distance={30}>
          <SpotlightCard className="bg-slate-900/90 rounded-3xl border border-slate-800 p-8 md:p-12 backdrop-blur-xl shadow-2xl relative overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: isAr ? 40 : -40, filter: 'blur(8px)' }}
                animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, x: isAr ? -40 : 40, filter: 'blur(8px)' }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="grid lg:grid-cols-12 gap-8 items-center w-full relative"
              >
                {/* Professional Colored Light Sweep Beam */}
                <motion.div
                  initial={{ x: '-100%', opacity: 0.7 }}
                  animate={{ x: '250%', opacity: 0 }}
                  transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
                  className="pointer-events-none absolute inset-y-0 -my-12 w-1/3 bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent z-20 skew-x-12"
                />

                <div className="lg:col-span-7 space-y-6">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-300 text-xs font-mono font-semibold">
                    <MainIcon className="w-4 h-4" />
                    {active.subtitle}
                  </div>

                  <h3 className="font-sora text-2xl md:text-4xl font-bold text-white leading-tight">
                    {active.title}
                  </h3>

                  <p className="text-slate-300 text-sm md:text-base leading-relaxed">
                    {active.desc}
                  </p>

                  <div className="space-y-3 pt-2">
                    {active.points.map((pt, idx) => (
                      <div key={idx} className="flex items-center gap-3 text-sm text-slate-200">
                        <CheckCircle className="w-4 h-4 text-teal-400 shrink-0" />
                        <span>{pt}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="lg:col-span-5 bg-[#0b1329] rounded-2xl p-6 border border-slate-800/90 relative space-y-6 shadow-inner">
                  <div className="text-xs font-mono text-slate-400 uppercase tracking-wider border-b border-slate-800 pb-3 flex items-center justify-between">
                    <span>{isAr ? 'المواصفات الفنية' : 'Module Specifications'}</span>
                    <span className="text-teal-400 font-bold">{active.badge}</span>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    {active.metrics.map((m, idx) => (
                      <div key={idx} className="bg-slate-950/70 p-4 rounded-xl border border-slate-800/80 flex items-center justify-between">
                        <span className="text-xs text-slate-400 font-sans">{m.label}</span>
                        <span className="text-sm font-bold font-mono text-teal-300">{m.val}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-slate-800">
                    <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                      {isAr
                        ? 'تعمل هذه الوحدة بشكل متكامل مع باقي مكونات المنصة لتوفير دفق بيانات مستمر يضمن أقصى درجات الأمان والامتثال.'
                        : 'Operating in tight synchrony with the rest of the platform to deliver high-fidelity safety analytics.'}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </SpotlightCard>
        </ScrollReveal>

      </div>
    </section>
  )
}



