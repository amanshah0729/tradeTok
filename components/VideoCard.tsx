'use client';

import { forwardRef, useState, useCallback, useRef, useEffect } from 'react';
import { TradePost } from '@/types/trade';
import ChartBackground from './ChartBackground';
import TopBar from './TopBar';
import TradeInfoCard from './TradeInfoCard';
import ActionRail from './ActionRail';
import TraderInfo from './TraderInfo';

interface VideoCardProps {
  post: TradePost;
  isActive: boolean;
}

const VideoCard = forwardRef<HTMLDivElement, VideoCardProps>(function VideoCard(
  { post, isActive },
  ref
) {
  const [showCopyAnim, setShowCopyAnim] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (isActive) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [isActive]);

  const handleCopy = useCallback(() => {
    console.log('Copying trade:', post.trade);
    setShowCopyAnim(true);
    setTimeout(() => setShowCopyAnim(false), 800);
  }, [post.trade]);

  return (
    <div
      ref={ref}
      // snap-start snap-always replaces .feed-card scroll-snap rules
      // h-dvh = 100dvh, relative + overflow-hidden for absolute children
      className="snap-start snap-always h-dvh relative overflow-hidden"
      onDoubleClick={handleCopy}
    >
      {/* Background layer */}
      {post.videoSrc ? (
        <video
          ref={videoRef}
          src={post.videoSrc}
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
        />
      ) : (
        <ChartBackground
          colorFrom={post.chartColor.from}
          colorTo={post.chartColor.to}
          candleUp={post.chartColor.candleUp}
          candleDown={post.chartColor.candleDown}
          id={post.id}
        />
      )}

      {/* Top gradient scrim */}
      <div
        className="absolute top-0 left-0 right-0 h-32 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.65), transparent)' }}
      />

      {/* Bottom gradient scrim */}
      <div
        className="absolute bottom-0 left-0 right-0 h-64 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.85), transparent)' }}
      />

      <TopBar />
      <TradeInfoCard trade={post.trade} />
      <ActionRail social={post.social} onCopy={handleCopy} />
      <TraderInfo trader={post.trader} caption={post.caption} />

      {showCopyAnim && (
        <div className="absolute inset-0 z-40 pointer-events-none flex items-center justify-center">
          <span className="text-8xl animate-ping">📈</span>
        </div>
      )}
    </div>
  );
});

export default VideoCard;
