import React, { useState, useEffect } from 'react';
import { Play, Bookmark, Check, Flame, ChevronRight } from 'lucide-react';
import { Drama } from '../types/drama';
import { getCleanImageUrl, DEFAULT_BANNER_FALLBACK, DEFAULT_POSTER_FALLBACK } from '../utils/mediaUrl';

interface HeroSliderProps {
  featuredDramas: Drama[];
  onWatchClick: (drama: Drama) => void;
  bookmarkedIds: string[];
  onToggleBookmark: (dramaId: string) => void;
}

export const HeroSlider: React.FC<HeroSliderProps> = ({
  featuredDramas,
  onWatchClick,
  bookmarkedIds,
  onToggleBookmark,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);

  // Auto rotate carousel every 8 seconds
  useEffect(() => {
    if (featuredDramas.length <= 1) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % featuredDramas.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [featuredDramas.length]);

  if (!featuredDramas.length) return null;

  const currentDrama = featuredDramas[activeIndex] || featuredDramas[0];
  const isBookmarked = bookmarkedIds.includes(currentDrama.id);

  const currentBanner = getCleanImageUrl(currentDrama.banner || currentDrama.poster, DEFAULT_BANNER_FALLBACK);

  return (
    <div className="relative w-full min-h-[520px] md:min-h-[580px] lg:min-h-[640px] flex items-end pb-12 sm:pb-16 overflow-hidden">
      {/* Background Banner with Layered Gradient Overlays */}
      <div className="absolute inset-0 z-0">
        <img
          src={currentBanner}
          alt={currentDrama.title}
          onError={(e) => {
            (e.target as HTMLImageElement).src = DEFAULT_BANNER_FALLBACK;
          }}
          className="w-full h-full object-cover object-center transition-all duration-1000 transform scale-105"
        />
        {/* Cinematic gradient washes matching DashReels */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0c10] via-[#0b0c10]/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0b0c10] via-[#0b0c10]/80 to-transparent max-w-4xl" />
        <div className="absolute inset-0 bg-radial-gradient from-transparent to-[#0b0c10]/60 pointer-events-none" />
      </div>

      {/* Main Content & Bottom-Right Carousel Thumbnails */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
        {/* Left Info Column */}
        <div className="max-w-2xl space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Bengali title highlight if available */}
          {currentDrama.titleBn && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-semibold">
              <Flame className="w-3.5 h-3.5 text-rose-400" />
              <span>{currentDrama.titleBn}</span>
            </div>
          )}

          {/* Main Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1]">
            {currentDrama.title}
          </h1>

          {/* Views, Episodes, Language Row */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-slate-300 font-medium">
            <span className="font-semibold text-rose-400">{currentDrama.views}</span>
            <span className="w-1 h-1 rounded-full bg-slate-500" />
            <span>{currentDrama.totalEpisodes} Episodes</span>
            <span className="w-1 h-1 rounded-full bg-slate-500" />
            <span className="px-2 py-0.5 rounded bg-white/10 text-white font-semibold">
              {currentDrama.language}
            </span>
          </div>

          {/* Description */}
          <p className="text-sm sm:text-base text-slate-300/90 line-clamp-2 sm:line-clamp-3 leading-relaxed max-w-xl font-normal">
            {currentDrama.description}
          </p>

          {/* Genre Pills */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            {currentDrama.genres.map((genre) => (
              <span
                key={genre}
                className="px-3 py-1 rounded-md text-xs font-medium bg-white/5 border border-white/10 text-slate-200"
              >
                {genre}
              </span>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={() => onWatchClick(currentDrama)}
              className="inline-flex items-center justify-center gap-2.5 px-7 py-3 rounded-full bg-gradient-to-r from-[#ff2a5f] to-[#e11d48] hover:from-[#ff1a53] hover:to-[#be123c] text-white font-bold text-sm sm:text-base shadow-lg shadow-[#ff2a5f]/40 hover:shadow-xl hover:shadow-[#ff2a5f]/50 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Watch Now</span>
            </button>

            <button
              onClick={() => onToggleBookmark(currentDrama.id)}
              className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                isBookmarked
                  ? 'bg-rose-500/20 border-rose-500/50 text-rose-400'
                  : 'bg-white/10 border-white/10 hover:bg-white/20 text-white'
              }`}
              title={isBookmarked ? 'Remove from My List' : 'Add to My List'}
            >
              {isBookmarked ? <Check className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Right Thumbnail Carousel Switcher (Matching Screenshots 1 & 2) */}
        <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar py-2 shrink-0">
          {featuredDramas.slice(0, 5).map((drama, idx) => {
            const isActive = idx === activeIndex;
            return (
              <button
                key={drama.id}
                onClick={() => setActiveIndex(idx)}
                className={`relative w-16 sm:w-20 md:w-24 aspect-[16/10] rounded-lg overflow-hidden transition-all duration-300 cursor-pointer shrink-0 ${
                  isActive
                    ? 'ring-2 ring-[#ff2a5f] scale-105 shadow-lg shadow-[#ff2a5f]/30'
                    : 'opacity-60 hover:opacity-100 hover:scale-100'
                }`}
              >
                <img
                  src={drama.poster}
                  alt={drama.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/20" />
                {isActive && (
                  <div className="absolute inset-0 border-2 border-[#ff2a5f] rounded-lg" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
