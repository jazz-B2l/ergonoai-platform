'use client'

import { useState, useRef, useEffect } from 'react'
import { Globe, Check, ChevronDown } from 'lucide-react'
import { useApp } from '@/lib/app-context'
import type { Language } from '@/lib/translations'
import { cn } from '@/lib/utils'

interface LanguageSwitcherProps {
  variant?: 'dropdown' | 'segmented' | 'compact'
  className?: string
}

const languages: { code: Language; label: string; nativeName: string; flag: string }[] = [
  { code: 'en', label: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'fr', label: 'Français', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'ar', label: 'Arabic', nativeName: 'العربية', flag: '🇩🇿' },
]

export function LanguageSwitcher({ variant = 'dropdown', className }: LanguageSwitcherProps) {
  const { language, setLanguage } = useApp()
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const currentLang = languages.find(l => l.code === language) || languages[0]

  if (variant === 'segmented') {
    return (
      <div className={cn('inline-flex items-center p-1 rounded-xl bg-muted/70 border border-border', className)}>
        {languages.map(l => (
          <button
            key={l.code}
            type="button"
            onClick={() => setLanguage(l.code)}
            className={cn(
              'px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5',
              language === l.code
                ? 'bg-card text-foreground shadow-sm border border-border/50'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <span>{l.flag}</span>
            <span>{l.nativeName}</span>
          </button>
        ))}
      </div>
    )
  }

  return (
    <div className={cn('relative inline-block text-left', className)} ref={menuRef}>
      <button
        type="button"
        onClick={() => setIsOpen(prev => !prev)}
        className={cn(
          'flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer',
          'bg-card/90 hover:bg-muted border-border text-foreground shadow-sm hover:border-brand/40',
          isOpen && 'border-brand ring-2 ring-brand/20'
        )}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <Globe className="w-3.5 h-3.5 text-brand" />
        <span className="flex items-center gap-1.5">
          <span>{currentLang.flag}</span>
          <span>{currentLang.nativeName}</span>
        </span>
        <ChevronDown className={cn('w-3 h-3 text-muted-foreground transition-transform duration-200', isOpen && 'rotate-180')} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1.5 w-44 rounded-xl bg-card border border-border shadow-xl py-1 z-50 animate-in fade-in-0 zoom-in-95 duration-150">
          <div className="px-3 py-1.5 text-[10px] font-semibold tracking-wider text-muted-foreground uppercase border-b border-border/60">
            Language / Langue / اللغة
          </div>
          {languages.map(l => (
            <button
              key={l.code}
              type="button"
              onClick={() => {
                setLanguage(l.code)
                setIsOpen(false)
              }}
              className={cn(
                'w-full flex items-center justify-between px-3 py-2 text-xs font-medium transition-colors text-left cursor-pointer hover:bg-muted',
                language === l.code ? 'text-brand font-semibold bg-brand/5' : 'text-foreground'
              )}
            >
              <div className="flex items-center gap-2.5">
                <span className="text-base leading-none">{l.flag}</span>
                <div className="flex flex-col text-left">
                  <span>{l.nativeName}</span>
                  <span className="text-[10px] text-muted-foreground">{l.label}</span>
                </div>
              </div>
              {language === l.code && <Check className="w-3.5 h-3.5 text-brand" />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
