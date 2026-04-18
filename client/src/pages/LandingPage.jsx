import Navbar from '../components/Navbar'
import HeroSection from '../sections/HeroSection'
import DashboardSection from '../sections/DashboardSection'
import FeaturesSection from '../sections/FeaturesSection'
import BenefitsSection from '../sections/BenefitsSection'
import FAQSection from '../sections/FAQSection'
import Footer from '../components/Footer'

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <DashboardSection />
        <FeaturesSection />
        <BenefitsSection />
        <FAQSection />
      </main>
      <Footer />
    </>
  )
}
