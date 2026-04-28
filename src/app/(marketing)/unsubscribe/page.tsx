import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/marketing/Header";
import { Footer } from "@/components/marketing/Footer";

export const metadata: Metadata = {
  title: "Unsubscribed",
  robots: { index: false },
};

export default async function UnsubscribePage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; error?: string }>;
}) {
  const { success, error } = await searchParams;

  const isSuccess = success === "1";
  const isInvalid = error === "invalid" || error === "notfound";

  return (
    <div className="min-h-screen bg-black">
      <Header />
      <main className="min-h-screen pt-32 pb-24 flex items-start justify-center">
        <div className="max-w-lg mx-auto px-6 text-center">
          {isSuccess ? (
            <>
              <p className="text-4xl mb-6">✓</p>
              <h1 className="text-4xl font-black text-white mb-4">
                You&rsquo;re unsubscribed.
              </h1>
              <p className="text-neutral-400 text-lg leading-relaxed mb-8">
                You won&rsquo;t receive any more emails from RenewalEngineAI.
                If you change your mind, you can re-subscribe at any time.
              </p>
            </>
          ) : isInvalid ? (
            <>
              <p className="text-4xl mb-6">⚠</p>
              <h1 className="text-4xl font-black text-white mb-4">
                Link not found.
              </h1>
              <p className="text-neutral-400 text-lg leading-relaxed mb-8">
                This unsubscribe link may have expired or already been used.
                Email{" "}
                <a
                  href="mailto:hello@renewalengineai.com"
                  className="text-blue-500 hover:text-blue-400"
                >
                  hello@renewalengineai.com
                </a>{" "}
                and we&rsquo;ll remove you manually.
              </p>
            </>
          ) : (
            <>
              <p className="text-4xl mb-6">✕</p>
              <h1 className="text-4xl font-black text-white mb-4">
                Something went wrong.
              </h1>
              <p className="text-neutral-400 text-lg leading-relaxed mb-8">
                We couldn&rsquo;t process your unsubscribe request. Email{" "}
                <a
                  href="mailto:hello@renewalengineai.com"
                  className="text-blue-500 hover:text-blue-400"
                >
                  hello@renewalengineai.com
                </a>{" "}
                and we&rsquo;ll handle it directly.
              </p>
            </>
          )}
          <Link
            href="/"
            className="inline-block text-blue-500 hover:text-blue-400 font-semibold"
          >
            ← Back to renewalengineai.com
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
