/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';

interface LearnMoreScreenProps {
  onBackToLanding: () => void;
  onEnterApp: () => void;
}

const LearnMoreScreen: React.FC<LearnMoreScreenProps> = ({ onBackToLanding, onEnterApp }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="flex justify-between items-center p-4 sm:p-6 lg:px-12 border-b border-gray-200 bg-white/80 backdrop-blur-sm">
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
            <span className="text-white text-lg sm:text-xl font-bold">👔</span>
          </div>
          <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Virtual Try-On
          </span>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={onBackToLanding}
            className="text-gray-600 hover:text-gray-800 transition-colors text-sm sm:text-base"
          >
            ← Back
          </button>
          <button
            onClick={onEnterApp}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 sm:px-6 rounded-lg font-medium hover:shadow-lg transition-all duration-200 hover:scale-105 text-sm sm:text-base"
          >
            Try Now
          </button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            How Virtual Try-On Works
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
            Discover the magic behind our AI-powered virtual dressing room technology
          </p>
        </div>

        {/* How It Works Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-8 mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-8 text-center">
            🚀 Simple 3-Step Process
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl sm:text-3xl">📸</span>
              </div>
              <div className="w-8 h-1 bg-blue-500 rounded mx-auto mb-4"></div>
              <h3 className="font-semibold text-lg text-gray-800 mb-2">1. Upload Your Photo</h3>
              <p className="text-gray-600 text-sm sm:text-base">Take or upload a clear photo of yourself. Our AI works with any pose or background.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl sm:text-3xl">👕</span>
              </div>
              <div className="w-8 h-1 bg-purple-500 rounded mx-auto mb-4"></div>
              <h3 className="font-semibold text-lg text-gray-800 mb-2">2. Choose Outfit</h3>
              <p className="text-gray-600 text-sm sm:text-base">Upload any clothing image or select from our collection. The AI adapts to any style.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl sm:text-3xl">✨</span>
              </div>
              <div className="w-8 h-1 bg-green-500 rounded mx-auto mb-4"></div>
              <h3 className="font-semibold text-lg text-gray-800 mb-2">3. See Magic Happen</h3>
              <p className="text-gray-600 text-sm sm:text-base">Watch as AI creates a photorealistic image of you wearing the new outfit!</p>
            </div>
          </div>
        </div>

        {/* Technology Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 mb-12">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">🤖 Advanced AI Technology</h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-xs font-bold">AI</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Google Gemini 2.5 Flash Image</h3>
                  <p className="text-gray-600 text-sm">Latest AI model specialized in image generation and understanding</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-xs font-bold">CV</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Computer Vision</h3>
                  <p className="text-gray-600 text-sm">Understands body shapes, poses, and clothing fit for realistic results</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-xs font-bold">ML</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Machine Learning</h3>
                  <p className="text-gray-600 text-sm">Learns from millions of images to create perfect lighting and shadows</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">🛡️ Privacy & Security</h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-xs">✓</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Local Processing</h3>
                  <p className="text-gray-600 text-sm">Images are processed securely and not stored permanently</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-xs">🔒</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Data Protection</h3>
                  <p className="text-gray-600 text-sm">Your photos are never saved or shared with third parties</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-xs">⚡</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Real-time Processing</h3>
                  <p className="text-gray-600 text-sm">Fast AI processing with results in under 30 seconds</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Deep Dive */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-8 mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-8 text-center">
            🎯 Powerful Features
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-xl">🎨</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">Color Customization</h3>
                  <p className="text-gray-600 text-sm">Change outfit colors to match your preferences and style</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-xl">📏</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">Body Type Support</h3>
                  <p className="text-gray-600 text-sm">Works with all body types: Slim, Athletic, Average, Curvy, Plus Size</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-xl">✂️</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">Smart Cropping</h3>
                  <p className="text-gray-600 text-sm">Automatic image cropping and resizing for optimal results</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-xl">🌟</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">Realistic Lighting</h3>
                  <p className="text-gray-600 text-sm">AI matches lighting conditions for natural-looking results</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-xl">🔄</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">Multiple Attempts</h3>
                  <p className="text-gray-600 text-sm">Try different outfits and colors as many times as you want</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-xl">💾</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">Download Results</h3>
                  <p className="text-gray-600 text-sm">Save your virtual try-on images directly to your device</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Use Cases */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl text-white p-6 sm:p-8 mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-center">
            🛍️ Perfect For
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="text-center bg-white/10 rounded-xl p-4 backdrop-blur-sm">
              <div className="text-3xl mb-3">🛒</div>
              <h3 className="font-semibold mb-2">Online Shopping</h3>
              <p className="text-sm opacity-90">See how clothes fit before buying</p>
            </div>
            
            <div className="text-center bg-white/10 rounded-xl p-4 backdrop-blur-sm">
              <div className="text-3xl mb-3">💼</div>
              <h3 className="font-semibold mb-2">Work Outfits</h3>
              <p className="text-sm opacity-90">Plan professional looks for meetings</p>
            </div>
            
            <div className="text-center bg-white/10 rounded-xl p-4 backdrop-blur-sm">
              <div className="text-3xl mb-3">🎉</div>
              <h3 className="font-semibold mb-2">Special Events</h3>
              <p className="text-sm opacity-90">Try party dresses and formal wear</p>
            </div>
            
            <div className="text-center bg-white/10 rounded-xl p-4 backdrop-blur-sm">
              <div className="text-3xl mb-3">👕</div>
              <h3 className="font-semibold mb-2">Casual Style</h3>
              <p className="text-sm opacity-90">Experiment with everyday fashion</p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-8 mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-8 text-center">
            ❓ Frequently Asked Questions
          </h2>
          
          <div className="space-y-6">
            <div className="border-b border-gray-200 pb-6">
              <h3 className="font-semibold text-gray-800 mb-2">How accurate are the virtual try-on results?</h3>
              <p className="text-gray-600 text-sm sm:text-base">Our AI creates highly realistic results by understanding body shapes, clothing physics, and lighting. While not 100% perfect, it gives you an excellent preview of how outfits will look.</p>
            </div>
            
            <div className="border-b border-gray-200 pb-6">
              <h3 className="font-semibold text-gray-800 mb-2">What types of photos work best?</h3>
              <p className="text-gray-600 text-sm sm:text-base">Clear, well-lit photos work best. You can be in any pose, but make sure your body is visible. Photos with good lighting and minimal background clutter give the best results.</p>
            </div>
            
            <div className="border-b border-gray-200 pb-6">
              <h3 className="font-semibold text-gray-800 mb-2">Is my data safe and private?</h3>
              <p className="text-gray-600 text-sm sm:text-base">Absolutely! Your photos are processed securely and are not stored on our servers. All processing happens through encrypted connections and your images are deleted after processing.</p>
            </div>
            
            <div className="border-b border-gray-200 pb-6">
              <h3 className="font-semibold text-gray-800 mb-2">Do I need to create an account?</h3>
              <p className="text-gray-600 text-sm sm:text-base">No account needed! You can start using the virtual try-on feature immediately. Just upload your photos and begin trying on outfits.</p>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">What if I hit rate limits?</h3>
              <p className="text-gray-600 text-sm sm:text-base">The free tier has limits (15 requests/minute, 1500/day). You can add your own API key in Settings for unlimited usage, or wait for the limits to reset at midnight Pacific Time.</p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-6 sm:p-8 border border-gray-200">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">
            Ready to Transform Your Style?
          </h2>
          <p className="text-gray-600 mb-6 text-sm sm:text-base">
            Join thousands of users who've already discovered their perfect look with AI
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={onEnterApp}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl text-base sm:text-lg font-semibold hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2 w-full sm:w-auto"
            >
              <span>🚀 Start Virtual Try-On</span>
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
            
            <button
              onClick={onBackToLanding}
              className="border-2 border-gray-300 text-gray-700 px-6 sm:px-8 py-3 sm:py-4 rounded-xl text-base sm:text-lg font-semibold hover:border-gray-400 transition-all duration-200 hover:bg-gray-50 w-full sm:w-auto"
            >
              ← Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearnMoreScreen;