import React, { useState, useRef, useEffect } from "react";
import { Camera, Fingerprint, RefreshCw, CheckCircle2, Loader2 } from "lucide-react";

const BiometricCapture = ({ onChange }) => {
  const [photo, setPhoto] = useState(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [starting, setStarting] = useState(false);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const stopStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  // Make sure the camera is always released, even if the user navigates
  // away or unmounts this component mid-capture.
  useEffect(() => {
    return () => stopStream();
  }, []);

  const triggerChange = (img, hash) => {
    if (onChange) {
      onChange({
        profilePhoto: img,
        fingerprintHash: hash,
      });
    }
  };

  const handleStartCamera = async () => {
    setCameraError(null);
    setStarting(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setCameraActive(true);
    } catch (err) {
      console.error("Camera access failed:", err);
      setCameraError(
        err.name === "NotAllowedError"
          ? "Camera permission was denied. Please allow camera access to capture a profile photo."
          : "Unable to access the camera on this device."
      );
    } finally {
      setStarting(false);
    }
  };

  const handleCapturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.9);

    stopStream();
    setCameraActive(false);
    setPhoto(dataUrl);
    triggerChange(dataUrl, null);
  };

  const handleRetakePhoto = () => {
    setPhoto(null);
    triggerChange(null, null);
  };

  const handleReset = () => {
    stopStream();
    setCameraActive(false);
    setCameraError(null);
    setPhoto(null);
    if (onChange) onChange(null);
  };

  return (
    <div className="space-y-4 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40">
      <div className="flex justify-between items-center">
        <div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
            Biometric KYC Enrollment
          </h4>
          <p className="text-xs text-slate-500">Capture a face photo to help verify farmer identity</p>
        </div>
        {(photo || cameraActive) && (
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
        {/* Live Camera Capture Card */}
        <div className="relative h-44 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-900 overflow-hidden flex flex-col items-center justify-center text-center p-4">
          <video
            ref={videoRef}
            className={`absolute inset-0 w-full h-full object-cover ${cameraActive ? "block" : "hidden"}`}
            muted
            playsInline
          />
          <canvas ref={canvasRef} className="hidden" />

          {cameraActive ? (
            <button
              type="button"
              onClick={handleCapturePhoto}
              className="relative z-10 mt-auto mb-2 px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-colors"
            >
              Capture Photo
            </button>
          ) : photo ? (
            <div className="relative">
              <img src={photo} alt="Farmer profile" className="w-24 h-24 rounded-full border-2 border-green-500 object-cover" />
              <span className="absolute bottom-0 right-0 p-1 bg-green-500 text-white rounded-full">
                <CheckCircle2 size={12} />
              </span>
              <button
                type="button"
                onClick={handleRetakePhoto}
                className="mt-3 block mx-auto text-[10px] text-slate-400 hover:text-slate-200 underline"
              >
                Retake
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="p-3 bg-white/5 rounded-full text-slate-400 max-w-fit mx-auto">
                <Camera size={24} />
              </div>
              <button
                type="button"
                onClick={handleStartCamera}
                disabled={starting}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-colors disabled:opacity-50"
              >
                {starting ? (
                  <span className="inline-flex items-center gap-1.5">
                    <Loader2 size={12} className="animate-spin" /> Starting camera...
                  </span>
                ) : (
                  "Enable Camera"
                )}
              </button>
              {cameraError && (
                <p className="text-[10px] text-red-400 max-w-[180px] mx-auto">{cameraError}</p>
              )}
            </div>
          )}
        </div>

        {/* Fingerprint - no generic browser API exists for hardware fingerprint
            scanners, so this is left as an explicit placeholder rather than
            fabricating a fake hash. */}
        <div className="relative h-44 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-900 overflow-hidden flex flex-col items-center justify-center text-center p-4">
          <div className="space-y-3">
            <div className="p-3 bg-white/5 rounded-full text-slate-400 max-w-fit mx-auto">
              <Fingerprint size={24} />
            </div>
            <p className="text-[10px] text-slate-400 max-w-[180px] mx-auto">
              Fingerprint scanning requires a dedicated enrollment device and isn&apos;t available
              from this browser. This step will be completed by field staff at enrollment.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BiometricCapture;
