import React from 'react';
import { Star, ShieldCheck, Play, Volume2 } from 'lucide-react';
import { MediaItem } from '../types';

interface MediaGridProps {
  items: MediaItem[];
  isTabletView: boolean;
  onSelectMedia: (item: MediaItem) => void;
  isVip: boolean;
}

export const MediaGrid: React.FC<MediaGridProps> = ({
  items,
  isTabletView,
  onSelectMedia,
  isVip,
}) => {
  // Strictly display only PUBLISHED items
  const publishedItems = items.filter((m) => m.status === 'PUBLISHED');

  if (publishedItems.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400">
        <p className="text-sm font-semibold text-white">No published streams found in catalog.</p>
        <p className="text-xs text-slate-500 mt-1">
          Open the /admin panel to inject new published media streams into Firestore.
        </p>
      </div>
    );
  }

  return (
    <div
      className={`p-2 sm:p-3 grid ${
        isTabletView
          ? 'grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2.5'
          : 'grid-cols-3 gap-2 sm:gap-2.5'
      }`}
    >
      {publishedItems.map((media) => {
        const isEmbed = ['ABYSS', 'MUX', 'DEMUX', 'ECDN'].includes(media.streamType);
        const resolutionLabel = media.videoUrl1080p ? '1080p' : media.videoUrl720p ? '720p' : '480p';

        return (
          <div
            key={media.id}
            onClick={() => onSelectMedia(media)}
            className="group relative cursor-pointer select-none rounded-xl overflow-hidden bg-[#12121E] border border-white/10 hover:border-[#FF2A55] transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,42,85,0.3)] hover:-translate-y-0.5 flex flex-col"
          >
            {/* 2:3 Aspect Ratio Poster */}
            <div className="relative w-full aspect-[2/3] overflow-hidden bg-black">
              <img
                src={media.posterUrl}
                alt={media.title}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600';
                }}
              />

              {/* Play Hover Overlay */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="w-10 h-10 rounded-full bg-[#FF2A55] text-white flex items-center justify-center shadow-lg shadow-[#FF2A55]/50 scale-90 group-hover:scale-100 transition-transform">
                  <Play size={18} className="fill-white ml-0.5" />
                </div>
              </div>

              {/* Top-Left Resolution Badge */}
              <div className="absolute top-1.5 left-1.5 z-10">
                <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded shadow-md backdrop-blur-md bg-black/80 text-[#00E5FF] border border-[#00E5FF]/40">
                  {resolutionLabel}
                </span>
              </div>

              {/* Top-Right CC / DUB Badge */}
              <div className="absolute top-1.5 right-1.5 z-10 flex items-center gap-1">
                {isVip && isEmbed && (
                  <span
                    title="VIP Anti-Ad Sandbox Engine"
                    className="p-0.5 rounded bg-black/80 text-[#FFD700] border border-[#FFD700]/40"
                  >
                    <ShieldCheck size={11} />
                  </span>
                )}
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-black/80 text-[#FFD700] border border-[#FFD700]/40 shadow-md backdrop-blur-md">
                  CC SUB
                </span>
              </div>

              {/* Bottom Gradient Overlay on Poster */}
              <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-[#09090D] to-transparent pointer-events-none" />
            </div>

            {/* Under Poster: Title, Japanese altTitle in Gold, Audio Languages Indicator */}
            <div className="p-2 flex flex-col justify-between flex-1 bg-[#0D0D15]">
              <div>
                <h4 className="text-[11px] sm:text-xs font-bold text-white line-clamp-1 group-hover:text-[#FF2A55] transition">
                  {media.title}
                </h4>

                {/* Japanese altTitle rendered in Gold font #FFD700 */}
                {media.altTitle && (
                  <p className="text-[10px] text-[#FFD700] font-sans font-medium line-clamp-1 mt-0.5 tracking-tight">
                    {media.altTitle}
                  </p>
                )}
              </div>

              {/* Audio Languages Indicator */}
              <div className="mt-1 pt-1 border-t border-white/5 flex items-center justify-between text-[9px] text-slate-400">
                <span className="truncate flex items-center gap-1 text-slate-300">
                  <Volume2 size={10} className="text-[#00E5FF] shrink-0" />
                  <span className="truncate">{media.audioLanguages || 'Japanese'}</span>
                </span>
                <span className="text-amber-400 font-bold shrink-0 ml-1">
                  ★ {media.rating.toFixed(1)}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
