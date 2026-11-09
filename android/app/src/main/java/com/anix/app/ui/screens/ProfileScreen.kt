package com.anix.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.anix.app.ui.theme.*

@Composable
fun ProfileScreen(
    userId: String,
    isVip: Boolean,
    onVipUpgradeClick: () -> Unit,
    onAdminClick: () -> Unit
) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(AnixBackground)
            .padding(16.dp)
    ) {
        // User Header Card
        Card(
            shape = RoundedCornerShape(16.dp),
            colors = CardDefaults.cardColors(containerColor = AnixSurface),
            border = androidx.compose.foundation.BorderStroke(1.dp, AnixSurfaceBorder),
            modifier = Modifier.fillMaxWidth()
        ) {
            Row(
                modifier = Modifier.padding(16.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Box(
                    modifier = Modifier
                        .size(56.dp)
                        .clip(CircleShape)
                        .background(AnixPrimaryNeonCrimson),
                    contentAlignment = Alignment.Center
                ) {
                    Text("CR", color = Color.White, fontSize = 20.sp, fontWeight = FontWeight.Black)
                }
                Spacer(modifier = Modifier.width(14.dp))
                Column {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Text("CyberRunner #94", color = Color.White, fontSize = 16.sp, fontWeight = FontWeight.Bold)
                        Spacer(modifier = Modifier.width(6.dp))
                        if (isVip) {
                            Surface(
                                shape = RoundedCornerShape(4.dp),
                                color = AnixVipGold.copy(alpha = 0.2f),
                                border = androidx.compose.foundation.BorderStroke(1.dp, AnixVipGold)
                            ) {
                                Text("VIP", color = AnixVipGold, fontSize = 9.sp, fontWeight = FontWeight.Bold, modifier = Modifier.padding(2.dp))
                            }
                        }
                    }
                    Text("verseshow94@gmail.com", color = AnixTextSecondary, fontSize = 12.sp)
                    Text("UID: $userId", color = AnixTextSecondary.copy(alpha = 0.7f), fontSize = 10.sp)
                }
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        // VIP Upgrade banner if not VIP
        if (!isVip) {
            Card(
                shape = RoundedCornerShape(14.dp),
                colors = CardDefaults.cardColors(containerColor = AnixSurface),
                border = androidx.compose.foundation.BorderStroke(1.dp, AnixPrimaryNeonCrimson),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(14.dp)) {
                    Text("Upgrade to VIP from ₹10", color = Color.White, fontWeight = FontWeight.Bold, fontSize = 14.sp)
                    Text("Zero ads on Abyss/Mux sandbox, 1080p stream unlock, and unthrottled downloads.", color = AnixTextSecondary, fontSize = 11.sp)
                    Spacer(modifier = Modifier.height(10.dp))
                    Button(
                        onClick = onVipUpgradeClick,
                        colors = ButtonDefaults.buttonColors(containerColor = AnixPrimaryNeonCrimson),
                        shape = RoundedCornerShape(8.dp),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Text("UPGRADE VIA ZERO-COST UPI")
                    }
                }
            }
            Spacer(modifier = Modifier.height(16.dp))
        }

        // Admin panel button
        OutlinedButton(
            onClick = onAdminClick,
            shape = RoundedCornerShape(10.dp),
            colors = ButtonDefaults.outlinedButtonColors(contentColor = AnixCyan),
            border = androidx.compose.foundation.BorderStroke(1.dp, AnixCyan.copy(alpha = 0.4f)),
            modifier = Modifier.fillMaxWidth()
        ) {
            Icon(Icons.Default.Shield, contentDescription = null)
            Spacer(modifier = Modifier.width(8.dp))
            Text("Open Creator / Admin Dashboard (/admin)")
        }
    }
}
