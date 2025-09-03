import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../contexts/AppContext';
import { FiGlobe, FiCheck } from 'react-icons/fi';

const LanguageSwitcher: React.FC = () => {
  const { t } = useTranslation('pages');
  const { state, updateLanguage } = useAppContext();

  const languages = [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'ar', name: 'Arabic', nativeName: 'العربية' }
  ];

  const handleLanguageChange = (languageCode: string) => {
    updateLanguage(languageCode);
  };

  return (
    <motion.div
      className="bg-white rounded-xl p-6 shadow-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center mb-4">
        <FiGlobe className="text-blue-600 mr-3" size={24} />
        <h2 className="text-xl font-bold text-gray-800">
          {t('settings.languageSettings.title')}
        </h2>
      </div>
      
      <div className="space-y-3">
        <div className="text-sm text-gray-600 mb-4">
          {t('settings.languageSettings.currentLanguage')}: {' '}
          <span className="font-semibold">
            {languages.find(lang => lang.code === state.language)?.nativeName}
          </span>
        </div>

        <div className="space-y-2">
          {languages.map((language) => (
            <motion.button
              key={language.code}
              onClick={() => handleLanguageChange(language.code)}
              className={`w-full flex items-center justify-between p-4 rounded-lg border transition-all duration-200 ${
                state.language === language.code
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-blue-300 hover:bg-blue-50'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center">
                <div className="flex flex-col items-start">
                  <span className="font-semibold text-left">{language.nativeName}</span>
                  <span className="text-sm opacity-75 text-left">{language.name}</span>
                </div>
              </div>
              
              {state.language === language.code && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="flex items-center justify-center w-6 h-6 bg-blue-500 rounded-full"
                >
                  <FiCheck className="text-white" size={14} />
                </motion.div>
              )}
            </motion.button>
          ))}
        </div>

        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-700">
            💡 {state.language === 'ar' 
              ? 'سيتم تطبيق التغيير فوراً على كامل التطبيق'
              : 'Language changes apply immediately to the entire app'
            }
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default LanguageSwitcher;