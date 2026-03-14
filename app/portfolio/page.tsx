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

// How far current is between entry and a ±30% range, clamped 5–95%
function priceProgress(entry: number, current: number, isLong: boolean): number {
  const range = entry * 0.3;
  const delta = current - entry;
  const pct = isLong ? (delta / range) : (-delta / range);
  return Math.min(95, Math.max(5, 50 + pct * 50));
}

export default function PortfolioPage() {
  const totalValue   = 12847.50;
  const totalPnl     = 2847.30;
  const totalPnlPct  = 28.5;

  return (
    <div className="fixed inset-0 bg-black flex justify-center">
      <div className="relative w-full max-w-[430px] h-full flex flex-col">

        <div className="flex-1 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="px-5 pt-12 pb-6 space-y-4">

            {/* Header */}
            <div className="pt-2 space-y-1">
              <p className="text-white/40 text-xs uppercase tracking-widest">Open Positions</p>
              <div className="flex items-baseline justify-between">
                <p className="text-white text-3xl font-bold tracking-tight">
                  ${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </p>
                <span className="text-xs font-semibold px-2 py-1 rounded-full"
                  style={{ background: 'rgba(34,197,94,0.12)', color: '#4ade80' }}>
                  +{totalPnlPct}% · +${totalPnl.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex items-center gap-1.5 pt-0.5">
                <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
                <span className="text-white/40 text-xs">$4,210.00 cash available</span>
              </div>
            </div>

            {/* Position cards */}
            <div className="space-y-3">
              {POSITIONS.map((pos) => {
                const isProfit = pos.pnl >= 0;
                const isLong   = pos.direction === 'LONG';
                const progress = priceProgress(pos.entryPrice, pos.currentPrice, isLong);
                const pnlColor = isProfit ? '#4ade80' : '#f87171';
                const dirColor = isLong   ? '#4ade80' : '#f87171';

                return (
                  <div key={pos.id} className="rounded-2xl p-4 space-y-3"
                    style={{ background: '#111', border: '1px solid rgba(255,255,255,0.06)' }}>

                    {/* Row 1: pair + P&L */}
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-white font-semibold text-base leading-tight">{pos.pair}</p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded"
                            style={{ background: isLong ? 'rgba(74,222,128,0.1)' : 'rgba(248,113,113,0.1)', color: dirColor }}>
                            {pos.direction}
                          </span>
                          <span className="text-white/30 text-[10px]">{pos.leverage}x leverage</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-sm" style={{ color: pnlColor }}>
                          {isProfit ? '+' : '−'}${Math.abs(pos.pnl).toFixed(2)}
                        </p>
                        <p className="text-white/40 text-xs mt-0.5">
                          {isProfit ? '+' : ''}{pos.pnlPct.toFixed(1)}%
                        </p>
                      </div>
                    </div>

                    {/* Row 2: price progress bar */}
                    <div>
                      <div className="h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.07)' }}>
                        <div className="h-full rounded-full transition-all"
                          style={{ width: `${progress}%`, background: isProfit ? '#4ade80' : '#f87171', opacity: 0.7 }} />
                      </div>
                      <div className="flex justify-between mt-1.5">
                        <div>
                          <p className="text-white/30 text-[10px]">Entry</p>
                          <p className="text-white/70 text-xs font-medium">${formatPrice(pos.entryPrice)}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-white/30 text-[10px]">Current</p>
                          <p className="text-white text-xs font-semibold">${formatPrice(pos.currentPrice)}</p>
                        </div>
                      </div>
                    </div>

                    {/* Row 3: size + portfolio % + close */}
                    <div className="flex items-center justify-between pt-1"
                      style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                      <div className="flex gap-4">
                        <div>
                          <p className="text-white/30 text-[10px]">Size</p>
                          <p className="text-white/80 text-xs font-medium">{pos.positionSize}</p>
                        </div>
                        <div>
                          <p className="text-white/30 text-[10px]">Portfolio</p>
                          <p className="text-white/80 text-xs font-medium">{pos.portfolioPct}%</p>
                        </div>
                      </div>
                      <button className="text-xs font-semibold px-3 py-1.5 rounded-lg transition-all active:scale-95"
                        style={{ background: 'rgba(248,113,113,0.1)', color: '#f87171', border: '1px solid rgba(248,113,113,0.2)' }}>
                        Close
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>

            <div className="h-4" />
          </div>
        </div>

        <div className="flex-shrink-0 z-50">
          <TabBar activeTab="portfolio" />
        </div>

      </div>
    </div>
  );
}
