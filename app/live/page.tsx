'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import TabBar from '@/components/TabBar';

const TRADERS = [
  {
    id: 'ezra',
    name: 'Ezra Tremble',
    handle: '@ezratremble',
    pic: '/videos/ezrapic.jpeg',
    title: 'President, Blockchain at Berkeley',
    viewers: 2847,
    activeTrade: 'BTC/USDT · LONG 3x',
    pnlToday: '+$4,210',
    winRate: 79,
    bio: 'Teaching real-time on-chain analysis and macro BTC structure. Come learn.',
    chatMessages: [
      { user: 'moonboi99',    text: 'Ezra you called this perfectly 🔥', time: 10 },
      { user: 'satoshi_jr',   text: 'what\'s ur invalidation?',          time: 18 },
      { user: 'cryptovibes',  text: 'already up 2% thanks to you 🚀',    time: 25 },
      { user: 'tradequeen',   text: 'can you explain the S/R level?',    time: 33 },
      { user: 'degen_alpha',  text: 'LFG BTC 🟠',                        time: 40 },
      { user: 'whale_watcher','text': 'smart money moving in fr',        time: 48 },
      { user: 'hodl4ever',    text: 'copying this trade now',            time: 55 },
      { user: 'anon_x',       text: 'volume looks insane rn',            time: 62 },
      { user: 'moonboi99',    text: 'ezra stay live pls 🙏',             time: 70 },
    ],
  },
  {
    id: 'taj',
    name: 'Taj Singh',
    handle: '@tajsingh',
    pic: '/videos/tajpic.jpeg',
    title: 'NFT Trader & DeFi Strategist',
    viewers: 1193,
    activeTrade: 'ETH/USDT · LONG 5x',
    pnlToday: '+$1,840',
    winRate: 72,
    bio: 'Live flipping NFTs & trading ETH. Transparent P&L every session.',
    chatMessages: [
      { user: 'nft_king',     text: 'taj always eats 🍽️',               time: 8  },
      { user: 'defi_degen',   text: 'ETH about to run, I feel it',       time: 15 },
      { user: 'flipmaster',   text: 'good entry level bro',              time: 24 },
      { user: 'cryptovibes',  text: 'how long u holding?',               time: 32 },
      { user: 'anon_trader',  text: '5x is spicy 👀',                    time: 41 },
      { user: 'hodl4ever',    text: 'in it with you 💪',                 time: 50 },
      { user: 'nft_king',     text: 'wen moon taj',                      time: 58 },
      { user: 'whale_watcher','text': 'volume confirming the move',      time: 65 },
      { user: 'moonboi99',    text: 'let\'s ride 🚀🚀🚀',               time: 72 },
    ],
  },
];

type Trader = typeof TRADERS[number];

export default function LivePage() {
  const [active, setActive] = useState<Trader | null>(null);

  return (
    <div className="fixed inset-0 bg-black flex justify-center">
      <div className="relative w-full max-w-[430px] h-full flex flex-col">
        {active ? (
          <LiveRoom trader={active} onBack={() => setActive(null)} />
        ) : (
          <LiveFeed traders={TRADERS} onSelect={setActive} />
        )}
      </div>
    </div>
  );
}

