import { GoogleGenAI } from "@google/genai";

/**
 * Generates an app thumbnail based on the description using Gemini 2.5 Flash Image.
 */
export const generateAppThumbnail = async (
  apiKey: string,
  appName: string,
  appDescription: string,
  category: string
): Promise<string> => {
  if (!apiKey) {
    throw new Error("API Key is required");
  }

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
    Create a high-quality, modern, digital art style app icon or thumbnail for an application named "${appName}".
    Category: ${category}.
    Description: ${appDescription}.
    Style: Sleek, vibrant, tech-oriented, suitable for an app store showcase. 
    Aspect Ratio: Square (1:1).
    Do not include any text in the image.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            text: prompt,
          },
        ],
      },
    });

    // Extract image from response
    // The model returns the image data within the candidates
    let base64Image = "";
    
    // Iterate to find the image part (as per guidelines)
    const parts = response.candidates?.[0]?.content?.parts;
    if (parts) {
        for (const part of parts) {
            if (part.inlineData && part.inlineData.data) {
                base64Image = part.inlineData.data;
                break;
            }
        }
    }

    if (!base64Image) {
        throw new Error("No image generated.");
    }

    return `data:image/png;base64,${base64Image}`;

  } catch (error) {
    console.error("Error generating thumbnail:", error);
    throw error;
  }
};
