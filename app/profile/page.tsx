'use client';

import { useState, useEffect } from 'react';
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

interface BalanceData {
  equity: number;
  available_balance: number;
  margin_used: number;
  margin_utilization_percent: number;
}

interface PositionsData {
  positions: any[];
  total_pnl: number;
  count: number;
}

export default function ProfilePage() {
  const [modal, setModal] = useState<ModalType>(null);
  const [amount, setAmount] = useState('');
  const [balance, setBalance] = useState<BalanceData | null>(null);
  const [positions, setPositions] = useState<PositionsData | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch balance and positions from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch balance and positions concurrently
        const [balanceResponse, positionsResponse] = await Promise.all([
          fetch('http://localhost:8000/api/balance'),
          fetch('http://localhost:8000/api/positions')
        ]);
        
        const balanceData = await balanceResponse.json();
        const positionsData = await positionsResponse.json();
        
        if (balanceData.success) {
          setBalance(balanceData.data);
        }
        
        if (positionsData.success) {
          setPositions(positionsData.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        // Fallback to mock data if API is not available
        setBalance({
          equity: 17057.50,
          available_balance: 4210.00,
          margin_used: 12847.50,
          margin_utilization_percent: 75
        });
        setPositions({
          positions: [],
          total_pnl: 2847.30,
          count: 0
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    // Refresh data every 30 seconds
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  // Use API data or show placeholders during loading
  const totalBalance = loading ? 0 : (balance?.equity || 0);
  const deployed = loading ? 0 : (balance?.margin_used || 0);
  const available = loading ? 0 : (balance?.available_balance || 0);
  const totalPnl = loading ? 0 : (positions?.total_pnl || 0);
  const deployedPct = loading ? 0 : (balance?.margin_utilization_percent || 0);

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
                  <div className="flex items-center gap-2">
                    <p className="text-white/40 text-[10px] uppercase tracking-widest">Balance</p>
                    {loading && (
                      <div className="w-3 h-3 border border-white/20 border-t-white/60 rounded-full animate-spin"></div>
                    )}
                  </div>
                  <p className="text-white font-bold text-lg leading-tight">
                    {loading ? (
                      <span className="text-white/30">$0.00</span>
                    ) : (
                      `$${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}`
                    )}
                  </p>
                </div>
                <div className="text-right">
                  {loading ? (
                    <div className="space-y-1">
                      <div className="w-16 h-3 bg-white/10 rounded animate-pulse"></div>
                      <div className="w-12 h-2 bg-white/10 rounded animate-pulse"></div>
                    </div>
                  ) : (
                    <>
                      <p className={`text-xs font-semibold ${totalPnl >= 0 ? 'text-green' : 'text-red'}`}>
                        {totalPnl >= 0 ? '+' : ''}${totalPnl.toFixed(2)}
                      </p>
                      <p className="text-white/50 text-[10px]">
                        {balance && positions ? 'Live P&L' : 'Demo data'}
                      </p>
                    </>
                  )}
                </div>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                <div 
                  className="h-full rounded-full transition-all duration-500" 
                  style={{ 
                    width: loading ? '0%' : `${deployedPct}%`, 
                    background: 'linear-gradient(90deg, #FF1493, #cc0070)' 
                  }} 
                />
              </div>
              <div className="flex justify-between text-[10px] text-white/40">
                <span>
                  {loading ? (
                    <div className="w-20 h-2 bg-white/10 rounded animate-pulse inline-block"></div>
                  ) : (
                    `$${deployed.toLocaleString('en-US', { minimumFractionDigits: 2 })} deployed (${Math.round(deployedPct)}%)`
                  )}
                </span>
                <span>
                  {loading ? (
                    <div className="w-16 h-2 bg-white/10 rounded animate-pulse inline-block"></div>
                  ) : (
                    `$${available.toLocaleString('en-US', { minimumFractionDigits: 2 })} free`
                  )}
                </span>
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
              {modal === 'deposit' ? 'Send USDC to your trading account' : 'Move funds back to your bank.'}
            </p>

            {modal === 'deposit' ? (
              <CryptoDepositContent />
            ) : (
              <WithdrawContent available={available} amount={amount} setAmount={setAmount} handleAction={handleAction} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function CryptoDepositContent() {
  const [copied, setCopied] = useState(false);
  const WALLET_ADDRESS = '0xd467b4a02644f40d9ae2f018117f0356acfb5e3';

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(WALLET_ADDRESS);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy address:', err);
    }
  };

  return (
    <div className="space-y-4">
      {/* Token & Chain Info */}
      <div 
        className="rounded-xl p-3"
        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-xs">💵</div>
            <div>
              <p className="text-white text-sm font-bold">USDC</p>
              <p className="text-white/50 text-xs">Ethereum</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-white/60 text-xs">Network</p>
            <p className="text-white text-xs font-medium">ERC-20</p>
          </div>
        </div>
      </div>

      {/* Wallet Address */}
      <div className="text-center space-y-3">
        <p className="text-white/60 text-sm">Deposit Address</p>
        
        <div 
          className="p-3 rounded-xl"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
        >
          <p className="text-white text-xs font-mono break-all leading-relaxed">
            {WALLET_ADDRESS}
          </p>
        </div>
        
        {/* Copy Button */}
        <button
          onClick={handleCopyAddress}
          className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl font-medium text-white transition-all active:scale-95"
          style={{ background: copied ? '#22c55e' : '#FF1493' }}
        >
          {copied ? (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span className="text-sm">Copied!</span>
            </>
          ) : (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
              </svg>
              <span className="text-sm">Copy Address</span>
            </>
          )}
        </button>
      </div>

      {/* Quick Info */}
      <div className="flex items-center gap-2 p-3 rounded-xl" style={{ background: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.2)' }}>
        <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
          <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <p className="text-green-400 text-xs">Instant deposit • Min $50 • USDC only</p>
      </div>
    </div>
  );
}

function WithdrawContent({ available, amount, setAmount, handleAction }: { 
  available: number; 
  amount: string; 
  setAmount: (amount: string) => void; 
  handleAction: () => void; 
}) {
  return (
    <>
      <div className="flex justify-between items-center rounded-xl px-4 py-3 mb-4"
        style={{ background: 'rgba(255,255,255,0.05)' }}>
        <span className="text-white/50 text-sm">Available to withdraw</span>
        <span className="text-white font-semibold text-sm">
          ${available.toLocaleString('en-US', { minimumFractionDigits: 2 })}
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
          onClick={() => setAmount(available.toFixed(2))}
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
        Withdraw Funds
      </button>
    </>
  );
}
