/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';

interface LandingScreenProps {
  onEnterApp: () => void;
}

const LandingScreen: React.FC<LandingScreenProps> = ({ onEnterApp }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col">
      {/* Navigation Bar */}
      <nav className="flex justify-between items-center p-6 lg:px-12">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
            <span className="text-white text-xl font-bold">👔</span>
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Virtual Try-On
          </span>
        </div>
        <button
          onClick={onEnterApp}
          className="hidden md:block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg transition-all duration-200 hover:scale-105"
        >
          Try Now →
        </button>
      </nav>

      {/* Hero Section */}
      <div className="flex-1 flex items-center justify-center px-6 lg:px-12">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Try On Clothes
                <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  With AI Magic
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 leading-relaxed">
                Upload your photo and any outfit to see how it looks on you. 
                Powered by advanced AI for photorealistic results.
              </p>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-8">
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
                  <span className="text-2xl">🚀</span>
                </div>
                <h3 className="font-semibold text-gray-800 mb-1">Instant Results</h3>
                <p className="text-sm text-gray-600">See how clothes look on you in seconds</p>
              </div>
              
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-3">
                  <span className="text-2xl">✨</span>
                </div>
                <h3 className="font-semibold text-gray-800 mb-1">Photorealistic</h3>
                <p className="text-sm text-gray-600">AI-powered realistic clothing overlay</p>
              </div>
              
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-3">
                  <span className="text-2xl">📱</span>
                </div>
                <h3 className="font-semibold text-gray-800 mb-1">Any Device</h3>
                <p className="text-sm text-gray-600">Works perfectly on mobile and desktop</p>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button
                onClick={onEnterApp}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2"
              >
                <span>🎯 Start Virtual Try-On</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
              
              <button className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl text-lg font-semibold hover:border-gray-400 transition-all duration-200 hover:bg-gray-50">
                📖 Learn More
              </button>
            </div>
          </div>

          {/* Right Visual */}
          <div className="hidden lg:block">
            <div className="relative">
              {/* Background decoration */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-3xl opacity-10 transform rotate-3"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-3xl opacity-10 transform -rotate-3"></div>
              
              {/* Main visual container */}
              <div className="relative bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
                <div className="space-y-6">
                  {/* Mock interface preview */}
                  <div className="bg-gray-100 rounded-2xl p-6 space-y-4">
                    <div className="flex space-x-4">
                      <div className="w-20 h-28 bg-gradient-to-b from-gray-300 to-gray-400 rounded-lg"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                        <div className="h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white text-sm font-medium">
                          Generate →
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="inline-flex items-center space-x-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium">
                      <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                      <span>AI Processing Complete</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-gray-200 bg-white">
        <div className="max-w-6xl mx-auto px-6 lg:px-12 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-6 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span>Powered by Google Gemini AI</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                <span>Secure & Private</span>
              </div>
            </div>
            
            <div className="text-xs text-gray-500">
              💻 Developed by <span className="font-medium text-gray-600">SALAH.A (ELBAYADH)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingScreen;