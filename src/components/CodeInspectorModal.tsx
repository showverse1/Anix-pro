import React, { useState } from 'react';
import { X, Code, Copy, Check, Download, FileText, FolderGit2 } from 'lucide-react';

interface CodeInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDownloadProjectZip: () => void;
}

export const KOTLIN_CODE_FILES: { name: string; path: string; language: string; content: string }[] = [
  {
    name: 'MainActivity.kt',
    path: 'app/src/main/java/com/anix/app/MainActivity.kt',
    language: 'kotlin',
    content: `// MainActivity.kt - Jetpack Compose 5-Tab Material 3 Navigation
package com.anix.app

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            ANIXAppTheme {
                Scaffold(
                    bottomBar = {
                        NavigationBar {
                            // 1. Home Tab
                            NavigationBarItem(icon = { Icon(Icons.Default.Home) }, label = { Text("Home") })
                            // 2. Search Tab
                            NavigationBarItem(icon = { Icon(Icons.Default.Search) }, label = { Text("Search") })
                            // 3. Downloads Tab
                            NavigationBarItem(icon = { Icon(Icons.Default.Download) }, label = { Text("Downloads") })
                            // 4. VIP Tab
                            NavigationBarItem(icon = { Icon(Icons.Default.WorkspacePremium) }, label = { Text("VIP") })
                            // 5. Profile Tab
                            NavigationBarItem(icon = { Icon(Icons.Default.Person) }, label = { Text("Profile") })
                        }
                    }
                ) { NavHost(...) }
            }
        }
    }
}`
  },
  {
    name: 'SearchScreen.kt',
    path: 'app/src/main/java/com/anix/app/ui/screens/SearchScreen.kt',
    language: 'kotlin',
    content: `// SearchScreen.kt - Live dual-engine search & category filtering
package com.anix.app.ui.screens

@Composable
fun SearchScreen(isVip: Boolean, onMediaSelect: (MediaItem) -> Unit) {
    // Live query filter across /media collection
}`
  },
  {
    name: 'DownloadsScreen.kt',
    path: 'app/src/main/java/com/anix/app/ui/screens/DownloadsScreen.kt',
    language: 'kotlin',
    content: `// DownloadsScreen.kt - Offline storage meter & downloaded anime list
package com.anix.app.ui.screens

@Composable
fun DownloadsScreen(isVip: Boolean, onMediaSelect: (MediaItem) -> Unit, onVipUpgradeClick: () -> Unit) {
    // Offline playback with ExoPlayer cache
}`
  },
  {
    name: 'ProfileScreen.kt',
    path: 'app/src/main/java/com/anix/app/ui/screens/ProfileScreen.kt',
    language: 'kotlin',
    content: `// ProfileScreen.kt - User identity, VIP status, watch history & admin portal
package com.anix.app.ui.screens

@Composable
fun ProfileScreen(userId: String, isVip: Boolean, onVipUpgradeClick: () -> Unit, onAdminClick: () -> Unit) {
    // User profile, VIP active timer, preferences & admin launcher
}`
  },
  {
    name: 'AntiAdWebViewClient.kt',
    path: 'app/src/main/java/com/anix/app/player/AntiAdWebViewClient.kt',
    language: 'kotlin',
    content: `// AntiAdWebViewClient.kt - VIP Anti-Ad Sandbox for Third-Party Embeds
package com.anix.app.player

import android.webkit.WebResourceRequest
import android.webkit.WebView
import android.webkit.WebViewClient

class AntiAdWebViewClient(
    private val allowedHostDomain: String,
    private val isVipUser: Boolean
) : WebViewClient() {

    override fun shouldOverrideUrlLoading(view: WebView?, request: WebResourceRequest?): Boolean {
        val host = request?.url?.host ?: ""
        // Strict VIP Sandbox: Block ANY redirect that does not match the base video host domain
        if (isVipUser && !host.endsWith(allowedHostDomain)) {
            return true // Vaporize popup navigation
        }
        return false
    }

    override fun onPageFinished(view: WebView?, url: String?) {
        super.onPageFinished(view, url)
        if (isVipUser) {
            // Neutralize clickjacking layers, kill window.open & hide banner overlays
            view?.evaluateJavascript("""
                window.open = function() { return null; };
                var s = document.createElement('style');
                s.innerHTML = "iframe[src*='ad'], div[class*='ad-'], .popup, [data-ad] { display: none !important; }";
                document.head.appendChild(s);
            """.trimIndent(), null)
        }
    }
}`
  },
  {
    name: 'UpiPaymentManager.kt',
    path: 'app/src/main/java/com/anix/app/payment/UpiPaymentManager.kt',
    language: 'kotlin',
    content: `// UpiPaymentManager.kt - Zero-Cost Native Intent UPI & 12-Digit UTR Validation
package com.anix.app.payment

import android.content.Context
import android.content.Intent
import android.net.Uri

object UpiPaymentManager {
    const val PAYEE_UPI_ID = "Vimleshkumar901559-1@okaxis"
    const val PAYEE_NAME = "ANIX Premium"
    val UTR_REGEX = Regex("^[0-9]{12}$")

    fun launchUpiIntent(context: Context, amount: Int, planDays: Int) {
        val uri = Uri.parse("upi://pay?pa=$PAYEE_UPI_ID&pn=$PAYEE_NAME&am=$amount&cu=INR&tn=ANIX_VIP_\${planDays}D")
        val intent = Intent(Intent.ACTION_VIEW, uri)
        context.startActivity(Intent.createChooser(intent, "Pay via UPI"))
    }

    suspend fun verifyUtr(firestore: FirebaseFirestore, utr: String, userId: String, planDays: Int): Result<Unit> {
        if (!utr.matches(UTR_REGEX)) return Result.failure(Exception("UTR must be 12 digits"))
        // Check duplicate & record in /subscriptions/{txnId} and /users/{uid}/subscription/current
        return Result.success(Unit)
    }
}`
  },
  {
    name: 'build.yml',
    path: '.github/workflows/build.yml',
    language: 'yaml',
    content: `name: ANIX App CI/CD - Build & Release Android APK

on:
  push:
    branches: [ "main" ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-java@v4
        with:
          distribution: 'temurin'
          java-version: '17'
      - uses: android-actions/setup-android@v3
      - uses: actions/cache@v4
        with:
          path: |
            ~/.gradle/caches
            ~/.gradle/wrapper
          key: \${{ runner.os }}-gradle-\${{ hashFiles('**/*.gradle*', '**/gradle-wrapper.properties') }}
      - run: chmod +x ./android/gradlew
      - run: cd android && ./gradlew assembleDebug --stacktrace
      - uses: actions/upload-artifact@v4
        with:
          name: anix-app-debug-apk
          path: android/app/build/outputs/apk/debug/app-debug.apk`
  },
  {
    name: 'app/build.gradle.kts',
    path: 'android/app/build.gradle.kts',
    language: 'kotlin',
    content: `plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
    id("com.google.gms.google-services")
}

android {
    namespace = "com.anix.app"
    compileSdk = 34
    defaultConfig {
        applicationId = "com.anix.app"
        minSdk = 24
        targetSdk = 34
        versionCode = 1
        versionName = "1.0.0"
    }
    buildFeatures { compose = true }
}

dependencies {
    implementation(platform("androidx.compose:compose-bom:2024.02.00"))
    implementation("androidx.compose.material3:material3:1.2.0")
    implementation(platform("com.google.firebase:firebase-bom:32.7.2"))
    implementation("com.google.firebase:firebase-firestore-ktx")
    implementation("androidx.media3:media3-exoplayer:1.2.1")
    implementation("androidx.media3:media3-ui:1.2.1")
}`
  },
  {
    name: 'firestore.rules',
    path: 'firestore.rules',
    language: 'javascript',
    content: `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /media/{mediaId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid in ["ANIX_ADMIN_ROOT"];
    }
    match /subscriptions/{txnId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null && request.resource.data.transactionId.matches('^[0-9]{12}$');
    }
    match /users/{uid}/subscription/current {
      allow read, write: if request.auth != null && request.auth.uid == uid;
    }
  }
}`
  }
];

