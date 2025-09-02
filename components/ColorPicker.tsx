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
    <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl max-w-4xl max-h-[90vh] overflow-auto shadow-2xl border border-gray-200">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-purple-50 to-pink-50">
          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-1">🎨 Color Picker</h3>
            <p className="text-sm text-gray-600">Select a color from your photo to customize the outfit</p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white/80 hover:bg-white text-gray-500 hover:text-gray-700 text-xl flex items-center justify-center shadow-sm border transition-all duration-200 hover:scale-105"
          >
            ✕
          </button>
        </div>

        <div className="p-6">
          <div className="mb-6 flex flex-col sm:flex-row gap-4 items-center">
            <button
              onClick={activateEyeDropper}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 ${
                isActive 
                  ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white cursor-not-allowed' 
                  : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700'
              }`}
              disabled={isActive}
            >
              {isActive ? '👁️ Click on the image to pick a color' : '🎨 Activate Eye-Dropper'}
            </button>
            
            {selectedColor && (
              <div className="flex items-center gap-3 bg-gradient-to-r from-gray-50 to-white px-4 py-3 rounded-xl border border-gray-200 shadow-sm">
                <div 
                  className="w-10 h-10 rounded-lg border-2 border-gray-300 shadow-sm"
                  style={{ backgroundColor: selectedColor }}
                />
                <div className="flex flex-col">
                  <span className="font-mono text-sm font-semibold text-gray-700">{selectedColor}</span>
                  <span className="text-xs text-gray-500">Selected Color</span>
                </div>
                <button
                  onClick={resetSelection}
                  className="ml-2 px-3 py-1 text-xs font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
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
              <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-xl p-6 text-center shadow-md">
                <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">❌</span>
                </div>
                <h4 className="text-red-700 font-semibold mb-2">Could not load image</h4>
                <p className="text-sm text-red-600">Try uploading the image again or use a different photo</p>
              </div>
            )}
            
            {!imageError && (
              <canvas
                ref={canvasRef}
                onClick={handleCanvasClick}
                onMouseMove={handleMouseMove}
                className={`max-w-full border-2 rounded-xl shadow-lg transition-all duration-200 ${
                  isActive ? 'cursor-crosshair border-blue-400' : 'cursor-default border-gray-300'
                } ${!imageLoaded ? 'opacity-50' : 'hover:shadow-xl'}`}
                style={{
                  maxHeight: '450px',
                  objectFit: 'contain'
                }}
              />
            )}

            {isActive && imageLoaded && !imageError && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-xl text-center">
                <p className="text-sm font-medium text-blue-700">👆 Click anywhere on your photo to pick a color</p>
              </div>
            )}
            
            {!imageLoaded && !imageError && (
              <div className="mt-4 p-6 text-center">
                <div className="w-12 h-12 mx-auto mb-3 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
                <p className="text-sm text-gray-600 font-medium">Loading image for color picking...</p>
              </div>
            )}
          </div>

          {selectedColor && (
            <div className="mt-6 pt-6 border-t border-gray-100">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-4">
                  The AI will recolor the outfit to match this color in the final image
                </p>
                <button
                  onClick={onClose}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
                >
                  ✓ Use This Color
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