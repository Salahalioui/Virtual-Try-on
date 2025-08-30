/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/


import { GoogleGenAI, GenerateContentResponse, Modality } from "@google/genai";

// Helper to get intrinsic image dimensions from a File object
const getImageDimensions = (file: File): Promise<{ width: number; height: number }> => {
    return new Promise((resolve, reject) => {
        console.log('📐 Getting dimensions for:', file.name, 'Size:', file.size, 'Type:', file.type);
        
        // Mobile-specific: Try URL.createObjectURL first (more reliable on mobile)
        const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        if (isMobile) {
            try {
                const objectUrl = URL.createObjectURL(file);
                console.log('📱 Using object URL method for mobile dimension analysis');
                
                const img = new Image();
                img.onload = function() {
                    try {
                        console.log('✅ Mobile dimensions loaded:', img.naturalWidth, 'x', img.naturalHeight);
                        URL.revokeObjectURL(objectUrl); // Clean up
                        resolve({ width: img.naturalWidth, height: img.naturalHeight });
                    } catch (error) {
                        URL.revokeObjectURL(objectUrl);
                        reject(new Error(`Error getting image dimensions on mobile: ${error}`));
                    }
                };
                img.onerror = function(err) {
                    URL.revokeObjectURL(objectUrl);
                    console.error('📱 Mobile image load error, falling back to FileReader:', err);
                    // Fallback to FileReader method
                    getImageDimensionsWithFileReader(file).then(resolve).catch(reject);
                };
                img.src = objectUrl;
                return;
            } catch (error) {
                console.error('📱 Object URL method failed, using FileReader:', error);
                // Fallback to FileReader
            }
        }
        
        // Desktop or fallback method
        getImageDimensionsWithFileReader(file).then(resolve).catch(reject);
    });
};

// Separate FileReader method for dimension analysis
const getImageDimensionsWithFileReader = (file: File): Promise<{ width: number; height: number }> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        
        reader.onload = function(event) {
            try {
                if (!event.target?.result) {
                    return reject(new Error("Failed to read file - no result data"));
                }
                const img = new Image();
                img.onload = function() {
                    try {
                        console.log('✅ FileReader dimensions loaded:', img.naturalWidth, 'x', img.naturalHeight);
                        resolve({ width: img.naturalWidth, height: img.naturalHeight });
                    } catch (error) {
                        reject(new Error(`Error getting image dimensions: ${error}`));
                    }
                };
                img.onerror = function(err) {
                    reject(new Error(`Image load error: ${err || 'Unknown image error'}`));
                };
                img.src = event.target.result as string;
            } catch (error) {
                reject(new Error(`File processing error: ${error}`));
            }
        };
        
        reader.onerror = function(err) {
            console.error('📱 FileReader error in getImageDimensionsWithFileReader:', err);
            const errorMsg = err instanceof Event ? 'FileReader failed to read the image file for dimension analysis' : String(err);
            reject(new Error(`File reader error: ${errorMsg}`));
        };
        
        reader.onabort = function() {
            reject(new Error('File reading was aborted during dimension analysis'));
        };
        
        try {
            reader.readAsDataURL(file);
        } catch (error) {
            reject(new Error(`Cannot start file reading for dimensions: ${error}`));
        }
    });
};

// Helper to crop a square image back to an original aspect ratio, removing padding.
const cropToOriginalAspectRatio = (
    imageDataUrl: string,
    originalWidth: number,
    originalHeight: number,
    targetDimension: number
): Promise<string> => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = imageDataUrl;
        img.onload = () => {
            // Re-calculate the dimensions of the content area within the padded square image
            const aspectRatio = originalWidth / originalHeight;
            let contentWidth, contentHeight;
            if (aspectRatio > 1) { // Landscape
                contentWidth = targetDimension;
                contentHeight = targetDimension / aspectRatio;
            } else { // Portrait or square
                contentHeight = targetDimension;
                contentWidth = targetDimension * aspectRatio;
            }

            // Calculate the top-left offset of the content area
            const x = (targetDimension - contentWidth) / 2;
            const y = (targetDimension - contentHeight) / 2;

            const canvas = document.createElement('canvas');
            // Set canvas to the final, un-padded dimensions
            canvas.width = contentWidth;
            canvas.height = contentHeight;

            const ctx = canvas.getContext('2d');
            if (!ctx) {
                return reject(new Error('Could not get canvas context for cropping.'));
            }
            
            // Draw the relevant part of the square generated image onto the new, smaller canvas
            ctx.drawImage(img, x, y, contentWidth, contentHeight, 0, 0, contentWidth, contentHeight);
            
            // Return the data URL of the newly cropped image
            resolve(canvas.toDataURL('image/jpeg', 0.95));
        };
        img.onerror = (err) => reject(new Error(`Image load error during cropping: ${err}`));
    });
};


