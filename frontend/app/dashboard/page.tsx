"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/api";
import { toast } from "sonner";
import {
  Building2,
  FileCheck,
  CheckCircle,
  Clock,
  AlertCircle,
  Plus,
  TrendingUp,
} from "lucide-react";

interface Stats {
  properties: number;
  verifications: number;
  pending: number;
  approved: number;
  rejected: number;
}

interface Property {
  id: string;
  name: string;
  city: string;
  propertyType: string;
}

interface Verification {
  id: string;
  guestFirstName: string;
  guestLastName: string;
  status: string;
  createdAt: string;
  property: Property;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats>({
    properties: 0,
    verifications: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });
  const [recentVerifications, setRecentVerifications] = useState<Verification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);

      // Load properties
      const propertiesRes = await api.get("/properties");
      const properties = propertiesRes.data.data || [];

      // Load verifications
      const verificationsRes = await api.get("/verifications");
      const verifications = verificationsRes.data.data || [];

      // Calculate stats
      const pending = verifications.filter((v: Verification) => v.status === "PENDING").length;
      const approved = verifications.filter((v: Verification) => v.status === "APPROVED").length;
      const rejected = verifications.filter((v: Verification) => v.status === "REJECTED").length;

      setStats({
        properties: properties.length,
        verifications: verifications.length,
        pending,
        approved,
        rejected,
      });

      // Get 5 most recent verifications
      setRecentVerifications(verifications.slice(0, 5));
    } catch (error: any) {
      toast.error("Erreur lors du chargement des données");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const statCards = [
    {
      label: "Propriétés",
      value: stats.properties,
      icon: Building2,
      color: "bg-blue-500",
      href: "/dashboard/properties",
    },
    {
      label: "Vérifications",
      value: stats.verifications,
      icon: FileCheck,
      color: "bg-purple-500",
      href: "/dashboard/verifications",
    },
    {
      label: "En attente",
      value: stats.pending,
      icon: Clock,
      color: "bg-yellow-500",
    },
    {
      label: "Approuvées",
      value: stats.approved,
      icon: CheckCircle,
      color: "bg-green-500",
    },
    {
      label: "Rejetées",
      value: stats.rejected,
      icon: AlertCircle,
      color: "bg-red-500",
    },
  ];

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
          <h1 className="text-3xl font-bold text-gray-900">Tableau de bord</h1>
          <p className="text-gray-600 mt-1">Bienvenue sur votre espace GlobalChek</p>
        </div>
        <Link
          href="/dashboard/verifications/new"
          className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition"
        >
          <Plus className="w-5 h-5" />
          Nouvelle vérification
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition cursor-pointer"
              onClick={() => stat.href && (window.location.href = stat.href)}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <TrendingUp className="w-4 h-4 text-gray-400" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <div className="text-sm text-gray-600 mt-1">{stat.label}</div>
            </div>
          );
        })}
      </div>

      {/* Recent Verifications */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Vérifications récentes</h2>
        </div>

        {recentVerifications.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <FileCheck className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Aucune vérification pour le moment</p>
            <Link
              href="/dashboard/verifications/new"
              className="inline-block mt-4 text-primary-600 font-semibold hover:underline"
            >
              Créer votre première vérification
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Invité
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Propriété
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentVerifications.map((verification) => (
                  <tr key={verification.id} className="hover:bg-gray-50 cursor-pointer">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {verification.guestFirstName} {verification.guestLastName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{verification.property.name}</div>
                      <div className="text-xs text-gray-500">{verification.property.city}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(verification.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(verification.createdAt).toLocaleDateString("fr-FR")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {recentVerifications.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200">
            <Link
              href="/dashboard/verifications"
              className="text-primary-600 font-semibold hover:underline text-sm"
            >
              Voir toutes les vérifications →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
