/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useEffect } from 'react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApiKeyChange: (apiKey: string) => void;
  currentApiKey: string;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ 
  isOpen, 
  onClose, 
  onApiKeyChange, 
  currentApiKey 
}) => {
  const [apiKey, setApiKey] = useState(currentApiKey);
  const [showInstructions, setShowInstructions] = useState(false);

  useEffect(() => {
    setApiKey(currentApiKey);
  }, [currentApiKey]);

  if (!isOpen) return null;

  const handleSave = () => {
    onApiKeyChange(apiKey.trim());
    onClose();
  };

  const handleClear = () => {
    setApiKey('');
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
            <label htmlFor="api-key" className="block text-lg font-semibold text-gray-700 mb-3">
              🔑 Your Gemini API Key
            </label>
            <input
              id="api-key"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your Gemini API key..."
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
            <p className="text-sm text-gray-500 mt-2">
              Using your own API key removes rate limits and gives you full control
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <button
              onClick={() => setShowInstructions(!showInstructions)}
              className="flex items-center justify-between w-full text-left"
            >
              <h3 className="font-semibold text-blue-800">
                📋 How to get your Gemini API key
              </h3>
              <svg 
                className={`w-5 h-5 text-blue-600 transition-transform ${showInstructions ? 'rotate-180' : ''}`}
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {showInstructions && (
              <div className="mt-4 space-y-3 text-sm text-blue-700">
                <div className="space-y-2">
                  <p><strong>Step 1:</strong> Go to <a href="https://aistudio.google.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">Google AI Studio</a></p>
                  <p><strong>Step 2:</strong> Sign in with your Google account</p>
                  <p><strong>Step 3:</strong> Click "Get API key" in the left sidebar</p>
                  <p><strong>Step 4:</strong> Create a new API key or copy an existing one</p>
                  <p><strong>Step 5:</strong> Paste it above and click Save</p>
                </div>
                
                <div className="bg-white rounded-lg p-3 border border-blue-200">
                  <h4 className="font-medium text-blue-800 mb-2">💡 Benefits of your own API key:</h4>
                  <ul className="space-y-1 text-xs">
                    <li>• Higher rate limits (15 RPM instead of 5)</li>
                    <li>• More daily requests (1500 instead of 25)</li>
                    <li>• Priority processing</li>
                    <li>• No shared quota restrictions</li>
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