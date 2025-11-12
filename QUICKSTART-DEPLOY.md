# ⚡ Déploiement Rapide - 10 minutes

## 📝 Résumé en 3 étapes:

### 1️⃣ GitHub
```bash
cd /Users/belhabes/globalchek
git init
git add .
git commit -m "Initial commit"
# Créer repo sur github.com puis:
git remote add origin https://github.com/VOTRE_USERNAME/globalchek.git
git push -u origin main
```

### 2️⃣ Backend sur Railway
1. Va sur https://railway.app
2. Login avec GitHub
3. "New Project" → Deploy from GitHub
4. Sélectionne ton repo
5. Root directory: `backend`
6. Ajoute ces variables:
   ```
   NODE_ENV=production
   JWT_SECRET=genere-un-secret-aleatoire-32-chars
   REFRESH_TOKEN_SECRET=genere-un-autre-secret-32-chars
   FRONTEND_URL=https://ton-app.vercel.app
   ```
7. Deploy! → Note l'URL

### 3️⃣ Frontend sur Vercel
1. Va sur https://vercel.com
2. Login avec GitHub
3. "New Project" → Import ton repo
4. Root directory: `frontend`
5. Ajoute ces variables:
   ```
   NEXT_PUBLIC_API_URL=https://TON-BACKEND-URL/api/v1
   NEXT_PUBLIC_WS_URL=https://TON-BACKEND-URL
   ```
6. Deploy! → C'est prêt! 🎉

## 🔗 URLs finales:
- **App:** https://ton-app.vercel.app
- **API:** https://ton-backend.railway.app

## 🎁 Donner au client:
- Email: demo@test.com
- Password: Demo123
- URL: https://ton-app.vercel.app

---

**Guide complet:** Voir [DEPLOYMENT.md](./DEPLOYMENT.md)
