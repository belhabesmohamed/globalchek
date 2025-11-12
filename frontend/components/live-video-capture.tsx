'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Camera, CheckCircle, AlertCircle, Loader2, Video, ArrowLeft, ArrowRight, SwitchCamera } from 'lucide-react'

interface LiveVideoCaptureProps {
  onCapture: (blob: Blob) => void
  onCancel?: () => void
  requireMovement?: boolean
}

type MovementStep = 'center' | 'left' | 'right' | 'completed'
type FacingMode = 'user' | 'environment'

export default function LiveVideoCapture({
  onCapture,
  onCancel,
  requireMovement = true
}: LiveVideoCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])

  const [stream, setStream] = useState<MediaStream | null>(null)
  const [isRecording, setIsRecording] = useState(false)
  const [currentStep, setCurrentStep] = useState<MovementStep>('center')
  const [error, setError] = useState<string>('')
  const [countdown, setCountdown] = useState<number | null>(null)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [facingMode, setFacingMode] = useState<FacingMode>('user')
  const [availableCameras, setAvailableCameras] = useState<MediaDeviceInfo[]>([])
  const [isLoadingCamera, setIsLoadingCamera] = useState(false)

  // Instructions pour chaque étape
  const instructions = {
    center: 'Placez votre visage au centre',
    left: 'Tournez la tête vers la gauche',
    right: 'Tournez la tête vers la droite',
    completed: 'Vérification réussie !'
  }

  // Énumérer les caméras disponibles
  useEffect(() => {
    const getCameras = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices()
        const cameras = devices.filter(device => device.kind === 'videoinput')
        setAvailableCameras(cameras)
      } catch (err) {
        console.error('Error enumerating cameras:', err)
      }
    }
    getCameras()
  }, [])

  // Démarrer la caméra
  useEffect(() => {
    const startCamera = async () => {
      setIsLoadingCamera(true)
      setError('')

      try {
        // Arrêter le stream précédent s'il existe
        if (stream) {
          stream.getTracks().forEach(track => track.stop())
        }

        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: facingMode,
            width: { ideal: 1280 },
            height: { ideal: 720 }
          },
          audio: false
        })
        setStream(mediaStream)
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream
        }
      } catch (err) {
        setError('Impossible d\'accéder à la caméra. Veuillez autoriser l\'accès.')
        console.error('Camera error:', err)
      } finally {
        setIsLoadingCamera(false)
      }
    }

    startCamera()

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop())
      }
    }
  }, [facingMode])

  // Arrêter la caméra lors du démontage
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop())
      }
    }
  }, [stream])

  // Progression automatique des étapes
  useEffect(() => {
    if (!requireMovement || !isRecording) return

    const stepDuration = 2500 // 2.5 secondes par étape

    const timer = setTimeout(() => {
      if (currentStep === 'center') {
        setCurrentStep('left')
      } else if (currentStep === 'left') {
        setCurrentStep('right')
      } else if (currentStep === 'right') {
        setCurrentStep('completed')
        // Arrêter l'enregistrement après un court délai
        setTimeout(() => {
          stopRecording()
        }, 500)
      }
    }, stepDuration)

    return () => clearTimeout(timer)
  }, [currentStep, isRecording, requireMovement])

  // Démarrer l'enregistrement
  const startRecording = useCallback(() => {
    if (!stream) {
      setError('Caméra non disponible')
      return
    }

    // Compte à rebours
    setCountdown(3)
    const countdownInterval = setInterval(() => {
      setCountdown(prev => {
        if (prev === null || prev <= 1) {
          clearInterval(countdownInterval)
          return null
        }
        return prev - 1
      })
    }, 1000)

    setTimeout(() => {
      try {
        chunksRef.current = []

        const options = { mimeType: 'video/webm;codecs=vp8,opus' }
        const mediaRecorder = new MediaRecorder(stream, options)

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            chunksRef.current.push(event.data)
          }
        }

        mediaRecorder.onstop = () => {
          const blob = new Blob(chunksRef.current, { type: 'video/webm' })
          onCapture(blob)
        }

        mediaRecorderRef.current = mediaRecorder
        mediaRecorder.start()
        setIsRecording(true)
        setCurrentStep('center')
      } catch (err) {
        setError('Erreur lors du démarrage de l\'enregistrement')
        console.error('Recording error:', err)
      }
    }, 3000)
  }, [stream, onCapture])

  // Arrêter l'enregistrement
  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      setCurrentStep('completed')
    }
  }, [isRecording])

  // Capturer une image simple (sans mouvement)
  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return

    const video = videoRef.current
    const canvas = canvasRef.current

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.drawImage(video, 0, 0)
      canvas.toBlob((blob) => {
        if (blob) {
          const imageUrl = URL.createObjectURL(blob)
          setCapturedImage(imageUrl)
          onCapture(blob)
        }
      }, 'image/jpeg', 0.95)
    }
  }, [onCapture])

  // Annuler et fermer
  const handleCancel = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
    }
    if (onCancel) onCancel()
  }

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      {/* Zone vidéo */}
      <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
        />

        {/* Canvas caché pour la capture d'image */}
        <canvas ref={canvasRef} className="hidden" />

        {/* Overlay avec guide visuel */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Guide ovale pour le visage */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-64 h-80 border-4 border-white/50 rounded-full"
                 style={{
                   borderColor: currentStep === 'completed' ? '#22c55e' : 'rgba(255,255,255,0.5)',
                   boxShadow: '0 0 0 9999px rgba(0,0,0,0.5)'
                 }}
            />
          </div>

          {/* Instructions */}
          {isRecording && (
            <div className="absolute top-8 left-1/2 transform -translate-x-1/2 text-center">
              <div className={`px-6 py-3 rounded-full font-semibold text-lg ${
                currentStep === 'completed'
                  ? 'bg-green-500 text-white'
                  : 'bg-white/90 text-gray-900'
              }`}>
                {instructions[currentStep]}
              </div>

              {/* Flèches directionnelles */}
              {currentStep === 'left' && (
                <ArrowLeft className="w-12 h-12 text-white mx-auto mt-4 animate-pulse" />
              )}
              {currentStep === 'right' && (
                <ArrowRight className="w-12 h-12 text-white mx-auto mt-4 animate-pulse" />
              )}
            </div>
          )}

          {/* Compte à rebours */}
          {countdown !== null && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <div className="text-white text-8xl font-bold animate-pulse">
                {countdown}
              </div>
            </div>
          )}

          {/* Indicateur d'enregistrement */}
          {isRecording && countdown === null && (
            <div className="absolute top-4 right-4 flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-full">
              <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
              <span className="font-semibold">REC</span>
            </div>
          )}
        </div>
      </div>

      {/* Erreur */}
      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {/* Conseils */}
      {!isRecording && !error && (
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
            <Video className="w-5 h-5" />
            Conseils pour une bonne vérification
          </h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Assurez-vous d'être dans un endroit bien éclairé</li>
            <li>• Placez votre visage au centre du cadre ovale</li>
            {requireMovement && (
              <>
                <li>• Suivez les instructions pour tourner la tête</li>
                <li>• Gardez votre visage visible pendant tout le processus</li>
              </>
            )}
            <li>• Ne portez pas de lunettes de soleil ou masque</li>
          </ul>
        </div>
      )}

      {/* Boutons d'action */}
      <div className="mt-6 flex gap-4 justify-center">
        {!isRecording && !capturedImage && (
          <>
            {requireMovement ? (
              <button
                onClick={startRecording}
                disabled={!stream || countdown !== null}
                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all"
              >
                <Video className="w-5 h-5" />
                Démarrer la vérification vidéo
              </button>
            ) : (
              <button
                onClick={capturePhoto}
                disabled={!stream}
                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all"
              >
                <Camera className="w-5 h-5" />
                Prendre la photo
              </button>
            )}

            {onCancel && (
              <button
                onClick={handleCancel}
                className="px-8 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-all"
              >
                Annuler
              </button>
            )}
          </>
        )}

        {isRecording && currentStep !== 'completed' && (
          <button
            onClick={stopRecording}
            className="px-8 py-3 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 flex items-center gap-2 transition-all"
          >
            Arrêter
          </button>
        )}

        {currentStep === 'completed' && (
          <div className="flex items-center gap-2 text-green-600 font-semibold">
            <CheckCircle className="w-6 h-6" />
            <span>Vérification terminée avec succès !</span>
          </div>
        )}
      </div>
    </div>
  )
}
