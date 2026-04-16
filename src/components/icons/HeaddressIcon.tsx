import { cn } from "@/lib/utils";

interface HeaddressIconProps {
  className?: string;
}

const HeaddressIcon = ({ className }: HeaddressIconProps) => (
  <svg
    viewBox="0 0 100 100"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cn("w-5 h-5", className)}
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Headband arc */}
    <path d="M25 70 Q50 55 75 70" fill="none" />
    {/* Center feather (tallest) */}
    <path d="M50 58 L50 18" />
    <path d="M50 18 Q46 30 50 38" />
    <path d="M50 18 Q54 30 50 38" />
    {/* Left feathers */}
    <path d="M42 60 L36 24" />
    <path d="M36 24 Q33 36 36 42" />
    <path d="M36 24 Q39 34 36 42" />
    <path d="M34 63 L24 32" />
    <path d="M24 32 Q21 42 24 48" />
    <path d="M24 32 Q27 40 24 48" />
    {/* Right feathers */}
    <path d="M58 60 L64 24" />
    <path d="M64 24 Q61 36 64 42" />
    <path d="M64 24 Q67 34 64 42" />
    <path d="M66 63 L76 32" />
    <path d="M76 32 Q73 42 76 48" />
    <path d="M76 32 Q79 40 76 48" />
    {/* Small decorative dots on headband */}
    <circle cx="38" cy="65" r="2" fill="currentColor" stroke="none" />
    <circle cx="50" cy="62" r="2" fill="currentColor" stroke="none" />
    <circle cx="62" cy="65" r="2" fill="currentColor" stroke="none" />
  </svg>
);

export default HeaddressIcon;
