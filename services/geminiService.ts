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
  
  // Handle rate limit errors specifically
  if (error.status === 429 || (error.error && error.error.code === 429)) {
    return "You've reached the API rate limit. The free tier allows 5 requests per minute and 25 per day. Please wait a few minutes before trying again, or consider upgrading your API plan for higher limits.";
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
    return "API authentication failed. Please check that your Gemini API key is valid and has the necessary permissions.";
  }
  
  // Handle fetch/network errors  
  if (error.name === 'NetworkError' || error.name === 'TypeError' || 
      error.message?.includes('network') || error.message?.includes('fetch')) {
    return "Network connection failed. Please check your internet connection and try again.";
  }
  
  // Generic error fallback
  const message = error.error?.message || error.message || 'Unknown error occurred';
  return `API Error: ${message}`;
};

export const generateTryOnImage = async (
    subjectImage: File, 
    outfitImage: File,
    bodyBuild: string,
    customApiKey?: string,
): Promise<{ finalImageUrl: string; }> => {
  console.log('Starting virtual try-on generation process...');
  
  // Use custom API key if provided, otherwise fall back to environment variable
  const apiKey = customApiKey || process.env.GEMINI_API_KEY;
  
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

  const prompt = `
**Role:**
You are a master virtual stylist and photorealistic image editor. Your task is to take a person from a 'subject' image and realistically dress them in clothes from an 'outfit' image.

**Inputs:**
-   **Subject Image (First Image):** This contains the person, their pose, their face, and the background scene.
-   **Outfit Image (Second Image):** This contains the clothing item(s) to be worn. The outfit may have a white or simple background, which you must treat as transparent.

**Primary Goal:**
Create a single, photorealistic image of the person from the subject image wearing the clothes from the outfit image.

**Crucial Instructions (in order of importance):**
1.  **Unbreakable Rule #1: Body Type Fidelity.** THIS IS THE MOST IMPORTANT INSTRUCTION. The user has specified a '${bodyBuild}' body type. You MUST generate the image so the person's physique strictly matches this description. Under no circumstances should you alter their body shape. Do not make them thinner, larger, or more athletic than described. The outfit MUST realistically drape and fit this specified body type. All other instructions are secondary to this rule.
2.  **Preserve Identity & Scene:** You ABSOLUTELY MUST preserve the subject's face, hair, skin tone, body pose, and the original background from the subject image. The final image should look like it was taken in the same location. Do not change the person's identity.
3.  **Fit the Outfit:** Intelligently fit the outfit from the second image onto the subject's body. The outfit should follow the contours of their body and pose naturally. Pay close attention to fabric drape, folds, and wrinkles to make it look realistic.
4.  **Realistic Integration:** Adjust the lighting, shadows, and colors of the outfit to perfectly match the lighting conditions of the subject's photo. The outfit must cast realistic shadows on the body and the environment.
5.  **Complete Replacement:** The new outfit must completely REPLACE the clothing the subject is currently wearing. If the outfit image contains an item that corresponds to an item the subject is wearing (e.g., both images contain a hat, or the outfit has glasses and the person is wearing glasses), you MUST replace the subject's original item with the new one. Ensure a complete replacement, leaving no parts of the original item visible.
6.  **Clean Output:** The final output must ONLY be the composed image. Do not add any text, logos, watermarks, or other artifacts.

Execute this task with the highest degree of photorealism, paying special attention to the unbreakable rule of body build fidelity.
`;

  const textPart = { text: prompt };
  
  console.log('Sending images and prompt to the model...');
  
  let response: GenerateContentResponse;
  try {
    response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image-preview',
      contents: { parts: [subjectImagePart, outfitImagePart, textPart] },
      config: {
          responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
    });
  } catch (apiError: any) {
    console.error('🔥 API call failed:', apiError);
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