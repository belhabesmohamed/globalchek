"use client";

import { useState } from "react";
import { Camera, Video, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function TestCameraPage() {
  const [mode, setMode] = useState<"photo" | "video" | null>(null);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user");
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [chunks, setChunks] = useState<Blob[]>([]);
  const [capturedMedia, setCapturedMedia] = useState<string | null>(null);

  const videoRef = useState<HTMLVideoElement | null>(null)[0];
  const canvasRef = useState<HTMLCanvasElement | null>(null)[0];

  const startCamera = async () => {
    try {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }

      const newStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: mode === "video",
      });

      setStream(newStream);
      if (videoRef) {
        videoRef.srcObject = newStream;
      }
    } catch (error) {
      console.error("Erreur caméra:", error);
      alert("Impossible d'accéder à la caméra");
    }
  };

  const toggleCamera = () => {
    setFacingMode((prev) => (prev === "user" ? "environment" : "user"));
    setTimeout(() => startCamera(), 100);
  };

  const capturePhoto = () => {
    if (!videoRef || !canvasRef) return;

    const canvas = canvasRef;
    const video = videoRef;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(video, 0, 0);
      const imageUrl = canvas.toDataURL("image/jpeg");
      setCapturedMedia(imageUrl);
      stopCamera();
    }
  };

  const startRecording = () => {
    if (!stream) return;

    const recorder = new MediaRecorder(stream, {
      mimeType: "video/webm;codecs=vp8,opus",
    });

    const chunksArray: Blob[] = [];

    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunksArray.push(event.data);
      }
    };

    recorder.onstop = () => {
      const blob = new Blob(chunksArray, { type: "video/webm" });
      const url = URL.createObjectURL(blob);
      setCapturedMedia(url);
      stopCamera();
    };

    recorder.start();
    setMediaRecorder(recorder);
    setChunks(chunksArray);
    setIsRecording(true);
  };

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  const reset = () => {
    stopCamera();
    setCapturedMedia(null);
    setMode(null);
    setIsRecording(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-600 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            Test de Caméra
          </h1>
          <p className="text-white/90">
            Testez toutes les fonctionnalités de capture
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Sélection du mode */}
          {!mode && !capturedMedia && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Choisissez un mode :
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <button
                  onClick={() => {
                    setMode("photo");
                    setTimeout(startCamera, 100);
                  }}
                  className="p-8 border-2 border-gray-200 rounded-xl hover:border-purple-500 hover:bg-purple-50 transition group"
                >
                  <Camera className="w-16 h-16 text-purple-600 mx-auto mb-4 group-hover:scale-110 transition" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Capture Photo
                  </h3>
                  <p className="text-gray-600">Prenez des photos instantanées</p>
                </button>

                <button
                  onClick={() => {
                    setMode("video");
                    setTimeout(startCamera, 100);
                  }}
                  className="p-8 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition group"
                >
                  <Video className="w-16 h-16 text-blue-600 mx-auto mb-4 group-hover:scale-110 transition" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Enregistrement Vidéo
                  </h3>
                  <p className="text-gray-600">Enregistrez des vidéos</p>
                </button>
              </div>
            </div>
          )}

          {/* Vue caméra */}
          {mode && !capturedMedia && (
            <div className="space-y-6">
              <div className="relative bg-black rounded-lg overflow-hidden">
                <video
                  ref={(ref) => {
                    if (ref) {
                      (videoRef as any) = ref;
                      ref.srcObject = stream;
                    }
                  }}
                  autoPlay
                  playsInline
                  muted
                  className="w-full aspect-video object-cover"
                />

                {isRecording && (
                  <div className="absolute top-4 right-4 flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-full">
                    <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
                    <span className="font-semibold">REC</span>
                  </div>
                )}

                <canvas
                  ref={(ref) => {
                    if (ref) (canvasRef as any) = ref;
                  }}
                  className="hidden"
                />
              </div>

              {/* Informations */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-900">
                  <strong>Mode actuel :</strong> {mode === "photo" ? "Photo" : "Vidéo"}
                  <br />
                  <strong>Caméra :</strong> {facingMode === "user" ? "Avant" : "Arrière"}
                </p>
              </div>

              {/* Contrôles */}
              <div className="flex flex-wrap gap-4 justify-center">
                <button
                  onClick={toggleCamera}
                  disabled={isRecording}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  Changer Caméra
                </button>

                {mode === "photo" && (
                  <button
                    onClick={capturePhoto}
                    className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition flex items-center gap-2"
                  >
                    <Camera className="w-5 h-5" />
                    Prendre Photo
                  </button>
                )}

                {mode === "video" && !isRecording && (
                  <button
                    onClick={startRecording}
                    className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition flex items-center gap-2"
                  >
                    <Video className="w-5 h-5" />
                    Démarrer Enregistrement
                  </button>
                )}

                {mode === "video" && isRecording && (
                  <button
                    onClick={stopRecording}
                    className="px-8 py-3 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition"
                  >
                    Arrêter Enregistrement
                  </button>
                )}

                <button
                  onClick={reset}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition"
                >
                  Annuler
                </button>
              </div>
            </div>
          )}

          {/* Résultat */}
          {capturedMedia && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {mode === "photo" ? "Photo capturée" : "Vidéo enregistrée"}
              </h2>

              {mode === "photo" ? (
                <img
                  src={capturedMedia}
                  alt="Captured"
                  className="w-full rounded-lg"
                />
              ) : (
                <video
                  src={capturedMedia}
                  controls
                  className="w-full rounded-lg"
                />
              )}

              <div className="flex gap-4 justify-center">
                <button
                  onClick={reset}
                  className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition"
                >
                  Nouveau Test
                </button>

                <a
                  href={capturedMedia}
                  download={`capture-${Date.now()}.${mode === "photo" ? "jpg" : "webm"}`}
                  className="px-8 py-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition"
                >
                  Télécharger
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Lien retour */}
        <div className="text-center mt-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white hover:text-white/80 transition"
          >
            <ArrowLeft className="w-5 h-5" />
            Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
}
