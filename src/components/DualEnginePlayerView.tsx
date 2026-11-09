import React, { useState, useRef, useEffect } from 'react';
import {
  ArrowLeft,
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Maximize,
  Minimize,
  Lock,
  Unlock,
  Subtitles,
  Gauge,
  Layers,
  Sparkles,
  ShieldCheck,
  ShieldAlert,
  Download,
  SkipForward,
  Check,
  Volume2,
  Tv
} from 'lucide-react';
import { EpisodeItem, MediaItem } from '../types';
import { BatchDownloadModal } from './BatchDownloadModal';

interface DualEnginePlayerViewProps {
  media: MediaItem;
  isVip: boolean;
  onBack: () => void;
  onOpenSubscription: () => void;
}

export const DualEnginePlayerView: React.FC<DualEnginePlayerViewProps> = ({
  media,
  isVip,
  onBack,
  onOpenSubscription,
}) => {
  const isNativeEngine = ['DIRECT', 'HLS', 'ARCHIVE'].includes(media.streamType);

  const videoRef = useRef<HTMLVideoElement>(null);
  const [activeEpisodeIndex, setActiveEpisodeIndex] = useState(0);
  const activeEpisode = media.episodes[activeEpisodeIndex] || {
    id: 'default',
    episodeNumber: 1,
    seasonNumber: 1,
    title: media.title,
    duration: media.duration,
    videoUrl: media.videoUrl,
    streamType: media.streamType,
    subtitles: media.subtitles,
  };

  // Player State
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [isLocked, setIsLocked] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [aspectRatio, setAspectRatio] = useState<'fit' | 'stretch' | 'crop'>('fit');
  const [selectedQuality, setSelectedQuality] = useState<'AUTO / ABYSS' | '480p SD' | '720p HD' | '1080p FHD'>('1080p FHD');
  const [selectedSubtitle, setSelectedSubtitle] = useState<string>('English');
  const [isPipActive, setIsPipActive] = useState(false);

  // Dialog states
  const [showQualityDialog, setShowQualityDialog] = useState(false);
  const [showSubtitlesDialog, setShowSubtitlesDialog] = useState(false);
  const [showBatchDownload, setShowBatchDownload] = useState(false);
  const [downloadNotice, setDownloadNotice] = useState<string | null>(null);

  // Sandboxed Anti-Ad State
  const [blockedCount, setBlockedCount] = useState(isVip ? 8 : 0);

  // Determine active video URL based on quality switch
  const activeStreamUrl = React.useMemo(() => {
    if (selectedQuality === '480p SD' && (activeEpisode.videoUrl480p || media.videoUrl480p)) {
      return activeEpisode.videoUrl480p || media.videoUrl480p || activeEpisode.videoUrl;
    }
    if (selectedQuality === '720p HD' && (activeEpisode.videoUrl720p || media.videoUrl720p)) {
      return activeEpisode.videoUrl720p || media.videoUrl720p || activeEpisode.videoUrl;
    }
    if (selectedQuality === '1080p FHD' && (activeEpisode.videoUrl1080p || media.videoUrl1080p)) {
      return activeEpisode.videoUrl1080p || media.videoUrl1080p || activeEpisode.videoUrl;
    }
    return activeEpisode.videoUrl || media.videoUrl;
  }, [selectedQuality, activeEpisode, media]);

  // Auto-hide controls
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (showControls && isPlaying && !isLocked) {
      timer = setTimeout(() => setShowControls(false), 3800);
    }
    return () => clearTimeout(timer);
  }, [showControls, isPlaying, isLocked]);

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      setDuration(videoRef.current.duration || 0);
    }
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  // Instant silent seek (no intrusive text overlay)
  const handleSeek = (delta: number) => {
    if (videoRef.current) {
      const target = Math.max(0, Math.min(duration || 0, videoRef.current.currentTime + delta));
      videoRef.current.currentTime = target;
      setCurrentTime(target);
    }
  };

  // Cycle speed
  const cycleSpeed = () => {
    const speeds = [1.0, 1.25, 1.5, 2.0];
    const next = speeds[(speeds.indexOf(playbackSpeed) + 1) % speeds.length];
    setPlaybackSpeed(next);
    if (videoRef.current) {
      videoRef.current.playbackRate = next;
    }
  };

  // Cycle aspect ratio
  const cycleAspectRatio = () => {
    const modes: ('fit' | 'stretch' | 'crop')[] = ['fit', 'stretch', 'crop'];
    const next = modes[(modes.indexOf(aspectRatio) + 1) % modes.length];
    setAspectRatio(next);
  };

  // Skip to next episode
  const handleSkipNextEpisode = () => {
    if (activeEpisodeIndex < media.episodes.length - 1) {
      setActiveEpisodeIndex(activeEpisodeIndex + 1);
    }
  };

  // Quality switch (gate VIP)
  const handleSelectQuality = (q: 'AUTO / ABYSS' | '480p SD' | '720p HD' | '1080p FHD') => {
    if ((q === '720p HD' || q === '1080p FHD') && !isVip) {
      setShowQualityDialog(false);
      onOpenSubscription();
      return;
    }
    const curPos = videoRef.current?.currentTime || 0;
    setSelectedQuality(q);
    setShowQualityDialog(false);
    setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.currentTime = curPos;
      }
    }, 50);
  };

  // Picture in Picture
  const handleTogglePip = async () => {
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
        setIsPipActive(false);
      } else if (videoRef.current && document.pictureInPictureEnabled) {
        await videoRef.current.requestPictureInPicture();
        setIsPipActive(true);
      }
    } catch (e) {
      console.log('PiP toggle error', e);
    }
  };

  const formatSeconds = (sec: number) => {
    if (isNaN(sec)) return '00:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex-1 flex flex-col bg-[#09090D] overflow-y-auto select-none scrollbar-none">
      {/* Top Video Stage Frame */}
      <div className="relative w-full aspect-video bg-black overflow-hidden group">
        {/* ========================================================= */}
        {/* Engine A: Media3 ExoPlayer Simulation                     */}
        {/* ========================================================= */}
        {isNativeEngine ? (
          <div className="relative w-full h-full flex items-center justify-center bg-black">
            <video
              ref={videoRef}
              src={activeStreamUrl}
              autoPlay
              playsInline
              className={`w-full h-full transition-all duration-300 ${
                aspectRatio === 'fit'
                  ? 'object-contain'
                  : aspectRatio === 'crop'
                  ? 'object-cover scale-110'
                  : 'object-fill'
              }`}
              onTimeUpdate={handleTimeUpdate}
              onEnded={handleSkipNextEpisode}
              onClick={() => {
                if (!isLocked) setShowControls((p) => !p);
              }}
            >
              {selectedSubtitle !== 'Off' && (
                <track
                  kind="subtitles"
                  src="https://raw.githubusercontent.com/bower-media-samples/big-buck-bunny-480p/master/subtitles.vtt"
                  srcLang="en"
                  label={selectedSubtitle}
                  default
                />
              )}
            </video>

            {/* Silent Instant Double Tap Zones */}
            {!isLocked && (
              <>
                <div
                  className="absolute left-0 top-0 bottom-14 w-1/3 z-10 cursor-pointer"
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    handleSeek(-10);
                  }}
                />
                <div
                  className="absolute right-0 top-0 bottom-14 w-1/3 z-10 cursor-pointer"
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    handleSeek(10);
                  }}
                />
              </>
            )}
          </div>
        ) : (
          /* ========================================================= */
          /* Engine B: Sandboxed In-App Fallback View (Abyss, Mux, ECDN)*/
          /* ========================================================= */
          <div className="relative w-full h-full bg-[#0E0E18] flex items-center justify-center overflow-hidden">
            <video
              ref={videoRef}
              src={activeStreamUrl}
              autoPlay
              playsInline
              loop
              className="w-full h-full object-contain"
              onTimeUpdate={handleTimeUpdate}
            />

            {/* In-App Anti-Ad Sandbox Shield Overlay */}
            <div className="absolute top-2.5 right-2.5 z-20">
              <span
                className={`text-[9px] font-bold px-2 py-1 rounded-md border flex items-center gap-1 backdrop-blur-md ${
                  isVip
                    ? 'bg-[#FFD700]/20 text-[#FFD700] border-[#FFD700]/50'
                    : 'bg-red-500/20 text-red-400 border-red-500/40'
                }`}
              >
                {isVip ? (
                  <>
                    <ShieldCheck size={12} className="text-[#FFD700]" />
                    <span>SANDBOX ACTIVE ({blockedCount} BLOCKED)</span>
                  </>
                ) : (
                  <>
                    <ShieldAlert size={12} className="text-red-400" />
                    <span>UNPROTECTED EMBED</span>
                  </>
                )}
              </span>
            </div>
          </div>
        )}

        {/* Lock Overlay if locked */}
        {isLocked && (
          <div className="absolute inset-0 z-30 flex items-start justify-end p-3 pointer-events-auto">
            <button
              onClick={() => setIsLocked(false)}
              className="w-9 h-9 rounded-full bg-black/70 border border-white/20 text-[#FF2A55] flex items-center justify-center shadow-lg"
              title="Unlock screen"
            >
              <Lock size={16} />
            </button>
          </div>
        )}

        {/* ========================================================= */}
        {/* ICON-ONLY MINIMALIST CONTROLS (NO TEXT CLUTTER)           */}
        {/* ========================================================= */}
        {!isLocked && (
          <div
            className={`absolute inset-0 z-20 bg-gradient-to-t from-black/90 via-transparent to-black/80 flex flex-col justify-between p-3 transition-opacity duration-300 ${
              showControls ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
            }`}
          >
            {/* Top Bar: Back, Title/Ep with Ellipsis, Circular Glass Buttons (36dp) */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <button
                  onClick={onBack}
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center backdrop-blur-md shrink-0 transition"
                >
                  <ArrowLeft size={16} />
                </button>
                <div className="truncate">
                  <h3 className="text-xs sm:text-sm font-bold text-white truncate">
                    {media.title}
                  </h3>
                  <p className="text-[10px] text-slate-300 font-mono truncate">
                    EP {activeEpisode.episodeNumber}: {activeEpisode.title}
                  </p>
                </div>
              </div>

              {/* 6 Circular Glass Buttons (36dp) */}
              <div className="flex items-center gap-1.5 shrink-0">
                {/* 1. Aspect Ratio */}
                <button
                  onClick={cycleAspectRatio}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center backdrop-blur-md transition"
                  title={`Aspect Ratio: ${aspectRatio}`}
                >
                  <Layers size={14} />
                </button>

                {/* 2. Subtitles (glows Gold when active) */}
                <button
                  onClick={() => setShowSubtitlesDialog(true)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition ${
                    selectedSubtitle !== 'Off'
                      ? 'bg-[#FFD700]/25 text-[#FFD700] border border-[#FFD700]/60 shadow-[0_0_10px_rgba(255,215,0,0.5)]'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                  title="Subtitles (CC)"
                >
                  <Subtitles size={14} />
                </button>

                {/* 3. Quality (glows Gold when on 720p/1080p VIP stream) */}
                <button
                  onClick={() => setShowQualityDialog(true)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition ${
                    selectedQuality === '1080p FHD' || selectedQuality === '720p HD'
                      ? 'bg-[#FFD700]/25 text-[#FFD700] border border-[#FFD700]/60 shadow-[0_0_10px_rgba(255,215,0,0.5)]'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                  title={`Quality: ${selectedQuality}`}
                >
                  <span className="text-[10px] font-mono font-black">
                    {selectedQuality.startsWith('1080') ? 'FHD' : selectedQuality.startsWith('720') ? 'HD' : 'SD'}
                  </span>
                </button>

                {/* 4. Speed (cycles 1.0x -> 1.25x -> 1.5x -> 2.0x) */}
                <button
                  onClick={cycleSpeed}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-[#00E5FF] flex items-center justify-center backdrop-blur-md text-[10px] font-mono font-bold transition"
                  title="Playback Speed"
                >
                  {playbackSpeed}x
                </button>

                {/* 5. PiP */}
                <button
                  onClick={handleTogglePip}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center backdrop-blur-md transition"
                  title="Picture-in-Picture"
                >
                  <Tv size={14} />
                </button>

                {/* 6. Lock screen */}
                <button
                  onClick={() => setIsLocked(true)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center backdrop-blur-md transition"
                  title="Lock Controls"
                >
                  <Unlock size={14} />
                </button>
              </div>
            </div>

            {/* Center Controls: Fast Rewind 10s, 72dp Crimson Circle Play/Pause, Fast Forward 10s */}
            <div className="flex items-center justify-center gap-7">
              <button
                onClick={() => handleSeek(-10)}
                className="w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center transition"
                title="Rewind 10s"
              >
                <RotateCcw size={22} />
              </button>

              {/* 72dp Crimson Circle */}
              <button
                onClick={togglePlay}
                className="w-16 h-16 sm:w-[72px] sm:h-[72px] rounded-full bg-[#FF2A55] text-white flex items-center justify-center shadow-[0_0_25px_rgba(255,42,85,0.6)] hover:scale-105 active:scale-95 transition"
              >
                {isPlaying ? (
                  <Pause size={28} />
                ) : (
                  <Play size={28} className="fill-white ml-1" />
                )}
              </button>

              <button
                onClick={() => handleSeek(10)}
                className="w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center transition"
                title="Forward 10s"
              >
                <RotateCw size={22} />
              </button>
            </div>

            {/* Bottom: Neon slim scrubber (3dp), time display, circular SkipNext */}
            <div className="space-y-1.5">
              {/* Neon Slim Scrubber (3dp) */}
              <div
                className="w-full h-[3px] bg-white/20 rounded-full cursor-pointer relative overflow-hidden group/bar"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const pos = (e.clientX - rect.left) / rect.width;
                  if (videoRef.current && duration > 0) {
                    videoRef.current.currentTime = pos * duration;
                  }
                }}
              >
                <div
                  className="h-full bg-gradient-to-r from-[#00E5FF] to-[#FF2A55]"
                  style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[10px] font-mono text-slate-300 pt-0.5">
                <span>
                  {formatSeconds(currentTime)} / {formatSeconds(duration)}
                </span>

                <div className="flex items-center gap-2">
                  <span className="text-[9px] text-[#00E5FF]">
                    {isNativeEngine ? 'Media3 Low-Latency Engine' : 'Sandboxed WebView'}
                  </span>

                  {/* Circular SkipNext Icon Button */}
                  <button
                    onClick={handleSkipNextEpisode}
                    disabled={activeEpisodeIndex >= media.episodes.length - 1}
                    className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-40 text-white flex items-center justify-center transition"
                    title="Skip to Next Episode"
                  >
                    <SkipForward size={13} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quality Selector Dialog */}
        {showQualityDialog && (
          <div className="absolute inset-0 z-40 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
            <div className="w-64 bg-[#12121E] rounded-2xl border border-white/10 p-3 space-y-2">
              <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
                <span className="text-xs font-bold text-white font-cyber">STREAM QUALITY</span>
                <button
                  onClick={() => setShowQualityDialog(false)}
                  className="text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              {(['AUTO / ABYSS', '480p SD', '720p HD', '1080p FHD'] as const).map((q) => {
                const isVipQuality = q === '720p HD' || q === '1080p FHD';
                const isSelected = selectedQuality === q;
                return (
                  <button
                    key={q}
                    onClick={() => handleSelectQuality(q)}
                    className={`w-full p-2 rounded-xl text-xs font-bold flex items-center justify-between transition ${
                      isSelected
                        ? 'bg-[#FF2A55] text-white'
                        : 'bg-white/5 text-slate-300 hover:bg-white/10'
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      {q}
                      {isVipQuality && (
                        <span className="text-[9px] font-bold px-1 rounded bg-[#FFD700]/20 text-[#FFD700]">
                          VIP
                        </span>
                      )}
                    </span>
                    {isSelected && <Check size={14} />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Subtitles Dialog */}
        {showSubtitlesDialog && (
          <div className="absolute inset-0 z-40 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
            <div className="w-64 bg-[#12121E] rounded-2xl border border-white/10 p-3 space-y-2">
              <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
                <span className="text-xs font-bold text-white font-cyber">CLOSED CAPTIONS (CC)</span>
                <button
                  onClick={() => setShowSubtitlesDialog(false)}
                  className="text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              {['Off', 'English', 'Hindi', 'Japanese'].map((lang) => {
                const isSelected = selectedSubtitle === lang;
                return (
                  <button
                    key={lang}
                    onClick={() => {
                      setSelectedSubtitle(lang);
                      setShowSubtitlesDialog(false);
                    }}
                    className={`w-full p-2 rounded-xl text-xs font-bold flex items-center justify-between transition ${
                      isSelected
                        ? 'bg-[#00E5FF] text-black'
                        : 'bg-white/5 text-slate-300 hover:bg-white/10'
                    }`}
                  >
                    <span>{lang}</span>
                    {isSelected && <Check size={14} />}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Media Details & Episodes Section */}
      <div className="p-4 space-y-4">
        {/* Title, Japanese altTitle in Gold, Audio Languages, and VIP Batch Download button */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-base sm:text-lg font-black text-white font-cyber tracking-wide">
              {media.title}
            </h1>
            {/* Japanese Title in Gold #FFD700 */}
            {media.altTitle && (
              <p className="text-xs font-bold text-[#FFD700] font-sans mt-0.5">
                {media.altTitle}
              </p>
            )}
            <p className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-1">
              <Volume2 size={12} className="text-[#00E5FF]" />
              <span>{media.audioLanguages}</span>
              <span>•</span>
              <span className="text-[#FF2A55] font-bold">{media.ageRating}</span>
              <span>•</span>
              <span className="text-amber-400 font-bold">★ {media.rating}</span>
            </p>
          </div>

          {/* VIP Batch Downloader trigger button */}
          <button
            onClick={() => setShowBatchDownload(true)}
            className="px-3 py-2 rounded-xl bg-[#00E5FF]/15 hover:bg-[#00E5FF]/25 border border-[#00E5FF]/40 text-[#00E5FF] font-bold text-xs flex items-center gap-1.5 shrink-0 shadow-sm transition"
          >
            <Download size={14} />
            <span>Download All</span>
          </button>
        </div>

        {downloadNotice && (
          <div className="p-2.5 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs">
            {downloadNotice}
          </div>
        )}

        {/* Synopsis */}
        <p className="text-xs text-slate-300 leading-relaxed bg-[#12121E]/60 p-3 rounded-2xl border border-white/5">
          {media.description}
        </p>

        {/* Episodes Selector List */}
        {media.episodes && media.episodes.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Season 1 Episodes ({media.episodes.length})
              </h3>
              <span className="text-[10px] text-[#00E5FF] font-mono">1080p Stream Unlocked</span>
            </div>

            <div className="space-y-2">
              {media.episodes.map((ep, idx) => {
                const isActive = activeEpisodeIndex === idx;
                return (
                  <div
                    key={ep.id}
                    onClick={() => setActiveEpisodeIndex(idx)}
                    className={`p-2.5 rounded-2xl border flex items-center justify-between cursor-pointer transition ${
                      isActive
                        ? 'bg-[#FF2A55]/15 border-[#FF2A55] text-white shadow-md'
                        : 'bg-[#12121E] border-white/5 text-slate-300 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-xl bg-black/60 flex items-center justify-center text-xs font-mono font-bold shrink-0">
                        {isActive ? (
                          <Play size={13} className="text-[#FF2A55] fill-[#FF2A55]" />
                        ) : (
                          ep.episodeNumber
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold truncate">{ep.title}</p>
                        <p className="text-[10px] text-slate-400 font-mono">
                          {ep.duration} • {ep.streamType}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-black/50 text-[#00E5FF] border border-[#00E5FF]/30">
                        1080p
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
        )}
      </div>

      {/* Batch Download Modal */}
      <BatchDownloadModal
        media={media}
        isOpen={showBatchDownload}
        onClose={() => setShowBatchDownload(false)}
        isVip={isVip}
        onRequireVip={onOpenSubscription}
        onDownloadStarted={(count) => {
          setDownloadNotice(`Started offline download of ${count} episode(s) to /ANIX folder.`);
          setTimeout(() => setDownloadNotice(null), 3500);
        }}
      />
    </div>
  );
};
