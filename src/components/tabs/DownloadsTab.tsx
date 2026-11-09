import React, { useState, useEffect } from 'react';
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
import { DownloadedItem, MediaItem } from '../../types';
import { storageService } from '../../services/storageService';

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
  const [downloads, setDownloads] = useState<DownloadedItem[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const refreshDownloads = () => {
    setDownloads(storageService.getDownloads());
  };

  useEffect(() => {
    refreshDownloads();
    const handleDownloadsChanged = () => refreshDownloads();
    window.addEventListener('anix_downloads_changed', handleDownloadsChanged);
    return () => window.removeEventListener('anix_downloads_changed', handleDownloadsChanged);
  }, []);

  const totalUsedMb = Math.round(
    downloads.reduce((acc, curr) => acc + curr.fileSizeBytes, 0) / (1024 * 1024)
  );

  const handleDelete = (id: string, title: string) => {
    storageService.deleteDownload(id);
    setToastMessage(`Deleted "${title}" from offline storage.`);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleDownloadFromCatalog = (media: MediaItem) => {
    if (!isVip) {
      onOpenSubscription();
      return;
    }

    const firstEp = media.episodes[0];
    const newDl: DownloadedItem = {
      id: `dl-${media.id}-${Date.now()}`,
      mediaId: media.id,
      title: media.title,
      altTitle: media.altTitle,
      episodeId: firstEp?.id || 'ep-1',
      episodeNumber: firstEp?.episodeNumber || 1,
      seasonNumber: firstEp?.seasonNumber || 1,
      quality: '1080p FHD',
      fileSizeBytes: 480 * 1024 * 1024,
      thumbnail: media.posterUrl,
      downloadedAt: 'Just now',
      videoUrl: firstEp?.videoUrl || media.videoUrl,
      media,
    };

    storageService.saveDownload(newDl);
    setToastMessage(`Saved "${media.title}" to /ANIX offline storage!`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="flex-1 flex flex-col overflow-y-auto pb-4 p-3.5 space-y-4 scrollbar-none">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-cyber font-bold text-white text-base tracking-wide flex items-center gap-2">
            VIP DOWNLOAD MANAGER
            <span className="text-[10px] font-mono text-[#00E5FF] bg-[#00E5FF]/10 px-2 py-0.5 rounded border border-[#00E5FF]/30">
              OFFLINE STORAGE
            </span>
          </h2>
          <p className="text-[11px] text-slate-400">
            Stream high-bitrate anime without internet, buffering, or data usage.
          </p>
        </div>

        <div className="text-right">
          <span className="text-xs font-mono font-bold text-[#FFD700]">
            {downloads.length} Episode{downloads.length === 1 ? '' : 's'}
          </span>
        </div>
      </div>

      {/* Internal Device Storage Meter */}
      <div className="p-3.5 rounded-2xl bg-[#12121E] border border-white/10 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-300 font-bold flex items-center gap-1.5">
            <HardDrive size={14} className="text-[#00E5FF]" />
            <span>Internal Device Storage (/ANIX)</span>
          </span>
          <span className="font-mono text-slate-400 text-[11px]">
            {totalUsedMb} MB / 64 GB used
          </span>
        </div>
        <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#00E5FF] to-[#FF2A55]"
            style={{ width: `${Math.min(100, Math.max(8, (totalUsedMb / 1000) * 8))}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
          <span>ANIX Downloads: {totalUsedMb} MB</span>
          <span>Free Space: ~58.4 GB</span>
        </div>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="p-2.5 rounded-xl bg-emerald-950/90 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* VIP Gate Alert if Free User */}
      {!isVip && (
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-[#1E1810] to-[#12121E] border border-[#FFD700]/40 flex items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-[#FFD700]/20 flex items-center justify-center text-[#FFD700] shrink-0 border border-[#FFD700]/40">
              <Crown size={18} />
            </div>
            <div className="text-xs">
              <p className="font-bold text-white">VIP-Gated Offline Downloads</p>
              <p className="text-[10px] text-slate-400">
                Offline chunk download is exclusive to VIP members. Unlock from ₹10.
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
          Saved on Device ({downloads.length})
        </h3>

        {downloads.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-[#12121E]/60 border border-white/5 space-y-2">
            <ArrowDownToLine size={28} className="mx-auto text-slate-500" />
            <p className="text-xs font-bold text-white">No downloaded anime yet.</p>
            <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
              Select an anime from the catalog below to save episodes for offline streaming on the go.
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
                  {item.altTitle && (
                    <p className="text-[10px] text-[#FFD700] truncate font-medium">
                      {item.altTitle}
                    </p>
                  )}
                  <p className="text-[11px] text-[#00E5FF] font-mono mt-0.5">
                    EP {item.episodeNumber} • Season {item.seasonNumber}
                  </p>
                  <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-400">
                    <span className="px-1.5 py-0.2 rounded bg-white/5 border border-white/10 font-bold text-[#00E5FF]">
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
                  onClick={() => handleDelete(item.id, item.title)}
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
          <span>Save Episodes from Catalog</span>
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
                <div className="truncate">
                  <span className="text-xs text-white truncate font-medium block">
                    {media.title}
                  </span>
                  <span className="text-[10px] text-[#FFD700] truncate block">
                    {media.altTitle}
                  </span>
                </div>
              </div>
              <button
                onClick={() => handleDownloadFromCatalog(media)}
                className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-[#00E5FF] text-[11px] font-bold border border-[#00E5FF]/30 flex items-center gap-1 shrink-0"
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
