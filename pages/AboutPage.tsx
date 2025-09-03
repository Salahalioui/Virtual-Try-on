import React from 'react';
import { motion } from 'framer-motion';
import { FiGithub, FiUser, FiHeart, FiStar, FiCode, FiZap } from 'react-icons/fi';
import { FaFacebook } from 'react-icons/fa';

const AboutPage: React.FC = () => {
  const handleGitHubClick = () => {
    window.open('https://github.com/Salahalioui', '_blank');
  };

  const handleFacebookClick = () => {
    window.open('https://www.facebook.com/SALAH.ALIOUI32', '_blank');
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 shadow-lg p-6 text-white">
        <motion.h1 
          className="text-3xl font-bold mb-2"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          About StyleAI
        </motion.h1>
        <motion.p 
          className="text-purple-100"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Your AI-Powered Virtual Styling Assistant
        </motion.p>
      </div>

      <div className="flex-1 overflow-auto p-6 space-y-8">
        {/* What is StyleAI */}
        <motion.div
          className="bg-white rounded-xl p-6 shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex items-center mb-4">
            <FiZap className="text-purple-600 mr-3" size={24} />
            <h2 className="text-2xl font-bold text-gray-800">What is StyleAI?</h2>
          </div>
          <p className="text-gray-600 leading-relaxed">
            StyleAI is a comprehensive mobile-first AI styling assistant that brings the power of artificial intelligence to your personal styling needs. Whether you want to try on new outfits, experiment with different hairstyles, or change your photo backgrounds, StyleAI makes it all possible with cutting-edge AI technology.
          </p>
        </motion.div>

        {/* Features */}
        <motion.div
          className="bg-white rounded-xl p-6 shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="flex items-center mb-4">
            <FiStar className="text-blue-600 mr-3" size={24} />
            <h2 className="text-2xl font-bold text-gray-800">Features</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <h3 className="font-semibold text-gray-800">Virtual Try-On</h3>
                <p className="text-sm text-gray-600">See how clothes look on you with multiple viewing angles</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <h3 className="font-semibold text-gray-800">Outfit Extraction</h3>
                <p className="text-sm text-gray-600">Extract clothing from your photos for virtual try-on</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <h3 className="font-semibold text-gray-800">Hair & Beard Styling</h3>
                <p className="text-sm text-gray-600">Try different hairstyles and beard styles instantly</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <h3 className="font-semibold text-gray-800">Background Changer</h3>
                <p className="text-sm text-gray-600">Place yourself in any environment or setting</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Technology */}
        <motion.div
          className="bg-white rounded-xl p-6 shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="flex items-center mb-4">
            <FiCode className="text-green-600 mr-3" size={24} />
            <h2 className="text-2xl font-bold text-gray-800">Technology</h2>
          </div>
          <div className="space-y-3">
            <div>
              <h3 className="font-semibold text-gray-800">AI Model</h3>
              <p className="text-sm text-gray-600">Powered by Google's Gemini 2.5 Flash Image Preview via OpenRouter API</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Frontend</h3>
              <p className="text-sm text-gray-600">Built with React 19, TypeScript, and Tailwind CSS for modern, responsive design</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Mobile-First</h3>
              <p className="text-sm text-gray-600">Optimized for mobile devices with smooth animations and touch interactions</p>
            </div>
          </div>
        </motion.div>

        {/* Developer Credits */}
        <motion.div
          className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <div className="flex items-center mb-4">
            <FiHeart className="text-red-500 mr-3" size={24} />
            <h2 className="text-2xl font-bold text-gray-800">Developed with ❤️ by</h2>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl mr-4">
                SA
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">SALAH.A</h3>
                <p className="text-gray-600">Full-Stack Developer & AI Enthusiast</p>
              </div>
            </div>
            
            <p className="text-gray-700 mb-6 leading-relaxed">
              Passionate about creating innovative AI-powered applications that make technology accessible and fun for everyone. StyleAI represents the perfect fusion of artificial intelligence, user experience design, and modern web development.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleGitHubClick}
                className="flex items-center justify-center px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200 font-semibold"
              >
                <FiGithub className="mr-2" size={20} />
                GitHub Profile
              </button>
              <button
                onClick={handleFacebookClick}
                className="flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-semibold"
              >
                <FaFacebook className="mr-2" size={20} />
                Facebook
              </button>
            </div>
          </div>
        </motion.div>

        {/* Version Info */}
        <motion.div
          className="bg-white rounded-xl p-6 shadow-sm text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <div className="flex items-center justify-center mb-2">
            <FiUser className="text-gray-400 mr-2" size={16} />
            <span className="text-sm text-gray-500">StyleAI v1.0.0</span>
          </div>
          <p className="text-xs text-gray-400">
            Made with modern web technologies and powered by cutting-edge AI
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default AboutPage;