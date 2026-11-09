import { AppUpdateInfo, MediaItem } from '../types';

export const DEFAULT_APP_UPDATE: AppUpdateInfo = {
  versionCode: 102,
  versionName: 'v2.4.0-Cyberpunk',
  title: 'ANIX Hyper-Update Available ⚡',
  changelog: `• Added Universal Archive.org & ECDN low-latency engine\n• 144Hz Peak Display Refresh Rate optimization\n• VIP Multi-Episode Batch Downloader with chunk streaming\n• Dynamic In-App UPI QR Code generator\n• Enhanced ad-stripping sandbox for Abyss & Mux embeds`,
  downloadUrl: 'https://github.com/aistudio/anix-streaming/releases/latest',
  forceUpdate: false,
  broadcastActive: true,
};

export const INITIAL_MEDIA_ITEMS: MediaItem[] = [
  {
    id: 'anix-001',
    title: 'Cyberpunk: Neon Genesis 2099',
    altTitle: '新世紀サイバーパンク：2099',
    description:
      'In a dystopian mega-city bathed in holographic rain and chrome, an outlaw neural runner uncovers a rogue military AI threatening the city-wide bio-grid.',
    posterUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1600&auto=format&fit=crop&q=80',
    category: 'Anime',
    rating: 9.6,
    releaseYear: '2024',
    duration: '24m/ep',
    ageRating: '18+',
    audioLanguages: 'Japanese, Hindi Sub, English Dub',
    status: 'PUBLISHED',
    streamType: 'HLS',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    videoUrl1080p: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    videoUrl720p: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
    videoUrl480p: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    episodes: [
      {
        id: 'ep-001-1',
        episodeNumber: 1,
        seasonNumber: 1,
        title: 'Awakening of the Chromed Ghost',
        duration: '24m',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
        videoUrl1080p: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
        videoUrl720p: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
        videoUrl480p: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        streamType: 'HLS',
        subtitles: [
          { language: 'English', languageCode: 'en', url: 'https://raw.githubusercontent.com/bower-media-samples/big-buck-bunny-480p/master/subtitles.vtt', isDefault: true },
          { language: 'Hindi', languageCode: 'hi', url: '' },
          { language: 'Japanese', languageCode: 'ja', url: '' }
        ]
      },
      {
        id: 'ep-001-2',
        episodeNumber: 2,
        seasonNumber: 1,
        title: 'Neural Overdrive Protocol',
        duration: '23m',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
        videoUrl1080p: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
        videoUrl720p: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
        videoUrl480p: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
        streamType: 'HLS',
        subtitles: [
          { language: 'English', languageCode: 'en', url: '', isDefault: true },
          { language: 'Hindi', languageCode: 'hi', url: '' }
        ]
      },
      {
        id: 'ep-001-3',
        episodeNumber: 3,
        seasonNumber: 1,
        title: 'Sub-Level Bio-Breach',
        duration: '25m',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
        videoUrl1080p: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
        videoUrl720p: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
        videoUrl480p: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
        streamType: 'HLS',
        subtitles: [{ language: 'English', languageCode: 'en', url: '', isDefault: true }]
      }
    ],
    subtitles: [
      { language: 'English', languageCode: 'en', url: 'https://raw.githubusercontent.com/bower-media-samples/big-buck-bunny-480p/master/subtitles.vtt', isDefault: true },
      { language: 'Hindi', languageCode: 'hi', url: '' },
      { language: 'Japanese', languageCode: 'ja', url: '' }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'anix-002',
    title: 'Abyss Protocol: Zero Void',
    altTitle: 'アビス・プロトコル：虚無の境界',
    description:
      'VIP sandboxed anti-ad engine test stream. Bypasses popups, clickjackers, and malicious redirect timers on third-party Abyss/Streamtape embeds.',
    posterUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1600&auto=format&fit=crop&q=80',
    category: 'Series',
    rating: 9.3,
    releaseYear: '2024',
    duration: '26m/ep',
    ageRating: '16+',
    audioLanguages: 'Japanese, Hindi Sub',
    status: 'PUBLISHED',
    streamType: 'ABYSS',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    videoUrl1080p: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    videoUrl720p: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    videoUrl480p: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    episodes: [
      {
        id: 'ep-002-1',
        episodeNumber: 1,
        seasonNumber: 1,
        title: 'Breach into the Void',
        duration: '26m',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
        streamType: 'ABYSS',
        subtitles: [{ language: 'English', languageCode: 'en', url: '', isDefault: true }]
      },
      {
        id: 'ep-002-2',
        episodeNumber: 2,
        seasonNumber: 1,
        title: 'Singularity Drift',
        duration: '24m',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
        streamType: 'ABYSS',
        subtitles: [{ language: 'English', languageCode: 'en', url: '', isDefault: true }]
      }
    ],
    subtitles: [{ language: 'English', languageCode: 'en', url: '', isDefault: true }],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'anix-003',
    title: 'Archive Chronicles: Retro Odyssey',
    altTitle: 'アーカイブ年代記：レトロ・オデッセイ',
    description:
      'Direct MP4 & Archive.org streaming with instant hardware-accelerated seek, low-latency playback start, and zero-buffering pre-fetch buffer.',
    posterUrl: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=800&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1600&auto=format&fit=crop&q=80',
    category: 'Movies',
    rating: 9.8,
    releaseYear: '2024',
    duration: '114m',
    ageRating: '16+',
    audioLanguages: 'Japanese, Hindi Sub, English Sub',
    status: 'PUBLISHED',
    streamType: 'ARCHIVE',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    videoUrl1080p: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    videoUrl720p: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    videoUrl480p: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    episodes: [
      {
        id: 'ep-003-1',
        episodeNumber: 1,
        seasonNumber: 1,
        title: 'Full Length Feature Movie',
        duration: '114m',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        videoUrl1080p: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        streamType: 'ARCHIVE',
        subtitles: [{ language: 'English', languageCode: 'en', url: '', isDefault: true }]
      }
    ],
    subtitles: [{ language: 'English', languageCode: 'en', url: '', isDefault: true }],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'anix-004',
    title: 'Ghost Algorithm: Git Shell',
    altTitle: '攻殻のアルゴリズム：スタンド・アローン',
    description:
      'Universal MUX / DEMUX stream container test. High-bitrate audio stream with multi-channel sub/dub support and hardware decode.',
    posterUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1600&auto=format&fit=crop&q=80',
    category: 'Drama',
    rating: 9.1,
    releaseYear: '2023',
    duration: '48m/ep',
    ageRating: '18+',
    audioLanguages: 'Japanese, English Dub',
    status: 'PUBLISHED',
    streamType: 'MUX',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    videoUrl1080p: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    videoUrl720p: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    videoUrl480p: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    episodes: [
      {
        id: 'ep-004-1',
        episodeNumber: 1,
        seasonNumber: 1,
        title: 'Autonomous Rogue Agent',
        duration: '48m',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
        streamType: 'MUX',
        subtitles: []
      }
    ],
    subtitles: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'anix-005',
    title: 'Blade of the Cursed Eclipse',
    altTitle: '日食の呪われし刃：黒夜',
    description:
      'ECDN distributed edge network stream. Delivers zero-cost edge distribution for ultra-fast loading across all network providers.',
    posterUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1514539079130-25950c84af65?w=1600&auto=format&fit=crop&q=80',
    category: 'Anime',
    rating: 9.4,
    releaseYear: '2024',
    duration: '25m/ep',
    ageRating: '18+',
    audioLanguages: 'Japanese, Hindi Sub',
    status: 'PUBLISHED',
    streamType: 'ECDN',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackSeeTheWorld.mp4',
    videoUrl1080p: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackSeeTheWorld.mp4',
    episodes: [
      {
        id: 'ep-005-1',
        episodeNumber: 1,
        seasonNumber: 1,
        title: 'Blood Moon Rising',
        duration: '25m',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackSeeTheWorld.mp4',
        streamType: 'ECDN',
        subtitles: []
      }
    ],
    subtitles: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'anix-006-draft',
    title: 'Secret Upcoming Project (Draft)',
    altTitle: '極秘制作プロジェクト',
    description: 'This is a DRAFT title and should NOT appear in the user UI because status == DRAFT.',
    posterUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800',
    bannerUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1600',
    category: 'Anime',
    rating: 8.0,
    releaseYear: '2025',
    duration: '24m',
    ageRating: '13+',
    audioLanguages: 'Japanese',
    status: 'DRAFT', // strictly filtered out!
    streamType: 'DIRECT',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
    episodes: [],
    subtitles: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];
