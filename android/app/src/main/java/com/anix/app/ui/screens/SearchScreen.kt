package com.anix.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Clear
import androidx.compose.material.icons.filled.Search
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.anix.app.data.model.MediaItem
import com.anix.app.data.repository.FirestoreRepository
import com.anix.app.ui.theme.*

@Composable
fun SearchScreen(
    isVip: Boolean,
    onMediaSelect: (MediaItem) -> Unit,
    repository: FirestoreRepository = remember { FirestoreRepository() }
) {
    val mediaList by repository.observeMediaCatalog().collectAsState(initial = emptyList())
    var searchQuery by remember { mutableStateOf("") }
    var selectedEngine by remember { mutableStateOf("All") }

    val filteredList = remember(mediaList, searchQuery, selectedEngine) {
        mediaList.filter { item ->
            val matchesQuery = searchQuery.isEmpty() ||
                    item.title.contains(searchQuery, ignoreCase = true) ||
                    item.category.contains(searchQuery, ignoreCase = true)
            val matchesEngine = selectedEngine == "All" || item.streamType.equals(selectedEngine, ignoreCase = true)
            matchesQuery && matchesEngine
        }
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(AnixBackground)
            .padding(12.dp)
    ) {
        Text(
            text = "SEARCH & EXPLORE",
            color = Color.White,
            fontSize = 18.sp,
            fontWeight = FontWeight.Black
        )
        Spacer(modifier = Modifier.height(10.dp))

        // Search Input Field
        OutlinedTextField(
            value = searchQuery,
            onValueChange = { searchQuery = it },
            placeholder = { Text("Search by title, anime genre...", color = AnixTextSecondary) },
            leadingIcon = { Icon(Icons.Default.Search, contentDescription = null, tint = AnixCyan) },
            trailingIcon = {
                if (searchQuery.isNotEmpty()) {
                    IconButton(onClick = { searchQuery = "" }) {
                        Icon(Icons.Default.Clear, contentDescription = "Clear", tint = Color.White)
                    }
                }
            },
            shape = RoundedCornerShape(16.dp),
            colors = OutlinedTextFieldDefaults.colors(
                focusedBorderColor = AnixPrimaryNeonCrimson,
                unfocusedBorderColor = AnixSurfaceBorder,
                focusedTextColor = Color.White,
                unfocusedTextColor = Color.White
            ),
            modifier = Modifier.fillMaxWidth()
        )

        Spacer(modifier = Modifier.height(12.dp))

        // Results Grid
        LazyVerticalGrid(
            columns = GridCells.Fixed(3),
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
