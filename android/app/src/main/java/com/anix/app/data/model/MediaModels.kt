package com.anix.app.data.model

import com.google.firebase.Timestamp

enum class StreamType {
    DIRECT,
    HLS,
    ABYSS,
    MUX,
    DEMUX,
    ECDN,
    ARCHIVE
}

data class SubtitleTrack(
    val language: String = "English",
    val languageCode: String = "en",
    val url: String = "",
    val isDefault: Boolean = false
)

data class EpisodeItem(
    val id: String = "",
    val episodeNumber: Int = 1,
    val seasonNumber: Int = 1,
    val title: String = "",
    val duration: String = "24m",
    val videoUrl: String = "",
    val videoUrl480p: String = "",
    val videoUrl720p: String = "",
    val videoUrl1080p: String = "",
    val streamType: String = StreamType.HLS.name,
    val subtitles: List<SubtitleTrack> = emptyList()
)

data class MediaItem(
    val id: String = "",
    val title: String = "",
    val altTitle: String = "", // Original Japanese title rendered in Gold #FFD700
    val description: String = "",
    val posterUrl: String = "",
    val bannerUrl: String = "",
    val category: String = "Anime", // "Anime", "Series", "Drama", "Movies"
    val rating: Double = 9.0,
    val releaseYear: String = "2024",
    val duration: String = "24m/ep",
    val ageRating: String = "16+",
    val audioLanguages: String = "Japanese, Hindi Sub",
    val status: String = "PUBLISHED", // "PUBLISHED" vs "DRAFT" - strictly display PUBLISHED only
    
    // Multi-Stream URLs
    val videoUrl: String = "",
    val videoUrl480p: String = "",
    val videoUrl720p: String = "",
    val videoUrl1080p: String = "",
    val streamType: String = StreamType.HLS.name,
    
    val episodes: List<EpisodeItem> = emptyList(),
    val subtitles: List<SubtitleTrack> = emptyList(),
    val createdAt: Timestamp? = null,
    val updatedAt: Timestamp? = null
)

data class AppUpdateInfo(
    val versionCode: Int = 100,
    val versionName: String = "1.0.0",
    val title: String = "",
    val changelog: String = "",
    val downloadUrl: String = "",
    val forceUpdate: Boolean = false,
    val broadcastActive: Boolean = false
)
