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
  FileSpreadsheet,
  Radio,
  Download
} from 'lucide-react';
import { AppUpdateInfo, MediaCategory, MediaItem, MediaStatus, StreamType, SubtitleTrack } from '../types';
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
  const [activeTab, setActiveTab] = useState<'inject' | 'manage' | 'subscriptions' | 'app_update'>('inject');
  const [statusAlert, setStatusAlert] = useState<string | null>(null);

  // Form Fields for Media
  const [title, setTitle] = useState('');
  const [altTitle, setAltTitle] = useState('');
  const [description, setDescription] = useState('');
  const [posterUrl, setPosterUrl] = useState('');
  const [bannerUrl, setBannerUrl] = useState('');
  const [category, setCategory] = useState<MediaCategory>('Anime');
  const [rating, setRating] = useState('9.4');
  const [releaseYear, setReleaseYear] = useState('2024');
  const [duration, setDuration] = useState('24m/ep');
  const [ageRating, setAgeRating] = useState<'13+' | '16+' | '18+'>('16+');
  const [audioLanguages, setAudioLanguages] = useState('Japanese, Hindi Sub');
  const [status, setStatus] = useState<MediaStatus>('PUBLISHED');

  // Stream URLs
  const [streamType, setStreamType] = useState<StreamType>('HLS');
  const [videoUrl, setVideoUrl] = useState('');
  const [videoUrl1080p, setVideoUrl1080p] = useState('');
  const [videoUrl720p, setVideoUrl720p] = useState('');
  const [videoUrl480p, setVideoUrl480p] = useState('');
  const [subLanguage, setSubLanguage] = useState('English');
  const [subUrl, setSubUrl] = useState('');

  // App Updates Form
  const currentUpdate = storageService.getAppUpdate();
  const [updateVersionCode, setUpdateVersionCode] = useState(currentUpdate.versionCode);
  const [updateVersionName, setUpdateVersionName] = useState(currentUpdate.versionName);
  const [updateTitle, setUpdateTitle] = useState(currentUpdate.title);
  const [updateChangelog, setUpdateChangelog] = useState(currentUpdate.changelog);
  const [updateDownloadUrl, setUpdateDownloadUrl] = useState(currentUpdate.downloadUrl);
  const [updateForceUpdate, setUpdateForceUpdate] = useState(currentUpdate.forceUpdate);
  const [updateBroadcastActive, setUpdateBroadcastActive] = useState(currentUpdate.broadcastActive);

  if (!isOpen) return null;

  const currentMediaList = storageService.getMediaItems(true); // include drafts to manage
  const currentSubs = storageService.getSubscriptions();

  const handleSaveMedia = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !videoUrl.trim()) {
      setStatusAlert('Please provide at least a Title and Stream URL.');
      return;
    }

    const subtitles: SubtitleTrack[] = subUrl.trim()
      ? [{ language: subLanguage, languageCode: 'en', url: subUrl.trim(), isDefault: true }]
      : [];

    const newMedia: MediaItem = {
      id: `anix-media-${Date.now()}`,
      title: title.trim(),
      altTitle: altTitle.trim() || title.trim(),
      description: description.trim() || 'No description provided.',
      posterUrl:
        posterUrl.trim() ||
        'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800',
      bannerUrl:
        bannerUrl.trim() ||
        posterUrl.trim() ||
        'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1600',
      category,
      rating: parseFloat(rating) || 9.0,
      releaseYear: releaseYear.trim() || '2024',
      duration: duration.trim() || '24m',
      ageRating,
      audioLanguages: audioLanguages.trim() || 'Japanese',
      status, // PUBLISHED or DRAFT
      streamType,
      videoUrl: videoUrl.trim(),
      videoUrl1080p: videoUrl1080p.trim() || videoUrl.trim(),
      videoUrl720p: videoUrl720p.trim(),
      videoUrl480p: videoUrl480p.trim(),
      episodes: [
        {
          id: `ep-${Date.now()}-1`,
          episodeNumber: 1,
          seasonNumber: 1,
          title: 'Episode 1: Pilot Premiere',
          duration: '24m',
          videoUrl: videoUrl.trim(),
          videoUrl1080p: videoUrl1080p.trim() || videoUrl.trim(),
          videoUrl720p: videoUrl720p.trim(),
          videoUrl480p: videoUrl480p.trim(),
          streamType,
          subtitles,
        },
      ],
      subtitles,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    storageService.saveMediaItem(newMedia);
    onRefreshCatalog();
    setStatusAlert(`Successfully saved "${newMedia.title}" (${status}) to /media collection.`);

    // Reset form
    setTitle('');
    setAltTitle('');
    setDescription('');
    setPosterUrl('');
    setVideoUrl('');
    setVideoUrl1080p('');
    setVideoUrl720p('');
    setVideoUrl480p('');
  };

  const handleSaveAppUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    const updatePayload: AppUpdateInfo = {
      versionCode: Number(updateVersionCode),
      versionName: updateVersionName,
      title: updateTitle,
      changelog: updateChangelog,
      downloadUrl: updateDownloadUrl,
      forceUpdate: updateForceUpdate,
      broadcastActive: updateBroadcastActive,
    };
    storageService.saveAppUpdate(updatePayload);
    setStatusAlert(`Remote update broadcast saved! Target version code: ${updateVersionCode}.`);
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
      setStatusAlert('Catalog and update settings restored to default.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#0B0B12] rounded-3xl border border-[#FF2A55]/40 shadow-[0_0_60px_rgba(255,42,85,0.25)] overflow-hidden flex flex-col my-auto max-h-[92vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-[#12121E] to-[#1D121B]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#FF2A55]/20 border border-[#FF2A55]/50 flex items-center justify-center">
              <Shield size={16} className="text-[#FF2A55]" />
            </div>
            <div>
              <h2 className="font-cyber font-black text-white text-base tracking-wide flex items-center gap-2">
                ANIX CREATOR / ADMIN DASHBOARD
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#00E5FF]/15 text-[#00E5FF] border border-[#00E5FF]/30">
                  ROOT ADMIN
                </span>
              </h2>
              <p className="text-[10px] text-slate-400">
                Firestore Schema Controller, Multi-Stream Injector &amp; Remote Updates
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
        <div className="flex border-b border-white/10 bg-[#0E0E18] px-4 pt-2 gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('inject')}
            className={`px-3 py-2 text-xs font-bold rounded-t-xl shrink-0 transition flex items-center gap-1.5 ${
              activeTab === 'inject'
                ? 'bg-[#151525] text-white border-t-2 border-[#FF2A55]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Plus size={14} className="text-[#FF2A55]" />
            <span>+ Inject Media</span>
          </button>
          <button
            onClick={() => setActiveTab('manage')}
            className={`px-3 py-2 text-xs font-bold rounded-t-xl shrink-0 transition flex items-center gap-1.5 ${
              activeTab === 'manage'
                ? 'bg-[#151525] text-white border-t-2 border-[#00E5FF]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Film size={14} className="text-[#00E5FF]" />
            <span>Catalog ({currentMediaList.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('subscriptions')}
            className={`px-3 py-2 text-xs font-bold rounded-t-xl shrink-0 transition flex items-center gap-1.5 ${
              activeTab === 'subscriptions'
                ? 'bg-[#151525] text-white border-t-2 border-[#FFD700]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileSpreadsheet size={14} className="text-[#FFD700]" />
            <span>UPI Subscriptions ({currentSubs.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('app_update')}
            className={`px-3 py-2 text-xs font-bold rounded-t-xl shrink-0 transition flex items-center gap-1.5 ${
              activeTab === 'app_update'
                ? 'bg-[#151525] text-white border-t-2 border-[#00E5FF]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Download size={14} className="text-[#00E5FF]" />
            <span>Remote OTA Update</span>
          </button>
        </div>

        {/* Status notification */}
        {statusAlert && (
          <div className="mx-4 mt-3 p-2.5 rounded-xl bg-[#00E5FF]/10 border border-[#00E5FF]/30 text-[#00E5FF] text-xs flex items-center justify-between">
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
            <form onSubmit={handleSaveMedia} className="space-y-4 text-xs">
              {/* Basic metadata */}
              <div className="p-3.5 rounded-2xl bg-[#12121E] border border-white/10 space-y-3">
                <h3 className="font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Film size={14} className="text-[#FF2A55]" />
                  <span>1. Media Metadata (/media collection)</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Title *</label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Cyberpunk: Neon Genesis 2099"
                      className="w-full bg-[#09090D] text-xs text-white px-3 py-2 rounded-xl border border-white/10 focus:border-[#FF2A55] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-[#FFD700] block mb-1 font-bold">
                      Original Japanese Title (altTitle) *
                    </label>
                    <input
                      type="text"
                      value={altTitle}
                      onChange={(e) => setAltTitle(e.target.value)}
                      placeholder="e.g. 新世紀サイバーパンク：2099 (Rendered in Gold #FFD700)"
                      className="w-full bg-[#09090D] text-xs text-[#FFD700] px-3 py-2 rounded-xl border border-white/10 focus:border-[#FFD700] focus:outline-none font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Poster URL (2:3 Aspect)</label>
                    <input
                      type="url"
                      value={posterUrl}
                      onChange={(e) => setPosterUrl(e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full bg-[#09090D] text-xs text-white px-3 py-2 rounded-xl border border-white/10 focus:border-[#FF2A55] focus:outline-none font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Audio Languages</label>
                    <input
                      type="text"
                      value={audioLanguages}
                      onChange={(e) => setAudioLanguages(e.target.value)}
                      placeholder="e.g. Japanese, Hindi Sub, English Dub"
                      className="w-full bg-[#09090D] text-xs text-white px-3 py-2 rounded-xl border border-white/10 focus:border-[#FF2A55] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Synopsis</label>
                  <textarea
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Anime storyline synopsis..."
                    className="w-full bg-[#09090D] text-xs text-white px-3 py-2 rounded-xl border border-white/10 focus:border-[#FF2A55] focus:outline-none resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as MediaCategory)}
                      className="w-full bg-[#09090D] text-xs text-white px-2 py-1.5 rounded-xl border border-white/10"
                    >
                      <option value="Anime">Anime</option>
                      <option value="Series">Series</option>
                      <option value="Drama">Drama</option>
                      <option value="Movies">Movies</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Status</label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as MediaStatus)}
                      className="w-full bg-[#09090D] text-xs text-white px-2 py-1.5 rounded-xl border border-white/10 font-bold"
                    >
                      <option value="PUBLISHED">PUBLISHED (Visible)</option>
                      <option value="DRAFT">DRAFT (Hidden)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Rating</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="10"
                      value={rating}
                      onChange={(e) => setRating(e.target.value)}
                      className="w-full bg-[#09090D] text-xs text-white px-2 py-1.5 rounded-xl border border-white/10 font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Age Rating</label>
                    <select
                      value={ageRating}
                      onChange={(e) => setAgeRating(e.target.value as '13+' | '16+' | '18+')}
                      className="w-full bg-[#09090D] text-xs text-white px-2 py-1.5 rounded-xl border border-white/10"
                    >
                      <option value="13+">13+</option>
                      <option value="16+">16+</option>
                      <option value="18+">18+</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Multi-Stream Engine Config */}
              <div className="p-3.5 rounded-2xl bg-[#12121E] border border-white/10 space-y-3">
                <h3 className="font-bold text-[#00E5FF] uppercase tracking-wider flex items-center justify-between">
                  <span>2. Universal Multi-Stream Engine</span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    Direct MP4 / Archive / HLS / Abyss
                  </span>
                </h3>

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1.5">Stream Engine *</label>
                  <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5">
                    {(['HLS', 'DIRECT', 'ARCHIVE', 'ABYSS', 'MUX', 'DEMUX', 'ECDN'] as StreamType[]).map(
                      (type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setStreamType(type)}
                          className={`py-1 rounded-lg text-[10px] font-bold transition ${
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
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">
                    Master / Default Video URL *
                  </label>
                  <input
                    type="url"
                    required
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    placeholder="https://...mp4, .m3u8 or Abyss/ECDN embed"
                    className="w-full bg-[#09090D] text-xs text-white px-3 py-2 rounded-xl border border-white/10 focus:border-[#00E5FF] focus:outline-none font-mono"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">1080p FHD (VIP)</label>
                    <input
                      type="url"
                      value={videoUrl1080p}
                      onChange={(e) => setVideoUrl1080p(e.target.value)}
                      placeholder="1080p stream URL"
                      className="w-full bg-[#09090D] text-[11px] text-white px-2 py-1.5 rounded-lg border border-white/10 font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">720p HD (VIP)</label>
                    <input
                      type="url"
                      value={videoUrl720p}
                      onChange={(e) => setVideoUrl720p(e.target.value)}
                      placeholder="720p stream URL"
                      className="w-full bg-[#09090D] text-[11px] text-white px-2 py-1.5 rounded-lg border border-white/10 font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">480p SD (Free)</label>
                    <input
                      type="url"
                      value={videoUrl480p}
                      onChange={(e) => setVideoUrl480p(e.target.value)}
                      placeholder="480p stream URL"
                      className="w-full bg-[#09090D] text-[11px] text-white px-2 py-1.5 rounded-lg border border-white/10 font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#FF2A55] to-[#FF5E80] text-white font-extrabold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(255,42,85,0.4)] hover:brightness-110 active:scale-98 transition flex items-center justify-center gap-2"
              >
                <Save size={16} />
                <span>Save to Firestore /media ({status})</span>
              </button>
            </form>
          )}

          {activeTab === 'manage' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-400">
                  Total items in <code className="text-[#00E5FF]">/media</code>: {currentMediaList.length}
                </p>
                <button
                  onClick={handleResetDefaults}
                  className="text-xs px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 flex items-center gap-1"
                >
                  <RotateCcw size={12} />
                  <span>Reset Defaults</span>
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
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-bold text-white truncate">{item.title}</p>
                          <span
                            className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                              item.status === 'PUBLISHED'
                                ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                                : 'bg-amber-950 text-amber-400 border border-amber-500/30'
                            }`}
                          >
                            {item.status}
                          </span>
                        </div>
                        <p className="text-[10px] text-[#FFD700] truncate font-medium">{item.altTitle}</p>
                        <p className="text-[10px] text-slate-400 font-mono">
                          {item.streamType} • {item.category} • {item.episodes.length} Episodes
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(item.id, item.title)}
                      className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition shrink-0"
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
                        Gateway: {sub.paymentGateway}
                      </p>
                    </div>
                    <span className="text-xs font-black text-white">₹{sub.amount}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'app_update' && (
            <form onSubmit={handleSaveAppUpdate} className="space-y-3.5 text-xs">
              <div className="p-3.5 rounded-2xl bg-[#12121E] border border-white/10 space-y-3">
                <h3 className="font-bold text-[#00E5FF] uppercase tracking-wider flex items-center gap-2">
                  <Download size={15} />
                  <span>Remote OTA Update Controller (/app_updates/latest)</span>
                </h3>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  When broadcast is enabled and target versionCode &gt; device build, the application immediately prompts users with the Cyberpunk update dialog.
                </p>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Target Version Code *</label>
                    <input
                      type="number"
                      required
                      value={updateVersionCode}
                      onChange={(e) => setUpdateVersionCode(Number(e.target.value))}
                      className="w-full bg-[#09090D] text-xs text-white px-3 py-2 rounded-xl border border-white/10 font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Version Name *</label>
                    <input
                      type="text"
                      required
                      value={updateVersionName}
                      onChange={(e) => setUpdateVersionName(e.target.value)}
                      placeholder="e.g. v2.4.0-Cyberpunk"
                      className="w-full bg-[#09090D] text-xs text-white px-3 py-2 rounded-xl border border-white/10 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Dialog Title</label>
                  <input
                    type="text"
                    value={updateTitle}
                    onChange={(e) => setUpdateTitle(e.target.value)}
                    className="w-full bg-[#09090D] text-xs text-white px-3 py-2 rounded-xl border border-white/10"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Changelog (Bullet lines)</label>
                  <textarea
                    rows={4}
                    value={updateChangelog}
                    onChange={(e) => setUpdateChangelog(e.target.value)}
                    className="w-full bg-[#09090D] text-xs text-white px-3 py-2 rounded-xl border border-white/10 font-sans"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Direct APK Download URL</label>
                  <input
                    type="url"
                    value={updateDownloadUrl}
                    onChange={(e) => setUpdateDownloadUrl(e.target.value)}
                    className="w-full bg-[#09090D] text-xs text-white px-3 py-2 rounded-xl border border-white/10 font-mono"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1 border-t border-white/5">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={updateForceUpdate}
                      onChange={(e) => setUpdateForceUpdate(e.target.checked)}
                      className="rounded accent-[#FF2A55]"
                    />
                    <span className="text-[11px] text-slate-300">Force Mandatory Update (Trap Back)</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={updateBroadcastActive}
                      onChange={(e) => setUpdateBroadcastActive(e.target.checked)}
                      className="rounded accent-[#00E5FF]"
                    />
                    <span className="text-[11px] text-slate-300">Broadcast Update Active</span>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#00E5FF] to-[#0099FF] text-black font-extrabold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(0,229,255,0.4)] hover:brightness-110 active:scale-98 transition flex items-center justify-center gap-2"
              >
                <Save size={15} />
                <span>Save Remote Update Configuration</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
