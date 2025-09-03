import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../contexts/AppContext';
import { generateEnhancedImage, extractOutfitFromImage } from '../services/enhancedGeminiService';
import ImageUploader from '../components/ImageUploader';
import Spinner from '../components/Spinner';
import { FiRotateCw, FiDownload, FiTrash2 } from 'react-icons/fi';


const VirtualTryOnPage: React.FC = () => {
  const { t } = useTranslation('pages');
  const { state, updateVirtualTryOn, saveImage, clearFeatureState } = useAppContext();
  const { virtualTryOn } = state;

  const bodyBuildOptions = [
    t('virtualTryOn.bodyBuild.slim'),
    t('virtualTryOn.bodyBuild.athletic'),
    t('virtualTryOn.bodyBuild.average'),
    t('virtualTryOn.bodyBuild.curvy'),
    t('virtualTryOn.bodyBuild.plusSize')
  ];
  
  const angleOptions = [
    { value: 'front', label: t('virtualTryOn.viewAngle.front') },
    { value: 'side', label: t('virtualTryOn.viewAngle.side') },
    { value: '3quarter', label: t('virtualTryOn.viewAngle.threeFourth') },
    { value: 'back', label: t('virtualTryOn.viewAngle.back') }
  ];
  
  const [editPrompt, setEditPrompt] = useState('');
  const [showOutfitExtractor, setShowOutfitExtractor] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');

  const handleGenerate = useCallback(async () => {
    if (!virtualTryOn.subjectImage || !virtualTryOn.outfitImage) {
      alert(t('virtualTryOn.errors.uploadBoth') || 'Please upload both your photo and an outfit image.');
      return;
    }

    updateVirtualTryOn({ isProcessing: true });

    try {
      const prompt = `Generate a virtual try-on image showing the person wearing the outfit. ${
        virtualTryOn.selectedAngle !== 'front' ? `Show ${virtualTryOn.selectedAngle} angle view.` : ''
      } Body build: ${virtualTryOn.bodyBuild}. ${editPrompt ? `Additional instructions: ${editPrompt}` : ''}`;

      const result = await generateEnhancedImage(
        virtualTryOn.subjectImage,
        virtualTryOn.outfitImage,
        editPrompt,
        'virtual-tryon',
        state.apiKey,
        {
          angle: virtualTryOn.selectedAngle,
          bodyBuild: virtualTryOn.bodyBuild
        }
      );

      updateVirtualTryOn({ resultImage: result, isProcessing: false });
    } catch (error) {
      console.error('Virtual try-on failed:', error);
      updateVirtualTryOn({ isProcessing: false });
      alert(t('virtualTryOn.errors.generateFailed') || 'Failed to generate try-on image. Please try again.');
    }
  }, [virtualTryOn, editPrompt, state.apiKey, updateVirtualTryOn]);

  const handleSaveImage = () => {
    if (virtualTryOn.resultImage) {
      saveImage(virtualTryOn.resultImage);
      alert(t('virtualTryOn.success.imageSaved') || 'Image saved to your gallery!');
    }
  };

  const handleClear = () => {
    clearFeatureState('virtualTryOn');
    setEditPrompt('');
  };

  const handleExtractOutfit = async () => {
    if (!virtualTryOn.subjectImage) {
      alert(t('virtualTryOn.errors.uploadPhotoFirst') || 'Please upload your photo first to extract outfit from it.');
      return;
    }

    if (!state.apiKey) {
      alert('Please configure your API key in Settings to use outfit extraction.');
      return;
    }

    setIsLoading(true);
    setLoadingMessage('🎽 Extracting outfit from your photo...');

    try {
      const result = await extractOutfitFromImage(virtualTryOn.subjectImage, state.apiKey);
      
      if (result.success && result.extractedOutfit) {
        updateVirtualTryOn({ outfitImage: result.extractedOutfit });
        alert('✅ ' + result.message);
      } else {
        alert('⚠️ ' + result.message);
      }
    } catch (error) {
      console.error('Outfit extraction error:', error);
      alert('❌ Failed to extract outfit. Please try uploading a clear photo with visible clothing.');
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  };

  const handleSaveExtractedOutfit = () => {
    if (virtualTryOn.outfitImage && virtualTryOn.outfitImage.startsWith('data:image')) {
      saveImage(virtualTryOn.outfitImage);
      alert('✅ Extracted outfit saved to your gallery!');
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm p-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">{t('virtualTryOn.title')}</h1>
        <p className="text-gray-600">{t('virtualTryOn.subtitle')}</p>
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
              id="subject-image"
              label={t('virtualTryOn.sections.yourPhoto')}
              onFileSelect={(file) => {
                const imageUrl = URL.createObjectURL(file);
                updateVirtualTryOn({ subjectImage: imageUrl });
              }}
              imageUrl={virtualTryOn.subjectImage}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="space-y-3">
              <ImageUploader
                id="outfit-image"
                label={t('virtualTryOn.sections.outfitImage')}
                onFileSelect={(file) => {
                  const imageUrl = URL.createObjectURL(file);
                  updateVirtualTryOn({ outfitImage: imageUrl });
                }}
                imageUrl={virtualTryOn.outfitImage}
              />
              <div className="text-center space-y-2">
                <button
                  onClick={handleExtractOutfit}
                  className="text-sm px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors block w-full"
                  disabled={!virtualTryOn.subjectImage}
                >
                  {t('virtualTryOn.extractOutfit') || 'Extract Outfit from My Photo'}
                </button>
                {virtualTryOn.outfitImage && virtualTryOn.outfitImage.startsWith('data:image') && (
                  <button
                    onClick={handleSaveExtractedOutfit}
                    className="text-sm px-4 py-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors block w-full"
                  >
                    {t('virtualTryOn.saveExtracted') || '💾 Save Extracted Outfit'}
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl p-4 shadow-sm"
        >
          <h3 className="font-semibold text-gray-800 mb-4">{t('virtualTryOn.sections.settings')}</h3>
          
          <div className="space-y-4">
            {/* Body Build */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t('virtualTryOn.bodyBuild.label')}</label>
              <select
                value={virtualTryOn.bodyBuild}
                onChange={(e) => updateVirtualTryOn({ bodyBuild: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                {bodyBuildOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>

            {/* Angle Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t('virtualTryOn.viewAngle.label')}</label>
              <select
                value={virtualTryOn.selectedAngle}
                onChange={(e) => updateVirtualTryOn({ selectedAngle: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                {angleOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>

            {/* Edit Prompt */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t('virtualTryOn.additionalInstructions.label')}</label>
              <textarea
                value={editPrompt}
                onChange={(e) => setEditPrompt(e.target.value)}
                placeholder={t('virtualTryOn.additionalInstructions.placeholder')}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
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
            disabled={virtualTryOn.isProcessing || !virtualTryOn.subjectImage || !virtualTryOn.outfitImage}
            className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-6 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {virtualTryOn.isProcessing ? (
              <>
                <Spinner />
                <span>{t('common.generating') || 'Generating...'}</span>
              </>
            ) : (
              <>
                <FiRotateCw size={20} />
                <span>{t('virtualTryOn.generateTryOn') || 'Generate Try-On'}</span>
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
        {virtualTryOn.resultImage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl p-4 shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800">{t('virtualTryOn.sections.result')}</h3>
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
                src={virtualTryOn.resultImage}
                alt={t('virtualTryOn.resultAlt') || 'Virtual try-on result'}
                className="w-full h-auto"
              />
            </div>
          </motion.div>
        )}
      </div>

      {/* Loading Overlay for Outfit Extraction */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-8 max-w-sm mx-4 text-center">
            <Spinner />
            <p className="mt-4 text-lg font-semibold text-gray-800">{loadingMessage}</p>
            <p className="mt-2 text-sm text-gray-600">{t('common.loading.takeMoment') || 'This may take a moment...'}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default VirtualTryOnPage;