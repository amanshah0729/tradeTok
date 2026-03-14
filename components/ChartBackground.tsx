interface ChartBackgroundProps {
  colorFrom: string;
  colorTo: string;
  candleUp: string;
  candleDown: string;
  id: string;
}

function lcg(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

export default function ChartBackground({
  colorFrom,
  colorTo,
  candleUp,
  candleDown,
  id,
}: ChartBackgroundProps) {
  const seed = id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const rand = lcg(seed);

  const CANDLE_COUNT = 20;
  const WIDTH = 430;
  const HEIGHT = 932;
  const PADDING_X = 24;
  const CANDLE_WIDTH = 14;
  const SPACING = (WIDTH - PADDING_X * 2) / CANDLE_COUNT;
  const CHART_TOP = HEIGHT * 0.15;
  const CHART_HEIGHT = HEIGHT * 0.55;

  // Generate random price points
  const prices: number[] = [0.5];
  for (let i = 1; i < CANDLE_COUNT + 1; i++) {
    const delta = (rand() - 0.48) * 0.12;
    prices.push(Math.max(0.05, Math.min(0.95, prices[i - 1] + delta)));
  }

  const candles = prices.slice(0, CANDLE_COUNT).map((open, i) => {
    const close = prices[i + 1];
    const high = Math.max(open, close) + rand() * 0.05;
    const low = Math.min(open, close) - rand() * 0.05;
    const isUp = close >= open;

    const x = PADDING_X + i * SPACING + SPACING / 2;
    const toY = (v: number) => CHART_TOP + (1 - v) * CHART_HEIGHT;

    return {
      x,
      bodyTop: toY(Math.max(open, close)),
      bodyBot: toY(Math.min(open, close)),
      wickTop: toY(high),
      wickBot: toY(low),
      isUp,
    };
  });

  const gradId = `bg-grad-${id}`;

  return (
    <svg
      className="absolute inset-0 w-full h-full"
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={colorFrom} />
          <stop offset="100%" stopColor={colorTo} />
        </linearGradient>
      </defs>

      {/* Background */}
      <rect width={WIDTH} height={HEIGHT} fill={`url(#${gradId})`} />

      {/* Grid lines */}
      {[0.25, 0.5, 0.75].map((t) => {
        const y = CHART_TOP + t * CHART_HEIGHT;
        return (
          <line
            key={t}
            x1={PADDING_X}
            y1={y}
            x2={WIDTH - PADDING_X}
            y2={y}
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="1"
          />
        );
      })}

      {/* Candles */}
      {candles.map((c, i) => {
        const color = c.isUp ? candleUp : candleDown;
        const bodyH = Math.max(2, c.bodyBot - c.bodyTop);
        return (
          <g key={i}>
            <line
              x1={c.x}
              y1={c.wickTop}
              x2={c.x}
              y2={c.wickBot}
              stroke={color}
              strokeWidth="1.5"
              opacity="0.7"
            />
            <rect
              x={c.x - CANDLE_WIDTH / 2}
              y={c.bodyTop}
              width={CANDLE_WIDTH}
              height={bodyH}
              fill={color}
              opacity="0.85"
              rx="1"
            />
          </g>
        );
      })}

      {/* Subtle vignette overlay */}
      <rect
        width={WIDTH}
        height={HEIGHT}
        fill="url(#vignette)"
        opacity="0.4"
      />
      <defs>
        <radialGradient id="vignette" cx="50%" cy="50%" r="70%">
          <stop offset="0%" stopColor="transparent" />
          <stop offset="100%" stopColor="black" />
        </radialGradient>
      </defs>
    </svg>
  );
}
