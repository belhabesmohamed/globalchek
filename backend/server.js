require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const port = process.env.PORT || 3000;
const secretKey = process.env.JWT_SECRET || 'supersecretkey';
const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3001';

// CORS configuration for production
const corsOptions = {
  origin: process.env.NODE_ENV === 'production'
    ? [frontendUrl, 'https://*.vercel.app']
    : '*',
  credentials: true
};

app.use(bodyParser.json());
app.use(cors(corsOptions));

// In-memory database (for demo)
let users = [];
let checkins = [];
let properties = [];
let verifications = [];

// Register user with hashed password
app.post('/api/v1/auth/register', async (req, res) => {
  const { email, password, firstName, lastName } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Email et mot de passe requis." });
  }
  if (users.find(u => u.email === email)) {
    return res.status(400).json({ success: false, message: 'Utilisateur déjà existant.' });
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = {
      id: Date.now().toString(),
      email,
      firstName: firstName || 'User',
      lastName: lastName || '',
      password: hashedPassword,
      createdAt: new Date().toISOString()
    };
    users.push(user);

    const accessToken = jwt.sign({ email: user.email, id: user.id }, secretKey, { expiresIn: '2h' });
    const refreshToken = jwt.sign({ email: user.email, id: user.id }, secretKey, { expiresIn: '7d' });

    const { password: _, ...userWithoutPassword } = user;

    res.status(201).json({
      success: true,
      message: 'Inscription réussie',
      data: {
        user: userWithoutPassword,
        accessToken,
        refreshToken
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
});

// Login user and return JWT
app.post('/api/v1/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email);
  if (!user) {
    return res.status(401).json({ success: false, message: 'Identifiants invalides.' });
  }
  try {
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Identifiants invalides.' });
    }

    const accessToken = jwt.sign({ email: user.email, id: user.id }, secretKey, { expiresIn: '2h' });
    const refreshToken = jwt.sign({ email: user.email, id: user.id }, secretKey, { expiresIn: '7d' });

    const { password: _, ...userWithoutPassword } = user;

    res.status(200).json({
      success: true,
      message: 'Connexion réussie',
      data: {
        user: userWithoutPassword,
        accessToken,
        refreshToken
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
});

// Middleware to protect routes
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ success: false, message: 'Token manquant.' });
  }
  try {
    const decoded = jwt.verify(token, secretKey);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ success: false, message: 'Token invalide.' });
  }
}

// Check-in endpoint (protected)
app.post('/api/checkin', authenticateToken, (req, res) => {
  const { propertyId, timestamp } = req.body;
  const email = req.user.email;
  if (!users.find(u => u.email === email)) {
    return res.status(404).json({ success: false, message: 'Utilisateur introuvable.' });
  }
  const checkin = { email, propertyId, timestamp: timestamp || new Date().toISOString() };
  checkins.push(checkin);
  res.status(201).json({ success: true, message: 'Check-in enregistré.', data: { checkin } });
});

// List checkins for a user (protected)
app.get('/api/checkin/:email', authenticateToken, (req, res) => {
  const { email } = req.params;
  if (req.user.email !== email) {
    return res.status(403).json({ success: false, message: 'Accès refusé.' });
  }
  const userCheckins = checkins.filter(c => c.email === email);
  res.status(200).json({ success: true, data: userCheckins });
});

// ============= PROPERTIES ENDPOINTS =============

// Get all properties for the authenticated user
app.get('/api/v1/properties', authenticateToken, (req, res) => {
  const userEmail = req.user.email;
  const userProperties = properties.filter(p => p.userEmail === userEmail);
  res.status(200).json({
    success: true,
    data: userProperties
  });
});

// Create a new property
app.post('/api/v1/properties', authenticateToken, (req, res) => {
  const { name, address, city, country, propertyType, capacity, description } = req.body;
  const userEmail = req.user.email;

  if (!name || !address || !city) {
    return res.status(400).json({ success: false, message: 'Nom, adresse et ville requis.' });
  }

  const property = {
    id: Date.now().toString(),
    userEmail,
    name,
    address,
    city,
    country: country || 'Morocco',
    propertyType: propertyType || 'Apartment',
    capacity: capacity || 4,
    description: description || '',
    createdAt: new Date().toISOString()
  };

  properties.push(property);
  res.status(201).json({
    success: true,
    message: 'Propriété créée avec succès',
    data: property
  });
});

// ============= VERIFICATIONS ENDPOINTS =============

