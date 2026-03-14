import TabBar from '@/components/TabBar';

export default function PortfolioPage() {
  return (
    <div className="fixed inset-0 bg-black flex items-start justify-center">
      <div className="relative w-full max-w-[430px] h-full flex flex-col items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-center px-8">
          <span className="text-4xl">💼</span>
          <h1 className="text-2xl font-bold text-white">Portfolio</h1>
          <p className="text-white/50 text-sm">Track your copied trades and P&L here.</p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 z-50">
          <TabBar activeTab="portfolio" />
        </div>
      </div>
    </div>
  );
}
