"use client";
import { useBooking } from "@/components/marketing/BookingContext";

export function BookAuditButton({
  label,
  className,
}: {
  label: string;
  className?: string;
}) {
  const { openBooking } = useBooking();
  return (
    <button type="button" onClick={openBooking} className={className}>
      {label}
    </button>
  );
}