/* ─── Feed list ─────────────────────────────────────────────── */
function LiveFeed({ traders, onSelect }: { traders: Trader[]; onSelect: (t: Trader) => void }) {
  return (
    <>
      <div className="flex-1 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="px-5 pt-12 pb-4">
          {/* Header */}
          <div className="flex items-center gap-2 mb-6">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <h1 className="text-white text-xl font-bold">Live Now</h1>
            <span className="text-white/30 text-sm">{traders.length} streams</span>
          </div>

          {/* Cards */}
          <div className="space-y-4">
            {traders.map((trader) => (
              <button
                key={trader.id}
                onClick={() => onSelect(trader)}
                className="w-full text-left rounded-2xl overflow-hidden active:scale-[0.98] transition-transform"
                style={{ border: '1px solid rgba(255,255,255,0.08)' }}
              >
                {/* Thumbnail */}
                <div className="relative w-full" style={{ aspectRatio: '16/9' }}>
                  <Image
                    src={trader.pic}
                    alt={trader.name}
                    fill
                    className="object-cover object-top"
                  />
                  {/* Dark overlay */}
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.1) 60%)' }} />

                  {/* LIVE badge */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-600 text-white text-xs font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    LIVE
                  </div>

                  {/* Viewer count */}
                  <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full text-white text-xs font-medium"
                    style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)' }}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                    {trader.viewers.toLocaleString()}
                  </div>

                  {/* Active trade pill */}
                  <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full text-xs font-semibold text-green-400"
                    style={{ background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.25)', backdropFilter: 'blur(6px)' }}>
                    {trader.activeTrade}
                  </div>
                </div>

                {/* Info row */}
                <div className="flex items-center gap-3 px-4 py-3" style={{ background: '#111' }}>
                  <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-[#FF1493]/40">
                    <Image src={trader.pic} alt={trader.name} width={40} height={40} className="object-cover object-top" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-semibold text-sm leading-tight">{trader.name}</p>
                    <p className="text-white/40 text-xs truncate">{trader.title}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-green-400 text-sm font-semibold">{trader.pnlToday}</p>
                    <p className="text-white/30 text-xs">today</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="flex-shrink-0 z-50">
        <TabBar activeTab="live" />
      </div>
    </>
  );
}

/* ─── Live Room ─────────────────────────────────────────────── */
function LiveRoom({ trader, onBack }: { trader: Trader; onBack: () => void }) {
  const [copying, setCopying] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [visibleMessages, setVisibleMessages] = useState(3);
  const chatRef = useRef<HTMLDivElement>(null);

  // Trickle chat messages in
  useEffect(() => {
    const interval = setInterval(() => {
      setVisibleMessages((n) => {
        const next = n + 1;
        if (next >= trader.chatMessages.length) { clearInterval(interval); return n; }
        return next;
      });
    }, 2800);
    return () => clearInterval(interval);
  }, [trader.chatMessages.length]);

  // Auto-scroll chat
  useEffect(() => {
    chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: 'smooth' });
  }, [visibleMessages]);

  const handleCopyToggle = () => {
    if (copying) {
      setCopying(false);
    } else {
      setCopying(true);
      setShowConfirm(true);
      setTimeout(() => setShowConfirm(false), 2200);
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col overflow-hidden">
      {/* Full-screen background */}
      <div className="absolute inset-0">
        <Image
          src={trader.pic}
          alt={trader.name}
          fill
          className="object-cover object-top"
          priority
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.15) 30%, rgba(0,0,0,0.7) 70%, rgba(0,0,0,0.92) 100%)' }} />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col h-full">

        {/* Top bar */}
        <div className="flex items-center gap-3 px-4 pt-12 pb-3">
          <button
            onClick={onBack}
            className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(8px)' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
          </button>

          {/* Trader info */}
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-[#FF1493]/60">
              <Image src={trader.pic} alt={trader.name} width={32} height={32} className="object-cover object-top" />
            </div>
            <div className="min-w-0">
              <p className="text-white font-semibold text-sm leading-tight">{trader.name}</p>
              <p className="text-white/50 text-xs truncate">{trader.title}</p>
            </div>
          </div>

          {/* LIVE + viewers */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-600 text-white text-xs font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              LIVE
            </div>
            <div className="flex items-center gap-1 text-white/70 text-xs">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
              {trader.viewers.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Active trade card */}
        <div className="mx-4 mt-1">
          <div className="flex items-center justify-between px-3 py-2 rounded-xl"
            style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <span className="text-white/60 text-xs">Active trade</span>
              <span className="text-green-400 text-xs font-semibold">{trader.activeTrade}</span>
            </div>
            <span className="text-green-400 text-xs font-bold">{trader.pnlToday} today</span>
          </div>
        </div>

        {/* Copy trading confirmation burst */}
        {showConfirm && (
          <div className="absolute inset-0 z-50 pointer-events-none flex items-center justify-center">
            <div
              className="flex flex-col items-center gap-3 px-8 py-6 rounded-3xl"
              style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,20,147,0.3)', animation: 'slideUpFade 2.2s ease-out forwards' }}
            >
              <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,20,147,0.2)' }}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#FF1493" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <div className="text-center">
                <p className="text-white font-bold text-base">Copy Trading Active</p>
                <p className="text-white/50 text-sm mt-0.5">Mirroring {trader.name.split(' ')[0]}'s trades</p>
                <p className="text-[#FF1493] font-semibold text-sm mt-1">2% of portfolio per trade</p>
              </div>
            </div>
          </div>
        )}

        {/* Spacer */}
        <div className="flex-1" />

        {/* Copy trading pill — persistent when active */}
        {copying && (
          <div className="mx-4 mb-3 flex items-center gap-2 px-4 py-2.5 rounded-full"
            style={{ background: 'rgba(255,20,147,0.15)', border: '1px solid rgba(255,20,147,0.35)', backdropFilter: 'blur(10px)' }}>
            <div className="w-2 h-2 rounded-full bg-[#FF1493] animate-pulse" />
            <span className="text-[#FF1493] text-sm font-semibold flex-1">Copy Trading · 2% per trade</span>
            <button onClick={handleCopyToggle} className="text-white/30 hover:text-white/60 transition-colors">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
        )}

        {/* Chat */}
        <div ref={chatRef} className="mx-4 mb-3 space-y-2 max-h-44 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {trader.chatMessages.slice(0, visibleMessages).map((msg, i) => (
            <div key={i} className="flex items-start gap-2">
              <div className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-bold text-white"
                style={{ background: 'linear-gradient(135deg, #FF1493, #7c0060)' }}>
                {msg.user[0].toUpperCase()}
              </div>
              <div className="flex-1">
                <span className="text-[#FF1493] text-xs font-semibold">{msg.user} </span>
                <span className="text-white/80 text-xs">{msg.text}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="px-4 pb-8 flex items-center gap-3">
          <div className="flex-1 flex items-center gap-2 px-4 py-2.5 rounded-full"
            style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.12)' }}>
            <span className="text-white/30 text-sm flex-1">Say something...</span>
          </div>

          {/* Copy trade button */}
          <button
            onClick={handleCopyToggle}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full font-bold text-sm transition-all active:scale-95"
            style={{
              background: copying ? 'rgba(255,20,147,0.2)' : '#FF1493',
              color: copying ? '#FF1493' : 'white',
              border: copying ? '1px solid rgba(255,20,147,0.5)' : 'none',
              boxShadow: copying ? 'none' : '0 0 20px rgba(255,20,147,0.45)',
              backdropFilter: 'blur(8px)',
            }}
          >
            {copying ? (
              <>
                <div className="w-2 h-2 rounded-full bg-[#FF1493] animate-pulse" />
                Copying
              </>
            ) : (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="16 3 21 3 21 8"/>
                  <line x1="4" y1="20" x2="21" y2="3"/>
                  <polyline points="21 16 21 21 16 21"/>
                  <line x1="15" y1="15" x2="21" y2="21"/>
                </svg>
                Copy Trade
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
