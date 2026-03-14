'use client';

import { useState } from 'react';
import { Trader } from '@/types/trade';

interface TraderInfoProps {
  trader: Trader;
  caption: string;
}

export default function TraderInfo({ trader, caption }: TraderInfoProps) {
  const [following, setFollowing] = useState(false);

  return (
    <div className="absolute bottom-4 left-3 right-3 z-20 flex items-end justify-between gap-3">
      {/* Left: avatar + name + caption */}
      <div className="flex-1 min-w-0 flex gap-3 items-start">
        {/* Avatar */}
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-accent flex items-center justify-center overflow-hidden">
          {trader.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={trader.avatarUrl} alt={trader.name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-white font-bold text-lg">{trader.name[0]}</span>
          )}
        </div>

        <div className="flex-1 min-w-0">
          {/* Name + win rate */}
          <div className="flex items-center gap-2 mb-0.5">
            <span className="font-semibold text-white text-sm">{trader.name}</span>
            <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-green/20 text-green text-[10px] font-bold">
              <svg width="8" height="8" viewBox="0 0 8 8" fill="currentColor">
                <circle cx="4" cy="4" r="3" />
              </svg>
              {trader.winRate}% WR
            </span>
          </div>
          {/* Caption */}
          <p className="text-white/70 text-xs leading-relaxed line-clamp-2">{caption}</p>
        </div>
      </div>

      {/* Right: Follow button */}
      <button
        onClick={() => setFollowing((f) => !f)}
        className={`flex-shrink-0 rounded-full px-4 py-1.5 text-sm font-semibold transition-all active:scale-95 ${
          following
            ? 'bg-white/10 text-white/70 border border-white/20'
            : 'bg-accent text-white shadow-lg shadow-accent/30'
        }`}
      >
        {following ? 'Following' : 'Follow'}
      </button>
    </div>
  );
}
