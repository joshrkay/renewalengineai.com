"use client";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { useBooking } from "@/components/marketing/BookingContext";

export function CTA() {
  const { openBooking } = useBooking();

  return (
    <section className="relative py-32 px-6 lg:px-8 bg-gradient-to-br from-black via-neutral-900 to-black overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-blue-600 rounded-full blur-[150px] opacity-30 animate-pulse"></div>
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-purple-600 rounded-full blur-[150px] opacity-30 animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative max-w-5xl mx-auto text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-full mb-8">
          <Sparkles className="h-5 w-5" />
          <span className="font-black">Free Renewal Audit</span>
        </div>

        {/* Headline */}
        <h2 className="text-6xl lg:text-7xl font-black text-white mb-8 leading-tight">
          How Much Revenue Is<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
            Your Agency Leaving on the Table?
          </span>
        </h2>

        {/* Subheadline */}
        <p className="text-2xl lg:text-3xl text-neutral-300 mb-12 max-w-3xl mx-auto font-medium">
          Book a free Renewal Leak Audit. We'll show you exactly where AI automation can recover lost revenue, speed up lead response, and retain more clients.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Button
            size="lg"
            onClick={openBooking}
            className="bg-gradient-to-r from-blue-600 to-purple-600 !text-white text-xl px-12 py-8 rounded-full shadow-2xl shadow-blue-600/50 hover:scale-105 transition-all font-black"
          >
            Book Free Renewal Audit
            <ArrowRight className="ml-3 h-6 w-6" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-2 border-white !text-white hover:bg-white hover:!text-black text-xl px-12 py-8 rounded-full transition-all font-black"
            onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
          >
            See Pricing Plans
          </Button>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto pt-12 border-t border-neutral-700">
          <div>
            <div className="text-5xl font-black bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
              8X ROI
            </div>
            <div className="text-lg text-neutral-400 font-bold">Average First Year</div>
          </div>
          <div>
            <div className="text-5xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
              3 Days
            </div>
            <div className="text-lg text-neutral-400 font-bold">To Get Your Audit Results</div>
          </div>
        </div>
      </div>
    </section>
  );
}
