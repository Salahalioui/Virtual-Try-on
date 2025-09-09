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
  if (error.status === 401 || error.message?.includes('API key') || error.message?.includes('401') || error.message?.includes('unauthorized')) {
    return "🔑 Authentication failed: Your Google AI Studio API key is invalid, expired, or doesn't have permissions for image generation. Please check your API key in Settings.";
  }
  
  // Handle quota/rate limit errors - most common issue
  if (error.status === 429 || error.message?.includes('429') || error.message?.includes('quota') || error.message?.includes('rate limit') || error.message?.includes('Too Many Requests')) {
    return "🚦 Rate limit exceeded: You've hit Google's API usage limits. Please wait 1-2 minutes before trying again. Consider upgrading your Google AI Studio plan for higher limits, or try again during off-peak hours.";
  }
  
  // Handle content policy violations / safety filters
  if (error.status === 400 || error.message?.includes('content policy') || error.message?.includes('safety') || error.message?.includes('prohibited') || error.message?.includes('SAFETY')) {
    return "🛡️ Content filtered: The image was rejected by Google's safety filters. Try using different images (avoid provocative poses, clothing, or content), or add more context to your request.";
  }
  
  // Handle model availability errors
  if (error.status === 503 || error.message?.includes('503') || error.message?.includes('model') && error.message?.includes('not available') || error.message?.includes('temporarily unavailable')) {
    return "🔧 Service unavailable: The Gemini image generation model is temporarily down. Please try again in a few minutes.";
  }
  
  // Handle request too large errors
  if (error.status === 413 || error.message?.includes('413') || error.message?.includes('too large') || error.message?.includes('payload')) {
    return "📏 File too large: Your images are too big for processing. Please use images smaller than 10MB and reduce resolution if needed.";
  }
  
  // Handle image format/processing errors
  if (error.message?.includes('image') && (error.message?.includes('format') || error.message?.includes('invalid') || error.message?.includes('corrupt'))) {
    return "🖼️ Image format issue: Please ensure your images are in JPG, PNG, or WebP format and not corrupted. Try re-saving or using different images.";
  }
  
  // Handle network/connectivity errors
  if (error.message?.includes('network') || error.message?.includes('fetch') || error.message?.includes('connection') || error.code === 'NETWORK_ERROR') {
    return "🌐 Network error: Unable to connect to Google's servers. Please check your internet connection and try again.";
  }
  
  // Handle timeout errors
  if (error.message?.includes('timeout') || error.code === 'TIMEOUT') {
    return "⏱️ Request timeout: The request took too long to process. This often happens during peak usage. Please try again with smaller images or wait a few minutes.";
  }
  
  // Generic error fallback with more specific info
  const errorMessage = error.message || error.error?.message || error.code || 'Unknown error occurred';
  const statusInfo = error.status ? ` (Status: ${error.status})` : '';
  return `⚠️ Google AI Studio error${statusInfo}: ${errorMessage}. If this persists, try switching to OpenRouter API in Settings, or check Google AI Studio console for account issues.`;
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
    const friendlyError = handleDirectApiError(error);
    throw new Error(friendlyError);
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
    const friendlyError = handleDirectApiError(error);
    throw new Error(friendlyError);
  }
};

// Validate Google AI Studio API key with detailed error information
export const validateDirectGeminiApiKey = async (apiKey: string): Promise<{ valid: boolean; errorMessage?: string }> => {
  try {
    const genAI = new GoogleGenAI({ apiKey });
    
    // Try a simple text request first (less likely to hit rate limits)
    await genAI.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: ['Hello']
    });
    
    return { valid: true };
  } catch (error: any) {
    console.error('API key validation failed:', error);
    
    // Handle specific error types
    if (error.status === 429 || error.message?.includes('429') || error.message?.includes('quota') || error.message?.includes('rate limit')) {
      return { 
        valid: false, 
        errorMessage: 'Rate limit exceeded. Your API key is valid but you\'ve hit Google\'s usage limits. Please wait a few minutes and try again, or use your key directly - no validation needed.' 
      };
    }
    
    if (error.status === 401 || error.message?.includes('401') || error.message?.includes('API key') || error.message?.includes('authentication')) {
      return { 
        valid: false, 
        errorMessage: 'Invalid API key. Please check that you copied the complete API key from Google AI Studio.' 
      };
    }
    
    if (error.message?.includes('network') || error.message?.includes('fetch')) {
      return { 
        valid: false, 
        errorMessage: 'Network error. Please check your internet connection and try again.' 
      };
    }
    
    return { 
      valid: false, 
      errorMessage: `Validation failed: ${error.message || 'Unknown error'}. Your key might still be valid - you can save it and test by using the app features.` 
    };
  }
};

// Legacy function for backward compatibility
export const validateDirectGeminiApiKeyLegacy = async (apiKey: string): Promise<boolean> => {
  const result = await validateDirectGeminiApiKey(apiKey);
  return result.valid;
};