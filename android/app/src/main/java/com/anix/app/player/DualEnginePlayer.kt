package com.anix.app.player

import android.annotation.SuppressLint
import android.app.Activity
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
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.viewinterop.AndroidView
import androidx.media3.common.C
import androidx.media3.common.MediaItem
import androidx.media3.common.MimeTypes
import androidx.media3.common.PlaybackParameters
import androidx.media3.common.util.UnstableApi
import androidx.media3.exoplayer.DefaultLoadControl
import androidx.media3.exoplayer.DefaultRenderersFactory
import androidx.media3.exoplayer.ExoPlayer
import androidx.media3.exoplayer.trackselection.DefaultTrackSelector
import androidx.media3.ui.AspectRatioFrameLayout
import androidx.media3.ui.PlayerView
import com.anix.app.data.model.MediaItem as AnixMediaItem
import com.anix.app.ui.theme.*
import kotlinx.coroutines.delay

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
    val activity = context as? Activity
    
    // Unlock peak refresh rate & keep screen on
    DisposableEffect(Unit) {
        activity?.let { SystemDisplayHelper.unlockPeakRefreshRate(it) }
        onDispose {
            activity?.let { SystemDisplayHelper.clearScreenOn(it) }
        }
    }

    val isNativeEngine = media.streamType.equals("DIRECT", ignoreCase = true) ||
            media.streamType.equals("HLS", ignoreCase = true) ||
            media.streamType.equals("ARCHIVE", ignoreCase = true)

    var currentQuality by remember { mutableStateOf("1080p FHD") }
    var currentSpeed by remember { mutableFloatStateOf(1.0f) }
    var resizeMode by remember { mutableIntStateOf(AspectRatioFrameLayout.RESIZE_MODE_FIT) }
    var showControls by remember { mutableStateOf(true) }
    var isPlaying by remember { mutableStateOf(true) }
    var isLocked by remember { mutableStateOf(false) }
    var currentPositionMs by remember { mutableLongStateOf(0L) }
    var durationMs by remember { mutableLongStateOf(0L) }

    // Auto-hide controls
    LaunchedEffect(showControls, isPlaying, isLocked) {
        if (showControls && isPlaying && !isLocked) {
            delay(3800)
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
            // Low-Latency Tuned LoadControl (1000ms start, 15s-60s read-ahead buffer)
            val loadControl = remember {
                DefaultLoadControl.Builder()
                    .setBufferDurationsMs(
                        15000, // min buffer
                        60000, // max buffer
                        1000,  // buffer for playback start
                        2000   // buffer for playback after rebuffer
                    )
                    .build()
            }

            // Hardware Decoder Fallback Enabled
            val renderersFactory = remember {
                DefaultRenderersFactory(context)
                    .setEnableDecoderFallback(true)
                    .setExtensionRendererMode(DefaultRenderersFactory.EXTENSION_RENDERER_MODE_PREFER)
            }

            val trackSelector = remember { DefaultTrackSelector(context) }
            val exoPlayer = remember {
                ExoPlayer.Builder(context, renderersFactory)
                    .setTrackSelector(trackSelector)
                    .setLoadControl(loadControl)
                    .build().apply {
                        playWhenReady = true
                    }
            }

            LaunchedEffect(media, currentQuality) {
                val streamUrl = when (currentQuality) {
                    "480p SD" -> media.videoUrl480p.ifEmpty { media.videoUrl }
                    "720p HD" -> media.videoUrl720p.ifEmpty { media.videoUrl }
                    "1080p FHD" -> media.videoUrl1080p.ifEmpty { media.videoUrl }
                    else -> media.videoUrl
                }

                if (streamUrl.isNotEmpty()) {
                    val mediaItemBuilder = MediaItem.Builder().setUri(Uri.parse(streamUrl))
                    if (media.subtitles.isNotEmpty()) {
                        val subConfigs = media.subtitles.map { sub ->
                            MediaItem.SubtitleConfiguration.Builder(Uri.parse(sub.url))
                                .setMimeType(MimeTypes.TEXT_VTT)
                                .setLanguage(sub.languageCode)
                                .setLabel(sub.language)
                                .setSelectionFlags(if (sub.isDefault) C.SELECTION_FLAG_DEFAULT else 0)
                                .build()
                        }
                        mediaItemBuilder.setSubtitleConfigurations(subConfigs)
                    }
                    exoPlayer.setMediaItem(mediaItemBuilder.build())
                    exoPlayer.prepare()
                }
            }

            LaunchedEffect(currentSpeed) {
                exoPlayer.playbackParameters = PlaybackParameters(currentSpeed)
            }

            LaunchedEffect(exoPlayer) {
                while (true) {
                    currentPositionMs = exoPlayer.currentPosition
                    durationMs = exoPlayer.duration.coerceAtLeast(0L)
                    isPlaying = exoPlayer.isPlaying
                    delay(500)
                }
            }

            DisposableEffect(Unit) {
                onDispose { exoPlayer.release() }
            }

            AndroidView(
                factory = { ctx ->
                    PlayerView(ctx).apply {
                        player = exoPlayer
                        useController = false
                        this.resizeMode = resizeMode
                        layoutParams = ViewGroup.LayoutParams(
                            ViewGroup.LayoutParams.MATCH_PARENT,
                            ViewGroup.LayoutParams.MATCH_PARENT
                        )
                    }
                },
                update = { view -> view.resizeMode = resizeMode },
                modifier = Modifier
                    .fillMaxSize()
                    .pointerInput(isLocked) {
                        if (!isLocked) {
                            detectTapGestures(
                                onTap = { showControls = !showControls },
                                onDoubleTap = { offset ->
                                    // Silent instant double-tap seek (+10s / -10s) without intrusive text overlay
                                    val width = size.width
                                    if (offset.x < width / 2) {
                                        exoPlayer.seekTo((exoPlayer.currentPosition - 10000L).coerceAtLeast(0L))
                                    } else {
                                        exoPlayer.seekTo((exoPlayer.currentPosition + 10000L).coerceAtMost(exoPlayer.duration))
                                    }
                                }
                            )
                        }
                    }
            )
        } else {
            // Sandboxed WebView Fallback View
            val hostDomain = remember(media.videoUrl) {
                try { Uri.parse(media.videoUrl).host ?: "" } catch (e: Exception) { "" }
            }
            AndroidView(
                factory = { ctx ->
                    WebView(ctx).apply {
                        settings.apply {
                            javaScriptEnabled = true
                            domStorageEnabled = true
                            setSupportMultipleWindows(false)
                        }
                        webViewClient = AntiAdWebViewClient(hostDomain, isVip)
                        webChromeClient = WebChromeClient()
                        loadUrl(media.videoUrl)
                    }
                },
                modifier = Modifier.fillMaxSize()
            )
        }

        // Lock Toggle Floating Button if locked
        if (isLocked) {
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(16.dp),
                contentAlignment = Alignment.TopEnd
            ) {
                IconButton(
                    onClick = { isLocked = false },
                    modifier = Modifier
                        .size(36.dp)
                        .background(Color(0xCC12121E), CircleShape)
                ) {
                    Icon(Icons.Default.Lock, contentDescription = "Unlock", tint = AnixPrimaryNeonCrimson)
                }
            }
        }

        // Icon-Only Minimalist Controls Overlay
        AnimatedVisibility(
            visible = showControls && !isLocked,
            enter = fadeIn(),
            exit = fadeOut(),
            modifier = Modifier.fillMaxSize()
        ) {
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .background(
                        Brush.verticalGradient(
                            listOf(Color(0xCC09090D), Color.Transparent, Color(0xEE09090D))
                        )
                    )
                    .padding(12.dp)
            ) {
                // Top Bar: Back, Title/Episode, Circular Glass Buttons (36dp)
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .align(Alignment.TopCenter),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        modifier = Modifier.weight(1f)
                    ) {
                        IconButton(
                            onClick = onBackClick,
                            modifier = Modifier.size(36.dp).background(Color(0x33FFFFFF), CircleShape)
                        ) {
                            Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = "Back", tint = Color.White)
                        }
                        Spacer(modifier = Modifier.width(8.dp))
                        Column(modifier = Modifier.weight(1f)) {
                            Text(
                                text = media.title,
                                color = Color.White,
                                fontSize = 13.sp,
                                fontWeight = FontWeight.Bold,
                                maxLines = 1,
                                overflow = TextOverflow.Ellipsis
                            )
                            Text(
                                text = "Engine: ${media.streamType} • 144Hz Peak",
                                color = AnixCyan,
                                fontSize = 10.sp
                            )
                        }
                    }

                    // 6 Circular Glass Buttons (36dp)
                    Row(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                        // 1. Aspect Ratio icon
                        IconButton(
                            onClick = {
                                resizeMode = when (resizeMode) {
                                    AspectRatioFrameLayout.RESIZE_MODE_FIT -> AspectRatioFrameLayout.RESIZE_MODE_ZOOM
                                    AspectRatioFrameLayout.RESIZE_MODE_ZOOM -> AspectRatioFrameLayout.RESIZE_MODE_FILL
                                    else -> AspectRatioFrameLayout.RESIZE_MODE_FIT
                                }
                            },
                            modifier = Modifier.size(36.dp).background(Color(0x33FFFFFF), CircleShape)
                        ) {
                            Icon(Icons.Default.AspectRatio, contentDescription = null, tint = Color.White, modifier = Modifier.size(18.dp))
                        }

                        // 2. Subtitles icon (glows Gold when active)
                        IconButton(
                            onClick = { },
                            modifier = Modifier
                                .size(36.dp)
                                .background(if (media.subtitles.isNotEmpty()) AnixVipGold.copy(alpha = 0.25f) else Color(0x33FFFFFF), CircleShape)
                        ) {
                            Icon(Icons.Default.ClosedCaption, contentDescription = null, tint = if (media.subtitles.isNotEmpty()) AnixVipGold else Color.White, modifier = Modifier.size(18.dp))
                        }

                        // 3. Quality icon (glows Gold on VIP stream)
                        IconButton(
                            onClick = {
                                currentQuality = if (currentQuality == "1080p FHD") "720p HD" else if (currentQuality == "720p HD") "480p SD" else "1080p FHD"
                            },
                            modifier = Modifier
                                .size(36.dp)
                                .background(if (currentQuality.contains("1080") || currentQuality.contains("720")) AnixVipGold.copy(alpha = 0.25f) else Color(0x33FFFFFF), CircleShape)
                        ) {
                            Icon(Icons.Default.HighQuality, contentDescription = null, tint = if (currentQuality.contains("1080") || currentQuality.contains("720")) AnixVipGold else Color.White, modifier = Modifier.size(18.dp))
                        }

                        // 4. Speed icon
                        IconButton(
                            onClick = {
                                currentSpeed = when (currentSpeed) {
                                    1.0f -> 1.25f
                                    1.25f -> 1.5f
                                    1.5f -> 2.0f
                                    else -> 1.0f
                                }
                            },
                            modifier = Modifier.size(36.dp).background(Color(0x33FFFFFF), CircleShape)
                        ) {
                            Icon(Icons.Default.Speed, contentDescription = null, tint = AnixCyan, modifier = Modifier.size(18.dp))
                        }

                        // 5. PiP icon
                        IconButton(
                            onClick = { },
                            modifier = Modifier.size(36.dp).background(Color(0x33FFFFFF), CircleShape)
                        ) {
                            Icon(Icons.Default.PictureInPictureAlt, contentDescription = null, tint = Color.White, modifier = Modifier.size(18.dp))
                        }

                        // 6. Lock screen icon
                        IconButton(
                            onClick = { isLocked = true },
                            modifier = Modifier.size(36.dp).background(Color(0x33FFFFFF), CircleShape)
                        ) {
                            Icon(Icons.Default.LockOpen, contentDescription = null, tint = Color.White, modifier = Modifier.size(18.dp))
                        }
                    }
                }

                // Center Controls: Rewind 10s, 72dp Crimson Play/Pause, Forward 10s
                Row(
                    modifier = Modifier.align(Alignment.Center),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(24.dp)
                ) {
                    IconButton(
                        onClick = { },
                        modifier = Modifier.size(44.dp).background(Color(0x44000000), CircleShape)
                    ) {
                        Icon(Icons.Default.FastRewind, contentDescription = "-10s", tint = Color.White, modifier = Modifier.size(26.dp))
                    }

                    // 72dp Circular Crimson Play/Pause Button
                    Box(
                        modifier = Modifier
                            .size(72.dp)
                            .clip(CircleShape)
                            .background(AnixPrimaryNeonCrimson)
                            .clickable { isPlaying = !isPlaying },
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(
                            if (isPlaying) Icons.Default.Pause else Icons.Default.PlayArrow,
                            contentDescription = "Play/Pause",
                            tint = Color.White,
                            modifier = Modifier.size(36.dp)
                        )
                    }

                    IconButton(
                        onClick = { },
                        modifier = Modifier.size(44.dp).background(Color(0x44000000), CircleShape)
                    ) {
                        Icon(Icons.Default.FastForward, contentDescription = "+10s", tint = Color.White, modifier = Modifier.size(26.dp))
                    }
                }

                // Bottom: 3dp Neon Scrubber, Time Display, SkipNext Icon Button
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .align(Alignment.BottomCenter)
                ) {
                    // 3dp Neon Scrubber
                    LinearProgressIndicator(
                        progress = if (durationMs > 0) currentPositionMs.toFloat() / durationMs.toFloat() else 0f,
                        color = AnixCyan,
                        trackColor = Color(0x33FFFFFF),
                        modifier = Modifier.fillMaxWidth().height(3.dp)
                    )
                    Spacer(modifier = Modifier.height(6.dp))

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            text = "${formatTime(currentPositionMs)} / ${formatTime(durationMs)}",
                            color = Color.White,
                            fontSize = 11.sp,
                            fontFamily = androidx.compose.ui.text.font.FontFamily.Monospace
                        )

                        // Circular SkipNext button
                        IconButton(
                            onClick = { },
                            modifier = Modifier.size(32.dp).background(Color(0x33FFFFFF), CircleShape)
                        ) {
                            Icon(Icons.Default.SkipNext, contentDescription = "Next Episode", tint = Color.White, modifier = Modifier.size(18.dp))
                        }
                    }
                }
            }
        }
    }
}

private fun formatTime(ms: Long): String {
    val totalSec = ms / 1000
    val min = totalSec / 60
    val sec = totalSec % 60
    return String.format("%02d:%02d", min, sec)
}
