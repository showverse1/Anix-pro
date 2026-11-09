package com.anix.app.payment

import android.content.Context
import android.content.Intent
import android.net.Uri
import android.widget.Toast
import com.anix.app.data.model.CurrentUserSubscription
import com.anix.app.data.model.SubscriptionStatus
import com.anix.app.data.model.SubscriptionTransaction
import com.google.firebase.Timestamp
import com.google.firebase.firestore.FirebaseFirestore
import kotlinx.coroutines.tasks.await
import java.net.URLEncoder
import java.nio.charset.StandardCharsets
import java.util.Date
import java.util.concurrent.TimeUnit

object UpiPaymentManager {
    const val PAYEE_UPI_ID = "Vimleshkumar901559-1@okaxis"
    const val PAYEE_NAME = "ANIX Premium"
    
    val UTR_REGEX = Regex("^[0-9]{12}$")

    /**
     * Constructs the standard NPCI UPI URI string
     * e.g., upi://pay?pa=Vimleshkumar901559-1@okaxis&pn=ANIX%20Premium&am=10&cu=INR&tn=ANIX_VIP_7DAYS
     */
    fun buildUpiUri(amount: Int, planDays: Int, note: String = "ANIX_VIP"): Uri {
        val encodedPayeeName = URLEncoder.encode(PAYEE_NAME, StandardCharsets.UTF_8.name())
        val noteDescription = URLEncoder.encode("$note ${planDays}D", StandardCharsets.UTF_8.name())
        val uriString = "upi://pay?pa=$PAYEE_UPI_ID&pn=$encodedPayeeName&am=$amount&cu=INR&tn=$noteDescription"
        return Uri.parse(uriString)
    }

    /**
     * Launches the native Android Intent chooser to open installed UPI apps
     * (Google Pay, PhonePe, Paytm, CRED, BHIM, etc.)
     */
    fun launchUpiPaymentIntent(
        context: Context,
        amount: Int,
        planDays: Int,
        onIntentLaunched: () -> Unit = {},
        onError: (String) -> Unit = {}
    ) {
        val upiUri = buildUpiUri(amount, planDays)
        val upiIntent = Intent(Intent.ACTION_VIEW).apply {
            data = upiUri
        }

        try {
            val chooser = Intent.createChooser(upiIntent, "Complete VIP Subscription with UPI App")
            context.startActivity(chooser)
            onIntentLaunched()
        } catch (e: Exception) {
            val msg = "No supported UPI apps found on device. Use manual QR/UTR entry."
            Toast.makeText(context, msg, Toast.LENGTH_LONG).show()
            onError(e.localizedMessage ?: msg)
        }
    }

    /**
     * Validates 12-digit UTR regex and checks for duplicate submission in Firestore
     * before activating VIP status.
     */
    suspend fun verifyAndActivateSubscription(
        firestore: FirebaseFirestore,
        userId: String,
        userEmail: String,
        utrNumber: String,
        planDays: Int,
        amount: Int
    ): Result<CurrentUserSubscription> {
        // Step 1: Validate 12-digit regex
        val trimmedUtr = utrNumber.trim()
        if (!trimmedUtr.matches(UTR_REGEX)) {
            return Result.failure(IllegalArgumentException("Invalid UTR. Bank reference number must be exactly 12 digits."))
        }

        // Step 2: Firestore duplicate UTR check
        val existingUtr = firestore.collection("subscriptions")
            .whereEqualTo("transactionId", trimmedUtr)
            .get()
            .await()

        if (!existingUtr.isEmpty) {
            return Result.failure(IllegalStateException("This 12-digit UTR ($trimmedUtr) has already been submitted or redeemed."))
        }

        // Step 3: Calculate timestamps
        val now = Timestamp.now()
        val expiryMillis = System.currentTimeMillis() + TimeUnit.DAYS.toMillis(planDays.toLong())
        val expiryTimestamp = Timestamp(Date(expiryMillis))

        // Step 4: Record transaction in /subscriptions/{txnId}
        val txnDoc = firestore.collection("subscriptions").document(trimmedUtr)
        val transactionRecord = SubscriptionTransaction(
            txnId = trimmedUtr,
            userId = userId,
            userEmail = userEmail,
            planDays = planDays,
            amount = amount,
            transactionId = trimmedUtr,
            activatedAt = now,
            expiryTimestamp = expiryTimestamp,
            status = SubscriptionStatus.ACTIVE.name,
            paymentGateway = "UPI_NATIVE_INTENT"
        )
        txnDoc.set(transactionRecord).await()

        // Step 5: Sync directly to /users/{uid}/subscription/current for instant Kotlin Flow
        val currentSub = CurrentUserSubscription(
            isVip = true,
            planDays = planDays,
            transactionId = trimmedUtr,
            expiryTimestamp = expiryTimestamp,
            activatedAt = now,
            tierName = "VIP"
        )

        firestore.collection("users")
            .document(userId)
            .collection("subscription")
            .document("current")
            .set(currentSub)
            .await()

        return Result.success(currentSub)
    }
}
