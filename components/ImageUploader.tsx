/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useCallback, useRef, useState, useEffect } from 'react';
import ReactCrop, {
  centerCrop,
  makeAspectCrop,
  Crop,
  PixelCrop,
} from 'react-image-crop';


// --- Cropping Modal and Helpers ---

interface ImageCropModalProps {
  imageSrc: string;
  originalFile: File;
  onClose: () => void;
  onCropComplete: (file: File) => void;
}

// Function to generate a cropped image from a canvas
function getCroppedImg(
  image: HTMLImageElement,
  crop: PixelCrop,
  originalFile: File,
): Promise<File> {
  const canvas = document.createElement('canvas');
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;
  canvas.width = crop.width;
  canvas.height = crop.height;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return Promise.reject(new Error('Could not get canvas context.'));
  }

  const pixelRatio = window.devicePixelRatio || 1;
  canvas.width = crop.width * pixelRatio;
  canvas.height = crop.height * pixelRatio;
  ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  ctx.imageSmoothingQuality = 'high';

  ctx.drawImage(
    image,
    crop.x * scaleX,
    crop.y * scaleY,
    crop.width * scaleX,
    crop.height * scaleY,
    0,
    0,
    crop.width,
    crop.height,
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error('Canvas to Blob conversion failed.'));
          return;
        }
        const croppedFile = new File([blob], originalFile.name.replace(/\.[^/.]+$/, "") + ".jpg", { type: 'image/jpeg', lastModified: Date.now() });
        resolve(croppedFile);
      },
      'image/jpeg',
      0.95, // High quality
    );
  });
}

const aspectOptions = [
    { label: '1:1', value: 1 / 1 },
    { label: '3:4', value: 3 / 4 },
    { label: '4:3', value: 4 / 3 },
    { label: '9:16', value: 9 / 16 },
    { label: '16:9', value: 16 / 9 },
    { label: 'Free', value: undefined },
];

