"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/ui/section";

export default function PricingSection() {
  return (
    <Section className="bg-gradient-to-b from-white to-blue-50 py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Get Started with Squire Today
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join our beta program and experience the future of inbox management.
          </p>
        </motion.div>

        {/* Pricing Card */}
        <motion.div 
          className="max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            {/* Beta badge */}
            <div className="absolute top-6 right-6">
              <div className="bg-blue-600 text-white text-sm font-bold px-3 py-1 rounded-full">
                BETA
              </div>
            </div>

            {/* Content */}
            <div className="p-8 sm:p-10">
              <div className="flex items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Free Forever Beta</h3>
              </div>
              
              <div className="mb-6">
                <p className="text-5xl font-bold text-gray-900">$0</p>
                <p className="text-gray-500 mt-1">Free during our beta period</p>
              </div>
              
              <p className="text-gray-600 mb-8">
                Enjoy all core features of Squire for free while we&apos;re in beta. Help us shape the future of 
                inbox management with your valuable feedback.
              </p>
              
              <Link href="/signup">
                <Button size="lg" className="w-full bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 text-white py-6 rounded-md text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300">
                  Get Started Free
                </Button>
              </Link>
              
              <p className="text-center text-sm text-gray-500 mt-4">
                No credit card required. Cancel anytime.
              </p>
            </div>
            
            {/* Features */}
            <div className="bg-gray-50 p-8 sm:p-10 border-t border-gray-100">
              <h4 className="font-bold text-gray-900 mb-4">What&apos;s included:</h4>
              
              <ul className="space-y-3">
                {[
                  "AI-powered email classification",
                  "Automated email triage",
                  "Daily email digest",
                  "Gmail integration",
                  "Dashboard analytics",
                  "Custom rules and preferences",
                  "Altbot integration",
                  "Priority support"
                ].map((feature, i) => (
                  <li key={i} className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-teal-500 mr-3 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <div className="mt-8 p-4 bg-blue-50 border border-blue-100 rounded-lg">
                <p className="text-sm text-blue-800">
                  <span className="font-bold">Note:</span> After the beta period, we plan to introduce paid 
                  plans with additional features while maintaining a generous free tier. Beta users will receive 
                  priority access and special offers.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* FAQ Section */}
        <div className="mt-20 max-w-3xl mx-auto">
          <motion.h3 
            className="text-2xl font-bold text-gray-900 mb-8 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            Frequently Asked Questions
          </motion.h3>
          
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            {[
              {
                question: "Is my email data secure with Squire?",
                answer: "Absolutely. Squire uses OAuth for secure access and never stores the content of your emails. We only process metadata and email content during classification, with strict data security protocols in place."
              },
              {
                question: "Will Squire work with my non-Gmail email?",
                answer: "Currently, Squire is available exclusively for Gmail and Google Workspace accounts. We're exploring integration with other email providers in the future."
              },
              {
                question: "How accurate is the AI classification?",
                answer: "Our AI achieves over 92% accuracy in distinguishing between human, AI-generated, and spam emails. The system continually improves based on your interactions and feedback."
              },
              {
                question: "What happens after the beta period?",
                answer: "Beta users will be grandfathered into special pricing when we launch paid plans. You'll always have access to core features and will be the first to try new capabilities."
              }
            ].map((faq, i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h4 className="font-bold text-gray-900 mb-2">{faq.question}</h4>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </Section>
  );
} 