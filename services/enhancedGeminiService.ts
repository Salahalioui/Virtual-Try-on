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

// Extract clothing/outfit from image using Gemini 2.5 Flash Image Generation
export const extractOutfitFromImage = async (
  imageUrl: string,
  apiKey: string
): Promise<{ success: boolean; extractedOutfit?: string; message: string }> => {
  try {
    console.log('🎽 Starting outfit extraction from user photo...');
    
    // Convert image URL to base64 if needed
    let base64Image: string;
    let mimeType: string;
    
    if (imageUrl.startsWith('data:')) {
      // Already a data URL
      const [header, data] = imageUrl.split(',');
      base64Image = data;
      mimeType = header.match(/data:([^;]+)/)?.[1] || 'image/jpeg';
    } else {
      // Convert URL to base64
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const buffer = await blob.arrayBuffer();
      base64Image = btoa(String.fromCharCode(...new Uint8Array(buffer)));
      mimeType = blob.type || 'image/jpeg';
    }

    // Craft a specific prompt for outfit extraction
    const extractionPrompt = `Extract and isolate the clothing/outfit items worn by the person in this image. Create a clean, professional product-style image showing only the clothes (shirt, pants, dress, jacket, etc.) without the person wearing them. The extracted clothing should be:

- Laid out flat or displayed as if on an invisible mannequin
- Against a clean white or transparent background
- Maintaining the original colors, patterns, and textures
- Clearly visible with good lighting
- Suitable for virtual try-on applications

Focus only on the main clothing items visible on the person. Ignore accessories like shoes, jewelry, or bags unless they're integral to the outfit.`;

    const requestBody = {
      contents: [{
        parts: [
          { text: extractionPrompt },
          {
            inline_data: {
              mime_type: mimeType,
              data: base64Image
            }
          }
        ]
      }]
    };

    console.log('🚀 Sending outfit extraction request to OpenRouter API...');

    const response = await fetch(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          'HTTP-Referer': window.location.href,
          'X-Title': 'StyleAI Virtual Try-On'
        },
        body: JSON.stringify({
          model: 'google/gemini-2.5-flash-image-preview',
          messages: [{
            role: 'user',
            content: [
              { type: 'text', text: extractionPrompt },
              {
                type: 'image_url',
                image_url: {
                  url: `data:${mimeType};base64,${base64Image}`
                }
              }
            ]
          }],
          modalities: ["image", "text"],
          max_tokens: 1000,
          temperature: 0.7
        })
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ API request failed:', response.status, errorText);
      throw new Error(`API request failed: ${response.status} ${errorText}`);
    }

    const result = await response.json();
    console.log('📦 Received response from OpenRouter API');

    // Extract the generated image from OpenRouter response format
    if (result.choices && result.choices[0] && result.choices[0].message) {
      const message = result.choices[0].message;
      
      // Check for images in the response
      if (message.images && message.images.length > 0) {
        const imageData = message.images[0].image_url.url;
        
        console.log('✅ Successfully extracted outfit from photo!');
        return {
          success: true,
          extractedOutfit: imageData, // Already a data URL
          message: 'Outfit successfully extracted from your photo! You can now use it for virtual try-on.'
        };
      }
      
      if (message.content) {
        console.log('📝 OpenRouter response text:', message.content);
      }
    }

    throw new Error('No image data received from API');

  } catch (error) {
    console.error('❌ Outfit extraction failed:', error);
    return {
      success: false,
      message: 'Failed to extract outfit from image. Please try uploading a clear photo with visible clothing.'
    };
  }
};