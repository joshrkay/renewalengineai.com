export type FAQ = {
  question: string;
  answer: string;
};

export const homeFaqs: FAQ[] = [
  {
    question: "What is AI automation for insurance agencies?",
    answer:
      "AI automation for insurance agencies uses artificial intelligence to handle repetitive tasks like renewal outreach, lead response, quote follow-ups, and client communication. RenewalEngineAI builds these systems as a done-for-you service, so agencies get the benefits of AI without needing technical expertise. Agencies using AI automation see 15-20% higher retention rates and respond to leads in under 60 seconds.",
  },
  {
    question: "How does AI renewal automation work?",
    answer:
      "AI renewal automation triggers personalized outreach campaigns 60, 30, 14, and 7 days before each policy's expiration date. The system sends emails, texts, and calls customized to each client's policy details and history. Agencies using proactive renewal outreach retain 15-20% more policies than those relying on reactive communication.",
  },
  {
    question: "How fast can AI respond to insurance leads?",
    answer:
      "RenewalEngineAI's instant lead response system contacts new leads in under 60 seconds via text, email, or AI-powered call-back. Research shows that responding to a lead within one minute increases conversion probability by 391%, and 78% of insurance consumers purchase from the first agent to respond.",
  },
  {
    question: "What is the ROI of AI automation for insurance agents?",
    answer:
      "Insurance agencies implementing AI automation typically see 15-20% higher policy retention, 391% more lead conversions from instant response, and up to 75% reduction in follow-up costs. Most agencies see positive ROI within the first 1-3 months of implementation.",
  },
  {
    question: "Do I need technical skills to use RenewalEngineAI?",
    answer:
      "No. RenewalEngineAI is a done-for-you service. Our team builds, launches, and manages your AI automation systems. You don't need to learn new software or hire technical staff. We handle the technology so you can focus on selling and serving clients.",
  },
  {
    question: "How long does it take to set up AI automation for my agency?",
    answer:
      "Most agencies go live within 2-3 weeks. The process starts with a 3-5 day audit of your current workflows, followed by 1-2 weeks of building and testing your custom automation systems, then launch with full monitoring and team training.",
  },
  {
    question: "Does RenewalEngineAI integrate with my AMS?",
    answer:
      "Yes. RenewalEngineAI integrates with popular Agency Management Systems and CRMs used by independent insurance agencies, including Applied Epic, HawkSoft, and EZLynx. We work with your existing tools and data exports to build automation that fits your current workflow.",
  },
  {
    question: "How is RenewalEngineAI different from a CRM like GoHighLevel?",
    answer:
      "CRMs give you the tools but leave you to build and manage everything yourself. RenewalEngineAI is a done-for-you service — we build, configure, launch, and manage your AI automation systems specifically for insurance workflows like renewals, lead response, and quote follow-ups. You get results without the learning curve.",
  },
  {
    question: "Is there a long-term contract?",
    answer:
      "No long-term contracts are required. Our Managed Ops service is month-to-month, and our Audit and Build & Launch packages are one-time investments. We earn your business by delivering results, not locking you into contracts.",
  },
  {
    question: "What types of insurance agencies benefit most from AI automation?",
    answer:
      "Independent P&C agencies with 200+ policies benefit most from AI automation. If you're losing renewals, missing leads after hours, or struggling to follow up on every quote, AI automation can immediately impact your bottom line. Agencies that have hit capacity but aren't ready to hire see the fastest ROI.",
  },
];

export function faqJsonLd(faqs: FAQ[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.answer,
      },
    })),
  };
}
