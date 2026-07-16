'use client'

import Link from 'next/link'
import { useApp } from '@/lib/app-context'
import { translations } from '@/lib/translations'

export function Footer() {
  const { language } = useApp()
  const t = translations[language].footer
  const tc = translations[language].common

  return (
    <footer className="bg-[#020617] text-slate-400 pt-24 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-6">
        {/* Strong Final CTA */}
        <div className="bg-slate-900 rounded-3xl p-12 text-center border border-slate-800 shadow-2xl shadow-teal-900/20 mb-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-teal-900/20 to-cyan-900/20 pointer-events-none"></div>
          <h2 className="font-sora text-3xl md:text-5xl font-bold text-white mb-6 relative z-10 tracking-tight">
            {t.ctaTitle}
          </h2>
          <p className="text-lg text-slate-300 mb-10 max-w-2xl mx-auto relative z-10">
            {t.ctaSub}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 relative z-10">
            <Link href="/role-select" className="bg-teal-500 hover:bg-teal-400 text-slate-900 px-8 py-4 rounded-full font-semibold transition-colors flex items-center justify-center">
              {tc.startFreeTrial}
            </Link>
            <button className="bg-slate-800 hover:bg-slate-700 text-white px-8 py-4 rounded-full font-semibold transition-colors border border-slate-700 hover:border-slate-600">
              {tc.talkToSales}
            </button>
          </div>
        </div>

        {/* Links */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-16">
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <span className="font-sora font-semibold text-xl text-white">ErgonoAI</span>
            </Link>
            <p className="text-sm text-slate-500 max-w-xs">
              {t.footerDesc}
            </p>
          </div>
          
          <div>
            <h4 className="font-sora text-white font-semibold mb-4">{t.product}</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="hover:text-teal-400 transition-colors">{t.links.features}</a></li>
              <li><a href="#" className="hover:text-teal-400 transition-colors">{t.links.integrations}</a></li>
              <li><a href="#" className="hover:text-teal-400 transition-colors">{t.links.pricing}</a></li>
              <li><a href="#" className="hover:text-teal-400 transition-colors">{t.links.changelog}</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-sora text-white font-semibold mb-4">{t.resources}</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="hover:text-teal-400 transition-colors">{t.links.documentation}</a></li>
              <li><a href="#" className="hover:text-teal-400 transition-colors">{t.links.blog}</a></li>
              <li><a href="#" className="hover:text-teal-400 transition-colors">{t.links.standards}</a></li>
              <li><a href="#" className="hover:text-teal-400 transition-colors">{t.links.caseStudies}</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-sora text-white font-semibold mb-4">{t.organization}</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="hover:text-teal-400 transition-colors">{t.links.about}</a></li>
              <li><a href="#" className="hover:text-teal-400 transition-colors">{t.links.privacy}</a></li>
              <li><a href="#" className="hover:text-teal-400 transition-colors">{t.links.terms}</a></li>
              <li><a href="#" className="hover:text-teal-400 transition-colors">{t.links.contact}</a></li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center border-t border-slate-800 pt-8 text-sm text-slate-600">
          <p>{t.copyright}</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <a href="#" className="hover:text-teal-400 transition-colors">Twitter</a>
            <a href="#" className="hover:text-teal-400 transition-colors">LinkedIn</a>
            <a href="#" className="hover:text-teal-400 transition-colors">GitHub</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

