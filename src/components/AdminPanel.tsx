import React, { useState } from 'react';
import {
  Film,
  Plus,
  Trash2,
  Edit,
  Save,
  Check,
  Copy,
  ExternalLink,
  Flame,
  Database,
  Code,
  LayoutDashboard,
  Video,
  ListPlus,
  Search,
  Sparkles,
  ArrowLeft,
  X,
  DollarSign,
  Crown,
  CreditCard,
  Eye,
  CheckCircle2,
  AlertCircle,
  Play,
  LogOut,
  Mail,
  Lock,
  Key,
  Download,
  Image as ImageIcon,
  Link as LinkIcon
} from 'lucide-react';
import {
  Drama,
  Episode,
  FirebaseConfig,
  MonetagConfig,
  SubscriptionPlan,
  PaymentSettings,
  SubscriptionOrder,
  AppLanguage,
  EpisodeAccessType,
  getEpisodeAccessType
} from '../types/drama';
import {
  getStoredFirebaseConfig,
  saveStoredFirebaseConfig,
  testFirebaseConnection,
  saveDramasToStorage,
  USER_FIREBASE_CONFIG
} from '../services/firebaseService';
import {
  getStoredAdminCredentials,
  saveStoredAdminCredentials,
  setAdminLoggedInSession
} from '../services/adminAuthService';
import {
  getStoredMonetagConfig,
  saveStoredMonetagConfig,
  triggerMonetagDirectLink
} from '../services/monetagService';
import {
  getStoredSubscriptionPlans,
  saveStoredSubscriptionPlans,
  getStoredPaymentSettings,
  saveStoredPaymentSettings,
  getStoredSubscriptionOrders,
  saveStoredSubscriptionOrders
} from '../services/subscriptionService';
import {
  generateBloggerIframeCode,
  generateBloggerThemeXML,
  generateStandaloneBloggerTemplateCode
} from '../services/bloggerExport';
import { getCleanImageUrl, getCleanVideoSource, DEFAULT_POSTER_FALLBACK, DEFAULT_BANNER_FALLBACK } from '../utils/mediaUrl';
import { TRANSLATIONS } from '../services/i18n';

