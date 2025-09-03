import React from 'react';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { FiHome, FiUser, FiScissors, FiImage, FiSettings, FiInfo } from 'react-icons/fi';

const tabs = [
  { 
    id: 'home', 
    label: 'Home', 
    icon: FiHome, 
    path: '/',
    gradient: 'from-indigo-500 to-purple-600',
    inactiveColor: 'text-indigo-600 hover:text-indigo-700'
  },
  { 
    id: 'virtual-tryon', 
    label: 'Try On', 
    icon: FiUser, 
    path: '/virtual-tryon',
    gradient: 'from-purple-500 to-pink-500',
    inactiveColor: 'text-purple-600 hover:text-purple-700'
  },
  { 
    id: 'hair-style', 
    label: 'Hair', 
    icon: FiScissors, 
    path: '/hair-style',
    gradient: 'from-blue-500 to-cyan-500',
    inactiveColor: 'text-blue-600 hover:text-blue-700'
  },
  { 
    id: 'background', 
    label: 'Background', 
    icon: FiImage, 
    path: '/background',
    gradient: 'from-green-500 to-teal-500',
    inactiveColor: 'text-green-600 hover:text-green-700'
  },
  { 
    id: 'about', 
    label: 'About', 
    icon: FiInfo, 
    path: '/about',
    gradient: 'from-orange-500 to-red-500',
    inactiveColor: 'text-orange-600 hover:text-orange-700'
  },
  { 
    id: 'settings', 
    label: 'Settings', 
    icon: FiSettings, 
    path: '/settings',
    gradient: 'from-gray-500 to-slate-500',
    inactiveColor: 'text-gray-600 hover:text-gray-700'
  }
];

const TabNavigation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 pb-safe z-50 safe-area-inset-bottom">
      <div className="flex justify-around items-center py-2 px-1 sm:py-3 sm:px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = location.pathname === tab.path;
          
          return (
            <motion.button
              key={tab.id}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Navigating to:', tab.path);
                navigate(tab.path);
              }}
              className={`relative flex flex-col items-center py-2 px-1 sm:py-3 sm:px-2 rounded-xl transition-all duration-200 min-w-0 flex-1 touch-manipulation ${
                isActive ? 'text-white' : tab.inactiveColor
              }`}
            >
              {isActive && (
                <div
                  className={`absolute inset-0 bg-gradient-to-r ${tab.gradient} rounded-xl pointer-events-none`}
                />
              )}
              
              <div className="relative z-10 flex flex-col items-center">
                <Icon 
                  size={20} 
                  className={`mb-0.5 sm:mb-1 transition-all duration-200 ${
                    isActive ? 'text-white' : tab.inactiveColor.split(' hover:')[0]
                  }`}
                />
                <span className={`text-[10px] sm:text-xs font-medium transition-all duration-200 leading-tight text-center max-w-full overflow-hidden whitespace-nowrap text-ellipsis ${
                  isActive ? 'text-white' : tab.inactiveColor.split(' hover:')[0]
                }`}>
                  {tab.label}
                </span>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default TabNavigation;