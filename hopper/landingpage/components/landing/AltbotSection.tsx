"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight, Bot, MessageSquareText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/ui/section";

export default function AltbotSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  return (
    <Section className="bg-gray-900 py-24 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={containerRef} className="relative">
          {/* Background grid pattern */}
          <div className="absolute inset-0 grid grid-cols-10 grid-rows-10">
            {Array.from({ length: 100 }).map((_, i) => (
              <div 
                key={i}
                className="border-gray-800"
                style={{ 
                  borderWidth: i % 10 === 0 || i < 10 ? '0.5px' : '0', 
                  borderRightWidth: '0.5px',
                  borderBottomWidth: '0.5px'
                }}
              ></div>
            ))}
          </div>
          
          {/* Content */}
          <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
            {/* Left Column: Squire */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
              transition={{ duration: 0.8 }}
            >
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-lg">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-teal-400 flex items-center justify-center mr-3">
                      <span className="text-white font-bold">S</span>
                    </div>
                    <span className="text-white text-lg font-medium">Squire</span>
                  </div>
                  <span className="px-3 py-1 bg-blue-900/50 text-blue-300 text-xs rounded-full">Active</span>
                </div>
                
                <h3 className="text-xl font-bold text-white mb-4">Email Filtering & Triage</h3>
                
                <div className="space-y-2 mb-6">
                  <div className="flex items-center text-gray-300">
                    <svg className="h-5 w-5 text-teal-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>AI-powered email classification</span>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <svg className="h-5 w-5 text-teal-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Automated inbox management</span>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <svg className="h-5 w-5 text-teal-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Daily email digests</span>
                  </div>
                </div>
                
                <div className="mt-6 py-3 px-4 bg-gray-700/50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Bot className="h-5 w-5 text-teal-400 mr-2" />
                      <span className="text-gray-300 text-sm">Processing incoming emails...</span>
                    </div>
                    <span className="animate-pulse h-2 w-2 bg-teal-400 rounded-full"></span>
                  </div>
                </div>
              </div>
            </motion.div>
            
            {/* Connection Line */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 hidden md:block">
              <motion.div 
                className="relative h-px w-28 bg-gradient-to-r from-blue-400 to-purple-400"
                initial={{ scaleX: 0, opacity: 0 }}
                animate={isInView ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
                transition={{ duration: 0.8, delay: 1 }}
              >
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-gray-800 border-2 border-purple-400 flex items-center justify-center">
                  <ArrowRight className="h-4 w-4 text-purple-400" />
                </div>
              </motion.div>
            </div>
            
            {/* Right Column: Altbot */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-lg">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-500 to-indigo-400 flex items-center justify-center mr-3">
                      <span className="text-white font-bold">A</span>
                    </div>
                    <span className="text-white text-lg font-medium">Altbot</span>
                  </div>
                  <span className="px-3 py-1 bg-purple-900/50 text-purple-300 text-xs rounded-full">Advanced</span>
                </div>
                
                <h3 className="text-xl font-bold text-white mb-4">AI-Powered Business Agent</h3>
                
                <div className="space-y-2 mb-6">
                  <div className="flex items-center text-gray-300">
                    <svg className="h-5 w-5 text-purple-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Advanced conversation capabilities</span>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <svg className="h-5 w-5 text-purple-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Automated qualification of leads</span>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <svg className="h-5 w-5 text-purple-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Calendar scheduling & follow-ups</span>
                  </div>
                </div>
                
                <div className="mt-6 py-3 px-4 bg-gray-700/50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <MessageSquareText className="h-5 w-5 text-purple-400 mr-2" />
                      <span className="text-gray-300 text-sm">3 active conversations</span>
                    </div>
                    <span className="animate-pulse h-2 w-2 bg-purple-400 rounded-full"></span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
          
          {/* Text content */}
          <motion.div 
            className="text-center mt-16 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              Ready for More Than Just Filtering?
            </h2>
            <p className="text-lg text-gray-300 mb-8">
              When a high-value opportunity is identified by Squire (score ≥ 90), seamlessly hand it off to Altbot,
              our AI-powered business agent that can engage with vendors, qualify opportunities, 
              schedule meetings, and handle follow-ups—all without your manual intervention.
            </p>
            <Button size="lg" variant="outline" className="text-purple-300 border-purple-700 hover:bg-purple-950 hover:text-purple-200">
              Learn More About Altbot
            </Button>
          </motion.div>
        </div>
      </div>
    </Section>
  );
}