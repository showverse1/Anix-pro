import { CurrentUserSubscription, MediaItem, SubscriptionTransaction } from '../types';
import { INITIAL_MEDIA_ITEMS } from '../data/mockData';

const MEDIA_STORAGE_KEY = 'anix_firestore_media';
const SUBSCRIPTIONS_STORAGE_KEY = 'anix_firestore_subscriptions';
const USER_SUB_KEY = 'anix_firestore_user_sub';

export const storageService = {
  // Load /media items
  getMediaItems(): MediaItem[] {
    try {
      const stored = localStorage.getItem(MEDIA_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to load media items from storage', e);
    }
    // Initialize default catalog
    localStorage.setItem(MEDIA_STORAGE_KEY, JSON.stringify(INITIAL_MEDIA_ITEMS));
    return INITIAL_MEDIA_ITEMS;
  },

  // Save / update media item
  saveMediaItem(item: MediaItem): void {
    const items = this.getMediaItems();
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
    const items = this.getMediaItems().filter((i) => i.id !== id);
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
    userEmail: string = 'user_demo@anix.stream'
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
    // Check duplicate UTR
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

    // Update /users/{uid}/subscription/current
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
      message: `VIP Activated! ${planDays} Days of Ad-Free & High-Bitrate access unlocked.`,
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

  // Toggle VIP directly (helpful for debugging/demoing)
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

  // Reset demo catalog
  resetToDefaultCatalog(): void {
    localStorage.setItem(MEDIA_STORAGE_KEY, JSON.stringify(INITIAL_MEDIA_ITEMS));
    window.dispatchEvent(new Event('anix_media_changed'));
  },
};
