export type AppLanguage = 'en' | 'bn' | 'hi';
export type EpisodeAccessType = 'free' | 'ad' | 'premium';

export interface Episode {
  id: string;
  episodeNumber: number;
  title: string;
  videoUrl: string;
  videoType: 'mp4' | 'youtube' | 'iframe';
  duration: string;
  isLocked: boolean;
  accessType?: EpisodeAccessType; // 'free' | 'ad' | 'premium'
  views: string;
}

export function getEpisodeAccessType(ep: Episode): EpisodeAccessType {
  if (ep.accessType === 'free' || ep.accessType === 'ad' || ep.accessType === 'premium') {
    return ep.accessType;
  }
  return ep.isLocked ? 'ad' : 'free';
}

export interface Drama {
  id: string;
  title: string;
  titleBn?: string;
  titleHi?: string;
  slug: string;
  language: 'Hindi' | 'Bengali' | 'English' | 'Dubbed' | 'Tamil' | string;
  description: string;
  views: string;
  totalEpisodes: number;
  genres: string[];
  poster: string;
  banner: string;
  isFeaturedHero: boolean;
  heroRank?: number;
  isPopular: boolean;
  isNew: boolean;
  isComingSoon: boolean;
  releaseDate?: string;
  topRankDaily?: number;
  topRankWeekly?: number;
  topRankMonthly?: number;
  category: 'Indian' | 'Dubbed' | 'Romance' | 'Action' | 'Revenge' | 'Billionaire' | 'Fantasy' | string;
  episodes: Episode[];
  createdAt?: string;
}

export interface ContinueWatchItem {
  dramaId: string;
  episodeId: string;
  episodeNumber: number;
  progressPercent: number;
  lastWatchedAt: string;
}

export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  databaseURL?: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  enabled: boolean;
}

export interface MonetagConfig {
  enabled: boolean;
  scriptTag: string;
  directLinkUrl: string;
  inPagePushScript: string;
  showAdOnEpisodeChange: boolean;
  adCountdownSeconds: number;
  bannerHtml: string;
  openDirectLinkInNewTab: boolean;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  nameBn?: string;
  price: number;
  currency: string;
  durationDays: number;
  badge?: string;
  features: string[];
}

export interface PaymentSettings {
  bkashNumber: string;
  bkashType: 'Personal' | 'Merchant' | 'Agent';
  nagadNumber: string;
  nagadType: 'Personal' | 'Merchant' | 'Agent';
  instructionsBn: string;
  instructionsEn: string;
  enabled: boolean;
}

export interface SubscriptionOrder {
  id: string;
  planId: string;
  planName: string;
  amount: number;
  paymentMethod: 'bkash' | 'nagad';
  senderNumber: string;
  transactionId: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export interface UserVIPStatus {
  isVIP: boolean;
  planName?: string;
  expiresAt?: string;
  transactionId?: string;
}
