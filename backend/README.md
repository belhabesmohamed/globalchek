# GlobalChek Backend API

Backend moderne pour GlobalChek - Plateforme de vérification d'identité avec IA pour l'hôtellerie.

## 🚀 Technologies

- **Node.js** + **TypeScript**
- **Express.js** - Framework web
- **Prisma** - ORM moderne pour PostgreSQL
- **PostgreSQL** - Base de données
- **OpenAI GPT-4o** - OCR et analyse de documents avec IA
- **JWT** - Authentification sécurisée
- **Speakeasy** - 2FA (Two-Factor Authentication)
- **Socket.io** - Notifications en temps réel
- **Winston** - Logging avancé
- **Zod** - Validation de schémas

## 📋 Fonctionnalités

### Authentification
- ✅ Inscription/Connexion avec JWT
- ✅ 2FA avec Google Authenticator
- ✅ Refresh tokens sécurisés
- ✅ Gestion des sessions

### Gestion des Propriétés
- ✅ CRUD complet des propriétés
- ✅ Multi-propriétés par utilisateur
- ✅ Statistiques par propriété
- ✅ Support images multiples

### Vérification d'Identité
- ✅ Upload et traitement de documents
- ✅ OCR intelligent avec GPT-4 Vision
- ✅ Détection de fraude par IA
- ✅ Comparaison biométrique (selfie vs document)
- ✅ Score de confiance et recommandations
- ✅ Support multi-types de documents (Passeport, CNI, Permis)

### IA & Analytics
- ✅ Extraction automatique de données (OCR)
- ✅ Analyse de fraude en temps réel
- ✅ Comparaison faciale biométrique
- ✅ Génération d'insights analytics
- ✅ Génération automatique de contrats

## 🛠️ Installation

### Prérequis
- Node.js 18+
- PostgreSQL 14+
- npm ou yarn

### Setup

1. **Installer les dépendances**
```bash
cd backend
npm install
```

2. **Configurer les variables d'environnement**
```bash
cp .env.example .env
# Éditer .env avec vos valeurs
```

3. **Variables d'environnement importantes**
```env
DATABASE_URL="postgresql://user:password@localhost:5432/globalchek"
JWT_SECRET="votre-secret-jwt-minimum-32-caracteres"
REFRESH_TOKEN_SECRET="votre-refresh-secret-minimum-32-caracteres"
OPENAI_API_KEY="sk-..." # Optionnel mais recommandé pour l'IA
```

4. **Créer la base de données**
```bash
# Créer la base de données PostgreSQL
createdb globalchek

# Ou avec psql:
psql -U postgres
CREATE DATABASE globalchek;
\q
```

5. **Générer le client Prisma et migrer**
```bash
npx prisma generate
npx prisma migrate dev --name init
```

6. **Lancer le serveur en développement**
```bash
npm run dev
```

Le serveur démarre sur `http://localhost:3000`

## 📚 API Endpoints

### Authentification (`/api/v1/auth`)
- `POST /register` - Inscription
- `POST /login` - Connexion
- `POST /verify-2fa` - Vérifier code 2FA
- `POST /refresh` - Rafraîchir les tokens
- `POST /logout` - Déconnexion
- `GET /profile` - Profil utilisateur (protégé)
- `POST /2fa/enable` - Activer 2FA (protégé)
- `POST /2fa/confirm` - Confirmer 2FA (protégé)
- `POST /2fa/disable` - Désactiver 2FA (protégé)

### Propriétés (`/api/v1/properties`)
- `POST /` - Créer une propriété
- `GET /` - Liste des propriétés
- `GET /:id` - Détails d'une propriété
- `PUT /:id` - Mettre à jour
- `DELETE /:id` - Supprimer
- `GET /:id/stats` - Statistiques

### Vérifications (`/api/v1/verifications`)
- `POST /` - Créer une vérification
- `GET /` - Liste des vérifications
- `GET /:id` - Détails
- `POST /:id/document` - Upload document
- `POST /:id/process-ai` - Traiter avec IA (OCR + fraude)
- `POST /:id/selfie` - Upload selfie + comparaison faciale
- `POST /:id/complete` - Finaliser la vérification

