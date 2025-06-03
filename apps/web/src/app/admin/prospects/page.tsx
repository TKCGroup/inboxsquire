"use client";

import React from 'react';
import { Button } from '@/components/ui/button';

export default function ProspectsAdminPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Prospect Management</h1>
          <p className="text-gray-600 mb-8">
            This feature requires the prospect_intake table to be implemented.
          </p>
          <p className="text-sm text-gray-500 mb-8">
            Currently disabled to allow production deployment. 
            Will be re-enabled once the prospect intake database schema is deployed.
          </p>
          <Button 
            onClick={() => window.history.back()}
            variant="outline"
          >
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
} 