'use client'

import { useApp } from '@/lib/app-context'
import { useEffect, useState, useRef } from 'react'
import { TrendingUp, Users, ShieldCheck, Zap } from 'lucide-react'
import { StaggerContainer, StaggerItem, SpotlightCard } from '@/components/landing/ScrollReveal'

export function Statistics() {
  const { language } = useApp()
  const isAr = language === 'ar'

  const stats = [
    { target: 21, suffix: '%', label: isAr ? 'انخفاض مخاطر الآلام العضلية' : 'Average Risk Reduction', icon: TrendingUp },
    { target: 500, suffix: '+', label: isAr ? 'تقييم مكتمل عبر الأقسام' : 'Assessments Processed', icon: Users },
    { target: 98, suffix: '%', label: isAr ? 'دقة تحليلات الذكاء الاصطناعي' : 'AI Analysis Precision', icon: Zap },
    { target: 100, suffix: '%', label: isAr ? 'حماية سرية وخصوصية الموظف' : 'Privacy & Anonymity Rate', icon: ShieldCheck }
  ]

  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true)
      },
      { threshold: 0.3 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={ref} className="py-20 bg-slate-100 dark:bg-[#020617] border-b border-slate-200 dark:border-slate-800/80 relative overflow-hidden isolate transition-colors duration-300">
      <div className="absolute inset-0 bg-gradient-to-r from-teal-500/5 dark:from-teal-950/20 via-transparent to-cyan-500/5 dark:to-cyan-950/20 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <StaggerContainer className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => {
            const Icon = stat.icon
            return (
              <StaggerItem key={i}>
                <SpotlightCard className="p-6 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-center relative space-y-2 hover:border-teal-500/30 transition-all shadow-xl h-full">
                  <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-600 dark:text-teal-400 mx-auto mb-3">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="font-geist-mono text-4xl md:text-5xl font-bold text-slate-900 dark:text-white tracking-tight">
                    <Counter target={stat.target} visible={visible} />
                    <span className="text-teal-600 dark:text-teal-400">{stat.suffix}</span>
                  </div>
                  <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 font-medium font-sans pt-1">
                    {stat.label}
                  </p>
                </SpotlightCard>
              </StaggerItem>
            )
          })}
        </StaggerContainer>
      </div>
    </section>
  )
}

function Counter({ target, visible }: { target: number, visible: boolean }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!visible) return
    let start = 0
    const duration = 1500
    const increment = target / (duration / 16)
    
    const timer = setInterval(() => {
      start += increment
      if (start >= target) {
        setCount(target)
        clearInterval(timer)
      } else {
        setCount(Math.floor(start))
      }
    }, 16)
    return () => clearInterval(timer)
  }, [target, visible])

  return <span>{count}</span>
}