// Resizes an image to fit within a square and adds padding, ensuring a consistent
// input size for the AI model, which enhances stability.
const resizeImage = (file: File, targetDimension: number): Promise<File> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        
        reader.onload = function(event) {
            try {
                if (!event.target?.result) {
                    return reject(new Error("Failed to read file - no result data"));
                }
                const img = new Image();
                img.onload = function() {
                    try {
                        const canvas = document.createElement('canvas');
                        canvas.width = targetDimension;
                        canvas.height = targetDimension;

                        const ctx = canvas.getContext('2d');
                        if (!ctx) {
                            return reject(new Error('Could not get canvas context.'));
                        }

                        ctx.fillStyle = 'black';
                        ctx.fillRect(0, 0, targetDimension, targetDimension);

                        const aspectRatio = img.width / img.height;
                        let newWidth, newHeight;

                        if (aspectRatio > 1) { // Landscape image
                            newWidth = targetDimension;
                            newHeight = targetDimension / aspectRatio;
                        } else { // Portrait or square image
                            newHeight = targetDimension;
                            newWidth = targetDimension * aspectRatio;
                        }

                        const x = (targetDimension - newWidth) / 2;
                        const y = (targetDimension - newHeight) / 2;
                        
                        ctx.drawImage(img, x, y, newWidth, newHeight);

                        canvas.toBlob((blob) => {
                            if (blob) {
                                resolve(new File([blob], file.name, {
                                    type: 'image/jpeg',
                                    lastModified: Date.now()
                                }));
                            } else {
                                reject(new Error('Canvas to Blob conversion failed.'));
                            }
                        }, 'image/jpeg', 0.85); // Slightly lower quality for mobile
                    } catch (error) {
                        reject(new Error(`Canvas processing error: ${error}`));
                    }
                };
                img.onerror = function(err) {
                    reject(new Error(`Image load error: ${err || 'Unknown image error'}`));
                };
                img.src = event.target.result as string;
            } catch (error) {
                reject(new Error(`File processing error: ${error}`));
            }
        };
        
        reader.onerror = function(err) {
            console.error('📱 FileReader error in resizeImage:', err);
            const errorMsg = err instanceof Event ? 'FileReader failed to process the image for resizing' : String(err);
            reject(new Error(`File reader error: ${errorMsg}`));
        };
        
        reader.onabort = function() {
            reject(new Error('File reading was aborted during resizing'));
        };
        
        try {
            reader.readAsDataURL(file);
        } catch (error) {
            reject(new Error(`Cannot start file reading for resizing: ${error}`));
        }
    });
};

// Helper function to convert a File object to a Gemini API Part
const fileToPart = async (file: File): Promise<{ inlineData: { mimeType: string; data: string; } }> => {
    const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        
        reader.onload = function(event) {
            try {
                if (event.target && event.target.result) {
                    resolve(event.target.result as string);
                } else {
                    reject(new Error('No result from FileReader'));
                }
            } catch (error) {
                reject(new Error(`FileReader result processing error: ${error}`));
            }
        };
        
        reader.onerror = function(error) {
            console.error('📱 FileReader error in fileToPart:', error);
            const errorMsg = error instanceof Event ? 'FileReader failed to convert image for AI processing' : String(error);
            reject(new Error(`FileReader error: ${errorMsg}`));
        };
        
        reader.onabort = function() {
            reject(new Error('File reading was aborted during AI conversion'));
        };
        
        try {
            reader.readAsDataURL(file);
        } catch (error) {
            reject(new Error(`Cannot start file reading for AI conversion: ${error}`));
        }
    });
    
    try {
        const arr = dataUrl.split(',');
        if (arr.length < 2) throw new Error("Invalid data URL format");
        
        const mimeMatch = arr[0].match(/:(.*?);/);
        if (!mimeMatch || !mimeMatch[1]) throw new Error("Could not parse MIME type from data URL");
        
        const mimeType = mimeMatch[1];
        const data = arr[1];
        
        if (!data || data.length === 0) {
            throw new Error("No image data found in file");
        }
        
        return { inlineData: { mimeType, data } };
    } catch (error) {
        throw new Error(`Data URL processing error: ${error}`);
    }
};

/**
 * Generates a virtual try-on image using a multi-modal AI model.
 * @param subjectImage The file for the person.
 * @param outfitImage The file for the clothing.
 * @param bodyBuild A text description of the person's body build.
 * @returns A promise that resolves to an object containing the base64 data URL of the generated image.
 */
