import { Router, Request, Response } from 'express';
import { GoogleGenAI } from '@google/genai';

export const aiRouter = Router();

let aiClient: GoogleGenAI | null = null;

function getAIClient(): GoogleGenAI | null {
  if (!process.env.GEMINI_API_KEY) {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return aiClient;
}

// POST /api/ai/concierge - Jewellery styling advisor and gemstone guidance
aiRouter.post('/concierge', async (req: Request, res: Response) => {
  try {
    const { prompt, context } = req.body;
    if (!prompt) {
      return res.status(400).json({ success: false, message: 'Prompt query is required' });
    }

    const ai = getAIClient();

    if (!ai) {
      // Fallback expert styling response if GEMINI_API_KEY is not yet configured
      return res.json({
        success: true,
        response: `As your NaxtTo Atelier Concierge, I recommend curating a balanced pairing of our 18k solid gold pavé bands with organic baroque pearl pendants. For everyday refinement, consider stacking a flush-set solitaire ring with architectural cuffs. Our Milanese artisans can also customize any piece with bespoke engraving.`,
        source: 'atelier-curation-engine'
      });
    }

    const systemInstruction = `You are the Master Jeweller and High Concierge of NaxtTo Fine Jewellery Atelier (founded in Milan & Antwerp).
You provide ultra-refined, warm, and sophisticated guidance on fine jewellery, 100% recycled 18k gold metallurgy, solar-crystallized diamonds, natural baroque pearls, ring sizing, bespoke bridal suites, and heirloom styling.
Keep responses concise, elegant, and poetic yet informative.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });

    res.json({
      success: true,
      response: response.text || 'Our master jeweller is pleased to assist with your bespoke curation.',
      source: 'gemini-2.5-flash'
    });
  } catch (error: any) {
    console.error('AI Concierge error:', error);
    res.json({
      success: true,
      response: 'Our atelier master jewellers recommend classic 18k gold bands paired with certified solar diamonds for enduring elegance.',
      source: 'fallback-concierge'
    });
  }
});
