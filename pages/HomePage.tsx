import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiUser, FiScissors, FiImage, FiStar, FiZap, FiHeart } from 'react-icons/fi';


const HomePage: React.FC = () => {
  const { t } = useTranslation('pages');
  const navigate = useNavigate();

  const featureCards = [
    {
      id: 'virtual-tryon',
      title: t('home.features.virtualTryOn.title'),
      description: t('home.features.virtualTryOn.description'),
      icon: FiUser,
      gradient: 'from-purple-500 to-pink-500',
      path: '/virtual-tryon',
      features: t('home.features.virtualTryOn.points', { returnObjects: true }) as string[]
    },
    {
      id: 'hair-style',
      title: t('home.features.hairStyling.title'),
      description: t('home.features.hairStyling.description'),
      icon: FiScissors,
      gradient: 'from-blue-500 to-cyan-500',
      path: '/hair-style',
      features: t('home.features.hairStyling.points', { returnObjects: true }) as string[]
    },
    {
      id: 'background',
      title: t('home.features.backgroundChanger.title'),
      description: t('home.features.backgroundChanger.description'),
      icon: FiImage,
      gradient: 'from-green-500 to-teal-500',
      path: '/background',
      features: t('home.features.backgroundChanger.points', { returnObjects: true }) as string[]
    }
  ];

  return (
    <div className="bg-gradient-to-br from-slate-50 to-gray-100 pb-20 overflow-y-auto h-full">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="px-6 py-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="flex items-center justify-center mb-4">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mr-3"
              >
                <FiZap className="text-white text-xl" />
              </motion.div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                {t('home.title')}
              </h1>
            </div>
            <p className="text-gray-600 text-lg">
              {t('home.subtitle')}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              {t('home.description')}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="px-4 py-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-center mb-6">
            <FiStar className="text-yellow-500 mr-2" />
            <h2 className="text-xl font-semibold text-gray-800">{t('home.chooseJourney')}</h2>
            <FiHeart className="text-red-500 ml-2" />
          </div>
        </motion.div>

        <div className="space-y-4">
          {featureCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                whileTap={{ scale: 0.98 }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden"
              >
                <button
                  onClick={() => navigate(card.path)}
                  className="w-full p-6 text-left hover:bg-gray-50 transition-colors duration-200"
                >
                  <div className="flex items-start space-x-4">
                    {/* Icon */}
                    <div className={`w-16 h-16 bg-gradient-to-r ${card.gradient} rounded-2xl flex items-center justify-center flex-shrink-0`}>
                      <Icon className="text-white text-2xl" />
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {card.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-3 leading-relaxed">
                        {card.description}
                      </p>
                      
                      {/* Features */}
                      <div className="flex flex-wrap gap-2">
                        {card.features.map((feature, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Arrow */}
                    <div className="flex items-center">
                      <div className="text-gray-400 text-xl">›</div>
                    </div>
                  </div>
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Bottom CTA */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="px-6 py-4"
      >
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 text-center text-white">
          <h3 className="text-lg font-bold mb-2">{t('home.readyToTry')}</h3>
          <p className="text-sm text-indigo-100 mb-4">
            {t('home.pickFeature')}
          </p>
          <div className="flex justify-center">
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <FiZap className="text-yellow-300 text-2xl" />
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default HomePage;