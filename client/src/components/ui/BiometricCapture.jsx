import React, { useState } from "react";
import { Camera, Fingerprint, RefreshCw, CheckCircle2, User } from "lucide-react";

const BiometricCapture = ({ onChange }) => {
  const [photo, setPhoto] = useState(null);
  const [fingerprint, setFingerprint] = useState(null);
  const [scanningPhoto, setScanningPhoto] = useState(false);
  const [scanningFingerprint, setScanningFingerprint] = useState(false);

  const handleCapturePhoto = () => {
    setScanningPhoto(true);
    setTimeout(() => {
      // Set a mock face profile photo URL or representation
      const mockPhoto = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80";
      setPhoto(mockPhoto);
      setScanningPhoto(false);
      triggerChange(mockPhoto, fingerprint);
    }, 1500);
  };

  const handleScanFingerprint = () => {
    setScanningFingerprint(true);
    setTimeout(() => {
      const mockHash = `FP-${Math.floor(100000 + Math.random() * 900000)}-SHA256`;
      setFingerprint(mockHash);
      setScanningFingerprint(false);
      triggerChange(photo, mockHash);
    }, 1500);
  };

  const handleReset = () => {
    setPhoto(null);
    setFingerprint(null);
    if (onChange) onChange(null);
  };

  const triggerChange = (img, hash) => {
    if (onChange) {
      onChange({
        profilePhoto: img,
        fingerprintHash: hash
      });
    }
  };

  return (
    <div className="space-y-4 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40">
      <div className="flex justify-between items-center">
        <div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
            Biometric KYC Enrollment
          </h4>
          <p className="text-xs text-slate-500">Capture face photo and scan index fingerprint to secure identity</p>
        </div>
        {(photo || fingerprint) && (
          <button
            type="button"
            onClick={handleReset}
            className="p-1.5 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-white flex items-center gap-1"
          >
            <RefreshCw size={12} /> Reset
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Webcam Capture Card */}
        <div className="relative h-44 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-900 overflow-hidden flex flex-col items-center justify-center text-center p-4">
          {scanningPhoto ? (
            <div className="space-y-2 text-white">
              <Loader2 className="animate-spin h-6 w-6 mx-auto text-blue-400" />
              <p className="text-xs text-slate-300">Aligning face canvas...</p>
            </div>
          ) : photo ? (
            <div className="relative">
              <img src={photo} alt="Farmer snap" className="w-24 h-24 rounded-full border-2 border-green-500 object-cover" />
              <span className="absolute bottom-0 right-0 p-1 bg-green-500 text-white rounded-full">
                <CheckCircle2 size={12} />
              </span>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="p-3 bg-white/5 rounded-full text-slate-400 max-w-fit mx-auto">
                <Camera size={24} />
              </div>
              <button
                type="button"
                onClick={handleCapturePhoto}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-colors"
              >
                Scan Profile Face
              </button>
            </div>
          )}
        </div>

        {/* Fingerprint Capture Card */}
        <div className="relative h-44 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-900 overflow-hidden flex flex-col items-center justify-center text-center p-4">
          {scanningFingerprint ? (
            <div className="space-y-2 text-white">
              <div className="w-12 h-1 bg-blue-500 animate-pulse rounded-full mx-auto" />
              <Fingerprint className="animate-pulse h-8 w-8 text-blue-400 mx-auto" />
              <p className="text-xs text-slate-300">Scanning ridge structures...</p>
            </div>
          ) : fingerprint ? (
            <div className="space-y-2 text-center text-white">
              <Fingerprint className="h-10 w-10 text-green-400 mx-auto" />
              <span className="inline-flex items-center gap-1 text-[10px] text-green-300 bg-green-950/40 px-2 py-0.5 rounded-full border border-green-800/30">
                <CheckCircle2 size={10} /> Hash Secure
              </span>
              <p className="text-[10px] font-mono text-slate-400">{fingerprint.substring(0, 16)}...</p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="p-3 bg-white/5 rounded-full text-slate-400 max-w-fit mx-auto">
                <Fingerprint size={24} />
              </div>
              <button
                type="button"
                onClick={handleScanFingerprint}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-colors"
              >
                Scan Fingerprint
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

const Loader2 = ({ className }) => (
  <svg className={`animate-spin ${className}`} fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
  </svg>
);

export default BiometricCapture;
