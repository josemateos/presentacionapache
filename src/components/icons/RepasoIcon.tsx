import { cn } from "@/lib/utils";

interface RepasoIconProps {
  className?: string;
}

const RepasoIcon = ({ className }: RepasoIconProps) => (
  <svg
    viewBox="10 15 80 75"
    fill="currentColor"
    className={cn("w-5 h-5", className)}
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Handle */}
    <line x1="30" y1="80" x2="65" y2="25" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
    {/* Axe blade */}
    <path d="M58 22 C58 22 78 16 82 30 C84 40 74 44 65 38 L58 22Z" fill="currentColor" />
    {/* Leaf 1 */}
    <path d="M38 58 C32 48 22 50 18 42 C28 42 36 46 40 54Z" fill="currentColor" />
    {/* Leaf 2 */}
    <path d="M42 62 C38 54 28 52 22 44 C32 46 42 52 44 60Z" fill="currentColor" opacity="0.7" />
    {/* Leaf 3 */}
    <path d="M34 68 C28 60 20 60 16 52 C26 54 34 58 36 66Z" fill="currentColor" opacity="0.5" />
  </svg>
);

export default RepasoIcon;
