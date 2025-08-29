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
      className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4 animate-fade-in"
      aria-modal="true"
      role="dialog"
    >
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-3xl p-6 md:p-8 relative transform transition-all flex flex-col"
        role="document"
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

        <div className="flex justify-center bg-zinc-100 p-4 rounded-lg">
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
              style={{ maxHeight: '60vh', objectFit: 'contain' }}
            />
          </ReactCrop>
        </div>

        <div className="mt-6 flex flex-wrap justify-end gap-3">
          <button
            onClick={onClose}
            className="bg-zinc-200 hover:bg-zinc-300 text-zinc-800 font-bold py-2 px-6 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onCropComplete(originalFile)}
            className="bg-zinc-500 hover:bg-zinc-600 text-white font-bold py-2 px-6 rounded-lg transition-colors"
          >
            Use Full Image
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

const UploadIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-zinc-500 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
    </svg>
);

const WarningIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.21 3.03-1.742 3.03H4.42c-1.532 0-2.492-1.696-1.742-3.03l5.58-9.92zM10 13a1 1 0 110-2 1 1 0 010 2zm-1-4a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
    </svg>
);


const ImageUploader: React.FC<ImageUploaderProps> = ({ id, label, onFileSelect, imageUrl }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [fileTypeError, setFileTypeError] = useState<string | null>(null);
  
  const [uncroppedImage, setUncroppedImage] = useState<string | null>(null);
  const [originalFile, setOriginalFile] = useState<File | null>(null);

  useEffect(() => {
    if (!imageUrl) {
      setFileTypeError(null);
    }
  }, [imageUrl]);
  
  const processFile = (file: File) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
        setFileTypeError('Please use PNG, JPG, or JPEG formats.');
        return;
    }
    setFileTypeError(null);

    setOriginalFile(file);
    const reader = new FileReader();
    reader.addEventListener('load', () => {
        setUncroppedImage(reader.result as string);
    });
    reader.readAsDataURL(file);
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
      onFileSelect(croppedFile);
      setUncroppedImage(null);
      setOriginalFile(null);
  };

  const handleCloseCropper = () => {
      setUncroppedImage(null);
      setOriginalFile(null);
  };
  
  const uploaderClasses = `w-full aspect-video bg-zinc-100 border-2 border-dashed rounded-lg flex items-center justify-center transition-all duration-300 relative overflow-hidden ${
      isDraggingOver ? 'border-blue-500 bg-blue-50'
    : 'border-zinc-300 hover:border-blue-500 cursor-pointer'
  }`;

  return (
    <div className="flex flex-col items-center w-full">
      {label && <h3 className="text-xl font-semibold mb-4 text-zinc-700">{label}</h3>}
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
      >
        <input
          type="file"
          id={id}
          ref={inputRef}
          onChange={handleFileChange}
          accept="image/png, image/jpeg"
          className="hidden"
        />
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={label || 'Uploaded Image'} 
            className="w-full h-full object-contain" 
          />
        ) : (
          <div className="text-center text-zinc-500 p-4">
            <UploadIcon />
            <p>Click to upload or drag & drop</p>
          </div>
        )}
      </div>
      {fileTypeError && (
        <div className="w-full mt-2 text-sm text-yellow-800 bg-yellow-100 border border-yellow-300 rounded-lg p-3 flex items-center animate-fade-in" role="alert">
            <WarningIcon />
            <span>{fileTypeError}</span>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;