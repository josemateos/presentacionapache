import { cn } from "@/lib/utils";

interface RepasoIconProps {
  className?: string;
}

const RepasoIcon = ({ className }: RepasoIconProps) => (
  <svg
    viewBox="0 0 100 100"
    fill="currentColor"
    className={cn("w-5 h-5", className)}
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Handle */}
    <rect x="18" y="38" width="58" height="10" rx="3" transform="rotate(-55 47 43)" />
    {/* Handle base */}
    <rect x="8" y="72" width="14" height="6" rx="2" transform="rotate(-55 15 75)" />
    {/* Axe head connector */}
    <rect x="52" y="18" width="8" height="5" rx="1" transform="rotate(-55 56 20)" />
    {/* Axe blade */}
    <path d="M55 28 L72 18 Q82 14 86 24 L90 40 Q92 52 82 56 L62 48 Z" />
  </svg>
);

export default RepasoIcon;
