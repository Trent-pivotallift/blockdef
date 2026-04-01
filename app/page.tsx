import Navbar from '@/components/shared/Navbar'
import HeroSection from '@/components/landing/HeroSection'
import HowItWorksSection from '@/components/landing/HowItWorksSection'
import PersonaSection from '@/components/landing/PersonaSection'
import WaitlistSection from '@/components/landing/WaitlistSection'
import FooterSection from '@/components/landing/FooterSection'

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <HowItWorksSection />
        <PersonaSection />
        <WaitlistSection />
      </main>
      <FooterSection />
    </>
  )
}
