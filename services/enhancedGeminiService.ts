/**
 * Enhanced Gemini Service for multiple AI features
 * Supports Virtual Try-On, Hair Styling, and Background Changes
 */

import { generateTryOnImage as originalGenerateImage } from './geminiService';
import { generateOptimizedImage } from './optimizedGeminiService';

// Enhanced service function that works with image URLs instead of Files
export const generateEnhancedImage = async (
  userImageUrl: string,
  referenceImageUrl: string | null,
  prompt: string,
  feature: 'virtual-tryon' | 'hair-style' | 'background',
  apiKey: string,
  options: {
    angle?: string;
    bodyBuild?: string;
    gender?: string;
    styleDescription?: string;
    backgroundDescription?: string;
    placementMode?: 'auto' | 'manual';
    placementInstructions?: string;
  } = {}
): Promise<string> => {
  try {
    // Use optimized service with best practices prompts
    return await generateOptimizedImage(
      userImageUrl,
      referenceImageUrl,
      feature,
      {
        ...options,
        customPrompt: prompt // Use the provided prompt as additional instructions
      },
      apiKey
    );
  } catch (error) {
    console.error(`${feature} generation failed with optimized service, falling back to original:`, error);
    
    // Fallback to original service
    try {
      const userFile = await urlToFile(userImageUrl, 'user-image.jpg');
      const referenceFile = referenceImageUrl ? await urlToFile(referenceImageUrl, 'reference-image.jpg') : new File([''], 'empty.jpg', { type: 'image/jpeg' });
      
      const result = await originalGenerateImage(
        userFile,
        referenceFile,
        options.bodyBuild || 'Average',
        undefined, // selectedColor
        apiKey
      );

      return result.finalImageUrl;
    } catch (fallbackError) {
      console.error(`${feature} generation failed with fallback service:`, fallbackError);
      throw fallbackError;
    }
  }
};

// Helper function to convert image URL to File
async function urlToFile(url: string, filename: string): Promise<File> {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    return new File([blob], filename, { type: blob.type || 'image/jpeg' });
  } catch (error) {
    console.error('Error converting URL to File:', error);
    throw new Error('Failed to process image');
  }
}

// Extract clothing/outfit from image (placeholder for now)
export const extractOutfitFromImage = async (
  imageUrl: string,
  apiKey: string
): Promise<{ success: boolean; extractedOutfit?: string; message: string }> => {
  try {
    // This would integrate with a cloth segmentation service
    // For now, return a placeholder response
    return {
      success: true,
      message: 'Outfit extraction is coming soon! For now, you can upload a separate outfit image.'
    };
  } catch (error) {
    console.error('Outfit extraction failed:', error);
    return {
      success: false,
      message: 'Failed to extract outfit from image.'
    };
  }
};