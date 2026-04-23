import fs from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import { Header } from "@/components/marketing/Header";
import { Footer } from "@/components/marketing/Footer";
import { BookingProvider } from "@/components/marketing/BookingContext";
import { LessonBody } from "@/components/courses/LessonBody";
import { AuditTripwire } from "@/components/marketing/AuditTripwire";
import { CheckCircle, Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "Your Free Guide | RenewalEngineAI",
  description:
    "Your free guide — 5 AI Automations Every Insurance Agent Should Set Up This Week.",
  alternates: { canonical: "https://renewalengineai.com/free-guide/thank-you" },
  robots: {
    index: false,
    follow: false,
  },
};

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

function loadGuide(): string {
  const filePath = path.join(
    process.cwd(),
    "content",
    "lead-magnet",
    "5-ai-automations.md"
  );
  try {
    return fs.readFileSync(filePath, "utf8");
  } catch {
    return "# 5 AI Automations Every Insurance Agent Should Set Up This Week\n\nYour guide is on its way — check your inbox.";
  }
}

export default async function FreeGuideThankYouPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const rawName = typeof params.name === "string" ? params.name : "";
  const firstName = rawName.trim().split(/\s+/)[0]?.slice(0, 40) ?? "";
  const guide = loadGuide();

  return (
    <BookingProvider>
      <div className="min-h-screen bg-black text-white">
        <Header />

        <main className="pt-28 pb-24">
          {/* Success banner */}
          <section className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-green-600/15 via-black to-black" />
            <div className="absolute top-20 right-20 w-72 h-72 bg-green-600 rounded-full blur-[120px] opacity-20" />

            <div className="relative max-w-4xl mx-auto px-6 lg:px-8 py-12 lg:py-16">
              <div className="flex items-start gap-4 mb-6">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: "#10b981" }}
                >
                  <CheckCircle className="h-7 w-7 text-white" />
                </div>
                <div>
                  <p
                    className="font-bold uppercase tracking-wider text-sm"
                    style={{ color: "#10b981" }}
                  >
                    You&apos;re in{firstName ? `, ${firstName}` : ""}
                  </p>
                  <h1 className="text-4xl lg:text-6xl font-black leading-tight mt-2">
                    Your free guide is below.
                  </h1>
                </div>
              </div>

              <p className="text-lg lg:text-xl text-neutral-300 mb-4 max-w-2xl">
                Scroll down to read it now. We also just sent a copy to your
                inbox so you can save it for later.
              </p>
              <p className="text-sm text-neutral-500 flex items-center gap-2">
                <Mail className="h-4 w-4" />
                If you don&apos;t see it in 5 minutes, check your spam folder
                (and whitelist hello@renewalengineai.com).
              </p>
            </div>
          </section>

          {/* Tripwire */}
          <section className="py-12 lg:py-16">
            <div className="max-w-4xl mx-auto px-6 lg:px-8">
              <AuditTripwire />
            </div>
          </section>

          {/* The guide */}
          <section className="py-16 border-t border-neutral-900">
            <div className="max-w-3xl mx-auto px-6 lg:px-8">
              <p
                className="font-bold uppercase tracking-wider text-sm mb-3"
                style={{ color: "#10b981" }}
              >
                Your guide · 12-minute read
              </p>
              <article>
                <LessonBody body={guide} />
              </article>
            </div>
          </section>

          {/* Second tripwire */}
          <section className="py-16 border-t border-neutral-900 bg-gradient-to-b from-black to-neutral-950">
            <div className="max-w-4xl mx-auto px-6 lg:px-8">
              <div className="text-center mb-10 max-w-2xl mx-auto">
                <h2 className="text-3xl lg:text-4xl font-black mb-4">
                  Finished reading? Here&apos;s what to do next.
                </h2>
                <p className="text-lg text-neutral-400">
                  Most agents who read this guide don&apos;t implement it alone.
                  Two ways we can help:
                </p>
              </div>
              <AuditTripwire />
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </BookingProvider>
  );
}
