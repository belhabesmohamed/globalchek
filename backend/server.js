const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const port = process.env.PORT || 3000;
const secretKey = process.env.JWT_SECRET || 'supersecretkey';

app.use(bodyParser.json());
app.use(cors());

// In-memory database (for demo)
let users = [];
let checkins = [];

// Register user with hashed password
app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Nom d’utilisateur et mot de passe requis." });
  }
  if (users.find(u => u.username === username)) {
    return res.status(400).json({ message: 'Utilisateur déjà existant.' });
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    users.push({ username, password: hashedPassword });
    res.status(201).json({ message: 'Utilisateur enregistré avec succès.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
});

// Login user and return JWT
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username);
  if (!user) {
    return res.status(401).json({ message: 'Identifiants invalides.' });
  }
  try {
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Identifiants invalides.' });
    }
    const token = jwt.sign({ username }, secretKey, { expiresIn: '2h' });
    res.status(200).json({ message: 'Connexion réussie.', token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
});

// Middleware to protect routes
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Token manquant.' });
  }
  try {
    const decoded = jwt.verify(token, secretKey);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Token invalide.' });
  }
}

// Check-in endpoint (protected)
app.post('/api/checkin', authenticateToken, (req, res) => {
  const { propertyId, timestamp } = req.body;
  const username = req.user.username;
  if (!users.find(u => u.username === username)) {
    return res.status(404).json({ message: 'Utilisateur introuvable.' });
  }
  const checkin = { username, propertyId, timestamp: timestamp || new Date().toISOString() };
  checkins.push(checkin);
  res.status(201).json({ message: 'Check-in enregistré.', checkin });
});

// List checkins for a user (protected)
app.get('/api/checkin/:username', authenticateToken, (req, res) => {
  const { username } = req.params;
  if (req.user.username !== username) {
    return res.status(403).json({ message: 'Accès refusé.' });
  }
  const userCheckins = checkins.filter(c => c.username === username);
  res.status(200).json(userCheckins);
});

app.listen(port, () => {
  console.log(`Serveur en fonctionnement sur le port ${port}`);
});