const ImageCropModal: React.FC<ImageCropModalProps> = ({ imageSrc, originalFile, onClose, onCropComplete }) => {
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const imgRef = useRef<HTMLImageElement>(null);
  const [isCropping, setIsCropping] = useState(false);
  const [aspect, setAspect] = useState<number | undefined>(aspectOptions[0].value);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    const newCrop = aspect
      ? centerCrop(
          makeAspectCrop({ unit: '%', width: 90 }, aspect, width, height),
          width,
          height
        )
      : { unit: '%' as 'px', width: 90, height: 90, x: 5, y: 5 };
    setCrop(newCrop);
  };

  useEffect(() => {
    if (imgRef.current) {
        onImageLoad({ currentTarget: imgRef.current } as React.SyntheticEvent<HTMLImageElement>);
    }
  }, [aspect]);

  const handleCrop = async () => {
    if (completedCrop?.width && completedCrop?.height && imgRef.current) {
      setIsCropping(true);
      try {
        const croppedFile = await getCroppedImg(imgRef.current, completedCrop, originalFile);
        onCropComplete(croppedFile);
      } catch (e) {
        console.error('Cropping failed', e);
      } finally {
        setIsCropping(false);
      }
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4 animate-fade-in overflow-y-auto"
      aria-modal="true"
      role="dialog"
      onClick={(e) => {
        // Close modal if clicking the backdrop
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] p-6 md:p-8 relative transform transition-all flex flex-col overflow-hidden my-auto"
        role="document"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center mb-4">
          <h2 className="text-2xl font-extrabold text-zinc-800">Crop Your Image</h2>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-4">
            {aspectOptions.map(opt => (
                <button
                    key={opt.label}
                    onClick={() => setAspect(opt.value)}
                    className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${
                        aspect === opt.value
                            ? 'bg-blue-600 text-white'
                            : 'bg-zinc-200 text-zinc-800 hover:bg-zinc-300'
                    }`}
                >
                    {opt.label}
                </button>
            ))}
        </div>

        <div className="flex justify-center bg-zinc-100 p-4 rounded-lg overflow-auto flex-1 min-h-0">
          <ReactCrop
            crop={crop}
            onChange={(_, percentCrop) => setCrop(percentCrop)}
            onComplete={(c) => setCompletedCrop(c)}
            aspect={aspect}
            minWidth={100}
            minHeight={100}
          >
            <img
              ref={imgRef}
              alt="Crop me"
              src={imageSrc}
              onLoad={onImageLoad}
              style={{ maxHeight: '50vh', maxWidth: '100%', objectFit: 'contain' }}
            />
          </ReactCrop>
        </div>

        <div className="mt-6 flex flex-wrap justify-end gap-3 flex-shrink-0">
          <button
            onClick={onClose}
            className="bg-zinc-200 hover:bg-zinc-300 text-zinc-800 font-bold py-2 px-6 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleCrop}
            disabled={!completedCrop || isCropping}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isCropping ? 'Cropping...' : 'Crop & Continue'}
          </button>
        </div>
      </div>
    </div>
  );
};


// --- ImageUploader Component ---

interface ImageUploaderProps {
  id: string;
  label?: string;
  onFileSelect: (file: File) => void;
  imageUrl: string | null;
}

const UploadIcon: React.FC<{isHovered?: boolean}> = ({isHovered = false}) => (
    <div className={`transition-all duration-300 ${isHovered ? 'scale-110' : ''}`}>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 sm:h-16 sm:w-16 text-blue-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
        </svg>
    </div>
);

const WarningIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.21 3.03-1.742 3.03H4.42c-1.532 0-2.492-1.696-1.742-3.03l5.58-9.92zM10 13a1 1 0 110-2 1 1 0 010 2zm-1-4a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
    </svg>
);


const ImageUploader: React.FC<ImageUploaderProps> = ({ id, label, onFileSelect, imageUrl }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [fileTypeError, setFileTypeError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  
  const [uncroppedImage, setUncroppedImage] = useState<string | null>(null);
  const [originalFile, setOriginalFile] = useState<File | null>(null);

  useEffect(() => {
    if (!imageUrl) {
      setFileTypeError(null);
    }
  }, [imageUrl]);
  
  const processFile = (file: File) => {
    console.log('📁 Processing file:', file.name, 'Type:', file.type, 'Size:', file.size);
    
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
        console.warn('❌ File type not allowed:', file.type);
        setFileTypeError('Please use PNG, JPG, or JPEG formats.');
        return;
    }
    
    // Check file size (mobile browsers have memory limitations)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
        console.warn('❌ File too large:', file.size);
        setFileTypeError('File size too large. Please use an image under 10MB.');
        return;
    }
    
    // Clear any previous errors
    setFileTypeError(null);
    setOriginalFile(file);
    
    // Mobile-optimized file reading approach
    const reader = new FileReader();
    
    reader.onload = function(event) {
        try {
            console.log('📖 FileReader onload triggered on mobile');
            if (event.target && event.target.result) {
                const result = event.target.result as string;
                console.log('✅ File read successfully, data URL length:', result.length);
                
                // Mobile-specific: Validate data URL more thoroughly
                if (result.startsWith('data:image/')) {
                    // For mobile: Check if the data URL is complete
                    const base64Data = result.split(',')[1];
                    if (base64Data && base64Data.length > 100) {
                        console.log('✅ Valid base64 data detected for mobile');
                        
                        // Mobile optimization: Add a small delay to ensure proper processing
                        setTimeout(() => {
                            setUncroppedImage(result);
                            console.log('✅ Image set for cropping on mobile');
                        }, 100);
                    } else {
                        console.error('❌ Incomplete or corrupted image data on mobile');
                        setFileTypeError('Image file appears corrupted. Please try a different image.');
                    }
                } else {
                    console.error('❌ Invalid data URL format on mobile');
                    setFileTypeError('Invalid image format. Please try a different image.');
                }
            } else {
                console.error('❌ No result from FileReader on mobile');
                setFileTypeError('Failed to read image file on mobile. Please try again.');
            }
        } catch (error) {
            console.error('❌ File processing error on mobile:', error);
            setFileTypeError('Error processing image on mobile device. Please try a different file.');
        }
    };
    
    reader.onerror = function(error) {
        console.error('❌ FileReader error:', error);
        setFileTypeError('Failed to read image file. Please try again or use a different image.');
    };
    
    reader.onabort = function() {
        console.warn('⚠️ File reading was aborted');
        setFileTypeError('File reading was cancelled. Please try again.');
    };
    
    reader.onloadstart = function() {
        console.log('🔄 Starting to read file...');
    };
    
    reader.onprogress = function(event) {
        if (event.lengthComputable) {
            const percentLoaded = Math.round((event.loaded / event.total) * 100);
            console.log('📊 File reading progress:', percentLoaded + '%');
        }
    };
    
    try {
        console.log('🚀 Starting FileReader.readAsDataURL() on mobile');
        // Mobile-specific: Add timeout to prevent hanging
        const timeoutId = setTimeout(() => {
            reader.abort();
            console.error('❌ FileReader timeout on mobile');
            setFileTypeError('File reading timeout on mobile. Please try a smaller image.');
        }, 30000); // 30 second timeout for mobile
        
        reader.addEventListener('loadend', () => {
            clearTimeout(timeoutId);
        });
        
        reader.readAsDataURL(file);
    } catch (error) {
        console.error('❌ FileReader start error on mobile:', error);
        setFileTypeError('Cannot read this image file on mobile. Please try a different format.');
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processFile(file);
    }
    if (event.target) {
        event.target.value = '';
    }
  };

  const handleClick = () => {
    inputRef.current?.click();
  };
  
  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setIsDraggingOver(true);
  }, []);

  const handleDragLeave = useCallback((event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setIsDraggingOver(false);
  }, []);

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setIsDraggingOver(false);
      
      const file = event.dataTransfer.files?.[0];
      if (file && file.type.startsWith('image/')) {
          processFile(file);
      }
  }, []);
  
  const handleCropComplete = (croppedFile: File) => {
      console.log('✅ Crop completed, file size:', croppedFile.size);
      onFileSelect(croppedFile);
      setUncroppedImage(null);
      setOriginalFile(null);
  };

  const handleCloseCropper = () => {
      setUncroppedImage(null);
      setOriginalFile(null);
  };
  
  const uploaderClasses = `w-full aspect-[4/3] sm:aspect-video rounded-2xl flex items-center justify-center transition-all duration-300 relative overflow-hidden group cursor-pointer ${
      isDraggingOver 
        ? 'bg-gradient-to-br from-blue-50 to-indigo-100 border-2 border-dashed border-blue-400 shadow-2xl scale-[1.02] ring-4 ring-blue-200/50'
      : imageUrl 
        ? 'bg-white border-2 border-solid border-green-300 hover:border-green-400 shadow-lg hover:shadow-xl'
      : isHovering
        ? 'bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-dashed border-blue-400 shadow-xl'
        : 'bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-dashed border-gray-300 shadow-md hover:shadow-lg'
  }`;

  return (
    <div className="flex flex-col items-center w-full">
      {label && (
        <div className="mb-6">
          <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">{label}</h3>
          <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div>
        </div>
      )}
      {uncroppedImage && originalFile && (
        <ImageCropModal 
          imageSrc={uncroppedImage}
          originalFile={originalFile}
          onClose={handleCloseCropper}
          onCropComplete={handleCropComplete}
        />
      )}
      <div
        className={uploaderClasses}
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <input
          type="file"
          id={id}
          ref={inputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={label || 'Uploaded Image'} 
            className="w-full h-full object-contain"
            crossOrigin="anonymous"
            loading="eager"
            onError={(e) => {
              console.error('Image preview error on mobile:', e);
              const img = e.target as HTMLImageElement;
              console.error('Failed image src:', img.src);
              // Mobile-specific: Try to reload the image once
              setTimeout(() => {
                if (img.src === imageUrl) {
                  console.log('Attempting to reload image on mobile...');
                  img.src = imageUrl + '?reload=' + Date.now();
                }
              }, 500);
              setFileTypeError('Image preview issue on mobile. The upload should still work.');
            }}
            onLoad={(e) => {
              console.log('✅ Image loaded successfully on mobile');
              setFileTypeError(null);
            }}
          />
        ) : (
          <div className="text-center p-6 sm:p-8">
            <UploadIcon isHovered={isHovering || isDraggingOver} />
            <div className="space-y-3">
              <h4 className={`text-lg sm:text-xl font-bold transition-colors ${
                isDraggingOver ? 'text-blue-600' : isHovering ? 'text-blue-700' : 'text-gray-800'
              }`}>
                {isDraggingOver ? 'Drop your image here!' : 'Upload your image'}
              </h4>
              <p className={`text-sm sm:text-base font-medium transition-colors ${
                isDraggingOver ? 'text-blue-600' : isHovering ? 'text-blue-600' : 'text-gray-600'
              }`}>
                {isDraggingOver ? 'Release to upload' : 'Tap to browse' + (/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ? '' : ' or drag & drop')}
              </p>
              <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
                <span className="bg-white/80 px-3 py-1 rounded-full border">PNG</span>
                <span className="bg-white/80 px-3 py-1 rounded-full border">JPG</span>
                <span className="bg-white/80 px-3 py-1 rounded-full border">Max 10MB</span>
              </div>
            </div>
            {uploadProgress !== null && (
              <div className="mt-6">
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600 mt-2">Uploading... {uploadProgress}%</p>
              </div>
            )}
          </div>
        )}
      </div>
      {fileTypeError && (
        <div className="w-full mt-4 text-sm text-red-700 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-xl p-4 flex items-start shadow-md animate-fade-in" role="alert">
            <WarningIcon />
            <div>
              <p className="font-semibold">Upload Error</p>
              <p>{fileTypeError}</p>
            </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;