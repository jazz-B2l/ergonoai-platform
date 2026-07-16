'use client'

import { useApp } from '@/lib/app-context'
import { translations } from '@/lib/translations'
import { useEffect, useState, useRef } from 'react'

export function Statistics() {
  const { language } = useApp()
  const t = translations[language].statistics

  const stats = [
    { target: 87, suffix: "%", label: t.items[0].label },
    { target: 500, suffix: "+", label: t.items[1].label },
    { target: 98, suffix: "%", label: t.items[2].label },
    { target: 50, suffix: "+", label: t.items[3].label }
  ]

  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true)
      },
      { threshold: 0.5 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])


  return (
    <section ref={ref} className="py-24 bg-teal-900 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#14b8a611_1px,transparent_1px),linear-gradient(to_bottom,#14b8a611_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((stat, i) => (
            <div key={i} className="p-6">
              <div className="font-geist-mono text-5xl md:text-6xl font-bold text-teal-400 mb-2">
                <Counter target={stat.target} visible={visible} />{stat.suffix}
              </div>
              <p className="text-slate-300 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Counter({ target, visible }: { target: number, visible: boolean }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!visible) return
    let start = 0
    const duration = 2000
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
