'use client';

import { useState } from 'react';
import TabBar from '@/components/TabBar';

const POSTS = [
  {
    id: 'post-1',
    videoSrc: '/videos/post-1.MP4',
    ticker: 'ETH',
    direction: 'SHORT' as const,
    pnlPct: -2.1,
    likes: 8700,
  },
  {
    id: 'post-2',
    videoSrc: '/videos/post-2.MP4',
    ticker: 'BTC',
    direction: 'LONG' as const,
    pnlPct: 19.4,
    likes: 21500,
  },
];

const STATS = [
  { label: 'Win Rate',      value: '67%'     },
  { label: 'Total Trades',  value: '142'     },
  { label: 'Avg Leverage',  value: '6.2x'   },
  { label: 'Best Trade',    value: '+$3,840' },
];

type ModalType = 'deposit' | 'withdraw' | null;

export default function ProfilePage() {
  const [modal, setModal]   = useState<ModalType>(null);
  const [amount, setAmount] = useState('');

  const totalBalance  = 17057.50;
  const deployed      = 12847.50;
  const available     = 4210.00;
  const deployedPct   = Math.round((deployed / totalBalance) * 100);

  function handleAction() {
    setAmount('');
    setModal(null);
  }

  return (
    <div className="fixed inset-0 bg-black flex justify-center">
      <div className="relative w-full max-w-[430px] h-full flex flex-col">

        <div className="flex-1 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="pb-6">

            {/* ── Instagram-style header ── */}
            <div className="px-5 pt-12 pb-4">
              {/* Pencil edit button top-right */}
              <div className="flex justify-end mb-2">
                <button className="p-2 rounded-full transition-all active:opacity-60" style={{ background: 'rgba(255,255,255,0.07)' }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                </button>
              </div>
              <div className="flex items-center gap-5">
                {/* Avatar */}
                <div
                  className="w-20 h-20 rounded-full flex-shrink-0 flex items-center justify-center text-3xl font-bold text-white"
                  style={{ background: 'linear-gradient(135deg, #FF1493, #cc0070)' }}
                >
                  A
                </div>

                {/* Stats row */}
                <div className="flex flex-1 justify-around text-center">
                  <div>
                    <p className="text-white font-bold text-lg leading-tight">89</p>
                    <p className="text-white/40 text-xs">Posts</p>
                  </div>
                  <div>
                    <p className="text-white font-bold text-lg leading-tight">2.4K</p>
                    <p className="text-white/40 text-xs">Followers</p>
                  </div>
                  <div>
                    <p className="text-white font-bold text-lg leading-tight">318</p>
                    <p className="text-white/40 text-xs">Following</p>
                  </div>
                </div>
              </div>

              {/* Name + handle */}
              <div className="mt-3">
                <p className="text-white font-bold text-sm">Aman Shah</p>
                <p className="text-white/50 text-xs">@aman_trades · Member since Jan 2024</p>
                <p className="text-white/70 text-sm mt-1">Crypto trader 📈 Sharing live trades & setups. 67% win rate.</p>
              </div>

              {/* Action buttons */}
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => setModal('deposit')}
                  className="flex-1 py-1.5 rounded-lg text-white text-xs font-semibold transition-all active:scale-95"
                  style={{ background: 'linear-gradient(135deg, #FF1493, #cc0070)' }}
                >
                  Deposit
                </button>
                <button
                  onClick={() => setModal('withdraw')}
                  className="flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all active:scale-95"
                  style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.85)' }}
                >
                  Withdraw
                </button>
              </div>
            </div>

            {/* ── Compact balance bar ── */}
            <div className="mx-5 rounded-2xl px-4 py-3 space-y-2"
              style={{ background: '#161616', border: '1px solid rgba(255,255,255,0.07)' }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/40 text-[10px] uppercase tracking-widest">Balance</p>
                  <p className="text-white font-bold text-lg leading-tight">
                    ${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <p className="text-green text-xs font-semibold">+$4,457.50 (+35.3%)</p>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                <div className="h-full rounded-full" style={{ width: `${deployedPct}%`, background: 'linear-gradient(90deg, #FF1493, #cc0070)' }} />
              </div>
              <div className="flex justify-between text-[10px] text-white/40">
                <span>${deployed.toLocaleString('en-US', { minimumFractionDigits: 2 })} deployed ({deployedPct}%)</span>
                <span>${available.toLocaleString('en-US', { minimumFractionDigits: 2 })} free</span>
              </div>
            </div>

            {/* ── Posts grid ── */}
            <div className="mt-5">
              <div className="flex items-center gap-2 px-5 mb-3">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
                  <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
                </svg>
                <span className="text-white text-xs font-semibold uppercase tracking-widest">Posts</span>
              </div>

              <div className="grid grid-cols-3 gap-px">
                {POSTS.map((post) => {
                  const isProfit = post.pnlPct >= 0;
                  return (
                    <div key={post.id} className="relative aspect-[9/16] bg-white/5 overflow-hidden">
                      <video
                        src={post.videoSrc}
                        className="absolute inset-0 w-full h-full object-cover"
                        muted
                        playsInline
                        preload="metadata"
                      />
                      {/* Gradient overlay */}
                      <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 50%)' }} />
                      {/* Trade badge */}
                      <div className="absolute top-2 left-2">
                        <span
                          className="text-[9px] font-bold px-1.5 py-0.5 rounded"
                          style={{
                            background: post.direction === 'LONG' ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)',
                            color: post.direction === 'LONG' ? '#22c55e' : '#ef4444',
                          }}
                        >
                          {post.direction}
                        </span>
                      </div>
                      {/* Bottom info */}
                      <div className="absolute bottom-2 left-2 right-2">
                        <p className="text-white text-xs font-bold leading-tight">{post.ticker}</p>
                        <p className="text-[10px] font-semibold" style={{ color: isProfit ? '#22c55e' : '#ef4444' }}>
                          {isProfit ? '+' : ''}{post.pnlPct}%
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ── Trading stats ── */}
            <div className="mx-5 mt-5 rounded-2xl p-4"
              style={{ background: '#161616', border: '1px solid rgba(255,255,255,0.07)' }}>
              <p className="text-white/50 text-[10px] font-semibold uppercase tracking-widest mb-3">Trading Stats</p>
              <div className="grid grid-cols-2 gap-3">
                {STATS.map((s) => (
                  <div key={s.label} className="rounded-xl px-3 py-2.5" style={{ background: 'rgba(255,255,255,0.04)' }}>
                    <p className="text-white/40 text-[10px] mb-0.5">{s.label}</p>
                    <p className="text-white font-bold text-base">{s.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="h-4" />
          </div>
        </div>

        <div className="flex-shrink-0 z-50">
          <TabBar activeTab="profile" />
        </div>
      </div>

      {/* ── Deposit / Withdraw modal ── */}
      {modal && (
        <div
          className="absolute inset-0 z-50 flex items-end justify-center"
          style={{ background: 'rgba(0,0,0,0.7)' }}
          onClick={() => setModal(null)}
        >
          <div
            className="w-full max-w-[430px] rounded-t-3xl p-6 pb-10"
            style={{ background: '#111', border: '1px solid rgba(255,255,255,0.1)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-10 h-1 rounded-full mx-auto mb-6" style={{ background: 'rgba(255,255,255,0.2)' }} />

            <p className="text-white text-xl font-bold mb-1 capitalize">{modal}</p>
            <p className="text-white/40 text-sm mb-6">
              {modal === 'deposit' ? 'Add funds to your trading account.' : 'Move funds back to your bank.'}
            </p>

            <div className="flex justify-between items-center rounded-xl px-4 py-3 mb-4"
              style={{ background: 'rgba(255,255,255,0.05)' }}>
              <span className="text-white/50 text-sm">
                {modal === 'deposit' ? 'Bank balance' : 'Available to withdraw'}
              </span>
              <span className="text-white font-semibold text-sm">
                {modal === 'deposit' ? '$28,400.00' : `$${available.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
              </span>
            </div>

            <div className="flex items-center rounded-xl px-4 py-3 mb-6"
              style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)' }}>
              <span className="text-white/50 text-lg mr-2">$</span>
              <input
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="flex-1 bg-transparent text-white text-lg font-semibold outline-none placeholder:text-white/20"
                autoFocus
              />
              <button
                onClick={() => setAmount(modal === 'deposit' ? '28400' : available.toFixed(2))}
                className="text-xs font-bold"
                style={{ color: '#FF1493' }}
              >
                MAX
              </button>
            </div>

            <button
              onClick={handleAction}
              className="w-full py-4 rounded-xl font-bold text-white text-base transition-all active:scale-95"
              style={{ background: 'linear-gradient(135deg, #FF1493, #cc0070)', opacity: amount ? 1 : 0.5 }}
              disabled={!amount}
            >
              {modal === 'deposit' ? 'Deposit Funds' : 'Withdraw Funds'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
