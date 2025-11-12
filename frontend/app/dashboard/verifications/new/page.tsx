"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { toast } from "sonner";
import {
  ArrowLeft,
  Upload,
  FileCheck,
  Camera,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

interface Property {
  id: string;
  name: string;
  city: string;
  country: string;
}

export default function NewVerificationPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [properties, setProperties] = useState<Property[]>([]);
  const [formData, setFormData] = useState({
    propertyId: "",
    guestFirstName: "",
    guestLastName: "",
    guestEmail: "",
    guestPhone: "",
    documentType: "PASSPORT",
  });
  const [documentFront, setDocumentFront] = useState<File | null>(null);
  const [documentBack, setDocumentBack] = useState<File | null>(null);
  const [selfie, setSelfie] = useState<File | null>(null);

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    try {
      const response = await api.get("/properties");
      setProperties(response.data.data || []);

      if (response.data.data?.length > 0) {
        setFormData(prev => ({ ...prev, propertyId: response.data.data[0].id }));
      }
    } catch (error) {
      toast.error("Erreur lors du chargement des propriétés");
    }
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<File | null>>
  ) => {
    if (e.target.files && e.target.files[0]) {
      setter(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.propertyId) {
      toast.error("Veuillez créer une propriété d'abord");
      router.push("/dashboard/properties");
      return;
    }

    setIsLoading(true);

    try {
      // Create verification
      const verificationResponse = await api.post("/verifications", formData);
      const verification = verificationResponse.data.data;

      toast.success("Vérification créée avec succès!");

      // Upload documents if provided
      if (documentFront || documentBack || selfie) {
        const formDataUpload = new FormData();

        if (documentFront) {
          formDataUpload.append("documentFront", documentFront);
        }
        if (documentBack) {
          formDataUpload.append("documentBack", documentBack);
        }
        if (selfie) {
          formDataUpload.append("selfie", selfie);
        }

        try {
          await api.post(
            `/verifications/${verification.id}/documents`,
            formDataUpload,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );
          toast.success("Documents téléchargés!");
        } catch (uploadError) {
          console.error("Upload error:", uploadError);
          toast.warning("Vérification créée mais erreur lors du téléchargement des documents");
        }
      }

      router.push("/dashboard/verifications");
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Erreur lors de la création"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const documentTypes = [
    { value: "PASSPORT", label: "Passeport" },
    { value: "ID_CARD", label: "Carte d'identité" },
    { value: "DRIVING_LICENSE", label: "Permis de conduire" },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/dashboard/verifications"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour aux vérifications
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">
          Nouvelle vérification d'identité
        </h1>
        <p className="text-gray-600 mt-1">
          Vérifiez l'identité d'un invité avec l'IA
        </p>
      </div>

      {properties.length === 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <FileCheck className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-yellow-900">
                Aucune propriété disponible
              </p>
              <p className="text-sm text-yellow-700 mt-1">
                Vous devez d'abord créer une propriété avant de pouvoir créer une vérification.
              </p>
              <Link
                href="/dashboard/properties"
                className="text-sm font-semibold text-yellow-900 hover:underline mt-2 inline-block"
              >
                Créer une propriété →
              </Link>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Property Selection */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Propriété</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sélectionner la propriété
            </label>
            <select
              required
              disabled={properties.length === 0}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-100"
              value={formData.propertyId}
              onChange={(e) =>
                setFormData({ ...formData, propertyId: e.target.value })
              }
            >
              {properties.map((property) => (
                <option key={property.id} value={property.id}>
                  {property.name} - {property.city}, {property.country}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Guest Information */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            Informations de l'invité
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prénom
              </label>
              <input
                type="text"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Ahmed"
                value={formData.guestFirstName}
                onChange={(e) =>
                  setFormData({ ...formData, guestFirstName: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom
              </label>
              <input
                type="text"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Benali"
                value={formData.guestLastName}
                onChange={(e) =>
                  setFormData({ ...formData, guestLastName: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="ahmed.benali@example.com"
                value={formData.guestEmail}
                onChange={(e) =>
                  setFormData({ ...formData, guestEmail: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Téléphone
              </label>
              <input
                type="tel"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="+212600000000"
                value={formData.guestPhone}
                onChange={(e) =>
                  setFormData({ ...formData, guestPhone: e.target.value })
                }
              />
            </div>
          </div>
        </div>

        {/* Document Type */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            Type de document
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {documentTypes.map((type) => (
              <label
                key={type.value}
                className={`relative flex items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition ${
                  formData.documentType === type.value
                    ? "border-primary-600 bg-primary-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <input
                  type="radio"
                  name="documentType"
                  value={type.value}
                  checked={formData.documentType === type.value}
                  onChange={(e) =>
                    setFormData({ ...formData, documentType: e.target.value })
                  }
                  className="sr-only"
                />
                <span
                  className={`font-medium ${
                    formData.documentType === type.value
                      ? "text-primary-900"
                      : "text-gray-700"
                  }`}
                >
                  {type.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Document Upload */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-lg font-bold text-gray-900">
              Documents (optionnel)
            </h2>
            <Sparkles className="w-5 h-5 text-primary-600" />
          </div>
          <p className="text-sm text-gray-600 mb-6">
            Téléchargez les documents pour une vérification automatique par IA
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Document Front */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Document (Recto)
              </label>
              <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition">
                {documentFront ? (
                  <div className="text-center">
                    <FileCheck className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 truncate px-4">
                      {documentFront.name}
                    </p>
                  </div>
                ) : (
                  <div className="text-center">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Télécharger</p>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFileChange(e, setDocumentFront)}
                />
              </label>
            </div>

            {/* Document Back */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Document (Verso)
              </label>
              <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition">
                {documentBack ? (
                  <div className="text-center">
                    <FileCheck className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 truncate px-4">
                      {documentBack.name}
                    </p>
                  </div>
                ) : (
                  <div className="text-center">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Télécharger</p>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFileChange(e, setDocumentBack)}
                />
              </label>
            </div>

            {/* Selfie */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Photo (Selfie)
              </label>
              <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition">
                {selfie ? (
                  <div className="text-center">
                    <FileCheck className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 truncate px-4">
                      {selfie.name}
                    </p>
                  </div>
                ) : (
                  <div className="text-center">
                    <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Télécharger</p>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFileChange(e, setSelfie)}
                />
              </label>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={isLoading || properties.length === 0}
            className="flex-1 px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Création..." : "Créer la vérification"}
          </button>
        </div>
      </form>
    </div>
  );
}
