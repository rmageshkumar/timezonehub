export function ClockHiveLogo({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Hexagon background */}
      <path
        d="M24 4L44 15.5V38.5L24 50L4 38.5V15.5L24 4Z"
        fill="url(#logoGradient)"
        stroke="white"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* Clock face circle */}
      <circle cx="24" cy="24" r="12" fill="white" fillOpacity="0.15" stroke="white" strokeWidth="1.2" />
      {/* Clock hands */}
      <line x1="24" y1="24" x2="24" y2="14" stroke="white" strokeWidth="2" strokeLinecap="round" />
      <line x1="24" y1="24" x2="30" y2="24" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
      {/* Center dot */}
      <circle cx="24" cy="24" r="1.5" fill="white" />
      {/* Gradient definition */}
      <defs>
        <linearGradient id="logoGradient" x1="4" y1="4" x2="44" y2="50" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6366f1" />
          <stop offset="1" stopColor="#a855f7" />
        </linearGradient>
      </defs>
    </svg>
  );
}
