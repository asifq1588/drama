import React, { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Drama } from '../types/drama';
import { DramaCard } from './DramaCard';

interface TopRankSectionProps {
  dramas: Drama[];
  onDramaClick: (drama: Drama) => void;
  onViewAll?: () => void;
}

export const TopRankSection: React.FC<TopRankSectionProps> = ({
  dramas,
  onDramaClick,
  onViewAll,
}) => {
  const [activeTab, setActiveTab] = useState<'Daily' | 'Weekly' | 'Monthly'>('Daily');
  const scrollRef = useRef<HTMLDivElement>(null);

  // Sort based on selected timeframe ranking
  const rankedDramas = [...dramas].sort((a, b) => {
    if (activeTab === 'Daily') {
      return (a.topRankDaily || 99) - (b.topRankDaily || 99);
    }
    if (activeTab === 'Weekly') {
      return (a.topRankWeekly || a.topRankDaily || 99) - (b.topRankWeekly || b.topRankDaily || 99);
    }
    return (a.topRankMonthly || a.topRankDaily || 99) - (b.topRankMonthly || b.topRankDaily || 99);
  }).slice(0, 10);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const offset = direction === 'left' ? -380 : 380;
      scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8 relative group/rank">
      {/* Header and Timeframe Filter Tabs (Matching Screenshot 3 & 4) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-4">
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Top Rank
          </h2>

          {/* Daily / Weekly / Monthly Pills */}
          <div className="flex items-center bg-[#161822] p-1 rounded-lg border border-white/5">
            {(['Daily', 'Weekly', 'Monthly'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === tab
                    ? 'bg-[#2a2d3d] text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {onViewAll && (
          <button
            onClick={onViewAll}
            className="text-xs sm:text-sm font-semibold text-slate-400 hover:text-white flex items-center gap-1 transition-colors cursor-pointer self-start sm:self-auto"
          >
            <span>View All</span>
            <ChevronRight className="w-3.5 h-3.5 text-[#ff2a5f]" />
          </button>
        )}
      </div>

      {/* Ranked Carousel */}
      <div className="relative">
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/80 border border-white/10 text-white flex items-center justify-center opacity-0 group-hover/rank:opacity-100 transition-opacity hover:bg-[#ff2a5f] shadow-lg cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div
          ref={scrollRef}
          className="flex items-start gap-4 overflow-x-auto no-scrollbar scroll-smooth py-1"
        >
          {rankedDramas.map((drama, idx) => (
            <DramaCard
              key={drama.id}
              drama={drama}
              variant="rank"
              rankNumber={idx + 1}
              onClick={onDramaClick}
            />
          ))}
        </div>

        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/80 border border-white/10 text-white flex items-center justify-center opacity-0 group-hover/rank:opacity-100 transition-opacity hover:bg-[#ff2a5f] shadow-lg cursor-pointer"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
