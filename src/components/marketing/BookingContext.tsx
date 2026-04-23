"use client";
import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { BookingModal } from "@/components/marketing/BookingModal";
import { trackEvent } from "@/lib/analytics";

interface BookingContextType {
  openBooking: (ctaLocation: string) => void;
}

const BookingContext = createContext<BookingContextType>({
  openBooking: () => {},
});

export function useBooking() {
  return useContext(BookingContext);
}

export function BookingProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const openBooking = useCallback((ctaLocation: string) => {
    trackEvent("book_audit_click", { cta_location: ctaLocation });
    setIsOpen(true);
  }, []);
  const closeBooking = useCallback(() => setIsOpen(false), []);

  return (
    <BookingContext.Provider value={{ openBooking }}>
      {children}
      <BookingModal isOpen={isOpen} onClose={closeBooking} />
    </BookingContext.Provider>
  );
}
