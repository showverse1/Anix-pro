package com.anix.app

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.anix.app.data.model.MediaItem
import com.anix.app.data.repository.FirestoreRepository
import com.anix.app.player.DualEnginePlayer
import com.anix.app.ui.screens.*
import com.anix.app.ui.theme.*

class MainActivity : ComponentActivity() {

    private val repository = FirestoreRepository()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        setContent {
            ANIXAppTheme {
                val navController = rememberNavController()
                val currentUserId = remember { "user_device_anix_001" }
                val userSubscription by repository.observeUserSubscription(currentUserId)
                    .collectAsState(initial = null)
                val isVip = userSubscription?.isVip == true

                var currentRoute by remember { mutableStateOf("home") }
                var selectedMediaForPlayback by remember { mutableStateOf<MediaItem?>(null) }
                var secretTapCount by remember { mutableIntStateOf(0) }

                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = AnixBackground
                ) {
                    Scaffold(
                        bottomBar = {
                            if (selectedMediaForPlayback == null && currentRoute != "admin") {
                                // Full 5-Tab Material 3 Navigation Bar
                                NavigationBar(
                                    containerColor = AnixSurface,
                                    tonalElevation = 8.dp
                                ) {
                                    // 1. Home Tab
                                    NavigationBarItem(
                                        selected = currentRoute == "home",
                                        onClick = {
                                            currentRoute = "home"
                                            navController.navigate("home")
                                        },
                                        icon = { Icon(Icons.Default.Home, contentDescription = "Home") },
                                        label = { Text("Home") },
                                        colors = NavigationBarItemDefaults.colors(
                                            selectedIconColor = AnixPrimaryNeonCrimson,
                                            selectedTextColor = AnixPrimaryNeonCrimson,
                                            indicatorColor = AnixPrimaryNeonCrimson.copy(alpha = 0.2f),
                                            unselectedIconColor = AnixTextSecondary,
                                            unselectedTextColor = AnixTextSecondary
                                        )
                                    )

                                    // 2. Search Tab
                                    NavigationBarItem(
                                        selected = currentRoute == "search",
                                        onClick = {
                                            currentRoute = "search"
                                            navController.navigate("search")
                                        },
                                        icon = { Icon(Icons.Default.Search, contentDescription = "Search") },
                                        label = { Text("Search") },
                                        colors = NavigationBarItemDefaults.colors(
                                            selectedIconColor = AnixPrimaryNeonCrimson,
                                            selectedTextColor = AnixPrimaryNeonCrimson,
                                            indicatorColor = AnixPrimaryNeonCrimson.copy(alpha = 0.2f),
                                            unselectedIconColor = AnixTextSecondary,
                                            unselectedTextColor = AnixTextSecondary
                                        )
                                    )

                                    // 3. Downloads Tab
                                    NavigationBarItem(
                                        selected = currentRoute == "downloads",
                                        onClick = {
                                            currentRoute = "downloads"
                                            navController.navigate("downloads")
                                        },
                                        icon = {
                                            BadgedBox(badge = {
                                                Badge(containerColor = AnixCyan) { Text("2") }
                                            }) {
                                                Icon(Icons.Default.Download, contentDescription = "Downloads")
                                            }
                                        },
                                        label = { Text("Downloads") },
                                        colors = NavigationBarItemDefaults.colors(
                                            selectedIconColor = AnixCyan,
                                            selectedTextColor = AnixCyan,
                                            indicatorColor = AnixCyan.copy(alpha = 0.2f),
                                            unselectedIconColor = AnixTextSecondary,
                                            unselectedTextColor = AnixTextSecondary
                                        )
                                    )

                                    // 4. VIP Tab
                                    NavigationBarItem(
                                        selected = currentRoute == "subscription",
                                        onClick = {
                                            currentRoute = "subscription"
                                            navController.navigate("subscription")
                                        },
                                        icon = {
                                            BadgedBox(badge = {
                                                if (isVip) {
                                                    Badge(containerColor = AnixVipGold) { Text("VIP") }
                                                }
                                            }) {
                                                Icon(Icons.Default.WorkspacePremium, contentDescription = "VIP")
                                            }
                                        },
                                        label = { Text(if (isVip) "VIP Active" else "VIP Pass") },
                                        colors = NavigationBarItemDefaults.colors(
                                            selectedIconColor = AnixVipGold,
                                            selectedTextColor = AnixVipGold,
                                            indicatorColor = AnixVipGold.copy(alpha = 0.2f),
                                            unselectedIconColor = AnixTextSecondary,
                                            unselectedTextColor = AnixTextSecondary
                                        )
                                    )

                                    // 5. Profile Tab
                                    NavigationBarItem(
                                        selected = currentRoute == "profile",
                                        onClick = {
                                            currentRoute = "profile"
                                            navController.navigate("profile")
                                        },
                                        icon = { Icon(Icons.Default.Person, contentDescription = "Profile") },
                                        label = { Text("Profile") },
                                        colors = NavigationBarItemDefaults.colors(
                                            selectedIconColor = AnixPrimaryNeonCrimson,
                                            selectedTextColor = AnixPrimaryNeonCrimson,
                                            indicatorColor = AnixPrimaryNeonCrimson.copy(alpha = 0.2f),
                                            unselectedIconColor = AnixTextSecondary,
                                            unselectedTextColor = AnixTextSecondary
                                        )
                                    )
                                }
                            }
                        }
                    ) { innerPadding ->
                        Box(modifier = Modifier.padding(innerPadding)) {
                            NavHost(
                                navController = navController,
                                startDestination = "home"
                            ) {
                                composable("home") {
                                    currentRoute = "home"
                                    HomeScreen(
                                        isVip = isVip,
                                        onMediaSelect = { media ->
                                            selectedMediaForPlayback = media
                                        },
                                        onVipUpgradeClick = {
                                            currentRoute = "subscription"
                                            navController.navigate("subscription")
                                        },
                                        onLogoTap = {
                                            secretTapCount++
                                            if (secretTapCount >= 5) {
                                                secretTapCount = 0
                                                currentRoute = "admin"
                                                navController.navigate("admin")
                                            }
                                        }
                                    )
                                }

                                composable("search") {
                                    currentRoute = "search"
                                    SearchScreen(
                                        isVip = isVip,
                                        onMediaSelect = { media ->
                                            selectedMediaForPlayback = media
                                        }
                                    )
                                }

                                composable("downloads") {
                                    currentRoute = "downloads"
                                    DownloadsScreen(
                                        isVip = isVip,
                                        onMediaSelect = { media ->
                                            selectedMediaForPlayback = media
                                        },
                                        onVipUpgradeClick = {
                                            currentRoute = "subscription"
                                            navController.navigate("subscription")
                                        }
                                    )
                                }

                                composable("subscription") {
                                    currentRoute = "subscription"
                                    SubscriptionScreen(
                                        userId = currentUserId,
                                        isVip = isVip,
                                        onBackClick = {
                                            currentRoute = "home"
                                            navController.popBackStack()
                                        },
                                        onSubscriptionSuccess = {
                                            currentRoute = "home"
                                            navController.navigate("home")
                                        }
                                    )
                                }

                                composable("profile") {
                                    currentRoute = "profile"
                                    ProfileScreen(
                                        userId = currentUserId,
                                        isVip = isVip,
                                        onVipUpgradeClick = {
                                            currentRoute = "subscription"
                                            navController.navigate("subscription")
                                        },
                                        onAdminClick = {
                                            currentRoute = "admin"
                                            navController.navigate("admin")
                                        }
                                    )
                                }

                                composable("admin") {
                                    currentRoute = "admin"
                                    AdminDashboardScreen(
                                        repository = repository,
                                        onBackClick = {
                                            currentRoute = "home"
                                            navController.popBackStack()
                                        }
                                    )
                                }
                            }

                            // Fullscreen Overlay Player if active
                            selectedMediaForPlayback?.let { media ->
                                DualEnginePlayer(
                                    media = media,
                                    isVip = isVip,
                                    modifier = Modifier.fillMaxSize(),
                                    onBackClick = { selectedMediaForPlayback = null }
                                )
                            }
                        }
                    }
                }
            }
        }
    }
}
