import React, { useState } from 'react';
import { Play, Bell, Check } from 'lucide-react';
import { Drama } from '../types/drama';
import { getCleanImageUrl, DEFAULT_POSTER_FALLBACK } from '../utils/mediaUrl';

interface DramaCardProps {
  drama: Drama;
  variant?: 'standard' | 'rank' | 'comingSoon' | 'continueWatch';
  rankNumber?: number;
  continueEpisodeText?: string;
  progressPercent?: number;
  isNotified?: boolean;
  onToggleNotify?: (dramaId: string) => void;
  onClick: (drama: Drama) => void;
}

export const DramaCard: React.FC<DramaCardProps> = ({
  drama,
  variant = 'standard',
  rankNumber,
  continueEpisodeText,
  progressPercent = 0,
  isNotified = false,
  onToggleNotify,
  onClick,
}) => {
  const [imgSrc, setImgSrc] = useState(getCleanImageUrl(drama.poster));

  const handleImgError = () => {
    if (imgSrc !== DEFAULT_POSTER_FALLBACK) {
      setImgSrc(DEFAULT_POSTER_FALLBACK);
    }
  };

  if (variant === 'continueWatch') {
    return (
      <div
        onClick={() => onClick(drama)}
        className="group relative flex-shrink-0 w-36 sm:w-44 md:w-52 cursor-pointer transition-transform duration-300 hover:-translate-y-1"
      >
        <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden bg-[#161822] shadow-md border border-white/5 group-hover:border-[#ff2a5f]/40">
          <img
            src={imgSrc}
            alt={drama.title}
            onError={handleImgError}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />

          {/* Episode Badge */}
          <div className="absolute bottom-2.5 left-2.5 right-2.5">
            <span className="text-[11px] font-bold text-rose-400">
              {continueEpisodeText || 'Resume'}
            </span>
            {/* Progress bar */}
            <div className="w-full h-1 bg-white/20 rounded-full mt-1.5 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#ff2a5f] to-rose-400 rounded-full"
                style={{ width: `${Math.max(15, progressPercent)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Title */}
        <h3 className="mt-2 text-xs sm:text-sm font-semibold text-slate-100 line-clamp-1 group-hover:text-[#ff2a5f] transition-colors">
          {drama.title}
        </h3>
      </div>
    );
  }

  if (variant === 'comingSoon') {
    return (
      <div className="flex-shrink-0 w-36 sm:w-44 md:w-48 group">
        {/* Release Date Header */}
        <div className="text-xs font-bold text-slate-400 mb-2 px-1">
          {drama.releaseDate || 'Coming Soon'}
        </div>

        <div
          onClick={() => onClick(drama)}
          className="relative aspect-[3/4.2] w-full rounded-xl overflow-hidden bg-[#161822] shadow-md border border-white/5 cursor-pointer group-hover:border-[#ff2a5f]/40 transition-transform duration-300 group-hover:-translate-y-1"
        >
          <img
            src={imgSrc}
            alt={drama.title}
            onError={handleImgError}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <div className="w-10 h-10 rounded-full bg-[#ff2a5f] flex items-center justify-center shadow-lg">
              <Play className="w-5 h-5 text-white fill-white ml-0.5" />
            </div>
          </div>
        </div>

        {/* Title */}
        <h3 className="mt-2 text-xs sm:text-sm font-semibold text-slate-100 line-clamp-1">
          {drama.title}
        </h3>

        {/* Notify Me Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleNotify?.(drama.id);
          }}
          className={`mt-2.5 w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
            isNotified
              ? 'bg-[#ff2a5f]/20 border-[#ff2a5f] text-rose-300'
              : 'border-[#ff2a5f]/60 text-rose-400 hover:bg-[#ff2a5f] hover:text-white'
          }`}
        >
          {isNotified ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>Notified</span>
            </>
          ) : (
            <>
              <Bell className="w-3.5 h-3.5" />
              <span>Notify Me</span>
            </>
          )}
        </button>
      </div>
    );
  }

  if (variant === 'rank') {
    return (
      <div
        onClick={() => onClick(drama)}
        className="group flex-shrink-0 w-40 sm:w-48 md:w-52 cursor-pointer transition-transform duration-300 hover:-translate-y-1"
      >
        <div className="relative aspect-[3/4.2] w-full rounded-xl overflow-hidden bg-[#161822] shadow-lg border border-white/5 group-hover:border-[#ff2a5f]/40">
          <img
            src={imgSrc}
            alt={drama.title}
            onError={handleImgError}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />

          {/* Top-Left Play Views Count Badge */}
          <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-md text-[10px] sm:text-xs font-semibold text-white flex items-center gap-1 border border-white/10">
            <Play className="w-2.5 h-2.5 fill-white" />
            <span>{drama.views.replace(' Views', '')}</span>
          </div>

          {/* Giant 3D Rank Number on bottom left */}
          {rankNumber !== undefined && (
            <div className="absolute bottom-1 left-2 pointer-events-none drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">
              <span className="text-4xl sm:text-5xl md:text-6xl font-black italic tracking-tighter text-white/90 bg-gradient-to-t from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                {rankNumber}
              </span>
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <div className="w-11 h-11 rounded-full bg-[#ff2a5f] flex items-center justify-center shadow-lg shadow-[#ff2a5f]/40">
              <Play className="w-5 h-5 text-white fill-white ml-0.5" />
            </div>
          </div>
        </div>

        {/* Title */}
        <h3 className="mt-2 text-xs sm:text-sm font-semibold text-slate-100 line-clamp-1 group-hover:text-[#ff2a5f] transition-colors">
          {drama.title}
        </h3>
        {drama.titleBn && (
          <p className="text-[11px] text-slate-400 line-clamp-1">
            {drama.titleBn}
          </p>
        )}
      </div>
    );
  }

  // Standard Card
  return (
    <div
      onClick={() => onClick(drama)}
      className="group flex-shrink-0 w-36 sm:w-44 md:w-48 cursor-pointer transition-transform duration-300 hover:-translate-y-1.5"
    >
      <div className="relative aspect-[3/4.2] w-full rounded-xl overflow-hidden bg-[#161822] shadow-md border border-white/5 group-hover:border-[#ff2a5f]/40 transition-colors">
        <img
          src={imgSrc}
          alt={drama.title}
          onError={handleImgError}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Play Views Badge top-left */}
        <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-md text-[10px] sm:text-xs font-semibold text-white flex items-center gap-1 border border-white/10">
          <Play className="w-2.5 h-2.5 fill-white" />
          <span>{drama.views.replace(' Views', '')}</span>
        </div>

        {/* Hover Play Glow */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="w-10 h-10 rounded-full bg-[#ff2a5f] flex items-center justify-center shadow-lg shadow-[#ff2a5f]/50 transform scale-90 group-hover:scale-100 transition-transform">
            <Play className="w-4 h-4 text-white fill-white ml-0.5" />
          </div>
        </div>
      </div>

      <h3 className="mt-2 text-xs sm:text-sm font-semibold text-slate-100 line-clamp-1 group-hover:text-[#ff2a5f] transition-colors">
        {drama.title}
      </h3>
      {drama.titleBn && (
        <p className="text-[11px] text-slate-400 line-clamp-1">
          {drama.titleBn}
        </p>
      )}
    </div>
  );
};
