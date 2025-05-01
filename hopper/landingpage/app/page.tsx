"use client";

import React from "react";
import { Inter } from "next/font/google";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import dynamic from "next/dynamic";

// Dynamic imports for code splitting
const Hero = dynamic(() => import("@/components/landing/Hero"));
const ProblemSection = dynamic(() => import("@/components/landing/ProblemSection"));
const SolutionSection = dynamic(() => import("@/components/landing/SolutionSection"));
const HowItWorksSection = dynamic(() => import("@/components/landing/HowItWorksSection"));
const FeaturesSection = dynamic(() => import("@/components/landing/FeaturesSection"));
const TestimonialsSection = dynamic(() => import("@/components/landing/TestimonialsSection"));
const AltbotSection = dynamic(() => import("@/components/landing/AltbotSection"));
const PricingSection = dynamic(() => import("@/components/landing/PricingSection"));
const CTASection = dynamic(() => import("@/components/landing/CTASection"));
const Footer = dynamic(() => import("@/components/landing/Footer"));

export default function Home() {
  const scrollToNextSection = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: "smooth",
    });
  };

  return (
    <main className="relative w-full overflow-hidden">
      {/* Hero Section with full viewport height */}
      <Hero />
      
      {/* Scroll indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 cursor-pointer"
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
        onClick={scrollToNextSection}
      >
        <ChevronDown className="h-8 w-8 text-white/80" />
      </motion.div>

      {/* Main Content Sections */}
      <ProblemSection />
      <SolutionSection />
      <HowItWorksSection />
      <FeaturesSection />
      <TestimonialsSection />
      <AltbotSection />
      <PricingSection />
      <CTASection />
      <Footer />
    </main>
  );
}