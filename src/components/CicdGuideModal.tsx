import React, { useState } from 'react';
import { X, GitBranch, Terminal, CheckCircle2, Download, Smartphone, Play, Cpu, ShieldCheck } from 'lucide-react';

interface CicdGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CicdGuideModal: React.FC<CicdGuideModalProps> = ({ isOpen, onClose }) => {
  const [copiedWorkflow, setCopiedWorkflow] = useState(false);

  if (!isOpen) return null;

  const copyWorkflow = () => {
    navigator.clipboard.writeText(`name: ANIX App CI/CD - Build & Release Android APK

on:
  push:
    branches: [ "main", "master" ]
  workflow_dispatch:

jobs:
  build:
    name: Build Android APK
    runs-on: ubuntu-latest

    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4

      - name: Set up JDK 17
        uses: actions/setup-java@v4
        with:
          distribution: 'temurin'
          java-version: '17'

      - name: Set up Android SDK
        uses: android-actions/setup-android@v3

      - name: Cache Gradle Packages
        uses: actions/cache@v4
        with:
          path: |
            ~/.gradle/caches
            ~/.gradle/wrapper
          key: \${{ runner.os }}-gradle-\${{ hashFiles('**/*.gradle*', '**/gradle-wrapper.properties') }}

      - name: Grant Execute Permission to Gradlew
        run: chmod +x ./android/gradlew

      - name: Build Debug APK with Gradle
        run: cd android && ./gradlew assembleDebug --stacktrace

      - name: Upload Debug APK Artifact
        uses: actions/upload-artifact@v4
        with:
          name: anix-app-debug-apk
          path: android/app/build/outputs/apk/debug/app-debug.apk
          retention-days: 30`);
    setCopiedWorkflow(true);
    setTimeout(() => setCopiedWorkflow(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#0B0B13] rounded-3xl border border-[#FF2A55]/40 shadow-[0_0_60px_rgba(255,42,85,0.2)] overflow-hidden flex flex-col my-auto max-h-[92vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-[#12121E] via-[#1A121E] to-[#12121E]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#FF2A55]/20 border border-[#FF2A55]/50 flex items-center justify-center">
              <GitBranch size={16} className="text-[#FF2A55]" />
            </div>
            <div>
              <h2 className="font-cyber font-black text-white text-base tracking-wide flex items-center gap-2">
                GITHUB ACTIONS CI/CD APK PIPELINE
              </h2>
              <p className="text-[10px] text-slate-400">
                Zero Local Setup • Automated Cloud APK Compilation
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 text-slate-400 hover:text-white flex items-center justify-center transition"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs text-slate-300">
          <div className="p-3.5 rounded-2xl bg-[#12121E] border border-white/10 space-y-2">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <Cpu size={15} className="text-[#00F0FF]" />
              <span>How the Automated Cloud Build Works</span>
            </h3>
            <p className="leading-relaxed text-slate-300">
              You do not need a high-spec PC or Android Studio installed locally. We have committed the complete production workflow file at:
            </p>
            <div className="font-mono text-[11px] text-[#00F0FF] bg-black/50 p-2 rounded-lg border border-white/5 flex items-center justify-between">
              <span>.github/workflows/build.yml</span>
              <button
                onClick={copyWorkflow}
                className="text-[10px] text-slate-300 hover:text-white px-2 py-0.5 rounded bg-white/10"
              >
                {copiedWorkflow ? 'Copied!' : 'Copy Workflow'}
              </button>
            </div>
          </div>

          {/* Workflow Steps Flowchart */}
          <div className="space-y-2.5">
            <div className="p-3 rounded-2xl bg-[#12121E]/70 border border-white/5 flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-[#FF2A55]/20 text-[#FF2A55] font-bold flex items-center justify-center shrink-0 mt-0.5">
                1
              </div>
              <div>
                <p className="font-bold text-white">Push to GitHub</p>
                <p className="text-slate-400 text-[11px] mt-0.5">
                  Push your repository to GitHub on branch <code className="text-[#00F0FF]">main</code>. The workflow triggers automatically.
                </p>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-[#12121E]/70 border border-white/5 flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-[#00F0FF]/20 text-[#00F0FF] font-bold flex items-center justify-center shrink-0 mt-0.5">
                2
              </div>
              <div>
                <p className="font-bold text-white">Cloud Compilation (Ubuntu Runner + JDK 17)</p>
                <p className="text-slate-400 text-[11px] mt-0.5">
                  GitHub spins up an Ubuntu runner, installs Temurin JDK 17 & Android SDK 34, caches dependencies, and executes:
                </p>
                <div className="mt-1 font-mono text-[10px] bg-black/60 p-1.5 rounded text-emerald-400">
                  ./gradlew assembleDebug --stacktrace
                </div>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-[#12121E]/70 border border-white/5 flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-[#FFD700]/20 text-[#FFD700] font-bold flex items-center justify-center shrink-0 mt-0.5">
                3
              </div>
              <div>
                <p className="font-bold text-white">Instant Artifact Download (.apk)</p>
                <p className="text-slate-400 text-[11px] mt-0.5">
                  The workflow uploads <code className="text-[#FFD700]">anix-app-debug-apk</code> via <code className="text-slate-300">actions/upload-artifact@v4</code>.
                  Simply visit the <strong>Actions</strong> tab on your GitHub repo, click the latest run, and download the APK directly to your phone!
                </p>
              </div>
            </div>
          </div>

          {/* Device install tip */}
          <div className="p-3 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 flex items-start gap-2.5">
            <Smartphone size={18} className="shrink-0 mt-0.5 text-emerald-400" />
            <div className="text-[11px]">
              <strong className="text-white block">Installing on Android Device:</strong>
              Transfer the APK or open the GitHub link on your mobile Chrome browser. Tap &quot;Install anyway&quot; when prompted by Google Play Protect (standard for custom debug builds).
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
