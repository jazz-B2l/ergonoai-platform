'use client'

import { useApp } from '@/lib/app-context'
import { Sun, Moon } from 'lucide-react'

export function ThemeToggle() {
  const { theme, toggleTheme } = useApp()

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className="p-2 rounded-xl bg-muted/80 hover:bg-muted text-foreground border border-border hover:border-brand/40 transition-all duration-200 flex items-center justify-center cursor-pointer active:scale-95 shadow-sm"
      title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    >
      {theme === 'dark' ? (
        <Sun className="w-4 h-4 text-amber-400 animate-in duration-300" />
      ) : (
        <Moon className="w-4 h-4 text-slate-600 animate-in duration-300" />
      )}
    </button>
  )
}
