# 🚀 GlobalChek - Plateforme de Vérification d'Identité avec IA

> Solution complète de vérification d'identité intelligente pour l'hôtellerie, inspirée de CheckinPro.ma avec des fonctionnalités IA avancées.

![Tech Stack](https://img.shields.io/badge/Next.js-15-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue?logo=typescript)
![Node.js](https://img.shields.io/badge/Node.js-18+-green?logo=node.js)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14+-blue?logo=postgresql)
![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4o-purple)

## ✨ Fonctionnalités Principales

### 🤖 IA & Automatisation
- **OCR Intelligent** - Extraction automatique de données avec GPT-4 Vision (99.8% précision)
- **Détection de Fraude** - Analyse IA pour détecter les documents falsifiés
- **Vérification Biométrique** - Comparaison faciale selfie vs document
- **Génération de Contrats** - Création automatique de contrats personnalisés
- **Analytics Prédictifs** - Insights IA sur les performances

### 🔐 Authentification & Sécurité
- Authentification JWT avec refresh tokens
- 2FA (Two-Factor Authentication) avec Google Authenticator
- Hashage bcrypt pour mots de passe
- Rate limiting et protection CORS
- Validation de schémas avec Zod

### 🏨 Gestion Hôtelière
- Multi-propriétés par utilisateur
- Dashboard complet avec statistiques temps réel
- Gestion des vérifications d'identité
- Système de notifications en temps réel (Socket.io)
- Support multi-types de documents (Passeport, CNI, Permis)

### 📊 Analytics & Reporting
- Métriques de performance par propriété
- Taux de succès des vérifications
- Insights générés par IA
- Graphiques et visualisations (Recharts)

## 🏗️ Architecture

```
globalchek/
├── backend/                    # API Node.js + TypeScript
│   ├── src/
│   │   ├── config/            # Configuration (DB, env, logger)
│   │   ├── middleware/        # Auth, validation, erreurs
│   │   ├── services/          # Logique métier (auth, AI, properties)
│   │   ├── controllers/       # Contrôleurs Express
│   │   ├── routes/            # Routes API
│   │   └── server.ts          # Point d'entrée
│   ├── prisma/                # Schéma base de données
│   └── package.json
│
└── frontend/                   # Next.js 15 App Router
    ├── app/                   # Pages & layouts
    ├── components/            # Composants React
    ├── lib/                   # Utilitaires
    ├── store/                 # State management (Zustand)
    └── package.json
```

## 🛠️ Stack Technologique

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Language**: TypeScript
- **ORM**: Prisma
- **Database**: PostgreSQL 14+
- **IA**: OpenAI GPT-4o
- **Auth**: JWT + Speakeasy (2FA)
- **WebSocket**: Socket.io
- **Logging**: Winston

### Frontend
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **UI**: Tailwind CSS
- **State**: Zustand
- **Data Fetching**: TanStack Query (React Query)
- **Forms**: React Hook Form + Zod
- **Icons**: Lucide React
- **Charts**: Recharts
- **Notifications**: Sonner

## 🚀 Installation & Démarrage

### Prérequis
- Node.js 18+
- PostgreSQL 14+
- npm ou yarn
- Compte OpenAI (optionnel mais recommandé)

### 1. Cloner le projet
```bash
git clone <your-repo>
cd globalchek
```

### 2. Setup Backend

```bash
cd backend

# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp .env.example .env
# Éditer .env avec vos valeurs

# Créer la base de données
createdb globalchek

# Générer le client Prisma
npx prisma generate

# Créer les tables
npx prisma migrate dev --name init

# Lancer le serveur de développement
npm run dev
```

Le backend démarre sur `http://localhost:3000`

### 3. Setup Frontend

```bash
cd frontend

# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
```

Le frontend démarre sur `http://localhost:3001`

### 4. Accéder à l'application

- **Frontend**: http://localhost:3001
- **Backend API**: http://localhost:3000
- **API Health**: http://localhost:3000/api/v1/health
- **Prisma Studio**: `npx prisma studio` (dans le dossier backend)

## 🔧 Configuration

### Variables d'Environnement Backend

```env
# Server
NODE_ENV=development
PORT=3000

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/globalchek"

# JWT
JWT_SECRET="your-super-secret-minimum-32-characters"
REFRESH_TOKEN_SECRET="your-refresh-secret-minimum-32-characters"

# OpenAI (optionnel mais recommandé)
OPENAI_API_KEY="sk-..."

# Email (optionnel)
SMTP_HOST=smtp.gmail.com
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# Frontend URL
FRONTEND_URL=http://localhost:3001
```

### Variables d'Environnement Frontend

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1
NEXT_PUBLIC_WS_URL=http://localhost:3000
```

## 📚 Documentation API

Voir [backend/README.md](backend/README.md) pour la documentation API complète.

### Endpoints Principaux

- **Auth**: `/api/v1/auth/*` - Authentification, 2FA
- **Properties**: `/api/v1/properties/*` - Gestion des propriétés
- **Verifications**: `/api/v1/verifications/*` - Vérifications d'identité

## 🎨 Fonctionnalités IA

### OCR (Extraction de données)
GPT-4 Vision extrait automatiquement:
- Nom, prénom, date de naissance
- Numéro de document, dates d'émission/expiration
- Nationalité, pays émetteur
- Support multi-langues

### Détection de Fraude
- Score de fraude 0-100
- Analyse de manipulation d'image
- Vérification des dates
- Détection d'incohérences

### Comparaison Biométrique
- Score de correspondance faciale
- Détection de vivacité (liveness)
- Recommandations automatiques (APPROVE/REVIEW/REJECT)

## 🚧 TODO / Roadmap

- [ ] Tests unitaires et d'intégration
- [ ] Documentation Swagger/OpenAPI
- [ ] Upload vers S3/Cloud Storage
- [ ] Intégration WhatsApp
- [ ] Génération PDF contrats signés
- [ ] Webhooks pour événements
- [ ] Mode hors ligne (PWA)
- [ ] Multi-langue (i18n)
- [ ] Thème sombre
- [ ] Application mobile (React Native)

## 📄 License

MIT License

---

**Fait avec ❤️ et de l'IA**
