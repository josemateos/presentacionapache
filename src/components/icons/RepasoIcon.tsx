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
    {/* Circle */}
    <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="5" />
    {/* Diagonal line / handle */}
    <line x1="30" y1="75" x2="65" y2="25" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
    {/* Axe blade */}
    <path d="M58 22 C58 22 75 18 78 30 C80 38 72 42 65 38 L58 22Z" fill="currentColor" />
    {/* Leaf 1 */}
    <path d="M38 58 C32 48 22 50 20 42 C28 42 36 46 40 54Z" fill="currentColor" />
    {/* Leaf 2 */}
    <path d="M42 62 C38 54 28 52 24 44 C34 46 42 52 44 60Z" fill="currentColor" opacity="0.7" />
    {/* Small leaf detail */}
    <path d="M35 65 C30 58 22 58 20 52 C28 54 34 58 36 64Z" fill="currentColor" opacity="0.5" />
  </svg>
);

export default RepasoIcon;
