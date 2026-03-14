import { TradePost } from '@/types/trade';

export const MOCK_POSTS: TradePost[] = [
  {
    id: 'post-1',
    trader: {
      id: 'trader-1',
      name: 'CryptoWolf',
      handle: '@cryptowolf',
      avatarUrl: '',
      winRate: 73,
      followers: 48200,
    },
    trade: {
      ticker: 'ETH',
      direction: 'SHORT',
      leverage: 5,
      risk: 2,
      entry: 3420.50,
      target: 3180.00,
      stopLoss: 3520.00,
      funding: -0.012,
    },
    social: {
      likes: 8700,
      comments: 342,
      shares: 1200,
      bookmarks: 890,
    },
    caption: 'ETH rejection at key resistance. Bears taking control — watching for breakdown below $3,300. Tight stop, high reward.',
    chartColor: {
      from: '#0d0008',
      to: '#200015',
      candleUp: '#22c55e',
      candleDown: '#ef4444',
    },
    postedAt: '2h ago',
    videoSrc: '/videos/post-1.MP4',
  },
  {
    id: 'post-2',
    trader: {
      id: 'trader-2',
      name: 'BullRun.eth',
      handle: '@bullrun_eth',
      avatarUrl: '',
      winRate: 81,
      followers: 92400,
    },
    trade: {
      ticker: 'BTC',
      direction: 'LONG',
      leverage: 1, // Updated to 1x leverage
      risk: 0.15, // Updated to reflect $15 USD position (roughly 0.15% of a $10k account)
      entry: 67850.00,
      target: 72400.00,
      stopLoss: 65200.00,
      funding: 0.008,
    },
    social: {
      likes: 21500,
      comments: 876,
      shares: 3400,
      bookmarks: 2100,
    },
    caption: 'BTC weekly close above $67K is the signal we needed. Small $15 position with 1x leverage — perfect for beginners. Next stop $72K.',
    chartColor: {
      from: '#0a1a0a',
      to: '#0a3a1a',
      candleUp: '#4ade80',
      candleDown: '#f87171',
    },
    postedAt: '5h ago',
    videoSrc: '/videos/post-2.MP4',
  },
  {
    id: 'post-3',
    trader: {
      id: 'trader-3',
      name: 'SolanaQueen',
      handle: '@solqueen',
      avatarUrl: '',
      winRate: 68,
      followers: 31600,
    },
    trade: {
      ticker: 'SOL',
      direction: 'LONG',
      leverage: 10,
      risk: 3,
      entry: 182.40,
      target: 210.00,
      stopLoss: 168.00,
      funding: 0.021,
    },
    social: {
      likes: 5300,
      comments: 214,
      shares: 780,
      bookmarks: 430,
    },
    caption: 'SOL breaking out of a 3-week consolidation. Volume spike + network activity up 40%. This is the move. 10x leverage but tight risk.',
    chartColor: {
      from: '#12071a',
      to: '#2a0a3a',
      candleUp: '#a78bfa',
      candleDown: '#f472b6',
    },
    postedAt: '1d ago',
    videoSrc: '/videos/post-3.mp4',
  },
];

export function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

export function pctChange(from: number, to: number): string {
  const pct = ((to - from) / from) * 100;
  return (pct >= 0 ? '+' : '') + pct.toFixed(1) + '%';
}
