/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useCallback, useEffect } from 'react';
import { generateTryOnImage } from './services/geminiService';
import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import Spinner from './components/Spinner';

const loadingMessages = [
    "Warming up the virtual dressing room...",
    "Tailoring the fit...",
    "Matching the lighting and shadows...",
    "Applying the final touches...",
    "Almost ready for your reveal!",
];

const bodyBuildOptions = ['Slim', 'Athletic', 'Average', 'Curvy', 'Plus Size'];

const App: React.FC = () => {
  const [subjectImageFile, setSubjectImageFile] = useState<File | null>(null);
  const [outfitImageFile, setOutfitImageFile] = useState<File | null>(null);
  const [bodyBuild, setBodyBuild] = useState<string>(bodyBuildOptions[2]); // Default to 'Average'
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);

  const subjectImageUrl = subjectImageFile ? URL.createObjectURL(subjectImageFile) : null;
  const outfitImageUrl = outfitImageFile ? URL.createObjectURL(outfitImageFile) : null;

  const handleGenerateTryOn = useCallback(async () => {
    if (!subjectImageFile || !outfitImageFile) {
      setError('Please upload both a subject photo and an outfit image.');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const { finalImageUrl } = await generateTryOnImage(subjectImageFile, outfitImageFile, bodyBuild);
      setGeneratedImageUrl(finalImageUrl);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(`Failed to generate the image. ${errorMessage}`);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [subjectImageFile, outfitImageFile, bodyBuild]);

  const handleDownload = () => {
    if (!generatedImageUrl) return;
    const link = document.createElement('a');
    link.href = generatedImageUrl;
    link.download = `virtual-try-on-${Date.now()}.jpeg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleReset = useCallback(() => {
    setSubjectImageFile(null);
    setOutfitImageFile(null);
    setGeneratedImageUrl(null);
    setError(null);
    setIsLoading(false);
    setBodyBuild(bodyBuildOptions[2]);
  }, []);

  const handleChangeOutfit = useCallback(() => {
    setOutfitImageFile(null);
    setGeneratedImageUrl(null); // Allow new generation
  }, []);
  
  const handleChangeSubject = useCallback(() => {
    setSubjectImageFile(null);
    setGeneratedImageUrl(null); // Allow new generation
  }, []);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    if (isLoading) {
      setLoadingMessageIndex(0); // Reset on start
      interval = setInterval(() => {
        setLoadingMessageIndex(prevIndex => (prevIndex + 1) % loadingMessages.length);
      }, 3000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isLoading]);
  
  useEffect(() => {
    return () => {
        if (subjectImageUrl) URL.revokeObjectURL(subjectImageUrl);
        if (outfitImageUrl) URL.revokeObjectURL(outfitImageUrl);
    };
  }, [subjectImageUrl, outfitImageUrl]);


  const renderContent = () => {
    if (error) {
       return (
           <div className="text-center animate-fade-in max-w-2xl mx-auto px-4">
            <div className="bg-red-50 border border-red-200 p-6 sm:p-8 rounded-2xl shadow-lg">
                <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-red-800">Oops! Something went wrong</h2>
                <p className="text-base sm:text-lg text-red-700 mb-6 leading-relaxed">{error}</p>
                <button
                    onClick={handleReset}
                    className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 sm:px-8 rounded-xl text-base sm:text-lg transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    🔄 Try Again
                </button>
            </div>
          </div>
        );
    }

    if (isLoading) {
        return (
            <div className="text-center animate-fade-in w-full max-w-lg mx-auto px-4">
                <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 border border-gray-200">
                    <Spinner />
                    <p className="text-lg sm:text-xl mt-6 text-gray-700 transition-opacity duration-500 leading-relaxed">{loadingMessages[loadingMessageIndex]}</p>
                    <div className="mt-4 w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                        <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-full rounded-full animate-pulse" style={{width: '60%'}}></div>
                    </div>
                    <p className="text-sm text-gray-500 mt-3">This may take 10-30 seconds</p>
                </div>
            </div>
        );
    }

    if (generatedImageUrl) {
        return (
            <div className="w-full max-w-4xl mx-auto animate-fade-in text-center px-4">
                <div className="mb-6">
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">✨ Your Virtual Try-On</h2>
                    <p className="text-gray-600">Looking amazing! Here's your AI-generated result</p>
                </div>
                <div className="bg-white rounded-2xl overflow-hidden shadow-xl border border-gray-200 mb-8">
                    <img src={generatedImageUrl} alt="Generated virtual try-on" className="w-full h-full object-contain" />
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                    <button onClick={handleDownload} className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 px-4 rounded-xl text-sm sm:text-base transition-all duration-200 shadow-md hover:shadow-lg col-span-2 lg:col-span-1">
                        📥 Download
                    </button>
                    <button onClick={handleChangeOutfit} className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-xl text-sm sm:text-base transition-all duration-200 shadow-md hover:shadow-lg">
                        👗 New Outfit
                    </button>
                     <button onClick={handleChangeSubject} className="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-3 px-4 rounded-xl text-sm sm:text-base transition-all duration-200 shadow-md hover:shadow-lg">
                        📷 New Photo
                    </button>
                    <button onClick={handleReset} className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 px-4 rounded-xl text-sm sm:text-base transition-all duration-200">
                        🔄 Start Over
                    </button>
                </div>
            </div>
        )
    }
    
    if (subjectImageFile && outfitImageFile) {
        return (
            <div className="w-full max-w-6xl mx-auto animate-fade-in px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                     <div className="space-y-4">
                        <h2 className="text-xl sm:text-2xl font-bold text-center text-gray-800">Your Photo</h2>
                        <ImageUploader 
                            id="subject-uploader"
                            onFileSelect={setSubjectImageFile}
                            imageUrl={subjectImageUrl}
                        />
                         <div className="text-center">
                             <button onClick={handleChangeSubject} className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors">Change Photo</button>
                         </div>
                     </div>
                     <div className="space-y-4">
                        <h2 className="text-xl sm:text-2xl font-bold text-center text-gray-800">The Outfit</h2>
                        <ImageUploader 
                            id="outfit-uploader"
                            onFileSelect={setOutfitImageFile}
                            imageUrl={outfitImageUrl}
                        />
                        <div className="text-center">
                            <button onClick={handleChangeOutfit} className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors">Change Outfit</button>
                        </div>
                     </div>
                </div>

                <div className="mt-8 lg:mt-12 space-y-6">
                    <div className="text-center">
                        <label htmlFor="body-build-select" className="block text-lg font-semibold text-gray-700 mb-4">
                            Select Your Body Build
                        </label>
                        <select
                            id="body-build-select"
                            value={bodyBuild}
                            onChange={(e) => setBodyBuild(e.target.value)}
                            className="bg-white border border-gray-300 text-gray-900 text-base sm:text-lg rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full max-w-xs mx-auto px-4 py-3 shadow-sm transition-all"
                        >
                            {bodyBuildOptions.map(option => (
                                <option key={option} value={option}>{option}</option>
                            ))}
                        </select>
                    </div>

                    <div className="text-center">
                        <button
                            onClick={handleGenerateTryOn}
                            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-8 sm:px-12 rounded-xl text-lg sm:text-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                        >
                            ✨ Try It On!
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-6xl mx-auto animate-fade-in px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            <div className="space-y-4">
              <div className="flex items-center justify-center space-x-2">
                <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Upload Your Photo</h2>
              </div>
              <ImageUploader 
                id="subject-uploader"
                onFileSelect={setSubjectImageFile}
                imageUrl={subjectImageUrl}
              />
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-center space-x-2">
                <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Upload The Outfit</h2>
              </div>
              <ImageUploader 
                id="outfit-uploader"
                onFileSelect={setOutfitImageFile}
                imageUrl={outfitImageUrl}
              />
            </div>
          </div>
          <div className="text-center mt-8 lg:mt-12 min-h-[4rem] flex flex-col justify-center items-center space-y-4">
            <div className="max-w-md mx-auto">
              <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
                Upload a photo of yourself and a photo of an outfit to get started
              </p>
              <div className="mt-4 flex justify-center space-x-6 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>AI Ready</span>
                </div>
                <div className="flex items-center space-x-1">
                  <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                  <span>Secure</span>
                </div>
              </div>
            </div>
          </div>
        </div>
    );
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 text-gray-800">
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
          <div className="w-full">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
