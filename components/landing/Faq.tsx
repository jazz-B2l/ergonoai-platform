'use client'

import { useApp } from '@/lib/app-context'
import { useState } from 'react'
import { ChevronDown, HelpCircle } from 'lucide-react'
import { ScrollReveal, StaggerContainer, StaggerItem, SpotlightCard } from '@/components/landing/ScrollReveal'

export function Faq() {
  const { language } = useApp()
  const isAr = language === 'ar'

  const [openIdx, setOpenIdx] = useState<number | null>(0)

  const faqItems = [
    {
      q: isAr ? 'كيف تضمن منصة ErgonoAI سرية وخصوصية الموظفين؟' : 'How does ErgonoAI guarantee employee response confidentiality?',
      a: isAr
        ? 'تم تصميم المنصة وفق مبدأ "الخصوصية بالتصميم" (Privacy-By-Design). لا تُعرض إجابات الموظف الفردية لأي مسؤول في الموارد البشرية أو السلامة. تُعرض النظرة العامة فقط في شكل مؤشرات إحصائية مجمعة للأقسام عندما يتجاوز عدد الموظفين الحد الأدنى المحدد.'
        : 'ErgonoAI is built on strict Privacy-By-Design principles. Individual survey responses are strictly encrypted and never exposed to HR or Safety Officers. Only aggregated department metrics above the configured threshold are shared.'
    },
    {
      q: isAr ? 'ما هي المعايير الدولية التي يعتمد عليها تقييم الذكاء الاصطناعي؟' : 'What international ergonomic standards are integrated into the AI engine?',
      a: isAr
        ? 'يعتمد النظام على 5 معايير عالمية رئيسية: ISO 7730 للراحة الحرارية، واستبيان NMQ الشمالي للفحص الجسدي، وتقييمات RULA و REBA لحساب إجهاد وضعيات الجسم، بالإضافة لمعايير OSHA 1910 لامتثال لجنة السلامة والصحة المهنية.'
        : 'ErgonoAI integrates 5 core accredited frameworks: ISO 7730 (thermal comfort & microclimate), Nordic NMQ (9-zone musculoskeletal pain screening), RULA & REBA (biomechanical posture strain), and OSHA 1910 regulatory compliance.'
    },
    {
      q: isAr ? 'كيف يتم إنشاء قوائم تفقد المخاطر (Hazard Checklists)؟' : 'How are automated Hazard Checklists created from employee reports?',
      a: isAr
        ? 'عندما يقدم الموظفون ملاحظات عن مخاطر بيئة العمل المباشرة أو يكملون التقييم، يقوم نموذج Gemini AI بفرز وتصنيف المخاطر المكررة فورياً حسب مستويات الأهمية (حرج، مرتفع، متوسط، منخفض) وتوليد قوائم تفقد مع خطوات المعالجة.'
        : 'When employees report near-misses or complete assessments, Gemini AI automatically categorizes physical hazards by urgency (Critical, High, Medium, Low), aggregates duplicate reports, and auto-generates action-oriented hazard checklists.'
    },
    {
      q: isAr ? 'هل تتطلب المنصة تنزيل برامج خاصة على أجهزة الموظفين؟' : 'Do employees need to download software to complete assessments?',
      a: isAr
        ? 'لا إطلاقاً. المنصة تعمل بالكامل على الويب ومتوافقة مع الهواتف الذكية والأجهزة المكتبية. يدخل الموظف عبر رمز دعوة فريد (Invite Code) لإكمال التقييم خلال دقائق معدودة.'
        : 'No. ErgonoAI is 100% web-based and fully responsive across mobile phones, tablets, and desktop computers. Employees simply enter their unique invite code to complete assessments in minutes.'
    },
    {
      q: isAr ? 'كيف تستفيد لجنة الصحة والسلامة المهنية من تقارير المنصة؟' : 'How does the platform support OSH Committee compliance and audits?',
      a: isAr
        ? 'تستخرج المنصة تقارير وتنفيذية بصيغة PDF تتضمن مؤشر صحة الشركة، وتوزع خطورة الأقسام، وأدلة الالتزام بالمعايير، مع خطط معالجة واضحة لتقديمها في اجتماعات لجنة السلامة والتفتيش اللائحي.'
        : 'ErgonoAI generates audit-ready PDF executive reports summarizing company health scores, department risk trends, ISO compliance evidence, and corrective action histories directly formatted for OSH Committee meetings.'
    }
  ]

  return (
    <section className="py-28 bg-white dark:bg-[#030712] relative overflow-hidden isolate border-b border-slate-200 dark:border-slate-800/80 transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-6 relative z-10">
        
        {/* Header */}
        <ScrollReveal className="text-center mb-16">
          <span className="text-xs font-bold font-mono tracking-widest uppercase text-teal-600 dark:text-teal-400 bg-teal-500/10 px-3.5 py-1.5 rounded-full border border-teal-500/20 mb-4 inline-block">
            {isAr ? 'الأسئلة الشائعة والمعرفية' : 'Knowledge Base & Technical FAQ'}
          </span>
          <h2 className="font-sora text-3xl md:text-5xl font-bold text-slate-900 dark:text-white tracking-tight mt-2">
            {isAr ? 'الأسئلة الشائعة حول المنصة والامتثال' : 'Frequently Asked Questions'}
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm md:text-base mt-4 leading-relaxed">
            {isAr
              ? 'كل ما تحتاج معرفته عن طريقة عمل المنصة، معايير الأمان، والامتثال للسلامة المهنية.'
              : 'Everything you need to know about ErgonoAI deployment, standards integration, and privacy guarantees.'}
          </p>
        </ScrollReveal>

        {/* Accordion */}
        <StaggerContainer className="space-y-4">
          {faqItems.map((faq, idx) => {
            const isOpen = openIdx === idx
            return (
              <StaggerItem key={idx}>
                <div 
                  className={`rounded-2xl border transition-all overflow-hidden ${
                    isOpen 
                      ? 'bg-slate-100 dark:bg-slate-900/90 border-teal-500/40 shadow-lg' 
                      : 'bg-slate-50 border-slate-200 dark:bg-slate-950/60 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <button
                    onClick={() => setOpenIdx(isOpen ? null : idx)}
                    className="w-full text-start px-6 py-5 flex justify-between items-center gap-4 focus:outline-none cursor-pointer"
                  >
                    <span className="font-sora font-semibold text-slate-900 dark:text-white text-sm md:text-base flex items-center gap-3">
                      <HelpCircle className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
                      {faq.q}
                    </span>
                    <ChevronDown className={`w-5 h-5 text-teal-600 dark:text-teal-400 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                  </button>

                  <div 
                    className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
                      isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="px-6 pb-6 pt-1 text-xs md:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-sans border-t border-slate-200 dark:border-slate-800/80 mt-2">
                        {faq.a}
                      </div>
                    </div>
                  </div>
                </div>
              </StaggerItem>
            )
          })}
        </StaggerContainer>

      </div>
    </section>
  )
}


