import { MediaItem } from '../types';

export const INITIAL_MEDIA_ITEMS: MediaItem[] = [
  {
    id: 'anix-media-001',
    title: 'Cyberpunk: Neon Genesis 2099',
    altTitle: 'サイバーパンク：ネオン・ジェネシス',
    description: 'In a dystopian mega-city bathed in holographic rain and chrome, an outlaw neural runner uncovers a rogue military AI threatening the city-wide bio-grid.',
    posterUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1600&auto=format&fit=crop&q=80',
    category: 'Cyberpunk',
    rating: 9.6,
    releaseYear: 2024,
    ageRating: '18+',
    audioLanguages: ['Japanese (Original)', 'English Dub', 'Hindi Dub'],
    status: 'Completed',
    streamType: 'DIRECT',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    videoUrl1080p: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    videoUrl720p: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
    videoUrl480p: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    episodes: [
      {
        episodeNumber: 1,
        title: 'Awakening of the Chromed Ghost',
        duration: '24m',
        thumbnail: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
        streamType: 'DIRECT'
      },
      {
        episodeNumber: 2,
        title: 'Sub-Level 04 Protocol',
        duration: '23m',
        thumbnail: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
        streamType: 'DIRECT'
      }
    ],
    subtitles: [
      { language: 'English', code: 'en', url: 'https://raw.githubusercontent.com/bower-media-samples/big-buck-bunny-480p/master/subtitles.vtt', isDefault: true },
      { language: 'Japanese', code: 'ja', url: '', isDefault: false }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'anix-media-002',
    title: 'Abyss Protocol: Zero Void',
    altTitle: 'アビス・プロトコル：虚無',
    description: 'Third-party embed simulation running through the VIP Anti-Ad Sandbox Engine. Strips clickjackers, kills popup tabs, and renders full HD bitrate with zero interruptions.',
    posterUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1600&auto=format&fit=crop&q=80',
    category: 'Action',
    rating: 9.3,
    releaseYear: 2024,
    ageRating: '16+',
    audioLanguages: ['Japanese', 'English Dub'],
    status: 'Ongoing',
    streamType: 'ABYSS',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    videoUrl1080p: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    videoUrl720p: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    episodes: [
      {
        episodeNumber: 1,
        title: 'Breach into the Void',
        duration: '25m',
        thumbnail: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
        streamType: 'ABYSS'
      }
    ],
    subtitles: [
      { language: 'English', code: 'en', url: '', isDefault: true }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'anix-media-003',
    title: 'Solo Shadow Hunter: Reborn',
    altTitle: '影の狩人：覚醒',
    description: 'When dimensional gates opened and monsters flooded Earth, the lowest-ranking E-rank hunter gained an unprecedented secret leveling quest system.',
    posterUrl: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=800&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1600&auto=format&fit=crop&q=80',
    category: 'Shonen',
    rating: 9.8,
    releaseYear: 2024,
    ageRating: '16+',
    audioLanguages: ['Japanese', 'English Dub', 'Hindi Dub'],
    status: 'Ongoing',
    streamType: 'HLS',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    videoUrl1080p: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    videoUrl720p: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    videoUrl480p: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    episodes: [
      {
        episodeNumber: 1,
        title: 'The Double Dungeon Trap',
        duration: '24m',
        thumbnail: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=600',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        streamType: 'HLS'
      }
    ],
    subtitles: [{ language: 'English', code: 'en', url: '', isDefault: true }],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'anix-media-004',
    title: 'Ghost Algorithm: Git Shell',
    altTitle: '攻殻のアルゴリズム',
    description: 'Special cyber-ops Division 9 investigates sentient decentralized smart contracts causing catastrophic drone outages in Neo-Shinjuku.',
    posterUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1600&auto=format&fit=crop&q=80',
    category: 'Sci-Fi',
    rating: 9.1,
    releaseYear: 2023,
    ageRating: '18+',
    audioLanguages: ['Japanese', 'English Dub'],
    status: 'Completed',
    streamType: 'MUX',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    videoUrl1080p: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    videoUrl720p: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    episodes: [],
    subtitles: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'anix-media-005',
    title: 'Blade of the Cursed Eclipse',
    altTitle: '日食の呪われし刃',
    description: 'An exiled samurai wielding a demon blade embarks on a dark fantasy vengeance across feudal provinces infested with otherworldly yokai.',
    posterUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1514539079130-25950c84af65?w=1600&auto=format&fit=crop&q=80',
    category: 'Dark Fantasy',
    rating: 9.4,
    releaseYear: 2024,
    ageRating: '18+',
    audioLanguages: ['Japanese', 'English Dub'],
    status: 'Ongoing',
    streamType: 'ECDN',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackSeeTheWorld.mp4',
    videoUrl1080p: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackSeeTheWorld.mp4',
    episodes: [],
    subtitles: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'anix-media-006',
    title: 'Valkyrie Mech Overdrive',
    altTitle: '戦乙女のオーバードライブ',
    description: 'High-speed orbital mech battles defend Earth’s outer space elevator against mysterious biological swarm incursions.',
    posterUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1600&auto=format&fit=crop&q=80',
    category: 'Action',
    rating: 8.9,
    releaseYear: 2023,
    ageRating: '13+',
    audioLanguages: ['Japanese', 'English Dub'],
    status: 'Completed',
    streamType: 'DIRECT',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
    episodes: [],
    subtitles: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];
