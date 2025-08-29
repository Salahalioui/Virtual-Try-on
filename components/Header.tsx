/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';

interface HeaderProps {
  onOpenSettings: () => void;
  onInstallPWA?: () => void;
  showInstallButton?: boolean;
  hasCustomApiKey?: boolean;
}

const Header: React.FC<HeaderProps> = ({ 
  onOpenSettings, 
  onInstallPWA, 
  showInstallButton = false,
  hasCustomApiKey = false 
}) => {
  return (
    <header className="w-full px-4 py-6 text-center relative">
      <div className="absolute top-4 right-4 flex space-x-2">
        <button
          onClick={onOpenSettings}
          className="p-2 rounded-xl bg-white shadow-md hover:shadow-lg border border-gray-200 transition-all duration-200 hover:scale-105"
          title="Settings"
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
        
        {showInstallButton && onInstallPWA && (
          <button
            onClick={onInstallPWA}
            className="p-2 rounded-xl bg-blue-500 hover:bg-blue-600 text-white shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105"
            title="Install App"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </button>
        )}
      </div>
      
      <div className="max-w-4xl mx-auto">
        <div className="mb-4">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 leading-tight">
            Virtual Try-On
          </h1>
          <div className="mt-2 w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto rounded-full"></div>
        </div>
        <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Upload your photo and an outfit to see how it looks with AI-powered photorealistic visualization
        </p>
        <div className="mt-4 flex justify-center space-x-3">
          <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
            <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
            AI Ready
          </div>
          {hasCustomApiKey && (
            <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
              <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
              Custom API
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
