"use client";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useBooking } from "@/components/marketing/BookingContext";

export function Hero() {
  const { openBooking } = useBooking();

  return (
    <section id="hero" className="relative min-h-[90vh] flex items-center bg-gradient-to-br from-black via-neutral-900 to-black overflow-hidden">
      {/* Animated Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-transparent to-blue-600/20 animate-pulse"></div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-20">
        <div className="max-w-5xl">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-3 bg-blue-600 text-white px-6 py-3 rounded-full mb-8">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            <span className="font-bold">AI Automation Built for Independent Insurance Agencies</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-7xl lg:text-8xl font-black text-white mb-8 leading-[0.95] tracking-tight">
            AI That Runs Your
            <br />
            Renewals, Leads
            <br />
            & Follow-Ups{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">
              24/7
            </span>
          </h1>

          {/* Subheadline - GEO optimized direct answer */}
          <p className="text-2xl lg:text-3xl text-neutral-300 mb-12 max-w-3xl font-medium leading-relaxed">
            RenewalEngineAI builds done-for-you AI automation systems that handle renewal campaigns, instant lead response, and quote follow-ups for independent insurance agencies. Agencies using AI automation respond to leads in under 60 seconds and see 15–20% higher retention rates.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-16">
            <Button
              size="lg"
              onClick={openBooking}
              className="bg-blue-600 hover:bg-blue-700 !text-white text-xl px-12 py-8 rounded-full shadow-2xl shadow-blue-600/50 transition-all hover:scale-105 font-bold"
            >
              Book Your Free Renewal Audit
              <ArrowRight className="ml-3 h-6 w-6" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-white bg-white/10 backdrop-blur-sm !text-white hover:bg-white hover:!text-black text-xl px-12 py-8 rounded-full transition-all font-bold"
              onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
            >
              See Pricing Plans
            </Button>
          </div>

          {/* Social Proof Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-2xl">
            <div className="border-l-4 border-blue-600 pl-6">
              <div className="text-5xl font-black text-white mb-2">391%</div>
              <div className="text-neutral-400 font-medium">More Conversions</div>
            </div>
            <div className="border-l-4 border-blue-600 pl-6">
              <div className="text-5xl font-black text-white mb-2">15-20%</div>
              <div className="text-neutral-400 font-medium">Higher Retention</div>
            </div>
            <div className="border-l-4 border-blue-600 pl-6">
              <div className="text-5xl font-black text-white mb-2">75%</div>
              <div className="text-neutral-400 font-medium">Lower Costs</div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 right-20 w-72 h-72 bg-blue-600 rounded-full blur-[120px] opacity-20"></div>
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-blue-400 rounded-full blur-[150px] opacity-10"></div>
    </section>
  );
}