interface AdminPanelProps {
  dramas: Drama[];
  onUpdateDramas: (dramas: Drama[]) => void;
  onCloseAdmin: () => void;
  appLanguage: AppLanguage;
  onAppLanguageChange: (lang: AppLanguage) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  dramas,
  onUpdateDramas,
  onCloseAdmin,
  appLanguage,
  onAppLanguageChange,
}) => {
  const t = TRANSLATIONS[appLanguage];

  const [activeTab, setActiveTab] = useState<'dashboard' | 'dramas' | 'episodes' | 'subscription' | 'monetag' | 'firebase' | 'blogger'>('dashboard');

  // Firebase Config State
  const [fbConfig, setFbConfig] = useState<FirebaseConfig>(getStoredFirebaseConfig());
  const [fbTestLoading, setFbTestLoading] = useState(false);
  const [fbTestResult, setFbTestResult] = useState<{ success: boolean; message: string } | null>(null);

  // Monetag Ads Config State
  const [monetagConfig, setMonetagConfig] = useState<MonetagConfig>(getStoredMonetagConfig());
  const [monetagSavedAlert, setMonetagSavedAlert] = useState(false);

  // Subscription & bKash / Nagad Payment State
  const [paymentSettings, setPaymentSettings] = useState<PaymentSettings>(getStoredPaymentSettings());
  const [subscriptionPlans, setSubscriptionPlans] = useState<SubscriptionPlan[]>(getStoredSubscriptionPlans());
  const [subscriptionOrders, setSubscriptionOrders] = useState<SubscriptionOrder[]>(getStoredSubscriptionOrders());
  const [paymentSavedAlert, setPaymentSavedAlert] = useState(false);

  // Drama Modal State
  const [editingDrama, setEditingDrama] = useState<Drama | null>(null);
  const [isDramaModalOpen, setIsDramaModalOpen] = useState(false);

  // Episode Management State
  const [selectedDramaForEpisodes, setSelectedDramaForEpisodes] = useState<string>(dramas[0]?.id || '');
  const [newEpNum, setNewEpNum] = useState<number>(1);
  const [newEpTitle, setNewEpTitle] = useState('');
  const [newEpUrl, setNewEpUrl] = useState('');
  const [newEpType, setNewEpType] = useState<'mp4' | 'youtube' | 'iframe'>('mp4');
  const [newEpDuration, setNewEpDuration] = useState('1:45');
  const [newEpAccessType, setNewEpAccessType] = useState<EpisodeAccessType>('ad');
  const [episodeSuccessMsg, setEpisodeSuccessMsg] = useState('');
  const [previewVideoUrl, setPreviewVideoUrl] = useState<string | null>(null);

  // Edit Single Episode Modal State
  const [editingEpisode, setEditingEpisode] = useState<Episode | null>(null);
  const [isEditEpisodeModalOpen, setIsEditEpisodeModalOpen] = useState(false);

  // Blogger exporter state
  const [copiedBloggerIframe, setCopiedBloggerIframe] = useState(false);
  const [copiedBloggerTheme, setCopiedBloggerTheme] = useState(false);
  const [copiedStandaloneHtml, setCopiedStandaloneHtml] = useState(false);
  const [customBloggerHostUrl, setCustomBloggerHostUrl] = useState('');

  const downloadFile = (filename: string, content: string, mimeType = 'text/html') => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Drama search in admin
  const [dramaSearch, setDramaSearch] = useState('');

  // ImgBB thumbnail helper state
  const [imgbbHelperInput, setImgbbHelperInput] = useState('');

  // Handle Firebase Save & Test
  const handleSaveFirebase = async () => {
    saveStoredFirebaseConfig(fbConfig);
    setFbTestLoading(true);
    setFbTestResult(null);
    try {
      const result = await testFirebaseConnection(fbConfig);
      setFbTestResult(result);
    } catch (e: any) {
      setFbTestResult({ success: false, message: e?.message || 'Firebase Connection Error' });
    } finally {
      setFbTestLoading(false);
    }
  };

  // Handle Monetag Save
  const handleSaveMonetag = () => {
    saveStoredMonetagConfig(monetagConfig);
    setMonetagSavedAlert(true);
    setTimeout(() => setMonetagSavedAlert(false), 3000);
  };

  // Handle Payment Settings Save
  const handleSavePaymentSettings = () => {
    saveStoredPaymentSettings(paymentSettings);
    saveStoredSubscriptionPlans(subscriptionPlans);
    setPaymentSavedAlert(true);
    setTimeout(() => setPaymentSavedAlert(false), 3000);
  };

  // Update order status
  const handleUpdateOrderStatus = (orderId: string, status: 'approved' | 'rejected') => {
    const updated = subscriptionOrders.map(o => o.id === orderId ? { ...o, status } : o);
    setSubscriptionOrders(updated);
    saveStoredSubscriptionOrders(updated);
  };

  // Open modal for new drama
  const handleAddNewDrama = () => {
    const newDrama: Drama = {
      id: `drama-${Date.now()}`,
      title: 'New Drama Title',
      titleBn: 'নতুন ড্রামার নাম',
      titleHi: 'नया ड्रामा',
      slug: `drama-${Date.now()}`,
      language: 'Hindi',
      description: 'Storyline description...',
      views: '10.5K Views',
      totalEpisodes: 10,
      genres: ['Action', 'Romance'],
      category: 'Indian',
      poster: DEFAULT_POSTER_FALLBACK,
      banner: DEFAULT_BANNER_FALLBACK,
      isFeaturedHero: false,
      isPopular: true,
      isNew: true,
      isComingSoon: false,
      episodes: [
        {
          id: `ep-${Date.now()}-1`,
          episodeNumber: 1,
          title: 'Episode 1: The Beginning',
          videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
          videoType: 'mp4',
          duration: '1:45',
          isLocked: false,
          views: '10.5K'
        }
      ]
    };
    setEditingDrama(newDrama);
    setIsDramaModalOpen(true);
  };

  // Save Drama from Modal (with clean image URLs)
  const handleSaveDramaModal = async (dramaToSave: Drama) => {
    const sanitizedDrama: Drama = {
      ...dramaToSave,
      poster: getCleanImageUrl(dramaToSave.poster, DEFAULT_POSTER_FALLBACK),
      banner: getCleanImageUrl(dramaToSave.banner, DEFAULT_BANNER_FALLBACK)
    };

    const existingIndex = dramas.findIndex(d => d.id === sanitizedDrama.id);
    let updated: Drama[];
    if (existingIndex >= 0) {
      updated = [...dramas];
      updated[existingIndex] = sanitizedDrama;
    } else {
      updated = [sanitizedDrama, ...dramas];
    }
    onUpdateDramas(updated);
    await saveDramasToStorage(updated);
    setIsDramaModalOpen(false);
    setEditingDrama(null);
  };

  // Delete Drama
  const handleDeleteDrama = async (dramaId: string) => {
    if (confirm('Delete this drama?')) {
      const updated = dramas.filter(d => d.id !== dramaId);
      onUpdateDramas(updated);
      await saveDramasToStorage(updated);
    }
  };

  // Add Episode to current selected drama (ROBUST & AUTO-CLEANED)
  const handleAddEpisode = async () => {
    if (!newEpUrl.trim()) {
      alert(appLanguage === 'bn' ? 'দয়া করে ভিডিও লিংক দিন।' : 'Please enter a video URL.');
      return;
    }

    // Determine target drama
    let targetDramaId = selectedDramaForEpisodes;
    if (!targetDramaId && dramas.length > 0) {
      targetDramaId = dramas[0].id;
      setSelectedDramaForEpisodes(targetDramaId);
    }

    const drama = dramas.find(d => d.id === targetDramaId);
    if (!drama) {
      alert(appLanguage === 'bn' ? 'দয়া করে প্রথমে একটি ড্রামা সিলেক্ট করুন।' : 'Please select a drama first.');
      return;
    }

    // Automatically clean video source & detect type (YouTube, MP4, Drive iframe, etc.)
    const { url: cleanedVideoUrl, type: detectedType } = getCleanVideoSource(newEpUrl.trim());
    const finalType = newEpType || detectedType;
    const finalTitle = newEpTitle.trim() || `Episode ${newEpNum}`;

    const newEp: Episode = {
      id: `ep-${drama.id}-${Date.now()}`,
      episodeNumber: newEpNum,
      title: finalTitle,
      videoUrl: cleanedVideoUrl,
      videoType: finalType,
      duration: newEpDuration.trim() || '1:45',
      isLocked: newEpAccessType !== 'free',
      accessType: newEpAccessType,
      views: '1.2K'
    };

    const currentEps = drama.episodes || [];
    const updatedEpisodes = [...currentEps, newEp].sort((a, b) => a.episodeNumber - b.episodeNumber);
    const updatedDrama: Drama = {
      ...drama,
      totalEpisodes: Math.max(drama.totalEpisodes, updatedEpisodes.length),
      episodes: updatedEpisodes
    };

    const updatedDramas = dramas.map(d => d.id === drama.id ? updatedDrama : d);
    onUpdateDramas(updatedDramas);
    await saveDramasToStorage(updatedDramas);

    // Set next episode defaults
    const nextNum = updatedEpisodes.length + 1;
    setNewEpNum(nextNum);
    setNewEpTitle(`Episode ${nextNum}`);
    setNewEpUrl('');

    setEpisodeSuccessMsg(
      appLanguage === 'bn'
        ? `✅ পর্ব ${newEp.episodeNumber} (${finalTitle}) সফলভাবে যোগ করা হয়েছে!`
        : `✅ Episode ${newEp.episodeNumber} added successfully!`
    );
    setTimeout(() => setEpisodeSuccessMsg(''), 4000);
  };

  // Change individual episode access type (Free / Ad Unlock / Premium)
  const handleInlineChangeAccessType = async (dramaId: string, episodeId: string, newAccess: EpisodeAccessType) => {
    const drama = dramas.find(d => d.id === dramaId);
    if (!drama) return;

    const updatedEpisodes = (drama.episodes || []).map(ep => {
      if (ep.id === episodeId) {
        return {
          ...ep,
          accessType: newAccess,
          isLocked: newAccess !== 'free'
        };
      }
      return ep;
    });

    const updatedDrama = { ...drama, episodes: updatedEpisodes };
    const updatedDramas = dramas.map(d => d.id === dramaId ? updatedDrama : d);
    onUpdateDramas(updatedDramas);
    await saveDramasToStorage(updatedDramas);

    setEpisodeSuccessMsg(
      appLanguage === 'bn'
        ? `✅ পর্বের অ্যাক্সেস (${newAccess === 'free' ? 'ফ্রি' : newAccess === 'ad' ? 'অ্যাড দেখে আনলক' : 'প্রিমিয়াম'}) করা হয়েছে!`
        : `✅ Episode access updated to ${newAccess}!`
    );
    setTimeout(() => setEpisodeSuccessMsg(''), 3000);
  };

  // Bulk set all episodes access type (All Free / All Ad / All Premium)
  const handleBulkSetAccess = async (dramaId: string, accessType: EpisodeAccessType) => {
    const drama = dramas.find(d => d.id === dramaId);
    if (!drama) return;

    const updatedEpisodes = (drama.episodes || []).map(ep => ({
      ...ep,
      accessType,
      isLocked: accessType !== 'free'
    }));

    const updatedDrama = { ...drama, episodes: updatedEpisodes };
    const updatedDramas = dramas.map(d => d.id === dramaId ? updatedDrama : d);
    onUpdateDramas(updatedDramas);
    await saveDramasToStorage(updatedDramas);

    setEpisodeSuccessMsg(
      appLanguage === 'bn'
        ? `✅ সব পর্ব একসাথে ${accessType === 'free' ? 'ফ্রি' : accessType === 'ad' ? 'অ্যাড দেখে আনলক' : 'প্রিমিয়াম'} করা হয়েছে!`
        : `✅ All episodes set to ${accessType}!`
    );
    setTimeout(() => setEpisodeSuccessMsg(''), 4000);
  };

  // Smart mix access (1-3 Free, 4-10 Ad Unlock, 11+ Premium)
  const handleSmartMixAccess = async (dramaId: string) => {
    const drama = dramas.find(d => d.id === dramaId);
    if (!drama) return;

    const updatedEpisodes = (drama.episodes || []).map(ep => {
      let access: EpisodeAccessType = 'free';
      if (ep.episodeNumber > 10) {
        access = 'premium';
      } else if (ep.episodeNumber > 3) {
        access = 'ad';
      } else {
        access = 'free';
      }
      return {
        ...ep,
        accessType: access,
        isLocked: access !== 'free'
      };
    });

    const updatedDrama = { ...drama, episodes: updatedEpisodes };
    const updatedDramas = dramas.map(d => d.id === dramaId ? updatedDrama : d);
    onUpdateDramas(updatedDramas);
    await saveDramasToStorage(updatedDramas);

    setEpisodeSuccessMsg(
      appLanguage === 'bn'
        ? `✅ স্মার্ট মিক্স সেট হয়েছে: পর্ব ১-৩ ফ্রি, ৪-১০ অ্যাড দেখে আনলক, ১১+ প্রিমিয়াম ভিআইপি!`
        : `✅ Smart mix applied: Ep 1-3 Free, 4-10 Ad, 11+ Premium!`
    );
    setTimeout(() => setEpisodeSuccessMsg(''), 4000);
  };

  // Save changes to single episode from Edit Episode Modal
  const handleSaveEditEpisode = async () => {
    if (!editingEpisode) return;
    const drama = dramas.find(d => d.id === selectedDramaForEpisodes) || dramas[0];
    if (!drama) return;

    const { url: cleanedVideoUrl, type: detectedType } = getCleanVideoSource(editingEpisode.videoUrl.trim());
    const finalType = editingEpisode.videoType || detectedType;

    const sanitizedEp: Episode = {
      ...editingEpisode,
      videoUrl: cleanedVideoUrl,
      videoType: finalType,
      isLocked: editingEpisode.accessType !== 'free'
    };

    const updatedEpisodes = (drama.episodes || []).map(ep =>
      ep.id === sanitizedEp.id ? sanitizedEp : ep
    );

    const updatedDrama = { ...drama, episodes: updatedEpisodes };
    const updatedDramas = dramas.map(d => d.id === drama.id ? updatedDrama : d);
    onUpdateDramas(updatedDramas);
    await saveDramasToStorage(updatedDramas);

    setIsEditEpisodeModalOpen(false);
    setEditingEpisode(null);
    setEpisodeSuccessMsg(
      appLanguage === 'bn'
        ? `✅ পর্ব ${sanitizedEp.episodeNumber} এর তথ্য সফলভাবে সেভ হয়েছে!`
        : `✅ Episode ${sanitizedEp.episodeNumber} updated successfully!`
    );
    setTimeout(() => setEpisodeSuccessMsg(''), 3500);
  };

  // Delete episode
  const handleDeleteEpisode = async (dramaId: string, episodeId: string) => {
    const drama = dramas.find(d => d.id === dramaId);
    if (!drama) return;

    const updatedEpisodes = (drama.episodes || []).filter(e => e.id !== episodeId);
    const updatedDrama = { ...drama, episodes: updatedEpisodes };
    const updatedDramas = dramas.map(d => d.id === drama.id ? updatedDrama : d);
    onUpdateDramas(updatedDramas);
    await saveDramasToStorage(updatedDramas);
  };

  const currentEpisodesDrama = dramas.find(d => d.id === selectedDramaForEpisodes) || dramas[0];

  const filteredDramas = dramas.filter(d =>
    d.title.toLowerCase().includes(dramaSearch.toLowerCase()) ||
    (d.titleBn && d.titleBn.toLowerCase().includes(dramaSearch.toLowerCase())) ||
    (d.titleHi && d.titleHi.toLowerCase().includes(dramaSearch.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-[#0a0b0f] text-slate-100 flex flex-col font-sans">
      {/* Admin Header with 3-Language switcher */}
      <header className="h-16 bg-[#10121a] border-b border-white/10 px-4 sm:px-6 lg:px-8 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-rose-600 flex items-center justify-center font-black text-white shadow-md">
            AD
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
              <span>{t.adminHeaderTitle}</span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
                VIP bKash & Nagad Active
              </span>
            </h1>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              {t.adminHeaderDesc}
            </p>
          </div>
        </div>

        {/* Right language toggle & switch to User Mode button */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center bg-[#161822] p-0.5 rounded-lg border border-white/10 text-xs">
            <button
              onClick={() => onAppLanguageChange('bn')}
              className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                appLanguage === 'bn' ? 'bg-[#ff2a5f] text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              বাংলা
            </button>
            <button
              onClick={() => onAppLanguageChange('en')}
              className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                appLanguage === 'en' ? 'bg-[#ff2a5f] text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              English
            </button>
            <button
              onClick={() => onAppLanguageChange('hi')}
              className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                appLanguage === 'hi' ? 'bg-[#ff2a5f] text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              हिन्दी
            </button>
          </div>

          {/* Admin Email Badge */}
          <span className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-slate-300">
            <Mail className="w-3.5 h-3.5 text-rose-400" />
            <span className="font-mono text-[11px] font-semibold">{getStoredAdminCredentials().email}</span>
          </span>

          {/* Switch to User View */}
          <button
            onClick={onCloseAdmin}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-all shadow cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t.userMode}</span>
          </button>

          {/* Admin Logout Button */}
          <button
            onClick={() => {
              setAdminLoggedInSession(false);
              onCloseAdmin();
            }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/30 text-xs font-bold transition-all shadow cursor-pointer"
            title="Admin Logout"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>লগআউট (Logout)</span>
          </button>
        </div>
      </header>

      {/* Admin Tab Navigation */}
      <div className="bg-[#121420] border-b border-white/5 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto no-scrollbar py-2 text-xs sm:text-sm font-semibold">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors cursor-pointer shrink-0 ${
              activeTab === 'dashboard'
                ? 'bg-[#ff2a5f] text-white shadow'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>{t.adminDashboard}</span>
          </button>

          <button
            onClick={() => setActiveTab('dramas')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors cursor-pointer shrink-0 ${
              activeTab === 'dramas'
                ? 'bg-[#ff2a5f] text-white shadow'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Film className="w-4 h-4" />
            <span>{t.adminDramas} ({dramas.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('episodes')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors cursor-pointer shrink-0 ${
              activeTab === 'episodes'
                ? 'bg-[#ff2a5f] text-white shadow'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Video className="w-4 h-4" />
            <span>{t.adminEpisodes}</span>
          </button>

          {/* NEW: PREMIUM & BKASH / NAGAD PAYMENT TAB */}
          <button
            onClick={() => setActiveTab('subscription')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors cursor-pointer shrink-0 ${
              activeTab === 'subscription'
                ? 'bg-gradient-to-r from-amber-500 to-rose-500 text-slate-950 font-black shadow'
                : 'text-amber-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Crown className="w-4 h-4 text-amber-400" />
            <span>👑 বিকাশ ও নগদ সাবস্ক্রিপশন (VIP Payments)</span>
          </button>

          {/* MONETAG ADS TAB */}
          <button
            onClick={() => setActiveTab('monetag')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors cursor-pointer shrink-0 ${
              activeTab === 'monetag'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow'
                : 'text-emerald-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <DollarSign className="w-4 h-4 text-emerald-300" />
            <span>{t.adminMonetag}</span>
          </button>

          <button
            onClick={() => setActiveTab('firebase')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors cursor-pointer shrink-0 ${
              activeTab === 'firebase'
                ? 'bg-amber-600 text-white shadow'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>{t.adminFirebase}</span>
          </button>

          <button
            onClick={() => setActiveTab('blogger')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors cursor-pointer shrink-0 ${
              activeTab === 'blogger'
                ? 'bg-gradient-to-r from-orange-500 to-rose-500 text-white shadow'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Code className="w-4 h-4" />
            <span>{t.adminBlogger}</span>
          </button>
        </div>
      </div>

      {/* Tab Content Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
        {/* ================= TAB 1: DASHBOARD ================= */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-[#151722] p-5 rounded-2xl border border-white/5 space-y-2">
                <span className="text-xs text-slate-400 font-medium">{t.totalDramas}</span>
                <div className="text-3xl font-black text-white">{dramas.length}</div>
                <div className="text-[11px] text-emerald-400 flex items-center gap-1 font-semibold">
                  <Sparkles className="w-3 h-3" /> {t.livePublished}
                </div>
              </div>

              <div className="bg-[#151722] p-5 rounded-2xl border border-white/5 space-y-2">
                <span className="text-xs text-slate-400 font-medium">{t.totalEpisodes}</span>
                <div className="text-3xl font-black text-rose-400">
                  {dramas.reduce((acc, d) => acc + (d.episodes?.length || 0), 0)}
                </div>
                <div className="text-[11px] text-slate-400">Short Video Episodes</div>
              </div>

              <div className="bg-[#151722] p-5 rounded-2xl border border-white/5 space-y-2">
                <span className="text-xs text-slate-400 font-medium">বিকাশ ও নগদ পেমেন্ট</span>
                <div className="text-lg font-bold text-amber-400 flex items-center gap-1.5 pt-1">
                  <Crown className="w-4 h-4 fill-amber-400" />
                  <span>VIP Subscriptions</span>
                </div>
                <div className="text-[11px] text-slate-400">
                  bKash: {paymentSettings.bkashNumber}
                </div>
              </div>

              <div className="bg-[#151722] p-5 rounded-2xl border border-white/5 space-y-2">
                <span className="text-xs text-slate-400 font-medium">{t.monetagStatus}</span>
                <div className="text-xl font-bold text-emerald-400 flex items-center gap-1.5 pt-1">
                  <span className={`w-3 h-3 rounded-full ${monetagConfig.enabled ? 'bg-emerald-500 animate-pulse' : 'bg-slate-500'}`} />
                  <span>{monetagConfig.enabled ? t.activeMonetag : t.disabledMonetag}</span>
                </div>
                <div className="text-[11px] text-slate-400">
                  Direct Link & Interstitial
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-r from-rose-950/40 to-slate-900 p-6 rounded-2xl border border-rose-500/20 flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Flame className="w-5 h-5 text-[#ff2a5f]" />
                  <span>{t.quickActions}</span>
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  ড্রামা যোগ করুন, বিকাশ/নগদ পেমেন্ট নম্বর সেট করুন এবং ভিডিও লিংক টেস্ট করুন।
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={handleAddNewDrama}
                  className="px-4 py-2.5 rounded-xl bg-[#ff2a5f] hover:bg-[#e11d48] text-white text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>{t.addNewDrama}</span>
                </button>

                <button
                  onClick={() => setActiveTab('subscription')}
                  className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer"
                >
                  <Crown className="w-4 h-4 fill-slate-950" />
                  <span>বিকাশ/নগদ নাম্বার সেট করুন</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 2: DRAMAS MANAGER ================= */}
        {activeTab === 'dramas' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={dramaSearch}
                  onChange={(e) => setDramaSearch(e.target.value)}
                  placeholder="Search dramas..."
                  className="w-full bg-[#151722] text-xs text-white pl-9 pr-4 py-2 rounded-xl border border-white/10 focus:outline-none focus:border-[#ff2a5f]"
                />
              </div>

              <button
                onClick={handleAddNewDrama}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#ff2a5f] hover:bg-[#e11d48] text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>{t.addNewDrama}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredDramas.map((drama) => (
                <div
                  key={drama.id}
                  className="bg-[#151722] rounded-2xl border border-white/5 p-4 flex gap-4 hover:border-white/20 transition-all group"
                >
                  <img
                    src={getCleanImageUrl(drama.poster)}
                    alt={drama.title}
                    onError={(e) => { (e.target as HTMLImageElement).src = DEFAULT_POSTER_FALLBACK; }}
                    className="w-20 h-28 object-cover rounded-xl shrink-0 bg-slate-800"
                  />
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <h4 className="text-sm font-bold text-white truncate">
                        {drama.title}
                      </h4>
                      {drama.titleBn && (
                        <p className="text-xs text-rose-400 truncate font-medium">
                          {drama.titleBn}
                        </p>
                      )}
                      <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1">
                        <span>{drama.language}</span>
                        <span>•</span>
                        <span>{drama.episodes?.length || drama.totalEpisodes} {t.episodesText}</span>
                        <span>•</span>
                        <span className="text-rose-400 font-semibold">{drama.views}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                      <button
                        onClick={() => {
                          setEditingDrama(drama);
                          setIsDramaModalOpen(true);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Edit className="w-3 h-3 text-rose-400" />
                        <span>Edit</span>
                      </button>

                      <button
                        onClick={() => {
                          setSelectedDramaForEpisodes(drama.id);
                          setActiveTab('episodes');
                        }}
                        className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Video className="w-3 h-3 text-amber-400" />
                        <span>{t.episodes} ({drama.episodes?.length || 0})</span>
                      </button>

                      <button
                        onClick={() => handleDeleteDrama(drama.id)}
                        className="p-1 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors ml-auto cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB 3: EPISODES MANAGER (FIXED WITH DIRECT TEST & AUTO-DETECT) ================= */}
        {activeTab === 'episodes' && (
          <div className="space-y-6">
            <div className="bg-[#151722] p-4 rounded-2xl border border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="w-full sm:w-auto">
                <label className="text-xs font-semibold text-slate-400 block mb-1">
                  {t.selectDrama}:
                </label>
                <select
                  value={selectedDramaForEpisodes}
                  onChange={(e) => {
                    setSelectedDramaForEpisodes(e.target.value);
                    const selected = dramas.find(d => d.id === e.target.value);
                    const nextNum = (selected?.episodes?.length || 0) + 1;
                    setNewEpNum(nextNum);
                    setNewEpTitle(`Episode ${nextNum}`);
                  }}
                  className="bg-[#11131c] text-white text-xs font-bold px-3 py-2 rounded-xl border border-white/10 focus:outline-none focus:border-[#ff2a5f] w-full sm:w-80 cursor-pointer"
                >
                  {dramas.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.title} ({d.episodes?.length || 0} {t.episodesText})
                    </option>
                  ))}
                </select>
              </div>

              {currentEpisodesDrama && (
                <div className="text-xs text-slate-300 flex items-center gap-3">
                  <img
                    src={getCleanImageUrl(currentEpisodesDrama.poster)}
                    alt=""
                    onError={(e) => { (e.target as HTMLImageElement).src = DEFAULT_POSTER_FALLBACK; }}
                    className="w-8 h-11 object-cover rounded-md"
                  />
                  <div>
                    <div className="font-bold text-white">{currentEpisodesDrama.title}</div>
                    <div className="text-slate-400">{currentEpisodesDrama.language} • {currentEpisodesDrama.episodes?.length || 0} {t.episodesText}</div>
                  </div>
                </div>
              )}
            </div>

            {/* Add New Episode Form */}
            <div className="bg-[#151722] p-5 rounded-2xl border border-rose-500/20 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <ListPlus className="w-4 h-4 text-[#ff2a5f]" />
                <span>{t.addNewEpisode}</span>
              </h3>

              {episodeSuccessMsg && (
                <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{episodeSuccessMsg}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 text-xs">
                <div>
                  <label className="text-slate-400 block mb-1 font-medium">{t.episodeNumber}</label>
                  <input
                    type="number"
                    value={newEpNum}
                    onChange={(e) => setNewEpNum(parseInt(e.target.value) || 1)}
                    className="w-full bg-[#10121a] text-white px-3 py-2 rounded-xl border border-white/10"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1 font-medium">{t.episodeTitle}</label>
                  <input
                    type="text"
                    value={newEpTitle}
                    onChange={(e) => setNewEpTitle(e.target.value)}
                    placeholder={`Episode ${newEpNum}`}
                    className="w-full bg-[#10121a] text-white px-3 py-2 rounded-xl border border-white/10"
                  />
                </div>

                <div>
                  <label className="text-amber-400 block mb-1 font-bold flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    <span>{t.accessTypeLabel}</span>
                  </label>
                  <select
                    value={newEpAccessType}
                    onChange={(e) => setNewEpAccessType(e.target.value as EpisodeAccessType)}
                    className="w-full bg-[#10121a] text-white px-3 py-2 rounded-xl border border-amber-500/30 font-bold focus:border-amber-400 cursor-pointer"
                  >
                    <option value="free">🟢 {t.typeFree}</option>
                    <option value="ad">🟡 {t.typeAd}</option>
                    <option value="premium">👑 {t.typePremium}</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1 font-medium">{t.videoType}</label>
                  <select
                    value={newEpType}
                    onChange={(e) => setNewEpType(e.target.value as any)}
                    className="w-full bg-[#10121a] text-white px-3 py-2 rounded-xl border border-white/10 cursor-pointer"
                  >
                    <option value="mp4">Direct MP4 Video Link</option>
                    <option value="youtube">YouTube / YouTube Shorts</option>
                    <option value="iframe">Iframe / Google Drive / Blogger Embed</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1 font-medium">{t.duration}</label>
                  <input
                    type="text"
                    value={newEpDuration}
                    onChange={(e) => setNewEpDuration(e.target.value)}
                    placeholder="1:45"
                    className="w-full bg-[#10121a] text-white px-3 py-2 rounded-xl border border-white/10"
                  />
                </div>

                <div className="sm:col-span-3 md:col-span-4">
                  <label className="text-slate-200 block mb-1 font-bold">
                    ভিডিও লিংক / MP4 / YouTube / Google Drive লিংক:
                  </label>
                  <input
                    type="text"
                    value={newEpUrl}
                    onChange={(e) => setNewEpUrl(e.target.value)}
                    placeholder="https://...mp4 অথবা https://youtu.be/... অথবা https://drive.google.com/file/d/.../view"
                    className="w-full bg-[#10121a] text-white px-3.5 py-2.5 rounded-xl border border-white/10 font-mono focus:border-[#ff2a5f]"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    💡 যেকোনো MP4 ভিডিও লিংক, ইউটিউব লিংক, বা গুগল ড্রাইভ লিংক পেস্ট করুন। এটি স্বয়ংক্রিয়ভাবে ভিডিওতে কনভার্ট হয়ে যাবে।
                  </p>
                </div>

                <div className="flex items-end sm:col-span-2 md:col-span-1">
                  <button
                    onClick={handleAddEpisode}
                    className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#ff2a5f] to-rose-600 hover:from-[#e11d48] hover:to-rose-700 text-white font-bold transition-all shadow-lg flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>পর্ব সেভ করুন</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Current Episodes Table with Video Preview and Bulk Actions */}
            <div className="bg-[#151722] rounded-2xl border border-white/5 overflow-hidden">
              <div className="p-4 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>{t.existingEpisodes} ({currentEpisodesDrama?.episodes?.length || 0})</span>
                  <span className="text-[11px] text-slate-400 font-normal">
                    — প্রতিটি পর্বের অ্যাক্সেস নিচে সরাসরি পরিবর্তন করতে পারবেন
                  </span>
                </h3>

                {/* Bulk Actions for fast configuration */}
                {currentEpisodesDrama && (
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[11px] text-slate-400 font-semibold mr-1">{t.bulkActionTitle}</span>
                    <button
                      onClick={() => handleBulkSetAccess(currentEpisodesDrama.id, 'free')}
                      className="px-2.5 py-1 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold cursor-pointer transition-colors"
                      title="Mark all episodes Free"
                    >
                      🟢 {t.allFree}
                    </button>
                    <button
                      onClick={() => handleBulkSetAccess(currentEpisodesDrama.id, 'ad')}
                      className="px-2.5 py-1 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 text-[11px] font-bold cursor-pointer transition-colors"
                      title="Mark all episodes Watch Ad to Unlock"
                    >
                      🟡 {t.allAd}
                    </button>
                    <button
                      onClick={() => handleBulkSetAccess(currentEpisodesDrama.id, 'premium')}
                      className="px-2.5 py-1 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 text-[11px] font-bold cursor-pointer transition-colors"
                      title="Mark all episodes Premium VIP"
                    >
                      👑 {t.allPremium}
                    </button>
                    <button
                      onClick={() => handleSmartMixAccess(currentEpisodesDrama.id)}
                      className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 text-[11px] font-bold cursor-pointer transition-colors"
                      title="Ep 1-3 Free, 4-10 Ad Unlock, 11+ Premium"
                    >
                      ✨ {t.smartMix}
                    </button>
                  </div>
                )}
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#11131c] text-slate-400 font-semibold border-b border-white/5">
                    <tr>
                      <th className="p-3">#</th>
                      <th className="p-3">Title</th>
                      <th className="p-3">অ্যাক্সেস টাইপ (Access)</th>
                      <th className="p-3">Video URL</th>
                      <th className="p-3">Type</th>
                      <th className="p-3">Duration</th>
                      <th className="p-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {currentEpisodesDrama?.episodes?.map((ep) => {
                      const epAccess = getEpisodeAccessType(ep);
                      return (
                        <tr key={ep.id} className="hover:bg-white/5 transition-colors">
                          <td className="p-3 font-bold text-rose-400 whitespace-nowrap">Ep {ep.episodeNumber}</td>
                          <td className="p-3 font-semibold text-white max-w-[180px] truncate">{ep.title}</td>
                          
                          {/* INLINE ACCESS SELECTOR */}
                          <td className="p-3 whitespace-nowrap">
                            <select
                              value={epAccess}
                              onChange={(e) => handleInlineChangeAccessType(currentEpisodesDrama.id, ep.id, e.target.value as EpisodeAccessType)}
                              className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                                epAccess === 'free'
                                  ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                                  : epAccess === 'ad'
                                  ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                                  : 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                              }`}
                            >
                              <option value="free">🟢 {t.typeFree}</option>
                              <option value="ad">🟡 {t.typeAd}</option>
                              <option value="premium">👑 {t.typePremium}</option>
                            </select>
                          </td>

                          <td className="p-3 text-slate-400 max-w-xs truncate font-mono text-[11px]">{ep.videoUrl}</td>
                          <td className="p-3 uppercase text-[10px] font-mono text-slate-300">{ep.videoType}</td>
                          <td className="p-3 text-slate-300 whitespace-nowrap">{ep.duration}</td>
                          <td className="p-3 text-right space-x-1.5 whitespace-nowrap">
                            <button
                              onClick={() => setPreviewVideoUrl(ep.videoUrl)}
                              className="text-rose-400 hover:text-white p-1 rounded bg-white/5 hover:bg-rose-600 transition-colors inline-flex items-center gap-1 text-[11px] font-semibold cursor-pointer"
                              title="Preview Video"
                            >
                              <Play className="w-3 h-3 fill-rose-400" />
                              <span>প্লে</span>
                            </button>
                            <button
                              onClick={() => {
                                setEditingEpisode({ ...ep, accessType: epAccess });
                                setIsEditEpisodeModalOpen(true);
                              }}
                              className="text-slate-300 hover:text-white p-1 rounded bg-white/5 hover:bg-white/10 transition-colors inline-flex items-center gap-1 text-[11px] font-semibold cursor-pointer"
                              title="Edit Episode"
                            >
                              <Edit className="w-3 h-3 text-amber-400" />
                              <span>এডিট</span>
                            </button>
                            <button
                              onClick={() => handleDeleteEpisode(currentEpisodesDrama.id, ep.id)}
                              className="text-slate-400 hover:text-red-400 p-1 rounded hover:bg-white/5 transition-colors cursor-pointer"
                              title="Delete Episode"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Video Preview Modal inside Admin */}
            {previewVideoUrl && (
              <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
                <div className="bg-[#121420] border border-white/10 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl p-4">
                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <span className="font-bold text-white text-xs">ভিডিও টেস্ট প্রিভিউ (Video Preview)</span>
                    <button onClick={() => setPreviewVideoUrl(null)} className="text-slate-400 hover:text-white">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="aspect-[16/9] w-full mt-3 bg-black rounded-xl overflow-hidden">
                    {previewVideoUrl.includes('youtube.com') || previewVideoUrl.includes('youtu.be') ? (
                      <iframe src={previewVideoUrl} className="w-full h-full border-0" allowFullScreen />
                    ) : previewVideoUrl.includes('<iframe') ? (
                      <div dangerouslySetInnerHTML={{ __html: previewVideoUrl }} className="w-full h-full" />
                    ) : (
                      <video src={previewVideoUrl} controls autoPlay className="w-full h-full object-contain" />
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 4: PREMIUM SUBSCRIPTION & BKASH / NAGAD PAYMENT ================= */}
        {activeTab === 'subscription' && (
          <div className="space-y-6 max-w-4xl">
            {/* bKash & Nagad Numbers Setup */}
            <div className="bg-[#151722] p-6 rounded-2xl border border-amber-500/20 space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Crown className="w-5 h-5 text-amber-400" />
                    <span>👑 বিকাশ ও নগদ পেমেন্ট গেটওয়ে কনফিগারেশন</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    ইউজাররা সাবস্ক্রিপশন কেনার জন্য এই বিকাশ ও নগদ নম্বরে টাকা পাঠাবে।
                  </p>
                </div>

                <div className="flex items-center gap-2 bg-[#10121a] px-3 py-1.5 rounded-xl border border-white/10">
                  <span className="text-xs text-slate-300 font-semibold">পেমেন্ট সক্রিয়:</span>
                  <input
                    type="checkbox"
                    checked={paymentSettings.enabled}
                    onChange={(e) => setPaymentSettings({ ...paymentSettings, enabled: e.target.checked })}
                    className="w-5 h-5 accent-amber-500 cursor-pointer"
                  />
                </div>
              </div>

              {paymentSavedAlert && (
                <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-semibold flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>বিকাশ ও নগদ পেমেন্ট সেটিংস সফলভাবে সেভ হয়েছে!</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                {/* bKash Setting */}
                <div className="bg-[#10121a] p-4 rounded-xl border border-[#e2136e]/30 space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-[#e2136e] flex items-center justify-center font-black text-white text-xs">
                      বি
                    </div>
                    <span className="font-bold text-white text-sm">বিকাশ সেটিংস (bKash)</span>
                  </div>

                  <div>
                    <label className="text-slate-300 block mb-1 font-semibold">বিকাশ মোবাইল নম্বর:</label>
                    <input
                      type="text"
                      value={paymentSettings.bkashNumber}
                      onChange={(e) => setPaymentSettings({ ...paymentSettings, bkashNumber: e.target.value })}
                      placeholder="017XXXXXXXX"
                      className="w-full bg-[#151722] text-white px-3 py-2 rounded-xl border border-white/10 font-mono text-sm font-bold focus:border-[#e2136e]"
                    />
                  </div>

                  <div>
                    <label className="text-slate-300 block mb-1 font-semibold">একাউন্টের ধরণ:</label>
                    <select
                      value={paymentSettings.bkashType}
                      onChange={(e) => setPaymentSettings({ ...paymentSettings, bkashType: e.target.value as any })}
                      className="w-full bg-[#151722] text-white px-3 py-2 rounded-xl border border-white/10"
                    >
                      <option value="Personal">Personal (Send Money)</option>
                      <option value="Merchant">Merchant (Payment)</option>
                      <option value="Agent">Agent (Cash Out)</option>
                    </select>
                  </div>
                </div>

                {/* Nagad Setting */}
                <div className="bg-[#10121a] p-4 rounded-xl border border-[#f7941d]/30 space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-[#f7941d] flex items-center justify-center font-black text-slate-950 text-xs">
                      ন
                    </div>
                    <span className="font-bold text-white text-sm">নগদ সেটিংস (Nagad)</span>
                  </div>

                  <div>
                    <label className="text-slate-300 block mb-1 font-semibold">নগদ মোবাইল নম্বর:</label>
                    <input
                      type="text"
                      value={paymentSettings.nagadNumber}
                      onChange={(e) => setPaymentSettings({ ...paymentSettings, nagadNumber: e.target.value })}
                      placeholder="019XXXXXXXX"
                      className="w-full bg-[#151722] text-white px-3 py-2 rounded-xl border border-white/10 font-mono text-sm font-bold focus:border-[#f7941d]"
                    />
                  </div>

                  <div>
                    <label className="text-slate-300 block mb-1 font-semibold">একাউন্টের ধরণ:</label>
                    <select
                      value={paymentSettings.nagadType}
                      onChange={(e) => setPaymentSettings({ ...paymentSettings, nagadType: e.target.value as any })}
                      className="w-full bg-[#151722] text-white px-3 py-2 rounded-xl border border-white/10"
                    >
                      <option value="Personal">Personal (Send Money)</option>
                      <option value="Merchant">Merchant (Payment)</option>
                      <option value="Agent">Agent (Cash Out)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Payment Instructions */}
              <div className="text-xs space-y-2">
                <label className="text-slate-300 block font-semibold">ইউজারদের জন্য পেমেন্ট নির্দেশিকা (বাংলা):</label>
                <textarea
                  rows={2}
                  value={paymentSettings.instructionsBn}
                  onChange={(e) => setPaymentSettings({ ...paymentSettings, instructionsBn: e.target.value })}
                  className="w-full bg-[#10121a] text-white px-3 py-2 rounded-xl border border-white/10"
                />
              </div>

              <div className="pt-1">
                <button
                  onClick={handleSavePaymentSettings}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-600 hover:to-rose-700 text-slate-950 font-black text-xs shadow-lg flex items-center gap-2 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>বিকাশ ও নগদ নাম্বার সেভ করুন (Save Numbers)</span>
                </button>
              </div>
            </div>

            {/* Subscription Plans Management */}
            <div className="bg-[#151722] p-6 rounded-2xl border border-white/5 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Crown className="w-4 h-4 text-amber-400" />
                <span>সাবস্ক্রিপশন প্ল্যানসমূহ (VIP Plans)</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {subscriptionPlans.map((plan, idx) => (
                  <div key={plan.id} className="bg-[#10121a] p-4 rounded-xl border border-white/10 space-y-2 text-xs">
                    <span className="font-bold text-white block text-sm">{plan.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400">মূল্য (Price):</span>
                      <input
                        type="number"
                        value={plan.price}
                        onChange={(e) => {
                          const updated = [...subscriptionPlans];
                          updated[idx] = { ...plan, price: parseInt(e.target.value) || 0 };
                          setSubscriptionPlans(updated);
                        }}
                        className="w-24 bg-[#151722] text-amber-400 font-bold px-2 py-1 rounded border border-white/10 text-sm"
                      />
                      <span className="text-slate-400">৳</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-slate-400">মেয়াদ:</span>
                      <span className="text-white font-bold">{plan.durationDays} দিন</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Subscription Requests Table */}
            <div className="bg-[#151722] rounded-2xl border border-white/5 overflow-hidden">
              <div className="p-4 border-b border-white/5 flex items-center justify-between">
                <h3 className="text-sm font-bold text-white">
                  ইউজারদের পেমেন্ট রিকোয়েস্ট ও অর্ডার হিস্ট্রি ({subscriptionOrders.length})
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#11131c] text-slate-400 font-semibold border-b border-white/5">
                    <tr>
                      <th className="p-3">তারিখ</th>
                      <th className="p-3">প্ল্যান</th>
                      <th className="p-3">পদ্ধতি</th>
                      <th className="p-3">টাকার পরিমাণ</th>
                      <th className="p-3">প্রেরক নম্বর</th>
                      <th className="p-3">TrxID</th>
                      <th className="p-3">স্ট্যাটাস</th>
                      <th className="p-3 text-right">অ্যাকশন</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {subscriptionOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-white/5 transition-colors">
                        <td className="p-3 text-slate-400">{new Date(order.createdAt).toLocaleDateString()}</td>
                        <td className="p-3 font-bold text-white">{order.planName}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            order.paymentMethod === 'bkash' ? 'bg-[#e2136e]/20 text-[#e2136e]' : 'bg-[#f7941d]/20 text-[#f7941d]'
                          }`}>
                            {order.paymentMethod}
                          </span>
                        </td>
                        <td className="p-3 font-bold text-amber-400">৳ {order.amount}</td>
                        <td className="p-3 font-mono text-slate-300">{order.senderNumber}</td>
                        <td className="p-3 font-mono font-bold text-emerald-400">{order.transactionId}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            order.status === 'approved' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="p-3 text-right space-x-1">
                          {order.status !== 'approved' && (
                            <button
                              onClick={() => handleUpdateOrderStatus(order.id, 'approved')}
                              className="px-2 py-1 rounded bg-emerald-600 text-white font-bold text-[10px] hover:bg-emerald-700"
                            >
                              Approve
                            </button>
                          )}
                          <button
                            onClick={() => handleUpdateOrderStatus(order.id, 'rejected')}
                            className="px-2 py-1 rounded bg-rose-600/20 text-rose-400 font-bold text-[10px] hover:bg-rose-600 hover:text-white"
                          >
                            Reject
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 5: MONETAG ADS SETUP ================= */}
        {activeTab === 'monetag' && (
          <div className="space-y-6 max-w-3xl">
            <div className="bg-[#151722] p-6 rounded-2xl border border-emerald-500/20 space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-emerald-400" />
                    <span>{t.monetagTitle}</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    {t.monetagDesc}
                  </p>
                </div>

                <div className="flex items-center gap-2 bg-[#10121a] px-3 py-1.5 rounded-xl border border-white/10">
                  <span className="text-xs text-slate-300 font-semibold">{t.monetagEnableSwitch}:</span>
                  <input
                    type="checkbox"
                    checked={monetagConfig.enabled}
                    onChange={(e) => setMonetagConfig({ ...monetagConfig, enabled: e.target.checked })}
                    className="w-5 h-5 accent-emerald-500 cursor-pointer"
                  />
                </div>
              </div>

              {monetagSavedAlert && (
                <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-semibold flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Monetag Ads Configuration saved and active!</span>
                </div>
              )}

              <div className="space-y-4 text-xs">
                <div>
                  <label className="text-slate-200 block mb-1 font-bold">
                    {t.monetagDirectLinkLabel}
                  </label>
                  <input
                    type="text"
                    value={monetagConfig.directLinkUrl}
                    onChange={(e) => setMonetagConfig({ ...monetagConfig, directLinkUrl: e.target.value })}
                    placeholder="https://otieufta.com/4/8812345"
                    className="w-full bg-[#10121a] text-white px-3.5 py-2.5 rounded-xl border border-white/10 font-mono focus:border-emerald-500"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    {t.monetagDirectLinkHelp}
                  </p>
                </div>

                <div>
                  <label className="text-slate-200 block mb-1 font-bold">
                    {t.monetagScriptLabel}
                  </label>
                  <textarea
                    rows={3}
                    value={monetagConfig.scriptTag}
                    onChange={(e) => setMonetagConfig({ ...monetagConfig, scriptTag: e.target.value })}
                    placeholder='<script src="//kulroakonsu.net/88/tag.min.js" data-zone="123456"></script>'
                    className="w-full bg-[#10121a] text-white px-3.5 py-2 rounded-xl border border-white/10 font-mono text-[11px] focus:border-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#10121a] p-4 rounded-xl border border-white/5">
                  <label className="flex items-center gap-2.5 cursor-pointer text-slate-200 font-medium">
                    <input
                      type="checkbox"
                      checked={monetagConfig.showAdOnEpisodeChange}
                      onChange={(e) => setMonetagConfig({ ...monetagConfig, showAdOnEpisodeChange: e.target.checked })}
                      className="w-4 h-4 accent-emerald-500"
                    />
                    <span>{t.showAdOnEpChangeLabel}</span>
                  </label>

                  <div>
                    <label className="text-slate-300 block mb-1">
                      {t.adCountdownSecondsLabel}
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={30}
                      value={monetagConfig.adCountdownSeconds}
                      onChange={(e) => setMonetagConfig({ ...monetagConfig, adCountdownSeconds: parseInt(e.target.value) || 0 })}
                      className="w-24 bg-[#151722] text-white px-3 py-1.5 rounded-lg border border-white/10 font-bold"
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={handleSaveMonetag}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs transition-all shadow-md flex items-center gap-2 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>{t.saveMonetagBtn}</span>
                </button>

                <button
                  onClick={() => triggerMonetagDirectLink(monetagConfig)}
                  className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 font-semibold text-xs border border-white/10 flex items-center gap-2 cursor-pointer"
                >
                  <ExternalLink className="w-4 h-4 text-emerald-400" />
                  <span>{t.testAdPopupBtn}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 6: FIREBASE SETUP ================= */}
        {activeTab === 'firebase' && (
          <div className="space-y-6 max-w-3xl">
            <div className="bg-[#151722] p-6 rounded-2xl border border-white/5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Database className="w-5 h-5 text-amber-500" />
                    <span>{t.firebaseTitle}</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    {t.firebaseDesc}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 font-medium">সক্রিয়:</span>
                  <input
                    type="checkbox"
                    checked={fbConfig.enabled}
                    onChange={(e) => setFbConfig({ ...fbConfig, enabled: e.target.checked })}
                    className="w-5 h-5 accent-amber-500 cursor-pointer"
                  />
                </div>
              </div>

              {fbTestResult && (
                <div
                  className={`p-3.5 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                    fbTestResult.success
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                  }`}
                >
                  <span>{fbTestResult.message}</span>
                </div>
              )}

              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-slate-300 block mb-1 font-medium">apiKey</label>
                  <input
                    type="text"
                    value={fbConfig.apiKey}
                    onChange={(e) => setFbConfig({ ...fbConfig, apiKey: e.target.value })}
                    className="w-full bg-[#10121a] text-white px-3 py-2 rounded-xl border border-white/10 font-mono"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-300 block mb-1 font-medium">authDomain</label>
                    <input
                      type="text"
                      value={fbConfig.authDomain}
                      onChange={(e) => setFbConfig({ ...fbConfig, authDomain: e.target.value })}
                      className="w-full bg-[#10121a] text-white px-3 py-2 rounded-xl border border-white/10 font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-slate-300 block mb-1 font-medium">projectId</label>
                    <input
                      type="text"
                      value={fbConfig.projectId}
                      onChange={(e) => setFbConfig({ ...fbConfig, projectId: e.target.value })}
                      className="w-full bg-[#10121a] text-white px-3 py-2 rounded-xl border border-white/10 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-slate-300 block mb-1 font-medium">databaseURL</label>
                  <input
                    type="text"
                    value={fbConfig.databaseURL || ''}
                    onChange={(e) => setFbConfig({ ...fbConfig, databaseURL: e.target.value })}
                    className="w-full bg-[#10121a] text-white px-3 py-2 rounded-xl border border-white/10 font-mono"
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-3">
                <button
                  onClick={handleSaveFirebase}
                  disabled={fbTestLoading}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs transition-all shadow flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{fbTestLoading ? 'Verifying...' : t.firebaseSaveBtn}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 7: BLOGGER EXPORT & HOSTING CENTER ================= */}
        {activeTab === 'blogger' && (
          <div className="space-y-6 max-w-4xl">
            {/* Header Card */}
            <div className="bg-[#151722] p-5 sm:p-6 rounded-2xl border border-white/5 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-rose-600 flex items-center justify-center shadow-lg shadow-rose-600/20">
                    <Code className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-white flex items-center gap-2">
                      <span>ব্লগার হোস্টিং ও HTML কোড কনভার্টার (Blogger Hosting Center)</span>
                    </h3>
                    <p className="text-xs text-slate-400">
                      আপনার তৈরি করা ফ্রি ড্রামা অ্যাপ ব্লগারের যেকোনো ডোমেইনে (.blogspot.com) বিনামূল্যে হোস্ট করুন।
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs bg-black/40 px-3 py-1.5 rounded-xl border border-white/10 text-slate-300">
                  <span className="text-amber-400 font-bold">App URL:</span>
                  <span className="font-mono text-[11px] text-slate-200">{customBloggerHostUrl || (typeof window !== 'undefined' ? window.location.origin : '')}</span>
                </div>
              </div>

              {/* Custom Host URL Option */}
              <div className="pt-2">
                <label className="text-slate-300 block mb-1 text-xs font-semibold">
                  কাস্টম অ্যাপ লিংক (যদি অন্য কোথাও হোস্ট করে থাকেন, খালি রাখলে বর্তমান অ্যাপ লিংক ব্যবহার হবে):
                </label>
                <input
                  type="text"
                  value={customBloggerHostUrl}
                  onChange={(e) => setCustomBloggerHostUrl(e.target.value)}
                  placeholder={typeof window !== 'undefined' ? window.location.origin : 'https://free-drama.app'}
                  className="w-full bg-[#0a0b0f] text-white px-3 py-2 rounded-xl border border-white/10 font-mono text-xs focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>

            {/* METHOD 1: BLOGGER RESPONSIVE POST/PAGE EMBED (RECOMMENDED) */}
            <div className="bg-[#151722] p-5 sm:p-6 rounded-2xl border border-rose-500/20 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="inline-block px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-400 text-[10px] font-black uppercase tracking-wider mb-1">
                    পদ্ধতি ১ (সবচেয়ে সহজ ও ১০০% কার্যকর)
                  </div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <span>ব্লগার পেজ বা পোস্টের জন্য রেসপন্সিভ HTML কোড</span>
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    ব্লগারের যেকোনো Page বা Post-এ পেস্ট করলেই পূর্ণাঙ্গ অ্যাপ চালু হবে।
                  </p>
                </div>

                <button
                  onClick={() => {
                    const code = generateBloggerIframeCode(customBloggerHostUrl || (typeof window !== 'undefined' ? window.location.origin : ''));
                    navigator.clipboard.writeText(code);
                    setCopiedBloggerIframe(true);
                    setTimeout(() => setCopiedBloggerIframe(false), 2000);
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#ff2a5f] to-rose-600 hover:from-[#e11d48] hover:to-rose-700 text-white text-xs font-bold transition-all shadow cursor-pointer"
                >
                  {copiedBloggerIframe ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedBloggerIframe ? 'কোড কপি হয়েছে!' : 'HTML কোড কপি করুন'}</span>
                </button>
              </div>

              {/* Instructions */}
              <div className="bg-black/40 p-3.5 rounded-xl border border-white/5 space-y-1.5 text-xs text-slate-300">
                <div className="font-bold text-amber-400">📝 ব্লগারের যেভাবে বসাবেন:</div>
                <ol className="list-decimal list-inside space-y-1 text-slate-300 pl-1">
                  <li>আপনার <strong className="text-white">Blogger ড্যাশবোর্ডে (blogger.com)</strong> যান।</li>
                  <li>বাম পাশের মেনু থেকে <strong className="text-white">Pages</strong> এ ক্লিক করুন এবং <strong className="text-white">New Page</strong> খুলুন (অথবা Posts &gt; New Post)।</li>
                  <li>উপরের বাম কোণের পেন্সিল ✏️ আইকনে ক্লিক করে <strong className="text-rose-400">HTML view</strong> সিলেক্ট করুন।</li>
                  <li>এই কপি করা HTML কোডটি পেস্ট করুন এবং <strong className="text-emerald-400">Publish</strong> বাটনে চাপ দিন!</li>
                </ol>
              </div>

              <div className="bg-[#0c0d12] p-3 rounded-xl border border-white/10 font-mono text-[11px] text-slate-300 overflow-x-auto max-h-40">
                <pre>{generateBloggerIframeCode(customBloggerHostUrl || (typeof window !== 'undefined' ? window.location.origin : ''))}</pre>
              </div>
            </div>

            {/* METHOD 2: BLOGGER THEME XML (EDIT HTML) */}
            <div className="bg-[#151722] p-5 sm:p-6 rounded-2xl border border-amber-500/20 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="inline-block px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-black uppercase tracking-wider mb-1">
                    পদ্ধতি ২ (সম্পূর্ণ ব্লগ সাইট)
                  </div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <span>ব্লগার থিম এক্সএমএল কোড (Blogger Theme Edit HTML)</span>
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    ব্লগারের Theme &gt; Edit HTML-এ বসিয়ে আপনার পুরো ব্লগকে ফ্রি ড্রামা সাইট বানিয়ে নিন।
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      const xml = generateBloggerThemeXML(customBloggerHostUrl || (typeof window !== 'undefined' ? window.location.origin : ''));
                      downloadFile('free-drama-blogger-theme.xml', xml, 'text/xml');
                    }}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold transition-all border border-white/10 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>XML ডাউনলোড</span>
                  </button>

                  <button
                    onClick={() => {
                      const xml = generateBloggerThemeXML(customBloggerHostUrl || (typeof window !== 'undefined' ? window.location.origin : ''));
                      navigator.clipboard.writeText(xml);
                      setCopiedBloggerTheme(true);
                      setTimeout(() => setCopiedBloggerTheme(false), 2000);
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black transition-all shadow cursor-pointer"
                  >
                    {copiedBloggerTheme ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedBloggerTheme ? 'XML কপি হয়েছে!' : 'XML কোড কপি করুন'}</span>
                  </button>
                </div>
              </div>

              {/* Instructions */}
              <div className="bg-black/40 p-3.5 rounded-xl border border-white/5 space-y-1.5 text-xs text-slate-300">
                <div className="font-bold text-amber-400">📝 ব্লগারের Theme-এ যেভাবে বসাবেন:</div>
                <ol className="list-decimal list-inside space-y-1 text-slate-300 pl-1">
                  <li>ব্লগার ড্যাশবোর্ড থেকে বাম পাশের <strong className="text-white">Theme</strong> অপশনে ক্লিক করুন।</li>
                  <li><strong className="text-white">Customize</strong> বাটনের পাশের ড্রপডাউন 🔻 তীরে ক্লিক করে <strong className="text-amber-400">Edit HTML</strong> চাপুন।</li>
                  <li>সেখানে থাকা আগের সমস্ত কোড মুছে (Ctrl+A দিয়ে Backspace) এই কপি করা XML কোড পেস্ট করুন।</li>
                  <li>উপরের ডানদিকের ফ্লপি ডিস্ক 💾 <strong className="text-emerald-400">Save</strong> বাটনে চাপ দিন। আপনার সাইট সম্পূর্ণ ফ্রি ড্রামা হয়ে যাবে!</li>
                </ol>
              </div>

              <div className="bg-[#0c0d12] p-3 rounded-xl border border-white/10 font-mono text-[11px] text-slate-300 overflow-x-auto max-h-40">
                <pre>{generateBloggerThemeXML(customBloggerHostUrl || (typeof window !== 'undefined' ? window.location.origin : '')).slice(0, 1500) + '\n... (Click Copy or Download to get full XML)'}</pre>
              </div>
            </div>

            {/* METHOD 3: STANDALONE COMPLETE SINGLE-FILE HTML APP */}
            <div className="bg-[#151722] p-5 sm:p-6 rounded-2xl border border-white/5 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="inline-block px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-wider mb-1">
                    পদ্ধতি ৩ (স্ট্যান্ডঅ্যালোন সিঙ্গেল ফাইল)
                  </div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <span>সম্পূর্ণ সিঙ্গেল-ফাইল HTML ওয়েব অ্যাপ ডাউনলোড</span>
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    আপনার সমস্ত ড্রামা, পর্ব, মনিট্যাগ বিজ্ঞাপন ও বিকাশ/নগদ পেমেন্ট ডাটা সহ সম্পূর্ণ স্বয়ংসম্পূর্ণ HTML।
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      const monetag = getStoredMonetagConfig();
                      const payment = getStoredPaymentSettings();
                      const fullHtml = generateStandaloneBloggerTemplateCode(dramas, monetag, payment);
                      downloadFile('free-drama-standalone.html', fullHtml, 'text/html');
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>FreeDrama.html ডাউনলোড করুন</span>
                  </button>

                  <button
                    onClick={() => {
                      const monetag = getStoredMonetagConfig();
                      const payment = getStoredPaymentSettings();
                      const fullHtml = generateStandaloneBloggerTemplateCode(dramas, monetag, payment);
                      navigator.clipboard.writeText(fullHtml);
                      setCopiedStandaloneHtml(true);
                      setTimeout(() => setCopiedStandaloneHtml(false), 2000);
                    }}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold transition-all border border-white/10 cursor-pointer"
                  >
                    {copiedStandaloneHtml ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedStandaloneHtml ? 'কপি হয়েছে!' : 'HTML কপি'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ================= MODAL: ADD / EDIT DRAMA (WITH LIVE THUMBNAIL PREVIEW) ================= */}
      {isDramaModalOpen && editingDrama && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#121420] border border-white/10 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 my-8">
            <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <Edit className="w-4 h-4 text-rose-400" />
                <span>{t.editDrama}</span>
              </h3>
              <button
                onClick={() => setIsDramaModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 sm:p-6 space-y-4 text-xs max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-slate-300 block mb-1 font-semibold">{t.dramaTitle}</label>
                  <input
                    type="text"
                    value={editingDrama.title}
                    onChange={(e) => setEditingDrama({ ...editingDrama, title: e.target.value })}
                    className="w-full bg-[#0a0b0f] text-white px-3 py-2 rounded-xl border border-white/10"
                  />
                </div>
                <div>
                  <label className="text-slate-300 block mb-1 font-semibold">{t.dramaTitleBn}</label>
                  <input
                    type="text"
                    value={editingDrama.titleBn || ''}
                    onChange={(e) => setEditingDrama({ ...editingDrama, titleBn: e.target.value })}
                    placeholder="ইনসান বানা ভগবান"
                    className="w-full bg-[#0a0b0f] text-white px-3 py-2 rounded-xl border border-white/10"
                  />
                </div>
                <div>
                  <label className="text-slate-300 block mb-1 font-semibold">{t.dramaTitleHi}</label>
                  <input
                    type="text"
                    value={editingDrama.titleHi || ''}
                    onChange={(e) => setEditingDrama({ ...editingDrama, titleHi: e.target.value })}
                    placeholder="इंसान बना भगवान"
                    className="w-full bg-[#0a0b0f] text-white px-3 py-2 rounded-xl border border-white/10"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-slate-300 block mb-1 font-semibold">{t.languageLabel}</label>
                  <select
                    value={editingDrama.language}
                    onChange={(e) => setEditingDrama({ ...editingDrama, language: e.target.value })}
                    className="w-full bg-[#0a0b0f] text-white px-3 py-2 rounded-xl border border-white/10"
                  >
                    <option value="Hindi">Hindi</option>
                    <option value="Bengali">Bengali</option>
                    <option value="English">English</option>
                    <option value="Dubbed">Dubbed</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-300 block mb-1 font-semibold">{t.categoryLabel}</label>
                  <select
                    value={editingDrama.category}
                    onChange={(e) => setEditingDrama({ ...editingDrama, category: e.target.value })}
                    className="w-full bg-[#0a0b0f] text-white px-3 py-2 rounded-xl border border-white/10"
                  >
                    <option value="Indian">Indian</option>
                    <option value="Dubbed">Dubbed</option>
                    <option value="Romance">Romance</option>
                    <option value="Action">Action</option>
                    <option value="Fantasy">Fantasy</option>
                    <option value="Bengali">Bengali</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-300 block mb-1 font-semibold">{t.viewsCountLabel}</label>
                  <input
                    type="text"
                    value={editingDrama.views}
                    onChange={(e) => setEditingDrama({ ...editingDrama, views: e.target.value })}
                    className="w-full bg-[#0a0b0f] text-white px-3 py-2 rounded-xl border border-white/10"
                  />
                </div>
              </div>

              {/* ================= IMGBB.COM THUMBNAIL HELPER TOOL ================= */}
              <div className="bg-gradient-to-r from-blue-950/40 via-[#151724] to-slate-900 p-4 rounded-2xl border border-blue-500/30 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-600/30 border border-blue-500/40 flex items-center justify-center">
                      <ImageIcon className="w-4 h-4 text-blue-400" />
                    </div>
                    <div>
                      <div className="font-bold text-white text-xs flex items-center gap-1.5">
                        <span>ImgBB (imgbb.com) থাম্বনেইল আপলোডার ও কনভার্টার</span>
                        <span className="text-[10px] bg-blue-500/20 text-blue-300 px-1.5 py-0.5 rounded font-mono">Free Host</span>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        imgbb.com এ ছবি আপলোড করে লিংক কপি করে এখানে আনুন, স্বয়ংক্রিয়ভাবে সরাসরি থাম্বনেইল হবে।
                      </p>
                    </div>
                  </div>

                  <a
                    href="https://imgbb.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow cursor-pointer"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>imgbb.com খুলুন</span>
                  </a>
                </div>

                {/* Helper Input & Quick Apply Buttons */}
                <div className="space-y-2 pt-1">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={imgbbHelperInput}
                      onChange={(e) => setImgbbHelperInput(e.target.value)}
                      placeholder="imgbb.com থেকে কপি করা লিংক বা HTML embed কোড এখানে পেস্ট করুন..."
                      className="flex-1 bg-[#0a0b0f] text-white px-3 py-2 rounded-xl border border-blue-500/30 font-mono text-xs focus:outline-none focus:border-blue-400"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (!imgbbHelperInput.trim()) return;
                        const cleaned = getCleanImageUrl(imgbbHelperInput);
                        setEditingDrama({ ...editingDrama, poster: cleaned });
                        setImgbbHelperInput('');
                      }}
                      className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow cursor-pointer shrink-0 flex items-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>পোস্টারে দিন</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (!imgbbHelperInput.trim()) return;
                        const cleaned = getCleanImageUrl(imgbbHelperInput);
                        setEditingDrama({ ...editingDrama, banner: cleaned });
                        setImgbbHelperInput('');
                      }}
                      className="px-3 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all shadow cursor-pointer shrink-0 flex items-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span> ব্যানারে দিন</span>
                    </button>
                  </div>

                  <div className="text-[11px] text-slate-400 bg-black/40 p-2.5 rounded-xl border border-white/5 space-y-1">
                    <div className="text-blue-300 font-semibold">💡 ImgBB থেকে ব্যবহারের সহজ নিয়ম:</div>
                    <div>১. <strong className="text-white">imgbb.com</strong> এ যান এবং <strong className="text-blue-400">Start uploading</strong> চাপুন।</div>
                    <div>২. আপলোড শেষে <strong className="text-amber-400">Direct links</strong> কপি করুন (অথবা পেজের লিংক / HTML embed কোড কপি করলেও স্বয়ংক্রিয়ভাবে প্রসেস হবে)।</div>
                    <div>৩. এখানে পেস্ট করে <strong className="text-emerald-400">পোস্টারে দিন</strong> চাপুন। ব্যস, থাম্বনেইল সেট হয়ে যাবে!</div>
                  </div>
                </div>
              </div>

              {/* POSTER & THUMBNAIL PREVIEW BOX (FIXES USER THUMBNAIL ISSUE) */}
              <div className="space-y-2 bg-[#0a0b0f] p-4 rounded-xl border border-white/10">
                <div className="flex items-center justify-between">
                  <label className="text-slate-200 block font-bold">{t.posterUrlLabel}</label>
                  <span className="text-[11px] text-slate-400">ImgBB / Google Drive / Direct Image URL</span>
                </div>
                <input
                  type="text"
                  value={editingDrama.poster}
                  onChange={(e) => {
                    const clean = getCleanImageUrl(e.target.value);
                    setEditingDrama({ ...editingDrama, poster: clean });
                  }}
                  placeholder="https://i.ibb.co/... অথবা ড্রাইভ/ইমেজ লিংক"
                  className="w-full bg-[#151722] text-white px-3 py-2 rounded-xl border border-white/10 font-mono text-xs focus:outline-none focus:border-rose-500"
                />

                {/* Live Poster Image Preview */}
                <div className="flex items-center gap-3 pt-2">
                  <div className="w-16 h-22 rounded-lg overflow-hidden border border-white/10 bg-black shrink-0 relative">
                    <img
                      src={getCleanImageUrl(editingDrama.poster)}
                      alt="Thumbnail Preview"
                      onError={(e) => { (e.target as HTMLImageElement).src = DEFAULT_POSTER_FALLBACK; }}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="text-[11px] text-slate-400">
                    <span className="font-semibold text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      থাম্বনেইল প্রিভিউ লাইভ চলছে
                    </span>
                    <p className="mt-0.5">ImgBB, গুগল ড্রাইভ বা সরাসরি ইমেজ লিংক দিলে তা স্বয়ংক্রিয়ভাবে ফুল সাইজ পোস্টার হিসেবে লোড হবে।</p>
                  </div>
                </div>
              </div>

              {/* Banner URL & Preview */}
              <div className="space-y-2 bg-[#0a0b0f] p-4 rounded-xl border border-white/10">
                <div className="flex items-center justify-between">
                  <label className="text-slate-200 block font-bold">{t.bannerUrlLabel}</label>
                  <span className="text-[11px] text-slate-400">১৬:৯ অনুপাতের ব্যানার লিংক</span>
                </div>
                <input
                  type="text"
                  value={editingDrama.banner}
                  onChange={(e) => {
                    const clean = getCleanImageUrl(e.target.value, DEFAULT_BANNER_FALLBACK);
                    setEditingDrama({ ...editingDrama, banner: clean });
                  }}
                  placeholder="https://i.ibb.co/... ব্যানার ইমেজ লিংক"
                  className="w-full bg-[#151722] text-white px-3 py-2 rounded-xl border border-white/10 font-mono text-xs focus:outline-none focus:border-rose-500"
                />
                <div className="aspect-[16/7] max-h-24 rounded-lg overflow-hidden border border-white/10 bg-black">
                  <img
                    src={getCleanImageUrl(editingDrama.banner, DEFAULT_BANNER_FALLBACK)}
                    alt="Banner Preview"
                    onError={(e) => { (e.target as HTMLImageElement).src = DEFAULT_BANNER_FALLBACK; }}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 block mb-1 font-semibold">{t.descriptionLabel}</label>
                <textarea
                  rows={3}
                  value={editingDrama.description}
                  onChange={(e) => setEditingDrama({ ...editingDrama, description: e.target.value })}
                  className="w-full bg-[#0a0b0f] text-white px-3 py-2 rounded-xl border border-white/10"
                />
              </div>

              <div className="flex flex-wrap gap-4 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                  <input
                    type="checkbox"
                    checked={editingDrama.isFeaturedHero}
                    onChange={(e) => setEditingDrama({ ...editingDrama, isFeaturedHero: e.target.checked })}
                    className="accent-[#ff2a5f] w-4 h-4"
                  />
                  <span>{t.featuredInHero}</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                  <input
                    type="checkbox"
                    checked={editingDrama.isPopular}
                    onChange={(e) => setEditingDrama({ ...editingDrama, isPopular: e.target.checked })}
                    className="accent-[#ff2a5f] w-4 h-4"
                  />
                  <span>{t.showInPopular}</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                  <input
                    type="checkbox"
                    checked={editingDrama.isComingSoon}
                    onChange={(e) => setEditingDrama({ ...editingDrama, isComingSoon: e.target.checked })}
                    className="accent-[#ff2a5f] w-4 h-4"
                  />
                  <span>{t.showInComingSoon}</span>
                </label>
              </div>
            </div>

            <div className="p-4 border-t border-white/10 flex items-center justify-end gap-3 bg-[#0d0e15]">
              <button
                onClick={() => setIsDramaModalOpen(false)}
                className="px-4 py-2 rounded-xl text-slate-400 hover:text-white text-xs font-semibold cursor-pointer"
              >
                {t.cancelBtn}
              </button>

              <button
                onClick={() => handleSaveDramaModal(editingDrama)}
                className="px-5 py-2 rounded-xl bg-[#ff2a5f] hover:bg-[#e11d48] text-white text-xs font-bold transition-all shadow cursor-pointer"
              >
                {t.saveDramaBtn}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: EDIT SINGLE EPISODE ================= */}
      {isEditEpisodeModalOpen && editingEpisode && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#121420] border border-amber-500/30 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <Edit className="w-4 h-4 text-amber-400" />
                <span>{t.editEpisodeModalTitle}: Ep {editingEpisode.episodeNumber}</span>
              </h3>
              <button
                onClick={() => {
                  setIsEditEpisodeModalOpen(false);
                  setEditingEpisode(null);
                }}
                className="p-1 rounded-lg text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 sm:p-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 block mb-1 font-semibold">{t.episodeNumber}:</label>
                  <input
                    type="number"
                    value={editingEpisode.episodeNumber}
                    onChange={(e) => setEditingEpisode({ ...editingEpisode, episodeNumber: parseInt(e.target.value) || 1 })}
                    className="w-full bg-[#181a26] text-white px-3 py-2 rounded-xl border border-white/10 font-bold"
                  />
                </div>

                <div>
                  <label className="text-slate-300 block mb-1 font-semibold">{t.duration}:</label>
                  <input
                    type="text"
                    value={editingEpisode.duration}
                    onChange={(e) => setEditingEpisode({ ...editingEpisode, duration: e.target.value })}
                    className="w-full bg-[#181a26] text-white px-3 py-2 rounded-xl border border-white/10"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 block mb-1 font-semibold">{t.episodeTitle}:</label>
                <input
                  type="text"
                  value={editingEpisode.title}
                  onChange={(e) => setEditingEpisode({ ...editingEpisode, title: e.target.value })}
                  className="w-full bg-[#181a26] text-white px-3 py-2 rounded-xl border border-white/10 font-semibold"
                />
              </div>

              {/* ACCESS TYPE SELECTOR */}
              <div className="bg-[#181a26] p-3.5 rounded-xl border border-amber-500/20 space-y-2">
                <label className="text-amber-400 block font-bold flex items-center gap-1.5 text-xs">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>অ্যাক্সেস টাইপ (Access Type) নির্ধারণ করুন:</span>
                </label>

                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingEpisode({ ...editingEpisode, accessType: 'free', isLocked: false })}
                    className={`py-2 px-2 rounded-xl border text-center font-bold text-xs transition-all cursor-pointer ${
                      editingEpisode.accessType === 'free'
                        ? 'bg-emerald-500/25 border-emerald-500 text-emerald-300 shadow'
                        : 'bg-[#10121a] border-white/10 text-slate-400 hover:text-white'
                    }`}
                  >
                    <div className="text-sm">🟢</div>
                    <div className="mt-0.5">ফ্রি (Free)</div>
                    <div className="text-[9px] font-normal opacity-70">সবার জন্য উন্মুক্ত</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setEditingEpisode({ ...editingEpisode, accessType: 'ad', isLocked: true })}
                    className={`py-2 px-2 rounded-xl border text-center font-bold text-xs transition-all cursor-pointer ${
                      editingEpisode.accessType === 'ad'
                        ? 'bg-amber-500/25 border-amber-500 text-amber-300 shadow'
                        : 'bg-[#10121a] border-white/10 text-slate-400 hover:text-white'
                    }`}
                  >
                    <div className="text-sm">🟡</div>
                    <div className="mt-0.5">অ্যাড আনলক (Ad)</div>
                    <div className="text-[9px] font-normal opacity-70">বিজ্ঞাপন দেখে চালু</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setEditingEpisode({ ...editingEpisode, accessType: 'premium', isLocked: true })}
                    className={`py-2 px-2 rounded-xl border text-center font-bold text-xs transition-all cursor-pointer ${
                      editingEpisode.accessType === 'premium'
                        ? 'bg-rose-500/25 border-rose-500 text-rose-300 shadow'
                        : 'bg-[#10121a] border-white/10 text-slate-400 hover:text-white'
                    }`}
                  >
                    <div className="text-sm">👑</div>
                    <div className="mt-0.5">প্রিমিয়াম (VIP)</div>
                    <div className="text-[9px] font-normal opacity-70">বিকাশ/নগদ মেম্বার</div>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div className="sm:col-span-1">
                  <label className="text-slate-300 block mb-1 font-semibold">{t.videoType}:</label>
                  <select
                    value={editingEpisode.videoType}
                    onChange={(e) => setEditingEpisode({ ...editingEpisode, videoType: e.target.value as any })}
                    className="w-full bg-[#181a26] text-white px-3 py-2 rounded-xl border border-white/10 cursor-pointer"
                  >
                    <option value="mp4">MP4 Video</option>
                    <option value="youtube">YouTube</option>
                    <option value="iframe">Iframe / Embed</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="text-slate-300 block mb-1 font-semibold">ভিডিও লিংক (URL):</label>
                  <input
                    type="text"
                    value={editingEpisode.videoUrl}
                    onChange={(e) => setEditingEpisode({ ...editingEpisode, videoUrl: e.target.value })}
                    className="w-full bg-[#181a26] text-white px-3 py-2 rounded-xl border border-white/10 font-mono text-[11px]"
                  />
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-white/10 flex items-center justify-end gap-3 bg-[#0d0e15]">
              <button
                type="button"
                onClick={() => setPreviewVideoUrl(editingEpisode.videoUrl)}
                className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold mr-auto flex items-center gap-1 cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span>টেস্ট প্লে করুন</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsEditEpisodeModalOpen(false);
                  setEditingEpisode(null);
                }}
                className="px-4 py-2 rounded-xl text-slate-400 hover:text-white text-xs font-semibold cursor-pointer"
              >
                {t.cancelBtn}
              </button>

              <button
                type="button"
                onClick={handleSaveEditEpisode}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-600 hover:to-rose-700 text-slate-950 text-xs font-black transition-all shadow cursor-pointer flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{t.saveEpisodeChanges}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
