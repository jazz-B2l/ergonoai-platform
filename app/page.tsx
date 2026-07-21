import { Navbar } from '@/components/landing/Navbar'
import { Hero } from '@/components/landing/Hero'
import { Standards } from '@/components/landing/Standards'
import { Problem } from '@/components/landing/Problem'
import { Features } from '@/components/landing/Features'
import { HowItWorks } from '@/components/landing/HowItWorks'
import { AiSpotlight } from '@/components/landing/AiSpotlight'
import { DashboardPreview } from '@/components/landing/DashboardPreview'
import { Statistics } from '@/components/landing/Statistics'
import { Faq } from '@/components/landing/Faq'
import { Footer } from '@/components/landing/Footer'
import { ScrollToTop } from '@/components/landing/ScrollToTop'

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-slate-100 transition-colors duration-300 font-sans isolate overflow-hidden">
      <Navbar />
      <Hero />
      <Standards />
      <Problem />
      <Features />
      <HowItWorks />
      <AiSpotlight />
      <DashboardPreview />
      <Statistics />
      <Faq />
      <Footer />
      <ScrollToTop />
    </main>
  )
}
