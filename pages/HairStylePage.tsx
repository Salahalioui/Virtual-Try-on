import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../contexts/AppContext';
import { generateEnhancedImage } from '../services/enhancedGeminiService';
import ImageUploader from '../components/ImageUploader';
import Spinner from '../components/Spinner';
import { FiScissors, FiDownload, FiTrash2, FiUser } from 'react-icons/fi';


const popularStyles = {
  male: [
    'Modern fade haircut',
    'Classic pompadour',
    'Textured quiff',
    'Buzz cut',
    'Side part',
    'Man bun',
    'Undercut'
  ],
  female: [
    'Long layered hair',
    'Bob cut',
    'Pixie cut',
    'Beach waves',
    'Straight hair',
    'Curly hair',
    'Braided style'
  ],
  unisex: [
    'Short crop',
    'Medium length',
    'Shag cut',
    'Wavy style',
    'Straight cut',
    'Natural texture'
  ]
};

const HairStylePage: React.FC = () => {
  const { t } = useTranslation('pages');
  const { state, updateHairStyle, saveImage, clearFeatureState } = useAppContext();
  const { hairStyle } = state;

  const genderOptions = [
    { value: 'male', label: t('hairStyle.gender.male') },
    { value: 'female', label: t('hairStyle.gender.female') },
    { value: 'unisex', label: t('hairStyle.gender.unisex') }
  ];
  
  const [selectedStyle, setSelectedStyle] = useState('');
  const [showStylePicker, setShowStylePicker] = useState(false);

  const handleGenerate = useCallback(async () => {
    if (!hairStyle.userPhoto) {
      alert(t('hairStyle.errors.uploadPhoto') || 'Please upload your photo first.');
      return;
    }

    if (!hairStyle.hairStyleImage && !hairStyle.hairStylePrompt && !selectedStyle) {
      alert(t('hairStyle.errors.selectStyle') || 'Please either upload a hair style image, write a description, or select a popular style.');
      return;
    }

    updateHairStyle({ isProcessing: true });

    try {
      let prompt = 'Generate a realistic hair styling result showing the person with the new hairstyle. ';
      
      if (hairStyle.hairStyleImage) {
        prompt += 'Apply the hairstyle from the reference image to the person. ';
      }
      
      if (hairStyle.hairStylePrompt) {
        prompt += `Style description: ${hairStyle.hairStylePrompt}. `;
      }
      
      if (selectedStyle) {
        prompt += `Apply this hairstyle: ${selectedStyle}. `;
      }
      
      prompt += `Gender preference: ${hairStyle.selectedGender}. Keep the person's facial features unchanged, only modify the hair and facial hair.`;

      const result = await generateEnhancedImage(
        hairStyle.userPhoto,
        hairStyle.hairStyleImage,
        hairStyle.hairStylePrompt,
        'hair-style',
        state.apiKey,
        {
          gender: hairStyle.selectedGender,
          styleDescription: selectedStyle || hairStyle.hairStylePrompt
        }
      );

      updateHairStyle({ resultImage: result, isProcessing: false });
    } catch (error) {
      console.error('Hair styling failed:', error);
      updateHairStyle({ isProcessing: false });
      alert(t('hairStyle.errors.generateFailed') || 'Failed to generate hair style. Please try again.');
    }
  }, [hairStyle, selectedStyle, state.apiKey, updateHairStyle]);

  const handleSaveImage = () => {
    if (hairStyle.resultImage) {
      saveImage(hairStyle.resultImage);
      alert(t('hairStyle.success.imageSaved') || 'Image saved to your gallery!');
    }
  };

  const handleClear = () => {
    clearFeatureState('hairStyle');
    setSelectedStyle('');
  };

  const handleStyleSelect = (style: string) => {
    setSelectedStyle(style);
    setShowStylePicker(false);
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm p-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">{t('hairStyle.title')}</h1>
        <p className="text-gray-600">{t('hairStyle.subtitle')}</p>
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
              label={t('hairStyle.sections.yourPhoto')}
              onFileSelect={(file) => {
                const imageUrl = URL.createObjectURL(file);
                updateHairStyle({ userPhoto: imageUrl });
              }}
              imageUrl={hairStyle.userPhoto}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <ImageUploader
              id="hair-style-image"
              label={t('hairStyle.sections.hairReference')}
              onFileSelect={(file) => {
                const imageUrl = URL.createObjectURL(file);
                updateHairStyle({ hairStyleImage: imageUrl });
              }}
              imageUrl={hairStyle.hairStyleImage}
            />
          </motion.div>
        </div>

        {/* Style Options */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl p-4 shadow-sm"
        >
          <h3 className="font-semibold text-gray-800 mb-4">{t('hairStyle.sections.styleOptions')}</h3>
          
          <div className="space-y-4">
            {/* Gender Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t('hairStyle.styleCategory')}</label>
              <select
                value={hairStyle.selectedGender}
                onChange={(e) => updateHairStyle({ selectedGender: e.target.value as 'male' | 'female' | 'unisex' })}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {genderOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>

            {/* Popular Styles */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">{t('hairStyle.popularStyles.label')}</label>
                <button
                  onClick={() => setShowStylePicker(!showStylePicker)}
                  className="text-blue-500 text-sm hover:text-blue-600"
                >
                  {showStylePicker ? t('hairStyle.popularStyles.hide') : t('hairStyle.popularStyles.show')}
                </button>
              </div>
              
              {showStylePicker && (
                <div className="grid grid-cols-2 gap-2 p-3 border border-gray-200 rounded-lg bg-gray-50">
                  {popularStyles[hairStyle.selectedGender].map((style) => (
                    <button
                      key={style}
                      onClick={() => handleStyleSelect(style)}
                      className={`p-2 text-sm rounded-lg transition-all ${
                        selectedStyle === style
                          ? 'bg-blue-500 text-white'
                          : 'bg-white hover:bg-blue-50 border border-gray-200'
                      }`}
                    >
                      {style}
                    </button>
                  ))}
                </div>
              )}
              
              {selectedStyle && (
                <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded-lg">
                  <span className="text-sm text-blue-800">{t('hairStyle.popularStyles.selected')}: {selectedStyle}</span>
                  <button
                    onClick={() => setSelectedStyle('')}
                    className="ml-2 text-blue-600 hover:text-blue-800 text-sm"
                  >
                    {t('common.clear') || 'Clear'}
                  </button>
                </div>
              )}
            </div>

            {/* Custom Prompt */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t('hairStyle.customDescription.label')}</label>
              <textarea
                value={hairStyle.hairStylePrompt}
                onChange={(e) => updateHairStyle({ hairStylePrompt: e.target.value })}
                placeholder={t('hairStyle.customDescription.placeholder')}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
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
            disabled={hairStyle.isProcessing || !hairStyle.userPhoto}
            className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-3 px-6 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {hairStyle.isProcessing ? (
              <>
                <Spinner />
                <span>{t('common.loading.styling') || 'Styling...'}</span>
              </>
            ) : (
              <>
                <FiScissors size={20} />
                <span>{t('hairStyle.applyStyle') || 'Apply Style'}</span>
              </>
            )}
          </button>

          <button
            onClick={handleClear}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 flex items-center justify-center space-x-2"
          >
            <FiTrash2 size={20} />
            <span>{t('common.clear') || 'Clear'}</span>
          </button>
        </motion.div>

        {/* Result */}
        {hairStyle.resultImage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl p-4 shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800">{t('hairStyle.sections.result')}</h3>
              <button
                onClick={handleSaveImage}
                className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                <FiDownload size={16} />
                <span>{t('common.save') || 'Save'}</span>
              </button>
            </div>
            <div className="rounded-lg overflow-hidden">
              <img
                src={hairStyle.resultImage}
                alt={t('hairStyle.resultAlt') || 'Hair styling result'}
                className="w-full h-auto"
              />
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default HairStylePage;