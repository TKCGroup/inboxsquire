"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Clock, Mail, Brain, Frown } from "lucide-react";
import { Section } from "@/components/ui/section";

// Define a type for the chaotic email style
type ChaoticEmailStyle = {
  top: string;
  left: string;
  transform: string;
  zIndex: number;
  opacity: number; // Use state for opacity if needed for animation
};

export default function ProblemSection() {
  const problems = [
    {
      icon: <Clock className="h-8 w-8 text-red-500" />,
      title: "Time Wasted on Irrelevant Demos",
      description: "Hours lost sifting through vendor pitches that aren't aligned with your needs or priorities."
    },
    {
      icon: <Mail className="h-8 w-8 text-red-500" />,
      title: "Constant AI SDR Noise",
      description: "Your inbox flooded with generic, AI-generated outreach that misses the mark on your requirements."
    },
    {
      icon: <Brain className="h-8 w-8 text-red-500" />,
      title: "Cognitive Overload",
      description: "Decision fatigue from constant interruptions that pull focus from your most important work."
    },
    {
      icon: <Frown className="h-8 w-8 text-red-500" />,
      title: "Missed Opportunities",
      description: "High-value connections buried under piles of low-quality outreach emails."
    },
  ];

  const [emailStyles, setEmailStyles] = useState<ChaoticEmailStyle[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      setEmailStyles(
        Array.from({ length: 15 }).map(() => ({
          top: `${Math.random() * 70}%`,
          left: `${Math.random() * 80}%`,
          transform: `rotate(${Math.random() * 10 - 5}deg) scale(${0.7 + Math.random() * 0.3})`,
          zIndex: Math.floor(Math.random() * 10),
          opacity: 0.8, // Set initial opacity state
        }))
      );
    }
  }, [isClient]);

  return (
    <Section className="bg-white py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Is Your Inbox Working Against You?</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            While innovation accelerates, so does the noise in your inbox. Every day, executives waste precious time that could be spent on what matters most.
          </p>
        </motion.div>

        {/* Chaotic Email Visual */}
        <div className="relative mb-16 h-40 sm:h-52 overflow-hidden rounded-lg">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-800 to-blue-900 opacity-90"></div>
          
          {/* Email previews scattered across - Use generated styles */}
          {emailStyles.map((style, i) => (
            <motion.div
              key={i}
              className="absolute bg-white/90 shadow-md rounded-md p-3 w-56 sm:w-64"
              initial={{ opacity: 0 }} // Start transparent
              whileInView={{ opacity: 0.8 }} // Animate opacity when in view
              viewport={{ once: true, amount: 0.3 }} // Trigger animation when 30% visible
              transition={{ delay: i * 0.05, duration: 0.5 }} // Slightly faster delay
              style={{
                top: style.top,
                left: style.left,
                transform: style.transform,
                zIndex: style.zIndex,
                // Opacity is now controlled by framer-motion, not directly in style
              }}
            >
              <div className="flex items-center gap-2 mb-1">
                <div className="w-4 h-4 rounded-full bg-gray-400"></div>
                <div className="h-3 w-24 bg-gray-300 rounded"></div>
              </div>
              <div className="h-2 w-full bg-gray-200 rounded mb-1"></div>
              <div className="h-2 w-3/4 bg-gray-200 rounded"></div>
            </motion.div>
          ))}
        </div>

        {/* Problem Points */}
        <div className="grid md:grid-cols-2 gap-8 mt-12">
          {problems.map((problem, index) => (
            <motion.div
              key={index}
              className="flex items-start p-6 rounded-lg border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              viewport={{ once: true, margin: "-50px" }}
            >
              <div className="flex-shrink-0 mr-4">{problem.icon}</div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{problem.title}</h3>
                <p className="text-gray-600">{problem.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Statistics */}
        <motion.div 
          className="mt-20 bg-gray-100 rounded-xl p-8 shadow-inner"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className="grid sm:grid-cols-3 gap-6 text-center">
            <div>
              <p className="text-4xl font-bold text-blue-800 mb-2">4.1 hours</p>
              <p className="text-gray-600">Average time executives spend managing email weekly</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-blue-800 mb-2">73%</p>
              <p className="text-gray-600">Of vendor emails are irrelevant to your current needs</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-blue-800 mb-2">27%</p>
              <p className="text-gray-600">Increase in SDR outreach using AI templates</p>
            </div>
          </div>
        </motion.div>
      </div>
    </Section>
  );
} 