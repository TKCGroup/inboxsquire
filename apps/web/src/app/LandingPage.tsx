import Header from '@/components/landing/layout/Header';
import Footer from '@/components/landing/layout/Footer';
import Hero from '@/components/landing/sections/Hero';
import Problem from '@/components/landing/sections/ProblemSection';
import Solution from '@/components/landing/sections/SolutionSection';
import HowItWorks from '@/components/landing/sections/HowItWorksSection';
import Features from '@/components/landing/sections/FeaturesSection';
import Testimonials from '@/components/landing/sections/TestimonialsSection';
// import Integrations from '@/components/landing/sections/IntegrationsSection';
import Pricing from '@/components/landing/sections/PricingSection';
import FinalCTA from '@/components/landing/sections/CTASection';
import ScrollToTop from '@/components/landing/ui/ScrollToTop';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <Hero />
        <Problem />
        <Solution />
        <HowItWorks />
        <Features />
        <Testimonials />
        {/* <Integrations /> */}
        <Pricing />
        <FinalCTA />
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}