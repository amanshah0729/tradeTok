'use client';

import { useState } from 'react';
import TabBar from '@/components/TabBar';

const STATS = [
  { label: 'Win Rate', value: '67%' },
  { label: 'Total Trades', value: '142' },
  { label: 'Avg Leverage', value: '6.2x' },
  { label: 'Best Trade', value: '+$3,840' },
];

const HISTORY = [
  { id: 1, pair: 'BTC/USDT', direction: 'LONG' as const, pnl: 3840.00, pnlPct: 48.2, closed: '2 days ago' },
  { id: 2, pair: 'ETH/USDT', direction: 'SHORT' as const, pnl: -210.50, pnlPct: -8.1, closed: '4 days ago' },
  { id: 3, pair: 'SOL/USDT', direction: 'LONG' as const, pnl: 640.00, pnlPct: 22.4, closed: '1 week ago' },
  { id: 4, pair: 'AVAX/USDT', direction: 'LONG' as const, pnl: 180.20, pnlPct: 11.3, closed: '1 week ago' },
  { id: 5, pair: 'DOGE/USDT', direction: 'SHORT' as const, pnl: -95.00, pnlPct: -5.2, closed: '2 weeks ago' },
];

type ModalType = 'deposit' | 'withdraw' | null;

export default function ProfilePage() {
  const [modal, setModal] = useState<ModalType>(null);
  const [amount, setAmount] = useState('');

  const totalBalance = 17057.50;
  const deployed = 12847.50;
  const available = 4210.00;
  const deployedPct = Math.round((deployed / totalBalance) * 100);

  function handleAction() {
    setAmount('');
    setModal(null);
  }

  return (
    <div className="fixed inset-0 bg-black flex justify-center">
      <div className="relative w-full max-w-[430px] h-full flex flex-col">

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="px-5 pt-12 pb-6 space-y-5">

            {/* Avatar + username */}
            <div className="flex flex-col items-center gap-3 pt-2">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold text-white"
                style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
              >
                A
              </div>
              <div className="text-center">
                <p className="text-white text-xl font-bold">@aman_trades</p>
                <p className="text-white/40 text-xs mt-0.5">Member since Jan 2024</p>
              </div>

              {/* Follower counts */}
              <div className="flex gap-8">
                <div className="text-center">
                  <p className="text-white font-bold text-lg">2.4K</p>
                  <p className="text-white/40 text-xs">Followers</p>
                </div>
                <div className="w-px bg-white/10" />
                <div className="text-center">
                  <p className="text-white font-bold text-lg">318</p>
                  <p className="text-white/40 text-xs">Following</p>
                </div>
                <div className="w-px bg-white/10" />
                <div className="text-center">
                  <p className="text-white font-bold text-lg">89</p>
                  <p className="text-white/40 text-xs">Posts</p>
                </div>
              </div>
            </div>

            {/* Balance card */}
            <div
              className="rounded-2xl p-5"
              style={{ background: '#161616', border: '1px solid rgba(255,255,255,0.07)' }}
            >
              <p className="text-white/40 text-xs uppercase tracking-widest mb-1">Total Balance</p>
              <p className="text-white text-4xl font-bold tracking-tight">
                ${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
              <p className="text-green-500 text-sm font-semibold mt-0.5">+$4,457.50 (+35.3%) all time</p>

              {/* Deployed bar */}
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-white/50">Deployed in positions</span>
                  <span className="text-white/70 font-semibold">{deployedPct}%</span>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${deployedPct}%`,
                      background: 'linear-gradient(90deg, #6366f1, #8b5cf6)',
                    }}
                  />
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-white/40">
                    ${deployed.toLocaleString('en-US', { minimumFractionDigits: 2 })} deployed
                  </span>
                  <span className="text-white/40">
                    ${available.toLocaleString('en-US', { minimumFractionDigits: 2 })} available
                  </span>
                </div>
              </div>

              {/* Deposit / Withdraw */}
              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => setModal('deposit')}
                  className="flex-1 py-3 rounded-xl font-bold text-white text-sm transition-all active:scale-95"
                  style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
                >
                  Deposit
                </button>
                <button
                  onClick={() => setModal('withdraw')}
                  className="flex-1 py-3 rounded-xl font-bold text-sm transition-all active:scale-95"
                  style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.85)' }}
                >
                  Withdraw
                </button>
              </div>
            </div>

            {/* Trading stats */}
            <div
              className="rounded-2xl p-5"
              style={{ background: '#161616', border: '1px solid rgba(255,255,255,0.07)' }}
            >
              <p className="text-white/50 text-xs font-semibold uppercase tracking-widest mb-4">Trading Stats</p>
              <div className="grid grid-cols-2 gap-4">
                {STATS.map((s) => (
                  <div key={s.label} className="rounded-xl px-4 py-3" style={{ background: 'rgba(255,255,255,0.04)' }}>
                    <p className="text-white/40 text-xs mb-1">{s.label}</p>
                    <p className="text-white font-bold text-lg">{s.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Trade history */}
            <div
              className="rounded-2xl p-5"
              style={{ background: '#161616', border: '1px solid rgba(255,255,255,0.07)' }}
            >
              <p className="text-white/50 text-xs font-semibold uppercase tracking-widest mb-4">Recent Closed Trades</p>
              <div className="space-y-3">
                {HISTORY.map((t) => {
                  const isProfit = t.pnl >= 0;
                  const pnlColor = isProfit ? '#22c55e' : '#ef4444';
                  const isLong = t.direction === 'LONG';
                  return (
                    <div key={t.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span
                          className="text-xs font-bold px-2 py-0.5 rounded"
                          style={{
                            background: isLong ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)',
                            color: isLong ? '#22c55e' : '#ef4444',
                          }}
                        >
                          {t.direction}
                        </span>
                        <div>
                          <p className="text-white text-sm font-semibold">{t.pair}</p>
                          <p className="text-white/30 text-xs">{t.closed}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold" style={{ color: pnlColor }}>
                          {isProfit ? '+' : ''}${Math.abs(t.pnl).toFixed(2)}
                        </p>
                        <p className="text-xs font-semibold" style={{ color: pnlColor }}>
                          {isProfit ? '+' : ''}{t.pnlPct.toFixed(1)}%
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Settings links */}
            <div
              className="rounded-2xl overflow-hidden"
              style={{ background: '#161616', border: '1px solid rgba(255,255,255,0.07)' }}
            >
              {[
                { label: 'Edit Profile', icon: '✏️' },
                { label: 'Notifications', icon: '🔔' },
                { label: 'Connected Exchanges', icon: '🔗' },
                { label: 'Privacy & Security', icon: '🔒' },
                { label: 'Sign Out', icon: '🚪', danger: true },
              ].map((item, i, arr) => (
                <button
                  key={item.label}
                  className="w-full flex items-center justify-between px-5 py-4 transition-all active:opacity-70"
                  style={{
                    borderBottom: i < arr.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                  }}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-base">{item.icon}</span>
                    <span
                      className="text-sm font-medium"
                      style={{ color: item.danger ? '#ef4444' : 'rgba(255,255,255,0.85)' }}
                    >
                      {item.label}
                    </span>
                  </div>
                  {!item.danger && (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="2">
                      <path d="M9 18l6-6-6-6"/>
                    </svg>
                  )}
                </button>
              ))}
            </div>

            <div className="h-4" />
          </div>
        </div>

        {/* Tab bar */}
        <div className="flex-shrink-0 z-50">
          <TabBar activeTab="profile" />
        </div>
      </div>

      {/* Deposit / Withdraw modal */}
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
            {/* Handle */}
            <div className="w-10 h-1 rounded-full mx-auto mb-6" style={{ background: 'rgba(255,255,255,0.2)' }} />

            <p className="text-white text-xl font-bold mb-1 capitalize">{modal}</p>
            <p className="text-white/40 text-sm mb-6">
              {modal === 'deposit' ? 'Add funds to your trading account.' : 'Move funds back to your bank.'}
            </p>

            {/* Available */}
            <div
              className="flex justify-between items-center rounded-xl px-4 py-3 mb-4"
              style={{ background: 'rgba(255,255,255,0.05)' }}
            >
              <span className="text-white/50 text-sm">
                {modal === 'deposit' ? 'Bank balance' : 'Available to withdraw'}
              </span>
              <span className="text-white font-semibold text-sm">
                {modal === 'deposit' ? '$28,400.00' : `$${available.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
              </span>
            </div>

            {/* Amount input */}
            <div
              className="flex items-center rounded-xl px-4 py-3 mb-6"
              style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)' }}
            >
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
                className="text-indigo-400 text-xs font-bold"
              >
                MAX
              </button>
            </div>

            <button
              onClick={handleAction}
              className="w-full py-4 rounded-xl font-bold text-white text-base transition-all active:scale-95"
              style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', opacity: amount ? 1 : 0.5 }}
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
