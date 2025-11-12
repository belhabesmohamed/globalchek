import Link from "next/link";
import { ArrowRight, Shield, Zap, TrendingUp, Globe } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <header className="bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <nav className="container mx-auto px-4 py-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-8 h-8" />
            <span className="text-2xl font-bold">GlobalChek</span>
          </div>
          <div className="flex gap-4">
            <Link
              href="/login"
              className="px-4 py-2 hover:bg-white/10 rounded-lg transition"
            >
              Connexion
            </Link>
            <Link
              href="/register"
              className="px-6 py-2 bg-white text-primary-700 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              Commencer
            </Link>
          </div>
        </nav>

        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Vérification d'Identité
            <br />
            <span className="text-primary-200">Intelligente et Rapide</span>
          </h1>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Automatisez le check-in de vos clients avec la puissance de l'IA.
            OCR intelligent, détection de fraude et vérification biométrique en 3 minutes.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 bg-white text-primary-700 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition"
          >
            Essai gratuit
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-20 container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12">
          Pourquoi GlobalChek?
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition"
            >
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gray-100 py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            {stats.map((stat) => (
              <div key={stat.label}>
                <div className="text-4xl font-bold text-primary-600 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 container mx-auto px-4 text-center">
        <h2 className="text-4xl font-bold mb-6">
          Prêt à commencer?
        </h2>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Rejoignez des centaines d'hôtes qui font confiance à GlobalChek
          pour sécuriser leurs propriétés.
        </p>
        <Link
          href="/register"
          className="inline-flex items-center gap-2 bg-primary-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-primary-700 transition"
        >
          Créer un compte gratuit
          <ArrowRight className="w-5 h-5" />
        </Link>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Shield className="w-6 h-6" />
            <span className="text-xl font-bold text-white">GlobalChek</span>
          </div>
          <p className="mb-4">
            La solution complète de vérification d'identité pour l'hôtellerie
          </p>
          <div className="text-sm">
            © 2024 GlobalChek. Tous droits réservés.
          </div>
        </div>
      </footer>
    </div>
  );
}

const features = [
  {
    icon: <Zap className="w-6 h-6 text-primary-600" />,
    title: "IA Ultra-Rapide",
    description: "OCR et vérification en moins de 3 minutes avec GPT-4 Vision",
  },
  {
    icon: <Shield className="w-6 h-6 text-primary-600" />,
    title: "Détection de Fraude",
    description: "Score de fraude intelligent et analyse biométrique avancée",
  },
  {
    icon: <TrendingUp className="w-6 h-6 text-primary-600" />,
    title: "Analytics Poussés",
    description: "Dashboard complet avec insights IA et prédictions",
  },
  {
    icon: <Globe className="w-6 h-6 text-primary-600" />,
    title: "Multi-Documents",
    description: "Passeports, CNI, permis - tous types de documents acceptés",
  },
];

const stats = [
  { value: "99.8%", label: "Précision OCR" },
  { value: "< 3min", label: "Temps de vérification" },
  { value: "24/7", label: "Disponibilité" },
];
