import React, { useState } from 'react';
import { Search, X, Filter, Sparkles, TrendingUp, ShieldCheck } from 'lucide-react';
import { MediaItem, StreamType } from '../../types';
import { MediaGrid } from '../MediaGrid';

interface SearchTabProps {
  mediaList: MediaItem[];
  isTabletView: boolean;
  onSelectMedia: (media: MediaItem) => void;
  isVip: boolean;
}

export const SearchTab: React.FC<SearchTabProps> = ({
  mediaList,
  isTabletView,
  onSelectMedia,
  isVip,
}) => {
  const [query, setQuery] = useState('');
  const [selectedEngine, setSelectedEngine] = useState<string>('All');
  const [selectedRating, setSelectedRating] = useState<string>('All');

  const popularTags = [
    'Cyberpunk 2099',
    'Abyss Protocol',
    'Solo Hunter',
    'Tears of Steel',
    'HLS Streams',
    'Dark Fantasy',
    'English Dub',
  ];

  const streamEngines = ['All', 'DIRECT', 'HLS', 'ABYSS', 'MUX', 'ECDN'];

  const filteredResults = React.useMemo(() => {
    return mediaList.filter((item) => {
      const q = query.trim().toLowerCase();
      const matchesQuery =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.altTitle.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q);

      const matchesEngine =
        selectedEngine === 'All' || item.streamType.toUpperCase() === selectedEngine.toUpperCase();

      return matchesQuery && matchesEngine;
    });
  }, [mediaList, query, selectedEngine]);

  return (
    <div className="flex-1 flex flex-col overflow-y-auto pb-4 p-3 space-y-3.5 scrollbar-none">
      {/* Search Header */}
      <div>
        <h2 className="font-cyber font-bold text-white text-base tracking-wide flex items-center gap-2">
          SEARCH &amp; EXPLORE
          <span className="text-[10px] font-mono text-[#00F0FF] bg-[#00F0FF]/10 px-2 py-0.5 rounded border border-[#00F0FF]/30">
            DUAL-ENGINE CATALOG
          </span>
        </h2>
        <p className="text-[11px] text-slate-400">
          Find anime by title, Japanese name, stream engine, or category.
        </p>
      </div>

      {/* Search Input Field */}
      <div className="relative">
        <Search size={16} className="absolute left-3 top-3 text-slate-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by title, anime genre, stream engine..."
          className="w-full bg-[#12121E] text-sm text-white placeholder-slate-500 rounded-2xl pl-10 pr-9 py-2.5 border border-white/10 focus:border-[#FF2A55] focus:outline-none transition shadow-inner"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-3 top-2.5 text-slate-400 hover:text-white"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Stream Engine Filter Pills */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <Filter size={11} /> Stream Engine Architecture
          </span>
          <span className="text-[10px] text-slate-500 font-mono">
            {selectedEngine === 'All' ? 'All Engines' : `${selectedEngine} Engine`}
          </span>
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {streamEngines.map((engine) => {
            const isSelected = selectedEngine === engine;
            return (
              <button
                key={engine}
                onClick={() => setSelectedEngine(engine)}
                className={`text-xs px-3 py-1 rounded-xl shrink-0 font-medium transition ${
                  isSelected
                    ? 'bg-[#00F0FF] text-black font-extrabold shadow-[0_0_12px_rgba(0,240,255,0.4)]'
                    : 'bg-[#12121E] text-slate-400 border border-white/5 hover:text-white'
                }`}
              >
                {engine}
              </button>
            );
          })}
        </div>
      </div>

      {/* Trending Search Tags (if no search query) */}
      {!query && (
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-white">
            <TrendingUp size={14} className="text-[#FF2A55]" />
            <span>Popular &amp; Trending Searches</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {popularTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setQuery(tag)}
                className="text-xs px-2.5 py-1 rounded-lg bg-[#181828] text-slate-300 border border-white/10 hover:border-[#FF2A55] hover:text-white transition"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Results Header */}
      <div className="pt-1 flex items-center justify-between">
        <span className="text-xs font-bold text-white uppercase tracking-wider">
          Results ({filteredResults.length})
        </span>
        {isVip && (
          <span className="text-[10px] text-[#FFD700] flex items-center gap-1 font-bold">
            <ShieldCheck size={11} /> VIP Anti-Ad Shield Active
          </span>
        )}
      </div>

      {/* Media Results Grid */}
      <MediaGrid
        items={filteredResults}
        isTabletView={isTabletView}
        onSelectMedia={onSelectMedia}
        isVip={isVip}
      />
    </div>
  );
};
