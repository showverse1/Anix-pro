package com.anix.app.ui.screens

import android.widget.Toast
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.anix.app.data.model.MediaItem
import com.anix.app.data.model.StreamType
import com.anix.app.data.model.SubtitleTrack
import com.anix.app.data.repository.FirestoreRepository
import com.anix.app.ui.theme.*
import kotlinx.coroutines.launch

@Composable
fun AdminDashboardScreen(
    repository: FirestoreRepository,
    onBackClick: () -> Unit
) {
    val context = LocalContext.current
    val coroutineScope = rememberCoroutineScope()

    var activeTab by remember { mutableStateOf("add_media") } // add_media, catalog_manage, subscriptions
    
    // Form fields for Anime / Media entry
    var title by remember { mutableStateOf("") }
    var altTitle by remember { mutableStateOf("") }
    var description by remember { mutableStateOf("") }
    var posterUrl by remember { mutableStateOf("") }
    var category by remember { mutableStateOf("Cyberpunk") }
    var rating by remember { mutableStateOf("9.2") }
    var releaseYear by remember { mutableStateOf("2024") }
    var ageRating by remember { mutableStateOf("16+") }

    // Multi-Stream fields
    var streamType by remember { mutableStateOf(StreamType.HLS.name) }
    var videoUrl by remember { mutableStateOf("") }
    var videoUrl1080p by remember { mutableStateOf("") }
    var videoUrl720p by remember { mutableStateOf("") }
    var videoUrl480p by remember { mutableStateOf("") }

    // Subtitles
    var subLang by remember { mutableStateOf("English") }
    var subUrl by remember { mutableStateOf("") }
    var isSaving by remember { mutableStateOf(false) }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(AnixBackground)
            .padding(16.dp)
            .verticalScroll(rememberScrollState())
    ) {
        // Admin Header
        Row(
            modifier = Modifier.fillMaxWidth(),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                IconButton(onClick = onBackClick) {
                    Icon(Icons.Default.ArrowBack, contentDescription = "Back", tint = Color.White)
                }
                Spacer(modifier = Modifier.width(8.dp))
                Column {
                    Text(
                        text = "ANIX CREATOR DASHBOARD",
                        color = AnixPrimaryNeonCrimson,
                        fontSize = 18.sp,
                        fontWeight = FontWeight.Black
                    )
                    Text(
                        text = "Firestore /media Management & Multi-Stream Injector",
                        color = AnixTextSecondary,
                        fontSize = 11.sp
                    )
                }
            }
            Surface(
                color = AnixCyan.copy(alpha = 0.2f),
                shape = RoundedCornerShape(4.dp)
            ) {
                Text(
                    text = "ROOT ADMIN",
                    color = AnixCyan,
                    fontSize = 10.sp,
                    fontWeight = FontWeight.Bold,
                    modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                )
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        // Navigation Tabs inside Admin
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            listOf(
                "add_media" to "+ Add / Inject Media",
                "subscriptions" to "UPI Subscriptions"
            ).forEach { (key, label) ->
                val isSelected = activeTab == key
                Surface(
                    shape = RoundedCornerShape(8.dp),
                    color = if (isSelected) AnixPrimaryNeonCrimson else AnixSurface,
                    modifier = Modifier
                        .weight(1f)
                        .clickable { activeTab = key }
                ) {
                    Text(
                        text = label,
                        color = Color.White,
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Bold,
                        modifier = Modifier
                            .padding(vertical = 10.dp)
                            .align(Alignment.CenterHorizontally)
                    )
                }
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        if (activeTab == "add_media") {
            // General Info Card
            Card(
                shape = RoundedCornerShape(12.dp),
                colors = CardDefaults.cardColors(containerColor = AnixSurface),
                border = androidx.compose.foundation.BorderStroke(1.dp, AnixSurfaceBorder),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(14.dp)) {
                    Text("1. Media Metadata", color = AnixCyan, fontWeight = FontWeight.Bold, fontSize = 14.sp)
                    Spacer(modifier = Modifier.height(8.dp))

                    OutlinedTextField(
                        value = title,
                        onValueChange = { title = it },
                        label = { Text("Title (e.g., Cyberpunk: Edgerunners)") },
                        modifier = Modifier.fillMaxWidth()
                    )
                    Spacer(modifier = Modifier.height(8.dp))

                    OutlinedTextField(
                        value = altTitle,
                        onValueChange = { altTitle = it },
                        label = { Text("Alt / Japanese Title") },
                        modifier = Modifier.fillMaxWidth()
                    )
                    Spacer(modifier = Modifier.height(8.dp))

                    OutlinedTextField(
                        value = posterUrl,
                        onValueChange = { posterUrl = it },
                        label = { Text("Poster Image URL (2:3 Aspect Ratio)") },
                        modifier = Modifier.fillMaxWidth()
                    )
                    Spacer(modifier = Modifier.height(8.dp))

                    OutlinedTextField(
                        value = description,
                        onValueChange = { description = it },
                        label = { Text("Synopsis / Description") },
                        modifier = Modifier.fillMaxWidth(),
                        maxLines = 3
                    )
                    Spacer(modifier = Modifier.height(8.dp))

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        OutlinedTextField(
                            value = category,
                            onValueChange = { category = it },
                            label = { Text("Category") },
                            modifier = Modifier.weight(1f)
                        )
                        OutlinedTextField(
                            value = rating,
                            onValueChange = { rating = it },
                            label = { Text("Rating (0-10)") },
                            modifier = Modifier.weight(1f)
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Multi-Stream & Engine Config Card
            Card(
                shape = RoundedCornerShape(12.dp),
                colors = CardDefaults.cardColors(containerColor = AnixSurface),
                border = androidx.compose.foundation.BorderStroke(1.dp, AnixSurfaceBorder),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(14.dp)) {
                    Text("2. Dual-Engine Stream Configuration", color = AnixVipGold, fontWeight = FontWeight.Bold, fontSize = 14.sp)
                    Text("Select stream architecture: Native ExoPlayer (DIRECT/HLS) or Sandboxed WebView (ABYSS/MUX/DEMUX/ECDN)", color = AnixTextSecondary, fontSize = 11.sp)
                    Spacer(modifier = Modifier.height(12.dp))

                    // Stream Type selector
                    Text("Select Stream Type:", color = Color.White, fontSize = 12.sp)
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(6.dp)
                    ) {
                        listOf("HLS", "DIRECT", "ABYSS", "MUX", "ECDN").forEach { type ->
                            val isSelected = streamType == type
                            Surface(
                                shape = RoundedCornerShape(6.dp),
                                color = if (isSelected) AnixPrimaryNeonCrimson else Color(0x33FFFFFF),
                                modifier = Modifier.clickable { streamType = type }
                            ) {
                                Text(
                                    text = type,
                                    color = Color.White,
                                    fontSize = 11.sp,
                                    fontWeight = FontWeight.Bold,
                                    modifier = Modifier.padding(horizontal = 8.dp, vertical = 6.dp)
                                )
                            }
                        }
                    }

                    Spacer(modifier = Modifier.height(12.dp))

                    OutlinedTextField(
                        value = videoUrl,
                        onValueChange = { videoUrl = it },
                        label = { Text("Primary / Embed Stream URL") },
                        placeholder = { Text("https://example.com/stream.m3u8 or https://abyss.to/embed/...") },
                        modifier = Modifier.fillMaxWidth()
                    )

                    Spacer(modifier = Modifier.height(8.dp))

                    OutlinedTextField(
                        value = videoUrl1080p,
                        onValueChange = { videoUrl1080p = it },
                        label = { Text("1080p High-Bitrate URL (Optional)") },
                        modifier = Modifier.fillMaxWidth()
                    )

                    Spacer(modifier = Modifier.height(8.dp))

                    OutlinedTextField(
                        value = videoUrl720p,
                        onValueChange = { videoUrl720p = it },
                        label = { Text("720p URL (Optional)") },
                        modifier = Modifier.fillMaxWidth()
                    )

                    Spacer(modifier = Modifier.height(8.dp))

                    OutlinedTextField(
                        value = videoUrl480p,
                        onValueChange = { videoUrl480p = it },
                        label = { Text("480p Low-Bandwidth URL (Optional)") },
                        modifier = Modifier.fillMaxWidth()
                    )
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Subtitle Track Card
            Card(
                shape = RoundedCornerShape(12.dp),
                colors = CardDefaults.cardColors(containerColor = AnixSurface),
                border = androidx.compose.foundation.BorderStroke(1.dp, AnixSurfaceBorder),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(14.dp)) {
                    Text("3. Subtitle Configuration (.vtt / .srt)", color = AnixCyan, fontWeight = FontWeight.Bold, fontSize = 14.sp)
                    Spacer(modifier = Modifier.height(8.dp))

                    OutlinedTextField(
                        value = subLang,
                        onValueChange = { subLang = it },
                        label = { Text("Language (e.g. English)") },
                        modifier = Modifier.fillMaxWidth()
                    )
                    Spacer(modifier = Modifier.height(8.dp))

                    OutlinedTextField(
                        value = subUrl,
                        onValueChange = { subUrl = it },
                        label = { Text("Subtitle URL (WebVTT .vtt)") },
                        modifier = Modifier.fillMaxWidth()
                    )
                }
            }

            Spacer(modifier = Modifier.height(20.dp))

            // Submit Button
            Button(
                onClick = {
                    if (title.isEmpty() || videoUrl.isEmpty()) {
                        Toast.makeText(context, "Please provide Title and Video URL.", Toast.LENGTH_SHORT).show()
                        return@Button
                    }

                    isSaving = true
                    coroutineScope.launch {
                        val subtitlesList = if (subUrl.isNotEmpty()) {
                            listOf(SubtitleTrack(language = subLang, code = "en", url = subUrl, isDefault = true))
                        } else emptyList()

                        val newMedia = MediaItem(
                            title = title,
                            altTitle = altTitle,
                            description = description,
                            posterUrl = posterUrl.ifEmpty { "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800" },
                            category = category,
                            rating = rating.toDoubleOrNull() ?: 9.0,
                            releaseYear = releaseYear.toIntOrNull() ?: 2024,
                            ageRating = ageRating,
                            streamType = streamType,
                            videoUrl = videoUrl,
                            videoUrl1080p = videoUrl1080p,
                            videoUrl720p = videoUrl720p,
                            videoUrl480p = videoUrl480p,
                            subtitles = subtitlesList
                        )

                        val res = repository.saveMediaItem(newMedia)
                        isSaving = false
                        res.fold(
                            onSuccess = {
                                Toast.makeText(context, "Media saved to Firestore successfully!", Toast.LENGTH_LONG).show()
                                title = ""
                                altTitle = ""
                                description = ""
                                videoUrl = ""
                            },
                            onFailure = { ex ->
                                Toast.makeText(context, "Failed to save: ${ex.message}", Toast.LENGTH_LONG).show()
                            }
                        )
                    }
                },
                enabled = !isSaving,
                colors = ButtonDefaults.buttonColors(containerColor = AnixPrimaryNeonCrimson),
                shape = RoundedCornerShape(12.dp),
                modifier = Modifier
                    .fillMaxWidth()
                    .height(50.dp)
            ) {
                if (isSaving) {
                    CircularProgressIndicator(modifier = Modifier.size(22.dp), color = Color.White)
                } else {
                    Icon(Icons.Default.CloudUpload, contentDescription = null)
                    Spacer(modifier = Modifier.width(8.dp))
                    Text("INJECT & SAVE TO FIRESTORE", fontWeight = FontWeight.Bold)
                }
            }

        } else {
            // Subscriptions list
            Text("Recent UPI Transactions & Validations", color = Color.White, fontWeight = FontWeight.Bold, fontSize = 16.sp)
            Spacer(modifier = Modifier.height(12.dp))
            Text("All transactions verified via 12-digit UTR checks and stored in /subscriptions/{txnId}.", color = AnixTextSecondary, fontSize = 12.sp)
        }
    }
}
