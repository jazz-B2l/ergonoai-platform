import { Navbar } from '@/components/landing/Navbar'
import { Hero } from '@/components/landing/Hero'
import { Standards } from '@/components/landing/Standards'
import { Problem } from '@/components/landing/Problem'
import { Features } from '@/components/landing/Features'
import { HowItWorks } from '@/components/landing/HowItWorks'
import { AiSpotlight } from '@/components/landing/AiSpotlight'
import { DashboardPreview } from '@/components/landing/DashboardPreview'
import { Statistics } from '@/components/landing/Statistics'
import { Pricing } from '@/components/landing/Pricing'
import { Faq } from '@/components/landing/Faq'
import { Footer } from '@/components/landing/Footer'

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <Navbar />
      <Hero />
      <Standards />
      <Problem />
      <Features />
      <HowItWorks />
      <AiSpotlight />
      <DashboardPreview />
      <Statistics />
      <Pricing />
      <Faq />
      <Footer />
    </main>
  )
}
