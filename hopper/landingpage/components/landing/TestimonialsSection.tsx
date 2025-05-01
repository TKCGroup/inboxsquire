"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { Section } from "@/components/ui/section";

export default function TestimonialsSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [autoplay, setAutoplay] = useState(true);

  const testimonials = [
    {
      quote: "Squire gave me back 5 hours a week. I can focus on strategic initiatives instead of sorting through endless vendor pitches.",
      author: "Sarah Chen",
      role: "CEO at TechVenture",
      rating: 5
    },
    {
      quote: "The AI classification is incredibly accurate. It identified high-value partnership opportunities I would have missed in my cluttered inbox.",
      author: "Michael Roberts",
      role: "CTO at DataFlow",
      rating: 5
    },
    {
      quote: "Finally, inbox zero feels possible. The daily digest gives me a perfect overview without the overwhelm.",
      author: "Alex Williams",
      role: "Founder at LaunchPad",
      rating: 4
    },
    {
      quote: "As a startup CEO wearing multiple hats, Squire has been invaluable in helping me prioritize communications that matter.",
      author: "Jessica Torres",
      role: "CEO at InnovateCo",
      rating: 5
    }
  ];

  useEffect(() => {
    if (!autoplay) return;
    
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % testimonials.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [autoplay, testimonials.length]);

  const handleNext = () => {
    setAutoplay(false);
    setActiveIndex((current) => (current + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setAutoplay(false);
    setActiveIndex((current) => (current - 1 + testimonials.length) % testimonials.length);
  };

  const handleDotClick = (index: number) => {
    setAutoplay(false);
    setActiveIndex(index);
  };

  return (
    <Section className="bg-gradient-to-b from-gray-50 to-white py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Trusted by Executives Who Value Their Time
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            See how Squire is transforming the way busy professionals manage their communications.
          </p>
        </motion.div>

        {/* Testimonial Carousel */}
        <div className="relative max-w-4xl mx-auto">
          {/* Company logos - placeholders */}
          <div className="flex flex-wrap justify-center items-center gap-8 mb-12 opacity-70">
            {Array.from({ length: 5 }).map((_, i) => (
              <div 
                key={i} 
                className="h-8 bg-gray-200 rounded-md"
                style={{ width: (i % 2 === 0 ? '120px' : '100px') }}
              ></div>
            ))}
          </div>
          
          {/* Testimonial slider */}
          <div className="relative bg-white rounded-2xl shadow-lg p-6 sm:p-10 overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute top-0 left-0 w-40 h-40 bg-blue-50 rounded-full -translate-x-1/2 -translate-y-1/2 opacity-70"></div>
            <div className="absolute bottom-0 right-0 w-40 h-40 bg-teal-50 rounded-full translate-x-1/2 translate-y-1/2 opacity-70"></div>
            
            <div className="relative z-10">
              {/* Quote icon */}
              <div className="mb-6 text-blue-100">
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M14.4 24H8V32H16V40H24V24C24 15.2 16.8 8 8 8V16C12.4 16 16 19.6 16 24H14.4Z" fill="currentColor"/>
                  <path d="M38.4 24H32V32H40V40H48V24C48 15.2 40.8 8 32 8V16C36.4 16 40 19.6 40 24H38.4Z" fill="currentColor"/>
                </svg>
              </div>
              
              {/* Testimonials */}
              <div className="h-56 sm:h-48 relative">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeIndex}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0"
                  >
                    <p className="text-xl sm:text-2xl text-gray-800 mb-8 italic">
                      "{testimonials[activeIndex].quote}"
                    </p>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                      <div>
                        <p className="font-bold text-gray-900">{testimonials[activeIndex].author}</p>
                        <p className="text-gray-600">{testimonials[activeIndex].role}</p>
                      </div>
                      <div className="flex mt-2 sm:mt-0">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className="h-5 w-5"
                            fill={i < testimonials[activeIndex].rating ? "#FFD700" : "none"}
                            stroke={i < testimonials[activeIndex].rating ? "#FFD700" : "#D1D5DB"}
                          />
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
              
              {/* Navigation */}
              <div className="flex items-center justify-between mt-8">
                <button 
                  onClick={handlePrev}
                  className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                  aria-label="Previous testimonial"
                >
                  <ChevronLeft className="h-5 w-5 text-gray-700" />
                </button>
                
                <div className="flex space-x-2">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => handleDotClick(index)}
                      className={`h-2.5 rounded-full transition-all duration-300 ${
                        index === activeIndex ? "w-8 bg-blue-600" : "w-2.5 bg-gray-300"
                      }`}
                      aria-label={`Go to testimonial ${index + 1}`}
                    />
                  ))}
                </div>
                
                <button 
                  onClick={handleNext}
                  className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                  aria-label="Next testimonial"
                >
                  <ChevronRight className="h-5 w-5 text-gray-700" />
                </button>
              </div>
            </div>
          </div>
          
          {/* Usage statistics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-16">
            <motion.div 
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <p className="text-blue-600 text-3xl font-bold mb-2">1,500+</p>
              <p className="text-gray-600">Active Users</p>
            </motion.div>
            
            <motion.div 
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <p className="text-blue-600 text-3xl font-bold mb-2">87%</p>
              <p className="text-gray-600">Improved Productivity</p>
            </motion.div>
            
            <motion.div 
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <p className="text-blue-600 text-3xl font-bold mb-2">4.9 / 5</p>
              <p className="text-gray-600">User Satisfaction</p>
            </motion.div>
          </div>
        </div>
      </div>
    </Section>
  );
}