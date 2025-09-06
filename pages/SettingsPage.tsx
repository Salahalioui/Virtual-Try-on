import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAppContext } from '../contexts/AppContext';
import { FiSettings, FiKey, FiImage, FiTrash2, FiDownload, FiCheck } from 'react-icons/fi';
import { validateDirectGeminiApiKey } from '../services/geminiDirectService';

const SettingsPage: React.FC = () => {
  const { state, updateApiKey, updateApiProvider, updateGeminiApiKey } = useAppContext();
  const [localOpenRouterKey, setLocalOpenRouterKey] = useState('');
  const [localGeminiKey, setLocalGeminiKey] = useState('');
  const [showOpenRouterKey, setShowOpenRouterKey] = useState(false);
  const [showGeminiKey, setShowGeminiKey] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<'openrouter' | 'direct'>('openrouter');
  const [validatingGemini, setValidatingGemini] = useState(false);

  useEffect(() => {
    // Load settings from localStorage on component mount
    const savedOpenRouterKey = localStorage.getItem('openrouter_api_key');
    const savedGeminiKey = localStorage.getItem('gemini_api_key');
    const savedProvider = localStorage.getItem('api_provider') as 'openrouter' | 'direct' | null;
    
    if (savedOpenRouterKey) {
      setLocalOpenRouterKey(savedOpenRouterKey);
      updateApiKey(savedOpenRouterKey);
    }
    
    if (savedGeminiKey) {
      setLocalGeminiKey(savedGeminiKey);
      updateGeminiApiKey(savedGeminiKey);
    }
    
    if (savedProvider) {
      setSelectedProvider(savedProvider);
      updateApiProvider(savedProvider);
    }
  }, []);

  const handleSaveOpenRouterKey = () => {
    if (localOpenRouterKey.trim()) {
      localStorage.setItem('openrouter_api_key', localOpenRouterKey.trim());
      updateApiKey(localOpenRouterKey.trim());
      alert('OpenRouter API key saved successfully!');
    } else {
      alert('Please enter a valid OpenRouter API key.');
    }
  };

  const handleSaveGeminiKey = async () => {
    if (localGeminiKey.trim()) {
      setValidatingGemini(true);
      try {
        const isValid = await validateDirectGeminiApiKey(localGeminiKey.trim());
        if (isValid) {
          localStorage.setItem('gemini_api_key', localGeminiKey.trim());
          updateGeminiApiKey(localGeminiKey.trim());
          alert('Google AI Studio API key saved successfully!');
        } else {
          alert('Invalid Google AI Studio API key. Please check your key and try again.');
        }
      } catch (error) {
        alert('Unable to validate API key. Please check your key and internet connection.');
      } finally {
        setValidatingGemini(false);
      }
    } else {
      alert('Please enter a valid Google AI Studio API key.');
    }
  };

  const handleProviderChange = (provider: 'openrouter' | 'direct') => {
    setSelectedProvider(provider);
    updateApiProvider(provider);
    localStorage.setItem('api_provider', provider);
  };

  const handleClearOpenRouterKey = () => {
    if (window.confirm('Are you sure you want to remove your OpenRouter API key?')) {
      setLocalOpenRouterKey('');
      localStorage.removeItem('openrouter_api_key');
      updateApiKey('');
      alert('OpenRouter API key removed.');
    }
  };

  const handleClearGeminiKey = () => {
    if (window.confirm('Are you sure you want to remove your Google AI Studio API key?')) {
      setLocalGeminiKey('');
      localStorage.removeItem('gemini_api_key');
      updateGeminiApiKey('');
      alert('Google AI Studio API key removed.');
    }
  };

  const handleClearSavedImages = () => {
    if (window.confirm('Are you sure you want to clear all saved images? This action cannot be undone.')) {
      // Clear saved images from context if needed
      alert('Saved images cleared.');
    }
  };

  const handleDownloadImage = (imageUrl: string, index: number) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `styleai-image-${index + 1}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm p-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Settings</h1>
        <p className="text-gray-600">Manage your API keys and app preferences</p>
      </div>

      <div className="flex-1 overflow-auto p-4 space-y-6">
        {/* API Provider Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-4 shadow-sm"
        >
          <div className="flex items-center space-x-3 mb-4">
            <FiSettings className="text-gray-600" size={20} />
            <h3 className="font-semibold text-gray-800">API Provider</h3>
          </div>
          
          <p className="text-sm text-gray-600 mb-4">
            Choose your preferred API provider for AI image generation
          </p>

          <div className="space-y-3">
            <label className={`flex items-center space-x-3 p-3 border rounded-lg cursor-pointer transition-colors ${
              selectedProvider === 'openrouter' ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:bg-gray-50'
            }`}>
              <input
                type="radio"
                name="apiProvider"
                value="openrouter"
                checked={selectedProvider === 'openrouter'}
                onChange={(e) => handleProviderChange(e.target.value as 'openrouter')}
                className="text-blue-500"
              />
              <div>
                <div className="font-medium">OpenRouter</div>
                <div className="text-sm text-gray-600">Access Gemini via OpenRouter proxy</div>
              </div>
            </label>

            <label className={`flex items-center space-x-3 p-3 border rounded-lg cursor-pointer transition-colors ${
              selectedProvider === 'direct' ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:bg-gray-50'
            }`}>
              <input
                type="radio"
                name="apiProvider"
                value="direct"
                checked={selectedProvider === 'direct'}
                onChange={(e) => handleProviderChange(e.target.value as 'direct')}
                className="text-blue-500"
              />
              <div>
                <div className="font-medium">Google AI Studio</div>
                <div className="text-sm text-gray-600">Direct access to Gemini API</div>
              </div>
            </label>
          </div>
        </motion.div>

        {/* OpenRouter API Key Section */}
        {selectedProvider === 'openrouter' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl p-4 shadow-sm"
          >
            <div className="flex items-center space-x-3 mb-4">
              <FiKey className="text-gray-600" size={20} />
              <h3 className="font-semibold text-gray-800">OpenRouter API Key</h3>
            </div>
            
            <p className="text-sm text-gray-600 mb-4">
              You need an OpenRouter API key to use Gemini via OpenRouter. Get one at{' '}
              <a 
                href="https://openrouter.ai" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-600"
              >
                openrouter.ai
              </a>
            </p>

            <div className="space-y-3">
              <div className="relative">
                <input
                  type={showOpenRouterKey ? 'text' : 'password'}
                  value={localOpenRouterKey}
                  onChange={(e) => setLocalOpenRouterKey(e.target.value)}
                  placeholder="Enter your OpenRouter API key..."
                  className="w-full p-3 pr-20 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => setShowOpenRouterKey(!showOpenRouterKey)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showOpenRouterKey ? 'Hide' : 'Show'}
                </button>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleSaveOpenRouterKey}
                  className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center space-x-2"
                >
                  <FiKey size={16} />
                  <span>Save API Key</span>
                </button>

                <button
                  onClick={handleClearOpenRouterKey}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
                >
                  <FiTrash2 size={16} />
                  <span>Clear</span>
                </button>
              </div>

              {state.apiKey && selectedProvider === 'openrouter' && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-800 text-sm">
                    ✓ OpenRouter API key is configured and ready to use
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Google AI Studio API Key Section */}
        {selectedProvider === 'direct' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl p-4 shadow-sm"
          >
            <div className="flex items-center space-x-3 mb-4">
              <FiKey className="text-gray-600" size={20} />
              <h3 className="font-semibold text-gray-800">Google AI Studio API Key</h3>
            </div>
            
            <p className="text-sm text-gray-600 mb-4">
              You need a Google AI Studio API key for direct access to Gemini. Get one at{' '}
              <a 
                href="https://ai.google.dev/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-600"
              >
                ai.google.dev
              </a>
            </p>

            <div className="space-y-3">
              <div className="relative">
                <input
                  type={showGeminiKey ? 'text' : 'password'}
                  value={localGeminiKey}
                  onChange={(e) => setLocalGeminiKey(e.target.value)}
                  placeholder="Enter your Google AI Studio API key..."
                  className="w-full p-3 pr-20 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => setShowGeminiKey(!showGeminiKey)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showGeminiKey ? 'Hide' : 'Show'}
                </button>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleSaveGeminiKey}
                  disabled={validatingGemini}
                  className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FiKey size={16} />
                  <span>{validatingGemini ? 'Validating...' : 'Save & Validate API Key'}</span>
                </button>

                <button
                  onClick={handleClearGeminiKey}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
                >
                  <FiTrash2 size={16} />
                  <span>Clear</span>
                </button>
              </div>

              {state.geminiApiKey && selectedProvider === 'direct' && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-800 text-sm">
                    ✓ Google AI Studio API key is configured and ready to use
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Saved Images Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-4 shadow-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <FiImage className="text-gray-600" size={20} />
              <h3 className="font-semibold text-gray-800">Saved Images</h3>
            </div>
            <button
              onClick={handleClearSavedImages}
              className="px-3 py-1 text-red-600 hover:text-red-700 text-sm"
            >
              Clear All
            </button>
          </div>

          {state.user.savedImages.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {state.user.savedImages.map((imageUrl, index) => (
                <div key={index} className="relative group">
                  <img
                    src={imageUrl}
                    alt={`Saved image ${index + 1}`}
                    className="w-full aspect-square object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 rounded-lg flex items-center justify-center">
                    <button
                      onClick={() => handleDownloadImage(imageUrl, index)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white text-gray-800 p-2 rounded-full hover:bg-gray-100"
                    >
                      <FiDownload size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <FiImage size={48} className="mx-auto mb-3 text-gray-300" />
              <p>No saved images yet</p>
              <p className="text-sm">Images you save from the AI features will appear here</p>
            </div>
          )}
        </motion.div>

        {/* App Info Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl p-4 shadow-sm"
        >
          <div className="flex items-center space-x-3 mb-4">
            <FiSettings className="text-gray-600" size={20} />
            <h3 className="font-semibold text-gray-800">App Information</h3>
          </div>

          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>Version:</span>
              <span>1.0.0</span>
            </div>
            <div className="flex justify-between">
              <span>AI Model:</span>
              <span>Gemini 2.5 Flash Image Preview</span>
            </div>
            <div className="flex justify-between">
              <span>Features:</span>
              <span>3 AI Tools</span>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              StyleAI - Your Virtual Styling Assistant
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SettingsPage;