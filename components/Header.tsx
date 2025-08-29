/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="w-full px-4 py-6 text-center">
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
        <div className="mt-4 flex justify-center">
          <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
            <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
            AI Ready
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
