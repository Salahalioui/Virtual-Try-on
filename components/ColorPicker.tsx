/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useRef, useState, useCallback } from 'react';

interface ColorPickerProps {
  imageFile: File;
  onColorSelect: (color: string) => void;
  onClose: () => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ imageFile, onColorSelect, onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [isActive, setIsActive] = useState(false);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  // Create a stable URL from the file
  React.useEffect(() => {
    if (imageFile) {
      console.log('🖼️ Creating image URL from file for color picker');
      try {
        const url = URL.createObjectURL(imageFile);
        setImageUrl(url);
        setImageError(false);
        
        // Cleanup function to revoke the URL
        return () => {
          console.log('🧹 Cleaning up image URL for color picker');
          URL.revokeObjectURL(url);
        };
      } catch (error) {
        console.error('❌ Error creating image URL for color picker:', error);
        setImageError(true);
      }
    }
  }, [imageFile]);

  const handleImageLoad = useCallback((img: HTMLImageElement) => {
    console.log('🖼️ Image loaded for color picker');
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    try {
      // Set canvas dimensions to match image display size
      const displayWidth = Math.min(img.naturalWidth, 600);
      const displayHeight = (img.naturalHeight / img.naturalWidth) * displayWidth;
      
      canvas.width = displayWidth;
      canvas.height = displayHeight;
      
      // Draw image on canvas
      ctx.drawImage(img, 0, 0, displayWidth, displayHeight);
      setImageLoaded(true);
      setImageError(false);
      console.log('✅ Canvas ready for color picking');
    } catch (error) {
      console.error('❌ Error drawing image to canvas:', error);
      setImageError(true);
    }
  }, []);

  const handleImageError = useCallback(() => {
    console.error('❌ Failed to load image for color picker');
    setImageError(true);
    setImageLoaded(false);
  }, []);

  const getColorAtPosition = useCallback((x: number, y: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const canvasX = Math.floor((x - rect.left) * scaleX);
    const canvasY = Math.floor((y - rect.top) * scaleY);

    const imageData = ctx.getImageData(canvasX, canvasY, 1, 1);
    const [r, g, b] = imageData.data;

    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  }, []);

  const handleCanvasClick = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isActive) return;

    const color = getColorAtPosition(event.clientX, event.clientY);
    if (color) {
      setSelectedColor(color);
      onColorSelect(color);
      console.log('🎨 Selected color:', color);
    }
  }, [isActive, getColorAtPosition, onColorSelect]);

  const handleMouseMove = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isActive) return;
    setCursorPosition({ x: event.clientX, y: event.clientY });
  }, [isActive]);

  const activateEyeDropper = useCallback(() => {
    setIsActive(true);
    console.log('👁️ Eye-dropper activated');
  }, []);

  const resetSelection = useCallback(() => {
    setSelectedColor(null);
    setIsActive(false);
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] overflow-auto">
        <div className="p-4 border-b flex items-center justify-between">
          <h3 className="text-lg font-semibold">Pick a Color from Your Photo</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl"
          >
            ✕
          </button>
        </div>

        <div className="p-4">
          <div className="mb-4 flex gap-4 items-center">
            <button
              onClick={activateEyeDropper}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                isActive 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
              disabled={isActive}
            >
              {isActive ? '👁️ Click on the image to pick a color' : '🎨 Activate Eye-Dropper'}
            </button>
            
            {selectedColor && (
              <div className="flex items-center gap-2">
                <div 
                  className="w-8 h-8 rounded border-2 border-gray-300"
                  style={{ backgroundColor: selectedColor }}
                />
                <span className="font-mono text-sm">{selectedColor}</span>
                <button
                  onClick={resetSelection}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Reset
                </button>
              </div>
            )}
          </div>

          <div className="relative">
            {imageUrl && (
              <img
                ref={imageRef}
                src={imageUrl}
                alt="Color picker reference"
                className="hidden"
                onLoad={(e) => handleImageLoad(e.target as HTMLImageElement)}
                onError={handleImageError}
              />
            )}
            
            {imageError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                <p className="text-red-600 mb-2">❌ Could not load image for color picking</p>
                <p className="text-sm text-red-500">Try uploading the image again or use a different photo</p>
              </div>
            )}
            
            {!imageError && (
              <canvas
                ref={canvasRef}
                onClick={handleCanvasClick}
                onMouseMove={handleMouseMove}
                className={`max-w-full border rounded ${
                  isActive ? 'cursor-crosshair' : 'cursor-default'
                } ${!imageLoaded ? 'opacity-50' : ''}`}
                style={{
                  maxHeight: '400px',
                  objectFit: 'contain'
                }}
              />
            )}

            {isActive && imageLoaded && !imageError && (
              <div className="mt-2 text-sm text-gray-600 text-center">
                Click anywhere on your photo to pick a color for the outfit
              </div>
            )}
            
            {!imageLoaded && !imageError && (
              <div className="mt-2 text-sm text-gray-500 text-center">
                Loading image for color picking...
              </div>
            )}
          </div>

          {selectedColor && (
            <div className="mt-4 pt-4 border-t">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">
                  The AI will recolor the outfit to match this color in the final image
                </p>
                <button
                  onClick={onClose}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 font-medium"
                >
                  Use This Color
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ColorPicker;