import OpenAI from 'openai';
import { env } from '../config/env';
import { AppError } from '../middleware/errorHandler';
import logger from '../config/logger';

const openai = env.OPENAI_API_KEY ? new OpenAI({ apiKey: env.OPENAI_API_KEY }) : null;

export class AIService {
  async extractDocumentData(imageBase64: string, documentType: string) {
    if (!openai) {
      throw new AppError('OpenAI API non configurée', 500);
    }

    try {
      const prompt = `You are an expert OCR system for identity documents. Analyze this ${documentType} image and extract ALL relevant information in a structured JSON format.

Extract the following information:
- firstName: First name
- lastName: Last name
- dateOfBirth: Date of birth (ISO format)
- nationality: Nationality/Country
- documentNumber: Document/Passport number
- issuedDate: Issue date (ISO format)
- expiryDate: Expiry date (ISO format)
- gender: Gender (M/F/Other)
- placeOfBirth: Place of birth (if available)
- issuingCountry: Country that issued the document
- mrz: Machine Readable Zone text (if visible)

IMPORTANT:
- Return ONLY valid JSON, no markdown formatting
- Use null for missing fields
- Be extremely accurate with dates and numbers
- Double-check all extracted data

Return the data in this exact JSON structure:
{
  "firstName": "string or null",
  "lastName": "string or null",
  "dateOfBirth": "YYYY-MM-DD or null",
  "nationality": "string or null",
  "documentNumber": "string or null",
  "issuedDate": "YYYY-MM-DD or null",
  "expiryDate": "YYYY-MM-DD or null",
  "gender": "M/F/Other or null",
  "placeOfBirth": "string or null",
  "issuingCountry": "string or null",
  "mrz": "string or null",
  "confidence": 0-100
}`;

      const response = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: prompt },
              {
                type: 'image_url',
                image_url: {
                  url: `data:image/jpeg;base64,${imageBase64}`,
                  detail: 'high'
                },
              },
            ],
          },
        ],
        max_tokens: 1000,
        temperature: 0.1,
      });

      const content = response.choices[0].message.content;
      if (!content) {
        throw new AppError('Aucune réponse de l\'IA', 500);
      }

      // Parse JSON response
      const extractedData = JSON.parse(content);
      logger.info('Document OCR completed', { documentType, confidence: extractedData.confidence });

      return extractedData;
    } catch (error: any) {
      logger.error('OCR extraction failed:', error);
      throw new AppError(`Erreur d'extraction OCR: ${error.message}`, 500);
    }
  }

  async detectFraud(documentImageBase64: string, ocrData: any) {
    if (!openai) {
      throw new AppError('OpenAI API non configurée', 500);
    }

    try {
      const prompt = `You are a fraud detection expert analyzing identity documents.

Examine this document image and the extracted OCR data, then assess the fraud risk.

OCR Data:
${JSON.stringify(ocrData, null, 2)}

Analyze for:
1. Image tampering or digital manipulation
2. Inconsistencies between visual and OCR data
3. Document quality and authenticity markers
4. Suspicious patterns or anomalies
5. Expiry date validity
6. Font and layout consistency

Return a JSON response with:
{
  "fraudScore": 0-100 (0=legitimate, 100=definitely fraud),
  "riskLevel": "LOW/MEDIUM/HIGH/CRITICAL",
  "flags": ["array of specific concerns found"],
  "recommendation": "APPROVE/REVIEW/REJECT",
  "explanation": "brief explanation of the assessment",
  "confidence": 0-100
}`;

      const response = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: prompt },
              {
                type: 'image_url',
                image_url: {
                  url: `data:image/jpeg;base64,${documentImageBase64}`,
                  detail: 'high'
                },
              },
            ],
          },
        ],
        max_tokens: 800,
        temperature: 0.2,
      });

      const content = response.choices[0].message.content;
      if (!content) {
        throw new AppError('Aucune réponse de l\'IA', 500);
      }

      const fraudAnalysis = JSON.parse(content);
      logger.info('Fraud detection completed', {
        fraudScore: fraudAnalysis.fraudScore,
        riskLevel: fraudAnalysis.riskLevel
      });

      return fraudAnalysis;
    } catch (error: any) {
      logger.error('Fraud detection failed:', error);
      throw new AppError(`Erreur de détection de fraude: ${error.message}`, 500);
    }
  }

  async compareFaces(documentImageBase64: string, selfieImageBase64: string) {
    if (!openai) {
      throw new AppError('OpenAI API non configurée', 500);
    }

    try {
      const prompt = `You are a biometric verification expert. Compare the face in the ID document photo with the selfie photo.

Analyze:
1. Facial feature matching (eyes, nose, mouth, ears)
2. Age consistency
3. Gender consistency
4. Any signs of photo substitution or deepfakes
5. Lighting and angle differences

Return a JSON response:
{
  "matchScore": 0-100 (0=different person, 100=same person),
  "isMatch": true/false,
  "confidence": 0-100,
  "differences": ["array of noted differences"],
  "recommendation": "APPROVE/REVIEW/REJECT",
  "explanation": "brief explanation"
}

Set isMatch to true only if matchScore >= 85.`;

      const response = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: prompt },
              {
                type: 'image_url',
                image_url: {
                  url: `data:image/jpeg;base64,${documentImageBase64}`,
                  detail: 'high'
                },
              },
              {
                type: 'image_url',
                image_url: {
                  url: `data:image/jpeg;base64,${selfieImageBase64}`,
                  detail: 'high'
                },
              },
            ],
          },
        ],
        max_tokens: 600,
        temperature: 0.1,
      });

      const content = response.choices[0].message.content;
      if (!content) {
        throw new AppError('Aucune réponse de l\'IA', 500);
      }

      const comparisonResult = JSON.parse(content);
      logger.info('Face comparison completed', {
        matchScore: comparisonResult.matchScore,
        isMatch: comparisonResult.isMatch
      });

      return comparisonResult;
    } catch (error: any) {
      logger.error('Face comparison failed:', error);
      throw new AppError(`Erreur de comparaison faciale: ${error.message}`, 500);
    }
  }

  async generateAnalyticsInsights(analyticsData: any) {
    if (!openai) {
      return { insights: 'OpenAI API non configurée - analyses limitées' };
    }

    try {
      const prompt = `You are a business analytics expert for a property check-in platform.

Analyze this data and provide actionable insights:
${JSON.stringify(analyticsData, null, 2)}

Provide:
1. Key trends and patterns
2. Performance insights
3. Recommendations for improvement
4. Potential issues or concerns
5. Predictions for next period

Return concise, actionable insights in French as a JSON object:
{
  "summary": "brief overview",
  "trends": ["trend 1", "trend 2", ...],
  "recommendations": ["recommendation 1", "recommendation 2", ...],
  "concerns": ["concern 1", "concern 2", ...],
  "predictions": "forecast for next period"
}`;

      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'user', content: prompt },
        ],
        max_tokens: 800,
        temperature: 0.3,
      });

      const content = response.choices[0].message.content;
      if (!content) {
        throw new AppError('Aucune réponse de l\'IA', 500);
      }

      return JSON.parse(content);
    } catch (error: any) {
      logger.error('Analytics insights generation failed:', error);
      return {
        summary: 'Erreur lors de la génération des insights',
        trends: [],
        recommendations: [],
        concerns: [],
        predictions: ''
      };
    }
  }

  async generateContractFromTemplate(guestData: any, propertyData: any, checkInDate: Date, checkOutDate: Date) {
    if (!openai) {
      throw new AppError('OpenAI API non configurée', 500);
    }

    try {
      const prompt = `Generate a professional rental contract in French for a vacation property.

Guest Information:
${JSON.stringify(guestData, null, 2)}

Property Information:
${JSON.stringify(propertyData, null, 2)}

Check-in: ${checkInDate.toISOString()}
Check-out: ${checkOutDate.toISOString()}

Generate a complete, legally sound rental agreement including:
1. Parties identification
2. Property description
3. Rental period and terms
4. Payment terms
5. Guest responsibilities
6. House rules
7. Cancellation policy
8. Damage deposit
9. Signature section

Return valid HTML that can be used directly in an email or PDF.`;

      const response = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          { role: 'user', content: prompt },
        ],
        max_tokens: 2000,
        temperature: 0.3,
      });

      const content = response.choices[0].message.content;
      if (!content) {
        throw new AppError('Aucune réponse de l\'IA', 500);
      }

      return content;
    } catch (error: any) {
      logger.error('Contract generation failed:', error);
      throw new AppError(`Erreur de génération de contrat: ${error.message}`, 500);
    }
  }
}

export default new AIService();
