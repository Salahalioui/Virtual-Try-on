/**
 * Optimized Gemini Service following Google AI best practices
 * Based on official documentation: https://ai.google.dev/gemini-api/docs/image-generation
 */

// Prompt templates following Google's best practices
const PROMPT_TEMPLATES = {
  virtualTryOn: {
    photorealistic: (angle: string, bodyBuild: string, additionalPrompt?: string) => `
A photorealistic ${angle === 'front' ? 'straight-on portrait' : angle === 'side' ? 'side profile' : angle === '3quarter' ? '3/4 view portrait' : 'back view'} of a ${bodyBuild.toLowerCase()}-build person wearing the outfit from the reference image. The scene shows a natural indoor setting with soft, even lighting that highlights fabric textures and fit details. The person has a confident, natural expression. Captured with professional portrait lighting, emphasizing the clothing's drape, texture, and how it complements the person's body type. The image should show realistic fabric behavior, proper fit, and natural shadows. High-quality fashion photography style with crisp details and accurate colors.${additionalPrompt ? ` Additional styling: ${additionalPrompt}` : ''}
    `,
    editing: (angle: string, bodyBuild: string, additionalPrompt?: string) => `
Transform this person to wear the outfit shown in the reference image. Create a ${angle === 'front' ? 'front-facing' : angle === 'side' ? 'side profile' : angle === '3quarter' ? '3/4 angle' : 'back-facing'} view that shows how the clothing naturally fits a ${bodyBuild.toLowerCase()}-build body type. Maintain the person's facial features, skin tone, and body proportions while seamlessly integrating the new outfit. The clothing should drape naturally with realistic wrinkles, shadows, and fabric behavior. Ensure proper fit and proportions for the body type. Use natural lighting that enhances both the person and the clothing details.${additionalPrompt ? ` Style adjustments: ${additionalPrompt}` : ''}
    `
  },
  
  hairStyling: {
    withReference: (gender: string, customPrompt?: string) => `
Transform this person's hairstyle to match the style shown in the reference image. Maintain the person's facial features, skin tone, and bone structure while seamlessly changing only the hair. The new hairstyle should complement ${gender === 'male' ? 'masculine' : gender === 'female' ? 'feminine' : 'their'} facial features and suit their face shape. Use natural hair textures and colors that look realistic. The styling should appear professionally done with natural lighting that showcases hair texture and movement.${customPrompt ? ` Additional styling notes: ${customPrompt}` : ''}
    `,
    withDescription: (gender: string, styleDescription: string, customPrompt?: string) => `
Give this person a new hairstyle: ${styleDescription}. Create a photorealistic result that maintains the person's facial features, skin tone, and bone structure while only changing the hair. The hairstyle should complement ${gender === 'male' ? 'masculine' : gender === 'female' ? 'feminine' : 'their'} features and face shape. Use natural hair colors and textures that look professionally styled. The lighting should be soft and natural, highlighting the hair's texture, volume, and movement.${customPrompt ? ` Styling preferences: ${customPrompt}` : ''}
    `
  },
  
  backgroundChange: {
    autoPlacement: (backgroundDescription: string, customPrompt?: string) => `
Place this person naturally in a new environment: ${backgroundDescription}. Position them appropriately within the scene with realistic perspective, scale, and lighting that matches the background. Create natural shadows and reflections that integrate the person seamlessly into the environment. The person should appear to belong in this setting with proper atmospheric perspective and color harmony. Use professional photography lighting that unifies the subject and background.${customPrompt ? ` Scene details: ${customPrompt}` : ''}
    `,
    manualPlacement: (backgroundDescription: string, placementInstructions: string, customPrompt?: string) => `
Place this person in a new environment: ${backgroundDescription}. Position them as follows: ${placementInstructions}. Ensure realistic perspective, proper scaling, and lighting that matches the background ambiance. Create natural shadows, reflections, and atmospheric effects that make the person appear naturally integrated into the scene. The composition should feel authentic with proper depth of field and color grading.${customPrompt ? ` Additional scene notes: ${customPrompt}` : ''}
    `
  }
};

