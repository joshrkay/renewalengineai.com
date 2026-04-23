"use client";
import { useBooking } from "@/components/marketing/BookingContext";

export function BookAuditButton({
  label,
  className,
  ctaLocation = "book_audit_button",
}: {
  label: string;
  className?: string;
  ctaLocation?: string;
}) {
  const { openBooking } = useBooking();
  return (
    <button
      type="button"
      onClick={() => openBooking(ctaLocation)}
      className={className}
    >
      {label}
    </button>
  );
}
