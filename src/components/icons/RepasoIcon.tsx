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
    {/* Handle - diagonal bar */}
    <rect x="10" y="42" width="65" height="10" rx="3" transform="rotate(-50 42 47)" />
    {/* Handle base cap */}
    <rect x="4" y="78" width="12" height="7" rx="2" transform="rotate(-50 10 82)" />
    {/* Axe head top piece */}
    <rect x="54" y="12" width="12" height="5" rx="1.5" transform="rotate(-50 60 14)" />
    {/* Axe blade - large curved blade */}
    <path d="M52 30 L68 16 Q78 10 86 18 L92 34 Q96 50 86 58 L68 52 Z" />
  </svg>
);

export default RepasoIcon;
