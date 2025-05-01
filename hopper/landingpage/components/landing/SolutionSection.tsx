"use client";

import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, CheckCircle2 } from "lucide-react";
import { Section } from "@/components/ui/section";

export default function SolutionSection() {
  return (
    <Section className="bg-gradient-to-b from-blue-50 to-white py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Column: Visual */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-100px" }}
            className="relative"
          >
            <div className="relative mx-auto max-w-md">
              {/* Background glow effect */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-teal-500/20 rounded-full blur-3xl"></div>
              
              {/* Main visual */}
              <motion.div 
                className="relative z-10 bg-white rounded-xl shadow-xl p-8 border border-gray-200"
                whileHover={{ y: -5, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex justify-center mb-6">
                  <div className="h-20 w-20 rounded-full bg-gradient-to-br from-teal-400 to-blue-600 flex items-center justify-center">
                    <ShieldCheck className="h-10 w-10 text-white" />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center bg-gray-50 p-3 rounded-lg">
                    <CheckCircle2 className="h-5 w-5 text-teal-500 mr-3" />
                    <p className="text-gray-800">Intelligent email categorization</p>
                  </div>
                  
                  <div className="flex items-center bg-gray-50 p-3 rounded-lg">
                    <CheckCircle2 className="h-5 w-5 text-teal-500 mr-3" />
                    <p className="text-gray-800">Automatic triage and filing</p>
                  </div>
                  
                  <div className="flex items-center bg-gray-50 p-3 rounded-lg">
                    <CheckCircle2 className="h-5 w-5 text-teal-500 mr-3" />
                    <p className="text-gray-800">Daily digest of relevant emails</p>
                  </div>
                  
                  <div className="flex items-center bg-gray-50 p-3 rounded-lg">
                    <CheckCircle2 className="h-5 w-5 text-teal-500 mr-3" />
                    <p className="text-gray-800">Real human probability scoring</p>
                  </div>
                </div>
              </motion.div>
              
              {/* Decorative elements */}
              <div className="absolute -top-6 -right-6 h-16 w-16 bg-blue-100 rounded-lg transform rotate-12 z-0"></div>
              <div className="absolute -bottom-6 -left-6 h-16 w-16 bg-teal-100 rounded-lg transform -rotate-12 z-0"></div>
            </div>
          </motion.div>
          
          {/* Right Column: Text */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              Meet Squire: Your Intelligent Email Filter
            </h2>
            
            <p className="text-lg text-gray-700 mb-6">
              Squire is a lightweight Gmail extension powered by advanced AI that automatically triages 
              vendor and outreach emails, giving you back control of your inbox and your day.
            </p>
            
            <div className="space-y-5 mb-8">
              <div className="border-l-4 border-teal-500 pl-4">
                <p className="text-gray-700">
                  <span className="font-semibold text-teal-700">Natural language understanding</span> that 
                  goes beyond simple filters, identifying true value in your communications.
                </p>
              </div>
              
              <div className="border-l-4 border-teal-500 pl-4">
                <p className="text-gray-700">
                  <span className="font-semibold text-teal-700">Set-it-and-forget-it automation</span> that 
                  works silently in the background, keeping inbox chaos at bay.
                </p>
              </div>
              
              <div className="border-l-4 border-teal-500 pl-4">
                <p className="text-gray-700">
                  <span className="font-semibold text-teal-700">Customizable rules and preferences</span> that 
                  adapt to your unique workflow and decision-making style.
                </p>
              </div>
            </div>
            
            <motion.p 
              className="text-xl text-blue-800 font-medium"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              viewport={{ once: true }}
            >
              Imagine your inbox finally working for you, not against you.
            </motion.p>
          </motion.div>
        </div>
      </div>
    </Section>
  );
}