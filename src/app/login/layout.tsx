import type { Metadata } from "next";

// Auth screens must never compete with marketing pages in the index. Without
// their own metadata these routes inherit the root layout's canonical, which
// points at the homepage — telling Google the sign-in screen is a duplicate of
// "/" and leaving it index:true.
export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to your RenewalEngineAI account.",
  alternates: { canonical: "https://renewalengineai.com/login" },
  robots: { index: false, follow: false },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
