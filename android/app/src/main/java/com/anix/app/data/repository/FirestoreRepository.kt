package com.anix.app.data.repository

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
     * Real-time Kotlin Flow observing the Anime & Series catalog
     */
    fun observeMediaCatalog(): Flow<List<MediaItem>> = callbackFlow {
        val listenerRegistration = firestore.collection("media")
            .orderBy("createdAt", Query.Direction.DESCENDING)
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
     * Real-time Kotlin Flow observing user subscription state
     * /users/{uid}/subscription/current
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
     * Admin Panel: Add or Update Media Entry
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

    /**
     * Admin Panel: Delete Media Entry
     */
    suspend fun deleteMediaItem(mediaId: String): Result<Unit> {
        return try {
            firestore.collection("media").document(mediaId).delete().await()
            Result.success(Unit)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    /**
     * Admin Panel: List all subscriptions
     */
    suspend fun getAllSubscriptions(): Result<List<SubscriptionTransaction>> {
        return try {
            val snapshot = firestore.collection("subscriptions")
                .orderBy("activatedAt", Query.Direction.DESCENDING)
                .get()
                .await()
            val list = snapshot.documents.mapNotNull { it.toObject(SubscriptionTransaction::class.java) }
            Result.success(list)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}
