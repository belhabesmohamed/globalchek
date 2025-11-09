const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors());

// Base de données en mémoire (pour démonstration)
let users = [];
let checkins = [];

// Enregistrement utilisateur
app.post('/api/register', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Nom d’utilisateur et mot de passe requis.' });
  }
  if (users.find(u => u.username === username)) {
    return res.status(400).json({ message: 'Utilisateur déjà existant.' });
  }
  users.push({ username, password });
  res.status(201).json({ message: 'Utilisateur enregistré avec succès.' });
});

// Connexion utilisateur
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) {
    return res.status(401).json({ message: 'Identifiants invalides.' });
  }
  res.status(200).json({ message: 'Connexion réussie.' });
});

// Enregistrement de check-in
app.post('/api/checkin', (req, res) => {
  const { username, propertyId, timestamp } = req.body;
  if (!users.find(u => u.username === username)) {
    return res.status(404).json({ message: 'Utilisateur introuvable.' });
  }
  const checkin = { username, propertyId, timestamp: timestamp || new Date().toISOString() };
  checkins.push(checkin);
  res.status(201).json({ message: 'Check-in enregistré.', checkin });
});

// Liste des check-ins pour un utilisateur
app.get('/api/checkin/:username', (req, res) => {
  const { username } = req.params;
  const userCheckins = checkins.filter(c => c.username === username);
  res.status(200).json(userCheckins);
});

app.listen(port, () => {
  console.log(`Serveur en fonctionnement sur le port ${port}`);
});
