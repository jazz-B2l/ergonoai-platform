'use client'

import { useState } from 'react'
import { useApp } from '@/lib/app-context'
import { translations } from '@/lib/translations'
import { ShieldCheck, Activity, Eye, Zap, ChevronRight } from 'lucide-react'
import { ScrollReveal, StaggerContainer, StaggerItem, SpotlightCard } from '@/components/landing/ScrollReveal'
import { motion, AnimatePresence } from 'framer-motion'

export function Standards() {
  const { language } = useApp()
  const isAr = language === 'ar'
  const [activeStandard, setActiveStandard] = useState<string>('iso')

  const standardsData = [
    {
      id: 'iso',
      badge: 'ISO 7730',
      title: isAr ? 'المعيار الدولي للراحة الحرارية وإجهاد الجلسة' : 'Thermal & Microclimate Comfort Standard',
      sub: 'PMV / PPD Microclimate Analytics',
      icon: Activity,
      desc: isAr
        ? 'يحسب خوارزميات الراحة الحرارية والإجهاد البيئي، لتحديد تأثير الحرارة، المسودات الهوائية، والإضاءة على وضعية الجلوس وتركيز الموظف.'
        : 'Calculates Predicted Mean Vote (PMV) and Predicted Percentage Dissatisfied (PPD) indices. Evaluates ambient temperature, airflow drafts, and glare to prevent environmental posture fatigue.',
      features: isAr
        ? ['تقييم المسودات الهوائية والإجهاد الحراري', 'مراقبة جودة بيئة العمل في الوقت الفعلي', 'دمج التقييم البيئي مع الجسدي']
        : ['PMV & PPD Dissatisfaction Indexing', 'Ambient Draft & Temperature Stress Detection', 'Environmental & Physical Ergonomics Fusion']
    },
    {
      id: 'nmq',
      badge: 'NMQ',
      title: isAr ? 'استبيان الشمال الأوروبي الموحد للجهاز العضلي الهيكلي' : 'Nordic Musculoskeletal Screening',
      sub: '9-Zone Body Pain Identification',
      icon: Eye,
      desc: isAr
        ? 'معيار قياسي عالمي لفحص ومسح الآلام العضلية عبر ٩ مناطق جسدية رئيسية (الرقبة، الكتفين، الظهر، المعصم) للكشف المبكر عن الإصابات.'
        : 'Standardized global framework for screening musculoskeletal discomfort across 9 anatomical body regions (Neck, Shoulders, Wrists, Upper & Lower Back, Hips, Knees, Ankles).',
      features: isAr
        ? ['مسح عالي الدقة لـ ٩ مناطق جسدية', 'الكشف المبكر قبل حدوث الإصابات الجسيمة', 'تقارير إحصائية مجهولة الهوية']
        : ['9 Anatomical Region Micro-Screening', 'Early-Stage Symptoms Detection', 'Privacy-Preserving Aggregate Trends']
    },
    {
      id: 'rula',
      badge: 'RULA',
      title: isAr ? 'تقييم الطرف العلوي السريع لأصحاب المكاتب' : 'Rapid Upper Limb Assessment',
      sub: 'Upper Body & Screen Work Analysis',
      icon: Zap,
      desc: isAr
        ? 'يحلل إجهاد الجزء العلوي من الجسم (الرقبة، الذراعين، والمعصمين) للعمال الساكنين ومستخدمي الشاشات لفترات طويلة.'
        : 'Assesses upper body biomechanical strain—specifically analyzing neck inclination, arm elevation, wrist flexion/extension, and sustained muscle loading during desk & screen work.',
      features: isAr
        ? ['تحليل انحناء الرقبة وزاوية المعصم', 'قياس الإجهاد الناتج عن استخدام الفأرة والشاشة', 'توصيات فورية لتعديل ارتفاع المكتب']
        : ['Neck Inclination & Wrist Flexion Scoring', 'Static Muscle Load Detection', 'Automated Desk Height & Armrest Tuning']
    },
    {
      id: 'reba',
      badge: 'REBA',
      title: isAr ? 'تقييم الجسم بالكامل للأنشطة البدنية' : 'Rapid Entire Body Assessment',
      sub: 'Full-Body Physical Risk Scoring',
      icon: Activity,
      desc: isAr
        ? 'يقيم الوضعية الكلية للجسم أثناء حمل الأوزان والأنشطة البدنية في المستودعات والمستشفيات لمنع إصابات الظهر الشديدة.'
        : 'Evaluates entire body postural load during dynamic tasks, heavy lifting, and field operations in warehouses, logistics, and healthcare facilities to mitigate severe spinal injuries.',
      features: isAr
        ? ['تحليل العمود الفقري وحمل الأوزان', 'تقييم الجهد الديناميكي والمتكرر', 'إنشاء خطط علاجية ومعدات وقائية']
        : ['Full-Body Spinal Load Analysis', 'Dynamic & Forceful Movement Scoring', 'Automated Remediation & Equipment Guidance']
    },
    {
      id: 'osha',
      badge: 'OSHA 1910',
      title: isAr ? 'امتثال السلامة والصحة المهنية اللائحي' : 'OSH Regulatory Compliance Audit',
      sub: 'Audit-Ready Committee Documentation',
      icon: ShieldCheck,
      desc: isAr
        ? 'ينشئ سجلات التدقيق والامتثال اللائحي التلقائي لدعم لجنة الصحة والسلامة المهنية وإثبات الالتزام بالمعايير الحكومية.'
        : 'Generates compliant documentation and audit evidence supporting OSH Committees, ISO certifications, and federal workplace safety mandates with automated records.',
      features: isAr
        ? ['سجلات تدقيق جاهزة للتفتيش', 'تتبع خطط المعالجة وإصلاح المخاطر', 'دعم قرارات لجنة الصحة والسلامة']
        : ['Audit-Ready Committee Record Generation', 'Hazard Remediation Priority Tracking', 'Regulatory Compliance Evidence Logs']
    }
  ]

  const current = standardsData.find(s => s.id === activeStandard) || standardsData[0]
  const IconComponent = current.icon

  return (
    <section className="py-28 bg-[#030712] border-y border-slate-800/80 relative overflow-hidden isolate">
      <div className="absolute inset-0 bg-gradient-to-b from-teal-950/20 via-transparent to-slate-950/40 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        <ScrollReveal className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-bold font-mono tracking-widest uppercase text-teal-400 bg-teal-500/10 px-3.5 py-1.5 rounded-full border border-teal-500/20 mb-4 inline-block">
            {isAr ? 'معايير الهندسة البشرية العالمية' : 'Built on Globally Validated Frameworks'}
          </span>
          <h2 className="font-sora text-3xl md:text-5xl font-bold text-white tracking-tight mt-2">
            {isAr ? 'المعايير الدولية المدعومة في المنصة' : 'Engineered Around Global Ergonomic Standards'}
          </h2>
          <p className="text-sm md:text-base text-slate-400 mt-4 leading-relaxed">
            {isAr
              ? 'تدمج إرجونو أيه آي خوارزميات القياس الدولية المعتمدة لتحويل استبيانات وتصرفات الموظفين إلى تحليلات علمية دقيقة.'
              : 'ErgonoAI replaces subjective guessing with internationally accredited ergonomic assessment methodologies automated by Groq AI.'}
          </p>
        </ScrollReveal>

        {/* Standards Navigation Selector */}
        <StaggerContainer className="flex flex-wrap justify-center items-center gap-3 mb-12">
          {standardsData.map((s) => {
            const active = activeStandard === s.id
            return (
              <StaggerItem key={s.id}>
                <button
                  onClick={() => setActiveStandard(s.id)}
                  onMouseEnter={() => setActiveStandard(s.id)}
                  onFocus={() => setActiveStandard(s.id)}
                  className={`px-5 py-3 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer flex items-center gap-2 border ${
                    active
                      ? 'bg-teal-500/20 text-teal-300 border-teal-500/50 shadow-[0_0_20px_rgba(20,184,166,0.3)] scale-105'
                      : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-white hover:bg-slate-800/80 hover:scale-102'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${active ? 'bg-teal-400 animate-pulse' : 'bg-slate-600'}`} />
                  {s.badge}
                </button>
              </StaggerItem>
            )
          })}
        </StaggerContainer>

        {/* Selected Standard Feature Detail Card */}
        <ScrollReveal delay={0.2} distance={30}>
          <SpotlightCard className="bg-slate-900/80 rounded-3xl border border-slate-800 p-8 md:p-12 backdrop-blur-xl shadow-2xl relative overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStandard}
                initial={{ opacity: 0, x: isAr ? 40 : -40, filter: 'blur(8px)' }}
                animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, x: isAr ? -40 : 40, filter: 'blur(8px)' }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="grid md:grid-cols-12 gap-8 items-center w-full relative"
              >
                {/* Professional Colored Light Sweep Beam */}
                <motion.div
                  initial={{ x: '-100%', opacity: 0.7 }}
                  animate={{ x: '250%', opacity: 0 }}
                  transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
                  className="pointer-events-none absolute inset-y-0 -my-12 w-1/3 bg-gradient-to-r from-transparent via-teal-400/20 to-transparent z-20 skew-x-12"
                />

                <div className="md:col-span-7 space-y-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-mono font-semibold">
                    <IconComponent className="w-4 h-4" />
                    {current.sub}
                  </div>
                  <h3 className="font-sora text-2xl md:text-4xl font-bold text-white leading-tight">
                    {current.title}
                  </h3>
                  <p className="text-slate-300 text-sm md:text-base leading-relaxed">
                    {current.desc}
                  </p>

                  <div className="space-y-3 pt-2">
                    {current.features.map((f, idx) => (
                      <div key={idx} className="flex items-center gap-3 text-sm text-slate-200">
                        <div className="w-5 h-5 rounded-full bg-teal-500/20 border border-teal-500/40 flex items-center justify-center shrink-0">
                          <ChevronRight className={`w-3 h-3 text-teal-400 ${isAr ? 'rotate-180' : ''}`} />
                        </div>
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="md:col-span-5 bg-[#0b1329] rounded-2xl p-6 border border-slate-800/90 relative space-y-4 shadow-inner">
                  <div className="flex justify-between items-center text-xs font-mono border-b border-slate-800 pb-3">
                    <span className="text-slate-400">Standard Code</span>
                    <span className="text-teal-400 font-bold">{current.badge}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs font-mono border-b border-slate-800 pb-3">
                    <span className="text-slate-400">Automation Method</span>
                    <span className="text-emerald-400 font-bold">Groq AI Real-Time</span>
                  </div>
                  <div className="flex justify-between items-center text-xs font-mono border-b border-slate-800 pb-3">
                    <span className="text-slate-400">Compliance Status</span>
                    <span className="text-cyan-400 font-bold">Audit-Ready</span>
                  </div>
                  <div className="pt-2">
                    <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                      {isAr
                        ? 'يقوم المحرك الرياضي في المنصة بحساب خطورة كل إجابة موظف وربطها تلقائياً بالمعيار المختص.'
                        : 'ErgonoAI algorithms continuously map employee assessment telemetry directly into this standard frame.'}
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



