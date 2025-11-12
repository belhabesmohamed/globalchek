#!/bin/bash

# Script de test complet pour GlobalChek API
# Couleurs pour l'affichage
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

API_URL="http://localhost:3000/api/v1"
TOKEN=""
USER_ID=""
PROPERTY_ID=""
VERIFICATION_ID=""

echo -e "${BLUE}╔════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║                                                ║${NC}"
echo -e "${BLUE}║       🧪 GlobalChek API - Tests Complets       ║${NC}"
echo -e "${BLUE}║                                                ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════╝${NC}"
echo ""

# Test 1: Health Check
echo -e "${YELLOW}📊 Test 1: Health Check${NC}"
RESPONSE=$(curl -s $API_URL/health)
if echo $RESPONSE | grep -q "success.*true"; then
    echo -e "${GREEN}✅ Health check OK${NC}"
    echo $RESPONSE | jq .
else
    echo -e "${RED}❌ Health check FAILED${NC}"
    exit 1
fi
echo ""

# Test 2: Registration
echo -e "${YELLOW}📝 Test 2: Inscription d'un utilisateur${NC}"
RANDOM_EMAIL="user$(date +%s)@test.com"
RESPONSE=$(curl -s -X POST $API_URL/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$RANDOM_EMAIL\",\"password\":\"Password123\",\"firstName\":\"John\",\"lastName\":\"Doe\"}")

if echo $RESPONSE | grep -q "success.*true"; then
    echo -e "${GREEN}✅ Inscription réussie${NC}"
    TOKEN=$(echo $RESPONSE | jq -r '.data.accessToken')
    USER_ID=$(echo $RESPONSE | jq -r '.data.user.id')
    echo "Email: $RANDOM_EMAIL"
    echo "User ID: $USER_ID"
    echo "Token: ${TOKEN:0:50}..."
else
    echo -e "${RED}❌ Inscription FAILED${NC}"
    echo $RESPONSE | jq .
    exit 1
fi
echo ""

# Test 3: Login
echo -e "${YELLOW}🔐 Test 3: Connexion${NC}"
RESPONSE=$(curl -s -X POST $API_URL/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$RANDOM_EMAIL\",\"password\":\"Password123\"}")

if echo $RESPONSE | grep -q "success.*true"; then
    echo -e "${GREEN}✅ Connexion réussie${NC}"
    TOKEN=$(echo $RESPONSE | jq -r '.data.accessToken')
else
    echo -e "${RED}❌ Connexion FAILED${NC}"
    echo $RESPONSE | jq .
    exit 1
fi
echo ""

# Test 4: Get Profile
echo -e "${YELLOW}👤 Test 4: Récupération du profil${NC}"
RESPONSE=$(curl -s -X GET $API_URL/auth/profile \
  -H "Authorization: Bearer $TOKEN")

if echo $RESPONSE | grep -q "success.*true"; then
    echo -e "${GREEN}✅ Profil récupéré${NC}"
    echo $RESPONSE | jq .
else
    echo -e "${RED}❌ Récupération profil FAILED${NC}"
    echo $RESPONSE | jq .
fi
echo ""

# Test 5: Create Property
echo -e "${YELLOW}🏠 Test 5: Création d'une propriété${NC}"
RESPONSE=$(curl -s -X POST $API_URL/properties \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Villa Marrakech Test",
    "address": "123 Avenue Mohammed V",
    "city": "Marrakech",
    "country": "Morocco",
    "propertyType": "Villa",
    "capacity": 8,
    "description": "Belle villa de test avec piscine"
  }')

if echo $RESPONSE | grep -q "success.*true"; then
    echo -e "${GREEN}✅ Propriété créée${NC}"
    PROPERTY_ID=$(echo $RESPONSE | jq -r '.data.id')
    echo "Property ID: $PROPERTY_ID"
    echo $RESPONSE | jq .
else
    echo -e "${RED}❌ Création propriété FAILED${NC}"
    echo $RESPONSE | jq .
fi
echo ""

# Test 6: Get All Properties
echo -e "${YELLOW}🏘️  Test 6: Liste des propriétés${NC}"
RESPONSE=$(curl -s -X GET $API_URL/properties \
  -H "Authorization: Bearer $TOKEN")

if echo $RESPONSE | grep -q "success.*true"; then
    echo -e "${GREEN}✅ Liste récupérée${NC}"
    COUNT=$(echo $RESPONSE | jq '.data | length')
    echo "Nombre de propriétés: $COUNT"
else
    echo -e "${RED}❌ Liste propriétés FAILED${NC}"
    echo $RESPONSE | jq .
fi
echo ""

# Test 7: Get Property by ID
if [ ! -z "$PROPERTY_ID" ]; then
    echo -e "${YELLOW}🏠 Test 7: Détails de la propriété${NC}"
    RESPONSE=$(curl -s -X GET $API_URL/properties/$PROPERTY_ID \
      -H "Authorization: Bearer $TOKEN")

    if echo $RESPONSE | grep -q "success.*true"; then
        echo -e "${GREEN}✅ Détails récupérés${NC}"
        echo $RESPONSE | jq '.data | {id, name, city, capacity}'
    else
        echo -e "${RED}❌ Détails propriété FAILED${NC}"
        echo $RESPONSE | jq .
    fi
    echo ""
