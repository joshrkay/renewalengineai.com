import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import { Toaster } from "sonner";
import { team, personJsonLd, personJsonLdId } from "@/lib/team";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://renewalengineai.com"),
  title: {
    default: "AI Automation for Insurance Agents | RenewalEngineAI",
    template: "%s | RenewalEngineAI",
  },
  description:
    "RenewalEngineAI builds done-for-you AI automation systems for insurance agencies. Automate renewals, lead response, quote follow-ups, and client retention.",
  keywords: [
    "AI automation for insurance agents",
    "insurance renewal automation",
    "AI lead response insurance",
    "insurance agency workflow automation",
    "AI for insurance agencies",
    "independent insurance agency software",
    "AMS automation",
    "Applied Epic AI",
    "HawkSoft AI",
    "EZLynx automation",
  ],
  authors: [{ name: "RenewalEngineAI" }],
  creator: "RenewalEngineAI",
  publisher: "RenewalEngineAI",
  formatDetection: { email: false, address: false, telephone: false },
  openGraph: {
    type: "website",
    locale: "en_US",
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
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
};

const founder = team[0];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://renewalengineai.com#Organization",
      name: "RenewalEngineAI",
      legalName: "RenewalEngineAI",
      url: "https://renewalengineai.com",
      logo: {
        "@type": "ImageObject",
        url: "https://renewalengineai.com/icon.svg",
        width: 64,
        height: 64,
      },
      description:
        "RenewalEngineAI builds and manages done-for-you AI automation systems for independent insurance agencies — renewal campaigns, instant lead response, quote follow-ups, and AMS integration.",
      slogan: "AI automation for independent insurance agencies",
      foundingDate: "2025-12-01",
      founder: founder ? { "@id": personJsonLdId(founder.slug) } : undefined,
      areaServed: { "@type": "Country", name: "United States" },
      knowsAbout: [
        "AI automation for insurance agencies",
        "Insurance renewal retention",
        "Instant lead response",
        "Applied Epic integration",
        "HawkSoft integration",
        "EZLynx integration",
      ],
      sameAs: ["https://www.linkedin.com/company/renewalengineai"],
      contactPoint: [
        {
          "@type": "ContactPoint",
          contactType: "sales",
          email: "hello@renewalengineai.com",
          availableLanguage: "English",
          areaServed: "US",
        },
        {
          "@type": "ContactPoint",
          contactType: "customer support",
          email: "hello@renewalengineai.com",
          availableLanguage: "English",
          areaServed: "US",
        },
      ],
    },
    ...(founder ? [personJsonLd(founder)] : []),
    {
      "@type": "WebSite",
      "@id": "https://renewalengineai.com#WebSite",
      name: "RenewalEngineAI",
      url: "https://renewalengineai.com",
      publisher: { "@id": "https://renewalengineai.com#Organization" },
      inLanguage: "en-US",
    },
    {
      "@type": "Service",
      "@id": "https://renewalengineai.com#AuditService",
      name: "RenewalEngineAI Operations Audit",
      serviceType: "AI automation audit for insurance agencies",
      provider: { "@id": "https://renewalengineai.com#Organization" },
      areaServed: { "@type": "Country", name: "United States" },
      audience: {
        "@type": "BusinessAudience",
        audienceType: "Independent insurance agencies",
      },
      description:
        "Five-day workflow assessment for independent insurance agencies, including renewal pipeline analysis, lead-response audit, AMS data integrity review, and a custom automation roadmap with ROI projections.",
      offers: {
        "@type": "Offer",
        price: "1500.00",
        priceCurrency: "USD",
        availability: "https://schema.org/InStock",
        url: "https://renewalengineai.com/#pricing",
      },
    },
    {
      "@type": "Service",
      "@id": "https://renewalengineai.com#BuildLaunchService",
      name: "RenewalEngineAI Build & Launch",
      serviceType: "AI automation implementation for insurance agencies",
      provider: { "@id": "https://renewalengineai.com#Organization" },
      areaServed: { "@type": "Country", name: "United States" },
      audience: {
        "@type": "BusinessAudience",
        audienceType: "Independent insurance agencies",
      },
      description:
        "Two-to-three-week implementation of AI renewal campaigns, instant lead response, quote follow-up sequences, and operations dashboard — integrated with the agency's AMS (Applied Epic, HawkSoft, or EZLynx).",
      offers: {
        "@type": "Offer",
        price: "6000.00",
        priceCurrency: "USD",
        availability: "https://schema.org/InStock",
        url: "https://renewalengineai.com/#pricing",
      },
    },
    {
      "@type": "Service",
      "@id": "https://renewalengineai.com#ManagedOpsService",
      name: "RenewalEngineAI Managed Operations",
      serviceType: "Managed AI operations for insurance agencies",
      provider: { "@id": "https://renewalengineai.com#Organization" },
      areaServed: { "@type": "Country", name: "United States" },
      audience: {
        "@type": "BusinessAudience",
        audienceType: "Independent insurance agencies",
      },
      description:
        "Ongoing monitoring, classifier tuning, prompt optimization, and monthly strategy reviews for agencies running AI automation in production. Month-to-month, cancel with 30 days' notice.",
      offers: {
        "@type": "Offer",
        price: "2500.00",
        priceCurrency: "USD",
        availability: "https://schema.org/InStock",
        url: "https://renewalengineai.com/#pricing",
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: "2500.00",
          priceCurrency: "USD",
          unitCode: "MON",
          billingDuration: "P1M",
        },
      },
    },
  ],
};

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

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
        <Analytics />
        {GA_MEASUREMENT_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                window.gtag = gtag;
                gtag('js', new Date());
                gtag('config', '${GA_MEASUREMENT_ID}', { send_page_view: true });
              `}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
