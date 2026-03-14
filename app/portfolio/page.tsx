'use client';

import { useState, useEffect } from 'react';
import TabBar from '@/components/TabBar';

interface Position {
  id: string;
  pair: string;
  direction: 'LONG' | 'SHORT';
  leverage: number;
  pnl: number;
  pnlPct: number;
  entryPrice: number;
  currentPrice: number;
  positionSize: string;
  portfolioPct: number;
  size: number;
  symbol: string; // Add symbol for API calls
}

interface Balance {
  equity: number;
  available_balance: number;
  margin_used: number;
  margin_utilization_percent: number;
}

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
  const [positions, setPositions] = useState<Position[]>([]);
  const [balance, setBalance] = useState<Balance | null>(null);
  const [loading, setLoading] = useState(true);
  const [closingPosition, setClosingPosition] = useState<string | null>(null);

  // Fetch balance and positions from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch balance and positions concurrently
        const [balanceRes, positionsRes] = await Promise.all([
          fetch('http://localhost:8000/api/balance'),
          fetch('http://localhost:8000/api/positions')
        ]);

        if (balanceRes.ok) {
          const balanceData = await balanceRes.json();
          if (balanceData.success) {
            setBalance(balanceData.data);
          }
        }

        if (positionsRes.ok) {
          const positionsData = await positionsRes.json();
          if (positionsData.success && positionsData.data.positions && positionsData.data.positions.length > 0) {
            // Transform API data to match our Position interface
            const transformedPositions: Position[] = positionsData.data.positions.map((pos: any, index: number) => {
              const size = Math.abs(parseFloat(pos.size));
              const isLong = pos.side === 'long';
              const entryPrice = parseFloat(pos.entry_price);
              const currentPrice = parseFloat(pos.current_price);
              const pnl = parseFloat(pos.pnl || 0);
              const pnlPct = parseFloat(pos.pnl_percentage || 0);
              
              return {
                id: `${pos.symbol}-${index}`,
                pair: pos.symbol.replace('-PERP', '/USDT'),
                direction: isLong ? 'LONG' : 'SHORT',
                leverage: 1, // Default leverage (API doesn't provide this)
                pnl: pnl,
                pnlPct: pnlPct,
                entryPrice: entryPrice,
                currentPrice: currentPrice || entryPrice, // Fallback to entry if no current price
                positionSize: `${size.toFixed(4)} ${pos.symbol.split('-')[0]}`,
                portfolioPct: Math.min(25, Math.max(5, Math.abs(pnl / 100))), // Estimated portfolio %
                size: size,
                symbol: pos.symbol // Add original symbol for API calls
              };
            });
            setPositions(transformedPositions);
          } else {
            setPositions([]); // No positions
          }
        }
      } catch (error) {
        console.error('Failed to fetch portfolio data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    
    // Refresh data every 30 seconds
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  // Close position handler
  const handleClosePosition = async (positionId: string, symbol: string) => {
    if (!confirm(`Are you sure you want to close your ${symbol.replace('-PERP', '')} position?`)) {
      return;
    }

    try {
      setClosingPosition(positionId);
      
      const response = await fetch('http://localhost:8000/api/close-position', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          symbol: symbol,
          size: null // Close full position
        })
      });

      const result = await response.json();
      
      if (result.success) {
        console.log('✅ Position closed successfully:', result.data);
        
        // Remove the position from the UI immediately for better UX
        setPositions(prev => prev.filter(pos => pos.id !== positionId));
        
        // Refresh data after a short delay to get updated balance
        setTimeout(() => {
          window.location.reload(); // Simple refresh to get latest data
        }, 1500);
        
      } else {
        console.error('❌ Failed to close position:', result.error || result);
        alert('Failed to close position: ' + (result.detail || result.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('❌ Error closing position:', error);
      alert('Error closing position. Please try again.');
    } finally {
      setClosingPosition(null);
    }
  };

  // Calculate totals
  const totalPnl = positions.reduce((sum, pos) => sum + pos.pnl, 0);
  const totalValue = balance?.equity || 0;
  const totalPnlPct = totalValue > 0 ? (totalPnl / totalValue) * 100 : 0;

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
                  {loading ? (
                    <span className="text-white/50">Loading...</span>
                  ) : (
                    `$${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}`
                  )}
                </p>
                {!loading && (
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                    totalPnl >= 0 
                      ? 'text-green-400' 
                      : 'text-red-400'
                  }`}
                  style={{ 
                    background: totalPnl >= 0 
                      ? 'rgba(34,197,94,0.12)' 
                      : 'rgba(248,113,113,0.12)' 
                  }}>
                    {totalPnl >= 0 ? '+' : ''}{totalPnlPct.toFixed(1)}% · {totalPnl >= 0 ? '+' : ''}${Math.abs(totalPnl).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1.5 pt-0.5">
                <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
                <span className="text-white/40 text-xs">
                  ${loading ? '...' : (balance?.available_balance || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })} cash available
                </span>
              </div>
            </div>

            {/* Position cards */}
            <div className="space-y-3">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="text-white/50 text-sm">Loading positions...</div>
                </div>
              ) : positions.length === 0 ? (
                <div className="rounded-2xl p-6 text-center" style={{ background: '#111', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <p className="text-white/60 text-sm">No open positions</p>
                  <p className="text-white/40 text-xs mt-1">Start trading to see your positions here</p>
                </div>
              ) : (
                positions.map((pos) => {
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
                      <button 
                        onClick={() => handleClosePosition(pos.id, pos.symbol)}
                        disabled={closingPosition === pos.id}
                        className="text-xs font-semibold px-3 py-1.5 rounded-lg transition-all active:scale-95 disabled:opacity-50"
                        style={{ background: 'rgba(248,113,113,0.1)', color: '#f87171', border: '1px solid rgba(248,113,113,0.2)' }}
                      >
                        {closingPosition === pos.id ? (
                          <span className="flex items-center gap-1">
                            <div className="w-3 h-3 border border-red-400/30 border-t-red-400 rounded-full animate-spin" />
                            Closing...
                          </span>
                        ) : (
                          'Close'
                        )}
                      </button>
                    </div>

                  </div>
                );
              })
              )}
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
