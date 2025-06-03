"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Section } from "@/components/ui/section";

export default function CTASection() {
  return (
    <Section className="bg-gradient-to-r from-blue-900 to-blue-700 py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Column: Text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              Ready to Tame Your Inbox?
            </h2>
            
            <p className="text-xl text-blue-100 mb-8">
              Install the free Chrome Extension and experience automated email triage in minutes.
              Start focusing on what truly matters.
            </p>
            
            <div className="space-y-4">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                viewport={{ once: true }}
              >
                <Link href="/signup">
                  <Button 
                    size="lg" 
                    className="w-full sm:w-auto bg-white text-blue-800 hover:bg-gray-100 flex items-center justify-center shadow-xl px-8 py-6 text-lg"
                  >
                    Get Started Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </motion.div>
              
              <p className="text-blue-200 text-sm">
                Secure OAuth Connection. We respect your privacy.
              </p>
            </div>
          </motion.div>
          
          {/* Right Column: Stats & Benefits */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-white"
          >
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <h3 className="font-bold text-xl mb-4">What Users Are Saying</h3>
              
              <div className="space-y-4">
                <div className="flex">
                  <div className="flex-shrink-0 mr-3">
                    <div className="h-10 w-10 rounded-full bg-blue-800 flex items-center justify-center">
                      <span className="font-bold text-white">JD</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-white/90 italic">
                      &quot;I was drowning in vendor emails. Squire helped me cut through the noise instantly.&quot;
                    </p>
                    <p className="text-blue-300 text-sm mt-1">James D., CTO</p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="flex-shrink-0 mr-3">
                    <div className="h-10 w-10 rounded-full bg-blue-800 flex items-center justify-center">
                      <span className="font-bold text-white">MK</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-white/90 italic">
                      &quot;The time I&apos;ve saved has been incredible. Now I only see emails that actually matter.&quot;
                    </p>
                    <p className="text-blue-300 text-sm mt-1">Maria K., Founder</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-white/10">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-3xl font-bold text-white mb-1">5h+</p>
                    <p className="text-blue-200 text-sm">Saved Weekly</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-white mb-1">92%</p>
                    <p className="text-blue-200 text-sm">Accuracy</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-white mb-1">2 min</p>
                    <p className="text-blue-200 text-sm">Setup Time</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </Section>
  );
} 