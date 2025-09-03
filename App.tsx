/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './contexts/AppContext';
import SplashScreen from './components/SplashScreen';
import TabNavigation from './components/TabNavigation';
import HomePage from './pages/HomePage';
import VirtualTryOnPage from './pages/VirtualTryOnPage';
import HairStylePage from './pages/HairStylePage';
import BackgroundPage from './pages/BackgroundPage';
import SettingsPage from './pages/SettingsPage';
import LandingScreen from './components/LandingScreen';

const App: React.FC = () => {
  const [showSplash, setShowSplash] = useState<boolean>(true);
  const [showLanding, setShowLanding] = useState<boolean>(false);

  useEffect(() => {
    // Check if this is the first visit
    const hasVisitedBefore = localStorage.getItem('hasVisitedBefore');
    
    if (!hasVisitedBefore) {
      localStorage.setItem('hasVisitedBefore', 'true');
      setShowLanding(true);
    } else {
      setShowLanding(false);
    }
  }, []);

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  const handleEnterApp = () => {
    setShowLanding(false);
  };

  // Show splash screen first
  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  // Show landing screen for first-time users
  if (showLanding) {
    return (
      <LandingScreen 
        onEnterApp={handleEnterApp}
        onLearnMore={() => {}} // We can implement this later if needed
      />
    );
  }

  // Main app with routing
  return (
    <AppProvider>
      <Router>
        <div className="flex flex-col h-screen bg-gray-50">
          <div className="flex-1 overflow-hidden">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/virtual-tryon" element={<VirtualTryOnPage />} />
              <Route path="/hair-style" element={<HairStylePage />} />
              <Route path="/background" element={<BackgroundPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Routes>
          </div>
          <TabNavigation />
        </div>
      </Router>
    </AppProvider>
  );
};

export default App;