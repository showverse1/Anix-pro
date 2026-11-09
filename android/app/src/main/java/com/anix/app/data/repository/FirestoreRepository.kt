package com.anix.app.data.repository

import com.anix.app.data.model.AppUpdateInfo
import com.anix.app.data.model.CurrentUserSubscription
import com.anix.app.data.model.MediaItem
import com.anix.app.data.model.SubscriptionTransaction
import com.google.firebase.Timestamp
import com.google.firebase.firestore.FirebaseFirestore
import com.google.firebase.firestore.Query
import kotlinx.coroutines.channels.awaitClose
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.callbackFlow
import kotlinx.coroutines.tasks.await

class FirestoreRepository(
    private val firestore: FirebaseFirestore = FirebaseFirestore.getInstance()
) {

    /**
     * Real-time Kotlin Flow observing only PUBLISHED Anime & Series catalog
     * Strictly queries status == "PUBLISHED"
     */
    fun observeMediaCatalog(): Flow<List<MediaItem>> = callbackFlow {
        val listenerRegistration = firestore.collection("media")
            .whereEqualTo("status", "PUBLISHED")
            .addSnapshotListener { snapshot, error ->
                if (error != null) {
                    close(error)
                    return@addSnapshotListener
                }
                val items = snapshot?.documents?.mapNotNull { doc ->
                    doc.toObject(MediaItem::class.java)?.copy(id = doc.id)
                } ?: emptyList()
                trySend(items)
            }
        awaitClose { listenerRegistration.remove() }
    }

    /**
     * Real-time Kotlin Flow observing remote app update broadcast (/app_updates/latest)
     */
    fun observeAppUpdate(): Flow<AppUpdateInfo?> = callbackFlow {
        val listenerRegistration = firestore.collection("app_updates")
            .document("latest")
            .addSnapshotListener { snapshot, error ->
                if (error != null) {
                    trySend(null)
                    return@addSnapshotListener
                }
                val update = snapshot?.toObject(AppUpdateInfo::class.java)
                trySend(update)
            }
        awaitClose { listenerRegistration.remove() }
    }

    /**
     * Real-time Kotlin Flow observing user subscription state
     */
    fun observeUserSubscription(userId: String): Flow<CurrentUserSubscription?> = callbackFlow {
        if (userId.isEmpty()) {
            trySend(null)
            close()
            return@callbackFlow
        }

        val listenerRegistration = firestore.collection("users")
            .document(userId)
            .collection("subscription")
            .document("current")
            .addSnapshotListener { snapshot, error ->
                if (error != null) {
                    trySend(null)
                    return@addSnapshotListener
                }
                val sub = snapshot?.toObject(CurrentUserSubscription::class.java)
                trySend(sub)
            }
        awaitClose { listenerRegistration.remove() }
    }

    /**
     * Admin: Save or update Media Item
     */
    suspend fun saveMediaItem(media: MediaItem): Result<String> {
        return try {
            val collection = firestore.collection("media")
            val docRef = if (media.id.isNotEmpty()) {
                collection.document(media.id)
            } else {
                collection.document()
            }

            val itemToSave = media.copy(
                id = docRef.id,
                updatedAt = Timestamp.now(),
                createdAt = media.createdAt ?: Timestamp.now()
            )

            docRef.set(itemToSave).await()
            Result.success(docRef.id)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}
