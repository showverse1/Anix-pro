import React from 'react';
import { Play, Plus, Info, Sparkles, Flame, Clock } from 'lucide-react';
import { MediaItem } from '../../types';
import { MediaGrid } from '../MediaGrid';

interface HomeTabProps {
  mediaList: MediaItem[];
  isTabletView: boolean;
  onSelectMedia: (media: MediaItem) => void;
  isVip: boolean;
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  onOpenSubscription: () => void;
}

export const HomeTab: React.FC<HomeTabProps> = ({
  mediaList,
  isTabletView,
  onSelectMedia,
  isVip,
  selectedCategory,
  onSelectCategory,
  onOpenSubscription,
}) => {
  const categories = ['All', 'Cyberpunk', 'Shonen', 'Action', 'Sci-Fi', 'Dark Fantasy'];

  // Pick hero anime
  const heroAnime = mediaList[0] || null;

  // Filter items
  const filteredItems = React.useMemo(() => {
    if (selectedCategory === 'All') return mediaList;
    return mediaList.filter(
      (m) => m.category.toLowerCase() === selectedCategory.toLowerCase()
    );
  }, [mediaList, selectedCategory]);

  return (
    <div className="flex-1 flex flex-col overflow-y-auto pb-4 scrollbar-none">
      {/* Hero Featured Showcase */}
      {heroAnime && (
        <div className="relative w-full h-56 sm:h-72 select-none shrink-0 overflow-hidden group">
          {/* Background Banner */}
          <img
            src={heroAnime.bannerUrl || heroAnime.posterUrl}
            alt={heroAnime.title}
            className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-700"
          />

          {/* Gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#09090D] via-[#09090D]/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#09090D]/90 via-[#09090D]/40 to-transparent" />

          {/* Hero Content */}
          <div className="absolute inset-x-0 bottom-0 p-4 flex flex-col justify-end space-y-2">
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-[#FF2A55] bg-[#FF2A55]/20 px-2 py-0.5 rounded-full border border-[#FF2A55]/40 backdrop-blur-md">
                <Flame size={11} className="fill-[#FF2A55]" />
                #1 FEATURED STREAM
              </span>
              <span className="text-[10px] font-mono font-bold text-[#00F0FF] bg-black/60 px-1.5 py-0.5 rounded border border-[#00F0FF]/30">
                {heroAnime.streamType}
              </span>
              <span className="text-[10px] text-amber-300 font-bold">★ {heroAnime.rating}</span>
            </div>

            <h2 className="text-lg sm:text-2xl font-black text-white font-cyber tracking-wide line-clamp-1">
              {heroAnime.title}
            </h2>

            <p className="text-xs text-slate-300 line-clamp-2 max-w-lg hidden sm:block">
              {heroAnime.description}
            </p>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => onSelectMedia(heroAnime)}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#FF2A55] to-[#FF5E80] text-white font-bold text-xs shadow-lg shadow-[#FF2A55]/40 hover:brightness-110 active:scale-95 transition flex items-center gap-1.5"
              >
                <Play size={14} className="fill-white" />
                <span>Play Now</span>
              </button>

              <button
                onClick={() => onSelectMedia(heroAnime)}
                className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/15 backdrop-blur-md transition flex items-center gap-1.5"
              >
                <Info size={14} />
                <span>Details</span>
              </button>

              {!isVip && (
                <button
                  onClick={onOpenSubscription}
                  className="px-3 py-2 rounded-xl bg-[#FFD700]/20 hover:bg-[#FFD700]/30 text-[#FFD700] font-bold text-xs border border-[#FFD700]/50 backdrop-blur-md transition flex items-center gap-1 ml-auto"
                >
                  <Sparkles size={13} />
                  <span>VIP Pass ₹10</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Continue Watching Section */}
      <div className="px-3 pt-3">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <Clock size={13} className="text-[#00F0FF]" />
            <span>Continue Watching</span>
          </h3>
          <span className="text-[10px] text-slate-400">Recent Stream</span>
        </div>

        <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-none">
          {mediaList.slice(0, 3).map((item, idx) => (
            <div
              key={item.id}
              onClick={() => onSelectMedia(item)}
              className="relative w-40 sm:w-48 shrink-0 bg-[#12121E] rounded-xl overflow-hidden border border-white/10 hover:border-[#FF2A55] transition cursor-pointer group"
            >
              <div className="relative aspect-video w-full overflow-hidden">
                <img
                  src={item.bannerUrl || item.posterUrl}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                  <div className="w-7 h-7 rounded-full bg-[#FF2A55] flex items-center justify-center text-white">
                    <Play size={12} className="fill-white ml-0.5" />
                  </div>
                </div>
                {/* Progress bar */}
                <div className="absolute bottom-0 inset-x-0 h-1 bg-white/20">
                  <div
                    className="h-full bg-[#FF2A55]"
                    style={{ width: `${(idx + 1) * 30}%` }}
                  ></div>
                </div>
              </div>
              <div className="p-2">
                <p className="text-[11px] font-bold text-white truncate">{item.title}</p>
                <p className="text-[9px] text-slate-400 font-mono">
                  EP 1 • {18 - idx * 4}m left
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Categories Filter Pills */}
      <div className="px-3 pt-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => onSelectCategory(cat)}
                className={`text-xs px-3 py-1.5 rounded-xl shrink-0 font-medium transition ${
                  isSelected
                    ? 'bg-[#FF2A55] text-white shadow-[0_0_12px_rgba(255,42,85,0.4)] font-bold'
                    : 'bg-[#12121E] text-slate-400 border border-white/5 hover:text-white hover:border-white/20'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3-Column Dense Grid */}
      <div className="mt-1">
        <div className="px-3 pt-2 flex items-center justify-between">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">
            {selectedCategory === 'All' ? 'Trending Anime & Series' : `${selectedCategory} Streams`}
          </h3>
          <span className="text-[10px] text-slate-400">{filteredItems.length} titles</span>
        </div>

        <MediaGrid
          items={filteredItems}
          isTabletView={isTabletView}
          onSelectMedia={onSelectMedia}
          isVip={isVip}
        />
      </div>
    </div>
  );
};
