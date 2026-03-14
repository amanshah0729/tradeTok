export type TradeDirection = 'LONG' | 'SHORT';

export interface Trader {
  id: string;
  name: string;
  handle: string;
  avatarUrl: string;
  winRate: number;
  followers: number;
}

export interface TradeDetails {
  ticker: string;
  direction: TradeDirection;
  leverage: number;
  risk: number;
  entry: number;
  target: number;
  stopLoss: number;
  funding: number;
}

export interface SocialStats {
  likes: number;
  comments: number;
  shares: number;
  bookmarks: number;
}

export interface TradePost {
  id: string;
  trader: Trader;
  trade: TradeDetails;
  social: SocialStats;
  caption: string;
  chartColor: {
    from: string;
    to: string;
    candleUp: string;
    candleDown: string;
  };
  postedAt: string;
  videoSrc?: string;
}
