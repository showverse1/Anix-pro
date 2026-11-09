import React, { useState } from 'react';
import {
  X,
  Download,
  CheckCircle,
  Crown,
  HardDrive,
  Subtitles,
  CheckSquare,
  Square,
  Film
} from 'lucide-react';
import { DownloadedItem, EpisodeItem, MediaItem } from '../types';
import { storageService } from '../services/storageService';

interface BatchDownloadModalProps {
  media: MediaItem;
  isOpen: boolean;
  onClose: () => void;
  isVip: boolean;
  onRequireVip: () => void;
  onDownloadStarted: (count: number) => void;
}

export const BatchDownloadModal: React.FC<BatchDownloadModalProps> = ({
  media,
  isOpen,
  onClose,
  isVip,
  onRequireVip,
  onDownloadStarted,
}) => {
  const [selectedQuality, setSelectedQuality] = useState<'1080p FHD' | '720p HD' | '480p SD'>('1080p FHD');
  const [selectedEpisodeIds, setSelectedEpisodeIds] = useState<string[]>(
    media.episodes.length > 0 ? [media.episodes[0].id] : []
  );
  const [isDownloading, setIsDownloading] = useState(false);
  const [progress, setProgress] = useState(0);

  if (!isOpen) return null;

  // If not VIP, gate immediately
  if (!isVip) {
    return (
      <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
        <div className="relative w-full max-w-sm bg-[#0D0D16] rounded-3xl border border-[#FFD700]/40 p-5 shadow-2xl text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-[#FFD700]/20 border border-[#FFD700]/60 mx-auto flex items-center justify-center text-[#FFD700]">
            <Crown size={24} />
          </div>
          <h3 className="font-cyber font-bold text-white text-base">VIP Exclusive Feature</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Offline multi-episode downloading is strictly exclusive to VIP members! Upgrade for just ₹10 to unlock unthrottled offline playback.
          </p>
          <div className="pt-2 space-y-2">
            <button
              onClick={() => {
                onClose();
                onRequireVip();
              }}
              className="w-full py-2.5 rounded-xl bg-[#FFD700] hover:bg-[#ffe135] text-black font-extrabold text-xs shadow-md transition"
            >
              UNLOCK VIP PASS (FROM ₹10)
            </button>
            <button
              onClick={onClose}
              className="w-full py-1.5 text-xs text-slate-400 hover:text-white"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  const allSelected = selectedEpisodeIds.length === media.episodes.length;

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedEpisodeIds([]);
    } else {
      setSelectedEpisodeIds(media.episodes.map((e) => e.id));
    }
  };

  const toggleEpisode = (id: string) => {
    if (selectedEpisodeIds.includes(id)) {
      setSelectedEpisodeIds(selectedEpisodeIds.filter((eId) => eId !== id));
    } else {
      setSelectedEpisodeIds([...selectedEpisodeIds, id]);
    }
  };

  const estimatedTotalMb = selectedEpisodeIds.length * (selectedQuality === '1080p FHD' ? 480 : selectedQuality === '720p HD' ? 290 : 160);

  const handleStartBatchDownload = () => {
    if (selectedEpisodeIds.length === 0) return;

    setIsDownloading(true);
    setProgress(15);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          // Save downloaded items
          selectedEpisodeIds.forEach((epId) => {
            const ep = media.episodes.find((e) => e.id === epId);
            if (ep) {
              const dlItem: DownloadedItem = {
                id: `dl-${ep.id}-${Date.now()}`,
                mediaId: media.id,
                title: media.title,
                altTitle: media.altTitle,
                episodeId: ep.id,
                episodeNumber: ep.episodeNumber,
                seasonNumber: ep.seasonNumber,
                quality: selectedQuality,
                fileSizeBytes: (selectedQuality === '1080p FHD' ? 480 : selectedQuality === '720p HD' ? 290 : 160) * 1024 * 1024,
                thumbnail: media.posterUrl,
                downloadedAt: 'Just now',
                videoUrl: ep.videoUrl,
                media,
              };
              storageService.saveDownload(dlItem);
            }
          });

          setIsDownloading(false);
          onDownloadStarted(selectedEpisodeIds.length);
          onClose();
          return 100;
        }
        return prev + 25;
      });
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="relative w-full max-w-lg bg-[#0B0B13] rounded-3xl border border-[#00E5FF]/40 shadow-[0_0_50px_rgba(0,229,255,0.2)] overflow-hidden flex flex-col my-auto max-h-[92vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-[#12121E] via-[#101B24] to-[#12121E]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#00E5FF]/20 border border-[#00E5FF]/50 flex items-center justify-center text-[#00E5FF]">
              <Download size={16} />
            </div>
            <div>
              <h3 className="font-cyber font-bold text-white text-base tracking-wide flex items-center gap-2">
                VIP BATCH DOWNLOADER
                <span className="text-[9px] font-mono font-bold text-[#FFD700] bg-[#FFD700]/15 px-2 py-0.5 rounded border border-[#FFD700]/40">
                  VIP EXCLUSIVE
                </span>
              </h3>
              <p className="text-[10px] text-slate-400 font-mono truncate max-w-xs">{media.title}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 text-slate-400 hover:text-white flex items-center justify-center transition"
          >
            <X size={16} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          {/* Quality Selector */}
          <div>
            <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block mb-2">
              Select Download Bitrate
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['1080p FHD', '720p HD', '480p SD'] as const).map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => setSelectedQuality(q)}
                  className={`py-2 px-2.5 rounded-xl text-xs font-bold border transition ${
                    selectedQuality === q
                      ? 'bg-[#00E5FF]/20 text-[#00E5FF] border-[#00E5FF] shadow-[0_0_12px_rgba(0,229,255,0.3)]'
                      : 'bg-[#12121E] text-slate-400 border-white/5 hover:border-white/20'
                  }`}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Episode Checklist */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                Select Episodes ({selectedEpisodeIds.length} / {media.episodes.length})
              </span>
              <button
                type="button"
                onClick={toggleSelectAll}
                className="text-[11px] font-mono text-[#00E5FF] hover:underline flex items-center gap-1"
              >
                {allSelected ? 'Deselect All' : 'Select All'}
              </button>
            </div>

            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {media.episodes.map((ep) => {
                const isSelected = selectedEpisodeIds.includes(ep.id);
                return (
                  <div
                    key={ep.id}
                    onClick={() => toggleEpisode(ep.id)}
                    className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                      isSelected
                        ? 'bg-[#151528] border-[#FF2A55] text-white shadow-sm'
                        : 'bg-[#12121E] border-white/5 text-slate-400 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      {isSelected ? (
                        <CheckSquare size={16} className="text-[#FF2A55] shrink-0" />
                      ) : (
                        <Square size={16} className="text-slate-500 shrink-0" />
                      )}
                      <div className="min-w-0">
                        <p className="text-xs font-bold truncate text-white">
                          EP {ep.episodeNumber}: {ep.title}
                        </p>
                        <p className="text-[10px] text-slate-400 font-mono">
                          {ep.duration} • {ep.streamType}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-black/50 text-[#00E5FF] border border-[#00E5FF]/30">
                        {selectedQuality.split(' ')[0]}
                      </span>
                      <span className="text-[9px] font-bold px-1 rounded bg-[#FFD700]/10 text-[#FFD700] border border-[#FFD700]/30">
                        CC
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Storage Summary */}
          <div className="p-3 rounded-2xl bg-[#12121E] border border-white/5 flex items-center justify-between text-xs font-mono text-slate-300">
            <span className="flex items-center gap-1.5">
              <HardDrive size={13} className="text-[#00E5FF]" />
              Estimated Storage:
            </span>
            <span className="font-bold text-[#FFD700]">~{estimatedTotalMb} MB</span>
          </div>

          {/* Progress bar if active */}
          {isDownloading && (
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-300">
                <span>Downloading chunk stream...</span>
                <span className="text-[#00E5FF] font-bold">{progress}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#00E5FF] to-[#FF2A55] transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Action button */}
          <button
            type="button"
            disabled={isDownloading || selectedEpisodeIds.length === 0}
            onClick={handleStartBatchDownload}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-[#00E5FF] to-[#0099FF] text-black font-extrabold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(0,229,255,0.4)] hover:brightness-110 active:scale-98 transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Download size={15} />
            <span>
              {isDownloading
                ? `Saving Episodes (${progress}%)...`
                : `Download ${selectedEpisodeIds.length} Episode(s) to /ANIX`}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
