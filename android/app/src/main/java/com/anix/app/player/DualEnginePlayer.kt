package com.anix.app.player

import android.annotation.SuppressLint
import android.net.Uri
import android.view.ViewGroup
import android.webkit.WebChromeClient
import android.webkit.WebSettings
import android.webkit.WebView
import androidx.annotation.OptIn
import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.gestures.detectTapGestures
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.viewinterop.AndroidView
import androidx.media3.common.C
import androidx.media3.common.MediaItem
import androidx.media3.common.MimeTypes
import androidx.media3.common.PlaybackParameters
import androidx.media3.common.util.UnstableApi
import androidx.media3.exoplayer.ExoPlayer
import androidx.media3.exoplayer.trackselection.DefaultTrackSelector
import androidx.media3.ui.AspectRatioFrameLayout
import androidx.media3.ui.PlayerView
import com.anix.app.data.model.MediaItem as AnixMediaItem
import com.anix.app.data.model.StreamType
import com.anix.app.ui.theme.*
import kotlinx.coroutines.delay

enum class PlayerResizeMode(val label: String, val mode: Int) {
    FIT("Fit 16:9", AspectRatioFrameLayout.RESIZE_MODE_FIT),
    FILL("Fill / Zoom", AspectRatioFrameLayout.RESIZE_MODE_ZOOM),
    STRETCH("Stretch", AspectRatioFrameLayout.RESIZE_MODE_FILL)
}

/**
 * Dual-Engine Video Player:
 * Automatically routes to Native Media3 ExoPlayer for DIRECT & HLS streams,
 * or Sandboxed Anti-Ad Hybrid WebView for Abyss / Mux / Demux / ECDN embeds.
 */
