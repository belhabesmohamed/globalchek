'use client'

import { useState, useRef, useEffect } from 'react'
import { PenTool, RotateCcw, Check, X } from 'lucide-react'

interface ElectronicSignatureProps {
  onSign: (signatureDataUrl: string) => void
  onCancel?: () => void
  contractText?: string
}

export default function ElectronicSignature({
  onSign,
  onCancel,
  contractText
}: ElectronicSignatureProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [isEmpty, setIsEmpty] = useState(true)
  const [agreed, setAgreed] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Configuration du canvas
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * 2
    canvas.height = rect.height * 2
    ctx.scale(2, 2)

    // Style de la signature
    ctx.strokeStyle = '#1e40af'
    ctx.lineWidth = 2
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'

    // Fond blanc
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }, [])

  const getCoordinates = (
    event: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ): { x: number; y: number } => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }

    const rect = canvas.getBoundingClientRect()

    if ('touches' in event) {
      return {
        x: event.touches[0].clientX - rect.left,
        y: event.touches[0].clientY - rect.top
      }
    }

    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    }
  }

  const startDrawing = (
    event: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const { x, y } = getCoordinates(event)

    ctx.beginPath()
    ctx.moveTo(x, y)
    setIsDrawing(true)
  }

  const draw = (
    event: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    if (!isDrawing) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const { x, y } = getCoordinates(event)

    ctx.lineTo(x, y)
    ctx.stroke()
    setIsEmpty(false)
  }

  const stopDrawing = () => {
    setIsDrawing(false)
  }

  const clearSignature = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    setIsEmpty(true)
  }

  const handleSubmit = () => {
    const canvas = canvasRef.current
    if (!canvas || isEmpty || !agreed) return

    const dataUrl = canvas.toDataURL('image/png')
    onSign(dataUrl)
  }

  const defaultContractText = `
EN ACCEPTANT CE CONTRAT, JE CONFIRME :

1. Que les informations fournies sont exactes et véridiques
2. Que j'autorise la vérification de mon identité
3. Que je consens au traitement de mes données personnelles conformément au RGPD
4. Que j'ai lu et accepté les conditions générales d'utilisation
5. Que ma signature électronique a la même valeur légale qu'une signature manuscrite

Date: ${new Date().toLocaleDateString('fr-FR')}
  `.trim()

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Contrat */}
      <div className="mb-6 p-6 bg-white border border-gray-200 rounded-lg max-h-96 overflow-y-auto">
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          Contrat de Vérification d'Identité
        </h3>
        <div className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">
          {contractText || defaultContractText}
        </div>
      </div>

      {/* Case à cocher */}
      <div className="mb-6">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-1 w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <span className="text-sm text-gray-700">
            J'ai lu et j'accepte les termes du contrat ci-dessus. Je confirme que ma signature électronique engage ma responsabilité.
          </span>
        </label>
      </div>

      {/* Zone de signature */}
      <div className="mb-4">
        <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
          <PenTool className="w-4 h-4" />
          Votre signature
        </label>
        <div className="relative border-2 border-dashed border-gray-300 rounded-lg bg-white">
          <canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
            className={`w-full h-64 cursor-crosshair ${!agreed ? 'opacity-50 cursor-not-allowed' : ''}`}
            style={{ touchAction: 'none' }}
          />

          {isEmpty && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center">
                <PenTool className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-400 text-sm">
                  {agreed ? 'Signez ici avec votre doigt ou votre souris' : 'Acceptez d\'abord les termes du contrat'}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Informations légales */}
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-xs text-blue-800">
          <strong>Valeur légale :</strong> Conformément au règlement eIDAS (UE) N°910/2014 et à la loi n°53-05 au Maroc,
          cette signature électronique a la même valeur juridique qu'une signature manuscrite.
          Elle est horodatée et sécurisée par chiffrement SSL 256-bit.
        </p>
      </div>

      {/* Boutons d'action */}
      <div className="flex gap-4 justify-end">
        {onCancel && (
          <button
            onClick={onCancel}
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-all flex items-center gap-2"
          >
            <X className="w-5 h-5" />
            Annuler
          </button>
        )}

        <button
          onClick={clearSignature}
          disabled={isEmpty || !agreed}
          className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
        >
          <RotateCcw className="w-5 h-5" />
          Effacer
        </button>

        <button
          onClick={handleSubmit}
          disabled={isEmpty || !agreed}
          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
        >
          <Check className="w-5 h-5" />
          Valider la signature
        </button>
      </div>
    </div>
  )
}
