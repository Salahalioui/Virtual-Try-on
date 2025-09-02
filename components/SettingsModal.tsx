/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useEffect } from 'react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApiKeyChange: (openRouterApiKey: string) => void;
  currentOpenRouterApiKey: string;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ 
  isOpen, 
  onClose, 
  onApiKeyChange, 
  currentOpenRouterApiKey
}) => {
  const [openRouterApiKey, setOpenRouterApiKey] = useState(currentOpenRouterApiKey);
  const [showInstructions, setShowInstructions] = useState(false);

  useEffect(() => {
    setOpenRouterApiKey(currentOpenRouterApiKey);
  }, [currentOpenRouterApiKey]);

  if (!isOpen) return null;

  const handleSave = () => {
    onApiKeyChange(openRouterApiKey.trim());
    onClose();
  };

  const handleClear = () => {
    setOpenRouterApiKey('');
    onApiKeyChange('');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800">⚙️ Settings</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <label htmlFor="openrouter-api-key" className="block text-lg font-semibold text-gray-700 mb-3">
              🚀 OpenRouter API Key
            </label>
            <input
              id="openrouter-api-key"
              type="password"
              value={openRouterApiKey}
              onChange={(e) => setOpenRouterApiKey(e.target.value)}
              placeholder="Enter your OpenRouter API key..."
              className="w-full px-4 py-3 border border-orange-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
            />
            <div className="text-sm text-orange-600 mt-2 space-y-1">
              <p><strong>Required:</strong> This app uses OpenRouter to access Google's Gemini model</p>
              <p className="text-xs text-gray-500">
                <strong>Rate Limits:</strong> 20 requests/minute, 50 requests/day (free), 1000/day with credits
              </p>
            </div>
          </div>

          <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
            <button
              onClick={() => setShowInstructions(!showInstructions)}
              className="flex items-center justify-between w-full text-left"
            >
              <h3 className="font-semibold text-orange-800">
                📋 How to get your OpenRouter API key
              </h3>
              <svg 
                className={`w-5 h-5 text-orange-600 transition-transform ${showInstructions ? 'rotate-180' : ''}`}
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {showInstructions && (
              <div className="mt-4 space-y-3 text-sm text-orange-700">
                <div className="space-y-2">
                  <p><strong>Step 1:</strong> Go to <a href="https://openrouter.ai" target="_blank" rel="noopener noreferrer" className="text-orange-600 hover:text-orange-800 underline">openrouter.ai</a> and sign up</p>
                  <p><strong>Step 2:</strong> Click menu (≡) → "Keys" → "Create Key"</p>
                  <p><strong>Step 3:</strong> Name your key and click "Create"</p>
                  <p><strong>Step 4:</strong> Copy the key and paste it above</p>
                  <p><strong>Step 5:</strong> Click Save to store your key</p>
                </div>
                
                <div className="bg-white rounded-lg p-3 border border-orange-200">
                  <h4 className="font-medium text-orange-800 mb-2">💡 Benefits of OpenRouter:</h4>
                  <ul className="space-y-1 text-xs">
                    <li>• Access to Google's Gemini 2.5 Flash Image Preview model</li>
                    <li>• 20 requests/minute, 50/day (free tier)</li>
                    <li>• 1000/day with $1+ credits purchase</li>
                    <li>• Reliable service without quota limitations</li>
                    <li>• Works consistently for virtual try-on generation</li>
                  </ul>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleSave}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
            >
              💾 Save API Key
            </button>
            <button
              onClick={handleClear}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-xl transition-all duration-200"
            >
              🗑️ Clear & Use Default
            </button>
          </div>

          <div className="text-center space-y-2">
            <div className="text-xs text-gray-500">
              🔒 Your API key is stored locally and never shared
            </div>
            <div className="text-xs text-gray-400 border-t pt-2">
              💻 Developed by <span className="font-medium text-gray-600">SALAH.A (ELBAYADH)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;