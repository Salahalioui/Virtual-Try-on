import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useAppContext } from '../contexts/AppContext';
import { generateEnhancedImage } from '../services/enhancedGeminiService';
import ImageUploader from '../components/ImageUploader';
import Spinner from '../components/Spinner';
import { FiImage, FiDownload, FiTrash2, FiMove } from 'react-icons/fi';

const placementModes = [
  { value: 'auto', label: 'Auto Placement', description: 'AI decides the best position' },
  { value: 'manual', label: 'Manual Prompt', description: 'Describe where to place yourself' }
];

const backgroundPresets = [
  'Beautiful beach at sunset',
  'Modern city skyline',
  'Cozy coffee shop',
  'Mountain landscape',
  'Professional office',
  'Tropical paradise',
  'Urban street art',
  'Elegant restaurant',
  'Concert stage',
  'Nature park'
];

const BackgroundPage: React.FC = () => {
  const { state, updateBackground, saveImage, clearFeatureState } = useAppContext();
  const { background } = state;
  
  const [selectedPreset, setSelectedPreset] = useState('');
  const [showPresets, setShowPresets] = useState(false);
  const [placementPrompt, setPlacementPrompt] = useState('');

  const handleGenerate = useCallback(async () => {
    if (!background.userPhoto) {
      alert('Please upload your photo first.');
      return;
    }

    if (!background.backgroundImage && !background.backgroundPrompt && !selectedPreset) {
      alert('Please either upload a background image, write a description, or select a preset background.');
      return;
    }

    updateBackground({ isProcessing: true });

    try {
      let prompt = 'Generate a realistic image showing the person in the new background. ';
      
      if (background.backgroundImage) {
        prompt += 'Place the person in the background from the reference image. ';
      }
      
      if (background.backgroundPrompt) {
        prompt += `Background description: ${background.backgroundPrompt}. `;
      }
      
      if (selectedPreset) {
        prompt += `Background setting: ${selectedPreset}. `;
      }
      
      if (background.placementMode === 'manual' && placementPrompt) {
        prompt += `Placement instructions: ${placementPrompt}. `;
      } else {
        prompt += 'Place the person naturally in the scene with appropriate lighting and shadows. ';
      }
      
      prompt += 'Ensure realistic lighting, shadows, and perspective. The person should look naturally integrated into the background.';

      const result = await generateEnhancedImage(
        background.userPhoto,
        background.backgroundImage,
        prompt,
        'background',
        state.apiKey
      );

      updateBackground({ resultImage: result, isProcessing: false });
    } catch (error) {
      console.error('Background change failed:', error);
      updateBackground({ isProcessing: false });
      alert('Failed to change background. Please try again.');
    }
  }, [background, selectedPreset, placementPrompt, state.apiKey, updateBackground]);

  const handleSaveImage = () => {
    if (background.resultImage) {
      saveImage(background.resultImage);
      alert('Image saved to your gallery!');
    }
  };

  const handleClear = () => {
    clearFeatureState('background');
    setSelectedPreset('');
    setPlacementPrompt('');
  };

  const handlePresetSelect = (preset: string) => {
    setSelectedPreset(preset);
    setShowPresets(false);
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm p-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Background Changer</h1>
        <p className="text-gray-600">Transform your environment with AI magic!</p>
      </div>

      <div className="flex-1 overflow-auto p-4 space-y-6">
        {/* Image Uploaders */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <ImageUploader
              id="user-photo"
              label="Your Photo"
              onFileSelect={(file) => {
                const imageUrl = URL.createObjectURL(file);
                updateBackground({ userPhoto: imageUrl });
              }}
              imageUrl={background.userPhoto}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <ImageUploader
              id="background-image"
              label="Background Image (Optional)"
              onFileSelect={(file) => {
                const imageUrl = URL.createObjectURL(file);
                updateBackground({ backgroundImage: imageUrl });
              }}
              imageUrl={background.backgroundImage}
            />
          </motion.div>
        </div>

        {/* Background Options */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl p-4 shadow-sm"
        >
          <h3 className="font-semibold text-gray-800 mb-4">Background Options</h3>
          
          <div className="space-y-4">
            {/* Placement Mode */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Placement Mode</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {placementModes.map((mode) => (
                  <button
                    key={mode.value}
                    onClick={() => updateBackground({ placementMode: mode.value as 'auto' | 'manual' })}
                    className={`p-3 text-left rounded-lg border-2 transition-all ${
                      background.placementMode === mode.value
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-green-300'
                    }`}
                  >
                    <div className="font-medium text-gray-800">{mode.label}</div>
                    <div className="text-sm text-gray-600">{mode.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Manual Placement Prompt */}
            {background.placementMode === 'manual' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Placement Instructions</label>
                <textarea
                  value={placementPrompt}
                  onChange={(e) => setPlacementPrompt(e.target.value)}
                  placeholder="e.g., standing in the center, sitting on the left side, walking towards the camera..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                  rows={2}
                />
              </div>
            )}

            {/* Background Presets */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">Popular Backgrounds</label>
                <button
                  onClick={() => setShowPresets(!showPresets)}
                  className="text-green-500 text-sm hover:text-green-600"
                >
                  {showPresets ? 'Hide' : 'Show'} Presets
                </button>
              </div>
              
              {showPresets && (
                <div className="grid grid-cols-2 gap-2 p-3 border border-gray-200 rounded-lg bg-gray-50">
                  {backgroundPresets.map((preset) => (
                    <button
                      key={preset}
                      onClick={() => handlePresetSelect(preset)}
                      className={`p-2 text-sm rounded-lg transition-all ${
                        selectedPreset === preset
                          ? 'bg-green-500 text-white'
                          : 'bg-white hover:bg-green-50 border border-gray-200'
                      }`}
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              )}
              
              {selectedPreset && (
                <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-lg">
                  <span className="text-sm text-green-800">Selected: {selectedPreset}</span>
                  <button
                    onClick={() => setSelectedPreset('')}
                    className="ml-2 text-green-600 hover:text-green-800 text-sm"
                  >
                    Clear
                  </button>
                </div>
              )}
            </div>

            {/* Custom Background Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Custom Background Description (Optional)</label>
              <textarea
                value={background.backgroundPrompt}
                onChange={(e) => updateBackground({ backgroundPrompt: e.target.value })}
                placeholder="Describe the background you want... e.g., 'a sunny park with trees and flowers'"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                rows={3}
              />
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <button
            onClick={handleGenerate}
            disabled={background.isProcessing || !background.userPhoto}
            className="flex-1 bg-gradient-to-r from-green-500 to-teal-500 text-white py-3 px-6 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {background.isProcessing ? (
              <>
                <Spinner />
                <span>Transforming...</span>
              </>
            ) : (
              <>
                <FiImage size={20} />
                <span>Change Background</span>
              </>
            )}
          </button>

          <button
            onClick={handleClear}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 flex items-center justify-center space-x-2"
          >
            <FiTrash2 size={20} />
            <span>Clear</span>
          </button>
        </motion.div>

        {/* Result */}
        {background.resultImage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl p-4 shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800">Your New Environment</h3>
              <button
                onClick={handleSaveImage}
                className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                <FiDownload size={16} />
                <span>Save</span>
              </button>
            </div>
            <div className="rounded-lg overflow-hidden">
              <img
                src={background.resultImage}
                alt="Background change result"
                className="w-full h-auto"
              />
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default BackgroundPage;