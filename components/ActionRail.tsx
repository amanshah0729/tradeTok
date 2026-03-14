'use client';

import { useState } from 'react';
import { formatCount } from '@/lib/mockData';
import { SocialStats } from '@/types/trade';

interface ActionRailProps {
  social: SocialStats;
  liked: boolean;
  localLikes: number;
  onLike: () => void;
  onCommentClick: () => void;
}

export default function ActionRail({ social, liked, localLikes, onLike, onCommentClick }: ActionRailProps) {
  const [bookmarked, setBookmarked] = useState(false);

  return (
    <div className="absolute right-3 bottom-20 flex flex-col items-center gap-5 z-20">

      {/* Heart — bigger and filled, primary action */}
      <button onClick={onLike} className="flex flex-col items-center gap-1">
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center transition-all active:scale-90"
          style={{
            background: liked ? 'rgba(255,45,120,0.25)' : 'rgba(255,255,255,0.1)',
            boxShadow: liked ? '0 0 18px rgba(255,45,120,0.45)' : 'none',
          }}
        >
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill={liked ? '#FF1493' : 'none'}
            stroke={liked ? '#FF1493' : 'white'}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </div>
        <span className="text-xs font-semibold" style={{ color: liked ? '#FF1493' : 'rgba(255,255,255,0.7)' }}>
          {formatCount(localLikes)}
        </span>
      </button>

      {/* Comment */}
      <button onClick={onCommentClick} className="flex flex-col items-center gap-1">
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
        <div
          className="w-11 h-11 rounded-full flex items-center justify-center active:scale-90 transition-all"
          style={{ background: bookmarked ? 'rgba(255,45,120,0.2)' : 'rgba(255,255,255,0.1)' }}
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill={bookmarked ? '#FF1493' : 'none'}
            stroke={bookmarked ? '#FF1493' : 'white'}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
          </svg>
        </div>
        <span className="text-xs text-white/70 font-medium">{formatCount(social.bookmarks)}</span>
      </button>

    </div>
  );
}