// Enhanced service function using official API patterns
export const generateOptimizedImage = async (
  userImageUrl: string,
  referenceImageUrl: string | null,
  feature: 'virtual-tryon' | 'hair-style' | 'background',
  options: {
    angle?: string;
    bodyBuild?: string;
    gender?: string;
    styleDescription?: string;
    backgroundDescription?: string;
    placementMode?: 'auto' | 'manual';
    placementInstructions?: string;
    customPrompt?: string;
  },
  apiKey: string
): Promise<string> => {
  try {
    // Convert image URLs to base64 for API consumption
    const userImageBase64 = await imageUrlToBase64(userImageUrl);
    const referenceImageBase64 = referenceImageUrl ? await imageUrlToBase64(referenceImageUrl) : null;

    // Build prompt based on feature and options
    let prompt = '';
    
    switch (feature) {
      case 'virtual-tryon':
        prompt = referenceImageBase64 
          ? PROMPT_TEMPLATES.virtualTryOn.editing(
              options.angle || 'front', 
              options.bodyBuild || 'Average', 
              options.customPrompt
            )
          : PROMPT_TEMPLATES.virtualTryOn.photorealistic(
              options.angle || 'front', 
              options.bodyBuild || 'Average', 
              options.customPrompt
            );
        break;
        
      case 'hair-style':
        prompt = referenceImageBase64
          ? PROMPT_TEMPLATES.hairStyling.withReference(options.gender || 'unisex', options.customPrompt)
          : PROMPT_TEMPLATES.hairStyling.withDescription(
              options.gender || 'unisex', 
              options.styleDescription || 'a modern, stylish haircut', 
              options.customPrompt
            );
        break;
        
      case 'background':
        prompt = options.placementMode === 'manual' && options.placementInstructions
          ? PROMPT_TEMPLATES.backgroundChange.manualPlacement(
              options.backgroundDescription || 'a beautiful outdoor setting',
              options.placementInstructions,
              options.customPrompt
            )
          : PROMPT_TEMPLATES.backgroundChange.autoPlacement(
              options.backgroundDescription || 'a beautiful outdoor setting',
              options.customPrompt
            );
        break;
    }

    // Prepare request payload for OpenRouter chat completions format
    const content = [];
    
    // Add the text prompt
    content.push({ type: 'text', text: prompt });
    
    // Add user image
    content.push({
      type: 'image_url',
      image_url: {
        url: `data:${getMimeTypeFromBase64(userImageBase64)};base64,${userImageBase64}`
      }
    });
    
    // Add reference image if provided
    if (referenceImageBase64) {
      content.push({
        type: 'image_url',
        image_url: {
          url: `data:${getMimeTypeFromBase64(referenceImageBase64)};base64,${referenceImageBase64}`
        }
      });
    }

    // Make API call using OpenRouter (following official patterns)
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': window.location.origin,
        'X-Title': 'StyleAI Virtual Styling Assistant'
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash-image-preview',
        messages: [{
          role: 'user',
          content: content
        }],
        modalities: ["image", "text"],
        max_tokens: 4096,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`API request failed: ${response.status} - ${errorData}`);
    }

    const data = await response.json();
    
    // Extract image from OpenRouter response format
    if (data.choices && data.choices[0] && data.choices[0].message) {
      const message = data.choices[0].message;
      
      // Check for images in the response
      if (message.images && message.images.length > 0) {
        const imageData = message.images[0].image_url.url;
        return imageData; // Already a data URL
      }
      
      // Also check if content contains image data (alternative format)
      if (message.content && typeof message.content === 'string' && message.content.includes('data:image')) {
        return message.content;
      }
    }

    throw new Error('No image data found in response');

  } catch (error) {
    console.error(`${feature} generation failed:`, error);
    throw error;
  }
};

// Helper function to convert image URL to base64
async function imageUrlToBase64(url: string): Promise<string> {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        // Extract just the base64 part (remove data:image/...;base64, prefix)
        const base64 = dataUrl.split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Error converting URL to base64:', error);
    throw new Error('Failed to process image');
  }
}

// Helper to determine MIME type from base64 data
function getMimeTypeFromBase64(base64: string): string {
  // Simple heuristic based on base64 start characters
  if (base64.startsWith('/9j/')) return 'image/jpeg';
  if (base64.startsWith('iVBORw0K')) return 'image/png';
  if (base64.startsWith('R0lGOD')) return 'image/gif';
  if (base64.startsWith('UklGR')) return 'image/webp';
  
  // Default to JPEG
  return 'image/jpeg';
}

// Export individual prompt generators for advanced usage
export const getVirtualTryOnPrompt = (
  angle: string, 
  bodyBuild: string, 
  additionalPrompt?: string, 
  isEditing: boolean = true
) => {
  return isEditing 
    ? PROMPT_TEMPLATES.virtualTryOn.editing(angle, bodyBuild, additionalPrompt)
    : PROMPT_TEMPLATES.virtualTryOn.photorealistic(angle, bodyBuild, additionalPrompt);
};

export const getHairStylePrompt = (
  gender: string, 
  customPrompt?: string, 
  styleDescription?: string, 
  hasReference: boolean = false
) => {
  return hasReference
    ? PROMPT_TEMPLATES.hairStyling.withReference(gender, customPrompt)
    : PROMPT_TEMPLATES.hairStyling.withDescription(gender, styleDescription || 'a modern, stylish haircut', customPrompt);
};

export const getBackgroundPrompt = (
  backgroundDescription: string, 
  customPrompt?: string, 
  placementInstructions?: string, 
  isManual: boolean = false
) => {
  return isManual && placementInstructions
    ? PROMPT_TEMPLATES.backgroundChange.manualPlacement(backgroundDescription, placementInstructions, customPrompt)
    : PROMPT_TEMPLATES.backgroundChange.autoPlacement(backgroundDescription, customPrompt);
};