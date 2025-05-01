"use client";

import React from "react";
import { motion } from "framer-motion";
import { Brain, FileCog, Wand2, Mail, LayoutDashboard, ArrowRightLeft } from "lucide-react";
import { Section } from "@/components/ui/section";

export default function FeaturesSection() {
  const features = [
    {
      icon: <Brain className="h-8 w-8 text-blue-600" />,
      title: "AI-Powered Classification",
      description: "Go beyond simple filters. Our LLM understands context to identify valuable emails vs. noise, assigning a real-human probability score."
    },
    {
      icon: <FileCog className="h-8 w-8 text-blue-600" />,
      title: "Automated Triage",
      description: "Set it and forget it. Squire automatically files, archives, or deletes emails based on classification, keeping your primary inbox clean."
    },
    {
      icon: <Wand2 className="h-8 w-8 text-blue-600" />,
      title: "Agent Actions",
      description: "Handles the mundane: auto-deletes spam, archives low-priority mail, flags emails needing a drafted response."
    },
    {
      icon: <Mail className="h-8 w-8 text-blue-600" />,
      title: "Daily Email Digest",
      description: "Start your day with clarity. Get a summary of Squire's actions and any emails needing your attention, delivered to your inbox."
    },
    {
      icon: <LayoutDashboard className="h-8 w-8 text-blue-600" />,
      title: "Web Dashboard",
      description: "Full visibility and control. Review classifications, manage settings, approve drafts, and see your time-saving stats."
    },
    {
      icon: <ArrowRightLeft className="h-8 w-8 text-blue-600" />,
      title: "Altbot Synergy",
      description: "Seamlessly forward highly-qualified vendor leads (score ≥ 90) to our powerful agent platform, Altbot, for deeper engagement."
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <Section className="bg-white py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Core Features That Set Us Apart
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Squire combines powerful AI with thoughtful automation to transform your email experience.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div 
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300"
              whileHover={{ 
                y: -5,
                transition: { duration: 0.2 }
              }}
            >
              <div className="flex flex-col h-full">
                <div className="mb-4 p-3 bg-blue-50 rounded-lg w-fit">
                  {feature.icon}
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                
                <p className="text-gray-600 flex-grow mb-4">{feature.description}</p>
                
                {/* Visual enhancement element - unique to each card */}
                <div className="mt-auto">
                  {index === 0 && (
                    <div className="w-full bg-gray-100 h-10 rounded-md overflow-hidden">
                      <div className="h-full w-3/4 bg-gradient-to-r from-blue-500 to-teal-400 rounded-md relative">
                        <div className="absolute inset-0 flex items-center justify-end pr-2">
                          <span className="text-xs font-bold text-white">Human: 92%</span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {index === 1 && (
                    <div className="flex space-x-2">
                      <div className="flex-1 h-6 bg-red-100 rounded-md flex items-center justify-center">
                        <span className="text-xs text-red-800">Archived</span>
                      </div>
                      <div className="flex-1 h-6 bg-green-100 rounded-md flex items-center justify-center">
                        <span className="text-xs text-green-800">Flagged</span>
                      </div>
                      <div className="flex-1 h-6 bg-gray-100 rounded-md flex items-center justify-center">
                        <span className="text-xs text-gray-800">Filtered</span>
                      </div>
                    </div>
                  )}
                  
                  {index === 2 && (
                    <div className="flex items-center px-3 py-2 bg-gray-50 rounded-md">
                      <Wand2 className="h-4 w-4 text-purple-500 mr-2" />
                      <span className="text-xs text-gray-700">3 auto-responses generated today</span>
                    </div>
                  )}
                  
                  {index === 3 && (
                    <div className="px-3 py-2 bg-blue-50 rounded-md border-l-4 border-blue-500">
                      <span className="text-xs text-blue-800 font-medium">Your digest is ready to view</span>
                    </div>
                  )}
                  
                  {index === 4 && (
                    <div className="grid grid-cols-3 gap-1">
                      <div className="h-2 bg-blue-200 rounded-full"></div>
                      <div className="h-2 bg-teal-200 rounded-full"></div>
                      <div className="h-2 bg-purple-200 rounded-full"></div>
                      <div className="h-2 bg-yellow-200 rounded-full"></div>
                      <div className="h-2 bg-red-200 rounded-full"></div>
                      <div className="h-2 bg-gray-200 rounded-full"></div>
                    </div>
                  )}
                  
                  {index === 5 && (
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                        <span className="text-xs font-bold text-blue-800">S</span>
                      </div>
                      <div className="flex-1 h-px bg-gray-300"></div>
                      <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center ml-2">
                        <span className="text-xs font-bold text-purple-800">A</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Feature Highlight */}
        <motion.div 
          className="mt-20 bg-gradient-to-r from-blue-600 to-teal-500 rounded-2xl overflow-hidden shadow-xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className="grid md:grid-cols-2">
            <div className="p-8 md:p-12">
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                Intelligence That Learns and Adapts
              </h3>
              <p className="text-blue-100 mb-6">
                Squire's AI doesn't just filter—it learns from your interactions, adapting to your preferences
                and improving its accuracy over time. The more you use it, the smarter it gets.
              </p>
              <ul className="space-y-3">
                {[
                  "94% accuracy in identifying AI-generated outreach",
                  "Learns from your actions to improve filtering",
                  "Adapts to changing priorities and interests",
                  "Recognizes patterns in valuable communications"
                ].map((item, i) => (
                  <li key={i} className="flex items-start">
                    <svg className="h-5 w-5 text-teal-300 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-white">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white/10 p-8 md:p-12 flex items-center justify-center">
              <div className="relative w-full max-w-sm">
                {/* Brain visualization */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-32 w-32 rounded-full bg-blue-900/20 animate-pulse"></div>
                </div>
                <div className="relative bg-white/10 backdrop-blur-sm rounded-xl p-6">
                  {/* Neural network visualization */}
                  <div className="grid grid-cols-4 gap-2 mb-4">
                    {Array.from({ length: 16 }).map((_, i) => (
                      <div key={i} className="h-3 w-3 rounded-full bg-blue-300/60"></div>
                    ))}
                  </div>
                  <div className="space-y-3">
                    <div className="h-8 bg-white/20 rounded-md flex items-center px-2">
                      <div className="h-4 w-4 rounded-full bg-green-400 mr-2"></div>
                      <div className="h-2 flex-1 bg-white/40 rounded-full"></div>
                      <span className="text-xs text-white ml-2">98%</span>
                    </div>
                    <div className="h-8 bg-white/20 rounded-md flex items-center px-2">
                      <div className="h-4 w-4 rounded-full bg-yellow-400 mr-2"></div>
                      <div className="h-2 w-3/4 bg-white/40 rounded-full"></div>
                      <span className="text-xs text-white ml-2">76%</span>
                    </div>
                    <div className="h-8 bg-white/20 rounded-md flex items-center px-2">
                      <div className="h-4 w-4 rounded-full bg-red-400 mr-2"></div>
                      <div className="h-2 w-1/4 bg-white/40 rounded-full"></div>
                      <span className="text-xs text-white ml-2">24%</span>
                    </div>
                  </div>
                </div>
                
                {/* Connection lines */}
                <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 300 200" fill="none" preserveAspectRatio="none">
                  <path d="M50,40 C100,20 200,180 250,160" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
                  <path d="M50,80 C120,40 180,160 250,120" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
                  <path d="M50,120 C100,100 200,100 250,80" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
                </svg>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </Section>
  );
}