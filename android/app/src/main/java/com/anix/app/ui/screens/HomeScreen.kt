package com.anix.app.ui.screens

import android.content.res.Configuration
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalConfiguration
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage
import com.anix.app.data.model.MediaItem
import com.anix.app.data.repository.FirestoreRepository
import com.anix.app.ui.theme.*

@Composable
fun HomeScreen(
    isVip: Boolean,
    onMediaSelect: (MediaItem) -> Unit,
    onVipUpgradeClick: () -> Unit,
    onLogoTap: () -> Unit = {},
    repository: FirestoreRepository = remember { FirestoreRepository() }
) {
    val configuration = LocalConfiguration.current
    val isLandscape = configuration.orientation == Configuration.ORIENTATION_LANDSCAPE
    val gridColumns = if (isLandscape) 6 else 3

    val mediaList by repository.observeMediaCatalog().collectAsState(initial = emptyList())
    var selectedCategory by remember { mutableStateOf("All") }

    val categories = listOf("All", "Cyberpunk", "Shonen", "Action", "Sci-Fi", "Dark Fantasy")
    val filteredList = remember(mediaList, selectedCategory) {
        if (selectedCategory == "All") mediaList else mediaList.filter { it.category.equals(selectedCategory, true) }
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(AnixBackground)
    ) {
        // App Bar with Cyberpunk Logo & VIP Status
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 16.dp, vertical = 12.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            // Secret 5-tap on ANIX logo navigates to Admin dashboard
            Row(
                verticalAlignment = Alignment.CenterVertically,
                modifier = Modifier.clickable { onLogoTap() }
            ) {
                Text(
                    text = "ANIX",
                    color = AnixPrimaryNeonCrimson,
                    fontSize = 24.sp,
                    fontWeight = FontWeight.Black,
                    letterSpacing = 2.sp
                )
                Text(
                    text = "•STREAM",
                    color = AnixCyan,
                    fontSize = 12.sp,
                    fontWeight = FontWeight.Bold,
                    modifier = Modifier.padding(start = 4.dp)
                )
            }

            // VIP Badge or Upgrade button
            if (isVip) {
                Surface(
                    shape = RoundedCornerShape(20.dp),
                    color = AnixVipGold.copy(alpha = 0.2f),
                    border = androidx.compose.foundation.BorderStroke(1.dp, AnixVipGold)
                ) {
                    Row(
                        modifier = Modifier.padding(horizontal = 10.dp, vertical = 4.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Icon(
                            Icons.Default.WorkspacePremium,
                            contentDescription = "VIP Active",
                            tint = AnixVipGold,
                            modifier = Modifier.size(16.dp)
                        )
                        Spacer(modifier = Modifier.width(4.dp))
                        Text(
                            text = "VIP ACTIVE",
                            color = AnixVipGold,
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Bold
                        )
                    }
                }
            } else {
                Button(
                    onClick = onVipUpgradeClick,
                    colors = ButtonDefaults.buttonColors(containerColor = AnixPrimaryNeonCrimson),
                    shape = RoundedCornerShape(20.dp),
                    contentPadding = PaddingValues(horizontal = 12.dp, vertical = 4.dp)
                ) {
                    Icon(
                        Icons.Default.Bolt,
                        contentDescription = null,
                        modifier = Modifier.size(16.dp)
                    )
                    Spacer(modifier = Modifier.width(4.dp))
                    Text(
                        text = "GET VIP ₹10",
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Bold
                    )
                }
            }
        }

        // Category Filter Tabs
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 12.dp, vertical = 6.dp),
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            categories.forEach { category ->
                val isSelected = selectedCategory == category
                Surface(
                    shape = RoundedCornerShape(8.dp),
                    color = if (isSelected) AnixPrimaryNeonCrimson else AnixSurface,
                    border = androidx.compose.foundation.BorderStroke(
                        1.dp,
                        if (isSelected) AnixPrimaryNeonCrimson else AnixSurfaceBorder
                    ),
                    modifier = Modifier.clickable { selectedCategory = category }
                ) {
                    Text(
                        text = category,
                        color = if (isSelected) Color.White else AnixTextSecondary,
                        fontSize = 12.sp,
                        fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Normal,
                        modifier = Modifier.padding(horizontal = 12.dp, vertical = 6.dp)
                    )
                }
            }
        }

        // Media Grid
        LazyVerticalGrid(
            columns = GridCells.Fixed(gridColumns),
            contentPadding = PaddingValues(8.dp),
            horizontalArrangement = Arrangement.spacedBy(8.dp),
            verticalArrangement = Arrangement.spacedBy(10.dp),
            modifier = Modifier.fillMaxSize()
        ) {
            items(filteredList) { media ->
                MediaCard(
                    media = media,
                    onClick = { onMediaSelect(media) }
                )
            }
        }
    }
}

/**
 * 2:3 Aspect ratio Cyberpunk Poster Card with Badges
 */
@Composable
fun MediaCard(
    media: MediaItem,
    onClick: () -> Unit
) {
    Card(
        shape = RoundedCornerShape(10.dp),
        border = androidx.compose.foundation.BorderStroke(1.dp, AnixSurfaceBorder),
        colors = CardDefaults.cardColors(containerColor = AnixSurface),
        modifier = Modifier
            .fillMaxWidth()
            .aspectRatio(2f / 3f)
            .clip(RoundedCornerShape(10.dp))
            .clickable { onClick() }
    ) {
        Box(modifier = Modifier.fillMaxSize()) {
            // Poster Image
            AsyncImage(
                model = media.posterUrl,
                contentDescription = media.title,
                contentScale = ContentScale.Crop,
                modifier = Modifier.fillMaxSize()
            )

            // Top-Left Resolution Badge
            Surface(
                color = Color(0xCC09090D),
                shape = RoundedCornerShape(bottomEnd = 8.dp),
                modifier = Modifier.align(Alignment.TopStart)
            ) {
                Text(
                    text = if (media.videoUrl1080p.isNotEmpty()) "1080P" else media.streamType,
                    color = AnixCyan,
                    fontSize = 9.sp,
                    fontWeight = FontWeight.Bold,
                    modifier = Modifier.padding(horizontal = 6.dp, vertical = 3.dp)
                )
            }

            // Top-Right CC / DUB Badge
            Surface(
                color = Color(0xCC09090D),
                shape = RoundedCornerShape(bottomStart = 8.dp),
                modifier = Modifier.align(Alignment.TopEnd)
            ) {
                Row(
                    modifier = Modifier.padding(horizontal = 6.dp, vertical = 3.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = "SUB/DUB",
                        color = AnixVipGold,
                        fontSize = 9.sp,
                        fontWeight = FontWeight.Bold
                    )
                }
            }

            // Bottom Gradient overlay with Title & Metadata
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .align(Alignment.BottomCenter)
                    .background(
                        Brush.verticalGradient(
                            listOf(Color.Transparent, Color(0xDD09090D), Color(0xFF09090D))
                        )
                    )
                    .padding(horizontal = 8.dp, vertical = 6.dp)
            ) {
                Column {
                    Text(
                        text = media.title,
                        color = Color.White,
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Bold,
                        maxLines = 1,
                        overflow = TextOverflow.Ellipsis
                    )
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            text = "${media.releaseYear} • ⭐ ${media.rating}",
                            color = AnixTextSecondary,
                            fontSize = 10.sp
                        )
                        Text(
                            text = media.ageRating,
                            color = AnixPrimaryNeonCrimson,
                            fontSize = 9.sp,
                            fontWeight = FontWeight.Bold
                        )
                    }
                }
            }
        }
    }
}
