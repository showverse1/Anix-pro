import React from 'react';
import { Star, ShieldCheck, Play } from 'lucide-react';
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
  if (items.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400">
        <p className="text-sm font-semibold text-white">No streams found in catalog.</p>
        <p className="text-xs text-slate-500 mt-1">
          Open the /admin panel to inject new media streams into Firestore.
        </p>
      </div>
    );
  }

  return (
    <div
      className={`p-2.5 sm:p-3.5 grid ${
        isTabletView
          ? 'grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-3'
          : 'grid-cols-3 gap-2 sm:gap-2.5'
      }`}
    >
      {items.map((media) => {
        const isEmbed = ['ABYSS', 'MUX', 'DEMUX', 'ECDN'].includes(media.streamType);
        return (
          <div
            key={media.id}
            onClick={() => onSelectMedia(media)}
            className="group relative cursor-pointer select-none rounded-xl overflow-hidden bg-[#12121E] border border-white/10 hover:border-[#FF2A55] transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,42,85,0.3)] hover:-translate-y-0.5 flex flex-col aspect-[2/3]"
          >
            {/* Poster Image */}
            <div className="relative w-full h-full overflow-hidden">
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

              {/* Top-Left Resolution / Engine Badge */}
              <div className="absolute top-1.5 left-1.5 z-10">
                <span
                  className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded shadow-md backdrop-blur-md ${
                    isEmbed
                      ? 'bg-purple-900/80 text-purple-200 border border-purple-500/30'
                      : 'bg-black/80 text-[#00F0FF] border border-[#00F0FF]/30'
                  }`}
                >
                  {media.videoUrl1080p ? '1080P' : media.streamType}
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
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-black/80 text-[#FFD700] border border-[#FFD700]/30 shadow-md backdrop-blur-md">
                  SUB/DUB
                </span>
              </div>

              {/* Bottom Metadata Gradient Overlay */}
              <div className="absolute inset-x-0 bottom-0 pt-8 pb-2 px-2 bg-gradient-to-t from-[#09090D] via-[#09090D]/80 to-transparent flex flex-col justify-end">
                <h4 className="text-[11px] sm:text-xs font-bold text-white line-clamp-1 group-hover:text-[#FF2A55] transition">
                  {media.title}
                </h4>

                <div className="flex items-center justify-between text-[9px] sm:text-[10px] text-slate-400 mt-0.5">
                  <div className="flex items-center gap-1">
                    <span className="text-amber-400 flex items-center">
                      <Star size={9} className="fill-amber-400 inline mr-0.5" />
                      {media.rating.toFixed(1)}
                    </span>
                    <span>• {media.releaseYear}</span>
                  </div>

                  <span className="text-[8px] font-semibold text-[#FF2A55] bg-[#FF2A55]/10 px-1 rounded border border-[#FF2A55]/20">
                    {media.ageRating}
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
