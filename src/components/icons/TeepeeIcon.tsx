const TeepeeIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
    {/* Main triangle */}
    <path d="M12 2L3 20h18L12 2z" />
    {/* Top feathers */}
    <line x1="10" y1="1" x2="11" y2="4" />
    <line x1="14" y1="1" x2="13" y2="4" />
    {/* Horizontal band */}
    <line x1="8" y1="9" x2="16" y2="9" />
    {/* Door */}
    <path d="M10 20v-6l2-2 2 2v6" />
    {/* Dots */}
    <circle cx="9" cy="13" r="0.7" fill="currentColor" stroke="none" />
    <circle cx="15" cy="13" r="0.7" fill="currentColor" stroke="none" />
  </svg>
);

export default TeepeeIcon;
