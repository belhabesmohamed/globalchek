"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/api";
import { toast } from "sonner";
import {
  Plus,
  FileCheck,
  Search,
  Filter,
  Eye,
  Sparkles,
} from "lucide-react";

interface Property {
  id: string;
  name: string;
  city: string;
}

interface Verification {
  id: string;
  guestFirstName: string;
  guestLastName: string;
  guestEmail: string;
  guestPhone: string;
  documentType: string;
  status: string;
  fraudScore: number | null;
  createdAt: string;
  property: Property;
}

export default function VerificationsPage() {
  const [verifications, setVerifications] = useState<Verification[]>([]);
  const [filteredVerifications, setFilteredVerifications] = useState<Verification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  useEffect(() => {
    loadVerifications();
  }, []);

  useEffect(() => {
    filterVerifications();
  }, [searchTerm, statusFilter, verifications]);

  const loadVerifications = async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/verifications");
      setVerifications(response.data.data || []);
    } catch (error) {
      toast.error("Erreur lors du chargement des vérifications");
    } finally {
      setIsLoading(false);
    }
  };

  const filterVerifications = () => {
    let filtered = [...verifications];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (v) =>
          v.guestFirstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          v.guestLastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          v.guestEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
          v.property.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== "ALL") {
      filtered = filtered.filter((v) => v.status === statusFilter);
    }

    setFilteredVerifications(filtered);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      PENDING: { label: "En attente", color: "bg-yellow-100 text-yellow-800" },
      APPROVED: { label: "Approuvée", color: "bg-green-100 text-green-800" },
      REJECTED: { label: "Rejetée", color: "bg-red-100 text-red-800" },
      PROCESSING: { label: "En cours", color: "bg-blue-100 text-blue-800" },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || {
      label: status,
      color: "bg-gray-100 text-gray-800",
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const getDocumentTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      PASSPORT: "Passeport",
      ID_CARD: "Carte d'identité",
      DRIVING_LICENSE: "Permis de conduire",
    };
    return types[type] || type;
  };

  const getFraudScoreBadge = (score: number | null) => {
    if (score === null) return null;

    let color = "bg-green-100 text-green-800";
    let label = "Faible risque";

    if (score > 70) {
      color = "bg-red-100 text-red-800";
      label = "Risque élevé";
    } else if (score > 40) {
      color = "bg-yellow-100 text-yellow-800";
      label = "Risque moyen";
    }

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${color}`}>
        {label} ({score}%)
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Vérifications</h1>
          <p className="text-gray-600 mt-1">
            Gérez toutes vos vérifications d'identité
          </p>
        </div>
        <Link
          href="/dashboard/verifications/new"
          className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition"
        >
          <Plus className="w-5 h-5" />
          Nouvelle vérification
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher par nom, email ou propriété..."
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="ALL">Tous les statuts</option>
              <option value="PENDING">En attente</option>
              <option value="PROCESSING">En cours</option>
              <option value="APPROVED">Approuvée</option>
              <option value="REJECTED">Rejetée</option>
            </select>
          </div>
        </div>

        {/* Results Count */}
        <div className="mt-4 text-sm text-gray-600">
          {filteredVerifications.length} vérification(s) trouvée(s)
        </div>
      </div>

      {/* Verifications List */}
      {filteredVerifications.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <FileCheck className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Aucune vérification
          </h3>
          <p className="text-gray-600 mb-6">
            Commencez par créer votre première vérification d'identité
          </p>
          <Link
            href="/dashboard/verifications/new"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition"
          >
            <Plus className="w-5 h-5" />
            Nouvelle vérification
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Invité
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Propriété
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Document
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fraude
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredVerifications.map((verification) => (
                  <tr key={verification.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {verification.guestFirstName} {verification.guestLastName}
                      </div>
                      <div className="text-xs text-gray-500">
                        {verification.guestEmail}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {verification.property.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {verification.property.city}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-700">
                        {getDocumentTypeLabel(verification.documentType)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(verification.status)}
                    </td>
                    <td className="px-6 py-4">
                      {getFraudScoreBadge(verification.fraudScore)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(verification.createdAt).toLocaleDateString("fr-FR")}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/dashboard/verifications/${verification.id}`}
                        className="inline-flex items-center gap-1 text-primary-600 hover:text-primary-700 font-medium text-sm"
                      >
                        <Eye className="w-4 h-4" />
                        Voir
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* AI Feature Note */}
      {verifications.length > 0 && (
        <div className="mt-6 bg-gradient-to-r from-primary-50 to-purple-50 border border-primary-200 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="bg-primary-600 rounded-lg p-3">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Vérification IA disponible
              </h3>
              <p className="text-gray-700 mb-3">
                Utilisez l'intelligence artificielle pour vérifier automatiquement
                les documents, détecter les fraudes et comparer les visages.
              </p>
              <p className="text-sm text-gray-600">
                Ajoutez OPENAI_API_KEY dans votre fichier .env backend pour activer
                cette fonctionnalité.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
