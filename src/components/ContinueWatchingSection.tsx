import React from 'react';
import { Play, ChevronRight, History } from 'lucide-react';
import { Drama, ContinueWatchItem } from '../types/drama';
import { DramaCard } from './DramaCard';

interface ContinueWatchingSectionProps {
  items: ContinueWatchItem[];
  allDramas: Drama[];
  onDramaClick: (drama: Drama, initialEpisodeNumber?: number) => void;
  onClearHistory?: () => void;
}

export const ContinueWatchingSection: React.FC<ContinueWatchingSectionProps> = ({
  items,
  allDramas,
  onDramaClick,
}) => {
  if (!items.length) return null;

  const validEntries = items
    .map((item) => {
      const drama = allDramas.find((d) => d.id === item.dramaId);
      return drama ? { item, drama } : null;
    })
    .filter(Boolean) as { item: ContinueWatchItem; drama: Drama }[];

  if (!validEntries.length) return null;

  return (
    <div className="py-4 px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <History className="w-4 h-4 text-rose-400" />
          <span>Continue Watching</span>
        </h2>
        <span className="text-xs sm:text-sm font-semibold text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer">
          View All <ChevronRight className="w-3.5 h-3.5 text-[#ff2a5f]" />
        </span>
      </div>

      <div className="flex items-start gap-3 sm:gap-4 overflow-x-auto no-scrollbar scroll-smooth py-1">
        {validEntries.map(({ item, drama }) => (
          <DramaCard
            key={drama.id}
            drama={drama}
            variant="continueWatch"
            continueEpisodeText={`Ep ${item.episodeNumber} of ${drama.totalEpisodes}`}
            progressPercent={item.progressPercent}
            onClick={() => onDramaClick(drama, item.episodeNumber)}
          />
        ))}
      </div>
    </div>
  );
};
