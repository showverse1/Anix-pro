package com.anix.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material.icons.filled.Download
import androidx.compose.material.icons.filled.PlayArrow
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage
import com.anix.app.data.model.MediaItem
import com.anix.app.data.repository.FirestoreRepository
import com.anix.app.ui.theme.*

@Composable
fun DownloadsScreen(
    isVip: Boolean,
    onMediaSelect: (MediaItem) -> Unit,
    onVipUpgradeClick: () -> Unit,
    repository: FirestoreRepository = remember { FirestoreRepository() }
) {
    val mediaList by repository.observeMediaCatalog().collectAsState(initial = emptyList())

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(AnixBackground)
            .padding(14.dp)
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column {
                Text(
                    text = "OFFLINE DOWNLOADS",
                    color = Color.White,
                    fontSize = 18.sp,
                    fontWeight = FontWeight.Black
                )
                Text(
                    text = "Watch anytime without internet or mobile data",
                    color = AnixTextSecondary,
                    fontSize = 11.sp
                )
            }
            Surface(
                shape = RoundedCornerShape(8.dp),
                color = AnixCyan.copy(alpha = 0.15f),
                border = androidx.compose.foundation.BorderStroke(1.dp, AnixCyan.copy(alpha = 0.3f))
            ) {
                Text(
                    text = "OFFLINE READY",
                    color = AnixCyan,
                    fontSize = 10.sp,
                    fontWeight = FontWeight.Bold,
                    modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
                )
            }
        }

        Spacer(modifier = Modifier.height(14.dp))

        // Storage indicator
        Card(
            shape = RoundedCornerShape(12.dp),
            colors = CardDefaults.cardColors(containerColor = AnixSurface),
            border = androidx.compose.foundation.BorderStroke(1.dp, AnixSurfaceBorder),
            modifier = Modifier.fillMaxWidth()
        ) {
            Column(modifier = Modifier.padding(12.dp)) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Text("Device Internal Storage", color = Color.White, fontSize = 12.sp, fontWeight = FontWeight.Bold)
                    Text("1.2 GB / 64 GB used", color = AnixTextSecondary, fontSize = 11.sp)
                }
                Spacer(modifier = Modifier.height(6.dp))
                LinearProgressIndicator(
                    progress = 0.15f,
                    color = AnixPrimaryNeonCrimson,
                    trackColor = Color(0x33FFFFFF),
                    modifier = Modifier.fillMaxWidth().height(6.dp)
                )
            }
        }

        Spacer(modifier = Modifier.height(14.dp))

        // Downloaded Items
        LazyColumn(
            verticalArrangement = Arrangement.spacedBy(10.dp),
            modifier = Modifier.fillMaxSize()
        ) {
            items(mediaList.take(3)) { media ->
                Card(
                    shape = RoundedCornerShape(12.dp),
                    colors = CardDefaults.cardColors(containerColor = AnixSurface),
                    border = androidx.compose.foundation.BorderStroke(1.dp, AnixSurfaceBorder),
                    modifier = Modifier.fillMaxWidth().clickable { onMediaSelect(media) }
                ) {
                    Row(
                        modifier = Modifier.padding(10.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        AsyncImage(
                            model = media.posterUrl,
                            contentDescription = media.title,
                            contentScale = ContentScale.Crop,
                            modifier = Modifier.size(50.dp, 68.dp).clip(RoundedCornerShape(8.dp))
                        )
                        Spacer(modifier = Modifier.width(12.dp))
                        Column(modifier = Modifier.weight(1f)) {
                            Text(media.title, color = Color.White, fontSize = 13.sp, fontWeight = FontWeight.Bold)
                            Text("Episode 1 • 24m • 1080p", color = AnixCyan, fontSize = 11.sp)
                            Text("Downloaded 480 MB", color = AnixTextSecondary, fontSize = 10.sp)
                        }
                        IconButton(onClick = { onMediaSelect(media) }) {
                            Icon(Icons.Default.PlayArrow, contentDescription = "Play", tint = AnixPrimaryNeonCrimson)
                        }
                    }
                }
            }
        }
    }
}
