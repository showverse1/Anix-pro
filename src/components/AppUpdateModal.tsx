import React, { useState } from 'react';
import { AlertCircle, Download, Sparkles, X, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { AppUpdateInfo } from '../types';

interface AppUpdateModalProps {
  updateInfo: AppUpdateInfo;
  currentDeviceVersionCode: number;
  isOpen: boolean;
  onDismiss: () => void;
}

export const AppUpdateModal: React.FC<AppUpdateModalProps> = ({
  updateInfo,
  currentDeviceVersionCode,
  isOpen,
  onDismiss,
}) => {
  const [downloadStarted, setDownloadStarted] = useState(false);

  if (!isOpen) return null;

  const hasNewUpdate =
    updateInfo.broadcastActive && currentDeviceVersionCode < updateInfo.versionCode;

  if (!hasNewUpdate) return null;

  const handleUpdateClick = () => {
    setDownloadStarted(true);
    // Trigger download or external release link
    setTimeout(() => {
      window.open(updateInfo.downloadUrl, '_blank');
    }, 400);
  };

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 overflow-y-auto"
      onClick={(e) => {
        // Trap back/clicks if forceUpdate is true!
        if (updateInfo.forceUpdate) {
          e.stopPropagation();
        }
      }}
    >
      <div className="relative w-full max-w-md bg-[#0D0D16] rounded-3xl border-2 border-[#FF2A55] shadow-[0_0_60px_rgba(255,42,85,0.35)] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Top Cyberpunk Banner */}
        <div className="px-5 py-4 bg-gradient-to-r from-[#18101C] via-[#2A101C] to-[#18101C] border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#FF2A55]/20 border border-[#FF2A55]/50 flex items-center justify-center text-[#FF2A55]">
              <Sparkles size={16} />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold text-[#00E5FF] uppercase tracking-wider block">
                ANIX Remote OTA Pipeline
              </span>
              <h3 className="font-cyber font-bold text-white text-base leading-tight">
                {updateInfo.title}
              </h3>
            </div>
          </div>

          {/* Dismiss button only if NOT forceUpdate */}
          {!updateInfo.forceUpdate && (
            <button
              onClick={onDismiss}
              className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 text-slate-400 hover:text-white flex items-center justify-center transition"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4 text-xs text-slate-300">
          <div className="flex items-center justify-between bg-black/40 p-2.5 rounded-xl border border-white/5 font-mono text-[11px]">
            <div>
              <span className="text-slate-500 block text-[9px] uppercase">Installed</span>
              <span className="text-slate-300 font-bold">v1.0.0 (Build {currentDeviceVersionCode})</span>
            </div>
            <div className="text-right">
              <span className="text-[#FFD700] block text-[9px] uppercase font-bold">Available</span>
              <span className="text-[#00E5FF] font-black">{updateInfo.versionName}</span>
            </div>
          </div>

          {/* Force Update Alert if mandatory */}
          {updateInfo.forceUpdate && (
            <div className="p-3 rounded-2xl bg-red-950/70 border border-red-500/40 text-red-300 flex items-start gap-2.5">
              <ShieldAlert size={16} className="shrink-0 mt-0.5 text-red-400" />
              <div className="text-[11px] leading-snug">
                <strong className="text-white block font-bold">Critical Security &amp; Stream Update</strong>
                Older builds will fail to decode 144Hz multi-stream CDN nodes. Please update to proceed.
              </div>
            </div>
          )}

          {/* Changelog Bullets */}
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block mb-1.5 font-bold">
              What&apos;s New in this Build:
            </span>
            <div className="bg-[#12121E] p-3 rounded-2xl border border-white/5 space-y-1.5 font-sans leading-relaxed text-slate-200">
              {updateInfo.changelog.split('\n').map((line, idx) => (
                <div key={idx} className="flex items-start gap-1.5">
                  <span className="text-[#FF2A55] shrink-0 font-bold">•</span>
                  <span>{line.replace(/^•\s*/, '')}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 space-y-2">
            <button
              onClick={handleUpdateClick}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#FF2A55] to-[#FF5E80] text-white font-extrabold text-xs uppercase tracking-wider shadow-[0_0_25px_rgba(255,42,85,0.5)] hover:brightness-110 active:scale-98 transition flex items-center justify-center gap-2"
            >
              <Download size={15} />
              <span>{downloadStarted ? 'Launching Installer...' : 'UPDATE NOW (DIRECT APK)'}</span>
            </button>

            {!updateInfo.forceUpdate && (
              <button
                onClick={onDismiss}
                className="w-full py-2 text-center text-slate-400 hover:text-white text-xs font-semibold transition"
              >
                Remind Me Later
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
