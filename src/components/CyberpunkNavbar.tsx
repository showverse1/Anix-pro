import React, { useState } from 'react';
import { Crown, Sparkles, Shield, Search } from 'lucide-react';

interface CyberpunkNavbarProps {
  isVip: boolean;
  onOpenSubscription: () => void;
  onOpenAdmin: () => void;
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const CyberpunkNavbar: React.FC<CyberpunkNavbarProps> = ({
  isVip,
  onOpenSubscription,
  onOpenAdmin,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
}) => {
  const [tapCount, setTapCount] = useState(0);
  const [tapTimer, setTapTimer] = useState<NodeJS.Timeout | null>(null);
  const [showAdminHint, setShowAdminHint] = useState(false);

  const categories = ['All', 'Cyberpunk', 'Shonen', 'Action', 'Sci-Fi', 'Dark Fantasy'];

  const handleLogoTap = () => {
    const nextCount = tapCount + 1;
    setTapCount(nextCount);

    if (tapTimer) clearTimeout(tapTimer);

    if (nextCount >= 5) {
      setTapCount(0);
      setShowAdminHint(true);
      setTimeout(() => setShowAdminHint(false), 3000);
      onOpenAdmin();
    } else {
      const timer = setTimeout(() => {
        setTapCount(0);
      }, 1500);
      setTapTimer(timer);
    }
  };

  return (
    <div className="w-full bg-[#09090D]/95 backdrop-blur-md border-b border-white/5 px-3 py-2.5 z-20 shrink-0 sticky top-0">
      {/* Top row */}
      <div className="flex items-center justify-between gap-2">
        {/* Secret tap on ANIX logo */}
        <div
          onClick={handleLogoTap}
          className="cursor-pointer select-none flex items-center gap-1 group active:scale-95 transition"
          title="Tap 5 times for Admin Dashboard"
        >
          <span className="font-cyber font-black tracking-wider text-xl text-[#FF2A55] group-hover:text-white transition">
            ANIX
          </span>
          <span className="text-[10px] font-mono font-bold text-[#00F0FF] bg-[#00F0FF]/10 px-1.5 py-0.5 rounded border border-[#00F0FF]/30">
            STREAM
          </span>
          {tapCount > 0 && tapCount < 5 && (
            <span className="text-[10px] text-amber-400 font-mono animate-bounce ml-1">
              {5 - tapCount} left
            </span>
          )}
        </div>

        {/* Right side: Search bar & VIP button */}
        <div className="flex items-center gap-2">
          {/* VIP Badge / Upgrade button */}
          {isVip ? (
            <button
              onClick={onOpenSubscription}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FFD700]/15 border border-[#FFD700]/60 text-[#FFD700] text-xs font-bold shadow-[0_0_15px_rgba(255,215,0,0.25)] hover:scale-105 transition"
            >
              <Crown size={13} className="text-[#FFD700] fill-[#FFD700]" />
              <span>VIP ACTIVE</span>
            </button>
          ) : (
            <button
              onClick={onOpenSubscription}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-[#FF2A55] to-[#FF4E72] text-white text-xs font-bold shadow-[0_0_15px_rgba(255,42,85,0.4)] hover:brightness-110 active:scale-95 transition"
            >
              <Sparkles size={12} />
              <span>GET VIP ₹10</span>
            </button>
          )}
        </div>
      </div>

      {/* Secret Toast if admin unlocked */}
      {showAdminHint && (
        <div className="mt-2 text-center text-xs py-1 px-2 rounded bg-[#00F0FF]/20 text-[#00F0FF] border border-[#00F0FF]/50 animate-pulse font-mono">
          🔓 Root Creator Mode Unlocked: Opening /admin...
        </div>
      )}

      {/* Search Input */}
      <div className="mt-2.5 relative">
        <Search size={14} className="absolute left-2.5 top-2.5 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search anime, cyberpunk series, direct & abyss streams..."
          className="w-full bg-[#12121E] text-xs text-white placeholder-slate-500 rounded-lg pl-8 pr-3 py-1.5 border border-white/10 focus:border-[#FF2A55] focus:outline-none transition"
        />
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 mt-2.5 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((category) => {
          const isSelected = selectedCategory === category;
          return (
            <button
              key={category}
              onClick={() => onSelectCategory(category)}
              className={`text-xs px-3 py-1 rounded-lg shrink-0 font-medium transition ${
                isSelected
                  ? 'bg-[#FF2A55] text-white shadow-[0_0_10px_rgba(255,42,85,0.4)] font-bold'
                  : 'bg-[#12121E] text-slate-400 border border-white/5 hover:text-white hover:border-white/20'
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>
    </div>
  );
};
