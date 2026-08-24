import type { Metadata } from "next";

// See src/app/login/layout.tsx — same inherited-canonical problem.
export const metadata: Metadata = {
  title: "Set your password",
  description: "Set the password for your RenewalEngineAI account.",
  alternates: { canonical: "https://renewalengineai.com/set-password" },
  robots: { index: false, follow: false },
};

export default function SetPasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
