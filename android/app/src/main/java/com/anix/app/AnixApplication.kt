package com.anix.app

import android.app.Application
import com.google.firebase.FirebaseApp

/**
 * ANIX Application entry point
 * Initializes Firebase SDK and sets up global application state.
 */
class AnixApplication : Application() {
    override fun onCreate() {
        super.onCreate()
        // Initialize dedicated Firebase instance
        FirebaseApp.initializeApp(this)
    }
}
