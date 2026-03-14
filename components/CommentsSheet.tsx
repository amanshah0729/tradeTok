'use client';

const MOCK_COMMENTS = [
  { id: 1, user: 'moonboi_99',     text: 'Copying this instantly 🚀',                          time: '2m',  likes: 234 },
  { id: 2, user: 'tradequeen',     text: "What's your invalidation level?",                     time: '5m',  likes: 87  },
  { id: 3, user: 'degen_alpha',    text: 'Been watching this setup for weeks, finally! 🔥',     time: '8m',  likes: 156 },
  { id: 4, user: 'satoshi_jr',     text: 'Nice tight stop, risk management on point',           time: '12m', likes: 43  },
  { id: 5, user: 'cryptovibes',    text: '10x is wild but the chart looks clean tho 👀',        time: '15m', likes: 312 },
  { id: 6, user: 'whale_watcher',  text: 'Smart money was accumulating at this level',          time: '22m', likes: 198 },
  { id: 7, user: 'anontrader_x',   text: "Let's go!! I'm in too 💪",                            time: '30m', likes: 67  },
  { id: 8, user: 'hodl_forever',   text: 'Thanks for sharing, been looking for a good entry',   time: '45m', likes: 29  },
];

interface CommentsSheetProps {
  isOpen: boolean;
  onClose: () => void;
  commentCount: number;
}

export default function CommentsSheet({ isOpen, onClose, commentCount }: CommentsSheetProps) {
  return (
    <>
      {/* Backdrop */}
      <div
        className={`absolute inset-0 z-30 transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        style={{ background: 'rgba(0,0,0,0.5)' }}
        onClick={onClose}
      />

      {/* Sheet */}
      <div
        className={`absolute bottom-0 left-0 right-0 z-40 rounded-t-3xl flex flex-col transition-transform duration-300 ease-out ${isOpen ? 'translate-y-0' : 'translate-y-full'}`}
        style={{ height: '72%', background: 'rgba(14,14,14,0.97)', backdropFilter: 'blur(24px)', borderTop: '1px solid rgba(255,255,255,0.08)' }}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
          <div className="w-10 h-1 rounded-full bg-white/20" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-white/8 flex-shrink-0">
          <span className="text-white font-semibold text-base">{commentCount.toLocaleString()} comments</span>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center active:scale-90 transition-all">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Comments list */}
        <div className="overflow-y-auto flex-1 px-4 py-3 space-y-5">
          {MOCK_COMMENTS.map((c) => (
            <div key={c.id} className="flex gap-3">
              <div
                className="w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold text-white"
                style={{ background: 'linear-gradient(135deg, #ff2d78, #9b1fcc)' }}
              >
                {c.user[0].toUpperCase()}
              </div>
              <div className="flex-1">
                <div className="flex items-baseline gap-2">
                  <span className="text-white font-semibold text-sm">{c.user}</span>
                  <span className="text-white/40 text-xs">{c.time} ago</span>
                </div>
                <p className="text-white/80 text-sm mt-0.5 leading-snug">{c.text}</p>
                <div className="flex items-center gap-1.5 mt-1.5">
                  <button className="text-white/30 hover:text-[#ff2d78] transition-colors">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                  </button>
                  <span className="text-white/40 text-xs">{c.likes}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Comment input */}
        <div className="flex-shrink-0 px-4 py-3 border-t border-white/8 flex items-center gap-3">
          <div className="flex-1 bg-white/8 rounded-full px-4 py-2.5 text-white/40 text-sm">
            Add a comment...
          </div>
          <button className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: '#ff2d78' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>
      </div>
    </>
  );
}