// Enhanced error handling for API responses
const handleApiError = (error: any): string => {
  console.error('API Error Details:', error);
  
  // Handle character encoding errors (mobile-specific)
  if (error.message?.includes('non ISO-8859-1 code point') || 
      error.message?.includes('Failed to execute') && error.message?.includes('Headers')) {
    return "API key contains invalid characters. Please copy your API key again, ensuring no extra characters or spaces are included.";
  }
  
  // Handle API key validation errors
  if (error.error?.code === 400 && error.error?.message?.includes('API key not valid')) {
    return "Your API key is not valid. Please check that you've entered the correct Gemini API key in Settings. Make sure it's copied exactly without any extra characters.";
  }
  
  // Handle rate limit errors specifically
  if (error.status === 429 || (error.error && error.error.code === 429)) {
    // Check if this might be a different 429 error
    const errorMsg = error.error?.message || error.message || '';
    if (errorMsg.includes('quota') || errorMsg.includes('limit')) {
      return "You've reached the API rate limit. The free tier allows 15 requests per minute and 1,500 per day. Please wait a moment before trying again, or consider upgrading your API plan for higher limits.";
    } else {
      return `API returned status 429: ${errorMsg}. This might indicate a service issue or billing problem. Please check your Google AI Studio console for more details.`;
    }
  }
  
  // Handle quota exceeded errors
  if (error.error && error.error.status === 'RESOURCE_EXHAUSTED') {
    const details = error.error.details || [];
    const quotaFailure = details.find((d: any) => d['@type']?.includes('QuotaFailure'));
    
    if (quotaFailure) {
      return "You've exceeded your daily API quota. The free tier resets at midnight Pacific Time. You can upgrade your API plan for higher limits, or try again tomorrow.";
    }
  }
  
  // Handle authentication errors
  if (error.status === 401 || error.status === 403) {
    return "API authentication failed. Please check that your Gemini API key is valid and has the necessary permissions for image generation.";
  }
  
  // Handle content policy violations
  if (error.error?.code === 400 && error.error?.message?.includes('content policy')) {
    return "The image was rejected due to content policy restrictions. Please try with different images that comply with Google's AI content policies.";
  }
  
  // Handle image processing errors
  if (error.message?.includes('image') && (error.message?.includes('format') || error.message?.includes('size'))) {
    return "There was an issue processing your images. Please ensure they are in a supported format (JPEG, PNG) and under 20MB in size.";
  }
  
  // Handle model capacity issues
  if (error.status === 503 || error.message?.includes('service unavailable')) {
    return "The AI service is temporarily unavailable due to high demand. Please wait a moment and try again.";
  }
  
  // Handle fetch/network errors  
  if (error.name === 'NetworkError' || error.name === 'TypeError' || 
      error.message?.includes('network') || error.message?.includes('fetch')) {
    return "Network connection failed. Please check your internet connection and try again.";
  }
  
  // Handle timeout errors
  if (error.name === 'TimeoutError' || error.message?.includes('timeout')) {
    return "The request took too long to complete. This might be due to large images or server load. Please try again with smaller images.";
  }
  
  // Generic error fallback with more guidance
  const message = error.error?.message || error.message || 'Unknown error occurred';
  return `API Error: ${message}. If this persists, please check your API key settings or try again later.`;
};

