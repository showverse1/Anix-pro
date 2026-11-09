import React, { useState, useEffect } from 'react';
import { AndroidFrame } from './components/AndroidFrame';
import { CyberpunkNavbar } from './components/CyberpunkNavbar';
import { BottomNavBar, NavTab } from './components/BottomNavBar';
import { HomeTab } from './components/tabs/HomeTab';
import { SearchTab } from './components/tabs/SearchTab';
import { DownloadsTab } from './components/tabs/DownloadsTab';
import { ProfileTab } from './components/tabs/ProfileTab';
import { DualEnginePlayerView } from './components/DualEnginePlayerView';
import { UpiSubscriptionModal } from './components/UpiSubscriptionModal';
import { AdminDashboard } from './components/AdminDashboard';
import { CodeInspectorModal } from './components/CodeInspectorModal';
import { CicdGuideModal } from './components/CicdGuideModal';
import { storageService } from './services/storageService';
import { exportAndroidProjectZip } from './services/zipExporter';
import { MediaItem } from './types';

export default function App() {
  const [viewMode, setViewMode] = useState<'mobile' | 'tablet' | 'full'>('mobile');
  const [currentTab, setCurrentTab] = useState<NavTab>('home');
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeMediaForPlayback, setActiveMediaForPlayback] = useState<MediaItem | null>(null);

  // VIP & Modals State
  const [isVip, setIsVip] = useState<boolean>(false);
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState<boolean>(false);
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState<boolean>(false);
  const [isCodeInspectorOpen, setIsCodeInspectorOpen] = useState<boolean>(false);
  const [isCicdGuideOpen, setIsCicdGuideOpen] = useState<boolean>(false);

  // Load initial data & register storage change listeners
  const refreshData = () => {
    setMediaList(storageService.getMediaItems());
    const userSub = storageService.getUserSubscription();
    setIsVip(userSub.isVip);
  };

  useEffect(() => {
    refreshData();

    const handleMediaChange = () => setMediaList(storageService.getMediaItems());
    const handleSubChange = () => {
      const sub = storageService.getUserSubscription();
      setIsVip(sub.isVip);
    };

    window.addEventListener('anix_media_changed', handleMediaChange);
    window.addEventListener('anix_sub_changed', handleSubChange);

    return () => {
      window.removeEventListener('anix_media_changed', handleMediaChange);
      window.removeEventListener('anix_sub_changed', handleSubChange);
    };
  }, []);

  const handleToggleVipDirect = () => {
    const updated = storageService.toggleVipDirect();
    setIsVip(updated.isVip);
  };

  const handleDownloadProjectZip = async () => {
    await exportAndroidProjectZip();
  };

  const handleTabSelect = (tab: NavTab) => {
    if (tab === 'vip') {
      setIsSubscriptionModalOpen(true);
      return;
    }
    setCurrentTab(tab);
    // If a video is playing, close video overlay to show the chosen tab
    if (activeMediaForPlayback) {
      setActiveMediaForPlayback(null);
    }
  };

  return (
    <AndroidFrame
      viewMode={viewMode}
      onViewModeChange={setViewMode}
      onOpenCodeInspector={() => setIsCodeInspectorOpen(true)}
      onOpenCicdGuide={() => setIsCicdGuideOpen(true)}
      onDownloadProjectZip={handleDownloadProjectZip}
      isVip={isVip}
      onToggleVip={handleToggleVipDirect}
      onOpenAdmin={() => setIsAdminDashboardOpen(true)}
    >
      {/* If a media is actively selected for playback, render DualEnginePlayerView */}
      {activeMediaForPlayback ? (
        <DualEnginePlayerView
          media={activeMediaForPlayback}
          isVip={isVip}
          onBack={() => setActiveMediaForPlayback(null)}
          onOpenSubscription={() => setIsSubscriptionModalOpen(true)}
        />
      ) : (
        /* Main Android Screen Container with Active Tab & Bottom Navigation */
        <div className="flex-1 flex flex-col bg-[#09090D] overflow-hidden relative">
          {/* Top Bar (Shown on Home and Search) */}
          {currentTab === 'home' && (
            <CyberpunkNavbar
              isVip={isVip}
              onOpenSubscription={() => setIsSubscriptionModalOpen(true)}
              onOpenAdmin={() => setIsAdminDashboardOpen(true)}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              searchQuery={searchQuery}
              onSearchChange={(q) => {
                setSearchQuery(q);
                if (q.trim()) {
                  setCurrentTab('search');
                }
              }}
            />
          )}

          {/* Active Tab Screen */}
          <div className="flex-1 overflow-y-auto flex flex-col relative scrollbar-none">
            {currentTab === 'home' && (
              <HomeTab
                mediaList={mediaList}
                isTabletView={viewMode !== 'mobile'}
                onSelectMedia={(media) => setActiveMediaForPlayback(media)}
                isVip={isVip}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
                onOpenSubscription={() => setIsSubscriptionModalOpen(true)}
              />
            )}

            {currentTab === 'search' && (
              <SearchTab
                mediaList={mediaList}
                isTabletView={viewMode !== 'mobile'}
                onSelectMedia={(media) => setActiveMediaForPlayback(media)}
                isVip={isVip}
              />
            )}

            {currentTab === 'downloads' && (
              <DownloadsTab
                mediaList={mediaList}
                onSelectMedia={(media) => setActiveMediaForPlayback(media)}
                isVip={isVip}
                onOpenSubscription={() => setIsSubscriptionModalOpen(true)}
              />
            )}

            {currentTab === 'profile' && (
              <ProfileTab
                isVip={isVip}
                onOpenSubscription={() => setIsSubscriptionModalOpen(true)}
                onOpenAdmin={() => setIsAdminDashboardOpen(true)}
                onOpenCodeInspector={() => setIsCodeInspectorOpen(true)}
                onOpenCicdGuide={() => setIsCicdGuideOpen(true)}
                mediaList={mediaList}
                onSelectMedia={(media) => setActiveMediaForPlayback(media)}
              />
            )}
          </div>

          {/* Android Bottom Navigation Bar (Home, Search, Downloads, VIP, Profile) */}
          <BottomNavBar
            currentTab={currentTab}
            onSelectTab={handleTabSelect}
            isVip={isVip}
            downloadsCount={2}
          />
        </div>
      )}

      {/* Zero-Cost Direct UPI Subscription Modal */}
      <UpiSubscriptionModal
        isOpen={isSubscriptionModalOpen}
        onClose={() => setIsSubscriptionModalOpen(false)}
        isVip={isVip}
        onVipActivated={() => {
          setIsVip(true);
        }}
      />

      {/* Hidden Creator / Admin Dashboard */}
      <AdminDashboard
        isOpen={isAdminDashboardOpen}
        onClose={() => setIsAdminDashboardOpen(false)}
        onRefreshCatalog={refreshData}
      />

      {/* Native Kotlin Code & Project Inspector Modal */}
      <CodeInspectorModal
        isOpen={isCodeInspectorOpen}
        onClose={() => setIsCodeInspectorOpen(false)}
        onDownloadProjectZip={handleDownloadProjectZip}
      />

      {/* GitHub Actions CI/CD Automated APK Pipeline Guide */}
      <CicdGuideModal
        isOpen={isCicdGuideOpen}
        onClose={() => setIsCicdGuideOpen(false)}
      />
    </AndroidFrame>
  );
}
