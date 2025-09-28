
import { GoogleGenAI, Type } from "@google/genai";
// FIX: Import `HealthRating` as a value so it can be used for enum access.
import { type AnalysisResult, HealthRating } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function extractTextFromImage(base64Image: string, mimeType: string): Promise<string> {
    const imagePart = {
        inlineData: {
            data: base64Image,
            mimeType: mimeType,
        },
    };
    const textPart = {
        text: "Extract the full list of ingredients from this image. Only return the ingredients list as a comma-separated string.",
    };

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: { parts: [imagePart, textPart] },
    });

    return response.text;
}

const analysisSchema = {
    type: Type.OBJECT,
    properties: {
        overallRating: {
            type: Type.STRING,
            enum: ['Safe', 'Caution', 'Avoid'],
            description: 'A single overall rating for the product.'
        },
        summary: {
            type: Type.STRING,
            description: 'A brief, one-sentence summary of the analysis.'
        },
        flaggedIngredients: {
            type: Type.ARRAY,
            description: 'A list of ingredients that are identified as potentially harmful or requiring caution.',
            items: {
                type: Type.OBJECT,
                properties: {
                    name: {
                        type: Type.STRING,
                        description: 'The name of the ingredient.'
                    },
                    description: {
                        type: Type.STRING,
                        description: 'A simple explanation of the risk associated with the ingredient.'
                    },
                    rating: {
                        type: Type.STRING,
                        enum: ['Caution', 'Avoid'],
                        description: 'The safety rating for this specific ingredient.'
                    },
                },
                required: ['name', 'description', 'rating'],
            },
        },
        allIngredients: {
            type: Type.ARRAY,
            description: 'The complete list of all ingredients found.',
            items: {
                type: Type.STRING,
            },
        },
    },
    required: ['overallRating', 'summary', 'flaggedIngredients', 'allIngredients'],
};


export async function analyzeIngredients(ingredientsText: string): Promise<AnalysisResult> {
    const systemInstruction = `You are a world-class product safety expert, specializing in food and cosmetic ingredients. 
    Your analysis is based on stringent international standards like those in Singapore, the EU, and the US FDA.
    When you receive a list of ingredients, you must:
    1.  Carefully analyze each ingredient for potential health risks (e.g., allergens, carcinogens, hormone disruptors).
    2.  Identify ingredients that are banned, restricted, or controversial. Some key ingredients to flag are: Parabens, Sodium Lauryl Sulfate (SLS), Phthalates, Formaldehyde, certain artificial colors (like Tartrazine), High Fructose Corn Syrup, Trans Fats, and BHA/BHT.
    3.  Provide an overall product rating: 'Safe' (no harmful ingredients found), 'Caution' (contains ingredients that may be problematic for some individuals), or 'Avoid' (contains banned, restricted, or high-risk ingredients).
    4.  Return your analysis in a structured JSON format according to the provided schema. The analysis should be clear, concise, and easy for a non-expert to understand.
    `;

    const prompt = `Please analyze the following list of ingredients: ${ingredientsText}`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            systemInstruction,
            responseMimeType: 'application/json',
            responseSchema: analysisSchema,
        },
    });

    const jsonString = response.text.trim();
    const result = JSON.parse(jsonString) as AnalysisResult;

    // Validate enum values to prevent type errors
    if (!Object.values(['Safe', 'Caution', 'Avoid']).includes(result.overallRating)) {
        result.overallRating = 'Caution'; // Default fallback
    }
    result.flaggedIngredients.forEach(ing => {
        if (!Object.values(['Caution', 'Avoid']).includes(ing.rating)) {
           // FIX: Corrected the invalid assignment syntax and used the HealthRating enum for type safety.
           ing.rating = HealthRating.Caution; // Default fallback
        }
    });

    return result;
}