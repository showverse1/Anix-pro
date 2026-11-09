package com.anix.app.data.model

import com.google.firebase.Timestamp

enum class SubscriptionStatus {
    ACTIVE,
    EXPIRED,
    PENDING_VERIFICATION,
    REJECTED
}

data class SubscriptionTransaction(
    val txnId: String = "",
    val userId: String = "",
    val userEmail: String = "",
    val planDays: Int = 7, // 7 (₹10) or 30 (₹50)
    val amount: Int = 10,
    val transactionId: String = "", // 12-digit UTR
    val activatedAt: Timestamp? = null,
    val expiryTimestamp: Timestamp? = null,
    val status: String = SubscriptionStatus.ACTIVE.name,
    val paymentGateway: String = "UPI_NATIVE_INTENT"
)

data class CurrentUserSubscription(
    val isVip: Boolean = false,
    val planDays: Int = 0,
    val transactionId: String = "",
    val expiryTimestamp: Timestamp? = null,
    val activatedAt: Timestamp? = null,
    val tierName: String = "FREE" // FREE or VIP
)
