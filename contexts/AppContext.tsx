import React, { createContext, useContext, useState, ReactNode } from 'react';

// Types for different features
export interface VirtualTryOnState {
  subjectImage: string | null;
  outfitImage: string | null;
  bodyBuild: string;
  resultImage: string | null;
  selectedAngle: string;
  isProcessing: boolean;
}

export interface HairStyleState {
  userPhoto: string | null;
  hairStyleImage: string | null;
  hairStylePrompt: string;
  resultImage: string | null;
  selectedGender: 'male' | 'female' | 'unisex';
  isProcessing: boolean;
}

export interface BackgroundState {
  userPhoto: string | null;
  backgroundImage: string | null;
  backgroundPrompt: string;
  resultImage: string | null;
  placementMode: 'auto' | 'manual';
  isProcessing: boolean;
}

export interface AppState {
  apiKey: string;
  user: {
    name: string;
    savedImages: string[];
  };
  virtualTryOn: VirtualTryOnState;
  hairStyle: HairStyleState;
  background: BackgroundState;
}

interface AppContextType {
  state: AppState;
  updateApiKey: (key: string) => void;
  updateVirtualTryOn: (updates: Partial<VirtualTryOnState>) => void;
  updateHairStyle: (updates: Partial<HairStyleState>) => void;
  updateBackground: (updates: Partial<BackgroundState>) => void;
  saveImage: (imageUrl: string) => void;
  clearFeatureState: (feature: 'virtualTryOn' | 'hairStyle' | 'background') => void;
}

const initialState: AppState = {
  apiKey: '',
  user: {
    name: '',
    savedImages: []
  },
  virtualTryOn: {
    subjectImage: null,
    outfitImage: null,
    bodyBuild: 'Average',
    resultImage: null,
    selectedAngle: 'front',
    isProcessing: false
  },
  hairStyle: {
    userPhoto: null,
    hairStyleImage: null,
    hairStylePrompt: '',
    resultImage: null,
    selectedGender: 'unisex',
    isProcessing: false
  },
  background: {
    userPhoto: null,
    backgroundImage: null,
    backgroundPrompt: '',
    resultImage: null,
    placementMode: 'auto',
    isProcessing: false
  }
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [state, setState] = useState<AppState>(initialState);

  const updateApiKey = (key: string) => {
    setState(prev => ({ ...prev, apiKey: key }));
  };

  const updateVirtualTryOn = (updates: Partial<VirtualTryOnState>) => {
    setState(prev => ({
      ...prev,
      virtualTryOn: { ...prev.virtualTryOn, ...updates }
    }));
  };

  const updateHairStyle = (updates: Partial<HairStyleState>) => {
    setState(prev => ({
      ...prev,
      hairStyle: { ...prev.hairStyle, ...updates }
    }));
  };

  const updateBackground = (updates: Partial<BackgroundState>) => {
    setState(prev => ({
      ...prev,
      background: { ...prev.background, ...updates }
    }));
  };

  const saveImage = (imageUrl: string) => {
    setState(prev => ({
      ...prev,
      user: {
        ...prev.user,
        savedImages: [...prev.user.savedImages, imageUrl]
      }
    }));
  };

  const clearFeatureState = (feature: 'virtualTryOn' | 'hairStyle' | 'background') => {
    setState(prev => ({
      ...prev,
      [feature]: initialState[feature]
    }));
  };

  const contextValue: AppContextType = {
    state,
    updateApiKey,
    updateVirtualTryOn,
    updateHairStyle,
    updateBackground,
    saveImage,
    clearFeatureState
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;