'use client';

import { useRef, useEffect, useState } from 'react';
import { TradePost } from '@/types/trade';
import VideoCard from './VideoCard';
import TabBar from './TabBar';

interface VideoFeedProps {
  posts: TradePost[];
}

export default function VideoFeed({ posts }: VideoFeedProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = cardRefs.current.findIndex((r) => r === entry.target);
            if (index !== -1) setActiveIndex(index);
          }
        });
      },
      { threshold: 0.6 }
    );

    cardRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, [posts]);

  return (
    // Full screen black shell, centered mobile column
    <div className="fixed inset-0 bg-black flex justify-center">
      {/* Mobile column: flex-col so tab bar sits at natural bottom */}
      <div className="relative flex flex-col w-full max-w-[430px] h-full">

        {/* Scrollable feed — takes all remaining space above tab bar */}
        <div
          className="flex-1 overflow-y-scroll snap-y snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {posts.map((post, i) => (
            <VideoCard
              key={post.id}
              post={post}
              isActive={i === activeIndex}
              ref={(el) => { cardRefs.current[i] = el; }}
            />
          ))}
        </div>

        {/* Tab bar always at bottom — outside scroll container */}
        <div className="flex-shrink-0 z-50">
          <TabBar activeTab="home" />
        </div>

      </div>
    </div>
  );
}
