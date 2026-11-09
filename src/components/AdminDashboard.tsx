import React, { useState } from 'react';
import {
  X,
  Plus,
  Trash2,
  Save,
  Film,
  Layers,
  CheckCircle,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Shield,
  FileSpreadsheet
} from 'lucide-react';
import { MediaItem, StreamType, SubtitleTrack } from '../types';
import { storageService } from '../services/storageService';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  onRefreshCatalog: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  isOpen,
  onClose,
  onRefreshCatalog,
}) => {
  const [activeTab, setActiveTab] = useState<'inject' | 'manage' | 'subscriptions'>('inject');
  const [statusAlert, setStatusAlert] = useState<string | null>(null);

  // Form Fields
  const [title, setTitle] = useState('');
  const [altTitle, setAltTitle] = useState('');
  const [description, setDescription] = useState('');
  const [posterUrl, setPosterUrl] = useState('');
  const [category, setCategory] = useState('Cyberpunk');
  const [rating, setRating] = useState('9.5');
  const [releaseYear, setReleaseYear] = useState('2024');
  const [ageRating, setAgeRating] = useState('16+');
  const [streamType, setStreamType] = useState<StreamType>('HLS');
  const [videoUrl, setVideoUrl] = useState('');
  const [videoUrl1080p, setVideoUrl1080p] = useState('');
  const [videoUrl720p, setVideoUrl720p] = useState('');
  const [videoUrl480p, setVideoUrl480p] = useState('');
  const [subLanguage, setSubLanguage] = useState('English');
  const [subUrl, setSubUrl] = useState('');

  if (!isOpen) return null;

  const currentMediaList = storageService.getMediaItems();
  const currentSubs = storageService.getSubscriptions();

  const handleSaveMedia = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !videoUrl.trim()) {
      setStatusAlert('Please provide at least a Title and Stream URL.');
      return;
    }

    const subtitles: SubtitleTrack[] = subUrl.trim()
      ? [{ language: subLanguage, code: 'en', url: subUrl.trim(), isDefault: true }]
      : [];

    const newMedia: MediaItem = {
      id: `anix-media-${Date.now()}`,
      title: title.trim(),
      altTitle: altTitle.trim(),
      description: description.trim() || 'No description provided.',
      posterUrl:
        posterUrl.trim() ||
        'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800',
      bannerUrl:
        posterUrl.trim() ||
        'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1600',
      category,
      rating: parseFloat(rating) || 9.0,
      releaseYear: parseInt(releaseYear, 10) || 2024,
      ageRating,
      audioLanguages: ['Japanese', 'English Dub'],
      status: 'Ongoing',
      streamType,
      videoUrl: videoUrl.trim(),
      videoUrl1080p: videoUrl1080p.trim() || videoUrl.trim(),
      videoUrl720p: videoUrl720p.trim(),
      videoUrl480p: videoUrl480p.trim(),
      episodes: [
        {
          episodeNumber: 1,
          title: 'Episode 1: Pilot Premiere',
          duration: '24m',
          thumbnail: posterUrl.trim(),
          videoUrl: videoUrl.trim(),
          streamType,
        },
      ],
      subtitles,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    storageService.saveMediaItem(newMedia);
    onRefreshCatalog();
    setStatusAlert(`Successfully injected "${newMedia.title}" into Firestore collection /media.`);

    // Reset form
    setTitle('');
    setAltTitle('');
    setDescription('');
    setPosterUrl('');
    setVideoUrl('');
    setVideoUrl1080p('');
    setVideoUrl720p('');
    setVideoUrl480p('');
    setSubUrl('');
  };

  const handleDelete = (id: string, mediaTitle: string) => {
    if (confirm(`Delete "${mediaTitle}" from Firestore?`)) {
      storageService.deleteMediaItem(id);
      onRefreshCatalog();
      setStatusAlert(`Removed "${mediaTitle}" from database.`);
    }
  };

  const handleResetDefaults = () => {
    if (confirm('Reset to standard Cyberpunk anime catalog?')) {
      storageService.resetToDefaultCatalog();
      onRefreshCatalog();
      setStatusAlert('Catalog restored to default.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#0B0B12] rounded-3xl border border-[#FF2A55]/40 shadow-[0_0_50px_rgba(255,42,85,0.2)] overflow-hidden flex flex-col my-auto max-h-[92vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-[#12121E] to-[#1D121B]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#FF2A55]/20 border border-[#FF2A55]/50 flex items-center justify-center">
              <Shield size={16} className="text-[#FF2A55]" />
            </div>
            <div>
              <h2 className="font-cyber font-black text-white text-base tracking-wide flex items-center gap-2">
                ANIX CREATOR / ADMIN DASHBOARD
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#00F0FF]/15 text-[#00F0FF] border border-[#00F0FF]/30">
                  ROOT ACCESS
                </span>
              </h2>
              <p className="text-[10px] text-slate-400">
                Firestore Schema Controller & Dual-Engine Injector
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 text-slate-400 hover:text-white flex items-center justify-center transition"
          >
            <X size={16} />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-white/10 bg-[#0E0E18] px-4 pt-2 gap-2">
          <button
            onClick={() => setActiveTab('inject')}
            className={`px-3 py-2 text-xs font-bold rounded-t-xl transition flex items-center gap-1.5 ${
              activeTab === 'inject'
                ? 'bg-[#151525] text-white border-t-2 border-[#FF2A55]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Plus size={14} className="text-[#FF2A55]" />
            <span>+ Inject Media / Stream</span>
          </button>
          <button
            onClick={() => setActiveTab('manage')}
            className={`px-3 py-2 text-xs font-bold rounded-t-xl transition flex items-center gap-1.5 ${
              activeTab === 'manage'
                ? 'bg-[#151525] text-white border-t-2 border-[#00F0FF]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Film size={14} className="text-[#00F0FF]" />
            <span>Manage Catalog ({currentMediaList.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('subscriptions')}
            className={`px-3 py-2 text-xs font-bold rounded-t-xl transition flex items-center gap-1.5 ${
              activeTab === 'subscriptions'
                ? 'bg-[#151525] text-white border-t-2 border-[#FFD700]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileSpreadsheet size={14} className="text-[#FFD700]" />
            <span>UPI Subscriptions ({currentSubs.length})</span>
          </button>
        </div>

        {/* Status notification */}
        {statusAlert && (
          <div className="mx-4 mt-3 p-2.5 rounded-xl bg-[#00F0FF]/10 border border-[#00F0FF]/30 text-[#00F0FF] text-xs flex items-center justify-between">
            <span>{statusAlert}</span>
            <button
              onClick={() => setStatusAlert(null)}
              className="text-slate-400 hover:text-white text-xs"
            >
              ✕
            </button>
          </div>
        )}

        {/* Content Area */}
        <div className="p-5 overflow-y-auto space-y-4">
          {activeTab === 'inject' && (
            <form onSubmit={handleSaveMedia} className="space-y-4">
              {/* Basic metadata */}
              <div className="p-3.5 rounded-2xl bg-[#12121E] border border-white/10 space-y-3">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Film size={14} className="text-[#FF2A55]" />
                  <span>1. Metadata (/media collection)</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Anime / Series Title *</label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Neon Genesis: Overdrive"
                      className="w-full bg-[#09090D] text-xs text-white px-3 py-2 rounded-xl border border-white/10 focus:border-[#FF2A55] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Alt / Japanese Title</label>
                    <input
                      type="text"
                      value={altTitle}
                      onChange={(e) => setAltTitle(e.target.value)}
                      placeholder="e.g. 新世紀のオーバードライブ"
                      className="w-full bg-[#09090D] text-xs text-white px-3 py-2 rounded-xl border border-white/10 focus:border-[#FF2A55] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Poster Image URL (2:3 aspect ratio)</label>
                  <input
                    type="url"
                    value={posterUrl}
                    onChange={(e) => setPosterUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full bg-[#09090D] text-xs text-white px-3 py-2 rounded-xl border border-white/10 focus:border-[#FF2A55] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Synopsis / Description</label>
                  <textarea
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Brief anime storyline synopsis..."
                    className="w-full bg-[#09090D] text-xs text-white px-3 py-2 rounded-xl border border-white/10 focus:border-[#FF2A55] focus:outline-none resize-none"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full bg-[#09090D] text-xs text-white px-2.5 py-2 rounded-xl border border-white/10 focus:border-[#FF2A55] focus:outline-none"
                    >
                      <option value="Cyberpunk">Cyberpunk</option>
                      <option value="Shonen">Shonen</option>
                      <option value="Action">Action</option>
                      <option value="Sci-Fi">Sci-Fi</option>
                      <option value="Dark Fantasy">Dark Fantasy</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Rating</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="10"
                      value={rating}
                      onChange={(e) => setRating(e.target.value)}
                      className="w-full bg-[#09090D] text-xs text-white px-3 py-2 rounded-xl border border-white/10 focus:border-[#FF2A55] focus:outline-none font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Age Rating</label>
                    <select
                      value={ageRating}
                      onChange={(e) => setAgeRating(e.target.value)}
                      className="w-full bg-[#09090D] text-xs text-white px-2.5 py-2 rounded-xl border border-white/10 focus:border-[#FF2A55] focus:outline-none"
                    >
                      <option value="13+">13+</option>
                      <option value="16+">16+</option>
                      <option value="18+">18+</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Dual-Engine Stream Configuration */}
              <div className="p-3.5 rounded-2xl bg-[#12121E] border border-white/10 space-y-3">
                <h3 className="text-xs font-bold text-[#00F0FF] uppercase tracking-wider flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Layers size={14} className="text-[#00F0FF]" />
                    <span>2. Dual-Engine Stream Configuration</span>
                  </span>
                  <span className="text-[10px] text-slate-400 font-normal">
                    Media3 ExoPlayer vs Sandboxed WebView
                  </span>
                </h3>

                {/* Stream Type Pill Radio */}
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1.5">Stream Engine & Type *</label>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
                    {(['HLS', 'DIRECT', 'ABYSS', 'MUX', 'DEMUX', 'ECDN'] as StreamType[]).map(
                      (type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setStreamType(type)}
                          className={`py-1.5 rounded-lg text-xs font-bold transition ${
                            streamType === type
                              ? 'bg-[#FF2A55] text-white shadow-md'
                              : 'bg-black/40 text-slate-400 border border-white/5 hover:border-white/20'
                          }`}
                        >
                          {type}
                        </button>
                      )
                    )}
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">
                    {['DIRECT', 'HLS'].includes(streamType)
                      ? '🚀 Routes to Native Media3 ExoPlayer Engine with multi-track selector & WebVTT.'
                      : '🛡️ Routes to Sandboxed Anti-Ad Hybrid WebView with pop-under kill switches & VIP banner cleaner.'}
                  </p>
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">
                    Primary / Master Video URL (or Embed link) *
                  </label>
                  <input
                    type="url"
                    required
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    placeholder="https://...mp4, .m3u8 or third-party embed URL"
                    className="w-full bg-[#09090D] text-xs text-white px-3 py-2 rounded-xl border border-white/10 focus:border-[#00F0FF] focus:outline-none font-mono"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">1080p URL (Optional)</label>
                    <input
                      type="url"
                      value={videoUrl1080p}
                      onChange={(e) => setVideoUrl1080p(e.target.value)}
                      placeholder="1080p stream URL"
                      className="w-full bg-[#09090D] text-[11px] text-white px-2.5 py-1.5 rounded-lg border border-white/10 font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">720p URL (Optional)</label>
                    <input
                      type="url"
                      value={videoUrl720p}
                      onChange={(e) => setVideoUrl720p(e.target.value)}
                      placeholder="720p stream URL"
                      className="w-full bg-[#09090D] text-[11px] text-white px-2.5 py-1.5 rounded-lg border border-white/10 font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">480p URL (Optional)</label>
                    <input
                      type="url"
                      value={videoUrl480p}
                      onChange={(e) => setVideoUrl480p(e.target.value)}
                      placeholder="480p stream URL"
                      className="w-full bg-[#09090D] text-[11px] text-white px-2.5 py-1.5 rounded-lg border border-white/10 font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Subtitle Configuration */}
              <div className="p-3.5 rounded-2xl bg-[#12121E] border border-white/10 space-y-2">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  3. Subtitle Configuration (.vtt)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div>
                    <input
                      type="text"
                      value={subLanguage}
                      onChange={(e) => setSubLanguage(e.target.value)}
                      placeholder="Language (e.g. English)"
                      className="w-full bg-[#09090D] text-xs text-white px-3 py-1.5 rounded-lg border border-white/10"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <input
                      type="url"
                      value={subUrl}
                      onChange={(e) => setSubUrl(e.target.value)}
                      placeholder="WebVTT URL (https://.../subtitles.vtt)"
                      className="w-full bg-[#09090D] text-xs text-white px-3 py-1.5 rounded-lg border border-white/10 font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#FF2A55] to-[#FF5E80] text-white font-bold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(255,42,85,0.4)] hover:brightness-110 active:scale-98 transition flex items-center justify-center gap-2"
              >
                <Save size={16} />
                <span>Inject & Save to Firestore /media</span>
              </button>
            </form>
          )}

          {activeTab === 'manage' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-400">
                  Active Firestore items in <code className="text-[#00F0FF]">/media</code>
                </p>
                <button
                  onClick={handleResetDefaults}
                  className="text-xs px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 flex items-center gap-1"
                >
                  <RotateCcw size={12} />
                  <span>Restore Defaults</span>
                </button>
              </div>

              <div className="space-y-2">
                {currentMediaList.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-2xl bg-[#12121E] border border-white/10 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={item.posterUrl}
                        alt={item.title}
                        className="w-10 h-14 object-cover rounded-lg shrink-0 bg-black"
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-white truncate">{item.title}</p>
                        <p className="text-[10px] text-slate-400 font-mono">
                          {item.streamType} • {item.category} • {item.releaseYear}
                        </p>
                        <p className="text-[9px] text-[#00F0FF] truncate max-w-xs">{item.videoUrl}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(item.id, item.title)}
                      className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition"
                      title="Delete from Firestore"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'subscriptions' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-400">
                Verified zero-cost UPI transactions stored in{' '}
                <code className="text-[#FFD700]">/subscriptions/{`{txnId}`}</code>
              </p>

              <div className="space-y-2">
                {currentSubs.map((sub) => (
                  <div
                    key={sub.txnId}
                    className="p-3 rounded-2xl bg-[#12121E] border border-white/10 flex items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-[#FFD700]">UTR: {sub.transactionId}</span>
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                          {sub.status}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        User: {sub.userEmail} • Plan: ₹{sub.amount} ({sub.planDays} Days)
                      </p>
                      <p className="text-[9px] text-slate-500 font-mono">
                        Activated: {new Date(sub.activatedAt).toLocaleString()}
                      </p>
                    </div>
                    <span className="text-xs font-black text-white">₹{sub.amount}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
