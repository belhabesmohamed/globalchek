"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Shield,
  Upload,
  FileCheck,
  CheckCircle,
  Sparkles,
  Video,
  FileText,
  ArrowRight,
  ArrowLeft,
  Check,
} from "lucide-react";
import LiveVideoCapture from "@/components/live-video-capture";
import ElectronicSignature from "@/components/electronic-signature";

type Step = 1 | 2 | 3 | 4;

export default function DemoVerificationPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<Step>(1);

  // Step 1: Documents
  const [documentFront, setDocumentFront] = useState<File | null>(null);
  const [documentBack, setDocumentBack] = useState<File | null>(null);
  const [previewFront, setPreviewFront] = useState<string>("");
  const [previewBack, setPreviewBack] = useState<string>("");

  // Step 2: Video Selfie
  const [videoSelfie, setVideoSelfie] = useState<Blob | null>(null);
  const [videoPreview, setVideoPreview] = useState<string>("");

  // Step 3: Signature
  const [signature, setSignature] = useState<string>("");

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<File | null>>,
    previewSetter: React.Dispatch<React.SetStateAction<string>>
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setter(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        previewSetter(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVideoCapture = (blob: Blob) => {
    setVideoSelfie(blob);
    const url = URL.createObjectURL(blob);
    setVideoPreview(url);
    toast.success("Vidéo capturée avec succès!");
    setTimeout(() => setCurrentStep(3), 1000);
  };

  const handleSignature = (signatureDataUrl: string) => {
    setSignature(signatureDataUrl);
    toast.success("Signature enregistrée!");
    setTimeout(() => setCurrentStep(4), 500);
  };

  const handleSubmit = async () => {
    if (!documentFront || !videoSelfie || !signature) {
      toast.error("Veuillez compléter toutes les étapes");
      return;
    }

    // Simulation - pas d'envoi réel
    toast.success("✅ Démo complétée avec succès!");
    setTimeout(() => {
      toast.info("En production, les données seraient envoyées au serveur");
    }, 1000);
  };

  const canProceedToStep2 = documentFront !== null;
  const canProceedToStep3 = videoSelfie !== null;
  const canProceedToStep4 = signature !== "";

  const steps = [
    { number: 1, title: "Documents", icon: FileCheck, completed: canProceedToStep2 },
    { number: 2, title: "Vidéo", icon: Video, completed: canProceedToStep3 },
    { number: 3, title: "Signature", icon: FileText, completed: canProceedToStep4 },
    { number: 4, title: "Confirmation", icon: CheckCircle, completed: false },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-600 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Shield className="w-12 h-12 text-white" />
            <h1 className="text-3xl font-bold text-white">GlobalChek</h1>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-white">
            <h2 className="text-2xl font-bold mb-2">Vérification d'identité - MODE DÉMO</h2>
            <p className="text-white/90">
              Bienvenue Jean Dupont
            </p>
            <p className="text-white/80 text-sm mt-2">
              Hôtel Luxe - Paris, France
            </p>
            <p className="text-yellow-300 text-sm mt-2 font-semibold">
              🎯 Mode démo - Testez tout le processus de vérification
            </p>
          </div>
        </div>

        {/* Stepper */}
        <div className="bg-white rounded-xl shadow-xl p-6 mb-6">
          <div className="flex items-center justify-between mb-8">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center flex-1">
                <div className="flex flex-col items-center">
                  <button
                    onClick={() => {
                      if (step.number < currentStep || step.completed) {
                        setCurrentStep(step.number as Step);
                      }
                    }}
                    disabled={step.number > currentStep && !steps[step.number - 2]?.completed}
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all ${
                      currentStep === step.number
                        ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white scale-110"
                        : step.completed
                        ? "bg-green-500 text-white"
                        : "bg-gray-200 text-gray-500"
                    } ${
                      (step.number < currentStep || step.completed) && "cursor-pointer hover:scale-105"
                    }`}
                  >
                    {step.completed ? (
                      <Check className="w-6 h-6" />
                    ) : (
                      <step.icon className="w-6 h-6" />
                    )}
                  </button>
                  <span
                    className={`text-xs mt-2 font-medium ${
                      currentStep === step.number
                        ? "text-purple-600"
                        : step.completed
                        ? "text-green-600"
                        : "text-gray-500"
                    }`}
                  >
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-1 mx-2 rounded ${
                      step.completed ? "bg-green-500" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Step Content */}
          <div className="mt-8">
            {/* Step 1: Documents */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <div className="flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div className="text-sm text-blue-900">
                      <p className="font-medium mb-1">Étape 1: Documents d'identité</p>
                      <p className="text-blue-700">
                        Prenez des photos claires de votre <strong>Passeport</strong>.
                        Assurez-vous que toutes les informations sont lisibles.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Document Front */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Document - Recto <span className="text-red-500">*</span>
                  </label>
                  <label className="block relative cursor-pointer group">
                    {previewFront ? (
                      <div className="relative">
                        <img
                          src={previewFront}
                          alt="Preview"
                          className="w-full h-64 object-cover rounded-lg"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center rounded-lg">
                          <p className="text-white font-medium">Changer la photo</p>
                        </div>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-purple-500 hover:bg-purple-50 transition">
                        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600 font-medium mb-1">
                          Cliquez pour télécharger ou utilisez votre caméra
                        </p>
                        <p className="text-gray-500 text-sm">PNG, JPG jusqu'à 10MB</p>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      className="hidden"
                      onChange={(e) =>
                        handleFileChange(e, setDocumentFront, setPreviewFront)
                      }
                    />
                  </label>
                </div>

                {/* Document Back */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Document - Verso{" "}
                    <span className="text-gray-500 text-xs">(optionnel)</span>
                  </label>
                  <label className="block relative cursor-pointer group">
                    {previewBack ? (
                      <div className="relative">
                        <img
                          src={previewBack}
                          alt="Preview"
                          className="w-full h-64 object-cover rounded-lg"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center rounded-lg">
                          <p className="text-white font-medium">Changer la photo</p>
                        </div>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-purple-500 hover:bg-purple-50 transition">
                        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600 font-medium mb-1">
                          Cliquez pour télécharger
                        </p>
                        <p className="text-gray-500 text-sm">ou glissez-déposez</p>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      className="hidden"
                      onChange={(e) =>
                        handleFileChange(e, setDocumentBack, setPreviewBack)
                      }
                    />
                  </label>
                </div>

                <div className="flex justify-end mt-6">
                  <button
                    onClick={() => setCurrentStep(2)}
                    disabled={!canProceedToStep2}
                    className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                  >
                    Suivant
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Video Selfie */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <div className="flex items-start gap-3">
                    <Video className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div className="text-sm text-blue-900">
                      <p className="font-medium mb-1">Étape 2: Vérification biométrique</p>
                      <p className="text-blue-700">
                        Nous allons capturer une courte vidéo de votre visage pour
                        vérifier votre identité. Suivez les instructions à l'écran.
                      </p>
                    </div>
                  </div>
                </div>

                {!videoSelfie ? (
                  <LiveVideoCapture
                    onCapture={handleVideoCapture}
                    onCancel={() => setCurrentStep(1)}
                    requireMovement={true}
                  />
                ) : (
                  <div className="space-y-4">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                      <div>
                        <p className="font-medium text-green-900">
                          Vidéo capturée avec succès !
                        </p>
                        <p className="text-sm text-green-700">
                          Vous pouvez continuer vers l'étape suivante
                        </p>
                      </div>
                    </div>

                    {videoPreview && (
                      <video
                        src={videoPreview}
                        controls
                        className="w-full max-w-2xl mx-auto rounded-lg"
                      />
                    )}
                  </div>
                )}

                <div className="flex justify-between mt-6">
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="px-8 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-all flex items-center gap-2"
                  >
                    <ArrowLeft className="w-5 h-5" />
                    Retour
                  </button>
                  {videoSelfie && (
                    <button
                      onClick={() => setCurrentStep(3)}
                      className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all flex items-center gap-2"
                    >
                      Suivant
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Step 3: Signature */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <div className="flex items-start gap-3">
                    <FileText className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div className="text-sm text-blue-900">
                      <p className="font-medium mb-1">Étape 3: Signature électronique</p>
                      <p className="text-blue-700">
                        Lisez attentivement le contrat et signez électroniquement pour
                        finaliser votre vérification.
                      </p>
                    </div>
                  </div>
                </div>

                {!signature ? (
                  <ElectronicSignature
                    onSign={handleSignature}
                    onCancel={() => setCurrentStep(2)}
                  />
                ) : (
                  <div className="space-y-4">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                      <div>
                        <p className="font-medium text-green-900">
                          Signature enregistrée avec succès !
                        </p>
                        <p className="text-sm text-green-700">
                          Vous pouvez maintenant finaliser votre vérification
                        </p>
                      </div>
                    </div>

                    <div className="border-2 border-gray-200 rounded-lg p-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">
                        Votre signature :
                      </p>
                      <img
                        src={signature}
                        alt="Signature"
                        className="max-w-md mx-auto border border-gray-300 rounded"
                      />
                    </div>

                    <div className="flex justify-between mt-6">
                      <button
                        onClick={() => setCurrentStep(2)}
                        className="px-8 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-all flex items-center gap-2"
                      >
                        <ArrowLeft className="w-5 h-5" />
                        Retour
                      </button>
                      <button
                        onClick={() => setCurrentStep(4)}
                        className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all flex items-center gap-2"
                      >
                        Suivant
                        <ArrowRight className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 4: Confirmation */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Vérification complète !
                  </h3>
                  <p className="text-gray-600">
                    Veuillez vérifier que toutes les informations sont correctes avant
                    de soumettre.
                  </p>
                </div>

                {/* Summary */}
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <FileCheck className="w-5 h-5 text-purple-600" />
                      <h4 className="font-semibold text-gray-900">Documents</h4>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      {previewFront && (
                        <img
                          src={previewFront}
                          alt="Document recto"
                          className="w-full h-32 object-cover rounded"
                        />
                      )}
                      {previewBack && (
                        <img
                          src={previewBack}
                          alt="Document verso"
                          className="w-full h-32 object-cover rounded"
                        />
                      )}
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <Video className="w-5 h-5 text-purple-600" />
                      <h4 className="font-semibold text-gray-900">
                        Vidéo de vérification
                      </h4>
                    </div>
                    {videoPreview && (
                      <video
                        src={videoPreview}
                        controls
                        className="w-full max-w-md mx-auto rounded mt-4"
                      />
                    )}
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <FileText className="w-5 h-5 text-purple-600" />
                      <h4 className="font-semibold text-gray-900">Signature</h4>
                    </div>
                    {signature && (
                      <img
                        src={signature}
                        alt="Signature"
                        className="max-w-xs mx-auto border border-gray-300 rounded mt-4"
                      />
                    )}
                  </div>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-6">
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-green-600 mt-0.5" />
                    <div className="text-sm text-green-900">
                      <p className="font-medium mb-1">Sécurité et confidentialité</p>
                      <p className="text-green-700">
                        Vos données sont chiffrées avec SSL 256-bit et ne seront
                        utilisées que pour la vérification de votre identité. Elles
                        seront traitées conformément au RGPD.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between mt-6">
                  <button
                    onClick={() => setCurrentStep(3)}
                    className="px-8 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-all flex items-center gap-2"
                  >
                    <ArrowLeft className="w-5 h-5" />
                    Retour
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="px-8 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg font-semibold hover:from-green-700 hover:to-green-800 transition-all flex items-center gap-2"
                  >
                    <Check className="w-5 h-5" />
                    Soumettre ma vérification (DÉMO)
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-white/80 text-sm mt-6">
          Propulsé par <strong>GlobalChek</strong> - Vérification d'identité
          sécurisée par IA
        </p>
      </div>
    </div>
  );
}
