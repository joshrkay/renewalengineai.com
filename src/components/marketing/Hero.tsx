"use client";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useBooking } from "@/components/marketing/BookingContext";

export function Hero() {
  const { openBooking } = useBooking();

  return (
    <section id="hero" className="relative min-h-[90vh] flex items-center bg-gradient-to-br from-black via-neutral-900 to-black overflow-hidden">
      {/* Animated Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/15 via-transparent to-blue-600/15 animate-pulse"></div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-20">
        <div className="max-w-5xl">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 sm:gap-3 bg-blue-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full mb-6 sm:mb-8 max-w-full">
            <div className="w-2 h-2 shrink-0 bg-white rounded-full animate-pulse"></div>
            <span className="font-bold text-sm sm:text-base">Built for Applied Epic, HawkSoft &amp; EZLynx agencies</span>
          </div>

          {/* Main Headline — base size is mobile-first; text-6xl alone rendered
              60px on a 375px viewport and pushed the headline off-screen. */}
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-white mb-6 sm:mb-8 leading-[1.05] sm:leading-[0.98] tracking-tight">
            AI Automation for Insurance Agents:
            <br />
            Keep 15% More of Your Book.
            <br />
            Respond to Every Lead in{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-500">
              60 Seconds.
            </span>
          </h1>

          {/* Subheadline - ICP-first, GEO-optimized direct answer */}
          <p className="text-lg sm:text-2xl lg:text-3xl text-neutral-300 mb-8 sm:mb-12 max-w-3xl font-medium leading-relaxed">
            For independent P&amp;C agencies on Applied Epic, HawkSoft, or EZLynx. We build and run the AI so your team doesn&rsquo;t touch it. Built to lift renewal retention 15-20% and sub-60-second lead response, live inside 3 weeks.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-16">
            <Button
              size="lg"
              onClick={() => openBooking("hero")}
              className="bg-emerald-500 hover:bg-emerald-600 !text-white text-base sm:text-xl px-8 sm:px-12 py-6 sm:py-8 rounded-full shadow-2xl shadow-emerald-500/50 transition-all hover:scale-105 font-bold"
            >
              Book My Free Strategy Call
              <ArrowRight className="ml-3 h-6 w-6" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-white bg-white/10 backdrop-blur-sm !text-white hover:bg-white hover:!text-black text-base sm:text-xl px-8 sm:px-12 py-6 sm:py-8 rounded-full transition-all font-bold"
              onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
            >
              See Pricing Plans
            </Button>
          </div>

          {/* Social Proof Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 max-w-2xl">
            <div className="border-l-4 border-emerald-500 pl-4 sm:pl-6">
              <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-1">391%</div>
              <div className="text-neutral-400 font-medium text-sm">
                Conversion lift, &lt;1-min response
                <span className="block text-neutral-600 text-xs mt-1">Velocify research</span>
              </div>
            </div>
            <div className="border-l-4 border-emerald-500 pl-4 sm:pl-6">
              <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-1">15-20%</div>
              <div className="text-neutral-400 font-medium text-sm">
                Retention lift target
                <span className="block text-neutral-600 text-xs mt-1">Four-touch renewal outreach</span>
              </div>
            </div>
            <div className="border-l-4 border-emerald-500 pl-4 sm:pl-6">
              <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-1">&lt;60s</div>
              <div className="text-neutral-400 font-medium text-sm">
                Lead response time
                <span className="block text-neutral-600 text-xs mt-1">Every inbound channel</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 right-20 w-72 h-72 bg-emerald-500 rounded-full blur-[120px] opacity-15"></div>
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-blue-400 rounded-full blur-[150px] opacity-10"></div>
    </section>
  );
}
