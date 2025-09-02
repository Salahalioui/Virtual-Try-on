/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/


// Service for virtual try-on image generation using OpenRouter API

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

// OpenRouter API fallback implementation
const generateTryOnImageWithOpenRouter = async (
    subjectImagePart: { inlineData: { mimeType: string; data: string; } },
    outfitImagePart: { inlineData: { mimeType: string; data: string; } },
    prompt: string,
    openRouterApiKey: string,
    originalWidth: number,
    originalHeight: number,
    MAX_DIMENSION: number
): Promise<{ finalImageUrl: string; }> => {
  console.log('🔄 Attempting OpenRouter fallback...');
  
  // Clean the API key for OpenRouter
  const cleanApiKey = openRouterApiKey.trim().replace(/[\u0000-\u001F\u007F-\u009F]/g, '');
  if (!cleanApiKey || cleanApiKey.length < 10) {
    throw new Error('OpenRouter API key appears to be invalid. Please check your OpenRouter API key.');
  }

  // Prepare the OpenRouter API request for Gemini image generation
  const requestBody = {
    model: "google/gemini-2.5-flash-image-preview:free",
    modalities: ["image", "text"],
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: prompt
          },
          {
            type: "image_url",
            image_url: {
              url: `data:${subjectImagePart.inlineData.mimeType};base64,${subjectImagePart.inlineData.data}`
            }
          },
          {
            type: "image_url",
            image_url: {
              url: `data:${outfitImagePart.inlineData.mimeType};base64,${outfitImagePart.inlineData.data}`
            }
          }
        ]
      }
    ]
  };

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${cleanApiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': window.location.origin,
        'X-Title': 'Virtual Try-On App'
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenRouter API error:', response.status, errorData);
      throw new Error(`OpenRouter API error (${response.status}): ${errorData}`);
    }

    const data = await response.json();
    console.log('🎉 OpenRouter response received!');
    console.log('OpenRouter response structure:', JSON.stringify(data, null, 2));
    
    // For Gemini image generation through OpenRouter, check for images array in message
    if (data.choices && data.choices[0] && data.choices[0].message) {
      const message = data.choices[0].message;
      const choice = data.choices[0];
      console.log('OpenRouter message:', message);
      
      // Check for content filter blocking
      if (choice.finish_reason === 'content_filter' || choice.native_finish_reason === 'PROHIBITED_CONTENT') {
        throw new Error("Content filter blocked the request. OpenRouter's safety system flagged this virtual try-on as inappropriate content. This is a false positive - please try using your own Gemini API key instead of the OpenRouter fallback.");
      }
      
      // Check for images array - this is how OpenRouter returns generated images
      if (message.images && Array.isArray(message.images) && message.images.length > 0) {
        const firstImage = message.images[0];
        console.log('Found images array with', message.images.length, 'images');
        
        let imageUrl: string;
        
        // Check if it's in the expected format: { image_url: { url: "data:..." } }
        if (firstImage.image_url && firstImage.image_url.url) {
          imageUrl = firstImage.image_url.url;
          console.log('Found image URL in images array:', imageUrl.substring(0, 50) + '...');
        } else if (typeof firstImage === 'string') {
          // Sometimes it might be a direct string
          imageUrl = firstImage;
          console.log('Found direct image string in images array');
        } else {
          throw new Error(`Unexpected image format in OpenRouter response: ${JSON.stringify(firstImage)}`);
        }
        
        // Validate that we have a proper data URL
        if (!imageUrl.startsWith('data:image/')) {
          throw new Error(`Expected data URL format, got: ${imageUrl.substring(0, 50)}...`);
        }
        
        console.log('Cropping OpenRouter generated image to original aspect ratio...');
        const finalImageUrl = await cropToOriginalAspectRatio(
          imageUrl,
          originalWidth,
          originalHeight,
          MAX_DIMENSION
        );
        
        return { finalImageUrl };
      }
      
      // Fallback: check if content contains image data (older format)
      if (message.content && typeof message.content === 'string') {
        if (message.content.startsWith('data:image/')) {
          console.log('Found image in content field as fallback');
          const finalImageUrl = await cropToOriginalAspectRatio(
            message.content,
            originalWidth,
            originalHeight,
            MAX_DIMENSION
          );
          return { finalImageUrl };
        }
      }
    }
    
    throw new Error("OpenRouter response did not contain valid image data");
  } catch (openRouterError: any) {
    console.error('🔥 OpenRouter fallback failed:', openRouterError);
    throw new Error(`OpenRouter fallback failed: ${openRouterError.message}`);
  }
};

