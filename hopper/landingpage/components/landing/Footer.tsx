import React from "react";
import { ShieldCheck } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-900 text-gray-400 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Logo and company info */}
          <div className="md:col-span-1">
            <div className="flex items-center mb-4">
              <ShieldCheck className="h-6 w-6 text-blue-500 mr-2" />
              <span className="text-white font-bold text-lg">Squire</span>
            </div>
            <p className="text-sm mb-4">
              Your inbox's intelligent gatekeeper. Reclaim your focus and master your inbox.
            </p>
            <div className="flex space-x-4">
              {/* Social icons would go here */}
              {['twitter', 'linkedin', 'facebook'].map((platform) => (
                <div key={platform} className="h-8 w-8 rounded-full bg-gray-800 flex items-center justify-center">
                  <span className="text-blue-500 text-xs">{platform[0].toUpperCase()}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Product */}
          <div>
            <h3 className="text-white font-semibold mb-4">Product</h3>
            <ul className="space-y-2">
              {['Features', 'Pricing', 'Testimonials', 'FAQs', 'Altbot Integration'].map((item) => (
                <li key={item}>
                  <a href="#" className="hover:text-white transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Company */}
          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              {['About Us', 'Blog', 'Careers', 'Press', 'Contact'].map((item) => (
                <li key={item}>
                  <a href="#" className="hover:text-white transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Legal */}
          <div>
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              {['Terms of Service', 'Privacy Policy', 'Cookie Policy', 'GDPR Compliance', 'Security'].map((item) => (
                <li key={item}>
                  <a href="#" className="hover:text-white transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm">© {currentYear} Squire Technologies, Inc. All rights reserved.</p>
          <div className="mt-4 md:mt-0">
            <p className="text-sm">Made with ♥ for busy executives</p>
          </div>
        </div>
      </div>
    </footer>
  );
}