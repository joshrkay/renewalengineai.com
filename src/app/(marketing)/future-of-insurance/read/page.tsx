import { readFile } from "node:fs/promises";
import path from "node:path";
import type { Metadata } from "next";
import { Header } from "@/components/marketing/Header";
import { Footer } from "@/components/marketing/Footer";
import { BookingProvider } from "@/components/marketing/BookingContext";
import { LessonBody } from "@/components/courses/LessonBody";
import { AuditTripwire } from "@/components/marketing/AuditTripwire";
import { CheckCircle, Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "The Next 30 Years of Insurance — Read Now | RenewalEngineAI",
  description:
    "Your free 20-page field manual on the next 30 years of insurance and what AI changes for independent agents.",
  alternates: {
    canonical: "https://renewalengineai.com/future-of-insurance/read",
  },
  robots: {
    index: false,
    follow: false,
  },
};

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

let cachedEbook: string | null = null;

async function loadEbook(): Promise<string> {
  if (cachedEbook !== null) return cachedEbook;
  const filePath = path.join(
    process.cwd(),
    "content",
    "lead-magnet",
    "future-of-insurance.md"
  );
  try {
    cachedEbook = await readFile(filePath, "utf8");
  } catch {
    cachedEbook =
      "# The Next 30 Years of Insurance\n\nYour field manual is on its way — check your inbox.";
  }
  return cachedEbook;
}

export default async function FutureOfInsuranceReadPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const rawName = typeof params.name === "string" ? params.name : "";
  const firstName = rawName.trim().split(/\s+/)[0]?.slice(0, 40) ?? "";
  const ebook = await loadEbook();

  return (
    <BookingProvider>
      <div className="min-h-screen bg-black text-white">
        <Header />

        <main className="pt-28 pb-24">
          {/* Success banner */}
          <section className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/15 via-black to-black" />
            <div className="absolute top-20 right-20 w-72 h-72 bg-emerald-600 rounded-full blur-[120px] opacity-20" />

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
                    Your field manual is below.
                  </h1>
                </div>
              </div>

              <p className="text-lg lg:text-xl text-neutral-300 mb-4 max-w-2xl">
                Twenty pages, five parts, all 15 lines of business. Read it
                front to back, then come back to your line of business as a
                reference. We also sent a copy to your inbox.
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

          {/* The ebook */}
          <section className="py-16 border-t border-neutral-900">
            <div className="max-w-3xl mx-auto px-6 lg:px-8">
              <p
                className="font-bold uppercase tracking-wider text-sm mb-3"
                style={{ color: "#10b981" }}
              >
                Your field manual · 20 pages · ~30-minute read
              </p>
              <article>
                <LessonBody body={ebook} />
              </article>
            </div>
          </section>

          {/* Bottom tripwire */}
          <section className="py-16 border-t border-neutral-900 bg-gradient-to-b from-black to-neutral-950">
            <div className="max-w-4xl mx-auto px-6 lg:px-8">
              <div className="text-center mb-10 max-w-2xl mx-auto">
                <h2 className="text-3xl lg:text-4xl font-black mb-4">
                  Ready to run the 12-month plan?
                </h2>
                <p className="text-lg text-neutral-400">
                  The field manual shows you what to do. Two ways we can help
                  you actually do it:
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
