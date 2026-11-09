package com.anix.app.player

import android.app.Activity
import android.os.Build
import android.view.WindowManager

/**
 * Unlocks peak display refresh rates (90Hz / 120Hz / 144Hz) smoothly
 * on modern Android devices without SurfaceSyncGroup timeouts.
 */
object SystemDisplayHelper {
    fun unlockPeakRefreshRate(activity: Activity) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
            val display = activity.display ?: return
            val supportedModes = display.supportedModes
            // Find highest refresh rate mode (144Hz, 120Hz, or 90Hz)
            var highestMode = display.mode
            for (mode in supportedModes) {
                if (mode.refreshRate > highestMode.refreshRate) {
                    highestMode = mode
                }
            }
            val window = activity.window
            val params = window.attributes
            params.preferredDisplayModeId = highestMode.modeId
            window.attributes = params
        }
        // Keep screen on during playback
        activity.window.addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON)
    }

    fun clearScreenOn(activity: Activity) {
        activity.window.clearFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON)
    }
}
