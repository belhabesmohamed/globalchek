'use client'

import { useParams } from 'next/navigation'
import { CheckCircle, Home, Mail, Clock } from 'lucide-react'
import Link from 'next/link'

export default function VerificationSuccessPage() {
  const params = useParams()
  const verificationId = params.id as string

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-600 to-blue-600 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Success Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 text-center">
          {/* Success Icon */}
          <div className="mb-6">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle className="w-16 h-16 text-green-600" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Vérification soumise avec succès !
          </h1>

          {/* Description */}
          <p className="text-lg text-gray-600 mb-8">
            Votre demande de vérification d'identité a été envoyée et est maintenant en cours de traitement.
          </p>

          {/* Info Cards */}
          <div className="space-y-4 mb-8 text-left">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
              <Clock className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="font-semibold text-blue-900 mb-1">
                  Temps de traitement
                </h3>
                <p className="text-sm text-blue-700">
                  Votre vérification sera analysée par notre IA en quelques minutes.
                  Vous recevrez une notification par email dès que le traitement sera terminé.
                </p>
              </div>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 flex items-start gap-3">
              <Mail className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="font-semibold text-purple-900 mb-1">
                  Notification par email
                </h3>
                <p className="text-sm text-purple-700">
                  Un email de confirmation vous a été envoyé. Surveillez votre boîte de réception
                  pour connaître le résultat de votre vérification.
                </p>
              </div>
            </div>
          </div>

          {/* Reference Number */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-8">
            <p className="text-sm text-gray-600 mb-1">Numéro de référence</p>
            <p className="text-lg font-mono font-semibold text-gray-900">
              {verificationId}
            </p>
          </div>

          {/* What happens next */}
          <div className="text-left mb-8">
            <h3 className="font-bold text-gray-900 mb-3 text-lg">
              Que se passe-t-il ensuite ?
            </h3>
            <ol className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  1
                </span>
                <span className="text-gray-700">
                  Notre IA analyse vos documents et vérifie leur authenticité
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  2
                </span>
                <span className="text-gray-700">
                  La vidéo biométrique est comparée avec la photo du document
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  3
                </span>
                <span className="text-gray-700">
                  Un score de fraude est calculé et votre vérification est approuvée ou rejetée
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  4
                </span>
                <span className="text-gray-700">
                  Vous recevez un email avec le résultat détaillé
                </span>
              </li>
            </ol>
          </div>

          {/* Security Note */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8 text-left">
            <p className="text-sm text-green-900">
              <strong>Note de sécurité :</strong> Toutes vos données sont chiffrées
              et stockées de manière sécurisée. Elles seront automatiquement supprimées
              après le délai légal de conservation conformément au RGPD.
            </p>
          </div>

          {/* Action Button */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg"
          >
            <Home className="w-5 h-5" />
            Retour à l'accueil
          </Link>
        </div>

        {/* Footer */}
        <p className="text-center text-white/80 text-sm mt-6">
          Propulsé par <strong>GlobalChek</strong> - Vérification d'identité sécurisée par IA
        </p>
      </div>
    </div>
  )
}
