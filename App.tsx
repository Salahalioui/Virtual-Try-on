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
           <div className="text-center animate-fade-in bg-red-50 border border-red-200 p-8 rounded-lg max-w-2xl mx-auto">
            <h2 className="text-3xl font-extrabold mb-4 text-red-800">An Error Occurred</h2>
            <p className="text-lg text-red-700 mb-6">{error}</p>
            <button
                onClick={handleReset}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors"
              >
                Start Over
            </button>
          </div>
        );
    }

    if (isLoading) {
        return (
            <div className="text-center animate-fade-in w-full max-w-md mx-auto">
                <Spinner />
                <p className="text-xl mt-4 text-zinc-600 transition-opacity duration-500">{loadingMessages[loadingMessageIndex]}</p>
            </div>
        );
    }

    if (generatedImageUrl) {
        return (
            <div className="w-full max-w-4xl mx-auto animate-fade-in text-center">
                <h2 className="text-3xl font-extrabold text-center mb-5 text-zinc-800">Your Virtual Try-On</h2>
                <div className="rounded-lg overflow-hidden shadow-2xl border border-zinc-200">
                    <img src={generatedImageUrl} alt="Generated virtual try-on" className="w-full h-full object-contain" />
                </div>
                <div className="mt-8 flex flex-wrap justify-center gap-4">
                    <button onClick={handleDownload} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg text-lg transition-colors">
                        Download Image
                    </button>
                    <button onClick={handleChangeOutfit} className="bg-zinc-200 hover:bg-zinc-300 text-zinc-800 font-bold py-3 px-6 rounded-lg text-lg transition-colors">
                        Try Another Outfit
                    </button>
                     <button onClick={handleChangeSubject} className="bg-zinc-200 hover:bg-zinc-300 text-zinc-800 font-bold py-3 px-6 rounded-lg text-lg transition-colors">
                        Change Photo
                    </button>
                    <button onClick={handleReset} className="text-zinc-500 hover:text-zinc-700 font-semibold py-3 px-6 rounded-lg transition-colors">
                        Start Over
                    </button>
                </div>
            </div>
        )
    }
    
    if (subjectImageFile && outfitImageFile) {
        return (
            <div className="w-full max-w-6xl mx-auto animate-fade-in">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                     <div>
                        <h2 className="text-2xl font-extrabold text-center mb-5 text-zinc-800">Your Photo</h2>
                        <ImageUploader 
                            id="subject-uploader"
                            onFileSelect={setSubjectImageFile}
                            imageUrl={subjectImageUrl}
                        />
                         <div className="text-center mt-2">
                             <button onClick={handleChangeSubject} className="text-sm text-blue-600 hover:text-blue-800 font-semibold">Change Photo</button>
                         </div>
                     </div>
                     <div>
                        <h2 className="text-2xl font-extrabold text-center mb-5 text-zinc-800">The Outfit</h2>
                        <ImageUploader 
                            id="outfit-uploader"
                            onFileSelect={setOutfitImageFile}
                            imageUrl={outfitImageUrl}
                        />
                        <div className="text-center mt-2">
                            <button onClick={handleChangeOutfit} className="text-sm text-blue-600 hover:text-blue-800 font-semibold">Change Outfit</button>
                        </div>
                     </div>
                </div>

                <div className="mt-10 text-center">
                    <label htmlFor="body-build-select" className="block text-lg font-semibold text-zinc-700 mb-3">
                        Select Your Body Build
                    </label>
                    <select
                        id="body-build-select"
                        value={bodyBuild}
                        onChange={(e) => setBodyBuild(e.target.value)}
                        className="bg-white border border-zinc-300 text-zinc-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full max-w-xs mx-auto p-3"
                    >
                        {bodyBuildOptions.map(option => (
                            <option key={option} value={option}>{option}</option>
                        ))}
                    </select>

                    <button
                        onClick={handleGenerateTryOn}
                        className="mt-8 bg-zinc-800 hover:bg-zinc-900 text-white font-bold py-4 px-10 rounded-lg text-xl transition-colors"
                    >
                        Try It On!
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-6xl mx-auto animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            <div className="flex flex-col">
              <h2 className="text-2xl font-extrabold text-center mb-5 text-zinc-800">1. Upload Your Photo</h2>
              <ImageUploader 
                id="subject-uploader"
                onFileSelect={setSubjectImageFile}
                imageUrl={subjectImageUrl}
              />
            </div>
            <div className="flex flex-col">
              <h2 className="text-2xl font-extrabold text-center mb-5 text-zinc-800">2. Upload The Outfit</h2>
              <ImageUploader 
                id="outfit-uploader"
                onFileSelect={setOutfitImageFile}
                imageUrl={outfitImageUrl}
              />
            </div>
          </div>
          <div className="text-center mt-10 min-h-[4rem] flex flex-col justify-center items-center">
            <p className="text-zinc-500 animate-fade-in text-lg">
              Upload a photo of yourself and a photo of an outfit to get started.
            </p>
          </div>
        </div>
    );
  };
  
  return (
    <div className="min-h-screen bg-white text-zinc-800 flex items-center justify-center p-4 md:p-8">
      <div className="flex flex-col items-center gap-8 w-full">
        <Header />
        <main className="w-full">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default App;
