import React, { useState } from 'react';
import { Search, Globe, Smartphone, Shield, X, Film, Bookmark, Crown, Sparkles } from 'lucide-react';
import { AppLanguage } from '../types/drama';
import { TRANSLATIONS } from '../services/i18n';

interface NavbarProps {
  appLanguage: AppLanguage;
  onAppLanguageChange: (lang: AppLanguage) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  activeNavTab: string;
  onNavTabChange: (tab: string) => void;
  isAdminMode: boolean;
  onToggleAdminMode: () => void;
  onOpenDownloadModal: () => void;
  bookmarkedCount: number;
  isVIP: boolean;
  onOpenSubscriptionModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  appLanguage,
  onAppLanguageChange,
  searchQuery,
  onSearchChange,
  activeNavTab,
  onNavTabChange,
  isAdminMode,
  onToggleAdminMode,
  onOpenDownloadModal,
  bookmarkedCount,
  isVIP,
  onOpenSubscriptionModal,
}) => {
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const t = TRANSLATIONS[appLanguage];

  const appLanguages: { code: AppLanguage; label: string; sub: string }[] = [
    { code: 'bn', label: 'বাংলা', sub: 'Bengali' },
    { code: 'en', label: 'English', sub: 'ইংরেজি' },
    { code: 'hi', label: 'हिन्दी', sub: 'Hindi' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#0c0d12]/90 backdrop-blur-md border-b border-white/5 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo & Main Tabs */}
        <div className="flex items-center gap-6 sm:gap-8 shrink-0">
          <button
            onClick={() => onNavTabChange('home')}
            className="flex items-center gap-2 group cursor-pointer text-left"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#ff2a5f] via-[#e11d48] to-[#9333ea] flex items-center justify-center shadow-lg shadow-[#ff2a5f]/25 group-hover:scale-105 transition-transform">
              <Film className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg sm:text-xl font-black tracking-tight text-white flex items-center gap-1.5">
                <span className="bg-gradient-to-r from-white via-rose-100 to-rose-400 bg-clip-text text-transparent">
                  {t.brandName}
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#ff2a5f]/20 text-[#ff2a5f] border border-[#ff2a5f]/40 uppercase tracking-widest hidden sm:inline-block">
                  {appLanguage === 'bn' ? 'ফ্রি ড্রামা' : appLanguage === 'hi' ? 'फ्री ड्रामा' : 'FREE'}
                </span>
              </span>
            </div>
          </button>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <button
              onClick={() => onNavTabChange('home')}
              className={`transition-colors cursor-pointer ${
                activeNavTab === 'home'
                  ? 'text-white font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {t.navHome}
            </button>
            <button
              onClick={() => onNavTabChange('explore')}
              className={`transition-colors cursor-pointer ${
                activeNavTab === 'explore'
                  ? 'text-white font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {t.navExplore}
            </button>
            <button
              onClick={() => onNavTabChange('ranking')}
              className={`transition-colors cursor-pointer ${
                activeNavTab === 'ranking'
                  ? 'text-white font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {t.navTopRank}
            </button>
            <button
              onClick={() => onNavTabChange('comingSoon')}
              className={`transition-colors cursor-pointer ${
                activeNavTab === 'comingSoon'
                  ? 'text-white font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {t.navComingSoon}
            </button>
            <button
              onClick={() => onNavTabChange('myList')}
              className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
                activeNavTab === 'myList'
                  ? 'text-[#ff2a5f] font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>{t.navMyList}</span>
              {bookmarkedCount > 0 && (
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#ff2a5f] text-white font-bold">
                  {bookmarkedCount}
                </span>
              )}
            </button>
          </nav>
        </div>

        {/* Center Search Bar */}
        <div className="flex-1 max-w-md mx-2 sm:mx-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full bg-[#161822]/80 hover:bg-[#1a1c28] focus:bg-[#1a1c28] text-sm text-slate-100 placeholder-slate-400 pl-10 pr-9 py-2 rounded-full border border-white/5 focus:border-[#ff2a5f]/60 focus:outline-none transition-all shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {/* VIP Subscription CTA Button */}
          <button
            onClick={onOpenSubscriptionModal}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all shadow-md cursor-pointer ${
              isVIP
                ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 shadow-amber-500/20'
                : 'bg-gradient-to-r from-amber-500 via-rose-500 to-[#ff2a5f] hover:scale-105 text-slate-950 font-black shadow-amber-500/30'
            }`}
          >
            <Crown className="w-3.5 h-3.5 fill-slate-950" />
            <span>{isVIP ? 'VIP Member' : '👑 VIP'}</span>
          </button>

          {/* Multi-language selector dropdown: English / বাংলা / हिन्दी */}
          <div className="relative">
            <button
              onClick={() => setShowLangDropdown(!showLangDropdown)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-semibold text-slate-200 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-[#ff2a5f]" />
              <span>{appLanguages.find((l) => l.code === appLanguage)?.label}</span>
            </button>

            {showLangDropdown && (
              <div className="absolute right-0 mt-2 w-40 bg-[#161822] rounded-xl shadow-2xl border border-white/10 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-1 text-[10px] text-slate-400 font-bold uppercase tracking-wider border-b border-white/5">
                  Select Language / ভাষা
                </div>
                {appLanguages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      onAppLanguageChange(lang.code);
                      setShowLangDropdown(false);
                    }}
                    className={`w-full text-left px-3.5 py-2 text-xs font-medium transition-colors flex items-center justify-between cursor-pointer ${
                      appLanguage === lang.code
                        ? 'text-[#ff2a5f] bg-[#ff2a5f]/10 font-bold'
                        : 'text-slate-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <div>
                      <div className="font-semibold">{lang.label}</div>
                      <div className="text-[10px] text-slate-400">{lang.sub}</div>
                    </div>
                    {appLanguage === lang.code && (
                      <span className="w-2 h-2 rounded-full bg-[#ff2a5f]" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Download App Button */}
          <button
            onClick={onOpenDownloadModal}
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/5 transition-colors cursor-pointer"
          >
            <Smartphone className="w-3.5 h-3.5 text-rose-400" />
            <span>{t.downloadApp}</span>
          </button>

          {/* Admin Switcher Toggle */}
          <button
            onClick={onToggleAdminMode}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all shadow-sm cursor-pointer ${
              isAdminMode
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-amber-500/20'
                : 'bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 border border-white/5'
            }`}
            title="Switch between User View and Admin Panel"
          >
            <Shield className="w-3.5 h-3.5" />
            <span>{isAdminMode ? t.userMode : t.adminPanel}</span>
          </button>
        </div>
      </div>

      {/* Mobile Nav Links Row */}
      <div className="flex md:hidden items-center justify-around px-2 py-2 bg-[#0c0d12]/95 border-t border-white/5 text-xs">
        <button
          onClick={() => onNavTabChange('home')}
          className={`px-3 py-1 rounded-full ${
            activeNavTab === 'home' ? 'bg-[#ff2a5f] text-white font-bold' : 'text-slate-400'
          }`}
        >
          {t.navHome}
        </button>
        <button
          onClick={() => onNavTabChange('explore')}
          className={`px-3 py-1 rounded-full ${
            activeNavTab === 'explore' ? 'bg-[#ff2a5f] text-white font-bold' : 'text-slate-400'
          }`}
        >
          {t.navExplore}
        </button>
        <button
          onClick={() => onNavTabChange('ranking')}
          className={`px-3 py-1 rounded-full ${
            activeNavTab === 'ranking' ? 'bg-[#ff2a5f] text-white font-bold' : 'text-slate-400'
          }`}
        >
          {t.navTopRank}
        </button>
        <button
          onClick={onOpenSubscriptionModal}
          className="px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-rose-500 text-slate-950 font-black flex items-center gap-1"
        >
          <Crown className="w-3 h-3 fill-slate-950" />
          <span>VIP</span>
        </button>
        <button
          onClick={() => onNavTabChange('myList')}
          className={`px-3 py-1 rounded-full flex items-center gap-1 ${
            activeNavTab === 'myList' ? 'bg-[#ff2a5f] text-white font-bold' : 'text-slate-400'
          }`}
        >
          <Bookmark className="w-3 h-3" />
          <span>{t.navMyList}</span>
        </button>
      </div>
    </header>
  );
};
