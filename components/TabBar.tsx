import Link from 'next/link';

interface TabBarProps {
  activeTab: 'home' | 'live' | 'post' | 'portfolio' | 'profile';
}

const tabs = [
  {
    id: 'home' as const,
    href: '/',
    label: 'Home',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    id: 'live' as const,
    href: '/live',
    label: 'Live',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="2" />
        <path d="M16.24 7.76a6 6 0 0 1 0 8.49m-8.48-.01a6 6 0 0 1 0-8.49m11.31-2.82a10 10 0 0 1 0 14.14m-14.14 0a10 10 0 0 1 0-14.14" />
      </svg>
    ),
  },
];

export default function TabBar({ activeTab }: TabBarProps) {
  return (
    <nav className="glass border-t border-white/10 flex items-center justify-around px-2 py-2">
      {/* Home */}
      <Link
        href="/"
        className={`flex flex-col items-center gap-1 px-3 py-1 transition-colors ${
          activeTab === 'home' ? 'text-white' : 'text-text-secondary'
        }`}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
        <span className="text-[10px] font-medium">Home</span>
      </Link>

      {/* Live */}
      <Link
        href="/live"
        className={`flex flex-col items-center gap-1 px-3 py-1 transition-colors ${
          activeTab === 'live' ? 'text-white' : 'text-text-secondary'
        }`}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="2" />
          <path d="M16.24 7.76a6 6 0 0 1 0 8.49m-8.48-.01a6 6 0 0 1 0-8.49m11.31-2.82a10 10 0 0 1 0 14.14m-14.14 0a10 10 0 0 1 0-14.14" />
        </svg>
        <span className="text-[10px] font-medium">Live</span>
      </Link>

      {/* Post (center +) */}
      <Link
        href="/post"
        className="flex flex-col items-center gap-1 -mt-4"
      >
        <div className={`w-12 h-12 rounded-full bg-accent shadow-lg shadow-accent/40 flex items-center justify-center transition-all active:scale-95 ${
          activeTab === 'post' ? 'ring-2 ring-white/40' : ''
        }`}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </div>
        <span className="text-[10px] font-medium text-text-secondary">Post</span>
      </Link>

      {/* Portfolio */}
      <Link
        href="/portfolio"
        className={`flex flex-col items-center gap-1 px-3 py-1 transition-colors ${
          activeTab === 'portfolio' ? 'text-white' : 'text-text-secondary'
        }`}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
          <line x1="8" y1="21" x2="16" y2="21" />
          <line x1="12" y1="17" x2="12" y2="21" />
        </svg>
        <span className="text-[10px] font-medium">Portfolio</span>
      </Link>

      {/* Profile */}
      <Link
        href="/profile"
        className={`flex flex-col items-center gap-1 px-3 py-1 transition-colors ${
          activeTab === 'profile' ? 'text-white' : 'text-text-secondary'
        }`}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
        <span className="text-[10px] font-medium">Profile</span>
      </Link>
    </nav>
  );
}
