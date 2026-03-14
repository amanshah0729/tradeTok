'use client';

import { useState } from 'react';
import { formatCount } from '@/lib/mockData';
import { SocialStats } from '@/types/trade';

interface ActionRailProps {
  social: SocialStats;
  onCopy: () => void;
}

export default function ActionRail({ social, onCopy }: ActionRailProps) {
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [localLikes, setLocalLikes] = useState(social.likes);

  function handleLike() {
    setLiked((l) => {
      const next = !l;
      setLocalLikes((c) => c + (next ? 1 : -1));
      return next;
    });
  }

  return (
    <div className="absolute right-3 bottom-20 flex flex-col items-center gap-5 z-20">
      {/* Heart */}
      <button onClick={handleLike} className="flex flex-col items-center gap-1">
        <div className={`w-11 h-11 rounded-full flex items-center justify-center transition-all active:scale-90 ${liked ? 'bg-red/20' : 'bg-white/10'}`}>
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill={liked ? '#ef4444' : 'none'}
            stroke={liked ? '#ef4444' : 'white'}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </div>
        <span className="text-xs text-white/70 font-medium">{formatCount(localLikes)}</span>
      </button>

      {/* Comment */}
      <button className="flex flex-col items-center gap-1">
        <div className="w-11 h-11 rounded-full bg-white/10 flex items-center justify-center active:scale-90 transition-all">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        </div>
        <span className="text-xs text-white/70 font-medium">{formatCount(social.comments)}</span>
      </button>

      {/* Share */}
      <button className="flex flex-col items-center gap-1">
        <div className="w-11 h-11 rounded-full bg-white/10 flex items-center justify-center active:scale-90 transition-all">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="18" cy="5" r="3" />
            <circle cx="6" cy="12" r="3" />
            <circle cx="18" cy="19" r="3" />
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
          </svg>
        </div>
        <span className="text-xs text-white/70 font-medium">{formatCount(social.shares)}</span>
      </button>

      {/* Bookmark */}
      <button onClick={() => setBookmarked((b) => !b)} className="flex flex-col items-center gap-1">
        <div className={`w-11 h-11 rounded-full flex items-center justify-center active:scale-90 transition-all ${bookmarked ? 'bg-accent/20' : 'bg-white/10'}`}>
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill={bookmarked ? '#4f8ef7' : 'none'}
            stroke={bookmarked ? '#4f8ef7' : 'white'}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
          </svg>
        </div>
        <span className="text-xs text-white/70 font-medium">{formatCount(social.bookmarks)}</span>
      </button>

      {/* Copy trade button */}
      <button
        onClick={onCopy}
        className="flex flex-col items-center gap-1"
      >
        <div className="w-14 h-14 rounded-full bg-accent shadow-lg shadow-accent/40 flex items-center justify-center active:scale-90 transition-all">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="16 3 21 3 21 8" />
            <line x1="4" y1="20" x2="21" y2="3" />
            <polyline points="21 16 21 21 16 21" />
            <line x1="15" y1="15" x2="21" y2="21" />
          </svg>
        </div>
        <span className="text-xs text-white/70 font-medium">Copy</span>
      </button>
    </div>
  );
}
