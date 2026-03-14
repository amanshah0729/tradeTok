import { TradeDetails } from '@/types/trade';
import { pctChange } from '@/lib/mockData';

interface StatItemProps {
  label: string;
  value: string;
  subValue?: string;
  subColor?: string;
}

function StatItem({ label, value, subValue, subColor }: StatItemProps) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[10px] text-white/40 uppercase tracking-wider font-medium">{label}</span>
      <span className="text-sm font-semibold text-white">{value}</span>
      {subValue && (
        <span className={`text-xs font-medium ${subColor ?? 'text-white/60'}`}>{subValue}</span>
      )}
    </div>
  );
}

interface TradeInfoCardProps {
  trade: TradeDetails;
  realFundingRate?: number | null;
}

export default function TradeInfoCard({ trade, realFundingRate }: TradeInfoCardProps) {
  const isLong = trade.direction === 'LONG';
  const targetPct = pctChange(trade.entry, trade.target);
  const stopPct = pctChange(trade.entry, trade.stopLoss);
  const fundingRate = realFundingRate !== null && realFundingRate !== undefined ? realFundingRate : trade.funding;
  const fundingPositive = fundingRate >= 0;

  return (
    <div className="absolute bottom-20 left-3 right-20 z-20">
      <div className="glass rounded-2xl p-4 flex flex-col gap-3">
        {/* Row 1: Ticker + Direction + Leverage */}
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold text-white">{trade.ticker}</span>
          <span
            className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
              isLong
                ? 'bg-green/20 text-green'
                : 'bg-red/20 text-red'
            }`}
          >
            {isLong ? (
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M5 8V2M2 5l3-3 3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : (
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M5 2v6M2 5l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
            {trade.direction}
          </span>
          <span className="px-2 py-0.5 rounded-full bg-white/10 text-xs font-semibold text-white/80">
            {trade.leverage}x
          </span>
        </div>

        {/* Row 2: Risk pill */}
        <div className="flex items-center">
          <span className="px-3 py-1 rounded-full bg-white/8 text-xs text-white/70 font-medium border border-white/10">
            {trade.risk < 1 ? `$${Math.round(trade.risk * 100)} position` : `Risk: ${trade.risk}% of portfolio`}
          </span>
        </div>

        {/* Row 3: 2×2 stats grid */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
          <StatItem
            label="Entry"
            value={`$${trade.entry.toLocaleString()}`}
          />
          <StatItem
            label="Target"
            value={`$${trade.target.toLocaleString()}`}
            subValue={targetPct}
            subColor="text-green"
          />
          <StatItem
            label="Stop Loss"
            value={`$${trade.stopLoss.toLocaleString()}`}
            subValue={stopPct}
            subColor="text-red"
          />
          <StatItem
            label="Funding"
            value={`${fundingPositive ? '+' : ''}${(fundingRate * 100).toFixed(6)}%`}
            subValue={realFundingRate !== null && realFundingRate !== undefined ? 'Live rate' : undefined}
            subColor={fundingPositive ? 'text-green' : 'text-red'}
          />
        </div>
      </div>
    </div>
  );
}
