import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { BookingModal } from "./BookingModal";

interface BookingContextType {
  openBooking: () => void;
}

const BookingContext = createContext<BookingContextType>({ openBooking: () => {} });

export function useBooking() {
  return useContext(BookingContext);
}

export function BookingProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const openBooking = useCallback(() => setIsOpen(true), []);
  const closeBooking = useCallback(() => setIsOpen(false), []);

  return (
    <BookingContext.Provider value={{ openBooking }}>
      {children}
      <BookingModal isOpen={isOpen} onClose={closeBooking} />
    </BookingContext.Provider>
  );
}
