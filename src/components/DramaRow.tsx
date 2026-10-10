import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Drama } from '../types/drama';
import { DramaCard } from './DramaCard';

interface DramaRowProps {
  title: string;
  subtitle?: string;
  dramas: Drama[];
  variant?: 'standard' | 'rank' | 'comingSoon';
  onDramaClick: (drama: Drama) => void;
  onViewAll?: () => void;
  notifiedIds?: string[];
  onToggleNotify?: (id: string) => void;
}

export const DramaRow: React.FC<DramaRowProps> = ({
  title,
  subtitle,
  dramas,
  variant = 'standard',
  onDramaClick,
  onViewAll,
  notifiedIds = [],
  onToggleNotify,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const offset = direction === 'left' ? -380 : 380;
      scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  if (!dramas.length) return null;

  return (
    <div className="py-4 relative group/row">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 px-4 sm:px-6 lg:px-8">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>{title}</span>
            {subtitle && (
              <span className="text-xs font-normal text-slate-400 hidden sm:inline">
                ({subtitle})
              </span>
            )}
          </h2>
        </div>

        {onViewAll && (
          <button
            onClick={onViewAll}
            className="text-xs sm:text-sm font-semibold text-slate-400 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
          >
            <span>View All</span>
            <ChevronRight className="w-3.5 h-3.5 text-[#ff2a5f]" />
          </button>
        )}
      </div>

      {/* Horizontal Carousel Container */}
      <div className="relative">
        {/* Left Arrow Button */}
        <button
          onClick={() => scroll('left')}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/70 border border-white/10 text-white flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-opacity hover:bg-[#ff2a5f] shadow-lg cursor-pointer"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Scrollable list */}
        <div
          ref={scrollRef}
          className="flex items-start gap-3 sm:gap-4 overflow-x-auto no-scrollbar px-4 sm:px-6 lg:px-8 scroll-smooth py-1"
        >
          {dramas.map((drama, idx) => (
            <DramaCard
              key={drama.id}
              drama={drama}
              variant={variant}
              rankNumber={variant === 'rank' ? idx + 1 : undefined}
              isNotified={notifiedIds.includes(drama.id)}
              onToggleNotify={onToggleNotify}
              onClick={onDramaClick}
            />
          ))}
        </div>

        {/* Right Arrow Button */}
        <button
          onClick={() => scroll('right')}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/70 border border-white/10 text-white flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-opacity hover:bg-[#ff2a5f] shadow-lg cursor-pointer"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