fi

# Test 8: Create Verification
if [ ! -z "$PROPERTY_ID" ]; then
    echo -e "${YELLOW}🔍 Test 8: Création d'une vérification${NC}"
    RESPONSE=$(curl -s -X POST $API_URL/verifications \
      -H "Authorization: Bearer $TOKEN" \
      -H "Content-Type: application/json" \
      -d "{
        \"propertyId\": \"$PROPERTY_ID\",
        \"guestFirstName\": \"Ahmed\",
        \"guestLastName\": \"Benali\",
        \"guestEmail\": \"ahmed.benali@test.com\",
        \"guestPhone\": \"+212600000000\",
        \"documentType\": \"PASSPORT\"
      }")

    if echo $RESPONSE | grep -q "success.*true"; then
        echo -e "${GREEN}✅ Vérification créée${NC}"
        VERIFICATION_ID=$(echo $RESPONSE | jq -r '.data.id')
        echo "Verification ID: $VERIFICATION_ID"
        echo $RESPONSE | jq '.data | {id, guestFirstName, guestLastName, status}'
    else
        echo -e "${RED}❌ Création vérification FAILED${NC}"
        echo $RESPONSE | jq .
    fi
    echo ""
fi

# Test 9: Get All Verifications
echo -e "${YELLOW}📋 Test 9: Liste des vérifications${NC}"
RESPONSE=$(curl -s -X GET $API_URL/verifications \
  -H "Authorization: Bearer $TOKEN")

if echo $RESPONSE | grep -q "success.*true"; then
    echo -e "${GREEN}✅ Liste récupérée${NC}"
    COUNT=$(echo $RESPONSE | jq '.data | length')
    echo "Nombre de vérifications: $COUNT"
else
    echo -e "${RED}❌ Liste vérifications FAILED${NC}"
    echo $RESPONSE | jq .
fi
echo ""

# Test 10: Get Property Stats
if [ ! -z "$PROPERTY_ID" ]; then
    echo -e "${YELLOW}📊 Test 10: Statistiques de la propriété${NC}"
    RESPONSE=$(curl -s -X GET $API_URL/properties/$PROPERTY_ID/stats \
      -H "Authorization: Bearer $TOKEN")

    if echo $RESPONSE | grep -q "success.*true"; then
        echo -e "${GREEN}✅ Statistiques récupérées${NC}"
        echo $RESPONSE | jq .
    else
        echo -e "${RED}❌ Statistiques FAILED${NC}"
        echo $RESPONSE | jq .
    fi
    echo ""
fi

# Test 11: Update Property
if [ ! -z "$PROPERTY_ID" ]; then
    echo -e "${YELLOW}✏️  Test 11: Mise à jour de la propriété${NC}"
    RESPONSE=$(curl -s -X PUT $API_URL/properties/$PROPERTY_ID \
      -H "Authorization: Bearer $TOKEN" \
      -H "Content-Type: application/json" \
      -d '{
        "description": "Villa mise à jour avec nouveau descriptif",
        "capacity": 10
      }')

    if echo $RESPONSE | grep -q "success.*true"; then
        echo -e "${GREEN}✅ Propriété mise à jour${NC}"
        echo $RESPONSE | jq '.data | {name, description, capacity}'
    else
        echo -e "${RED}❌ Mise à jour FAILED${NC}"
        echo $RESPONSE | jq .
    fi
    echo ""
fi

# Test 12: Test sans authentification (doit échouer)
echo -e "${YELLOW}🚫 Test 12: Accès sans token (doit échouer)${NC}"
RESPONSE=$(curl -s -X GET $API_URL/properties)

if echo $RESPONSE | grep -q "Token.*manquant"; then
    echo -e "${GREEN}✅ Protection authentification OK${NC}"
else
    echo -e "${RED}❌ Protection FAILED${NC}"
fi
echo $RESPONSE | jq .
echo ""

# Résumé
echo ""
echo -e "${BLUE}╔════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║                                                ║${NC}"
echo -e "${BLUE}║            ✅ Tests Terminés!                  ║${NC}"
echo -e "${BLUE}║                                                ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${GREEN}Informations de test:${NC}"
echo "Email: $RANDOM_EMAIL"
echo "Password: Password123"
echo "User ID: $USER_ID"
echo "Property ID: $PROPERTY_ID"
echo "Verification ID: $VERIFICATION_ID"
echo ""
echo -e "${YELLOW}💡 Pour tester avec l'IA (OCR, détection fraude):${NC}"
echo "1. Ajoutez OPENAI_API_KEY dans backend/.env"
echo "2. Utilisez: POST /api/v1/verifications/\$VERIFICATION_ID/process-ai"
echo ""
