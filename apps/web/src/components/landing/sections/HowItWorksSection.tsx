"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Download, Shield, Sparkles, MailCheck, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";
import { Section } from "@/components/ui/section";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function HowItWorksSection() {
  const [activeStep, setActiveStep] = useState(0);
  
  const steps = [
    {
      icon: <Download className="h-6 w-6" />,
      title: "Install & Connect",
      description: "Install the Chrome Extension and connect your Gmail securely through OAuth."
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Automatic Classification",
      description: "Squire's AI reads and scores new outreach emails as they arrive in your inbox."
    },
    {
      icon: <Sparkles className="h-6 w-6" />,
      title: "Smart Triage",
      description: "Emails are automatically labeled, archived, or flagged based on your preferences."
    },
    {
      icon: <MailCheck className="h-6 w-6" />,
      title: "Daily Digest",
      description: "Receive a concise summary email with key insights and pending actions."
    },
    {
      icon: <LayoutDashboard className="h-6 w-6" />,
      title: "Dashboard Control",
      description: "Manage settings, review classifications, and approve draft responses."
    },
  ];

  return (
    <Section className="bg-gray-50 py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Get Set Up in Minutes. Save Hours Every Week.
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Squire seamlessly integrates with your workflow through a simple, secure process.
          </p>
        </motion.div>

        {/* Steps visualization */}
        <div className="relative">
          {/* Progress Line */}
          <div className="hidden md:block absolute top-24 left-0 right-0 h-1 bg-gray-200">
            <motion.div 
              className="h-full bg-blue-600 rounded-full"
              initial={{ width: '0%' }}
              animate={{ width: `${(activeStep + 1) * (100 / steps.length)}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>

          {/* Steps */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-5 gap-8 relative z-10"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {steps.map((step, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className={cn(
                  "relative cursor-pointer",
                  index <= activeStep ? "opacity-100" : "opacity-60"
                )}
                onMouseEnter={() => setActiveStep(index)}
                onClick={() => setActiveStep(index)}
              >
                {/* Step Number Circle */}
                <div className="hidden md:flex items-center justify-center h-12 w-12 rounded-full bg-white shadow-md border border-gray-200 mx-auto mb-4">
                  <span 
                    className={cn(
                      "text-lg font-bold",
                      index <= activeStep ? "text-blue-600" : "text-gray-400"
                    )}
                  >
                    {index + 1}
                  </span>
                </div>

                {/* Card */}
                <div 
                  className={cn(
                    "px-6 py-5 rounded-lg transition-all duration-300",
                    index === activeStep 
                      ? "bg-white shadow-lg border-t-4 border-blue-500" 
                      : "bg-white/80 border border-gray-100"
                  )}
                >
                  <div className="flex md:block items-center mb-2">
                    {/* Mobile only step number */}
                    <div className="md:hidden flex items-center justify-center h-8 w-8 rounded-full bg-blue-100 mr-3">
                      <span className="text-sm font-bold text-blue-600">{index + 1}</span>
                    </div>
                    
                    <div className={cn(
                      "hidden md:flex items-center justify-center h-12 w-12 rounded-full mx-auto mb-4",
                      index === activeStep ? "bg-blue-100" : "bg-gray-100" 
                    )}>
                      <div className={cn(
                        index === activeStep ? "text-blue-600" : "text-gray-500" 
                      )}>
                        {step.icon}
                      </div>
                    </div>
                    
                    <h3 className={cn(
                      "font-bold mb-2",
                      index === activeStep ? "text-blue-800" : "text-gray-700"
                    )}>
                      {step.title}
                    </h3>
                  </div>
                  
                  <p className="text-gray-600 text-sm">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Visual animation of current step */}
        <motion.div 
          className="mt-16 h-64 sm:h-80 bg-white rounded-xl shadow-lg overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className="h-12 bg-gray-100 border-b border-gray-200 flex items-center px-4">
            <div className="flex space-x-2">
              <div className="h-3 w-3 rounded-full bg-red-400"></div>
              <div className="h-3 w-3 rounded-full bg-yellow-400"></div>
              <div className="h-3 w-3 rounded-full bg-green-400"></div>
            </div>
            <div className="mx-auto text-sm text-gray-500 font-medium">
              {activeStep === 0 && "Chrome Web Store"}
              {activeStep === 1 && "Gmail Inbox - Squire Classification"}
              {activeStep === 2 && "Squire Smart Triage"}
              {activeStep === 3 && "Daily Email Digest"}
              {activeStep === 4 && "Squire Dashboard"}
            </div>
          </div>
          
          <div className="p-4 h-full flex items-center justify-center">
            {activeStep === 0 && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col items-center"
              >
                <div className="w-64 h-48 bg-blue-50 rounded-lg border border-blue-100 flex items-center justify-center mb-4">
                  <div className="text-center p-4">
                    <div className="h-16 w-16 rounded-full bg-gradient-to-br from-teal-400 to-blue-600 flex items-center justify-center mx-auto mb-4">
                      <Download className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="font-bold text-gray-800">Squire for Gmail</h3>
                    <p className="text-sm text-gray-600 mt-2">Your intelligent email assistant</p>
                  </div>
                </div>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center space-x-2">
                  <Download className="h-4 w-4" />
                  <span>Add to Chrome</span>
                </button>
              </motion.div>
            )}
            
            {activeStep === 1 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-lg"
              >
                <div className="mb-3 p-3 border-l-4 border-blue-500 bg-blue-50 rounded-r-md">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                        <Shield className="h-4 w-4 text-blue-600" />
                      </div>
                      <span className="font-medium text-blue-800">Squire: Classification Active</span>
                    </div>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Real Human: 92%</span>
                  </div>
                </div>
                
                {[1, 2, 3].map((_, i) => (
                  <div key={i} className="flex items-center border-b border-gray-100 py-3">
                    <div className="w-8 h-8 bg-gray-200 rounded-full mr-3"></div>
                    <div className="flex-1">
                      <div className="h-4 w-2/3 bg-gray-200 rounded mb-1"></div>
                      <div className="h-3 w-1/2 bg-gray-100 rounded"></div>
                    </div>
                    <div className="ml-4 text-xs py-1 px-2 rounded-full" style={{
                      backgroundColor: i === 0 ? 'rgb(219 234 254)' : i === 1 ? 'rgb(254 226 226)' : 'rgb(236 253 245)',
                      color: i === 0 ? 'rgb(37 99 235)' : i === 1 ? 'rgb(220 38 38)' : 'rgb(5 150 105)'
                    }}>
                      {i === 0 ? 'Human: 94%' : i === 1 ? 'AI: 87%' : 'Relevant: 82%'}
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
            
            {activeStep === 2 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-lg"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                    <div className="text-red-800 font-medium mb-1">Archived</div>
                    <div className="h-16 bg-red-100 rounded flex items-center justify-center text-red-400">
                      (Email Preview)
                    </div>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
                    <div className="text-yellow-800 font-medium mb-1">Flagged for Review</div>
                    <div className="h-16 bg-yellow-100 rounded flex items-center justify-center text-yellow-400">
                      (Email Preview)
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 col-span-2">
                    <div className="text-gray-800 font-medium mb-1">Kept in Inbox</div>
                    <div className="h-16 bg-gray-100 rounded flex items-center justify-center text-gray-400">
                      (Email Preview)
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeStep === 3 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-lg"
              >
                <div className="bg-white shadow-md rounded-lg border border-gray-100 p-6">
                  <div className="flex items-center mb-4">
                    <MailCheck className="h-6 w-6 text-blue-600 mr-3" />
                    <h3 className="text-lg font-bold text-gray-800">Your Daily Squire Digest</h3>
                  </div>
                  <p className="text-gray-600 mb-4">Here&apos;s what Squire handled today:</p>
                  <ul className="space-y-2 mb-4">
                    <li className="flex justify-between items-center text-sm">
                      <span className="text-gray-700">Emails Processed:</span>
                      <span className="font-medium text-gray-900">127</span>
                    </li>
                    <li className="flex justify-between items-center text-sm">
                      <span className="text-gray-700">Archived/Filtered:</span>
                      <span className="font-medium text-gray-900">112</span>
                    </li>
                    <li className="flex justify-between items-center text-sm">
                      <span className="text-gray-700">Flagged for Review:</span>
                      <span className="font-medium text-gray-900">15</span>
                    </li>
                  </ul>
                  <button className="w-full bg-blue-600 text-white py-2 rounded-md text-sm">
                    View Details in Dashboard
                  </button>
                </div>
              </motion.div>
            )}

            {activeStep === 4 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-xl"
              >
                <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <LayoutDashboard className="h-5 w-5 text-blue-300 mr-2" />
                      <h3 className="text-lg font-bold text-white">Squire Dashboard</h3>
                    </div>
                    <span className="text-xs bg-blue-900 text-blue-300 px-2 py-1 rounded-full">Admin View</span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="bg-gray-700 p-3 rounded text-center">
                      <p className="text-2xl font-bold text-white">89%</p>
                      <p className="text-xs text-gray-400">Accuracy</p>
                    </div>
                    <div className="bg-gray-700 p-3 rounded text-center">
                      <p className="text-2xl font-bold text-white">5.2h</p>
                      <p className="text-xs text-gray-400">Time Saved (Wk)</p>
                    </div>
                    <div className="bg-gray-700 p-3 rounded text-center">
                      <p className="text-2xl font-bold text-white">12</p>
                      <p className="text-xs text-gray-400">Drafts Pending</p>
                    </div>
                  </div>
                  <div className="h-24 bg-gray-700 rounded flex items-center justify-center">
                    <span className="text-gray-500 text-sm">(Chart / Settings Area)</span>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </Section>
  );
} 