// Get all verifications for the authenticated user
app.get('/api/v1/verifications', authenticateToken, (req, res) => {
  const userEmail = req.user.email;
  // Get verifications for properties owned by this user
  const userProperties = properties.filter(p => p.userEmail === userEmail);
  const userPropertyIds = userProperties.map(p => p.id);

  const userVerifications = verifications
    .filter(v => userPropertyIds.includes(v.propertyId))
    .map(verification => {
      // Add property details to each verification
      const property = userProperties.find(p => p.id === verification.propertyId);
      return {
        ...verification,
        property: property || null
      };
    });

  res.status(200).json({
    success: true,
    data: userVerifications
  });
});

// Create a new verification
app.post('/api/v1/verifications', authenticateToken, (req, res) => {
  const { propertyId, guestFirstName, guestLastName, guestEmail, guestPhone, documentType } = req.body;
  const userEmail = req.user.email;

  if (!propertyId || !guestFirstName || !guestLastName || !guestEmail) {
    return res.status(400).json({
      success: false,
      message: 'Propriété et informations invité requises.'
    });
  }

  // Verify property belongs to user
  const property = properties.find(p => p.id === propertyId && p.userEmail === userEmail);
  if (!property) {
    return res.status(404).json({
      success: false,
      message: 'Propriété non trouvée.'
    });
  }

  const verification = {
    id: Date.now().toString(),
    propertyId,
    guestFirstName,
    guestLastName,
    guestEmail,
    guestPhone: guestPhone || '',
    documentType: documentType || 'PASSPORT',
    status: 'PENDING',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  verifications.push(verification);

  // Return verification with property details
  res.status(201).json({
    success: true,
    message: 'Vérification créée avec succès',
    data: {
      ...verification,
      property
    }
  });
});

// Upload documents for a verification
app.post('/api/v1/verifications/:id/documents', authenticateToken, (req, res) => {
  const { id } = req.params;
  const userEmail = req.user.email;

  const verification = verifications.find(v => v.id === id);
  if (!verification) {
    return res.status(404).json({
      success: false,
      message: 'Vérification non trouvée.'
    });
  }

  // Verify property belongs to user
  const property = properties.find(p => p.id === verification.propertyId && p.userEmail === userEmail);
  if (!property) {
    return res.status(403).json({
      success: false,
      message: 'Accès refusé.'
    });
  }

  // In a real app, handle file uploads here
  // For now, just update the status
  verification.status = 'PROCESSING';
  verification.updatedAt = new Date().toISOString();

  res.status(200).json({
    success: true,
    message: 'Documents téléchargés avec succès',
    data: verification
  });
});

// Get verification by ID (public - no auth required for guest access)
app.get('/api/v1/verifications/:id/public', (req, res) => {
  const { id } = req.params;

  const verification = verifications.find(v => v.id === id);
  if (!verification) {
    return res.status(404).json({
      success: false,
      message: 'Vérification non trouvée.'
    });
  }

  // Check if already completed
  if (verification.status === 'APPROVED' || verification.status === 'REJECTED') {
    return res.status(410).json({
      success: false,
      message: 'Cette vérification a déjà été complétée.'
    });
  }

  // Get property details
  const property = properties.find(p => p.id === verification.propertyId);
  if (!property) {
    return res.status(404).json({
      success: false,
      message: 'Propriété non trouvée.'
    });
  }

  res.status(200).json({
    success: true,
    data: {
      ...verification,
      property
    }
  });
});

// Submit verification with documents (public - no auth required)
app.post('/api/v1/verifications/:id/submit', (req, res) => {
  const { id } = req.params;

  const verification = verifications.find(v => v.id === id);
  if (!verification) {
    return res.status(404).json({
      success: false,
      message: 'Vérification non trouvée.'
    });
  }

  // Check if already completed
  if (verification.status === 'APPROVED' || verification.status === 'REJECTED') {
    return res.status(410).json({
      success: false,
      message: 'Cette vérification a déjà été complétée.'
    });
  }

  // In a real app, handle file uploads and AI processing here
  // For now, just update the status
  verification.status = 'PROCESSING';
  verification.updatedAt = new Date().toISOString();
  verification.submittedAt = new Date().toISOString();

  // Simulate AI processing - in real app, this would be done asynchronously
  setTimeout(() => {
    verification.status = 'APPROVED';
    verification.fraudScore = Math.floor(Math.random() * 30); // Low fraud score
    verification.updatedAt = new Date().toISOString();
  }, 2000);

  res.status(200).json({
    success: true,
    message: 'Vérification soumise avec succès! Traitement en cours...',
    data: verification
  });
});

app.listen(port, () => {
  console.log(`Serveur en fonctionnement sur le port ${port}`);
});
