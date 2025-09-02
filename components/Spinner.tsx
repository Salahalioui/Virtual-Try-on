/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';

interface SpinnerProps {
  showProgress?: boolean;
  progress?: number;
  message?: string;
}

const Spinner: React.FC<SpinnerProps> = ({ showProgress = false, progress = 0, message }) => {
  return (
    <div className="relative">
      <div className="w-20 h-20 mx-auto mb-4">
        <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-transparent border-t-blue-500 border-r-purple-500 rounded-full animate-spin"></div>
        {showProgress && (
          <div className="absolute inset-2 flex items-center justify-center">
            <span className="text-xs font-bold text-gray-700">{progress}%</span>
          </div>
        )}
      </div>
      
      {showProgress && (
        <div className="w-full bg-gray-200 rounded-full h-2 mb-4 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      )}
      
      <div className="text-center">
        <div className="inline-flex space-x-1 mb-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
          <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
        </div>
        {message && (
          <p className="text-sm text-gray-600 font-medium">{message}</p>
        )}
      </div>
    </div>
  );
};

// Skeleton loading component for image previews
export const ImageSkeleton: React.FC = () => {
  return (
    <div className="w-full aspect-[4/3] sm:aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl animate-pulse border-2 border-dashed border-gray-300">
      <div className="flex items-center justify-center h-full">
        <div className="text-center p-6">
          <div className="w-12 h-12 bg-gray-300 rounded-full mx-auto mb-3 animate-pulse"></div>
          <div className="w-32 h-4 bg-gray-300 rounded mx-auto mb-2 animate-pulse"></div>
          <div className="w-24 h-3 bg-gray-300 rounded mx-auto animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default Spinner;