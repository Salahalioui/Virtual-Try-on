/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';

interface HeaderProps {
  onOpenSettings: () => void;
  onInstallPWA?: () => void;
  showInstallButton?: boolean;
  hasOpenRouterApiKey?: boolean;
}

const Header: React.FC<HeaderProps> = ({ 
  onOpenSettings, 
  onInstallPWA, 
  showInstallButton = false,
  hasOpenRouterApiKey = false 
}) => {
  return (
    <header className="w-full px-4 py-8 md:py-12 text-center relative bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="absolute top-6 right-6 flex space-x-3">
        <button
          onClick={onOpenSettings}
          className="p-3 rounded-2xl bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-xl border border-gray-200/50 transition-all duration-300 hover:scale-110 group"
          title="Settings"
        >
          <svg className="w-6 h-6 text-gray-600 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
        
        {showInstallButton && onInstallPWA && (
          <button
            onClick={onInstallPWA}
            className="p-3 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 group"
            title="Install App"
          >
            <svg className="w-6 h-6 group-hover:scale-105 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </button>
        )}
      </div>
      
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black tracking-tight bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent leading-tight mb-4">
            Virtual Try-On
          </h1>
          <div className="mt-4 w-32 h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 mx-auto rounded-full shadow-lg"></div>
        </div>
        <p className="text-lg sm:text-xl lg:text-2xl text-gray-700 max-w-3xl mx-auto leading-relaxed font-medium mb-8">
          Upload your photo and an outfit to see how it looks with AI-powered photorealistic visualization
        </p>
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <div className="inline-flex items-center px-6 py-3 rounded-full text-sm font-semibold bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 border border-green-200/50 shadow-sm">
            <div className="w-3 h-3 bg-green-400 rounded-full mr-3 animate-pulse shadow-sm"></div>
            AI Ready
          </div>
          {hasOpenRouterApiKey && (
            <div className="inline-flex items-center px-6 py-3 rounded-full text-sm font-semibold bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border border-blue-200/50 shadow-sm">
              <div className="w-3 h-3 bg-blue-400 rounded-full mr-3 shadow-sm"></div>
              OpenRouter Connected
            </div>
          )}
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto">
          <button className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 text-lg">
            🚀 Start Try-On
          </button>
          <button className="w-full sm:w-auto bg-white/80 backdrop-blur-sm hover:bg-white text-gray-700 hover:text-gray-900 font-semibold py-4 px-8 rounded-2xl border border-gray-200 shadow-md hover:shadow-lg transition-all duration-300 text-lg">
            📱 View Demo
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
