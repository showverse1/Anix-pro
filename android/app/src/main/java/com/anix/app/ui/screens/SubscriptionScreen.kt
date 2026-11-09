package com.anix.app.ui.screens

import android.widget.Toast
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
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
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.anix.app.payment.UpiPaymentManager
import com.anix.app.ui.theme.*
import com.google.firebase.firestore.FirebaseFirestore
import kotlinx.coroutines.launch

@Composable
fun SubscriptionScreen(
    userId: String,
    isVip: Boolean,
    onBackClick: () -> Unit,
    onSubscriptionSuccess: () -> Unit
) {
    val context = LocalContext.current
    val coroutineScope = rememberCoroutineScope()
    val firestore = remember { FirebaseFirestore.getInstance() }

    var selectedPlanDays by remember { mutableIntStateOf(30) } // Default ₹50 30-Day
    var utrInput by remember { mutableStateOf("") }
    var isVerifying by remember { mutableStateOf(false) }
    var errorMessage by remember { mutableStateOf<String?>(null) }
    var successMessage by remember { mutableStateOf<String?>(null) }

    val amount = if (selectedPlanDays == 7) 10 else 50

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(AnixBackground)
            .verticalScroll(rememberScrollState())
            .padding(16.dp)
    ) {
        // Header
        Row(
            verticalAlignment = Alignment.CenterVertically,
            modifier = Modifier.fillMaxWidth()
        ) {
            IconButton(onClick = onBackClick) {
                Icon(Icons.Default.ArrowBack, contentDescription = "Back", tint = Color.White)
            }
            Spacer(modifier = Modifier.width(8.dp))
            Text(
                text = "ANIX VIP PASS",
                color = AnixVipGold,
                fontSize = 20.sp,
                fontWeight = FontWeight.Black,
                letterSpacing = 1.sp
            )
        }

        Spacer(modifier = Modifier.height(16.dp))

        // VIP Active Status Card if already subscribed
        if (isVip) {
            Card(
                shape = RoundedCornerShape(12.dp),
                colors = CardDefaults.cardColors(containerColor = AnixSurface),
                border = androidx.compose.foundation.BorderStroke(1.dp, AnixVipGold),
                modifier = Modifier.fillMaxWidth()
            ) {
                Row(
                    modifier = Modifier.padding(16.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Icon(
                        Icons.Default.WorkspacePremium,
                        contentDescription = null,
                        tint = AnixVipGold,
                        modifier = Modifier.size(32.dp)
                    )
                    Spacer(modifier = Modifier.width(12.dp))
                    Column {
                        Text(
                            text = "YOU ARE VIP ACTIVE",
                            color = AnixVipGold,
                            fontWeight = FontWeight.Bold,
                            fontSize = 16.sp
                        )
                        Text(
                            text = "Ad-free streaming, dual-engine unlocks, and unthrottled servers enabled.",
                            color = AnixTextSecondary,
                            fontSize = 12.sp
                        )
                    }
                }
            }
            Spacer(modifier = Modifier.height(16.dp))
        }

        // Plan Selection
        Text(
            text = "Select Subscription Tier",
            color = Color.White,
            fontWeight = FontWeight.Bold,
            fontSize = 16.sp
        )
        Spacer(modifier = Modifier.height(12.dp))

        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            // Plan 1: ₹10 (7 Days)
            Card(
                shape = RoundedCornerShape(12.dp),
                colors = CardDefaults.cardColors(containerColor = AnixSurface),
                border = androidx.compose.foundation.BorderStroke(
                    2.dp,
                    if (selectedPlanDays == 7) AnixPrimaryNeonCrimson else AnixSurfaceBorder
                ),
                modifier = Modifier
                    .weight(1f)
                    .clickable { selectedPlanDays = 7 }
            ) {
                Column(modifier = Modifier.padding(14.dp)) {
                    Text("STARTER", color = AnixCyan, fontSize = 11.sp, fontWeight = FontWeight.Bold)
                    Text("₹10", color = Color.White, fontSize = 24.sp, fontWeight = FontWeight.Black)
                    Text("7 Days Access", color = AnixTextSecondary, fontSize = 12.sp)
                    Spacer(modifier = Modifier.height(8.dp))
                    Text("• Zero Ads Sandbox\n• 720p HD Unlocks", color = AnixTextSecondary, fontSize = 11.sp)
                }
            }

            // Plan 2: ₹50 (30 Days - Recommended)
            Card(
                shape = RoundedCornerShape(12.dp),
                colors = CardDefaults.cardColors(containerColor = AnixSurface),
                border = androidx.compose.foundation.BorderStroke(
                    2.dp,
                    if (selectedPlanDays == 30) AnixVipGold else AnixSurfaceBorder
                ),
                modifier = Modifier
                    .weight(1f)
                    .clickable { selectedPlanDays = 30 }
            ) {
                Column(modifier = Modifier.padding(14.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Text("PRO VIP", color = AnixVipGold, fontSize = 11.sp, fontWeight = FontWeight.Bold)
                        Surface(
                            color = AnixVipGold.copy(alpha = 0.2f),
                            shape = RoundedCornerShape(4.dp)
                        ) {
                            Text("BEST VALUE", color = AnixVipGold, fontSize = 9.sp, fontWeight = FontWeight.Bold, modifier = Modifier.padding(2.dp))
                        }
                    }
                    Text("₹50", color = Color.White, fontSize = 24.sp, fontWeight = FontWeight.Black)
                    Text("30 Days Full VIP", color = AnixTextSecondary, fontSize = 12.sp)
                    Spacer(modifier = Modifier.height(8.dp))
                    Text("• Zero Ads Sandbox\n• 1080p Full Bitrate\n• Abyss High-Speed", color = AnixTextSecondary, fontSize = 11.sp)
                }
            }
        }

        Spacer(modifier = Modifier.height(20.dp))

        // UPI Payee Information Card
        Card(
            shape = RoundedCornerShape(12.dp),
            colors = CardDefaults.cardColors(containerColor = AnixSurface),
            border = androidx.compose.foundation.BorderStroke(1.dp, AnixSurfaceBorder),
            modifier = Modifier.fillMaxWidth()
        ) {
            Column(modifier = Modifier.padding(14.dp)) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(Icons.Default.AccountBalanceWallet, contentDescription = null, tint = AnixCyan)
                    Spacer(modifier = Modifier.width(8.dp))
                    Text("Direct Zero-Cost UPI Details", color = Color.White, fontWeight = FontWeight.Bold, fontSize = 14.sp)
                }
                Spacer(modifier = Modifier.height(6.dp))
                Text(
                    text = "Payee UPI ID: ${UpiPaymentManager.PAYEE_UPI_ID}",
                    color = AnixVipGold,
                    fontSize = 13.sp,
                    fontWeight = FontWeight.SemiBold
                )
                Text(
                    text = "Payee Name: ${UpiPaymentManager.PAYEE_NAME}",
                    color = AnixTextSecondary,
                    fontSize = 12.sp
                )
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        // Step 1 Button: Launch Native UPI Intent
        Button(
            onClick = {
                UpiPaymentManager.launchUpiPaymentIntent(
                    context = context,
                    amount = amount,
                    planDays = selectedPlanDays,
                    onIntentLaunched = {
                        Toast.makeText(context, "Opening UPI App... Complete payment and copy 12-digit UTR.", Toast.LENGTH_LONG).show()
                    },
                    onError = { err ->
                        errorMessage = err
                    }
                )
            },
            colors = ButtonDefaults.buttonColors(containerColor = AnixPrimaryNeonCrimson),
            shape = RoundedCornerShape(12.dp),
            modifier = Modifier
                .fillMaxWidth()
                .height(52.dp)
        ) {
            Icon(Icons.Default.Payment, contentDescription = null)
            Spacer(modifier = Modifier.width(8.dp))
            Text(
                text = "PAY ₹$amount VIA UPI APP (GPAY / PHONEPE)",
                fontWeight = FontWeight.Bold,
                fontSize = 14.sp
            )
        }

        Spacer(modifier = Modifier.height(24.dp))

        // Step 2: 12-digit UTR Fallback & Instant Verification
        Text(
            text = "Step 2: Enter 12-Digit Bank UTR / Ref Number",
            color = Color.White,
            fontWeight = FontWeight.Bold,
            fontSize = 15.sp
        )
        Text(
            text = "After paying via UPI, copy the 12-digit UTR number from your payment receipt and submit below for instant verification.",
            color = AnixTextSecondary,
            fontSize = 12.sp,
            modifier = Modifier.padding(vertical = 4.dp)
        )

        OutlinedTextField(
            value = utrInput,
            onValueChange = { if (it.length <= 12) utrInput = it.filter { char -> char.isDigit() } },
            label = { Text("12-Digit UTR (e.g., 408219876543)") },
            placeholder = { Text("Enter 12 digits") },
            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
            singleLine = true,
            isError = utrInput.isNotEmpty() && utrInput.length != 12,
            colors = OutlinedTextFieldDefaults.colors(
                focusedBorderColor = AnixCyan,
                unfocusedBorderColor = AnixSurfaceBorder,
                focusedTextColor = Color.White,
                unfocusedTextColor = Color.White
            ),
            modifier = Modifier.fillMaxWidth()
        )

        errorMessage?.let {
            Text(
                text = it,
                color = AnixError,
                fontSize = 12.sp,
                modifier = Modifier.padding(top = 4.dp)
            )
        }

        successMessage?.let {
            Text(
                text = it,
                color = AnixSuccess,
                fontSize = 12.sp,
                fontWeight = FontWeight.Bold,
                modifier = Modifier.padding(top = 4.dp)
            )
        }

        Spacer(modifier = Modifier.height(14.dp))

        Button(
            onClick = {
                errorMessage = null
                successMessage = null
                if (utrInput.length != 12) {
                    errorMessage = "Please enter all 12 digits of the bank UTR."
                    return@Button
                }

                isVerifying = true
                coroutineScope.launch {
                    val result = UpiPaymentManager.verifyAndActivateSubscription(
                        firestore = firestore,
                        userId = userId,
                        userEmail = "user_$userId@anix.stream",
                        utrNumber = utrInput,
                        planDays = selectedPlanDays,
                        amount = amount
                    )

                    isVerifying = false
                    result.fold(
                        onSuccess = {
                            successMessage = "VIP Activated Successfully! Enjoy Ad-Free Streaming."
                            Toast.makeText(context, "VIP Activated!", Toast.LENGTH_SHORT).show()
                            onSubscriptionSuccess()
                        },
                        onFailure = { ex ->
                            errorMessage = ex.message ?: "Verification failed. Check UTR."
                        }
                    )
                }
            },
            enabled = !isVerifying && utrInput.length == 12,
            colors = ButtonDefaults.buttonColors(containerColor = AnixVipGold),
            shape = RoundedCornerShape(12.dp),
            modifier = Modifier
                .fillMaxWidth()
                .height(48.dp)
        ) {
            if (isVerifying) {
                CircularProgressIndicator(modifier = Modifier.size(20.dp), color = Color.Black)
                Spacer(modifier = Modifier.width(8.dp))
                Text("VERIFYING WITH FIRESTORE...", color = Color.Black, fontWeight = FontWeight.Bold)
            } else {
                Icon(Icons.Default.CheckCircle, contentDescription = null, tint = Color.Black)
                Spacer(modifier = Modifier.width(8.dp))
                Text("VERIFY & ACTIVATE VIP NOW", color = Color.Black, fontWeight = FontWeight.Bold)
            }
        }
    }
}
