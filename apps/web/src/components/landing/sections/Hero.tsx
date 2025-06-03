"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ShieldCheck } from "lucide-react";

// Define a type for the particle style
type ParticleStyle = {
  width: string;
  height: string;
  top: string;
  left: string;
  initialOpacity: number; // Store initial random opacity
  scrollFactor: number; // Store initial random scroll factor
};

export default function Hero() {
  const [scrollY, setScrollY] = useState(0);
  const [particleStyles, setParticleStyles] = useState<ParticleStyle[]>([]);
  const [isClient, setIsClient] = useState(false); // Flag to track client-side mount

  // Effect to handle scroll updates
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    setIsClient(true); // Set client flag on mount

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Effect to generate particle styles ONLY on the client side after mount
  useEffect(() => {
    if (isClient) { // Only run on client after initial mount
      setParticleStyles(
        Array.from({ length: 20 }).map(() => ({
          width: Math.random() * 10 + 2 + "px",
          height: Math.random() * 10 + 2 + "px",
          top: Math.random() * 100 + "%",
          left: Math.random() * 100 + "%",
          initialOpacity: Math.random() * 0.5 + 0.3,
          scrollFactor: 0.1 + Math.random() * 0.2,
        }))
      );
    }
  }, [isClient]); // Depend on isClient flag

  return (
    <div className="relative h-screen w-full overflow-hidden bg-gradient-to-b from-[#0f172a] to-[#1e293b]">
      {/* Background particles - Render only after styles are generated */}
      <div className="absolute inset-0 opacity-20">
        {particleStyles.map((style, i) => (
          <div 
            key={i}
            className="absolute rounded-full bg-white/30 transition-transform duration-100 ease-out" // Added transition for smoothness
            style={{
              width: style.width,
              height: style.height,
              top: style.top,
              left: style.left,
              opacity: style.initialOpacity, // Use stored initial opacity
              // Calculate transform based on stored scrollFactor and current scrollY
              transform: `translateY(${scrollY * style.scrollFactor}px)`, 
            }}
          />
        ))}
      </div>

      {/* Content with parallax effect */}
      <div 
        className="absolute inset-0 flex items-center justify-center"
        style={{ transform: `translateY(${scrollY * 0.2}px)` }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            {/* Logo/Icon */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="flex justify-center mb-6"
            >
              <div className="h-20 w-20 rounded-full bg-gradient-to-br from-teal-400 to-blue-600 flex items-center justify-center">
                <ShieldCheck className="h-10 w-10 text-white" />
              </div>
            </motion.div>

            {/* Main Headline */}
            <motion.h1 
              className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.61, delay: 0.3 }}
            >
              <span className="block">Reclaim Your Focus.</span>
              <span className="block bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-blue-500">
                Master Your Inbox.
              </span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p 
              className="mt-6 max-w-2xl mx-auto text-xl sm:text-2xl text-gray-300"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              Squire intelligently classifies your outreach emails, sends you a daily digest, 
              and lets you take action in seconds.
            </motion.p>

            {/* CTA Button */}
            <motion.div 
              className="mt-10"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              <Link href="/signup">
                <Button size="lg" className="bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 text-white px-8 py-6 rounded-md text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300">
                  Get Started Free
                </Button>
              </Link>
              <p className="mt-4 text-sm text-gray-400">
                Secure OAuth Connection. We respect your privacy.
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Decorative waves at bottom */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-24 sm:h-32 md:h-40"
        style={{ 
          transform: `translateY(${Math.min(scrollY * 0.5, 100)}px)`,
          opacity: Math.max(1 - scrollY * 0.003, 0),
        }}
      >
        <svg 
          className="h-full w-full" 
          viewBox="0 0 1440 320" 
          preserveAspectRatio="none"
        >
          <path 
            className="fill-white/5"
            d="M0,224L60,213.3C120,203,240,181,360,181.3C480,181,600,203,720,224C840,245,960,267,1080,261.3C1200,256,1320,224,1380,208L1440,192L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
          ></path>
          <path 
            className="fill-white/10"
            d="M0,288L48,261.3C96,235,192,181,288,154.7C384,128,480,128,576,149.3C672,171,768,213,864,202.7C960,192,1056,128,1152,117.3C1248,107,1344,149,1392,170.7L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
        </svg>
      </div>
    </div>
  );
} 