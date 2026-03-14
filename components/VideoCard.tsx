'use client';

import { forwardRef, useState, useCallback, useRef, useEffect } from 'react';
import { TradePost } from '@/types/trade';
import ChartBackground from './ChartBackground';
import TopBar from './TopBar';
import TradeInfoCard from './TradeInfoCard';
import ActionRail from './ActionRail';
import TraderInfo from './TraderInfo';
import CommentsSheet from './CommentsSheet';

interface VideoCardProps {
  post: TradePost;
  isActive: boolean;
}

const VideoCard = forwardRef<HTMLDivElement, VideoCardProps>(function VideoCard(
  { post, isActive },
  ref
) {
  const [liked, setLiked] = useState(false);
  const [localLikes, setLocalLikes] = useState(post.social.likes);
  const [showLikeAnim, setShowLikeAnim] = useState(false);
  const [showComments, setShowComments] = useState(false);
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

  const handleLike = useCallback(() => {
    setLiked((prev) => {
      const next = !prev;
      setLocalLikes((c) => c + (next ? 1 : -1));
      return next;
    });
  }, []);

  const handleDoubleTap = useCallback(() => {
    // Always like on double-tap (never unlike)
    if (!liked) {
      setLiked(true);
      setLocalLikes((c) => c + 1);
    }
    setShowLikeAnim(true);
    setTimeout(() => setShowLikeAnim(false), 1300);
  }, [liked]);

  return (
    <div
      ref={ref}
      className="snap-start snap-always h-dvh relative overflow-hidden"
      onDoubleClick={handleDoubleTap}
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
      <ActionRail
        social={post.social}
        liked={liked}
        localLikes={localLikes}
        onLike={handleLike}
        onCommentClick={() => setShowComments(true)}
      />
      <TraderInfo trader={post.trader} caption={post.caption} />

      {/* Double-tap like + order placed animation */}
      {showLikeAnim && (
        <div className="absolute inset-0 z-40 pointer-events-none">
          {/* Big heart burst in center */}
          <div className="absolute inset-0 flex items-center justify-center">
            <svg
              width="130"
              height="130"
              viewBox="0 0 24 24"
              fill="#FF1493"
              style={{ animation: 'heartBurst 0.9s ease-out forwards', filter: 'drop-shadow(0 0 20px rgba(255,20,147,0.8))' }}
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </div>

          {/* Order placed pill */}
          <div
            className="absolute bottom-36 left-0 right-0 flex justify-center"
            style={{ animation: 'slideUpFade 1.3s ease-out forwards' }}
          >
            <div
              className="flex items-center gap-2 px-6 py-3 rounded-full text-white font-bold text-base"
              style={{
                background: 'linear-gradient(135deg, #FF1493, #cc0070)',
                boxShadow: '0 4px 24px rgba(255,20,147,0.55)',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Order Placed
            </div>
          </div>
        </div>
      )}

      {/* Comments sheet */}
      <CommentsSheet
        isOpen={showComments}
        onClose={() => setShowComments(false)}
        commentCount={post.social.comments}
      />
    </div>
  );
});

export default VideoCard;
