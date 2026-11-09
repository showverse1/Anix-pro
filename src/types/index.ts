export type StreamType = 'DIRECT' | 'HLS' | 'ABYSS' | 'MUX' | 'DEMUX' | 'ECDN';

export interface SubtitleTrack {
  language: string;
  code: string;
  url: string;
  isDefault?: boolean;
}

export interface Episode {
  episodeNumber: number;
  title: string;
  duration: string;
  thumbnail: string;
  videoUrl: string;
  streamType: StreamType;
}

export interface MediaItem {
  id: string;
  title: string;
  altTitle: string;
  description: string;
  posterUrl: string;
  bannerUrl: string;
  category: string;
  rating: number;
  releaseYear: number;
  ageRating: string;
  audioLanguages: string[];
  status: string;

  // Dual-Engine Stream URLs
  videoUrl: string; // Default or Embed
  videoUrl480p?: string;
  videoUrl720p?: string;
  videoUrl1080p?: string;
  streamType: StreamType;

  episodes: Episode[];
  subtitles: SubtitleTrack[];
  createdAt: string;
  updatedAt: string;
}

export interface SubscriptionTransaction {
  txnId: string;
  userId: string;
  userEmail: string;
  planDays: number; // 7 or 30
  amount: number; // 10 or 50
  transactionId: string; // 12-digit UTR
  activatedAt: string;
  expiryTimestamp: string;
  status: 'ACTIVE' | 'EXPIRED' | 'PENDING' | 'REJECTED';
  paymentGateway: string;
}

export interface CurrentUserSubscription {
  isVip: boolean;
  planDays: number;
  transactionId: string;
  expiryTimestamp: string | null;
  activatedAt: string | null;
  tierName: 'FREE' | 'VIP';
}
