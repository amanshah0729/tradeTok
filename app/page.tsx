import VideoFeed from '@/components/VideoFeed';
import { MOCK_POSTS } from '@/lib/mockData';

export default function HomePage() {
  return <VideoFeed posts={MOCK_POSTS} />;
}

