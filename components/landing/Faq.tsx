'use client'
import { useState } from 'react'

export function Faq() {
  const faqs = [
    { q: "How does the AI assessment work?", a: "Our AI processes video feeds, images, and user-submitted questionnaires to calculate precise ergonomic risk scores based on established standards like ISO 7730 and REBA." },
    { q: "Is our employee data secure?", a: "Yes. ErgonoAI is GDPR compliant, uses end-to-end encryption, and never uses your company's private health data to train external models." },
    { q: "Can we integrate with our existing HR tools?", a: "Enterprise customers can use our robust API to sync employee profiles and organizational structures with Workday, BambooHR, and other major HRIS platforms." },
    { q: "Do you offer custom assessments?", a: "Yes. The Assessment Builder allows you to create completely custom questionnaires and scoring logic tailored to your specific industry hazards." }
  ]

  const [openIdx, setOpenIdx] = useState<number | null>(0)

  return (
    <section className="py-32 bg-white">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="font-sora text-3xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="border border-slate-200 rounded-2xl overflow-hidden transition-all duration-200">
              <button 
                onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
                className="w-full text-left px-6 py-4 flex justify-between items-center focus:outline-none hover:bg-slate-50 transition-colors"
              >
                <span className="font-sora font-semibold text-slate-900">{faq.q}</span>
                <span className={`text-slate-400 transition-transform duration-300 ${openIdx === idx ? 'rotate-180' : ''}`}>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </button>
              <div 
                className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${openIdx === idx ? 'max-h-40 pb-4 opacity-100' : 'max-h-0 opacity-0'}`}
              >
                <p className="text-slate-600 text-sm leading-relaxed">{faq.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
