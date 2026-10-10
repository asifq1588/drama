import React, { useState, useEffect, useMemo } from 'react';
import { Drama, ContinueWatchItem, AppLanguage, UserVIPStatus } from './types/drama';
import { INITIAL_DRAMAS } from './data/mockDramas';
import {
  loadDramasFromStorage,
  getContinueWatchingList,
  getBookmarkedIds,
  toggleBookmarkId
} from './services/firebaseService';
import {
  getStoredMonetagConfig,
  applyMonetagScriptToDOM
} from './services/monetagService';
import {
  getUserVIPStatus
} from './services/subscriptionService';
import {
  getStoredAppLanguage,
  saveStoredAppLanguage,
  TRANSLATIONS
} from './services/i18n';
import { Navbar } from './components/Navbar';
import { HeroSlider } from './components/HeroSlider';
import { DramaRow } from './components/DramaRow';
import { TopRankSection } from './components/TopRankSection';
import { ContinueWatchingSection } from './components/ContinueWatchingSection';
import { WatchModal } from './components/WatchModal';
import { AdminPanel } from './components/AdminPanel';
import { AdminLoginModal } from './components/AdminLoginModal';
import { isAdminLoggedIn } from './services/adminAuthService';
import { DownloadAppModal } from './components/DownloadAppModal';
import { BloggerModal } from './components/BloggerModal';
import { SubscriptionModal } from './components/SubscriptionModal';
import { DramaCard } from './components/DramaCard';
import {
  Film,
  Search,
  Bookmark,
  Shield,
  Code,
  Crown
} from 'lucide-react';

