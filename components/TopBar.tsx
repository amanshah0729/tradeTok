export default function TopBar() {
  return (
    <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-4 pt-3 py-3 z-20">
      {/* Filter icon */}
      <button className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 active:bg-white/20 transition-colors">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="4" y1="6" x2="20" y2="6" />
          <line x1="8" y1="12" x2="16" y2="12" />
          <line x1="11" y1="18" x2="13" y2="18" />
        </svg>
      </button>

      {/* Swipe Up hint */}
      <div className="flex flex-col items-center gap-0.5">
        <span className="text-xs text-white/50 font-medium tracking-wide uppercase">Swipe Up</span>
        <svg width="12" height="8" viewBox="0 0 12 8" fill="none" className="text-white/30">
          <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      {/* Bell icon */}
      <button className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 active:bg-white/20 transition-colors relative">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
        {/* Notification dot */}
        <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500 border border-black" />
      </button>
    </div>
  );
}
