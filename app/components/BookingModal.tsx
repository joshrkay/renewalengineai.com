import { useEffect } from "react";
import { X } from "lucide-react";

// PLACEHOLDER: Replace this URL with your actual Calendly or Cal.com link
const CALENDLY_URL = "https://calendly.com/renewalengineai/renewal-audit";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BookingModal({ isOpen, onClose }: BookingModalProps) {
  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (isOpen) {
      window.addEventListener("keydown", handleEsc);
      return () => window.removeEventListener("keydown", handleEsc);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl mx-4 bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-100">
          <div>
            <h3 className="text-2xl font-black text-black">
              Book Your Free Renewal Audit
            </h3>
            <p className="text-neutral-500 mt-1">
              30-minute call to identify where your agency is leaking revenue
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-neutral-100 transition-colors"
          >
            <X className="h-6 w-6 text-neutral-500" />
          </button>
        </div>

        {/* Calendly Embed */}
        <div className="h-[600px]">
          <iframe
            src={CALENDLY_URL}
            width="100%"
            height="100%"
            frameBorder="0"
            title="Schedule a Renewal Audit"
          />
        </div>
      </div>
    </div>
  );
}
