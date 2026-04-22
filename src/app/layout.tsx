import type { Metadata } from "next";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Automation for Insurance Agents | RenewalEngineAI",
  description:
    "RenewalEngineAI builds done-for-you AI automation systems for insurance agencies. Automate renewals, lead response, quote follow-ups, and client retention.",
  keywords:
    "AI automation insurance agents, insurance renewal automation, AI lead response insurance, insurance agency workflow automation, AI for insurance agencies, renewal engine AI",
  openGraph: {
    type: "website",
    url: "https://renewalengineai.com/",
    title: "AI Automation for Insurance Agents | RenewalEngineAI",
    description:
      "Done-for-you AI automation that handles renewals, lead response, and quote follow-ups for independent insurance agencies. 391% more lead conversions. 15-20% higher retention.",
    siteName: "RenewalEngineAI",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Automation for Insurance Agents | RenewalEngineAI",
    description:
      "Done-for-you AI automation that handles renewals, lead response, and quote follow-ups for independent insurance agencies.",
  },
  alternates: {
    canonical: "https://renewalengineai.com/",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      name: "RenewalEngineAI",
      url: "https://renewalengineai.com",
      description:
        "RenewalEngineAI builds and manages done-for-you AI automation systems for independent insurance agencies.",
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "sales",
        availableLanguage: "English",
      },
    },
    {
      "@type": "WebSite",
      name: "RenewalEngineAI",
      url: "https://renewalengineai.com",
    },
    {
      "@type": "Product",
      name: "RenewalEngineAI Operations Audit",
      description:
        "AI-powered renewal leak audit for insurance agencies. Includes 5-day workflow assessment, renewal and pipeline analysis, custom automation roadmap, and ROI projections.",
      offers: {
        "@type": "Offer",
        price: "1500.00",
        priceCurrency: "USD",
        availability: "https://schema.org/InStock",
      },
    },
    {
      "@type": "Product",
      name: "RenewalEngineAI Build & Launch",
      description:
        "Complete AI automation setup for insurance agencies. Includes renewal campaign system, lead response automation, quote follow-up sequences, performance dashboard, and team training.",
      offers: {
        "@type": "Offer",
        price: "6000.00",
        priceCurrency: "USD",
        availability: "https://schema.org/InStock",
      },
    },
    {
      "@type": "Product",
      name: "RenewalEngineAI Managed Ops",
      description:
        "Ongoing AI operations management for insurance agencies. Includes weekly performance monitoring, continuous optimization, monthly reviews, and priority support.",
      offers: {
        "@type": "Offer",
        price: "2500.00",
        priceCurrency: "USD",
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          billingDuration: "P1M",
        },
        availability: "https://schema.org/InStock",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {/* Start Humblytics Tracking Code */}
        <script async src="https://app.humblytics.com/hmbl.min.js?id=a6c8b42" />
        {/* End Humblytics Tracking Code */}
      </head>
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
