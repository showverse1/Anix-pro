export type StreamType =
  | 'DIRECT'
  | 'HLS'
  | 'ABYSS'
  | 'MUX'
  | 'DEMUX'
  | 'ECDN'
  | 'ARCHIVE';

export type MediaCategory = 'Anime' | 'Series' | 'Drama' | 'Movies';
export type MediaStatus = 'PUBLISHED' | 'DRAFT';

export interface SubtitleTrack {
  language: string;
  languageCode: string; // "en", "hi", "ja"
  url: string;
  isDefault?: boolean;
}

export interface EpisodeItem {
  id: string;
  episodeNumber: number;
  seasonNumber: number;
  title: string;
  duration: string;
  videoUrl: string;
  videoUrl480p?: string;
  videoUrl720p?: string;
  videoUrl1080p?: string;
  streamType: StreamType;
  subtitles: SubtitleTrack[];
}

export interface MediaItem {
  id: string;
  title: string;
  altTitle: string; // Japanese Original Title in Gold #FFD700
  description: string;
  posterUrl: string;
  bannerUrl: string;
  category: MediaCategory;
  rating: number; // e.g. 8.9
  releaseYear: string; // e.g. "2024"
  duration: string; // e.g. "24m/ep"
  ageRating: '13+' | '16+' | '18+';
  audioLanguages: string; // e.g. "Japanese, Hindi Sub"
  status: MediaStatus; // Strictly query & display PUBLISHED only

  // Universal Multi-Stream URLs
  videoUrl: string; // Default / Master / Abyss stream
  videoUrl480p?: string; // 480p SD stream link
  videoUrl720p?: string; // 720p HD stream link
  videoUrl1080p?: string; // 1080p FHD stream link
  streamType: StreamType;

  episodes: EpisodeItem[];
  subtitles: SubtitleTrack[];
  createdAt: string;
  updatedAt: string;
}

export interface AppUpdateInfo {
  versionCode: number;
  versionName: string;
  title: string;
  changelog: string;
  downloadUrl: string;
  forceUpdate: boolean;
  broadcastActive: boolean;
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

export interface DownloadedItem {
  id: string;
  mediaId: string;
  title: string;
  altTitle: string;
  episodeId: string;
  episodeNumber: number;
  seasonNumber: number;
  quality: '1080p FHD' | '720p HD' | '480p SD';
  fileSizeBytes: number;
  thumbnail: string;
  downloadedAt: string;
  videoUrl: string;
  media: MediaItem;
}
