import {
  AppUpdateInfo,
  CurrentUserSubscription,
  DownloadedItem,
  MediaItem,
  SubscriptionTransaction,
} from '../types';
import { DEFAULT_APP_UPDATE, INITIAL_MEDIA_ITEMS } from '../data/mockData';

const MEDIA_STORAGE_KEY = 'anix_firestore_media';
const SUBSCRIPTIONS_STORAGE_KEY = 'anix_firestore_subscriptions';
const USER_SUB_KEY = 'anix_firestore_user_sub';
const DOWNLOADS_STORAGE_KEY = 'anix_downloads_v2';
const APP_UPDATE_STORAGE_KEY = 'anix_app_update_latest';

export const storageService = {
  // Load /media items (STRICTLY filter status === 'PUBLISHED')
  getMediaItems(includeDrafts: boolean = false): MediaItem[] {
    try {
      const stored = localStorage.getItem(MEDIA_STORAGE_KEY);
      let items: MediaItem[] = [];
      if (stored) {
        items = JSON.parse(stored);
      } else {
        items = INITIAL_MEDIA_ITEMS;
        localStorage.setItem(MEDIA_STORAGE_KEY, JSON.stringify(items));
      }

      if (includeDrafts) {
        return items;
      }
      // Strictly query & display PUBLISHED only!
      return items.filter((m) => m.status === 'PUBLISHED');
    } catch (e) {
      console.error('Failed to load media items from storage', e);
      return INITIAL_MEDIA_ITEMS.filter((m) => m.status === 'PUBLISHED');
    }
  },

  // Save / update media item
  saveMediaItem(item: MediaItem): void {
    const items = this.getMediaItems(true); // include drafts to mutate
    const index = items.findIndex((i) => i.id === item.id);
    if (index >= 0) {
      items[index] = { ...item, updatedAt: new Date().toISOString() };
    } else {
      items.unshift({
        ...item,
        id: item.id || `anix-media-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }
    localStorage.setItem(MEDIA_STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new Event('anix_media_changed'));
  },

  // Delete media item
  deleteMediaItem(id: string): void {
    const items = this.getMediaItems(true).filter((i) => i.id !== id);
    localStorage.setItem(MEDIA_STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new Event('anix_media_changed'));
  },

  // Subscriptions (/subscriptions/{txnId})
  getSubscriptions(): SubscriptionTransaction[] {
    try {
      const stored = localStorage.getItem(SUBSCRIPTIONS_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to load subscriptions', e);
    }
    return [
      {
        txnId: '408219876543',
        userId: 'user_anix_001',
        userEmail: 'subscriber@anix.stream',
        planDays: 30,
        amount: 50,
        transactionId: '408219876543',
        activatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        expiryTimestamp: new Date(Date.now() + 86400000 * 28).toISOString(),
        status: 'ACTIVE',
        paymentGateway: 'UPI_NATIVE_INTENT',
      },
    ];
  },

  // Verify and activate subscription via 12-digit UTR
  verifyAndActivateSubscription(
    utr: string,
    planDays: number,
    amount: number,
    userId: string = 'user_anix_001',
    userEmail: string = 'verseshow94@gmail.com'
  ): { success: boolean; message: string; sub?: CurrentUserSubscription } {
    const trimmedUtr = utr.trim();

    // Regex check: exactly 12 digits
    if (!/^[0-9]{12}$/.test(trimmedUtr)) {
      return {
        success: false,
        message: 'Invalid UTR format. Bank reference number must be exactly 12 numeric digits.',
      };
    }

    const subs = this.getSubscriptions();
    const isDuplicate = subs.some((s) => s.transactionId === trimmedUtr);
    if (isDuplicate) {
      return {
        success: false,
        message: `This 12-digit UTR (${trimmedUtr}) has already been redeemed or recorded in Firestore.`,
      };
    }

    const now = new Date();
    const expiry = new Date(now.getTime() + planDays * 24 * 60 * 60 * 1000);

    const newTxn: SubscriptionTransaction = {
      txnId: trimmedUtr,
      userId,
      userEmail,
      planDays,
      amount,
      transactionId: trimmedUtr,
      activatedAt: now.toISOString(),
      expiryTimestamp: expiry.toISOString(),
      status: 'ACTIVE',
      paymentGateway: 'UPI_NATIVE_INTENT',
    };

    subs.unshift(newTxn);
    localStorage.setItem(SUBSCRIPTIONS_STORAGE_KEY, JSON.stringify(subs));

    // Update /users/{uid}/subscription/current (EncryptedSharedPreferences mirror)
    const currentSub: CurrentUserSubscription = {
      isVip: true,
      planDays,
      transactionId: trimmedUtr,
      expiryTimestamp: expiry.toISOString(),
      activatedAt: now.toISOString(),
      tierName: 'VIP',
    };

    localStorage.setItem(USER_SUB_KEY, JSON.stringify(currentSub));
    window.dispatchEvent(new Event('anix_sub_changed'));

    return {
      success: true,
      message: `VIP Activated! ${planDays} Days of Ultra-Fast 1080p, Offline Downloads & Zero Ads unlocked.`,
      sub: currentSub,
    };
  },

  // Get current user subscription
  getUserSubscription(): CurrentUserSubscription {
    try {
      const stored = localStorage.getItem(USER_SUB_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error(e);
    }
    return {
      isVip: false,
      planDays: 0,
      transactionId: '',
      expiryTimestamp: null,
      activatedAt: null,
      tierName: 'FREE',
    };
  },

  toggleVipDirect(enable?: boolean): CurrentUserSubscription {
    const current = this.getUserSubscription();
    const shouldEnable = enable !== undefined ? enable : !current.isVip;
    const now = new Date();
    const expiry = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    const newSub: CurrentUserSubscription = {
      isVip: shouldEnable,
      planDays: shouldEnable ? 30 : 0,
      transactionId: shouldEnable ? 'DEMO_VIP_ACTIVE' : '',
      expiryTimestamp: shouldEnable ? expiry.toISOString() : null,
      activatedAt: shouldEnable ? now.toISOString() : null,
      tierName: shouldEnable ? 'VIP' : 'FREE',
    };

    localStorage.setItem(USER_SUB_KEY, JSON.stringify(newSub));
    window.dispatchEvent(new Event('anix_sub_changed'));
    return newSub;
  },

  // VIP Download Manager Storage
  getDownloads(): DownloadedItem[] {
    try {
      const stored = localStorage.getItem(DOWNLOADS_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error(e);
    }
    // Pre-populate with initial downloaded episodes
    const initialList: DownloadedItem[] = [
      {
        id: 'dl-item-001',
        mediaId: 'anix-001',
        title: 'Cyberpunk: Neon Genesis 2099',
        altTitle: '新世紀サイバーパンク：2099',
        episodeId: 'ep-001-1',
        episodeNumber: 1,
        seasonNumber: 1,
        quality: '1080p FHD',
        fileSizeBytes: 495000000, // 495 MB
        thumbnail: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600',
        downloadedAt: 'Today, 10:15 AM',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
        media: INITIAL_MEDIA_ITEMS[0],
      },
      {
        id: 'dl-item-002',
        mediaId: 'anix-003',
        title: 'Archive Chronicles: Retro Odyssey',
        altTitle: 'アーカイブ年代記：レトロ・オデッセイ',
        episodeId: 'ep-003-1',
        episodeNumber: 1,
        seasonNumber: 1,
        quality: '720p HD',
        fileSizeBytes: 310000000, // 310 MB
        thumbnail: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=600',
        downloadedAt: 'Yesterday',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        media: INITIAL_MEDIA_ITEMS[2],
      },
    ];
    localStorage.setItem(DOWNLOADS_STORAGE_KEY, JSON.stringify(initialList));
    return initialList;
  },

  saveDownload(item: DownloadedItem): void {
    const list = this.getDownloads();
    if (!list.some((d) => d.id === item.id)) {
      list.unshift(item);
      localStorage.setItem(DOWNLOADS_STORAGE_KEY, JSON.stringify(list));
      window.dispatchEvent(new Event('anix_downloads_changed'));
    }
  },

  deleteDownload(id: string): void {
    const list = this.getDownloads().filter((d) => d.id !== id);
    localStorage.setItem(DOWNLOADS_STORAGE_KEY, JSON.stringify(list));
    window.dispatchEvent(new Event('anix_downloads_changed'));
  },

  // App Updates Collection (/app_updates/latest)
  getAppUpdate(): AppUpdateInfo {
    try {
      const stored = localStorage.getItem(APP_UPDATE_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_APP_UPDATE;
  },

  saveAppUpdate(update: AppUpdateInfo): void {
    localStorage.setItem(APP_UPDATE_STORAGE_KEY, JSON.stringify(update));
    window.dispatchEvent(new Event('anix_app_update_changed'));
  },

  resetToDefaultCatalog(): void {
    localStorage.setItem(MEDIA_STORAGE_KEY, JSON.stringify(INITIAL_MEDIA_ITEMS));
    localStorage.setItem(APP_UPDATE_STORAGE_KEY, JSON.stringify(DEFAULT_APP_UPDATE));
    window.dispatchEvent(new Event('anix_media_changed'));
    window.dispatchEvent(new Event('anix_app_update_changed'));
  },
};
