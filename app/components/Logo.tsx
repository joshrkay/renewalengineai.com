export function Logo({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Circular refresh/renewal arrows */}
      <path
        d="M20 4C28.8366 4 36 11.1634 36 20C36 28.8366 28.8366 36 20 36C11.1634 36 4 28.8366 4 20C4 15.7565 5.68571 11.9021 8.46154 9.12308"
        stroke="url(#gradient1)"
        strokeWidth="3"
        strokeLinecap="round"
      />
      
      {/* Arrow head */}
      <path
        d="M8.5 13L8.5 8L13.5 8"
        stroke="url(#gradient1)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* AI brain/circuit element in center */}
      <circle cx="20" cy="20" r="6" fill="#1e3a8a" />
      <circle cx="17" cy="18" r="1.5" fill="white" />
      <circle cx="23" cy="18" r="1.5" fill="white" />
      <path
        d="M17 23C17 23 18.5 24.5 20 24.5C21.5 24.5 23 23 23 23"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      
      {/* Gradient definitions */}
      <defs>
        <linearGradient id="gradient1" x1="4" y1="4" x2="36" y2="36" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#1e40af" />
          <stop offset="100%" stopColor="#1e3a8a" />
        </linearGradient>
      </defs>
    </svg>
  );
}