/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI } from '@google/genai';

// Helper to convert File to base64 data URL
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to convert file to base64'));
      }
    };
    reader.onerror = () => reject(new Error('FileReader error'));
    reader.readAsDataURL(file);
  });
};

// Helper to convert File to inline data format for Gemini API
const fileToInlineData = async (file: File): Promise<{ mimeType: string; data: string }> => {
  const base64DataUrl = await fileToBase64(file);
  const [header, data] = base64DataUrl.split(',');
  const mimeType = header.match(/data:([^;]+)/)?.[1] || 'image/jpeg';
  
  return {
    mimeType,
    data
  };
};

// Enhanced error handling for Google AI Direct API responses
const handleDirectApiError = (error: any): string => {
  console.error('Direct Gemini API Error Details:', error);
  
  // Handle authentication errors
  if (error.status === 401 || error.message?.includes('API key')) {
    return "Your Google AI Studio API key is invalid or expired. Please check your API key in Settings and ensure it has the correct permissions for image generation.";
  }
  
  // Handle quota/rate limit errors
  if (error.status === 429 || error.message?.includes('quota') || error.message?.includes('rate limit')) {
    return "You've exceeded your Google AI Studio API quota or rate limits. Please wait a moment before trying again, or check your usage in the Google AI Studio console.";
  }
  
  // Handle content policy violations
  if (error.status === 400 && error.message?.includes('content policy')) {
    return "The image was rejected due to Google's content policy. Please try with different images that comply with the content guidelines.";
  }
  
  // Handle model availability errors
  if (error.message?.includes('model') && error.message?.includes('not available')) {
    return "The Gemini image generation model is temporarily unavailable. Please try again later.";
  }
  
  // Handle image format/size errors
  if (error.message?.includes('image') && (error.message?.includes('format') || error.message?.includes('size'))) {
    return "There's an issue with your image format or size. Please ensure your images are in JPG, PNG, or WebP format and under 10MB.";
  }
  
  // Generic error fallback
  const errorMessage = error.message || error.error?.message || 'Unknown error occurred';
  return `Google AI Studio API error: ${errorMessage}. Please check your API key and try again.`;
};

// Direct Gemini API service for image generation and editing
export const generateImageWithDirectGemini = async (
  subjectImage: File,
  outfitImage: File | null,
  prompt: string,
  apiKey: string
): Promise<{ finalImageUrl: string }> => {
  console.log('🚀 Starting Direct Gemini API image generation...');
  
  if (!apiKey) {
    throw new Error('Google AI Studio API key is required. Please set up your API key in Settings.');
  }

  try {
    // Initialize Google GenAI client
    const genAI = new GoogleGenAI({ apiKey });
    
    // Prepare content array for the API call
    const contents: any[] = [];
    
    // Add the text prompt
    contents.push({ text: prompt });
    
    // Add the subject image
    const subjectInlineData = await fileToInlineData(subjectImage);
    contents.push({
      inlineData: subjectInlineData
    });
    
    // Add the outfit image if provided
    if (outfitImage && outfitImage.size > 0) {
      const outfitInlineData = await fileToInlineData(outfitImage);
      contents.push({
        inlineData: outfitInlineData
      });
    }
    
    console.log('📤 Sending request to Direct Gemini API...');
    
    // Make the API call
    const response = await genAI.models.generateContent({
      model: 'gemini-2.5-flash-image-preview',
      contents: contents
    });
    
    console.log('📥 Received response from Direct Gemini API');
    
    // Process the response
    const candidate = response.candidates?.[0];
    if (!candidate?.content?.parts) {
      throw new Error('No content parts found in response');
    }
    
    // Find the image data in the response
    for (const part of candidate.content.parts) {
      if (part.inlineData?.data) {
        // Convert base64 data to blob URL
        const imageBytes = atob(part.inlineData.data);
        const byteArray = new Uint8Array(imageBytes.length);
        for (let i = 0; i < imageBytes.length; i++) {
          byteArray[i] = imageBytes.charCodeAt(i);
        }
        
        const blob = new Blob([byteArray], { type: 'image/png' });
        const finalImageUrl = URL.createObjectURL(blob);
        
        console.log('✅ Direct Gemini API image generation completed successfully');
        return { finalImageUrl };
      }
    }
    
    throw new Error('No image data found in API response');
    
  } catch (error) {
    console.error('❌ Direct Gemini API generation failed:', error);
    throw new Error(handleDirectApiError(error));
  }
};

// Text-to-image generation with Direct Gemini API
export const generateTextToImageWithDirectGemini = async (
  prompt: string,
  apiKey: string
): Promise<{ finalImageUrl: string }> => {
  console.log('🚀 Starting Direct Gemini API text-to-image generation...');
  
  if (!apiKey) {
    throw new Error('Google AI Studio API key is required. Please set up your API key in Settings.');
  }

  try {
    // Initialize Google GenAI client
    const genAI = new GoogleGenAI({ apiKey });
    
    console.log('📤 Sending text-to-image request to Direct Gemini API...');
    
    // Make the API call
    const response = await genAI.models.generateContent({
      model: 'gemini-2.5-flash-image-preview',
      contents: [prompt]
    });
    
    console.log('📥 Received response from Direct Gemini API');
    
    // Process the response
    const candidate = response.candidates?.[0];
    if (!candidate?.content?.parts) {
      throw new Error('No content parts found in response');
    }
    
    // Find the image data in the response
    for (const part of candidate.content.parts) {
      if (part.inlineData?.data) {
        // Convert base64 data to blob URL
        const imageBytes = atob(part.inlineData.data);
        const byteArray = new Uint8Array(imageBytes.length);
        for (let i = 0; i < imageBytes.length; i++) {
          byteArray[i] = imageBytes.charCodeAt(i);
        }
        
        const blob = new Blob([byteArray], { type: 'image/png' });
        const finalImageUrl = URL.createObjectURL(blob);
        
        console.log('✅ Direct Gemini API text-to-image generation completed successfully');
        return { finalImageUrl };
      }
    }
    
    throw new Error('No image data found in API response');
    
  } catch (error) {
    console.error('❌ Direct Gemini API text-to-image generation failed:', error);
    throw new Error(handleDirectApiError(error));
  }
};

// Validate Google AI Studio API key
export const validateDirectGeminiApiKey = async (apiKey: string): Promise<boolean> => {
  try {
    const genAI = new GoogleGenAI({ apiKey });
    
    // Try a simple text-to-image request to validate the key
    await genAI.models.generateContent({
      model: 'gemini-2.5-flash-image-preview',
      contents: ['A simple test image']
    });
    
    return true;
  } catch (error) {
    console.error('API key validation failed:', error);
    return false;
  }
};