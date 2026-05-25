export const buildDescriptionPrompt = (title, model, manufacturer, category) => {
  return `Generate a professional, engaging, and SEO-optimized product description for the following product:
- Title: ${title || "N/A"}
- Model: ${model || "N/A"}
- Manufacturer/Brand: ${manufacturer || "N/A"}
- Category: ${category || "N/A"}

Please keep the description informative, under 150 words, and ready to use in an inventory catalog. Don't mention formatting guidelines or templates in the output.`;
};

export const buildTagsPrompt = (title, description, category) => {
  return `Generate exactly 8 SEO-optimized tags as a JSON array of strings for a product with:
- Title: ${title || "N/A"}
- Description: ${description || "N/A"}
- Category: ${category || "N/A"}

Output ONLY a valid JSON array of strings, for example: ["electronics", "gaming laptop", "asus"]. Do NOT include markdown code block formatting (no \`\`\`json or similar).`;
};

export const buildCaptionPrompt = (title, model, description) => {
  return `Generate social media captions for the following product:
- Title: ${title || "N/A"}
- Model: ${model || "N/A"}
- Description: ${description || "N/A"}

Create three versions:
1. Instagram (engaging, visually descriptive, with hashtags)
2. Twitter/X (short, punchy, under 280 characters)
3. Facebook (detailed, informative, call-to-action)

Output ONLY a valid JSON object with the keys 'instagram', 'twitter', and 'facebook', for example:
{
  "instagram": "...",
  "twitter": "...",
  "facebook": "..."
}
Do NOT include markdown code block formatting (no \`\`\`json or similar).`;
};

export const buildPricingPrompt = (costPrice, targetMargin, competitorPrices) => {
  return `Perform a professional retail pricing analysis and recommend pricing for a product with the following details:
- Cost Price: $${costPrice || 0}
- Target Margin: ${targetMargin || 0}%
- Competitor Prices: ${competitorPrices || "None"}

Generate a pricing recommendation including:
1. minPrice (number): The minimum price we should sell at to cover costs and basic margin
2. maxPrice (number): The maximum competitive market price
3. optimalPrice (number): The recommended sweet spot price
4. saleAdvice (string): Strategic advice on discounts, positioning, and promotional strategy
5. recommendedDiscountPercent (number): Suggested promotional discount percent

Output ONLY a valid JSON object with the keys 'minPrice' (number), 'maxPrice' (number), 'optimalPrice' (number), 'saleAdvice' (string), and 'recommendedDiscountPercent' (number), for example:
{
  "minPrice": 100,
  "maxPrice": 150,
  "optimalPrice": 120,
  "saleAdvice": "...",
  "recommendedDiscountPercent": 10
}
Do NOT include markdown code block formatting (no \`\`\`json or similar).`;
};

export const buildTrendingPrompt = (category) => {
  return `Generate 5 trending, popular, or highly innovative product ideas that would fit within the category: ${category || "General"}.
For each product idea, provide:
1. title: A catchy and realistic product name
2. description: A brief description of what the product does and why it is trending

Output ONLY a valid JSON array of objects, where each object has the keys 'title' and 'description', for example:
[
  { "title": "Smart Eco Thermostat", "description": "AI-driven temperature control saving energy." }
]
Do NOT include markdown code block formatting (no \`\`\`json or similar).`;
};