export const generateTryOnImage = async (
    subjectImage: File, 
    outfitImage: File,
    bodyBuild: string,
    selectedColor?: string,
    openRouterApiKey?: string,
): Promise<{ finalImageUrl: string; }> => {
  console.log('Starting virtual try-on generation process...');
  
  // Check if OpenRouter API key is available
  if (!openRouterApiKey) {
    throw new Error('OpenRouter API key is required. Please set up your OpenRouter API key in Settings.');
  }

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
**Role:**
You are a master virtual stylist and photorealistic image editor. Your task is to take a person from a 'subject' image and realistically dress them in clothes from an 'outfit' image.

**Inputs:**
-   **Subject Image (First Image):** This contains the person, their pose, their face, and the background scene.
-   **Outfit Image (Second Image):** This contains the clothing item(s) to be worn. The outfit may have a white or simple background, which you must treat as transparent.

${colorInstruction}**Primary Goal:**
Create a single, photorealistic image of the person from the subject image wearing the clothes from the outfit image.

**Crucial Instructions (in order of importance):**
${selectedColor ? '0.  **ABSOLUTE PRIORITY - Color Matching:** The outfit MUST be recolored to the specified color ' + selectedColor + '. This overrides any other color considerations.\n' : ''}1.  **Unbreakable Rule #1: Body Type Fidelity.** THIS IS THE MOST IMPORTANT INSTRUCTION. The user has specified a '${bodyBuild}' body type. You MUST generate the image so the person's physique strictly matches this description. Under no circumstances should you alter their body shape. Do not make them thinner, larger, or more athletic than described. The outfit MUST realistically drape and fit this specified body type. All other instructions are secondary to this rule.
2.  **Preserve Identity & Scene:** You ABSOLUTELY MUST preserve the subject's face, hair, skin tone, body pose, and the original background from the subject image. The final image should look like it was taken in the same location. Do not change the person's identity.
3.  **Fit the Outfit:** Intelligently fit the outfit from the second image onto the subject's body. The outfit should follow the contours of their body and pose naturally. Pay close attention to fabric drape, folds, and wrinkles to make it look realistic.
4.  **Realistic Integration:** Adjust the lighting, shadows, and colors of the outfit to perfectly match the lighting conditions of the subject's photo. The outfit must cast realistic shadows on the body and the environment.
5.  **Complete Replacement:** The new outfit must completely REPLACE the clothing the subject is currently wearing. If the outfit image contains an item that corresponds to an item the subject is wearing (e.g., both images contain a hat, or the outfit has glasses and the person is wearing glasses), you MUST replace the subject's original item with the new one. Ensure a complete replacement, leaving no parts of the original item visible.
6.  **Clean Output:** The final output must ONLY be the composed image. Do not add any text, logos, watermarks, or other artifacts.

**CRITICAL NEGATIVE CONSTRAINTS (Things to ABSOLUTELY AVOID):**
- **DO NOT** alter the subject's face, facial features, hair, or skin tone in any way
- **DO NOT** change the background, lighting environment, or scene from the subject's photo
- **DO NOT** add any text, logos, watermarks, branding, or digital artifacts to the final image
- **DO NOT** generate an image where the person's body type differs from the specified '${bodyBuild}' build
- **DO NOT** leave any part of the original clothing visible under or through the new outfit
- **DO NOT** change the subject's pose, hand positions, or body positioning
- **DO NOT** add accessories, jewelry, or items not present in the outfit image
- **DO NOT** modify the subject's age, gender presentation, or physical characteristics
- **DO NOT** create unrealistic proportions or impossible clothing fits
- **DO NOT** generate multiple people if only one person exists in the subject image

Execute this task with the highest degree of photorealism, paying special attention to the unbreakable rule of body build fidelity${selectedColor ? ' and the critical color matching requirement' : ''}.
`;

  console.log('Sending images and prompt to OpenRouter...');
  
  // Use OpenRouter as the primary method
  try {
    return await generateTryOnImageWithOpenRouter(
      subjectImagePart,
      outfitImagePart,
      prompt,
      openRouterApiKey,
      originalWidth,
      originalHeight,
      MAX_DIMENSION
    );
  } catch (openRouterError: any) {
    console.error('🔥 OpenRouter API failed:', openRouterError);
    throw new Error(`Virtual try-on generation failed: ${openRouterError.message}`);
  }
};