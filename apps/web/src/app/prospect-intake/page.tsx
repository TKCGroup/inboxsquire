import ProspectIntakeForm from "@/components/landing/sections/ProspectIntakeForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tell Us About Your Email Management Needs | Squire",
  description: "Skip the discovery call. Fill out our comprehensive intake form and we'll provide personalized recommendations for how Squire can transform your inbox management.",
  openGraph: {
    title: "Tell Us About Your Email Management Needs | Squire",
    description: "Skip the discovery call. Fill out our comprehensive intake form and we'll provide personalized recommendations for how Squire can transform your inbox management.",
    type: "website",
  },
};

export default function ProspectIntakePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <ProspectIntakeForm />
    </div>
  );
} 