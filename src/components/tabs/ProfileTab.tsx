import React, { useState } from 'react';
import {
  User,
  Crown,
  Shield,
  Clock,
  Heart,
  Settings,
  HardDrive,
  Trash2,
  CheckCircle,
  ExternalLink,
  Sparkles,
  Code,
  GitBranch,
  ChevronRight,
  LogOut
} from 'lucide-react';
import { MediaItem } from '../../types';

interface ProfileTabProps {
  isVip: boolean;
  onOpenSubscription: () => void;
  onOpenAdmin: () => void;
  onOpenCodeInspector: () => void;
  onOpenCicdGuide: () => void;
  mediaList: MediaItem[];
  onSelectMedia: (media: MediaItem) => void;
}

export const ProfileTab: React.FC<ProfileTabProps> = ({
  isVip,
  onOpenSubscription,
  onOpenAdmin,
  onOpenCodeInspector,
  onOpenCicdGuide,
  mediaList,
  onSelectMedia,
}) => {
  const [hardwareAcceleration, setHardwareAcceleration] = useState(true);
  const [defaultQuality, setDefaultQuality] = useState('1080p');
  const [cacheCleared, setCacheCleared] = useState(false);

  const handleClearCache = () => {
    setCacheCleared(true);
    setTimeout(() => setCacheCleared(false), 2500);
  };

  return (
    <div className="flex-1 flex flex-col overflow-y-auto pb-4 p-3.5 space-y-4 scrollbar-none">
      {/* Profile Header Card */}
      <div className="p-4 rounded-3xl bg-gradient-to-r from-[#12121E] via-[#1A1828] to-[#12121E] border border-white/10 shadow-xl flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {/* Avatar with Cyberpunk Border */}
          <div className="relative">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#FF2A55] to-[#00F0FF] p-0.5 shadow-[0_0_15px_rgba(255,42,85,0.4)]">
              <div className="w-full h-full rounded-2xl bg-[#09090D] flex items-center justify-center text-white font-cyber font-bold text-lg">
                CR
              </div>
            </div>
            {isVip && (
              <div className="absolute -bottom-1 -right-1 p-1 rounded-full bg-[#FFD700] text-black shadow">
                <Crown size={11} className="fill-black" />
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-cyber font-bold text-white text-base">CyberRunner #94</h2>
              {isVip ? (
                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-[#FFD700]/20 text-[#FFD700] border border-[#FFD700]/50">
                  VIP
                </span>
              ) : (
                <span className="text-[9px] font-medium px-2 py-0.5 rounded-full bg-white/10 text-slate-400">
                  FREE
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 font-mono">verseshow94@gmail.com</p>
            <p className="text-[10px] text-slate-500 font-mono mt-0.5">UID: user_anix_001</p>
          </div>
        </div>
      </div>

      {/* VIP Status Banner */}
      {isVip ? (
        <div className="p-4 rounded-3xl bg-gradient-to-r from-[#201A0E] via-[#16130B] to-[#201A0E] border border-[#FFD700]/40 shadow-[0_0_30px_rgba(255,215,0,0.15)] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#FFD700] flex items-center gap-1.5 uppercase tracking-wide">
              <Crown size={14} className="fill-[#FFD700]" />
              <span>VIP Active • Pro Pass</span>
            </span>
            <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
              ACTIVE
            </span>
          </div>
          <p className="text-xs text-slate-200">
            Ad-blocking sandbox active • 1080p full bitrate enabled • Priority Abyss servers.
          </p>
          <div className="text-[10px] text-slate-400 pt-1 flex items-center justify-between border-t border-white/5">
            <span>Verified via UPI (UTR Sync)</span>
            <span className="text-[#FFD700] font-mono">Expires in 28 Days</span>
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-3xl bg-gradient-to-r from-[#1B1218] via-[#12121E] to-[#12121E] border border-[#FF2A55]/30 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <Sparkles size={14} className="text-[#FF2A55]" />
              <span>Upgrade to ANIX VIP</span>
            </span>
            <span className="text-xs font-black text-[#FFD700]">From ₹10</span>
          </div>
          <p className="text-xs text-slate-300">
            Strip ads from Abyss/Mux third-party embeds, unlock 1080p 60fps streams, and download anime for offline playback.
          </p>
          <button
            onClick={onOpenSubscription}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#FF2A55] to-[#FF5E80] text-white font-bold text-xs shadow-md shadow-[#FF2A55]/30 hover:brightness-110 active:scale-98 transition"
          >
            GET VIP ACCESS VIA ZERO-COST UPI
          </button>
        </div>
      )}

      {/* Stats Counter Bar */}
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="p-3 rounded-2xl bg-[#12121E] border border-white/5">
          <div className="text-base font-black text-white font-mono">14</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Watched</div>
        </div>
        <div className="p-3 rounded-2xl bg-[#12121E] border border-white/5">
          <div className="text-base font-black text-[#FF2A55] font-mono">8</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Favorites</div>
        </div>
        <div className="p-3 rounded-2xl bg-[#12121E] border border-white/5">
          <div className="text-base font-black text-[#00F0FF] font-mono">2</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Offline</div>
        </div>
      </div>

      {/* Watch History List */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <Clock size={13} className="text-[#00F0FF]" />
            <span>Recently Watched</span>
          </h3>
          <span className="text-[10px] text-slate-500">History</span>
        </div>

        <div className="space-y-1.5">
          {mediaList.slice(0, 3).map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectMedia(item)}
              className="p-2 rounded-xl bg-[#12121E] border border-white/5 hover:border-white/20 transition flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center gap-2.5 truncate">
                <img
                  src={item.posterUrl}
                  alt={item.title}
                  className="w-8 h-11 object-cover rounded-lg shrink-0 bg-black"
                />
                <div className="truncate">
                  <p className="text-xs text-white font-semibold truncate">{item.title}</p>
                  <p className="text-[10px] text-slate-400 font-mono">
                    {item.streamType} • ⭐ {item.rating}
                  </p>
                </div>
              </div>
              <ChevronRight size={15} className="text-slate-500 shrink-0" />
            </div>
          ))}
        </div>
      </div>

      {/* App & Streaming Preferences */}
      <div className="p-3.5 rounded-2xl bg-[#12121E] border border-white/10 space-y-3 text-xs">
        <h3 className="font-bold text-white uppercase tracking-wider flex items-center gap-1.5 text-xs">
          <Settings size={14} className="text-slate-400" />
          <span>Streaming Preferences</span>
        </h3>

        {/* Quality select */}
        <div className="flex items-center justify-between">
          <span className="text-slate-300">Default Video Quality</span>
          <select
            value={defaultQuality}
            onChange={(e) => setDefaultQuality(e.target.value)}
            className="bg-[#09090D] text-xs text-[#00F0FF] px-2.5 py-1 rounded-lg border border-white/10 font-bold focus:outline-none"
          >
            <option value="1080p">1080p Full HD</option>
            <option value="720p">720p HD</option>
            <option value="480p">480p Data Saver</option>
          </select>
        </div>

        {/* Hardware Acceleration */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-slate-300 block">Hardware Accelerated Decoding</span>
            <span className="text-[10px] text-slate-500">Smooth 60fps ExoPlayer rendering</span>
          </div>
          <button
            onClick={() => setHardwareAcceleration(!hardwareAcceleration)}
            className={`w-10 h-5 rounded-full transition p-0.5 ${
              hardwareAcceleration ? 'bg-[#FF2A55]' : 'bg-slate-700'
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full bg-white transition transform ${
                hardwareAcceleration ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Clear Cache */}
        <div className="flex items-center justify-between pt-1 border-t border-white/5">
          <span className="text-slate-400">Stream Cache (~45 MB)</span>
          <button
            onClick={handleClearCache}
            className="text-[11px] px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 flex items-center gap-1 transition"
          >
            <Trash2 size={12} />
            <span>{cacheCleared ? 'Cleared!' : 'Clear Cache'}</span>
          </button>
        </div>
      </div>

      {/* Developer & Admin Portal Links */}
      <div className="space-y-2">
        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
          Developer &amp; Creator Tools
        </h4>

        <div className="grid grid-cols-2 gap-2">
          {/* Hidden Admin Access */}
          <button
            onClick={onOpenAdmin}
            className="p-3 rounded-2xl bg-[#12121E] border border-[#00F0FF]/30 hover:bg-[#00F0FF]/10 text-left transition flex items-center gap-2.5"
          >
            <Shield size={16} className="text-[#00F0FF]" />
            <div>
              <p className="text-xs font-bold text-white">Admin Dashboard</p>
              <p className="text-[10px] text-slate-400 font-mono">/admin portal</p>
            </div>
          </button>

          {/* Android Studio Code */}
          <button
            onClick={onOpenCodeInspector}
            className="p-3 rounded-2xl bg-[#12121E] border border-white/10 hover:bg-white/5 text-left transition flex items-center gap-2.5"
          >
            <Code size={16} className="text-[#FF2A55]" />
            <div>
              <p className="text-xs font-bold text-white">Kotlin Source</p>
              <p className="text-[10px] text-slate-400 font-mono">ExoPlayer &amp; M3</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
