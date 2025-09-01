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
      <nav className="flex justify-between items-center p-4 sm:p-6 lg:px-12">
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
            <span className="text-white text-lg sm:text-xl font-bold">👔</span>
          </div>
          <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Virtual Try-On
          </span>
        </div>
        <button
          onClick={onEnterApp}
          className="hidden sm:block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 sm:px-6 rounded-lg font-medium hover:shadow-lg transition-all duration-200 hover:scale-105 text-sm sm:text-base"
        >
          Try Now →
        </button>
      </nav>

      {/* Hero Section */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-12 py-8 sm:py-12">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left space-y-6 sm:space-y-8">
            <div className="space-y-4 sm:space-y-6">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Try On Clothes
                <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  With AI Magic
                </span>
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl text-gray-600 leading-relaxed px-4 sm:px-0">
                Upload your photo and any outfit to see how it looks on you. 
                Powered by advanced AI for photorealistic results.
              </p>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 my-8">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300">
                <div className="w-16 h-16 mx-auto mb-4 rounded-lg overflow-hidden">
                  <img 
                    src="/attached_assets/generated_images/Speed_icon_instant_results_9ab4ca48.png" 
                    alt="Instant Results"
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2 text-center">Instant Results</h3>
                <p className="text-sm text-gray-600 text-center leading-relaxed">See how clothes look on you in seconds with AI magic</p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300">
                <div className="w-16 h-16 mx-auto mb-4 rounded-lg overflow-hidden">
                  <img 
                    src="/attached_assets/generated_images/Quality_AI_icon_a8ddf5ef.png" 
                    alt="Photorealistic Quality"
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2 text-center">Photorealistic</h3>
                <p className="text-sm text-gray-600 text-center leading-relaxed">AI-powered realistic clothing overlay with perfect lighting</p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 sm:col-span-2 lg:col-span-1">
                <div className="w-16 h-16 mx-auto mb-4 rounded-lg overflow-hidden">
                  <img 
                    src="/attached_assets/generated_images/Multi_device_compatibility_icon_897c0f06.png" 
                    alt="Any Device"
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2 text-center">Any Device</h3>
                <p className="text-sm text-gray-600 text-center leading-relaxed">Works perfectly on mobile, tablet, and desktop</p>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start px-4 sm:px-0">
              <button
                onClick={onEnterApp}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl text-base sm:text-lg font-semibold hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2 w-full sm:w-auto"
              >
                <span>🎯 Start Virtual Try-On</span>
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
              
              <button className="border-2 border-gray-300 text-gray-700 px-6 sm:px-8 py-3 sm:py-4 rounded-xl text-base sm:text-lg font-semibold hover:border-gray-400 transition-all duration-200 hover:bg-gray-50 w-full sm:w-auto">
                📖 Learn More
              </button>
            </div>
          </div>

          {/* Right Visual */}
          <div className="mt-8 lg:mt-0">
            <div className="relative">
              {/* Background decoration */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-3xl opacity-10 transform rotate-2 hidden lg:block"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-3xl opacity-10 transform -rotate-2 hidden lg:block"></div>
              
              {/* Main visual container */}
              <div className="relative bg-white rounded-2xl lg:rounded-3xl shadow-xl lg:shadow-2xl overflow-hidden border border-gray-100">
                <img 
                  src="/attached_assets/generated_images/Virtual_try-on_concept_hero_e2a24dc4.png" 
                  alt="Virtual Try-On Concept"
                  className="w-full h-48 sm:h-64 lg:h-80 object-cover"
                />
                <div className="p-4 lg:p-6">
                  <div className="text-center">
                    <div className="inline-flex items-center space-x-2 bg-green-100 text-green-800 px-3 py-2 rounded-full text-xs lg:text-sm font-medium">
                      <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                      <span>AI Magic at Work</span>
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
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-12 py-4 sm:py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-3 md:space-y-0">
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6 text-xs sm:text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span>Powered by Google Gemini AI</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                <span>Secure & Private</span>
              </div>
            </div>
            
            <div className="text-xs text-gray-500 text-center md:text-right">
              💻 Developed by <span className="font-medium text-gray-600">SALAH.A (ELBAYADH)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingScreen;