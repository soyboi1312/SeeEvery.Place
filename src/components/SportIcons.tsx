// Sport-specific icons for stadiums and marathons

interface IconProps {
  className?: string;
}

// Football (Soccer)
export function SoccerIcon({ className = "w-6 h-6" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7L9.5 10L10.5 14H13.5L14.5 10L12 7Z" />
      <path d="M12 7V3" />
      <path d="M14.5 10L18 8" />
      <path d="M13.5 14L16 17.5" />
      <path d="M10.5 14L8 17.5" />
      <path d="M9.5 10L6 8" />
    </svg>
  );
}

// American Football
export function AmericanFootballIcon({ className = "w-6 h-6" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className={className}>
      <ellipse cx="12" cy="12" rx="9" ry="5" transform="rotate(-45 12 12)" />
      <path d="M12 7v10" />
      <path d="M9 10h6" />
      <path d="M9 14h6" />
      <path d="M9 12h6" />
    </svg>
  );
}

// Baseball
export function BaseballIcon({ className = "w-6 h-6" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="M6.5 5.5C8 9 8 15 6.5 18.5" />
      <path d="M17.5 5.5C16 9 16 15 17.5 18.5" />
      <path d="M7 8l-1.5 1" />
      <path d="M7 16l-1.5-1" />
      <path d="M17 8l1.5 1" />
      <path d="M17 16l1.5-1" />
    </svg>
  );
}

// Basketball
export function BasketballIcon({ className = "w-6 h-6" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3.2 13.5C6 12 9 12 12 12s6 0 8.8 1.5" />
      <path d="M12 3v18" />
      <path d="M17.5 18.5c-2-3-2-6 0-9" />
      <path d="M6.5 18.5c2-3 2-6 0-9" />
    </svg>
  );
}

// Cricket
export function CricketIcon({ className = "w-6 h-6" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className={className}>
      <circle cx="12" cy="12" r="9" />
      {/* Seam of the ball */}
      <path d="M12 3c3 3 3 15 0 18" strokeDasharray="2 2" />
      <path d="M12 3c-3 3-3 15 0 18" strokeDasharray="2 2" />
    </svg>
  );
}

// Rugby
export function RugbyIcon({ className = "w-6 h-6" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className={className}>
      <ellipse cx="12" cy="12" rx="10" ry="7" transform="rotate(-45 12 12)" />
      <path d="M9 15L7 17" />
      <path d="M17 7l-2 2" />
      <path d="M8 8l8 8" />
    </svg>
  );
}

// Tennis
export function TennisIcon({ className = "w-6 h-6" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12c0 5 4 9 9 9" />
      <path d="M21 12c0-5-4-9-9-9" />
    </svg>
  );
}

// Motorsport (Chequered Flag)
export function MotorsportIcon({ className = "w-6 h-6" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
      <line x1="4" y1="22" x2="4" y2="15" />
      <path d="M4 9h16" />
      <path d="M8 4v10" />
      <path d="M12 5v10" />
      <path d="M16 4v10" />
    </svg>
  );
}

// Improved Sneaker Icon (based on the running shoe reference)
export function SneakerIcon({ className = "w-6 h-6" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* Sole - Rocker shape */}
      <path d="M2 17c0 1.7 1.3 3 3 3h13c2.8 0 5-2.2 4-5l-1-2h-17l-2 4Z" />

      {/* Upper Body - Ankle cut and tongue */}
      <path d="M4 13l1.5-5 4.5-3 5 1 3.5 4" />

      {/* Three Stripes / Speed lines */}
      <path d="M9.5 17l3-5" />
      <path d="M13 17l3-5" />
      <path d="M16.5 17l3-5" />
    </svg>
  );
}

// Generic Stadium Icon (fallback)
export function StadiumIcon({ className = "w-6 h-6" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className={className}>
      <ellipse cx="12" cy="12" rx="10" ry="6" />
      <path d="M2 12v4c0 3.3 4.5 6 10 6s10-2.7 10-6v-4" />
      <path d="M2 12c0-3.3 4.5-6 10-6s10 2.7 10 6" />
    </svg>
  );
}

// Helper to get sport icon by sport name
export function getSportIcon(sport: string, className?: string) {
  const iconClass = className || "w-6 h-6";

  switch (sport) {
    case "Football":
      return <SoccerIcon className={iconClass} />;
    case "American Football":
      return <AmericanFootballIcon className={iconClass} />;
    case "Baseball":
      return <BaseballIcon className={iconClass} />;
    case "Basketball":
      return <BasketballIcon className={iconClass} />;
    case "Cricket":
      return <CricketIcon className={iconClass} />;
    case "Rugby":
      return <RugbyIcon className={iconClass} />;
    case "Tennis":
      return <TennisIcon className={iconClass} />;
    case "Motorsport":
      return <MotorsportIcon className={iconClass} />;
    default:
      return <StadiumIcon className={iconClass} />;
  }
}
