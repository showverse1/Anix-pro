import React, { useState } from 'react';
import {
  Download,
  Trash2,
  Play,
  HardDrive,
  CheckCircle2,
  Crown,
  Sparkles,
  ArrowDownToLine,
  Film
} from 'lucide-react';
import { MediaItem } from '../../types';

interface DownloadedEpisode {
  id: string;
  mediaId: string;
  title: string;
  episodeNumber: number;
  duration: string;
  quality: string;
  fileSizeBytes: number;
  thumbnail: string;
  downloadedAt: string;
  media: MediaItem;
}

interface DownloadsTabProps {
  mediaList: MediaItem[];
  onSelectMedia: (media: MediaItem) => void;
  isVip: boolean;
  onOpenSubscription: () => void;
}

export const DownloadsTab: React.FC<DownloadsTabProps> = ({
  mediaList,
  onSelectMedia,
  isVip,
  onOpenSubscription,
}) => {
  // Pre-seed with downloaded episodes from sample catalog
  const [downloads, setDownloads] = useState<DownloadedEpisode[]>([
    {
      id: 'dl-001',
      mediaId: mediaList[0]?.id || 'anix-001',
      title: 'Cyberpunk: Neon Genesis 2099',
      episodeNumber: 1,
      duration: '24m',
      quality: '1080p Full HD',
      fileSizeBytes: 472000000, // 472 MB
      thumbnail:
        mediaList[0]?.posterUrl ||
        'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600',
      downloadedAt: '2 hours ago',
      media: mediaList[0],
    },
    {
      id: 'dl-002',
      mediaId: mediaList[2]?.id || 'anix-003',
      title: 'Solo Shadow Hunter: Reborn',
      episodeNumber: 1,
      duration: '24m',
      quality: '720p HD',
      fileSizeBytes: 295000000, // 295 MB
      thumbnail:
        mediaList[2]?.posterUrl ||
        'https://images.unsplash.com/photo-1563089145-599997674d42?w=600',
      downloadedAt: 'Yesterday',
      media: mediaList[2] || mediaList[0],
    },
  ]);

  const [downloadSuccessToast, setDownloadSuccessToast] = useState<string | null>(null);

  const totalUsedMb = Math.round(
    downloads.reduce((acc, curr) => acc + curr.fileSizeBytes, 0) / (1024 * 1024)
  );

  const handleDeleteDownload = (id: string) => {
    setDownloads((prev) => prev.filter((d) => d.id !== id));
  };

  const handleDownloadNew = (media: MediaItem) => {
    if (downloads.some((d) => d.mediaId === media.id)) {
      setDownloadSuccessToast(`"${media.title}" is already in your offline downloads!`);
      setTimeout(() => setDownloadSuccessToast(null), 2500);
      return;
    }

    const newDownload: DownloadedEpisode = {
      id: `dl-${Date.now()}`,
      mediaId: media.id,
      title: media.title,
      episodeNumber: 1,
      duration: '24m',
      quality: isVip ? '1080p VIP Master' : '720p Standard',
      fileSizeBytes: isVip ? 480000000 : 280000000,
      thumbnail: media.posterUrl,
      downloadedAt: 'Just now',
      media,
    };

    setDownloads([newDownload, ...downloads]);
    setDownloadSuccessToast(`Downloaded "${media.title}" for offline playback!`);
    setTimeout(() => setDownloadSuccessToast(null), 3000);
  };

  return (
    <div className="flex-1 flex flex-col overflow-y-auto pb-4 p-3.5 space-y-4 scrollbar-none">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-cyber font-bold text-white text-base tracking-wide flex items-center gap-2">
            OFFLINE DOWNLOADS
            <span className="text-[10px] font-mono text-[#00E676] bg-[#00E676]/10 px-2 py-0.5 rounded border border-[#00E676]/30">
              OFFLINE READY
            </span>
          </h2>
          <p className="text-[11px] text-slate-400">
            Stream anytime without internet, mobile data, or buffering.
          </p>
        </div>

        <div className="text-right">
          <span className="text-xs font-mono font-bold text-[#00F0FF]">
            {downloads.length} Episode{downloads.length === 1 ? '' : 's'}
          </span>
        </div>
      </div>

      {/* Storage Meter Bar */}
      <div className="p-3.5 rounded-2xl bg-[#12121E] border border-white/10 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-300 font-bold flex items-center gap-1.5">
            <HardDrive size={14} className="text-[#00F0FF]" />
            <span>Internal Device Storage</span>
          </span>
          <span className="font-mono text-slate-400 text-[11px]">
            {totalUsedMb} MB / 64 GB used
          </span>
        </div>
        <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#00F0FF] to-[#FF2A55]"
            style={{ width: `${Math.min(100, Math.max(5, (totalUsedMb / 1000) * 10))}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-[10px] text-slate-500">
          <span>ANIX Downloads: {totalUsedMb} MB</span>
          <span>Free Space: ~58.2 GB</span>
        </div>
      </div>

      {/* Download Toast Notification */}
      {downloadSuccessToast && (
        <div className="p-2.5 rounded-xl bg-emerald-950/90 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 animate-bounce">
          <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
          <span>{downloadSuccessToast}</span>
        </div>
      )}

      {/* VIP Perks for Downloads */}
      {!isVip && (
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-[#1B1710] to-[#12121E] border border-[#FFD700]/30 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#FFD700]/20 flex items-center justify-center text-[#FFD700] shrink-0">
              <Crown size={16} />
            </div>
            <div className="text-xs">
              <p className="font-bold text-white">Unlock 1080p High-Speed Downloads</p>
              <p className="text-[10px] text-slate-400">
                VIP users get unlimited unthrottled downloads with WebVTT subtitles.
              </p>
            </div>
          </div>
          <button
            onClick={onOpenSubscription}
            className="px-3 py-1.5 rounded-xl bg-[#FFD700] hover:bg-[#ffe033] text-black font-extrabold text-xs shadow-md shrink-0"
          >
            GET VIP ₹10
          </button>
        </div>
      )}

      {/* Downloaded Episodes List */}
      <div className="space-y-2.5">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
          Saved on Device
        </h3>

        {downloads.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-[#12121E]/60 border border-white/5 space-y-2">
            <ArrowDownToLine size={28} className="mx-auto text-slate-500" />
            <p className="text-xs font-bold text-white">No downloaded anime yet.</p>
            <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
              Tap the download button below to save any anime for offline streaming on the go.
            </p>
          </div>
        ) : (
          downloads.map((item) => (
            <div
              key={item.id}
              className="p-3 rounded-2xl bg-[#12121E] border border-white/10 hover:border-white/20 transition flex items-center justify-between gap-3"
            >
              <div
                onClick={() => item.media && onSelectMedia(item.media)}
                className="flex items-center gap-3 cursor-pointer min-w-0 flex-1"
              >
                <div className="relative w-16 h-20 rounded-xl overflow-hidden shrink-0 bg-black">
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <Play size={14} className="text-white fill-white ml-0.5" />
                  </div>
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-white truncate">{item.title}</p>
                  <p className="text-[11px] text-[#00F0FF] font-mono mt-0.5">
                    EP {item.episodeNumber} • {item.duration}
                  </p>
                  <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-400">
                    <span className="px-1.5 py-0.2 rounded bg-white/5 border border-white/10 font-bold text-slate-300">
                      {item.quality}
                    </span>
                    <span>{Math.round(item.fileSizeBytes / (1024 * 1024))} MB</span>
                    <span>• {item.downloadedAt}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => item.media && onSelectMedia(item.media)}
                  className="w-8 h-8 rounded-xl bg-[#FF2A55]/20 hover:bg-[#FF2A55]/30 text-[#FF2A55] flex items-center justify-center transition"
                  title="Play Offline"
                >
                  <Play size={15} className="fill-[#FF2A55]" />
                </button>
                <button
                  onClick={() => handleDeleteDownload(item.id)}
                  className="w-8 h-8 rounded-xl bg-white/5 hover:bg-red-500/20 text-slate-400 hover:text-red-400 flex items-center justify-center transition"
                  title="Delete Download"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Quick Download Picker from Catalog */}
      <div className="pt-2 space-y-2">
        <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <Film size={13} className="text-[#FF2A55]" />
          <span>Save More from Catalog</span>
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {mediaList.slice(0, 4).map((media) => (
            <div
              key={media.id}
              className="p-2.5 rounded-xl bg-[#12121E]/60 border border-white/5 flex items-center justify-between gap-2"
            >
              <div className="flex items-center gap-2 truncate">
                <img
                  src={media.posterUrl}
                  alt={media.title}
                  className="w-8 h-10 object-cover rounded-lg shrink-0 bg-black"
                />
                <span className="text-xs text-white truncate font-medium">{media.title}</span>
              </div>
              <button
                onClick={() => handleDownloadNew(media)}
                className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-[#00F0FF] text-[11px] font-bold border border-[#00F0FF]/30 flex items-center gap-1 shrink-0"
              >
                <Download size={11} />
                <span>Save</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
