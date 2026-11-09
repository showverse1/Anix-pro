package com.anix.app.data.model

import com.google.firebase.Timestamp

enum class StreamType {
    DIRECT,
    HLS,
    ABYSS,
    MUX,
    DEMUX,
    ECDN
}

data class SubtitleTrack(
    val language: String = "English",
    val code: String = "en",
    val url: String = "",
    val isDefault: Boolean = false
)

data class Episode(
    val episodeNumber: Int = 1,
    val title: String = "",
    val duration: String = "24m",
    val thumbnail: String = "",
    val videoUrl: String = "",
    val streamType: String = StreamType.HLS.name
)

data class MediaItem(
    val id: String = "",
    val title: String = "",
    val altTitle: String = "",
    val description: String = "",
    val posterUrl: String = "",
    val bannerUrl: String = "",
    val category: String = "Anime", // Action, Sci-Fi, Cyberpunk, Shonen, etc.
    val rating: Double = 9.0,
    val releaseYear: Int = 2024,
    val ageRating: String = "16+",
    val audioLanguages: List<String> = listOf("Japanese", "English Dub"),
    val status: String = "Ongoing",
    
    // Multi-quality streams & default
    val videoUrl: String = "",
    val videoUrl480p: String = "",
    val videoUrl720p: String = "",
    val videoUrl1080p: String = "",
    val streamType: String = StreamType.HLS.name,
    
    // Nested arrays
    val episodes: List<Episode> = emptyList(),
    val subtitles: List<SubtitleTrack> = emptyList(),
    
    // Timestamps
    val createdAt: Timestamp? = null,
    val updatedAt: Timestamp? = null
)
