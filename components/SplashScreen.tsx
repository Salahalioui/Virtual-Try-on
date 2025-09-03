import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const { t } = useTranslation('common');
  const [loadingText, setLoadingText] = useState(t('loading.loading'));
  
  useEffect(() => {
    const loadingSteps = [
      t('loading.initializing'),
      t('loading.settingUp'),
      t('loading.preparing'),
      t('loading.almostReady')
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < loadingSteps.length) {
        setLoadingText(loadingSteps[currentStep]);
        currentStep++;
      } else {
        clearInterval(interval);
        setTimeout(onComplete, 800);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-purple-600 via-blue-600 to-teal-500 flex flex-col items-center justify-center z-50">
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center"
      >
        <div className="text-6xl mb-8">✨</div>
        <h1 className="text-4xl font-bold text-white mb-4">{t('loading.loading').includes('...') ? 'StyleAI' : 'ستايل إيه آي'}</h1>
        <p className="text-xl text-white/80 mb-8">Virtual Styling Assistant</p>
        
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full mx-auto mb-4"
        />
        
        <motion.p
          key={loadingText}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-white/90 text-lg"
        >
          {loadingText}
        </motion.p>
      </motion.div>
    </div>
  );
};

export default SplashScreen;