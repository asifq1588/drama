import { AppLanguage } from '../types/drama';

export const TRANSLATIONS = {
  en: {
    // Brand
    brandName: 'Free Drama',
    brandTagline: 'Free Short Dramas Streaming & Admin Platform',
    brandSubtitle: 'Premium Short Dramas',

    // Nav
    navHome: 'Home',
    navExplore: 'Explore',
    navTopRank: 'Top Rank',
    navComingSoon: 'Coming Soon',
    navMyList: 'My List',
    searchPlaceholder: 'Search dramas, actors, genres...',
    downloadApp: 'Download App',
    adminPanel: 'Admin Panel',
    userMode: 'User Mode',
    allLanguages: 'All Languages',

    // Home sections
    watchNow: 'Watch Now',
    viewsText: 'Views',
    episodesText: 'Episodes',
    continueWatching: 'Continue Watching',
    popularDramas: 'Popular Dramas',
    topRankTitle: 'Top Rank',
    comingSoonTitle: 'Coming Soon',
    newReleases: 'New Releases',
    indianDramas: 'Indian Dramas',
    dubbedDramas: 'Dubbed Dramas',
    bengaliDramas: 'Bengali Dramas',
    viewAll: 'View All',
    notifyMe: 'Notify Me',
    notified: 'Notified',
    rankDaily: 'Daily',
    rankWeekly: 'Weekly',
    rankMonthly: 'Monthly',
    resumeEp: 'Ep',

    // Explore & Filters
    exploreTitle: 'Explore Short Dramas',
    exploreSubtitle: 'Browse premium vertical short dramas by category and language',
    searchResults: 'Search Results for',
    noDramasFound: 'No dramas found. Try another keyword.',
    clearSearch: 'Clear Search',
    savedListTitle: 'My Saved List',
    noSavedDramas: 'You have no saved dramas yet.',
    noSavedDesc: 'Browse dramas on the home page and click the bookmark icon to save them here.',
    backToHome: 'Back to Home',

    // Watch Player & Monetag Ads
    episode: 'Episode',
    episodes: 'Episodes',
    searchEpisode: 'Search episode...',
    freeUnlock: 'Unlock with Ad / Free',
    vipLockedTitle: 'VIP Episode Locked',
    vipLockedDesc: 'Watch a short sponsored ad to unlock this episode for free!',
    watchAdToUnlock: 'Watch Ad & Unlock',
    unlockToAdTitle: 'Watch Ad to Unlock Episode',
    unlockToAdSubtitle: 'This episode requires watching an ad to unlock. Watch the sponsor ad to enjoy free streaming!',
    unlockToAdBtn: 'Unlock with Ad (Watch Ad)',
    adUnlocking: 'Unlocking episode...',
    unlockedNotice: 'Unlocked! Playing video...',
    premiumRequiredTitle: 'Premium VIP Episode',
    premiumRequiredDesc: 'This episode is exclusively for Premium VIP members. Upgrade with bKash or Nagad to watch!',
    upgradeToVipBtn: 'Upgrade to Premium VIP',
    accessTypeLabel: 'Access Type',
    typeFree: 'Free',
    typeAd: 'Watch Ad to Unlock',
    typePremium: 'Premium (VIP)',
    editEpisodeModalTitle: 'Edit Episode',
    saveEpisodeChanges: 'Save Changes',
    bulkActionTitle: 'Bulk Set Access:',
    allFree: 'Make All Free',
    allAd: 'Make All Ad Unlock',
    allPremium: 'Make All Premium',
    smartMix: 'Smart Mix (1-3 Free, 4-10 Ad, 11+ VIP)',
    sponsoredAd: 'Sponsored Ad by Monetag',
    adCountdown: 'Ad ends in',
    skipAd: 'Skip Ad',
    visitSponsor: 'Visit Sponsor',
    cinemaMode: '16:9 Cinema',
    reelMode: '9:16 Reel',
    bloggerCodeBtn: 'Blogger Code',
    shareLink: 'Share Drama',
    copiedShare: 'Link Copied!',

    // Admin Panel
    adminDashboard: 'Dashboard',
    adminDramas: 'Dramas Manager',
    adminEpisodes: 'Episodes Manager',
    adminMonetag: 'Monetag Ads Setup',
    adminFirebase: 'Firebase Setup',
    adminBlogger: 'Blogger Embed Code',
    adminHeaderTitle: 'Free Drama Control Panel',
    adminHeaderDesc: 'Drama Management, Monetag Ads & Firebase Sync',

    // Admin Dashboard
    totalDramas: 'Total Dramas',
    totalEpisodes: 'Total Episodes',
    heroFeatured: 'Hero Slider Featured',
    firebaseStatus: 'Firebase Status',
    monetagStatus: 'Monetag Ads Status',
    quickActions: 'Quick Actions',
    addNewDrama: 'Add New Drama',
    getBloggerCode: 'Get Blogger Code',
    testFirebase: 'Test Firebase',
    livePublished: 'Live Published',
    activeMonetag: 'Monetag Ads Active',
    disabledMonetag: 'Monetag Ads Disabled',

    // Admin Drama Modal
    editDrama: 'Edit Drama',
    dramaTitle: 'Drama Title (English/Original)',
    dramaTitleBn: 'Bengali Title',
    dramaTitleHi: 'Hindi Title',
    languageLabel: 'Language',
    categoryLabel: 'Category',
    viewsCountLabel: 'Views Count',
    posterUrlLabel: 'Poster Image URL',
    bannerUrlLabel: 'Banner Image URL',
    descriptionLabel: 'Synopsis / Storyline',
    featuredInHero: 'Feature in Top Hero Slider',
    showInPopular: 'Show in Popular List',
    showInComingSoon: 'Show in Coming Soon',
    saveDramaBtn: 'Save Drama',
    cancelBtn: 'Cancel',

    // Admin Episodes
    selectDrama: 'Select Drama',
    addNewEpisode: 'Add New Episode',
    episodeNumber: 'Episode #',
    episodeTitle: 'Episode Title',
    videoType: 'Video Type',
    duration: 'Duration',
    videoUrlLabel: 'Video URL / Direct MP4 / Embed Code',
    addEpisodeBtn: 'Add Episode',
    existingEpisodes: 'Existing Episodes List',

    // Admin Monetag
    monetagTitle: 'Monetag Advertisement Settings',
    monetagDesc: 'Configure Monetag ad scripts, Direct Links, and episode interstitial popups to monetize your drama platform.',
    monetagEnableSwitch: 'Enable Monetag Ads',
    monetagScriptLabel: 'Monetag In-Page / Popunder / SDK Script Tag:',
    monetagScriptHelp: 'Paste your Monetag <script> code (e.g., Tag, In-Page Push, Popunder)',
    monetagDirectLinkLabel: 'Monetag Direct Link (SmartLink) URL:',
    monetagDirectLinkHelp: 'When users click "Watch Ad", "Next Episode", or unlock VIP episodes, this Monetag SmartLink will open.',
    showAdOnEpChangeLabel: 'Show Ad On Every Episode Switch / Play',
    adCountdownSecondsLabel: 'Ad Countdown Duration (Seconds):',
    openDirectLinkNewTab: 'Open Direct Link in New Tab',
    monetagBannerHtmlLabel: 'Monetag Banner / HTML Ad Code under Player:',
    saveMonetagBtn: 'Save Monetag Settings',
    testAdPopupBtn: 'Test Ad Popup Now',

    // Admin Firebase
    firebaseTitle: 'Firebase Cloud Connection (Live)',
    firebaseDesc: 'Connected to user Firebase project kukuflix-53188. Firestore & Realtime DB ready.',
    firebaseConnected: 'Firebase Connected Successfully!',
    firebaseSaveBtn: 'Save & Test Firebase',
    resetDefaultFirebase: 'Reset Credentials',

    // Footer
    footerRights: 'All Rights Reserved. Powered by Blogger & Web.'
  },

  bn: {
    // Brand
    brandName: 'ফ্রি ড্রামা',
    brandTagline: 'ফ্রি শর্ট ড্রামা স্ট্রিমিং ও অ্যাডমিন প্ল্যাটফর্ম',
    brandSubtitle: 'প্রিমিয়াম শর্ট ড্রামা',

    // Nav
    navHome: 'হোম',
    navExplore: 'এক্সপ্লোর',
    navTopRank: 'টপ র‍্যাংক',
    navComingSoon: 'শীঘ্রই আসছে',
    navMyList: 'আমার তালিকা',
    searchPlaceholder: 'ড্রামা, অভিনেতা, ধরণ খুঁজুন...',
    downloadApp: 'অ্যাপ ডাউনলোড',
    adminPanel: 'অ্যাডমিন প্যানেল',
    userMode: 'ইউজার মোড',
    allLanguages: 'সব ভাষা',

    // Home sections
    watchNow: 'এখনই দেখুন',
    viewsText: 'ভিউস',
    episodesText: 'পর্ব',
    continueWatching: 'দেখা চালিয়ে যান',
    popularDramas: 'জনপ্রিয় ড্রামা',
    topRankTitle: 'টপ র‍্যাংক',
    comingSoonTitle: 'শীঘ্রই আসছে',
    newReleases: 'নতুন ড্রামা',
    indianDramas: 'ইন্ডিয়ান ড্রামা',
    dubbedDramas: 'ডাবড ড্রামা',
    bengaliDramas: 'বাংলা ড্রামা',
    viewAll: 'সবগুলো দেখুন',
    notifyMe: 'নোটিফাই করুন',
    notified: 'নোটিফায়েড',
    rankDaily: 'দৈনিক',
    rankWeekly: 'সাপ্তাহিক',
    rankMonthly: 'মাসিক',
    resumeEp: 'পর্ব',

    // Explore & Filters
    exploreTitle: 'শর্ট ড্রামা অন্বেষণ করুন',
    exploreSubtitle: 'ক্যাটাগরি ও ভাষা অনুসারে প্রিমিয়াম ভার্টিক্যাল শর্ট ড্রামা দেখুন',
    searchResults: 'অনুসন্ধানের ফলাফল',
    noDramasFound: 'কোনো ড্রামা খুঁজে পাওয়া যায়নি। অন্য কিওয়ার্ড চেষ্টা করুন।',
    clearSearch: 'সার্চ মুছুন',
    savedListTitle: 'আমার সংরক্ষিত তালিকা',
    noSavedDramas: 'আপনার কোনো সংরক্ষিত ড্রামা নেই।',
    noSavedDesc: 'হোম পেজে ড্রামা ব্রাউজ করে বুকমার্ক বাটনে ক্লিক করুন।',
    backToHome: 'হোমে ফিরে যান',

    // Watch Player & Monetag Ads
    episode: 'পর্ব',
    episodes: 'পর্বসমূহ',
    searchEpisode: 'পর্ব খুঁজুন...',
    freeUnlock: 'বিজ্ঞাপন দেখে আনলক করুন',
    vipLockedTitle: 'ভিআইপি পর্ব লক করা আছে',
    vipLockedDesc: 'সম্পূর্ণ ফ্রিতে দেখতে একটি ছোট বিজ্ঞাপন দেখুন!',
    watchAdToUnlock: 'অ্যাড দেখুন ও আনলক করুন',
    unlockToAdTitle: 'বিজ্ঞাপন দেখে পর্ব আনলক করুন',
    unlockToAdSubtitle: 'এই পর্বটি ফ্রিতে উপভোগ করতে একটি ছোট বিজ্ঞাপন দেখুন এবং সাথে সাথে আনলক করুন!',
    unlockToAdBtn: 'আনলক টু অ্যাড (বিজ্ঞাপন দেখুন)',
    adUnlocking: 'বিজ্ঞাপন লোড হচ্ছে... আনলক সম্পন্ন হচ্ছে!',
    unlockedNotice: 'পর্ব আনলক হয়েছে! ভিডিও চালু হচ্ছে...',
    premiumRequiredTitle: '👑 প্রিমিয়াম ভিআইপি পর্ব',
    premiumRequiredDesc: 'এই পর্বটি শুধুমাত্র প্রিমিয়াম মেম্বারদের জন্য। বিকাশ বা নগদ দিয়ে সাবস্ক্রিপশন প্ল্যান গ্রহণ করুন।',
    upgradeToVipBtn: '👑 বিকাশ ও নগদে প্রিমিয়াম নিন',
    accessTypeLabel: 'অ্যাক্সেস টাইপ',
    typeFree: 'ফ্রি (Free)',
    typeAd: 'বিজ্ঞাপন দেখে আনলক (Ad)',
    typePremium: 'প্রিমিয়াম (Premium VIP)',
    editEpisodeModalTitle: 'পর্ব সম্পাদনা (Edit Episode)',
    saveEpisodeChanges: 'পর্বের পরিবর্তন সেভ করুন',
    bulkActionTitle: 'একসাথে অ্যাক্সেস পরিবর্তন:',
    allFree: 'সবগুলো ফ্রি করুন',
    allAd: 'সবগুলো অ্যাড করুন',
    allPremium: 'সবগুলো প্রিমিয়াম করুন',
    smartMix: 'স্মার্ট মিক্স (১-৩ ফ্রি, ৪-১০ অ্যাড, বাকি প্রিমিয়াম)',
    sponsoredAd: 'মোনিট্যাগ স্পন্সরড বিজ্ঞাপন',
    adCountdown: 'বিজ্ঞাপন শেষ হতে বাকি',
    skipAd: 'বিজ্ঞাপন বাদ দিন',
    visitSponsor: 'বিজ্ঞাপনে যান',
    cinemaMode: '১৬:৯ সিনেমা',
    reelMode: '৯:১৬ রিলস',
    bloggerCodeBtn: 'ব্লগার কোড',
    shareLink: 'শেয়ার করুন',
    copiedShare: 'লিংক কপি হয়েছে!',

    // Admin Panel
    adminDashboard: 'ড্যাশবোর্ড',
    adminDramas: 'ড্রামা ম্যানেজার',
    adminEpisodes: 'এপিসোড ম্যানেজার',
    adminMonetag: 'মোনিট্যাগ অ্যাড সেটিংস',
    adminFirebase: 'ফায়ারবেস সংযোগ',
    adminBlogger: 'ব্লগার কোড',
    adminHeaderTitle: 'ফ্রি ড্রামা কন্ট্রোল প্যানেল',
    adminHeaderDesc: 'ড্রামা ব্যবস্থাপনা, মোনিট্যাগ অ্যাডস ও ফায়ারবেস সিঙ্ক',

    // Admin Dashboard
    totalDramas: 'মোট ড্রামা',
    totalEpisodes: 'মোট পর্ব',
    heroFeatured: 'হিরো স্লাইডার ফিচার্ড',
    firebaseStatus: 'ফায়ারবেস অবস্থা',
    monetagStatus: 'মোনিট্যাগ অ্যাড অবস্থা',
    quickActions: 'দ্রুত অ্যাকশন',
    addNewDrama: 'নতুন ড্রামা যোগ করুন',
    getBloggerCode: 'ব্লগার কোড নিন',
    testFirebase: 'ফায়ারবেস টেস্ট করুন',
    livePublished: 'লাইভ পাবলিশড',
    activeMonetag: 'মোনিট্যাগ সক্রিয়',
    disabledMonetag: 'মোনিট্যাগ নিষ্ক্রিয়',

    // Admin Drama Modal
    editDrama: 'ড্রামা এডিট করুন',
    dramaTitle: 'ড্রামার নাম (ইংরেজি/মূল)',
    dramaTitleBn: 'বাংলা নাম',
    dramaTitleHi: 'হিন্দি নাম',
    languageLabel: 'ভাষা',
    categoryLabel: 'ক্যাটাগরি',
    viewsCountLabel: 'ভিউয়ার্স সংখ্যা',
    posterUrlLabel: 'পোস্টার ছবির URL',
    bannerUrlLabel: 'ব্যানার ছবির URL',
    descriptionLabel: 'কাহিনী সংক্ষেপ',
    featuredInHero: 'টপ হিরো স্লাইডারে দেখান',
    showInPopular: 'জনপ্রিয় তালিকায় রাখুন',
    showInComingSoon: 'শীঘ্রই আসছে তালিকায় রাখুন',
    saveDramaBtn: 'ড্রামা সংরক্ষণ করুন',
    cancelBtn: 'বাতিল',

    // Admin Episodes
    selectDrama: 'ড্রামা নির্বাচন করুন',
    addNewEpisode: 'নতুন পর্ব যুক্ত করুন',
    episodeNumber: 'পর্ব #',
    episodeTitle: 'পর্বের শিরোনাম',
    videoType: 'ভিডিও টাইপ',
    duration: 'সময়কাল',
    videoUrlLabel: 'ভিডিও লিংক / Direct MP4 / এম্বেড কোড',
    addEpisodeBtn: 'পর্ব যুক্ত করুন',
    existingEpisodes: 'বর্তমান পর্ব তালিকা',

    // Admin Monetag
    monetagTitle: 'মোনিট্যাগ বিজ্ঞাপন সেটিংস (Monetag Ads)',
    monetagDesc: 'আপনার সাইট থেকে আয় করতে মোনিট্যাগ স্ক্রিপ্ট, ডিরেক্ট লিংক ও প্রতিটি পর্বে ইন্টারস্টিশিয়াল অ্যাড কনফিগার করুন।',
    monetagEnableSwitch: 'মোনিট্যাগ বিজ্ঞাপন চালু রাখুন',
    monetagScriptLabel: 'মোনিট্যাগ স্ক্রিপ্ট ট্যাগ (In-Page / Popunder / SDK):',
    monetagScriptHelp: 'মোনিট্যাগের <script> কোডটি এখানে পেস্ট করুন (যেমন Tag, In-Page Push, Popunder)',
    monetagDirectLinkLabel: 'মোনিট্যাগ ডিরেক্ট লিংক (SmartLink URL):',
    monetagDirectLinkHelp: 'ইউজাররা যখন বিজ্ঞাপন দেখবে, পরবর্তী পর্ব পরিবর্তন করবে বা ভিআইপি আনলক করবে তখন এই স্মার্টলিংকটি ওপেন হবে।',
    showAdOnEpChangeLabel: 'প্রতিটি পর্ব পরিবর্তনের সময় বিজ্ঞাপন দেখান',
    adCountdownSecondsLabel: 'বিজ্ঞাপন দেখার সময়সীমা (সেকেন্ড):',
    openDirectLinkNewTab: 'নতুন ট্যাবে ডিরেক্ট লিংক খুলুন',
    monetagBannerHtmlLabel: 'প্লেয়ারের নিচে ব্যানার অ্যাড HTML কোড:',
    saveMonetagBtn: 'মোনিট্যাগ সেটিংস সেভ করুন',
    testAdPopupBtn: 'বিজ্ঞাপন টেস্ট করুন',

    // Admin Firebase
    firebaseTitle: 'ফায়ারবেস ক্লাউড কানেকশন (লাইভ)',
    firebaseDesc: 'kukuflix-53188 ফায়ারবেস প্রজেক্টের সাথে যুক্ত। ফায়ারস্টোর ও রিয়েলটাইম ডাটাবেস সক্রিয়।',
    firebaseConnected: 'ফায়ারবেস সফলভাবে সংযুক্ত হয়েছে!',
    firebaseSaveBtn: 'সেভ ও সংযোগ যাচাই করুন',
    resetDefaultFirebase: 'রিসেট ক্রেডেনশিয়াল',

    // Footer
    footerRights: 'সর্বস্বত্ব সংরক্ষিত। ব্লগার ও ওয়েব প্ল্যাটফর্মের জন্য প্রস্তুত।'
  },

  hi: {
    // Brand
    brandName: 'फ्री ड्रामा',
    brandTagline: 'फ्री शॉर्ट ड्रामा स्ट्रीमिंग और एडमिन प्लेटफॉर्म',
    brandSubtitle: 'प्रीमियम शॉर्ट ड्रामा',

    // Nav
    navHome: 'होम',
    navExplore: 'एक्सप्लोर',
    navTopRank: 'टॉप रैंक',
    navComingSoon: 'जल्द आ रहा है',
    navMyList: 'मेरी लिस्ट',
    searchPlaceholder: 'ड्रामा, कलाकार, शैली खोजें...',
    downloadApp: 'ऐप डाउनलोड',
    adminPanel: 'एडमिन पैनल',
    userMode: 'यूजर मोड',
    allLanguages: 'सभी भाषाएं',

    // Home sections
    watchNow: 'अभी देखें',
    viewsText: 'व्यूज',
    episodesText: 'एपिसोड्स',
    continueWatching: 'देखना जारी रखें',
    popularDramas: 'लोकप्रिय ड्रामा',
    topRankTitle: 'टॉप रैंक',
    comingSoonTitle: 'जल्द आ रहा है',
    newReleases: 'नई रिलीज',
    indianDramas: 'भारतीय ड्रामा',
    dubbedDramas: 'डब ड्रामा',
    bengaliDramas: 'बंगाली ड्रामा',
    viewAll: 'सभी देखें',
    notifyMe: 'मुझे सूचित करें',
    notified: 'सूचित किया गया',
    rankDaily: 'दैनिक',
    rankWeekly: 'साप्ताहिक',
    rankMonthly: 'मासिक',
    resumeEp: 'एपिसोड',

    // Explore & Filters
    exploreTitle: 'शॉर्ट ड्रामा एक्सप्लोर करें',
    exploreSubtitle: 'श्रेणी और भाषा के अनुसार प्रीमियम वर्टिकल ड्रामा देखें',
    searchResults: 'के लिए खोज परिणाम',
    noDramasFound: 'कोई ड्रामा नहीं मिला। दूसरा कीवर्ड आज़माएं।',
    clearSearch: 'सर्च हटाएं',
    savedListTitle: 'मेरी सुरक्षित लिस्ट',
    noSavedDramas: 'आपकी कोई सुरक्षित लिस्ट नहीं है।',
    noSavedDesc: 'होम पेज पर ड्रामा देखें और बुकमार्क पर क्लिक करके सेव करें।',
    backToHome: 'होम पर वापस जाएं',

    // Watch Player & Monetag Ads
    episode: 'एपिसोड',
    episodes: 'एपिसोड्स',
    searchEpisode: 'एपिसोड खोजें...',
    freeUnlock: 'विज्ञापन देखकर अनलॉक करें',
    vipLockedTitle: 'वीआईपी एपिसोड लॉक है',
    vipLockedDesc: 'फ्री में देखने के लिए एक छोटा विज्ञापन देखें!',
    watchAdToUnlock: 'विज्ञापन देखें और अनलॉक करें',
    unlockToAdTitle: 'विज्ञापन देखकर एपिसोड अनलॉक करें',
    unlockToAdSubtitle: 'इस एपिसोड को देखने के लिए एक छोटा प्रायोजित विज्ञापन देखें और तुरंत अनलॉक करें!',
    unlockToAdBtn: 'अनलॉक टू ऐड (विज्ञापन देखें)',
    adUnlocking: 'विज्ञापन लोड हो रहा है... अनलॉक हो रहा है!',
    unlockedNotice: 'एपिसोड अनलॉक हो गया! वीडियो शुरू हो रहा है...',
    premiumRequiredTitle: '👑 प्रीमियम वीआईपी एपिसोड',
    premiumRequiredDesc: 'यह एपिसोड केवल प्रीमियम सदस्यों के लिए है। देखने के लिए सदस्यता लें।',
    upgradeToVipBtn: '👑 प्रीमियम वीआईपी प्राप्त करें',
    accessTypeLabel: 'एक्सेस प्रकार',
    typeFree: 'फ्री (Free)',
    typeAd: 'विज्ञापन से अनलॉक (Ad)',
    typePremium: 'प्रीमियम (Premium VIP)',
    editEpisodeModalTitle: 'एपिसोड संपादित करें',
    saveEpisodeChanges: 'बदलाव सहेजें',
    bulkActionTitle: 'एक साथ एक्सेस बदलें:',
    allFree: 'सभी फ्री करें',
    allAd: 'सभी ऐड करें',
    allPremium: 'सभी प्रीमियम करें',
    smartMix: 'स्मार्ट मिक्स (1-3 फ्री, 4-10 ऐड, 11+ प्रीमियम)',
    sponsoredAd: 'मोनीटैग प्रायोजित विज्ञापन',
    adCountdown: 'विज्ञापन समाप्त होने में',
    skipAd: 'विज्ञापन छोड़ें',
    visitSponsor: 'प्रायोजक पर जाएं',
    cinemaMode: '१६:९ सिनेमा',
    reelMode: '९:१६ रील्स',
    bloggerCodeBtn: 'ब्लॉगर कोड',
    shareLink: 'शेयर करें',
    copiedShare: 'लिंक कॉपी हो गया!',

    // Admin Panel
    adminDashboard: 'डैशबोर्ड',
    adminDramas: 'ड्रामा मैनेजर',
    adminEpisodes: 'एपिसोड मैनेजर',
    adminMonetag: 'मोनीटैग एड्स सेटअप',
    adminFirebase: 'फायरबेस कनेक्शन',
    adminBlogger: 'ब्लॉगर कोड',
    adminHeaderTitle: 'फ्री ड्रामा कंट्रोल पैनल',
    adminHeaderDesc: 'ड्रामा प्रबंधन, मोनीटैग विज्ञापन और फायरबेस सिंक',

    // Admin Dashboard
    totalDramas: 'कुल ड्रामा',
    totalEpisodes: 'कुल एपिसोड्स',
    heroFeatured: 'हीरो स्लाइडर फीचर्ड',
    firebaseStatus: 'फायरबेस स्थिति',
    monetagStatus: 'मोनीटैग एड्स स्थिति',
    quickActions: 'त्वरित कार्रवाई',
    addNewDrama: 'नया ड्रामा जोड़ें',
    getBloggerCode: 'ब्लॉगर कोड प्राप्त करें',
    testFirebase: 'फायरबेस टेस्ट करें',
    livePublished: 'लाइव प्रकाशित',
    activeMonetag: 'मोनीटैग सक्रिय',
    disabledMonetag: 'मोनीटैग निष्क्रिय',

    // Admin Drama Modal
    editDrama: 'ड्रामा संपादित करें',
    dramaTitle: 'ड्रामा का नाम (अंग्रेजी/मूल)',
    dramaTitleBn: 'बंगाली नाम',
    dramaTitleHi: 'हिंदी नाम',
    languageLabel: 'भाषा',
    categoryLabel: 'श्रेणी',
    viewsCountLabel: 'व्यूज संख्या',
    posterUrlLabel: 'पोस्टर इमेज URL',
    bannerUrlLabel: 'बैनर इमेज URL',
    descriptionLabel: 'कहानी संक्षेप',
    featuredInHero: 'शीर्ष हीरो स्लाइडर में दिखाएं',
    showInPopular: 'लोकप्रिय सूची में दिखाएं',
    showInComingSoon: 'जल्द आ रहा है में दिखाएं',
    saveDramaBtn: 'ड्रामा सहेजें',
    cancelBtn: 'रद्द करें',

    // Admin Episodes
    selectDrama: 'ड्रामा चुनें',
    addNewEpisode: 'नया एपिसोड जोड़ें',
    episodeNumber: 'एपिसोड #',
    episodeTitle: 'एपिसोड शीर्षक',
    videoType: 'वीडियो प्रकार',
    duration: 'अवधि',
    videoUrlLabel: 'वीडियो लिंक / Direct MP4 / एम्बेड कोड',
    addEpisodeBtn: 'एपिसोड जोड़ें',
    existingEpisodes: 'वर्तमान एपिसोड सूची',

    // Admin Monetag
    monetagTitle: 'मोनीटैग विज्ञापन सेटिंग्स (Monetag Ads)',
    monetagDesc: 'कमाई के लिए मोनीटैग स्क्रिप्ट, डायरेक्ट लिंक और प्रत्येक एपिसोड पर विज्ञापन कॉन्फ़िगर करें।',
    monetagEnableSwitch: 'मोनीटैग विज्ञापन चालू रखें',
    monetagScriptLabel: 'मोनीटैग स्क्रिप्ट टैग (In-Page / Popunder / SDK):',
    monetagScriptHelp: 'मोनीटैग का <script> कोड यहां पेस्ट करें (जैसे Tag, In-Page Push, Popunder)',
    monetagDirectLinkLabel: 'मोनीटैग डायरेक्ट लिंक (SmartLink URL):',
    monetagDirectLinkHelp: 'जब यूजर्स विज्ञापन देखेंगे, अगला एपिसोड बदलेंगे या वीआईपी अनलॉक करेंगे तब यह स्मार्टलिंक खुलेगा।',
    showAdOnEpChangeLabel: 'प्रत्येक एपिसोड बदलते समय विज्ञापन दिखाएं',
    adCountdownSecondsLabel: 'विज्ञापन समय सीमा (सेकंड):',
    openDirectLinkNewTab: 'नए टैब में डायरेक्ट लिंक खोलें',
    monetagBannerHtmlLabel: 'प्लेयर के नीचे बैनर एड HTML कोड:',
    saveMonetagBtn: 'मोनीटैग सेटिंग्स सहेजें',
    testAdPopupBtn: 'विज्ञापन टेस्ट करें',

    // Admin Firebase
    firebaseTitle: 'फायरबेस क्लाउड कनेक्शन (लाइव)',
    firebaseDesc: 'kukuflix-53188 फायरबेस प्रोजेक्ट से जुड़ा हुआ है। फायरस्टोर और रीयलटाइम डेटाबेस तैयार है।',
    firebaseConnected: 'फायरबेस सफलतापूर्वक कनेक्ट हो गया!',
    firebaseSaveBtn: 'सहेजें और टेस्ट करें',
    resetDefaultFirebase: 'क्रेडेंशियल्स रीसेट करें',

    // Footer
    footerRights: 'सर्वाधिकार सुरक्षित। ब्लॉगर और वेब के लिए तैयार।'
  }
};

const LANG_STORAGE_KEY = 'free_drama_app_lang';

export function getStoredAppLanguage(): AppLanguage {
  try {
    const raw = localStorage.getItem(LANG_STORAGE_KEY);
    if (raw === 'bn' || raw === 'hi' || raw === 'en') {
      return raw;
    }
  } catch (e) {
    console.error(e);
  }
  return 'bn'; // Default to Bengali as requested by the user
}

export function saveStoredAppLanguage(lang: AppLanguage): void {
  try {
    localStorage.setItem(LANG_STORAGE_KEY, lang);
  } catch (e) {
    console.error(e);
  }
}
