import React, { useEffect } from 'react';
import Navbar from '../components/landing/Navbar';
import HeroBanner from '../components/landing/HeroBanner';
import TrustedBy from '../components/landing/TrustedBy';
import ProductOverview from '../components/landing/ProductOverview';
import KeyFeatures from '../components/landing/KeyFeatures';
import BenefitsSection from '../components/landing/BenefitsSection';
import HowItWorks from '../components/landing/HowItWorks';
import ProductScreenshots from '../components/landing/ProductScreenshots';
import IntegrationSection from '../components/landing/IntegrationSection';
import IndustryUseCases from '../components/landing/IndustryUseCases';
import TestimonialsSection from '../components/landing/TestimonialsSection';
import StatsCounter from '../components/landing/StatsCounter';
import FAQSection from '../components/landing/FAQSection';
import CTABanner from '../components/landing/CTABanner';
import ContactSection from '../components/landing/ContactSection';
import Footer from '../components/landing/Footer';

const LandingPage: React.FC = () => {
  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <Navbar />
      <HeroBanner />
      <TrustedBy />
      <ProductOverview />
      <KeyFeatures />
      <BenefitsSection />
      <HowItWorks />
      <ProductScreenshots />
      <IntegrationSection />
      <IndustryUseCases />
      <StatsCounter />
      <TestimonialsSection />
      <FAQSection />
      <CTABanner />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default LandingPage;