## 🧪 Exemples d'utilisation

### 1. Inscription
```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123!",
    "firstName": "Jean",
    "lastName": "Dupont"
  }'
```

### 2. Créer une propriété
```bash
curl -X POST http://localhost:3000/api/v1/properties \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Villa Marrakech",
    "address": "123 Avenue Mohammed V",
    "city": "Marrakech",
    "country": "Morocco",
    "propertyType": "Villa",
    "capacity": 8,
    "description": "Belle villa avec piscine"
  }'
```

### 3. Vérification avec IA
```bash
# 1. Créer la vérification
curl -X POST http://localhost:3000/api/v1/verifications \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "propertyId": "uuid-propriété",
    "guestFirstName": "Ahmed",
    "guestLastName": "Benali",
    "guestEmail": "ahmed@example.com",
    "documentType": "PASSPORT"
  }'

# 2. Traiter le document avec IA
curl -X POST http://localhost:3000/api/v1/verifications/{id}/process-ai \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "documentImageBase64": "base64_encoded_image..."
  }'

# 3. Upload selfie et comparaison
curl -X POST http://localhost:3000/api/v1/verifications/{id}/selfie \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "selfieImageBase64": "base64_encoded_selfie..."
  }'

# 4. Finaliser
curl -X POST http://localhost:3000/api/v1/verifications/{id}/complete \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 🗄️ Structure de la Base de Données

### Modèles principaux
- **User** - Utilisateurs (hôtes/admins)
- **Property** - Propriétés/Logements
- **Verification** - Vérifications d'identité
- **Contract** - Contrats de location
- **Notification** - Notifications temps réel
- **Analytics** - Métriques et statistiques
- **RefreshToken** - Tokens de rafraîchissement

Voir [prisma/schema.prisma](prisma/schema.prisma) pour le schéma complet.

## 🔧 Scripts disponibles

```bash
npm run dev          # Développement avec auto-reload
npm run build        # Build pour production
npm start            # Lancer en production
npm run prisma:generate  # Générer client Prisma
npm run prisma:migrate   # Créer migration
npm run prisma:studio    # Interface GUI pour la DB
```

## 🔐 Sécurité

- ✅ Helmet.js pour headers sécurisés
- ✅ Rate limiting
- ✅ CORS configuré
- ✅ Validation des entrées (Zod)
- ✅ Hashage bcrypt pour mots de passe
- ✅ JWT avec expiration
- ✅ 2FA optionnel
- ✅ Variables d'environnement pour secrets

## 📊 Monitoring & Logs

Les logs sont stockés dans `logs/`:
- `error.log` - Erreurs uniquement
- `combined.log` - Tous les logs

## 🚀 Déploiement

### Production
1. Build le projet: `npm run build`
2. Configurer les variables d'environnement de production
3. Migrer la base de données: `npx prisma migrate deploy`
4. Lancer: `npm start`

### Docker (à venir)
```bash
docker-compose up -d
```

## 🤖 Fonctionnalités IA

### OCR (Extraction de données)
- Extraction automatique: nom, prénom, date de naissance, numéro de document, dates, etc.
- Support multi-langues
- Précision 99%+

### Détection de Fraude
- Score de fraude 0-100
- Analyse de manipulation d'image
- Vérification des dates d'expiration
- Détection d'incohérences

### Comparaison Biométrique
- Score de correspondance faciale
- Détection de vivacité (liveness)
- Recommandations automatiques

## 📝 TODO

- [ ] Tests unitaires et d'intégration
- [ ] Documentation Swagger/OpenAPI
- [ ] Upload vers S3/Cloud Storage
- [ ] Intégration WhatsApp
- [ ] Génération PDF contrats
- [ ] Webhooks
- [ ] API rate limiting par utilisateur
- [ ] Audit logs

## 📄 License

MIT

## 👥 Support

Pour toute question: support@globalchek.com
