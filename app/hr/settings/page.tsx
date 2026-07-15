'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function HRSettingsPage() {
  const router = useRouter()
  
  useEffect(() => {
    router.replace('/org/profile')
  }, [router])

  return null
}