export default function App() {
  const [dramas, setDramas] = useState<Drama[]>(INITIAL_DRAMAS);
  const [continueWatching, setContinueWatching] = useState<ContinueWatchItem[]>([]);
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  const [notifiedIds, setNotifiedIds] = useState<string[]>([]);

  // Multi-Language State (English, Bengali, Hindi)
  const [appLanguage, setAppLanguage] = useState<AppLanguage>(getStoredAppLanguage());
  const t = TRANSLATIONS[appLanguage];

  // VIP Subscription status
  const [userVIP, setUserVIP] = useState<UserVIPStatus>(getUserVIPStatus());
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState<boolean>(false);

  // Navigation & Filter states
  const [activeNavTab, setActiveNavTab] = useState<'home' | 'explore' | 'ranking' | 'comingSoon' | 'myList'>('home');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedGenre, setSelectedGenre] = useState<string>('All');

  // Admin and Modals
  const [isAdminMode, setIsAdminMode] = useState<boolean>(false);
  const [isAdminLoginModalOpen, setIsAdminLoginModalOpen] = useState<boolean>(false);
  const [selectedDramaForWatch, setSelectedDramaForWatch] = useState<Drama | null>(null);
  const [watchInitialEp, setWatchInitialEp] = useState<number>(1);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState<boolean>(false);
  const [isBloggerModalOpen, setIsBloggerModalOpen] = useState<boolean>(false);
  const [selectedBloggerDrama, setSelectedBloggerDrama] = useState<Drama | null>(null);

  const handleOpenAdmin = () => {
    if (isAdminLoggedIn()) {
      setIsAdminMode(true);
    } else {
      setIsAdminLoginModalOpen(true);
    }
  };

  // Load persistent data & Monetag ads on startup
  useEffect(() => {
    async function init() {
      // 1. Load Firebase & LocalStorage dramas
      const storedDramas = await loadDramasFromStorage();
      if (storedDramas && storedDramas.length > 0) {
        setDramas(storedDramas);
      }
      setContinueWatching(getContinueWatchingList());
      setBookmarkedIds(getBookmarkedIds());
      setUserVIP(getUserVIPStatus());

      const savedNotified = localStorage.getItem('free_drama_notified_ids');
      if (savedNotified) {
        setNotifiedIds(JSON.parse(savedNotified));
      }

      // 2. Initialize Monetag ad scripts on page
      applyMonetagScriptToDOM(getStoredMonetagConfig());
    }
    init();
  }, []);

  const handleLanguageChange = (lang: AppLanguage) => {
    setAppLanguage(lang);
    saveStoredAppLanguage(lang);
  };

  const handleCloseWatchModal = () => {
    setSelectedDramaForWatch(null);
    setContinueWatching(getContinueWatchingList());
  };

  const handleToggleBookmark = (dramaId: string) => {
    const updated = toggleBookmarkId(dramaId);
    setBookmarkedIds(updated);
  };

  const handleToggleNotify = (dramaId: string) => {
    const updated = notifiedIds.includes(dramaId)
      ? notifiedIds.filter((id) => id !== dramaId)
      : [...notifiedIds, dramaId];
    setNotifiedIds(updated);
    localStorage.setItem('free_drama_notified_ids', JSON.stringify(updated));
  };

  const handleStartWatch = (drama: Drama, initialEp: number = 1) => {
    setSelectedDramaForWatch(drama);
    setWatchInitialEp(initialEp);
  };

  const handleOpenBloggerCode = (drama?: Drama) => {
    setSelectedBloggerDrama(drama || null);
    setIsBloggerModalOpen(true);
  };

  // Filtered Dramas by Search & Genre
  const filteredDramas = useMemo(() => {
    return dramas.filter((d) => {
      const matchSearch =
        !searchQuery ||
        d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (d.titleBn && d.titleBn.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (d.titleHi && d.titleHi.toLowerCase().includes(searchQuery.toLowerCase())) ||
        d.genres.some((g) => g.toLowerCase().includes(searchQuery.toLowerCase())) ||
        d.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchGenre =
        selectedGenre === 'All' ||
        d.genres.includes(selectedGenre) ||
        d.category === selectedGenre;

      return matchSearch && matchGenre;
    });
  }, [dramas, searchQuery, selectedGenre]);

  // Categorized Slices
  const featuredHeroDramas = useMemo(() => {
    const heroList = dramas.filter((d) => d.isFeaturedHero);
    return heroList.length > 0 ? heroList : dramas.slice(0, 5);
  }, [dramas]);

  const popularDramas = useMemo(() => {
    return dramas.filter((d) => d.isPopular && !d.isComingSoon);
  }, [dramas]);

  const topRankDramas = useMemo(() => {
    return dramas.filter((d) => !d.isComingSoon && (d.topRankDaily || d.isPopular));
  }, [dramas]);

  const comingSoonDramas = useMemo(() => {
    return dramas.filter((d) => d.isComingSoon);
  }, [dramas]);

  const newReleasesDramas = useMemo(() => {
    return dramas.filter((d) => d.isNew && !d.isComingSoon);
  }, [dramas]);

  const indianDramas = useMemo(() => {
    return dramas.filter((d) => d.category === 'Indian');
  }, [dramas]);

  const dubbedDramas = useMemo(() => {
    return dramas.filter((d) => d.category === 'Dubbed');
  }, [dramas]);

  const bengaliDramas = useMemo(() => {
    return dramas.filter((d) => d.category === 'Bengali' || d.language === 'Bengali');
  }, [dramas]);

  const myBookmarkedDramas = useMemo(() => {
    return dramas.filter((d) => bookmarkedIds.includes(d.id));
  }, [dramas, bookmarkedIds]);

  const allGenres = ['All', 'Action', 'Romance', 'Fantasy', 'Adventure', 'Sci-Fi', 'Thriller', 'Comedy', 'Supernatural', 'Historical'];

  // If in dedicated separate Admin Panel mode:
  if (isAdminMode) {
    return (
      <AdminPanel
        dramas={dramas}
        onUpdateDramas={(updated) => setDramas(updated)}
        onCloseAdmin={() => setIsAdminMode(false)}
        appLanguage={appLanguage}
        onAppLanguageChange={handleLanguageChange}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0c10] text-slate-100 flex flex-col selection:bg-[#ff2a5f] selection:text-white">
      {/* Top Navigation Bar with 3 languages and VIP CTA */}
      <Navbar
        appLanguage={appLanguage}
        onAppLanguageChange={handleLanguageChange}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeNavTab={activeNavTab}
        onNavTabChange={(tab) => {
          setActiveNavTab(tab as any);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        isAdminMode={isAdminMode}
        onToggleAdminMode={handleOpenAdmin}
        onOpenDownloadModal={() => setIsDownloadModalOpen(true)}
        bookmarkedCount={bookmarkedIds.length}
        isVIP={userVIP.isVIP}
        onOpenSubscriptionModal={() => setIsSubscriptionModalOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 pb-16">
        {/* If user is actively searching */}
        {searchQuery.trim().length > 0 ? (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Search className="w-5 h-5 text-[#ff2a5f]" />
                <span>{t.searchResults} &quot;{searchQuery}&quot; ({filteredDramas.length})</span>
              </h2>
              <button
                onClick={() => setSearchQuery('')}
                className="text-xs text-rose-400 hover:underline cursor-pointer"
              >
                {t.clearSearch}
              </button>
            </div>

            {filteredDramas.length === 0 ? (
              <div className="text-center py-20 text-slate-400 space-y-3">
                <Film className="w-12 h-12 mx-auto text-slate-600" />
                <p className="text-sm">{t.noDramasFound}</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {filteredDramas.map((drama) => (
                  <DramaCard
                    key={drama.id}
                    drama={drama}
                    onClick={() => handleStartWatch(drama)}
                  />
                ))}
              </div>
            )}
          </div>
        ) : activeNavTab === 'explore' ? (
          /* Explore View with Genre filters */
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-white">{t.exploreTitle}</h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                {t.exploreSubtitle}
              </p>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
              {allGenres.map((g) => (
                <button
                  key={g}
                  onClick={() => setSelectedGenre(g)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    selectedGenre === g
                      ? 'bg-[#ff2a5f] text-white shadow-md shadow-[#ff2a5f]/30'
                      : 'bg-white/5 text-slate-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {filteredDramas.map((drama) => (
                <DramaCard
                  key={drama.id}
                  drama={drama}
                  onClick={() => handleStartWatch(drama)}
                />
              ))}
            </div>
          </div>
        ) : activeNavTab === 'ranking' ? (
          /* Top Rank Dedicated Page */
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
            <TopRankSection
              dramas={topRankDramas}
              onDramaClick={(drama) => handleStartWatch(drama)}
            />

            <div className="pt-6">
              <h3 className="text-lg font-bold text-white mb-4">{t.topRankTitle}</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {topRankDramas.map((drama, idx) => (
                  <DramaCard
                    key={drama.id}
                    drama={drama}
                    variant="rank"
                    rankNumber={idx + 1}
                    onClick={() => handleStartWatch(drama)}
                  />
                ))}
              </div>
            </div>
          </div>
        ) : activeNavTab === 'comingSoon' ? (
          /* Coming Soon Page */
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-white">{t.comingSoonTitle}</h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                {appLanguage === 'bn' ? 'শীঘ্রই মুক্তি পাচ্ছে নতুন এক্সক্লুসিভ শর্ট ড্রামা সিরিজ' : appLanguage === 'hi' ? 'जल्द आ रहे हैं नए एक्सक्लूसिव शॉर्ट ड्रामा' : 'Exclusive new short drama series coming soon'}
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {comingSoonDramas.map((drama) => (
                <DramaCard
                  key={drama.id}
                  drama={drama}
                  variant="comingSoon"
                  isNotified={notifiedIds.includes(drama.id)}
                  onToggleNotify={handleToggleNotify}
                  onClick={() => handleStartWatch(drama)}
                />
              ))}
            </div>
          </div>
        ) : activeNavTab === 'myList' ? (
          /* My List Page */
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2">
                <Bookmark className="w-6 h-6 text-[#ff2a5f]" />
                <span>{t.savedListTitle} ({myBookmarkedDramas.length})</span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                {appLanguage === 'bn' ? 'আপনার পছন্দের বুকমার্ক করা ড্রামা সমূহ' : appLanguage === 'hi' ? 'आपके पसंदीदा बुकमार्क किए गए ड्रामा' : 'Your bookmarked dramas list'}
              </p>
            </div>

            {myBookmarkedDramas.length === 0 ? (
              <div className="text-center py-24 text-slate-400 space-y-3 bg-[#11131c] rounded-2xl border border-white/5 p-8 max-w-md mx-auto">
                <Bookmark className="w-12 h-12 mx-auto text-slate-600" />
                <h4 className="text-base font-bold text-white">{t.noSavedDramas}</h4>
                <p className="text-xs">{t.noSavedDesc}</p>
                <button
                  onClick={() => setActiveNavTab('home')}
                  className="px-5 py-2 rounded-full bg-[#ff2a5f] text-white text-xs font-bold cursor-pointer"
                >
                  {t.backToHome}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {myBookmarkedDramas.map((drama) => (
                  <DramaCard
                    key={drama.id}
                    drama={drama}
                    onClick={() => handleStartWatch(drama)}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          /* DEFAULT: HOME PAGE */
          <div className="space-y-4">
            {/* VIP Promo Banner for non-VIP users */}
            {!userVIP.isVIP && (
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
                <div
                  onClick={() => setIsSubscriptionModalOpen(true)}
                  className="bg-gradient-to-r from-amber-500/15 via-rose-500/15 to-purple-500/15 border border-amber-500/30 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 cursor-pointer hover:border-amber-500/60 transition-all shadow-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center shrink-0">
                      <Crown className="w-5 h-5 text-slate-950 fill-slate-950" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-sm">
                        {appLanguage === 'bn' ? '👑 বিকাশ বা নগদে প্রিমিয়াম ভিআইপি সাবস্ক্রিপশন নিন!' : '👑 Get Premium VIP Subscription with bKash or Nagad!'}
                      </h3>
                      <p className="text-xs text-slate-300">
                        {appLanguage === 'bn' ? 'সব লক করা পর্ব এক ক্লিকে আনলক করুন এবং ১০০% বিজ্ঞাপনমুক্ত দেখুন।' : 'Unlock all VIP episodes & watch completely ad-free.'}
                      </p>
                    </div>
                  </div>

                  <button className="px-5 py-2 rounded-full bg-gradient-to-r from-amber-500 to-rose-600 text-slate-950 font-black text-xs shrink-0 shadow-md">
                    {appLanguage === 'bn' ? 'সাবস্ক্রাইব করুন (৳৪৯ থেকে)' : 'Subscribe Now'}
                  </button>
                </div>
              </div>
            )}

            {/* 1. Hero Feature Banner & Thumbnail Slider */}
            <HeroSlider
              featuredDramas={featuredHeroDramas}
              onWatchClick={(drama) => handleStartWatch(drama)}
              bookmarkedIds={bookmarkedIds}
              onToggleBookmark={handleToggleBookmark}
            />

            {/* 2. Continue Watching Row */}
            <ContinueWatchingSection
              items={continueWatching}
              allDramas={dramas}
              onDramaClick={(drama, epNum) => handleStartWatch(drama, epNum)}
            />

            {/* 3. Popular Row */}
            <DramaRow
              title={t.popularDramas}
              dramas={popularDramas}
              onDramaClick={(drama) => handleStartWatch(drama)}
              onViewAll={() => setActiveNavTab('explore')}
            />

            {/* 4. Top Rank Row */}
            <TopRankSection
              dramas={topRankDramas}
              onDramaClick={(drama) => handleStartWatch(drama)}
              onViewAll={() => setActiveNavTab('ranking')}
            />

            {/* 5. Coming Soon Row */}
            <DramaRow
              title={t.comingSoonTitle}
              dramas={comingSoonDramas}
              variant="comingSoon"
              notifiedIds={notifiedIds}
              onToggleNotify={handleToggleNotify}
              onDramaClick={(drama) => handleStartWatch(drama)}
              onViewAll={() => setActiveNavTab('comingSoon')}
            />

            {/* 6. New Releases Row */}
            <DramaRow
              title={t.newReleases}
              dramas={newReleasesDramas}
              onDramaClick={(drama) => handleStartWatch(drama)}
              onViewAll={() => setActiveNavTab('explore')}
            />

            {/* 7. Indian Dramas Row */}
            <DramaRow
              title={t.indianDramas}
              dramas={indianDramas}
              onDramaClick={(drama) => handleStartWatch(drama)}
              onViewAll={() => setActiveNavTab('explore')}
            />

            {/* 8. Dubbed Dramas Row */}
            <DramaRow
              title={t.dubbedDramas}
              dramas={dubbedDramas}
              onDramaClick={(drama) => handleStartWatch(drama)}
              onViewAll={() => setActiveNavTab('explore')}
            />

            {/* 9. Bengali Dramas Row */}
            {bengaliDramas.length > 0 && (
              <DramaRow
                title={t.bengaliDramas}
                dramas={bengaliDramas}
                onDramaClick={(drama) => handleStartWatch(drama)}
                onViewAll={() => setActiveNavTab('explore')}
              />
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-[#08090d] border-t border-white/5 py-12 px-4 sm:px-6 lg:px-8 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#ff2a5f] to-rose-400 flex items-center justify-center font-bold text-white text-xs">
              FD
            </div>
            <div>
              <span className="font-bold text-white text-sm">{t.brandName}</span>
              <p className="text-xs text-slate-500">{t.brandTagline}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
            <button
              onClick={() => setIsSubscriptionModalOpen(true)}
              className="hover:text-white transition-colors flex items-center gap-1 cursor-pointer text-amber-400 font-bold"
            >
              <Crown className="w-3.5 h-3.5 fill-amber-400" />
              <span>বিকাশ/নগদ ভিআইপি</span>
            </button>
            <span>•</span>
            <button
              onClick={() => handleOpenBloggerCode()}
              className="hover:text-white transition-colors flex items-center gap-1 cursor-pointer text-rose-400"
            >
              <Code className="w-3.5 h-3.5" />
              <span>{t.bloggerCodeBtn}</span>
            </button>
            <span>•</span>
            <button
              onClick={handleOpenAdmin}
              className="hover:text-white transition-colors flex items-center gap-1 cursor-pointer text-amber-400"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>{t.adminPanel}</span>
            </button>
            <span>•</span>
            <button
              onClick={() => setIsDownloadModalOpen(true)}
              className="hover:text-white transition-colors cursor-pointer"
            >
              {t.downloadApp}
            </button>
          </div>

          <div className="text-xs text-slate-500 text-center md:text-right">
            &copy; 2026 {t.brandName}. {t.footerRights}
          </div>
        </div>
      </footer>

      {/* Watch Modal with Monetag Ad & VIP support */}
      {selectedDramaForWatch && (
        <WatchModal
          drama={selectedDramaForWatch}
          initialEpisodeNumber={watchInitialEp}
          onClose={handleCloseWatchModal}
          isBookmarked={bookmarkedIds.includes(selectedDramaForWatch.id)}
          onToggleBookmark={handleToggleBookmark}
          onOpenBloggerCode={handleOpenBloggerCode}
          appLanguage={appLanguage}
          isVIP={userVIP.isVIP}
          onOpenSubscriptionModal={() => setIsSubscriptionModalOpen(true)}
        />
      )}

      {/* Download App Modal */}
      <DownloadAppModal
        isOpen={isDownloadModalOpen}
        onClose={() => setIsDownloadModalOpen(false)}
      />

      {/* Blogger Code Modal */}
      <BloggerModal
        isOpen={isBloggerModalOpen}
        onClose={() => setIsBloggerModalOpen(false)}
        selectedDrama={selectedBloggerDrama}
      />

      {/* Premium VIP Subscription with bKash / Nagad */}
      <SubscriptionModal
        isOpen={isSubscriptionModalOpen}
        onClose={() => setIsSubscriptionModalOpen(false)}
        onVIPActivated={() => setUserVIP(getUserVIPStatus())}
        appLanguage={appLanguage}
      />

      {/* Admin Security Login Modal (Protected by asifyt265@gmail.com & asif9898) */}
      <AdminLoginModal
        isOpen={isAdminLoginModalOpen}
        onClose={() => setIsAdminLoginModalOpen(false)}
        onLoginSuccess={() => {
          setIsAdminLoginModalOpen(false);
          setIsAdminMode(true);
        }}
        appLanguage={appLanguage}
      />
    </div>
  );
}
