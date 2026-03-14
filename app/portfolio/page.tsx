'use client';

import TabBar from '@/components/TabBar';

const POSITIONS = [
  {
    id: 1,
    pair: 'BTC/USDT',
    direction: 'LONG' as const,
    leverage: 10,
    pnl: 1247.80,
    pnlPct: 19.4,
    entryPrice: 64250,
    currentPrice: 76750,
    positionSize: '0.5 BTC',
    portfolioPct: 15,
  },
  {
    id: 2,
    pair: 'ETH/USDT',
    direction: 'LONG' as const,
    leverage: 5,
    pnl: 520.00,
    pnlPct: 7.6,
    entryPrice: 3420,
    currentPrice: 3680,
    positionSize: '2.0 ETH',
    portfolioPct: 12,
  },
  {
    id: 3,
    pair: 'SOL/USDT',
    direction: 'SHORT' as const,
    leverage: 3,
    pnl: -85.50,
    pnlPct: -4.0,
    entryPrice: 142.50,
    currentPrice: 148.20,
    positionSize: '15 SOL',
    portfolioPct: 8,
  },
];

function formatPrice(n: number) {
  if (n >= 1000) return n.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  return n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function PortfolioPage() {
  const totalValue = 12847.50;
  const totalPnl = 2847.30;
  const totalPnlPct = 28.5;

  return (
    <div className="fixed inset-0 bg-black flex justify-center">
      <div className="relative w-full max-w-[430px] h-full flex flex-col">

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="px-5 pt-12 pb-6 space-y-5">

            {/* Portfolio value header */}
            <div className="text-center pt-2">
              <p className="text-white/50 text-xs font-medium uppercase tracking-widest mb-1">Open Positions Value</p>
              <p className="text-white text-4xl font-bold tracking-tight">
                ${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
              <p className="text-green text-base font-semibold mt-1">
                +${totalPnl.toLocaleString('en-US', { minimumFractionDigits: 2 })} (+{totalPnlPct}%)
              </p>
              <p className="text-white/40 text-xs mt-1">Last updated: 2 min ago</p>

              {/* Cash available */}
              <div className="inline-flex items-center gap-2 mt-3 px-4 py-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2">
                  <rect x="2" y="5" width="20" height="14" rx="2"/>
                  <line x1="2" y1="10" x2="22" y2="10"/>
                </svg>
                <span className="text-white/50 text-xs">Cash available</span>
                <span className="text-white/90 text-xs font-semibold">$4,210.00</span>
              </div>
            </div>

            {/* Position cards */}
            <div className="space-y-4">
              {POSITIONS.map((pos) => {
                const isProfit = pos.pnl >= 0;
                const pnlColor = isProfit ? '#22c55e' : '#ef4444';
                const isLong = pos.direction === 'LONG';

                return (
                  <div
                    key={pos.id}
                    className="rounded-2xl p-4"
                    style={{ background: '#161616', border: '1px solid rgba(255,255,255,0.07)' }}
                  >
                    {/* Card header */}
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-white font-bold text-lg tracking-wide">{pos.pair}</span>
                      <span
                        className="flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full"
                        style={{
                          background: isLong ? 'rgba(34,197,94,0.18)' : 'rgba(239,68,68,0.18)',
                          color: isLong ? '#22c55e' : '#ef4444',
                          border: `1px solid ${isLong ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}`,
                        }}
                      >
                        {isLong ? (
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l8 16H4z"/></svg>
                        ) : (
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M12 22l8-16H4z"/></svg>
                        )}
                        {pos.direction} {pos.leverage}x
                      </span>
                    </div>

                    {/* P&L */}
                    <div className="text-center mb-4">
                      <p className="text-3xl font-bold" style={{ color: pnlColor }}>
                        {isProfit ? '+' : ''}${Math.abs(pos.pnl).toFixed(2)}
                      </p>
                      <p className="text-sm font-semibold mt-0.5" style={{ color: pnlColor }}>
                        {isProfit ? '+' : ''}{pos.pnlPct.toFixed(1)}%
                      </p>
                    </div>

                    {/* Stats grid */}
                    <div className="grid grid-cols-2 gap-y-3 mb-4">
                      <StatCell label="Entry Price" value={`$${formatPrice(pos.entryPrice)}`} />
                      <StatCell label="Current Price" value={`$${formatPrice(pos.currentPrice)}`} />
                      <StatCell label="Position Size" value={pos.positionSize} />
                      <StatCell label="Portfolio %" value={`${pos.portfolioPct}% of portfolio`} />
                    </div>

                    {/* Close button */}
                    <button
                      className="w-full py-3.5 rounded-xl font-bold text-white text-base transition-all active:scale-95"
                      style={{ background: 'linear-gradient(135deg, #e05555, #c03838)' }}
                    >
                      Close Position
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Bottom padding so last card clears the tab bar */}
            <div className="h-4" />
          </div>
        </div>

        {/* Tab bar */}
        <div className="flex-shrink-0 z-50">
          <TabBar activeTab="portfolio" />
        </div>

      </div>
    </div>
  );
}


function StatCell({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-white/40 text-xs mb-0.5">{label}</p>
      <p className="text-white text-sm font-semibold">{value}</p>
    </div>
  );
}