@SuppressLint("SetJavaScriptEnabled")
@OptIn(UnstableApi::class)
@Composable
fun DualEnginePlayer(
    media: AnixMediaItem,
    isVip: Boolean,
    modifier: Modifier = Modifier,
    onBackClick: () -> Unit = {}
) {
    val context = LocalContext.current
    val isNativeEngine = media.streamType.equals(StreamType.DIRECT.name, ignoreCase = true) ||
                         media.streamType.equals(StreamType.HLS.name, ignoreCase = true)

    var currentQuality by remember { mutableStateOf("1080p") }
    var currentSpeed by remember { mutableFloatStateOf(1.0f) }
    var currentResizeMode by remember { mutableStateOf(PlayerResizeMode.FIT) }
    var showControls by remember { mutableStateOf(true) }
    var isPlaying by remember { mutableStateOf(true) }
    var currentPositionMs by remember { mutableLongStateOf(0L) }
    var durationMs by remember { mutableLongStateOf(0L) }
    var doubleTapFeedback by remember { mutableStateOf<String?>(null) }
    var blockedAdsCount by remember { mutableIntStateOf(0) }

    // Auto-hide controls after 4 seconds
    LaunchedEffect(showControls, isPlaying) {
        if (showControls && isPlaying) {
            delay(4000)
            showControls = false
        }
    }

    Box(
        modifier = modifier
            .fillMaxWidth()
            .aspectRatio(16f / 9f)
            .background(Color.Black)
    ) {
        if (isNativeEngine) {
            // ==========================================
            // ENGINE A: Native Media3 ExoPlayer Engine
            // ==========================================
            val trackSelector = remember { DefaultTrackSelector(context) }
            val exoPlayer = remember {
                ExoPlayer.Builder(context)
                    .setTrackSelector(trackSelector)
                    .build().apply {
                        playWhenReady = true
                    }
            }

            // Setup MediaItem with multi-quality & subtitles
            LaunchedEffect(media, currentQuality) {
                val streamUrl = when (currentQuality) {
                    "480p" -> media.videoUrl480p.ifEmpty { media.videoUrl }
                    "720p" -> media.videoUrl720p.ifEmpty { media.videoUrl }
                    "1080p" -> media.videoUrl1080p.ifEmpty { media.videoUrl }
                    else -> media.videoUrl
                }

                if (streamUrl.isNotEmpty()) {
                    val mediaItemBuilder = MediaItem.Builder().setUri(Uri.parse(streamUrl))
                    
                    // Inject Subtitle tracks if present
                    if (media.subtitles.isNotEmpty()) {
                        val subtitleConfigs = media.subtitles.map { sub ->
                            MediaItem.SubtitleConfiguration.Builder(Uri.parse(sub.url))
                                .setMimeType(MimeTypes.TEXT_VTT)
                                .setLanguage(sub.code)
                                .setLabel(sub.language)
                                .setSelectionFlags(if (sub.isDefault) C.SELECTION_FLAG_DEFAULT else 0)
                                .build()
                        }
                        mediaItemBuilder.setSubtitleConfigurations(subtitleConfigs)
                    }

                    exoPlayer.setMediaItem(mediaItemBuilder.build())
                    exoPlayer.prepare()
                }
            }

            // Speed controller
            LaunchedEffect(currentSpeed) {
                exoPlayer.playbackParameters = PlaybackParameters(currentSpeed)
            }

            // Sync playback position
            LaunchedEffect(exoPlayer) {
                while (true) {
                    currentPositionMs = exoPlayer.currentPosition
                    durationMs = exoPlayer.duration.coerceAtLeast(0L)
                    isPlaying = exoPlayer.isPlaying
                    delay(500)
                }
            }

            DisposableEffect(Unit) {
                onDispose {
                    exoPlayer.release()
                }
            }

            AndroidView(
                factory = { ctx ->
                    PlayerView(ctx).apply {
                        player = exoPlayer
                        useController = false // Use custom Compose overlay
                        resizeMode = currentResizeMode.mode
                        layoutParams = ViewGroup.LayoutParams(
                            ViewGroup.LayoutParams.MATCH_PARENT,
                            ViewGroup.LayoutParams.MATCH_PARENT
                        )
                    }
                },
                update = { view ->
                    view.resizeMode = currentResizeMode.mode
                },
                modifier = Modifier
                    .fillMaxSize()
                    .pointerInput(Unit) {
                        detectTapGestures(
                            onTap = { showControls = !showControls },
                            onDoubleTap = { offset ->
                                val width = size.width
                                if (offset.x < width / 2) {
                                    // Left double tap: seek -10s
                                    val newPos = (exoPlayer.currentPosition - 10000L).coerceAtLeast(0L)
                                    exoPlayer.seekTo(newPos)
                                    doubleTapFeedback = "⏪ -10s"
                                } else {
                                    // Right double tap: seek +10s
                                    val newPos = (exoPlayer.currentPosition + 10000L).coerceAtMost(exoPlayer.duration)
                                    exoPlayer.seekTo(newPos)
                                    doubleTapFeedback = "⏩ +10s"
                                }
                            }
                        )
                    }
            )

        } else {
            // ==========================================
            // ENGINE B: Sandboxed Anti-Ad Hybrid WebView Engine
            // (Abyss, Mux, Demux, ECDN)
            // ==========================================
            val embedUrl = media.videoUrl
            val hostDomain = remember(embedUrl) {
                try { Uri.parse(embedUrl).host ?: "" } catch (e: Exception) { "" }
            }

            AndroidView(
                factory = { ctx ->
                    WebView(ctx).apply {
                        layoutParams = ViewGroup.LayoutParams(
                            ViewGroup.LayoutParams.MATCH_PARENT,
                            ViewGroup.LayoutParams.MATCH_PARENT
                        )
                        settings.apply {
                            javaScriptEnabled = true
                            domStorageEnabled = true
                            mediaPlaybackRequiresUserGesture = false
                            loadsImagesAutomatically = true
                            // Anti-ad strict rule 1: Disable multi-window popups
                            setSupportMultipleWindows(false)
                            javaScriptCanOpenWindowsAutomatically = false
                            cacheMode = WebSettings.LOAD_DEFAULT
                        }

                        // Anti-ad strict rule 2 & 3: Custom sandboxed client
                        webViewClient = AntiAdWebViewClient(
                            allowedHostDomain = hostDomain,
                            isVipUser = isVip,
                            onAdBlocked = { blockedAdsCount++ }
                        )

                        webChromeClient = WebChromeClient()
                        loadUrl(embedUrl)
                    }
                },
                modifier = Modifier.fillMaxSize()
            )
        }

        // Double-tap visual ripple indicator
        LaunchedEffect(doubleTapFeedback) {
            if (doubleTapFeedback != null) {
                delay(800)
                doubleTapFeedback = null
            }
        }
        if (doubleTapFeedback != null) {
            Box(
                modifier = Modifier
                    .align(Alignment.Center)
                    .background(Color(0xCC12121E), RoundedCornerShape(12.dp))
                    .padding(horizontal = 20.dp, vertical = 10.dp)
            ) {
                Text(
                    text = doubleTapFeedback ?: "",
                    color = AnixPrimaryNeonCrimson,
                    fontSize = 18.sp,
                    fontWeight = FontWeight.Bold
                )
            }
        }

        // ==========================================
        // COMPOSE PLAYER OVERLAY CONTROLS
        // ==========================================
        AnimatedVisibility(
            visible = showControls,
            enter = fadeIn(),
            exit = fadeOut(),
            modifier = Modifier.fillMaxSize()
        ) {
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .background(
                        Brush.verticalGradient(
                            listOf(
                                Color(0xCC09090D),
                                Color.Transparent,
                                Color(0xEE09090D)
                            )
                        )
                    )
                    .padding(12.dp)
            ) {
                // Top bar: Back button, Title, Engine & VIP badge
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .align(Alignment.TopCenter),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        IconButton(onClick = onBackClick) {
                            Icon(
                                Icons.Default.ArrowBack,
                                contentDescription = "Back",
                                tint = Color.White
                            )
                        }
                        Spacer(modifier = Modifier.width(6.dp))
                        Column {
                            Text(
                                text = media.title,
                                color = Color.White,
                                fontSize = 15.sp,
                                fontWeight = FontWeight.Bold,
                                maxLines = 1
                            )
                            Text(
                                text = "Stream: ${media.streamType} • Engine: ${if (isNativeEngine) "Media3 ExoPlayer" else "Sandboxed WebView"}",
                                color = AnixTextSecondary,
                                fontSize = 11.sp
                            )
                        }
                    }

                    // VIP Ad-Shield Badge
                    if (isVip) {
                        Surface(
                            shape = RoundedCornerShape(6.dp),
                            color = AnixVipGold.copy(alpha = 0.2f),
                            border = androidx.compose.foundation.BorderStroke(1.dp, AnixVipGold)
                        ) {
                            Row(
                                modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp),
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Icon(
                                    Icons.Default.Security,
                                    contentDescription = null,
                                    tint = AnixVipGold,
                                    modifier = Modifier.size(14.dp)
                                )
                                Spacer(modifier = Modifier.width(4.dp))
                                Text(
                                    text = "VIP AD-SHIELD ON (${blockedAdsCount} Blocked)",
                                    color = AnixVipGold,
                                    fontSize = 10.sp,
                                    fontWeight = FontWeight.Bold
                                )
                            }
                        }
                    }
                }

                // Bottom bar: Multi-Quality Selector, Speed, Aspect Ratio, Timeline
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .align(Alignment.BottomCenter)
                ) {
                    // Playback actions
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        // Quality Buttons (1080p, 720p, 480p)
                        Row(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                            listOf("1080p", "720p", "480p").forEach { quality ->
                                Surface(
                                    shape = RoundedCornerShape(4.dp),
                                    color = if (currentQuality == quality) AnixPrimaryNeonCrimson else Color(0x33FFFFFF),
                                    modifier = Modifier.clickable { currentQuality = quality }
                                ) {
                                    Text(
                                        text = quality,
                                        color = Color.White,
                                        fontSize = 11.sp,
                                        fontWeight = FontWeight.SemiBold,
                                        modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                                    )
                                }
                            }
                        }

                        // Speed controller & Aspect Ratio switcher
                        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                            // Speed Toggle (1.0x -> 1.25x -> 1.5x -> 2.0x)
                            Surface(
                                shape = RoundedCornerShape(4.dp),
                                color = Color(0x44FFFFFF),
                                modifier = Modifier.clickable {
                                    currentSpeed = when (currentSpeed) {
                                        1.0f -> 1.25f
                                        1.25f -> 1.5f
                                        1.5f -> 2.0f
                                        else -> 1.0f
                                    }
                                }
                            ) {
                                Text(
                                    text = "${currentSpeed}x",
                                    color = AnixCyan,
                                    fontSize = 11.sp,
                                    fontWeight = FontWeight.Bold,
                                    modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                                )
                            }

                            // Aspect Ratio switcher
                            Surface(
                                shape = RoundedCornerShape(4.dp),
                                color = Color(0x44FFFFFF),
                                modifier = Modifier.clickable {
                                    currentResizeMode = when (currentResizeMode) {
                                        PlayerResizeMode.FIT -> PlayerResizeMode.FILL
                                        PlayerResizeMode.FILL -> PlayerResizeMode.STRETCH
                                        PlayerResizeMode.STRETCH -> PlayerResizeMode.FIT
                                    }
                                }
                            ) {
                                Text(
                                    text = currentResizeMode.label,
                                    color = Color.White,
                                    fontSize = 11.sp,
                                    modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                                )
                            }
                        }
                    }
                }
            }
        }
    }
}
