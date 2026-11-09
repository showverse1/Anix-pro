import React, { useState, useRef, useEffect } from 'react';
import {
  ArrowLeft,
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Settings,
  ShieldAlert,
  ShieldCheck,
  Subtitles,
  Gauge,
  Layers,
  Sparkles,
  ExternalLink,
  Crown
} from 'lucide-react';
import { MediaItem } from '../types';

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
  const isNativeEngine = media.streamType === 'DIRECT' || media.streamType === 'HLS';

  // Player state
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [selectedQuality, setSelectedQuality] = useState<'1080p' | '720p' | '480p'>('1080p');
  const [playbackRate, setPlaybackRate] = useState<number>(1.0);
  const [aspectRatioMode, setAspectRatioMode] = useState<'fit' | 'fill' | 'stretch'>('fit');
  const [showControls, setShowControls] = useState(true);
  const [showSubtitles, setShowSubtitles] = useState(true);
  const [doubleTapFeedback, setDoubleTapFeedback] = useState<string | null>(null);

  // WebView Anti-Ad Sandbox State
  const [blockedAdsCount, setBlockedAdsCount] = useState(isVip ? 7 : 0);
  const [sandboxLog, setSandboxLog] = useState<string[]>([
    'AntiAdWebViewClient initialized',
    'settings.setSupportMultipleWindows(false) enforced',
    'Neutralized pop-under redirection listeners',
    'Injected CSS display: none !important rules for overlay ad banners',
  ]);
  const [showSandboxHud, setShowSandboxHud] = useState(false);

  // Active episode
  const [activeEpisodeIndex, setActiveEpisodeIndex] = useState(0);

  // Current active stream URL based on quality
  const streamUrl = React.useMemo(() => {
    if (selectedQuality === '480p' && media.videoUrl480p) return media.videoUrl480p;
    if (selectedQuality === '720p' && media.videoUrl720p) return media.videoUrl720p;
    if (selectedQuality === '1080p' && media.videoUrl1080p) return media.videoUrl1080p;
    return media.videoUrl;
  }, [selectedQuality, media]);

  // Handle controls auto-hide
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (showControls && isPlaying) {
      timeout = setTimeout(() => setShowControls(false), 4000);
    }
    return () => clearTimeout(timeout);
  }, [showControls, isPlaying]);

  // Video time update
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      setDuration(videoRef.current.duration || 0);
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  // Seek handler
  const handleSeek = (secondsDelta: number) => {
    if (videoRef.current) {
      const newTime = Math.max(0, Math.min(videoRef.current.duration || 0, videoRef.current.currentTime + secondsDelta));
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
      setDoubleTapFeedback(secondsDelta > 0 ? `+${secondsDelta}s ⏩` : `${secondsDelta}s ⏪`);
      setTimeout(() => setDoubleTapFeedback(null), 800);
    }
  };

  // Speed handler
  const cyclePlaybackSpeed = () => {
    const speeds = [1.0, 1.25, 1.5, 2.0, 0.5];
    const nextIdx = (speeds.indexOf(playbackRate) + 1) % speeds.length;
    const nextSpeed = speeds[nextIdx];
    setPlaybackRate(nextSpeed);
    if (videoRef.current) {
      videoRef.current.playbackRate = nextSpeed;
    }
  };

  // Aspect ratio switcher
  const cycleAspectRatio = () => {
    const modes: ('fit' | 'fill' | 'stretch')[] = ['fit', 'fill', 'stretch'];
    const nextIdx = (modes.indexOf(aspectRatioMode) + 1) % modes.length;
    setAspectRatioMode(modes[nextIdx]);
  };

  // Format seconds to mm:ss
  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '00:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Simulate an ad attack blocked by VIP sandbox
  const triggerSimulatedAdBlock = () => {
    setBlockedAdsCount((prev) => prev + 1);
    setSandboxLog((prev) => [
      `[BLOCKED] shouldOverrideUrlLoading intercepted: https://redirect-adnetwork-${Date.now().toString().slice(-4)}.biz/click`,
      ...prev.slice(0, 5),
    ]);
  };

  return (
    <div className="flex-1 flex flex-col bg-[#09090D] overflow-y-auto">
      {/* Top Video Stage */}
      <div className="relative w-full aspect-video bg-black overflow-hidden select-none group">
        {/* ==================================================== */}
        {/* ENGINE A: Native Media3 ExoPlayer Simulation         */}
        {/* ==================================================== */}
        {isNativeEngine ? (
          <div className="relative w-full h-full flex items-center justify-center bg-black">
            <video
              ref={videoRef}
              src={streamUrl}
              autoPlay
              playsInline
              className={`w-full h-full transition-all duration-200 ${
                aspectRatioMode === 'fit'
                  ? 'object-contain'
                  : aspectRatioMode === 'fill'
                  ? 'object-cover scale-110'
                  : 'object-fill'
              }`}
              onTimeUpdate={handleTimeUpdate}
              onEnded={() => setIsPlaying(false)}
              onClick={() => setShowControls((prev) => !prev)}
            >
              {media.subtitles && media.subtitles.length > 0 && showSubtitles && (
                <track
                  kind="subtitles"
                  src={media.subtitles[0].url || 'https://raw.githubusercontent.com/bower-media-samples/big-buck-bunny-480p/master/subtitles.vtt'}
                  srcLang="en"
                  label="English"
                  default
                />
              )}
            </video>

            {/* Left Double Tap Area (-10s) */}
            <div
              className="absolute left-0 top-0 bottom-16 w-1/3 z-10 cursor-pointer"
              onDoubleClick={(e) => {
                e.stopPropagation();
                handleSeek(-10);
              }}
            />

            {/* Right Double Tap Area (+10s) */}
            <div
              className="absolute right-0 top-0 bottom-16 w-1/3 z-10 cursor-pointer"
              onDoubleClick={(e) => {
                e.stopPropagation();
                handleSeek(10);
              }}
            />

            {/* Center Area (Toggle Controls) */}
            <div
              className="absolute left-1/3 right-1/3 top-0 bottom-16 z-10 cursor-pointer"
              onClick={() => setShowControls((prev) => !prev)}
            />
          </div>
        ) : (
          /* ==================================================== */
          /* ENGINE B: Sandboxed Anti-Ad Hybrid WebView Engine     */
          /* ==================================================== */
          <div className="relative w-full h-full bg-[#0d0d16] flex flex-col items-center justify-center overflow-hidden">
            {/* Embedded Stream Display */}
            <video
              ref={videoRef}
              src={streamUrl}
              autoPlay
              playsInline
              loop
              className="w-full h-full object-contain"
              onTimeUpdate={handleTimeUpdate}
            />

            {/* Ad Sandbox Shield Overlay Bar */}
            <div className="absolute top-2 right-2 z-20 flex items-center gap-2">
              <button
                onClick={() => setShowSandboxHud(!showSandboxHud)}
                className={`text-[10px] font-bold px-2 py-1 rounded-md border flex items-center gap-1 backdrop-blur-md transition ${
                  isVip
                    ? 'bg-[#FFD700]/20 text-[#FFD700] border-[#FFD700]/60 hover:bg-[#FFD700]/30'
                    : 'bg-red-500/20 text-red-400 border-red-500/50 hover:bg-red-500/30'
                }`}
              >
                {isVip ? (
                  <>
                    <ShieldCheck size={12} className="text-[#FFD700]" />
                    <span>ANTI-AD SANDBOX ON ({blockedAdsCount})</span>
                  </>
                ) : (
                  <>
                    <ShieldAlert size={12} className="text-red-400" />
                    <span>AD PROTECTION OFF</span>
                  </>
                )}
              </button>
            </div>

            {/* Non-VIP Banner Overlay Demo (Demonstrates what VIP neutralizes) */}
            {!isVip && (
              <div className="absolute bottom-16 inset-x-4 bg-gradient-to-r from-amber-900/90 to-red-950/90 border border-amber-500/40 rounded-xl p-3 backdrop-blur-md z-20 flex items-center justify-between shadow-2xl animate-pulse">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-300">
                    <Sparkles size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">Upgrade to VIP for Zero Ads</p>
                    <p className="text-[10px] text-amber-200/80">
                      Third-party embeds contain popups. Sandboxed anti-ad engine requires VIP.
                    </p>
                  </div>
                </div>
                <button
                  onClick={onOpenSubscription}
                  className="px-3 py-1.5 rounded-lg bg-[#FFD700] text-black font-extrabold text-xs shadow-md hover:brightness-110 shrink-0"
                >
                  GET VIP ₹10
                </button>
              </div>
            )}
          </div>
        )}

        {/* Double-Tap Seek Feedback Indicator */}
        {doubleTapFeedback && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
            <div className="px-5 py-2.5 rounded-2xl bg-black/80 border border-[#FF2A55]/60 text-[#FF2A55] font-cyber font-bold text-lg shadow-[0_0_30px_rgba(255,42,85,0.6)] animate-ping">
              {doubleTapFeedback}
            </div>
          </div>
        )}

        {/* Player Overlay Controls */}
        <div
          className={`absolute inset-0 z-20 bg-gradient-to-t from-black/90 via-transparent to-black/80 flex flex-col justify-between p-3 transition-opacity duration-300 ${
            showControls ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
        >
          {/* Top Control Bar */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <button
                onClick={onBack}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
              >
                <ArrowLeft size={16} />
              </button>
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-white line-clamp-1">
                  {media.title}
                </h3>
                <p className="text-[10px] text-slate-400 font-mono">
                  Engine:{' '}
                  <span className="text-[#00F0FF] font-bold">
                    {isNativeEngine ? 'Media3 ExoPlayer' : 'Sandboxed WebView'}
                  </span>{' '}
                  • Stream: {media.streamType}
                </p>
              </div>
            </div>

            {/* Top Right Badges */}
            <div className="flex items-center gap-1.5">
              {isVip && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#FFD700]/20 text-[#FFD700] border border-[#FFD700]/50 flex items-center gap-1">
                  <Crown size={11} />
                  VIP UNLOCKED
                </span>
              )}
            </div>
          </div>

          {/* Center Play/Pause & 10s Seek Overlay */}
          <div className="flex items-center justify-center gap-6">
            <button
              onClick={() => handleSeek(-10)}
              className="p-2 rounded-full bg-black/40 hover:bg-black/70 text-white hover:text-[#00F0FF] transition"
              title="Double tap left side or click for -10s"
            >
              <RotateCcw size={22} />
            </button>

            <button
              onClick={togglePlay}
              className="w-12 h-12 rounded-full bg-[#FF2A55] text-white flex items-center justify-center shadow-lg shadow-[#FF2A55]/40 hover:scale-105 active:scale-95 transition"
            >
              {isPlaying ? <Pause size={24} /> : <Play size={24} className="ml-1 fill-white" />}
            </button>

            <button
              onClick={() => handleSeek(10)}
              className="p-2 rounded-full bg-black/40 hover:bg-black/70 text-white hover:text-[#00F0FF] transition"
              title="Double tap right side or click for +10s"
            >
              <RotateCw size={22} />
            </button>
          </div>

          {/* Bottom Bar: Progress bar & Quality / Speed / Aspect Switchers */}
          <div className="space-y-2">
            {/* Progress Slider */}
            <div className="flex items-center gap-2 text-[10px] font-mono text-slate-300">
              <span>{formatTime(currentTime)}</span>
              <div
                className="flex-1 h-1.5 bg-white/20 rounded-full cursor-pointer relative overflow-hidden group/bar"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const pos = (e.clientX - rect.left) / rect.width;
                  if (videoRef.current && duration > 0) {
                    videoRef.current.currentTime = pos * duration;
                  }
                }}
              >
                <div
                  className="h-full bg-gradient-to-r from-[#FF2A55] to-[#FF4E72] relative"
                  style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
                >
                  <span className="absolute right-0 top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-white rounded-full shadow opacity-0 group-hover/bar:opacity-100"></span>
                </div>
              </div>
              <span>{formatTime(duration)}</span>
            </div>

            {/* Bottom Actions Row */}
            <div className="flex items-center justify-between flex-wrap gap-2 pt-1 text-xs">
              {/* Quality Switcher (1080p, 720p, 480p) */}
              <div className="flex items-center gap-1 bg-black/40 p-0.5 rounded-lg border border-white/10">
                {(['1080p', '720p', '480p'] as const).map((q) => (
                  <button
                    key={q}
                    onClick={() => setSelectedQuality(q)}
                    className={`px-1.5 py-0.5 rounded text-[10px] font-bold transition ${
                      selectedQuality === q
                        ? 'bg-[#FF2A55] text-white shadow'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {q}
                  </button>
                ))}
              </div>

              {/* Speed & Aspect Ratio & Subtitle Switchers */}
              <div className="flex items-center gap-1.5">
                {/* Speed */}
                <button
                  onClick={cyclePlaybackSpeed}
                  title="Playback Speed"
                  className="px-2 py-0.5 rounded bg-black/40 border border-white/10 text-[#00F0FF] text-[10px] font-mono font-bold hover:bg-white/10 transition flex items-center gap-1"
                >
                  <Gauge size={11} />
                  <span>{playbackRate}x</span>
                </button>

                {/* Aspect ratio */}
                <button
                  onClick={cycleAspectRatio}
                  title="Aspect Ratio (Fit, Fill, Stretch)"
                  className="px-2 py-0.5 rounded bg-black/40 border border-white/10 text-white text-[10px] hover:bg-white/10 transition capitalize flex items-center gap-1"
                >
                  <Layers size={11} />
                  <span>{aspectRatioMode}</span>
                </button>

                {/* Subtitles toggle */}
                <button
                  onClick={() => setShowSubtitles(!showSubtitles)}
                  title="Toggle Subtitles (.vtt)"
                  className={`p-1 rounded text-[10px] transition ${
                    showSubtitles
                      ? 'bg-[#FFD700]/20 text-[#FFD700] border border-[#FFD700]/40'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Subtitles size={13} />
                </button>

                {/* Test Ad Block Simulation */}
                {!isNativeEngine && (
                  <button
                    onClick={triggerSimulatedAdBlock}
                    className="px-2 py-0.5 rounded bg-[#00F0FF]/15 border border-[#00F0FF]/40 text-[#00F0FF] text-[10px] font-bold hover:bg-[#00F0FF]/25"
                    title="Simulate ad popup deflection"
                  >
                    Test Shield
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* VIP Anti-Ad Sandbox Inspector Drawer (If toggled) */}
      {showSandboxHud && (
        <div className="bg-[#12121E] border-b border-white/10 p-3 text-xs text-slate-300 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-[#FFD700] flex items-center gap-1.5 font-cyber">
              <ShieldCheck size={14} /> VIP Sandboxed Anti-Ad Engine Console
            </span>
            <span className="font-mono text-[10px] text-slate-400">
              Host: {new URL(media.videoUrl).hostname || 'stream.anix.cdn'}
            </span>
          </div>
          <div className="bg-black/60 rounded-lg p-2 font-mono text-[11px] text-emerald-400 space-y-1">
            {sandboxLog.map((log, idx) => (
              <div key={idx} className="line-clamp-1">
                ❯ {log}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Media Details & Episodes Section */}
      <div className="p-4 space-y-4">
        {/* Title, Year, Audio Badges */}
        <div>
          <div className="flex items-start justify-between gap-3">
            <div>
              <h1 className="text-base sm:text-lg font-black text-white font-cyber tracking-wide">
                {media.title}
              </h1>
              {media.altTitle && (
                <p className="text-xs text-slate-400 font-sans mt-0.5">{media.altTitle}</p>
              )}
            </div>
            <div className="text-right shrink-0">
              <span className="text-xs font-bold text-amber-400 font-mono">★ {media.rating.toFixed(1)}</span>
              <p className="text-[10px] text-slate-400">{media.releaseYear}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-2 flex-wrap text-[10px]">
            <span className="px-2 py-0.5 rounded bg-[#FF2A55]/15 text-[#FF2A55] border border-[#FF2A55]/30 font-bold">
              {media.category}
            </span>
            <span className="px-2 py-0.5 rounded bg-white/5 text-slate-300 border border-white/10">
              {media.ageRating}
            </span>
            <span className="px-2 py-0.5 rounded bg-cyan-950/60 text-[#00F0FF] border border-[#00F0FF]/30 font-mono">
              Engine: {media.streamType}
            </span>
            {media.audioLanguages.map((lang) => (
              <span key={lang} className="px-2 py-0.5 rounded bg-white/5 text-slate-400">
                {lang}
              </span>
            ))}
          </div>
        </div>

        {/* Synopsis */}
        <p className="text-xs text-slate-300 leading-relaxed bg-[#12121E]/60 p-3 rounded-xl border border-white/5">
          {media.description}
        </p>

        {/* Episodes List (if available) */}
        {media.episodes && media.episodes.length > 0 && (
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>Episodes ({media.episodes.length})</span>
              <span className="text-[10px] text-[#00F0FF]">Season 1</span>
            </h3>

            <div className="space-y-2">
              {media.episodes.map((ep, idx) => {
                const isActive = activeEpisodeIndex === idx;
                return (
                  <div
                    key={ep.episodeNumber}
                    onClick={() => setActiveEpisodeIndex(idx)}
                    className={`p-2 rounded-xl border flex items-center gap-3 cursor-pointer transition ${
                      isActive
                        ? 'bg-[#FF2A55]/10 border-[#FF2A55] text-white shadow-md'
                        : 'bg-[#12121E] border-white/5 text-slate-300 hover:border-white/20'
                    }`}
                  >
                    <div className="relative w-16 h-10 rounded-lg overflow-hidden shrink-0 bg-black">
                      <img
                        src={ep.thumbnail || media.posterUrl}
                        alt={ep.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <Play size={12} className={isActive ? 'text-[#FF2A55] fill-[#FF2A55]' : 'text-white'} />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold truncate">
                        EP {ep.episodeNumber}: {ep.title}
                      </p>
                      <p className="text-[10px] text-slate-400 font-mono">{ep.duration} • {ep.streamType}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
