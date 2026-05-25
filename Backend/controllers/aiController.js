import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  buildDescriptionPrompt,
  buildTagsPrompt,
  buildCaptionPrompt,
  buildPricingPrompt,
  buildTrendingPrompt
} from "../utils/aiPrompts.js";

// Helper to call Gemini model
const callGemini = async (prompt) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "your_api_key_here") {
    throw new Error("Missing or placeholder GEMINI_API_KEY env variable");
  }
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash" });
  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
};

// Helper to clean and parse JSON returned from Gemini
const cleanAndParseJSON = (text) => {
  let cleanText = text.trim();
  if (cleanText.startsWith("```json")) {
    cleanText = cleanText.substring(7);
  } else if (cleanText.startsWith("```")) {
    cleanText = cleanText.substring(3);
  }
  if (cleanText.endsWith("```")) {
    cleanText = cleanText.substring(0, cleanText.length - 3);
  }
  cleanText = cleanText.trim();
  return JSON.parse(cleanText);
};

export const generateDescription = async (req, res) => {
  try {
    const { title, model, manufacturer, category } = req.body;
    const prompt = buildDescriptionPrompt(title, model, manufacturer, category);
    
    try {
      const responseText = await callGemini(prompt);
      return res.status(200).json({
        success: true,
        description: responseText.trim(),
      });
    } catch (apiError) {
      console.warn("[Gemini API Fallback] returning mock product description:", apiError.message);
      const mockDescription = `This high-quality product is designed for optimal performance in any modern environment. Engineered with durability in mind, it provides the perfect balance of efficiency and utility. Ideal for both professional and consumer setups, it represents a reliable addition to your inventory catalog.`;
      return res.status(200).json({
        success: true,
        description: mockDescription,
        isMock: true,
      });
    }
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const generateTags = async (req, res) => {
  try {
    const { title, description, category } = req.body;
    const prompt = buildTagsPrompt(title, description, category);

    try {
      const responseText = await callGemini(prompt);
      const tags = cleanAndParseJSON(responseText);
      return res.status(200).json({
        success: true,
        tags,
      });
    } catch (apiError) {
      console.warn("[Gemini API Fallback] returning mock tags:", apiError.message);
      const mockTags = ["hardware", "premium", "inventory", "efficiency", "enterprise", "durable", "high-performance", "smart-choice"];
      return res.status(200).json({
        success: true,
        tags: mockTags,
        isMock: true,
      });
    }
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const generateCaption = async (req, res) => {
  try {
    const { title, model, description } = req.body;
    const prompt = buildCaptionPrompt(title, model, description);

    try {
      const responseText = await callGemini(prompt);
      const captions = cleanAndParseJSON(responseText);
      return res.status(200).json({
        success: true,
        captions,
      });
    } catch (apiError) {
      console.warn("[Gemini API Fallback] returning mock captions:", apiError.message);
      const mockCaptions = {
        instagram: `Elevate your standard with this new arrival! Designed for maximum efficiency and styled for modern setups. ✨ #Innovation #Workspace #Upgrade #HardwareEssentials`,
        twitter: `Say hello to the ultimate workspace upgrade. Durable, efficient, and ready to roll. 💻 #TechUpdate #Productivity`,
        facebook: `Introducing our latest addition: the perfect solution for premium inventory management. Built for maximum reliability and daily usage, it delivers top-tier performance. Contact us for bulk orders or specifications!`,
      };
      return res.status(200).json({
        success: true,
        captions: mockCaptions,
        isMock: true,
      });
    }
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const recommendPrice = async (req, res) => {
  try {
    const { costPrice, targetMargin, competitorPrices } = req.body;
    const prompt = buildPricingPrompt(costPrice, targetMargin, competitorPrices);

    try {
      const responseText = await callGemini(prompt);
      const pricing = cleanAndParseJSON(responseText);
      return res.status(200).json({
        success: true,
        pricing,
      });
    } catch (apiError) {
      console.warn("[Gemini API Fallback] returning mock pricing:", apiError.message);
      
      const cost = parseFloat(costPrice) || 0;
      const margin = parseFloat(targetMargin) || 0;
      const optPrice = cost * (1 + margin / 100);
      const minPrice = cost * 1.1;
      const maxPrice = cost * 2.0;

      const mockPricing = {
        minPrice: Math.round(minPrice * 100) / 100,
        maxPrice: Math.round(maxPrice * 100) / 100,
        optimalPrice: Math.round(optPrice * 100) / 100,
        saleAdvice: `To maintain your target margin of ${margin}%, list the product around $${Math.round(optPrice)}. If competitors are pricing lower, target closer to $${Math.round(minPrice)} and consider bundle discounts rather than flat price reductions.`,
        recommendedDiscountPercent: 10,
      };
      return res.status(200).json({
        success: true,
        pricing: mockPricing,
        isMock: true,
      });
    }
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const generateTrending = async (req, res) => {
  try {
    const { category } = req.body;
    const prompt = buildTrendingPrompt(category);

    try {
      const responseText = await callGemini(prompt);
      const trending = cleanAndParseJSON(responseText);
      return res.status(200).json({
        success: true,
        trending,
      });
    } catch (apiError) {
      console.warn("[Gemini API Fallback] returning mock trending items:", apiError.message);
      const mockTrending = [
        { title: "AeroLink Gigabit Router", description: "Ultra-fast dual-band Wi-Fi 6 router optimized for smart home ecosystems." },
        { title: "VoltShield smart UPS", description: "Intelligent uninterruptible power supply with cloud monitoring and automatic shutoff alerts." },
        { title: "FlexView Modular Stand", description: "Ergonomic modular display mount supporting up to three monitors with active cable management." },
        { title: "TerraDesk Bamboo Docking Station", description: "Sustainable bamboo desktop dock with multi-device USB-C fast charging capabilities." },
        { title: "SecureVault Bio SSD", description: "Biometric fingerprint locking SSD with AES 256-bit hardware-level encryption." }
      ];
      return res.status(200).json({
        success: true,
        trending: mockTrending,
        isMock: true,
      });
    }
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};
