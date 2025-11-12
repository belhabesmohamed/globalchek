#!/usr/bin/env node

/**
 * Génère des secrets sécurisés pour JWT
 * Usage: node generate-secrets.js
 */

const crypto = require('crypto');

console.log('\n🔐 SECRETS GÉNÉRÉS POUR PRODUCTION\n');
console.log('='.repeat(60));

const jwtSecret = crypto.randomBytes(32).toString('hex');
const refreshSecret = crypto.randomBytes(32).toString('hex');

console.log('\nCopiez ces valeurs dans vos variables d\'environnement:\n');
console.log(`JWT_SECRET=${jwtSecret}`);
console.log(`REFRESH_TOKEN_SECRET=${refreshSecret}`);

console.log('\n' + '='.repeat(60));
console.log('\n✅ Secrets générés avec succès!\n');
console.log('⚠️  IMPORTANT: Gardez ces secrets en sécurité et ne les partagez jamais!\n');