export const CodeInspectorModal: React.FC<CodeInspectorModalProps> = ({
  isOpen,
  onClose,
  onDownloadProjectZip,
}) => {
  const [selectedFileIdx, setSelectedFileIdx] = useState(0);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const activeFile = KOTLIN_CODE_FILES[selectedFileIdx];

  const handleCopy = () => {
    navigator.clipboard.writeText(activeFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#09090D] rounded-3xl border border-white/10 shadow-[0_0_60px_rgba(0,240,255,0.15)] overflow-hidden flex flex-col my-auto max-h-[92vh]">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-white/10 flex items-center justify-between bg-[#12121E]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#00F0FF]/15 border border-[#00F0FF]/40 flex items-center justify-center">
              <Code size={16} className="text-[#00F0FF]" />
            </div>
            <div>
              <h3 className="font-cyber font-bold text-white text-sm tracking-wide flex items-center gap-2">
                ANDROID STUDIO PROJECT & KOTLIN SOURCE
              </h3>
              <p className="text-[10px] text-slate-400 font-mono">
                Pure Jetpack Compose Material 3 • Media3 ExoPlayer • Anti-Ad Sandbox
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onDownloadProjectZip}
              className="px-3 py-1.5 rounded-lg bg-[#FF2A55] hover:bg-[#ff446b] text-white text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-[#FF2A55]/30"
            >
              <Download size={13} />
              <span>Export ZIP</span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 text-slate-400 hover:text-white flex items-center justify-center transition"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* File Explorer Sidebar */}
          <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-white/10 bg-[#0D0D15] p-3 overflow-y-auto shrink-0 space-y-1">
            <p className="text-[10px] uppercase font-bold text-slate-400 px-2 py-1 font-mono">
              Project Structure
            </p>
            {KOTLIN_CODE_FILES.map((file, idx) => (
              <button
                key={file.name}
                onClick={() => setSelectedFileIdx(idx)}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-mono transition flex items-center justify-between ${
                  selectedFileIdx === idx
                    ? 'bg-[#181828] text-[#00F0FF] border border-[#00F0FF]/40 font-bold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <FileText size={13} className="shrink-0 text-[#FF2A55]" />
                  <span className="truncate">{file.name}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Code Viewer */}
          <div className="flex-1 flex flex-col bg-[#07070A] overflow-hidden">
            <div className="px-4 py-2 bg-[#0E0E16] border-b border-white/5 flex items-center justify-between text-xs">
              <span className="font-mono text-[11px] text-slate-400 truncate">
                {activeFile.path}
              </span>
              <button
                onClick={handleCopy}
                className="text-[11px] font-mono px-2.5 py-1 rounded-md bg-white/5 hover:bg-white/10 text-slate-300 flex items-center gap-1.5 transition"
              >
                {copied ? (
                  <>
                    <Check size={12} className="text-[#00E676]" />
                    <span className="text-[#00E676]">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy size={12} />
                    <span>Copy Code</span>
                  </>
                )}
              </button>
            </div>

            <pre className="flex-1 p-4 overflow-auto text-xs font-mono text-slate-200 leading-relaxed bg-[#07070A] scrollbar-thin">
              <code>{activeFile.content}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
