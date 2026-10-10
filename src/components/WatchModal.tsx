import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  SkipForward,
  SkipBack,
  Bookmark,
  Check,
  Share2,
  Lock,
  Unlock,
  Smartphone,
  Tv,
  Search,
  Code,
  Flame,
  Sparkles,
  Crown,
  ExternalLink
} from 'lucide-react';
import { Drama, Episode, AppLanguage, getEpisodeAccessType } from '../types/drama';
import { saveContinueWatchProgress } from '../services/firebaseService';
import { getStoredMonetagConfig, triggerMonetagDirectLink } from '../services/monetagService';
import { TRANSLATIONS } from '../services/i18n';

interface WatchModalProps {
  drama: Drama;
  initialEpisodeNumber?: number;
  onClose: () => void;
  isBookmarked: boolean;
  onToggleBookmark: (dramaId: string) => void;
  onOpenBloggerCode?: (drama: Drama) => void;
  appLanguage: AppLanguage;
  isVIP?: boolean;
  onOpenSubscriptionModal?: () => void;
}

export const WatchModal: React.FC<WatchModalProps> = ({
  drama,
  initialEpisodeNumber = 1,
  onClose,
  isBookmarked,
  onToggleBookmark,
  onOpenBloggerCode,
  appLanguage,
  isVIP = false,
  onOpenSubscriptionModal,
}) => {
  const t = TRANSLATIONS[appLanguage];
  const monetagConfig = getStoredMonetagConfig();

  const [currentEpNum, setCurrentEpNum] = useState(initialEpisodeNumber);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [playerMode, setPlayerMode] = useState<'vertical' | 'cinema'>('vertical');
  const [searchEpisodeQuery, setSearchEpisodeQuery] = useState('');
  const [copiedShare, setCopiedShare] = useState(false);

  // Unlocked episodes stored locally per drama
  const [unlockedEps, setUnlockedEps] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem(`free_drama_unlocked_eps_${drama.id}`);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isUnlocking, setIsUnlocking] = useState(false);

  // Monetag Interstitial / Episode Ad State (suppressed if user is VIP)
  const [showAdOverlay, setShowAdOverlay] = useState<boolean>(!isVIP && monetagConfig.enabled && monetagConfig.showAdOnEpisodeChange);
  const [adCountdown, setAdCountdown] = useState<number>(monetagConfig.adCountdownSeconds || 5);

  const videoRef = useRef<HTMLVideoElement>(null);

  const episodes: Episode[] = drama.episodes.length > 0 ? drama.episodes : [
    {
      id: `${drama.id}-demo`,
      episodeNumber: 1,
      title: 'Episode 1: The Beginning',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      videoType: 'mp4' as const,
      duration: '1:45',
      isLocked: false,
      accessType: 'free',
      views: drama.views
    }
  ];

  const currentEpisode: Episode = episodes.find(e => e.episodeNumber === currentEpNum) || episodes[0];
  const currentAccessType = getEpisodeAccessType(currentEpisode);
  const isAdUnlocked = unlockedEps.includes(currentEpNum);

  // An episode is locked if:
  // - user is NOT VIP AND
  // - either it's premium OR (it's ad-locked and user hasn't unlocked it yet)
  const isCurrentEpLocked = !isVIP && (
    currentAccessType === 'premium' ||
    (currentAccessType === 'ad' && !isAdUnlocked)
  );

  // Ad Countdown Timer for Interstitial
  useEffect(() => {
    let timer: any = null;
    if (showAdOverlay && !isVIP && monetagConfig.enabled) {
      if (adCountdown > 0) {
        timer = setTimeout(() => {
          setAdCountdown(prev => prev - 1);
        }, 1000);
      }
    }
    return () => clearTimeout(timer);
  }, [showAdOverlay, adCountdown, monetagConfig.enabled, isVIP]);

  // When episode changes
  const changeEpisodeWithAd = (newEpNum: number) => {
    setCurrentEpNum(newEpNum);
    const targetEp = episodes.find(e => e.episodeNumber === newEpNum) || episodes[0];
    const targetAccess = getEpisodeAccessType(targetEp);

    if (!isVIP && monetagConfig.enabled && monetagConfig.showAdOnEpisodeChange && targetAccess === 'free') {
      setShowAdOverlay(true);
      setAdCountdown(monetagConfig.adCountdownSeconds || 5);
      triggerMonetagDirectLink(monetagConfig);
    } else {
      setShowAdOverlay(false);
    }
  };

  // Keyboard navigation & space to toggle play
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === ' ' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        e.preventDefault();
        togglePlay();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying]);

  // Video progress and save history
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const cur = videoRef.current.currentTime;
      const dur = videoRef.current.duration || 100;
      setCurrentTime(cur);
      setDuration(dur);

      const percent = Math.min(100, Math.round((cur / dur) * 100));
      saveContinueWatchProgress(drama.id, currentEpisode.id, currentEpNum, percent);
    }
  };

  const handleVideoEnded = () => {
    if (currentEpNum < episodes.length) {
      changeEpisodeWithAd(currentEpNum + 1);
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = val;
      setCurrentTime(val);
    }
  };

  const handleSpeedChange = () => {
    const speeds = [1, 1.25, 1.5, 2];
    const nextIdx = (speeds.indexOf(playbackSpeed) + 1) % speeds.length;
    const next = speeds[nextIdx];
    setPlaybackSpeed(next);
    if (videoRef.current) {
      videoRef.current.playbackRate = next;
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      videoRef.current?.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  };

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard?.writeText(url);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2000);
  };

  const handleUnlockWithAd = (epNum: number) => {
    setIsUnlocking(true);
    // 1. Trigger Monetag ad / direct link
    triggerMonetagDirectLink(monetagConfig);

    // 2. Animated verification & unlock
    setTimeout(() => {
      setUnlockedEps(prev => {
        const next = prev.includes(epNum) ? prev : [...prev, epNum];
        try {
          localStorage.setItem(`free_drama_unlocked_eps_${drama.id}`, JSON.stringify(next));
        } catch (e) {
          console.error(e);
        }
        return next;
      });
      setIsUnlocking(false);
      setIsPlaying(true);
      if (videoRef.current) {
        videoRef.current.play().catch(() => {});
      }
    }, 1800);
  };

  const filteredEpisodes = episodes.filter(ep =>
    ep.title.toLowerCase().includes(searchEpisodeQuery.toLowerCase()) ||
    `ep ${ep.episodeNumber}`.includes(searchEpisodeQuery.toLowerCase()) ||
    `episode ${ep.episodeNumber}`.includes(searchEpisodeQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex flex-col overflow-hidden animate-in fade-in duration-200">
      {/* Top Header Bar */}
      <header className="h-14 sm:h-16 px-4 sm:px-6 bg-[#0c0d12]/95 border-b border-white/10 flex items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#ff2a5f] to-rose-400 flex items-center justify-center font-bold text-white text-xs shrink-0">
            FD
          </div>
          <div className="min-w-0">
            <h2 className="text-sm sm:text-base font-bold text-white truncate flex items-center gap-2">
              <span>{appLanguage === 'bn' && drama.titleBn ? drama.titleBn : appLanguage === 'hi' && drama.titleHi ? drama.titleHi : drama.title}</span>
              <span className="text-xs font-normal text-rose-400">
                • {t.episode} {currentEpNum}
              </span>
            </h2>
            <p className="text-[11px] text-slate-400 truncate">
              {currentEpisode.title}
            </p>
          </div>
        </div>

        {/* View Mode & Actions */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Mode Switcher */}
          <div className="hidden sm:flex items-center bg-[#161822] p-0.5 rounded-lg border border-white/5 text-xs">
            <button
              onClick={() => setPlayerMode('vertical')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                playerMode === 'vertical'
                  ? 'bg-[#ff2a5f] text-white font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>{t.reelMode}</span>
            </button>
            <button
              onClick={() => setPlayerMode('cinema')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                playerMode === 'cinema'
                  ? 'bg-[#ff2a5f] text-white font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Tv className="w-3.5 h-3.5" />
              <span>{t.cinemaMode}</span>
            </button>
          </div>

          {/* Blogger Embed Code Button */}
          {onOpenBloggerCode && (
            <button
              onClick={() => onOpenBloggerCode(drama)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs border border-white/10 cursor-pointer"
              title="Get Blogger Embed Code"
            >
              <Code className="w-3.5 h-3.5 text-rose-400" />
              <span className="hidden md:inline">{t.bloggerCodeBtn}</span>
            </button>
          )}

          {/* Share */}
          <button
            onClick={handleShare}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
            title={t.shareLink}
          >
            {copiedShare ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
          </button>

          {/* Bookmark */}
          <button
            onClick={() => onToggleBookmark(drama.id)}
            className={`p-2 rounded-lg transition-colors cursor-pointer ${
              isBookmarked
                ? 'bg-rose-500/20 text-rose-400'
                : 'bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white'
            }`}
            title="Bookmark"
          >
            <Bookmark className="w-4 h-4" />
          </button>

          {/* Close */}
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-white/10 hover:bg-rose-600 text-white transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Player Workspace */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left: Video Stage */}
        <div className="flex-1 bg-black flex flex-col items-center justify-center relative p-2 sm:p-4 overflow-hidden">
          {/* Video Container constrained by playerMode */}
          <div
            className={`relative rounded-2xl overflow-hidden bg-[#10121a] shadow-2xl transition-all duration-300 ${
              playerMode === 'vertical'
                ? 'w-full max-w-[380px] aspect-[9/16] max-h-[82vh]'
                : 'w-full max-w-4xl aspect-[16/9]'
            }`}
          >
            {/* 1. MONETAG EPISODE INTERSTITIAL AD OVERLAY */}
            {showAdOverlay && monetagConfig.enabled ? (
              <div className="absolute inset-0 z-40 bg-slate-950/95 backdrop-blur-md flex flex-col justify-between p-6 text-center animate-in fade-in">
                <div className="flex items-center justify-between text-xs">
                  <span className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{t.sponsoredAd}</span>
                  </span>
                  <div className="text-slate-400 font-medium">
                    {adCountdown > 0 ? (
                      <span>{t.adCountdown} <strong className="text-white text-sm">{adCountdown}s</strong></span>
                    ) : (
                      <button
                        onClick={() => setShowAdOverlay(false)}
                        className="px-3 py-1 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-bold cursor-pointer"
                      >
                        {t.skipAd} &gt;&gt;
                      </button>
                    )}
                  </div>
                </div>

                <div className="space-y-4 my-auto">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-rose-500 to-amber-500 mx-auto flex items-center justify-center shadow-lg shadow-rose-500/30">
                    <Flame className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-white">
                      {drama.title} - {t.episode} {currentEpNum}
                    </h3>
                    <p className="text-xs text-slate-300 max-w-xs mx-auto mt-1">
                      মোনিট্যাগ স্পন্সরড বিজ্ঞাপন চলছে। বিজ্ঞাপন শেষ হলেই ভিডিও চালু হবে।
                    </p>
                  </div>

                  {/* Monetag Direct Link CTA */}
                  <div className="pt-2">
                    <button
                      onClick={() => {
                        triggerMonetagDirectLink(monetagConfig);
                        if (adCountdown === 0) setShowAdOverlay(false);
                      }}
                      className="px-6 py-2.5 rounded-full bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-600 hover:to-rose-700 text-slate-950 font-black text-xs sm:text-sm shadow-xl flex items-center justify-center gap-2 mx-auto cursor-pointer"
                    >
                      <span>{t.visitSponsor} (Click to Sponsor)</span>
                      <ExternalLink className="w-4 h-4 text-slate-950" />
                    </button>
                  </div>
                </div>

                <div className="text-[11px] text-slate-400">
                  {adCountdown === 0 && (
                    <button
                      onClick={() => setShowAdOverlay(false)}
                      className="text-slate-300 hover:text-white underline font-semibold cursor-pointer"
                    >
                      {t.skipAd} ও ভিডিও দেখুন
                    </button>
                  )}
                </div>
              </div>
            ) : isCurrentEpLocked ? (
              currentAccessType === 'ad' ? (
                /* 2A. UNLOCK TO AD (আনলক টু অ্যাড) OVERLAY */
                <div className="absolute inset-0 z-30 bg-black/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center space-y-4 animate-in fade-in">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center shadow-xl shadow-amber-500/30">
                      <Sparkles className="w-8 h-8 text-white animate-pulse" />
                    </div>
                    <span className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-[9px] uppercase tracking-wider shadow">
                      Ad Unlock
                    </span>
                  </div>

                  <div className="space-y-1.5 max-w-sm">
                    <h3 className="text-lg sm:text-xl font-black text-white">
                      {t.unlockToAdTitle}
                    </h3>
                    <p className="text-xs text-slate-300">
                      {t.unlockToAdSubtitle}
                    </p>
                    <div className="inline-block mt-1 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] text-amber-300 font-semibold">
                      🎬 {drama.title} • {t.episode} {currentEpNum}
                    </div>
                  </div>

                  <div className="flex flex-col items-center gap-2.5 pt-2 w-full max-w-xs">
                    {/* Big Unlock with Ad Button */}
                    <button
                      onClick={() => handleUnlockWithAd(currentEpNum)}
                      disabled={isUnlocking}
                      className="w-full py-3 px-6 rounded-full bg-gradient-to-r from-amber-500 via-rose-500 to-[#ff2a5f] hover:from-amber-600 hover:to-rose-600 text-slate-950 font-black text-xs sm:text-sm shadow-xl shadow-amber-500/30 hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-80"
                    >
                      {isUnlocking ? (
                        <>
                          <Sparkles className="w-4 h-4 animate-spin text-slate-950" />
                          <span>{t.adUnlocking || 'বিজ্ঞাপন লোড হচ্ছে...'}</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 fill-slate-950 text-slate-950" />
                          <span>{t.unlockToAdBtn}</span>
                        </>
                      )}
                    </button>

                    {/* VIP Option */}
                    {onOpenSubscriptionModal && (
                      <button
                        onClick={onOpenSubscriptionModal}
                        className="w-full py-2 px-4 rounded-full bg-white/10 hover:bg-white/15 text-white font-bold text-xs border border-white/10 shadow transition-all cursor-pointer flex items-center justify-center gap-2"
                      >
                        <Crown className="w-3.5 h-3.5 text-amber-400" />
                        <span>{t.upgradeToVipBtn} (Ad-Free)</span>
                      </button>
                    )}

                    <button
                      onClick={() => changeEpisodeWithAd(1)}
                      className="px-4 py-1 text-slate-400 text-xs hover:text-white cursor-pointer"
                    >
                      পর্ব ১ এ ফিরে যান
                    </button>
                  </div>
                </div>
              ) : (
                /* 2B. PREMIUM VIP EXCLUSIVE OVERLAY */
                <div className="absolute inset-0 z-30 bg-black/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center space-y-4 animate-in fade-in">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-600 flex items-center justify-center shadow-xl shadow-amber-500/40">
                    <Crown className="w-8 h-8 text-slate-950 fill-slate-950" />
                  </div>

                  <div className="space-y-1.5 max-w-sm">
                    <h3 className="text-lg sm:text-xl font-black text-white">
                      {t.premiumRequiredTitle}
                    </h3>
                    <p className="text-xs text-slate-300">
                      {t.premiumRequiredDesc}
                    </p>
                    <div className="inline-block mt-1 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-[11px] text-amber-300 font-semibold">
                      👑 VIP Member Only • {drama.title} - {t.episode} {currentEpNum}
                    </div>
                  </div>

                  <div className="flex flex-col items-center gap-2.5 pt-2 w-full max-w-xs">
                    {onOpenSubscriptionModal && (
                      <button
                        onClick={onOpenSubscriptionModal}
                        className="w-full py-3 px-6 rounded-full bg-gradient-to-r from-amber-400 via-amber-500 to-rose-600 hover:from-amber-500 hover:to-rose-700 text-slate-950 font-black text-xs sm:text-sm shadow-xl shadow-amber-500/40 hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
                      >
                        <Crown className="w-4 h-4 fill-slate-950 text-slate-950" />
                        <span>👑 {t.upgradeToVipBtn}</span>
                      </button>
                    )}

                    <button
                      onClick={() => changeEpisodeWithAd(1)}
                      className="px-4 py-1 text-slate-400 text-xs hover:text-white cursor-pointer"
                    >
                      পর্ব ১ এ ফিরে যান
                    </button>
                  </div>
                </div>
              )
            ) :
 currentEpisode.videoType === 'iframe' || currentEpisode.videoUrl.includes('<iframe') ? (
              <div
                className="w-full h-full"
                dangerouslySetInnerHTML={{
                  __html: currentEpisode.videoUrl.includes('<iframe')
                    ? currentEpisode.videoUrl
                    : `<iframe src="${currentEpisode.videoUrl}" class="w-full h-full border-0" allowfullscreen></iframe>`
                }}
              />
            ) : currentEpisode.videoType === 'youtube' || currentEpisode.videoUrl.includes('youtube.com') || currentEpisode.videoUrl.includes('youtu.be') ? (
              <iframe
                src={`https://www.youtube.com/embed/${extractYoutubeId(currentEpisode.videoUrl)}?autoplay=1&rel=0`}
                className="w-full h-full border-0"
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
                title={currentEpisode.title}
              />
            ) : (
              /* Direct HTML5 Video Player */
              <div className="relative w-full h-full group/video">
                <video
                  ref={videoRef}
                  src={currentEpisode.videoUrl}
                  className="w-full h-full object-cover"
                  autoPlay
                  playsInline
                  onTimeUpdate={handleTimeUpdate}
                  onEnded={handleVideoEnded}
                  onClick={togglePlay}
                />

                {/* Video Overlay Controls */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 opacity-0 group-hover/video:opacity-100 transition-opacity flex flex-col justify-between p-4 pointer-events-none">
                  {/* Top info */}
                  <div className="pointer-events-auto flex items-center justify-between">
                    <span className="text-xs font-bold text-white bg-black/60 px-2 py-0.5 rounded backdrop-blur">
                      {t.episode} {currentEpNum} / {episodes.length}
                    </span>
                    <button
                      onClick={handleSpeedChange}
                      className="text-xs font-bold px-2 py-0.5 rounded bg-black/60 text-rose-400 hover:text-white border border-white/10 cursor-pointer"
                    >
                      {playbackSpeed}x
                    </button>
                  </div>

                  {/* Big center play icon */}
                  {!isPlaying && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-auto">
                      <button
                        onClick={togglePlay}
                        className="w-14 h-14 rounded-full bg-[#ff2a5f] text-white flex items-center justify-center shadow-xl shadow-[#ff2a5f]/50 scale-100 hover:scale-110 transition-transform cursor-pointer"
                      >
                        <Play className="w-7 h-7 fill-white ml-1" />
                      </button>
                    </div>
                  )}

                  {/* Bottom Controls Bar */}
                  <div className="pointer-events-auto space-y-2">
                    <input
                      type="range"
                      min={0}
                      max={duration || 100}
                      step={0.1}
                      value={currentTime}
                      onChange={handleSeek}
                      className="w-full h-1.5 bg-white/30 rounded-lg appearance-none cursor-pointer accent-[#ff2a5f]"
                    />

                    <div className="flex items-center justify-between text-white text-xs">
                      <div className="flex items-center gap-3">
                        <button onClick={togglePlay} className="hover:text-[#ff2a5f] cursor-pointer">
                          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
                        </button>

                        <button
                          onClick={() => changeEpisodeWithAd(Math.max(1, currentEpNum - 1))}
                          disabled={currentEpNum === 1}
                          className="disabled:opacity-30 hover:text-[#ff2a5f] cursor-pointer"
                        >
                          <SkipBack className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => changeEpisodeWithAd(Math.min(episodes.length, currentEpNum + 1))}
                          disabled={currentEpNum === episodes.length}
                          className="disabled:opacity-30 hover:text-[#ff2a5f] cursor-pointer"
                        >
                          <SkipForward className="w-4 h-4" />
                        </button>

                        <button onClick={toggleMute} className="hover:text-[#ff2a5f] cursor-pointer">
                          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                        </button>

                        <span className="text-[11px] text-slate-300">
                          {formatTime(currentTime)} / {formatTime(duration)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button onClick={toggleFullscreen} className="hover:text-[#ff2a5f] cursor-pointer">
                          <Maximize className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Under-player Monetag Banner Box */}
          {monetagConfig.enabled && monetagConfig.bannerHtml && (
            <div
              onClick={() => triggerMonetagDirectLink(monetagConfig)}
              className="mt-3 w-full max-w-md cursor-pointer hover:opacity-95 transition-opacity"
              dangerouslySetInnerHTML={{ __html: monetagConfig.bannerHtml }}
            />
          )}
        </div>

        {/* Right Drawer: Episodes Playlist & Drama Info */}
        <div className="w-full lg:w-96 bg-[#0e1017] border-t lg:border-t-0 lg:border-l border-white/10 flex flex-col h-72 sm:h-80 lg:h-auto shrink-0">
          <div className="p-4 border-b border-white/5 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-bold text-white text-sm sm:text-base leading-snug">
                  {drama.title}
                </h3>
                {drama.titleBn && (
                  <p className="text-xs text-rose-400 font-medium">
                    {drama.titleBn}
                  </p>
                )}
              </div>
              <span className="text-[11px] px-2 py-0.5 rounded bg-white/5 text-slate-300 shrink-0 font-semibold">
                {drama.totalEpisodes} {t.episodesText}
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5 text-[11px]">
              {drama.genres.map(g => (
                <span key={g} className="px-2 py-0.5 rounded bg-white/5 text-slate-400">
                  {g}
                </span>
              ))}
              <span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-300 font-semibold">
                {drama.language}
              </span>
            </div>
          </div>

          {/* Search Episode */}
          <div className="p-3 border-b border-white/5">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchEpisodeQuery}
                onChange={(e) => setSearchEpisodeQuery(e.target.value)}
                placeholder={t.searchEpisode}
                className="w-full bg-[#161822] text-xs text-slate-200 placeholder-slate-400 pl-8 pr-3 py-1.5 rounded-lg border border-white/5 focus:outline-none focus:border-[#ff2a5f]/50"
              />
            </div>
          </div>

          {/* Episodes Playlist */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
            {filteredEpisodes.map((ep) => {
              const isActive = ep.episodeNumber === currentEpNum;
              const epAccess = getEpisodeAccessType(ep);
              const isAdUnlocked = unlockedEps.includes(ep.episodeNumber);

              return (
                <button
                  key={ep.id}
                  onClick={() => {
                    changeEpisodeWithAd(ep.episodeNumber);
                    setIsPlaying(true);
                  }}
                  className={`w-full text-left p-2.5 rounded-xl transition-all flex items-center justify-between gap-3 cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-[#ff2a5f]/25 to-rose-600/10 border border-[#ff2a5f]/50 text-white'
                      : 'hover:bg-white/5 text-slate-300 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                        isActive
                          ? 'bg-[#ff2a5f] text-white shadow-md shadow-[#ff2a5f]/40'
                          : 'bg-[#1a1c28] text-slate-300'
                      }`}
                    >
                      {ep.episodeNumber}
                    </div>
                    <div className="min-w-0">
                      <p className={`text-xs font-medium truncate ${isActive ? 'text-white font-bold' : ''}`}>
                        {ep.title}
                      </p>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400">
                        <span>{ep.duration}</span>
                        <span>•</span>
                        <span>{ep.views}</span>
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0">
                    {epAccess === 'free' ? (
                      <span className="text-[10px] text-emerald-400 font-bold px-1.5 py-0.5 bg-emerald-500/10 rounded border border-emerald-500/20">
                        FREE
                      </span>
                    ) : epAccess === 'ad' ? (
                      isAdUnlocked || isVIP ? (
                        <span className="text-[10px] text-emerald-400 font-bold px-1.5 py-0.5 bg-emerald-500/10 rounded border border-emerald-500/20 flex items-center gap-1">
                          <Unlock className="w-2.5 h-2.5" />
                          <span>আনলক</span>
                        </span>
                      ) : (
                        <span className="text-[10px] text-amber-400 font-bold px-1.5 py-0.5 bg-amber-500/10 rounded border border-amber-500/20 flex items-center gap-1">
                          <Sparkles className="w-2.5 h-2.5" />
                          <span>অ্যাড</span>
                        </span>
                      )
                    ) : (
                      isVIP ? (
                        <span className="text-[10px] text-amber-300 font-bold px-1.5 py-0.5 bg-amber-500/15 rounded border border-amber-500/30 flex items-center gap-1">
                          <Crown className="w-2.5 h-2.5" />
                          <span>VIP</span>
                        </span>
                      ) : (
                        <span className="text-[10px] text-rose-300 font-bold px-1.5 py-0.5 bg-rose-500/15 rounded border border-rose-500/30 flex items-center gap-1">
                          <Crown className="w-2.5 h-2.5 text-amber-400" />
                          <span>প্রিমিয়াম</span>
                        </span>
                      )
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

function formatTime(seconds: number): string {
  if (isNaN(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

function extractYoutubeId(url: string): string {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  return match ? match[1] : url;
}
