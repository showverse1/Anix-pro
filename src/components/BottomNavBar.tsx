import React from 'react';
import { Home, Search, Download, Crown, User } from 'lucide-react';

export type NavTab = 'home' | 'search' | 'downloads' | 'vip' | 'profile';

interface BottomNavBarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  isVip: boolean;
  downloadsCount: number;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  currentTab,
  onSelectTab,
  isVip,
  downloadsCount,
}) => {
  const tabs: { id: NavTab; label: string; icon: React.FC<{ size?: number; className?: string }> }[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'search', label: 'Search', icon: Search },
    { id: 'downloads', label: 'Downloads', icon: Download },
    { id: 'vip', label: isVip ? 'VIP' : 'Get VIP', icon: Crown },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <nav className="w-full bg-[#0D0D16]/95 backdrop-blur-xl border-t border-white/10 px-2 py-1.5 flex items-center justify-around z-30 shrink-0 select-none shadow-[0_-5px_20px_rgba(0,0,0,0.6)]">
      {tabs.map((tab) => {
        const IconComponent = tab.icon;
        const isActive = currentTab === tab.id;
        const isVipTab = tab.id === 'vip';

        return (
          <button
            key={tab.id}
            onClick={() => onSelectTab(tab.id)}
            className={`flex-1 py-1 flex flex-col items-center justify-center relative transition-all duration-200 group active:scale-95 ${
              isActive
                ? isVipTab
                  ? 'text-[#FFD700]'
                  : 'text-[#FF2A55]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {/* Active Pill Indicator for Jetpack Compose M3 feel */}
            <div
              className={`relative px-4 py-0.5 rounded-full flex items-center justify-center transition-colors duration-200 ${
                isActive
                  ? isVipTab
                    ? 'bg-[#FFD700]/20'
                    : 'bg-[#FF2A55]/20 shadow-[0_0_12px_rgba(255,42,85,0.3)]'
                  : 'group-hover:bg-white/5'
              }`}
            >
              <IconComponent
                size={18}
                className={`transition-transform duration-200 ${
                  isActive ? 'scale-110' : 'group-hover:scale-105'
                } ${isVipTab && isVip ? 'fill-[#FFD700]' : ''}`}
              />

              {/* Downloads Badge */}
              {tab.id === 'downloads' && downloadsCount > 0 && (
                <span className="absolute -top-1 -right-1.5 w-4 h-4 rounded-full bg-[#00F0FF] text-black text-[9px] font-black flex items-center justify-center shadow">
                  {downloadsCount}
                </span>
              )}

              {/* VIP Sparkle Badge */}
              {isVipTab && isVip && (
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#FFD700] animate-pulse"></span>
              )}
            </div>

            <span
              className={`text-[10px] mt-0.5 font-medium tracking-tight ${
                isActive
                  ? isVipTab
                    ? 'font-bold text-[#FFD700]'
                    : 'font-bold text-white'
                  : 'text-slate-400'
              }`}
            >
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
