import React, { useState, useEffect } from 'react';
import { Smartphone, Tablet, Monitor, Wifi, BatteryCharging, Shield, Code, Download, GitBranch } from 'lucide-react';

interface AndroidFrameProps {
  children: React.ReactNode;
  viewMode: 'mobile' | 'tablet' | 'full';
  onViewModeChange: (mode: 'mobile' | 'tablet' | 'full') => void;
  onOpenCodeInspector: () => void;
  onOpenCicdGuide: () => void;
  onDownloadProjectZip: () => void;
  isVip: boolean;
  onToggleVip: () => void;
  onOpenAdmin: () => void;
}

export const AndroidFrame: React.FC<AndroidFrameProps> = ({
  children,
  viewMode,
  onViewModeChange,
  onOpenCodeInspector,
  onOpenCicdGuide,
  onDownloadProjectZip,
  isVip,
  onToggleVip,
  onOpenAdmin,
}) => {
  const [time, setTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#07070A] text-slate-100 flex flex-col items-center">
      {/* Top Cyberpunk Toolbar */}
      <header className="w-full bg-[#0D0D14] border-b border-white/10 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 shadow-xl z-50">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF2A55] animate-pulse"></span>
            <span className="font-cyber font-bold tracking-widest text-lg text-white">
              ANIX<span className="text-[#00F0FF]">.OS</span>
            </span>
          </div>
          <span className="text-xs px-2 py-0.5 rounded bg-white/5 border border-white/10 text-slate-400 hidden sm:inline-block">
            Android 14 (API 34) • Jetpack Compose M3
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Device Size Switchers */}
          <div className="bg-[#151522] p-1 rounded-lg border border-white/10 flex items-center gap-1">
            <button
              onClick={() => onViewModeChange('mobile')}
              title="Mobile Portrait (3-column grid)"
              className={`p-1.5 rounded transition ${
                viewMode === 'mobile'
                  ? 'bg-[#FF2A55] text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Smartphone size={16} />
            </button>
            <button
              onClick={() => onViewModeChange('tablet')}
              title="Tablet Landscape (6-column grid)"
              className={`p-1.5 rounded transition ${
                viewMode === 'tablet'
                  ? 'bg-[#FF2A55] text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Tablet size={16} />
            </button>
            <button
              onClick={() => onViewModeChange('full')}
              title="Expanded Window"
              className={`p-1.5 rounded transition ${
                viewMode === 'full'
                  ? 'bg-[#FF2A55] text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Monitor size={16} />
            </button>
          </div>

          {/* Quick VIP Toggle for testing */}
          <button
            onClick={onToggleVip}
            title="Toggle VIP ad-blocking & 1080p stream perks"
            className={`text-xs font-semibold px-3 py-1.5 rounded-lg border flex items-center gap-1.5 transition ${
              isVip
                ? 'bg-[#FFD700]/20 text-[#FFD700] border-[#FFD700]'
                : 'bg-white/5 text-slate-300 border-white/10 hover:border-[#FFD700]/60'
            }`}
          >
            <Shield size={14} className={isVip ? 'text-[#FFD700]' : ''} />
            <span>{isVip ? 'VIP: ACTIVE' : 'TEST VIP'}</span>
          </button>

          {/* Hidden Admin Access */}
          <button
            onClick={onOpenAdmin}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-[#00F0FF]/10 text-[#00F0FF] border border-[#00F0FF]/30 hover:bg-[#00F0FF]/20 transition flex items-center gap-1"
          >
            <span>/admin</span>
          </button>

          {/* View Kotlin Code & Project Inspector */}
          <button
            onClick={onOpenCodeInspector}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-white/5 text-slate-200 border border-white/15 hover:bg-white/10 transition flex items-center gap-1.5"
          >
            <Code size={14} className="text-[#00F0FF]" />
            <span className="hidden md:inline">Android Studio</span> Code
          </button>

          {/* GitHub Actions CI/CD Guide */}
          <button
            onClick={onOpenCicdGuide}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-[#FF2A55]/15 text-[#FF2A55] border border-[#FF2A55]/40 hover:bg-[#FF2A55]/25 transition flex items-center gap-1.5"
          >
            <GitBranch size={14} />
            <span className="hidden md:inline">CI/CD</span> APK
          </button>

          {/* Download Complete Android Project ZIP */}
          <button
            onClick={onDownloadProjectZip}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#FF2A55] to-[#FF5E80] text-white shadow-md hover:brightness-110 transition flex items-center gap-1.5"
          >
            <Download size={14} />
            <span>Export Project ZIP</span>
          </button>
        </div>
      </header>

      {/* Main Workspace Frame */}
      <main className="flex-1 w-full flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-hidden">
        {viewMode === 'full' ? (
          <div className="w-full h-[calc(100vh-68px)] max-w-7xl rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-[#09090D] flex flex-col">
            {children}
          </div>
        ) : (
          <div
            className={`transition-all duration-300 relative rounded-[44px] p-3.5 bg-gradient-to-b from-[#252538] via-[#12121E] to-[#0D0D14] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_40px_rgba(255,42,85,0.15)] border-2 border-white/15 ${
              viewMode === 'mobile'
                ? 'w-[390px] h-[820px] max-h-[92vh]'
                : 'w-[960px] h-[640px] max-h-[92vh]'
            } flex flex-col`}
          >
            {/* Screen Inner Shell */}
            <div className="relative w-full h-full rounded-[34px] overflow-hidden bg-[#09090D] flex flex-col border border-white/5">
              {/* Android Status Bar */}
              <div className="h-8 bg-[#09090D] px-6 flex items-center justify-between text-[11px] text-slate-300 select-none z-30 shrink-0">
                <span className="font-semibold">{time || '10:45'}</span>

                {/* Camera punch hole cutout */}
                <div className="w-3.5 h-3.5 rounded-full bg-black border border-white/10 shadow-inner flex items-center justify-center">
                  <div className="w-1 h-1 rounded-full bg-[#00F0FF]/40"></div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold text-[#00F0FF]">5G</span>
                  <Wifi size={13} />
                  <BatteryCharging size={14} className="text-[#00E676]" />
                </div>
              </div>

              {/* Application Content Canvas */}
              <div className="flex-1 overflow-y-auto overflow-x-hidden relative flex flex-col">
                {children}
              </div>

              {/* Android Bottom Gesture Bar Pill */}
              <div className="h-4 bg-[#09090D] flex items-center justify-center shrink-0 z-30">
                <div className="w-28 h-1 rounded-full bg-white/30"></div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
