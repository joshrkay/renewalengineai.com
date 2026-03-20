import { useEffect, useState } from "react";
import { CheckCircle, XCircle, X } from "lucide-react";

export function CheckoutStatus() {
  const [status, setStatus] = useState<"success" | "cancel" | null>(null);
  const [plan, setPlan] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const checkoutStatus = params.get("checkout");
    const checkoutPlan = params.get("plan");

    if (checkoutStatus === "success") {
      setStatus("success");
      setPlan(checkoutPlan);
      // Clean URL without reload
      window.history.replaceState({}, "", window.location.pathname);
    } else if (checkoutStatus === "cancel") {
      setStatus("cancel");
      setPlan(checkoutPlan);
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, []);

  if (!status) return null;

  const planNames: Record<string, string> = {
    audit: "AI-Powered Renewal Audit",
    sprint: "Build & Launch",
    managed: "Managed AI Operations",
  };

  return (
    <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[90] w-full max-w-lg mx-4 animate-in fade-in slide-in-from-top-4">
      <div
        className={`rounded-2xl shadow-2xl border-2 p-6 ${
          status === "success"
            ? "bg-green-50 border-green-200"
            : "bg-amber-50 border-amber-200"
        }`}
      >
        <div className="flex items-start gap-4">
          {status === "success" ? (
            <CheckCircle className="h-8 w-8 text-green-600 flex-shrink-0 mt-0.5" />
          ) : (
            <XCircle className="h-8 w-8 text-amber-600 flex-shrink-0 mt-0.5" />
          )}

          <div className="flex-1">
            {status === "success" ? (
              <>
                <h3 className="text-xl font-black text-green-900 mb-1">
                  Payment Successful!
                </h3>
                <p className="text-green-700">
                  Thank you for purchasing{" "}
                  <strong>{planNames[plan || ""] || "your plan"}</strong>. We'll
                  reach out within 24 hours to schedule your kickoff.
                </p>
              </>
            ) : (
              <>
                <h3 className="text-xl font-black text-amber-900 mb-1">
                  Checkout Cancelled
                </h3>
                <p className="text-amber-700">
                  No worries — no charge was made. If you have questions about{" "}
                  <strong>{planNames[plan || ""] || "our plans"}</strong>, we're
                  happy to help. Scroll down to schedule a free consultation.
                </p>
              </>
            )}
          </div>

          <button
            onClick={() => setStatus(null)}
            className="p-1 rounded-full hover:bg-black/10 transition-colors flex-shrink-0"
          >
            <X className="h-5 w-5 text-neutral-500" />
          </button>
        </div>
      </div>
    </div>
  );
}
