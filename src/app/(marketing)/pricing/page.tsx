import { redirect } from "next/navigation";

export function generateMetadata() {
  return {
    title: "Pricing",
  };
}

export default function PricingPage() {
  redirect("/#pricing");
}