export const generateTryOnImage = async (
    subjectImage: File, 
    outfitImage: File,
    bodyBuild: string,
    customApiKey?: string,
    selectedColor?: string,
): Promise<{ finalImageUrl: string; }> => {
  console.log('Starting virtual try-on generation process...');
  
  // Use custom API key if provided, otherwise fall back to environment variable
  let apiKey = customApiKey || process.env.GEMINI_API_KEY;
  
  // Debug logging to verify which API key is being used
  if (customApiKey) {
    console.log('🔑 Using custom API key (length:', customApiKey.length, 'chars)');
  } else if (process.env.GEMINI_API_KEY) {
    console.log('🔑 Using default environment API key');
  } else {
    console.log('❌ No API key found');
  }
  
  if (!apiKey) {
    throw new Error('No API key available. Please set up your Gemini API key in Settings.');
  }

  // Mobile-specific: Clean API key more carefully to prevent header encoding issues
  apiKey = apiKey.trim().replace(/[\u0000-\u001F\u007F-\u009F]/g, ''); // Remove only control characters, keep valid ASCII
  if (!apiKey || apiKey.length < 20) {
    throw new Error('API key appears to be corrupted or invalid after cleaning. Please check your API key.');
  }
  
  console.log('🧹 Cleaned API key for mobile compatibility (removed control characters only)');
  const ai = new GoogleGenAI({ apiKey });

  // Get original scene dimensions for final cropping
  const { width: originalWidth, height: originalHeight } = await getImageDimensions(subjectImage);
  
  // Define standard dimension for model inputs
  const MAX_DIMENSION = 1024;
  
  console.log('Resizing subject and outfit images...');
  const resizedSubjectImage = await resizeImage(subjectImage, MAX_DIMENSION);
  const resizedOutfitImage = await resizeImage(outfitImage, MAX_DIMENSION);

  const subjectImagePart = await fileToPart(resizedSubjectImage);
  const outfitImagePart = await fileToPart(resizedOutfitImage);

  // Build the prompt with optional color instruction
  let colorInstruction = '';
  if (selectedColor) {
    console.log('🎨 Adding color recoloring instruction for:', selectedColor);
    colorInstruction = `
**CRITICAL COLOR REQUIREMENT:** 
URGENT: The user has specifically selected the color ${selectedColor} from their photo. You MUST recolor the outfit to match this exact hex color ${selectedColor}. This is a TOP PRIORITY instruction that takes precedence over the original outfit colors. Change the main fabric color of the outfit to ${selectedColor} while maintaining realistic fabric texture, shadows, and highlights. Preserve any secondary colors (buttons, zippers, etc.) but the primary outfit color MUST be ${selectedColor}.

`;
  }

  const prompt = `
Virtual stylist task: Replace person's clothing with outfit from second image.

CRITICAL RULES:
${selectedColor ? `- PRIORITY: Recolor outfit to ${selectedColor}\n` : ''}- Body type: ${bodyBuild} - maintain exact physique, no alterations
- Preserve: face, hair, skin, pose, background completely
- Replace ALL original clothing with new outfit
- Match lighting/shadows perfectly
- Photorealistic result only

AVOID: changing face/hair/background, wrong body type, visible original clothes, unrealistic fit, text/logos.
`;

  const textPart = { text: prompt };
  
  console.log('Sending images and prompt to the model...');
  
  let response: GenerateContentResponse;
  try {
    // Try gemini-2.0-flash-experimental first (higher limits), fallback to 2.5 if needed
    const models = [
      'gemini-2.0-flash-experimental', 
      'gemini-2.5-flash-image-preview'
    ];
    
    let lastError;
    for (const modelName of models) {
      try {
        console.log(`🤖 Trying model: ${modelName}`);
        response = await ai.models.generateContent({
          model: modelName,
          contents: { parts: [subjectImagePart, outfitImagePart, textPart] },
          config: {
              responseModalities: [Modality.IMAGE, Modality.TEXT],
          },
        });
        console.log(`✅ Success with model: ${modelName}`);
        break; // Success, exit loop
      } catch (modelError: any) {
        console.log(`❌ Model ${modelName} failed:`, modelError.status || modelError.message);
        lastError = modelError;
        // Continue to next model
      }
    }
    
    // If all models failed, throw the last error
    if (!response) {
      throw lastError;
    }
  } catch (apiError: any) {
    console.error('🔥 API call failed:', apiError);
    console.error('🔥 Full error object:', JSON.stringify(apiError, null, 2));
    console.error('🔥 Error status:', apiError.status);
    console.error('🔥 Error message:', apiError.message);
    console.error('🔥 Error details:', apiError.error);
    
    // Log additional debugging info for 429 errors
    if (apiError.status === 429) {
      console.error('🔍 429 Debug Info:');
      console.error('- Using custom API key:', !!customApiKey);
      console.error('- API key length:', apiKey?.length || 'undefined');
      console.error('- Request timestamp:', new Date().toISOString());
      console.error('- User agent:', navigator?.userAgent || 'unknown');
    }
    
    throw new Error(handleApiError(apiError));
  }

  console.log('Received response from the model.');
  
  const imagePartFromResponse = response.candidates?.[0]?.content?.parts?.find(part => part.inlineData);

  if (imagePartFromResponse?.inlineData) {
    const { mimeType, data } = imagePartFromResponse.inlineData;
    console.log(`Received image data (${mimeType}), length:`, data.length);
    const generatedSquareImageUrl = `data:${mimeType};base64,${data}`;
    
    console.log('Cropping generated image to original aspect ratio...');
    const finalImageUrl = await cropToOriginalAspectRatio(
        generatedSquareImageUrl,
        originalWidth,
        originalHeight,
        MAX_DIMENSION
    );
    
    return { finalImageUrl };
  }

  console.error("Model response did not contain an image part.", response);
  throw new Error("The AI model did not return an image. This might be due to content restrictions or processing issues. Please try with different images or try again later.");
};