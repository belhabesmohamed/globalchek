# 🚀 Guide de Déploiement - GlobalChek

## 📋 Vue d'ensemble

Ce guide vous explique comment déployer GlobalChek en production pour que vos clients puissent le tester.

**Stack:**
- **Frontend:** Next.js (déployé sur Vercel)
- **Backend:** Node.js/Express (déployé sur Railway ou Render)

---

## 🎯 Option 1: Déploiement GRATUIT (Recommandé pour test)

### ✅ Prérequis
- Compte GitHub
- Compte Vercel (gratuit)
- Compte Railway ou Render (gratuit)

---

## 📦 ÉTAPE 1: Préparer le code

### 1.1 Créer un repository GitHub

```bash
cd /Users/belhabes/globalchek
git init
git add .
git commit -m "Initial commit - GlobalChek v1.0"
```

Puis créez un repo sur GitHub et poussez:
```bash
git remote add origin https://github.com/VOTRE_USERNAME/globalchek.git
git branch -M main
git push -u origin main
```

---

## 🖥️ ÉTAPE 2: Déployer le Backend

### Option A: Railway (Recommandé - Plus simple)

1. **Aller sur:** https://railway.app
2. **Connectez-vous** avec GitHub
3. **Cliquez** "New Project" → "Deploy from GitHub repo"
4. **Sélectionnez** votre repo `globalchek`
5. **Configurez** le service:
   - Root directory: `backend`
   - Build command: `npm install`
   - Start command: `npm start`

6. **Ajoutez les variables d'environnement:**
   ```
   NODE_ENV=production
   PORT=3000
   JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-here
   REFRESH_TOKEN_SECRET=your-refresh-token-secret-minimum-32-characters-here
   FRONTEND_URL=https://votre-app.vercel.app
   ```

7. **Générez des secrets sécurisés:**
   ```bash
   # Sur votre machine
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   # Copiez le résultat pour JWT_SECRET

   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   # Copiez le résultat pour REFRESH_TOKEN_SECRET
   ```

8. **Déployez!** Railway va automatiquement déployer votre backend
9. **Copiez l'URL** du backend (ex: `https://globalchek-backend.railway.app`)

---

### Option B: Render

1. **Aller sur:** https://render.com
2. **Connectez-vous** avec GitHub
3. **Cliquez** "New +" → "Web Service"
4. **Sélectionnez** votre repo `globalchek`
5. **Configurez:**
   - Name: `globalchek-backend`
   - Root Directory: `backend`
   - Environment: `Node`
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Plan: `Free`

6. **Ajoutez les variables d'environnement** (même liste qu'au-dessus)

7. **Créez** le service - Render va déployer automatiquement

8. **Copiez l'URL** (ex: `https://globalchek-backend.onrender.com`)

---

## 🌐 ÉTAPE 3: Déployer le Frontend

### Sur Vercel (Gratuit)

1. **Aller sur:** https://vercel.com
2. **Connectez-vous** avec GitHub
3. **Cliquez** "Add New" → "Project"
4. **Importez** votre repo `globalchek`
5. **Configurez:**
   - Framework Preset: `Next.js`
   - Root Directory: `frontend`
   - Build Command: `npm run build` (auto-détecté)
   - Output Directory: `.next` (auto-détecté)

6. **Ajoutez les variables d'environnement:**
   ```
   NEXT_PUBLIC_API_URL=https://VOTRE-BACKEND-URL/api/v1
   NEXT_PUBLIC_WS_URL=https://VOTRE-BACKEND-URL
   ```

   ⚠️ **Remplacez** `VOTRE-BACKEND-URL` par l'URL de Railway/Render

7. **Déployez!** Vercel va build et déployer automatiquement

8. **Votre app sera disponible à:** `https://globalchek.vercel.app`

---

## 🔄 ÉTAPE 4: Mettre à jour le Backend avec l'URL Frontend

Retournez sur Railway/Render et **mettez à jour** la variable:
```
FRONTEND_URL=https://globalchek.vercel.app
```

Sauvegardez et le backend va redémarrer.

---

## ✅ ÉTAPE 5: Tester

1. **Ouvrez** votre app: `https://globalchek.vercel.app`
2. **Créez un compte** de test
3. **Testez le flux complet:**
   - Créer une propriété
   - Créer une vérification
   - Accéder au lien invité
   - Compléter la vérification avec caméra

---

## 🎁 Donner l'accès au client

### Créez un compte admin pour le client:

1. Allez sur `https://globalchek.vercel.app/register`
2. Créez un compte avec l'email du client
3. Donnez-lui les identifiants

### Ou donnez-lui ces liens:

- **App principale:** `https://globalchek.vercel.app`
- **Documentation:** Envoyez-lui ce fichier DEPLOYMENT.md
- **Compte de démo:** Créez un compte avec quelques données de test

---

## 📊 Surveillance et Logs

### Vercel (Frontend):
- Dashboard: https://vercel.com/dashboard
- Logs en temps réel disponibles

### Railway (Backend):
- Dashboard: https://railway.app/dashboard
- Logs en temps réel disponibles
- Métriques CPU/RAM

---

## ⚠️ Limitations de la version GRATUITE

### In-Memory Database:
- **Problème:** Les données sont perdues au redémarrage
- **Solution:** Ajouter PostgreSQL (Railway offre 500MB gratuit)

### Files Storage:
- **Problème:** Pas de stockage pour les images/vidéos
- **Solution:** Ajouter Cloudinary ou AWS S3

---

## 🔧 Mises à jour automatiques

Les deux plateformes (Vercel + Railway/Render) redéploient automatiquement quand vous poussez sur GitHub:

```bash
# Faites vos modifications
git add .
git commit -m "Update: nouvelle fonctionnalité"
git push origin main

# ✅ Vercel et Railway vont automatiquement redéployer!
```

---

## 💡 Prochaines étapes pour PRODUCTION réelle

1. **Base de données PostgreSQL:**
   - Railway: Ajouter un service PostgreSQL (500MB gratuit)
   - Utiliser Prisma pour gérer la DB

2. **Stockage fichiers:**
   - Cloudinary (gratuit jusqu'à 25GB)
   - AWS S3

3. **Domaine personnalisé:**
   - Acheter un domaine (ex: globalchek.com)
   - Le configurer sur Vercel

4. **Email:**
   - SendGrid ou Mailgun pour les emails
   - Envoyer les liens de vérification par email

5. **Analytics:**
   - Google Analytics
   - PostHog (gratuit)

---

## 🆘 Besoin d'aide?

- **Vercel Docs:** https://vercel.com/docs
- **Railway Docs:** https://docs.railway.app
- **Render Docs:** https://render.com/docs

---

**Fait avec ❤️ par l'équipe GlobalChek**
