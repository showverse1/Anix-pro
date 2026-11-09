import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Crown,
  CheckCircle,
  Copy,
  ExternalLink,
  ShieldCheck,
  Zap,
  Smartphone,
  QrCode,
  AlertCircle,
  Clock
} from 'lucide-react';
import confetti from 'canvas-confetti';
import QRCode from 'qrcode';
import { storageService } from '../services/storageService';

interface UpiSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  isVip: boolean;
  onVipActivated: () => void;
}

export const UpiSubscriptionModal: React.FC<UpiSubscriptionModalProps> = ({
  isOpen,
  onClose,
  isVip,
  onVipActivated,
}) => {
  const [selectedPlan, setSelectedPlan] = useState<7 | 30>(30); // 7 or 30 days
  const [utrInput, setUtrInput] = useState('');
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'intent' | 'qr'>('intent');

  const payeeUpi = 'Vimleshkumar901559-1@okaxis';
  const payeeName = 'ANIX Premium';
  const amount = selectedPlan === 7 ? 10 : 50;
  const txnRef = `ANIX_${Date.now()}`;

  // Real NPCI UPI URI Scheme with tr parameter as requested
  const upiUri = `upi://pay?pa=${payeeUpi}&pn=${encodeURIComponent(
    payeeName
  )}&am=${amount}&cu=INR&tn=${encodeURIComponent(`ANIX VIP ${selectedPlan}Days`)}&tr=${txnRef}`;

  // Generate dynamic in-app QR code whenever plan changes
  useEffect(() => {
    if (isOpen) {
      QRCode.toDataURL(upiUri, {
        width: 240,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
      })
        .then((url) => setQrDataUrl(url))
        .catch((err) => console.error('Failed to generate QR', err));
    }
  }, [upiUri, isOpen]);

  if (!isOpen) return null;

  // Launch Native UPI Intent
  const handleLaunchUpi = (appName?: string) => {
    window.location.href = upiUri;
    setStatusMessage({
      type: 'success',
      text: `Opening ${appName || 'UPI App'}... Complete ₹${amount} payment, then enter the 12-digit UTR below.`,
    });
  };

  const copyUpiToClipboard = () => {
    navigator.clipboard.writeText(payeeUpi);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  // UTR submission verification
  const handleVerifyUtr = () => {
    setStatusMessage(null);
    if (!/^[0-9]{12}$/.test(utrInput.trim())) {
      setStatusMessage({
        type: 'error',
        text: 'Invalid Bank UTR. Must be exactly 12 numeric digits (e.g. 408219876543).',
      });
      return;
    }

    setIsVerifying(true);
    setTimeout(() => {
      const res = storageService.verifyAndActivateSubscription(utrInput.trim(), selectedPlan, amount);
      setIsVerifying(false);

      if (res.success) {
        setStatusMessage({ type: 'success', text: res.message });
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#FF2A55', '#FFD700', '#00E5FF'],
        });
        onVipActivated();
        setTimeout(() => {
          onClose();
        }, 2500);
      } else {
        setStatusMessage({ type: 'error', text: res.message });
      }
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-md bg-[#0D0D15] rounded-3xl border border-[#FFD700]/30 shadow-[0_0_60px_rgba(255,215,0,0.25)] overflow-hidden flex flex-col my-auto max-h-[92vh]">
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-[#12121E] via-[#1F190F] to-[#12121E]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#FFD700]/20 border border-[#FFD700]/60 flex items-center justify-center">
              <Crown size={16} className="text-[#FFD700]" />
            </div>
            <div>
              <h3 className="font-cyber font-bold text-white text-base tracking-wide flex items-center gap-1.5">
                ANIX VIP SUBSCRIPTION
              </h3>
              <p className="text-[10px] text-slate-400 font-mono">Zero-Gateway-Cost Direct NPCI UPI Flow</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 text-slate-400 hover:text-white flex items-center justify-center transition"
          >
            <X size={16} />
          </button>
        </div>

        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          {/* Active VIP Status */}
          {isVip && (
            <div className="p-3 rounded-2xl bg-[#FFD700]/10 border border-[#FFD700]/50 flex items-center gap-3">
              <CheckCircle size={20} className="text-[#FFD700] shrink-0" />
              <div>
                <p className="font-bold text-[#FFD700]">VIP Status Active</p>
                <p className="text-slate-300 text-[11px]">
                  Zero ads on third-party embeds, 1080p stream unlock, and offline downloads enabled.
                </p>
              </div>
            </div>
          )}

          {/* Plan Selector */}
          <div>
            <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block mb-2">
              Select VIP Duration
            </label>
            <div className="grid grid-cols-2 gap-3">
              {/* ₹10 7-Day Plan */}
              <div
                onClick={() => setSelectedPlan(7)}
                className={`p-3.5 rounded-2xl border-2 cursor-pointer transition flex flex-col justify-between ${
                  selectedPlan === 7
                    ? 'bg-[#151525] border-[#FF2A55] shadow-[0_0_20px_rgba(255,42,85,0.25)]'
                    : 'bg-[#12121E] border-white/10 hover:border-white/20'
                }`}
              >
                <div>
                  <span className="text-[10px] font-mono font-bold text-[#00E5FF] uppercase">Weekly Pass</span>
                  <div className="text-2xl font-black text-white mt-1">₹10</div>
                  <p className="text-[11px] text-slate-400">7 Days Access</p>
                </div>
                <div className="text-[10px] text-slate-300 mt-2 space-y-0.5 border-t border-white/5 pt-2">
                  <p>✓ Zero-Ad Sandbox</p>
                  <p>✓ 720p HD Unlocks</p>
                  <p>✓ Offline Downloads</p>
                </div>
              </div>

              {/* ₹50 30-Day Plan (Recommended) */}
              <div
                onClick={() => setSelectedPlan(30)}
                className={`relative p-3.5 rounded-2xl border-2 cursor-pointer transition flex flex-col justify-between ${
                  selectedPlan === 30
                    ? 'bg-[#1A1810] border-[#FFD700] shadow-[0_0_25px_rgba(255,215,0,0.3)]'
                    : 'bg-[#12121E] border-white/10 hover:border-white/20'
                }`}
              >
                <span className="absolute -top-2.5 right-3 text-[9px] font-bold px-2 py-0.5 rounded-full bg-[#FFD700] text-black">
                  POPULAR
                </span>
                <div>
                  <span className="text-[10px] font-mono font-bold text-[#FFD700] uppercase">Monthly Pass</span>
                  <div className="text-2xl font-black text-white mt-1">₹50</div>
                  <p className="text-[11px] text-slate-400">30 Days Full VIP</p>
                </div>
                <div className="text-[10px] text-slate-300 mt-2 space-y-0.5 border-t border-white/5 pt-2">
                  <p>✓ 1080p FHD Bitrate</p>
                  <p>✓ Zero Ads on Abyss/Mux</p>
                  <p>✓ Unlimited Downloads</p>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Method Switcher (Direct Intent vs Dynamic In-App QR Code) */}
          <div className="flex border-b border-white/10 gap-2">
            <button
              onClick={() => setActiveTab('intent')}
              className={`pb-2 text-xs font-bold transition flex items-center gap-1.5 ${
                activeTab === 'intent'
                  ? 'text-[#FF2A55] border-b-2 border-[#FF2A55]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Smartphone size={14} />
              <span>Direct UPI Intent</span>
            </button>
            <button
              onClick={() => setActiveTab('qr')}
              className={`pb-2 text-xs font-bold transition flex items-center gap-1.5 ${
                activeTab === 'qr'
                  ? 'text-[#00E5FF] border-b-2 border-[#00E5FF]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <QrCode size={14} />
              <span>Dynamic In-App QR Code</span>
            </button>
          </div>

          {activeTab === 'intent' ? (
            /* Direct UPI Intent Flow */
            <div className="space-y-3">
              {/* Payee Info Box */}
              <div className="p-3 rounded-2xl bg-[#12121E] border border-white/10 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Payee UPI ID:</span>
                  <button
                    onClick={copyUpiToClipboard}
                    className="text-[11px] font-mono text-[#00E5FF] hover:underline flex items-center gap-1"
                  >
                    <Copy size={11} />
                    <span>{copiedUpi ? 'COPIED!' : 'Copy'}</span>
                  </button>
                </div>
                <div className="font-mono text-xs sm:text-sm font-bold text-[#FFD700] bg-black/50 p-2 rounded-xl border border-white/5 truncate">
                  {payeeUpi}
                </div>
                <p className="text-[10px] text-slate-400 flex items-center justify-between">
                  <span>Payee: {payeeName}</span>
                  <span className="text-[#00E676] font-bold">100% Zero Fees</span>
                </p>
              </div>

              {/* Primary Action Button */}
              <button
                onClick={() => handleLaunchUpi()}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#FF2A55] to-[#FF5E80] text-white font-extrabold text-xs shadow-[0_0_20px_rgba(255,42,85,0.4)] hover:brightness-110 active:scale-98 transition flex items-center justify-center gap-2"
              >
                <Smartphone size={16} />
                <span>PAY ₹{amount} VIA UPI INTENT (GPAY / PHONEPE / PAYTM)</span>
              </button>
            </div>
          ) : (
            /* Dynamic In-App QR Code Flow */
            <div className="p-4 rounded-2xl bg-[#12121E] border border-white/10 flex flex-col items-center text-center space-y-3">
              <span className="text-xs font-bold text-white">
                Scan with any UPI App (GPay / PhonePe / Paytm / BHIM)
              </span>

              {qrDataUrl ? (
                <div className="p-2.5 bg-white rounded-2xl shadow-xl">
                  <img src={qrDataUrl} alt="UPI Payment QR Code" className="w-48 h-48" />
                </div>
              ) : (
                <div className="w-48 h-48 bg-white/5 rounded-2xl flex items-center justify-center text-slate-500">
                  Generating QR...
                </div>
              )}

              <p className="text-[11px] text-slate-400 font-mono">
                Amount: <span className="text-[#FFD700] font-bold">₹{amount}</span> • Reference: {txnRef}
              </p>
            </div>
          )}

          {/* Step 2: 12-Digit UTR Fallback Verification */}
          <div className="pt-2 border-t border-white/10 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-white flex items-center gap-1.5">
                <span>Step 2: Submit 12-Digit Bank UTR</span>
              </label>
              <span className="text-[10px] text-slate-400 font-mono">Instant Verification</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-snug">
              After completing payment, enter the 12-digit UPI Ref / UTR number from your payment receipt for instant activation.
            </p>

            <div className="flex gap-2">
              <input
                type="text"
                maxLength={12}
                value={utrInput}
                onChange={(e) => setUtrInput(e.target.value.replace(/[^0-9]/g, ''))}
                placeholder="e.g. 408219876543 (12 digits)"
                className="flex-1 bg-[#12121E] text-sm text-white placeholder-slate-500 px-3 py-2 rounded-xl border border-white/10 focus:border-[#00E5FF] focus:outline-none font-mono"
              />
              <button
                onClick={handleVerifyUtr}
                disabled={isVerifying || utrInput.length !== 12}
                className="px-4 py-2 rounded-xl bg-[#FFD700] hover:bg-[#ffe135] disabled:opacity-50 text-black font-extrabold text-xs shadow-md transition flex items-center gap-1.5 shrink-0"
              >
                {isVerifying ? 'Checking...' : 'Activate VIP'}
              </button>
            </div>
          </div>

          {/* Status Alert Banner */}
          {statusMessage && (
            <div
              className={`p-3 rounded-xl text-xs flex items-start gap-2 ${
                statusMessage.type === 'success'
                  ? 'bg-emerald-950/80 border border-emerald-500/40 text-emerald-300'
                  : 'bg-red-950/80 border border-red-500/40 text-red-300'
              }`}
            >
              {statusMessage.type === 'success' ? (
                <CheckCircle size={16} className="shrink-0 mt-0.5 text-emerald-400" />
              ) : (
                <AlertCircle size={16} className="shrink-0 mt-0.5 text-red-400" />
              )}
              <span>{statusMessage.text}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
