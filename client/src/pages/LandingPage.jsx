import PortfolioNavbar from '../components/PortfolioNavbar'
import ScrollIntro from '../components/ScrollIntro'
import HeroSection from '../sections/HeroSection'
import DashboardSection from '../sections/DashboardSection'
import FeaturesSection from '../sections/FeaturesSection'
import BenefitsSection from '../sections/BenefitsSection'
import FAQSection from '../sections/FAQSection'
import PortfolioFooter from '../components/PortfolioFooter'

export default function LandingPage() {
  return (
    <div className="portfolio-theme">
      <PortfolioNavbar />
      <main>
        <ScrollIntro>
          <HeroSection />
        </ScrollIntro>
        <DashboardSection />
        <FeaturesSection />
        <BenefitsSection />
        <FAQSection />
      </main>
      <PortfolioFooter />
    </div>
  )
}


