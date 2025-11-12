# 🚀 Guide de Démarrage Rapide - GlobalChek

## Démarrage en 5 minutes

### 1. Installation des dépendances

```bash
# Backend
cd backend
npm install

# Frontend (dans un autre terminal)
cd frontend
npm install
```

### 2. Configuration minimale

**Backend** - Créer `backend/.env`:
```env
NODE_ENV=development
PORT=3000
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/globalchek?schema=public"
JWT_SECRET="votre-secret-jwt-minimum-32-caracteres-securise"
REFRESH_TOKEN_SECRET="votre-refresh-secret-minimum-32-caracteres-securise"
OPENAI_API_KEY=""  # Optionnel pour tester sans IA
FRONTEND_URL=http://localhost:3001
```

**Frontend** - Créer `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1
NEXT_PUBLIC_WS_URL=http://localhost:3000
```

### 3. Base de données

```bash
# Créer la base de données PostgreSQL
createdb globalchek

# Ou avec psql:
psql -U postgres
CREATE DATABASE globalchek;
\q

# Générer Prisma Client et créer les tables
cd backend
npx prisma generate
npx prisma migrate dev --name init
```

### 4. Lancer l'application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### 5. Accéder à l'app

- **Frontend**: http://localhost:3001
- **Backend API**: http://localhost:3000
- **API Health Check**: http://localhost:3000/api/v1/health

---

## Test rapide de l'API

### 1. Créer un compte

```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Password123!",
    "firstName": "Test",
    "lastName": "User"
  }'
```

Réponse:
```json
{
  "success": true,
  "message": "Inscription réussie",
  "data": {
    "user": {
      "id": "uuid",
      "email": "test@example.com",
      "firstName": "Test",
      "lastName": "User"
    },
    "accessToken": "eyJ...",
    "refreshToken": "eyJ..."
  }
}
```

### 2. Se connecter

```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Password123!"
  }'
```

### 3. Créer une propriété

```bash
# Remplacer YOUR_TOKEN par le token reçu
curl -X POST http://localhost:3000/api/v1/properties \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Villa Test",
    "address": "123 Avenue Test",
    "city": "Marrakech",
    "propertyType": "Villa",
    "capacity": 6,
    "description": "Belle villa pour test"
  }'
```

---

## Fonctionnalités IA (optionnelles)

Pour tester les fonctionnalités IA (OCR, détection de fraude, comparaison faciale), vous devez:

1. Créer un compte sur [OpenAI Platform](https://platform.openai.com/)
2. Générer une clé API
3. L'ajouter dans `backend/.env`:

```env
OPENAI_API_KEY="sk-votre-cle-ici"
```

4. Redémarrer le backend

### Test OCR avec IA

```bash
# Créer une vérification
curl -X POST http://localhost:3000/api/v1/verifications \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "propertyId": "PROPERTY_ID",
    "guestFirstName": "Ahmed",
    "guestLastName": "Test",
    "guestEmail": "guest@test.com",
    "documentType": "PASSPORT"
  }'

# Traiter un document (remplacer BASE64_IMAGE)
curl -X POST http://localhost:3000/api/v1/verifications/VERIFICATION_ID/process-ai \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "documentImageBase64": "BASE64_IMAGE_STRING"
  }'
```

---

## Outils utiles

### Prisma Studio (GUI pour la base de données)
```bash
cd backend
npx prisma studio
```
Ouvre sur http://localhost:5555

### Voir les logs
```bash
# Backend logs
tail -f backend/logs/combined.log
tail -f backend/logs/error.log
```

---

## Troubleshooting

### Erreur de connexion PostgreSQL
```bash
# Vérifier que PostgreSQL est démarré
sudo service postgresql status   # Linux
brew services list               # macOS

# Démarrer PostgreSQL si nécessaire
sudo service postgresql start    # Linux
brew services start postgresql   # macOS
```

### Port déjà utilisé
```bash
# Changer le port dans .env
# Backend: PORT=3002
# Frontend: package.json > "dev": "next dev -p 3002"
```

### Erreur Prisma
```bash
cd backend
rm -rf node_modules prisma/migrations
npm install
npx prisma generate
npx prisma migrate dev --name init
```

---

## Prochaines étapes

1. ✅ Tester l'inscription/connexion sur le frontend
2. ✅ Créer votre première propriété
3. ✅ Tester une vérification d'identité
4. 📖 Lire la documentation complète: [README.md](README.md)
5. 🤖 Configurer OpenAI pour les fonctionnalités IA
6. 🎨 Personnaliser le design
7. 🚀 Déployer en production

---

**Besoin d'aide?** Consultez le [README.md](README.md) ou [backend/README.md](backend/README.md)
