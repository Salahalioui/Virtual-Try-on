import React from 'react';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { FiUser, FiScissors, FiImage, FiSettings } from 'react-icons/fi';

const tabs = [
  { 
    id: 'virtual-tryon', 
    label: 'Try On', 
    icon: FiUser, 
    path: '/virtual-tryon',
    gradient: 'from-purple-500 to-pink-500'
  },
  { 
    id: 'hair-style', 
    label: 'Hair Style', 
    icon: FiScissors, 
    path: '/hair-style',
    gradient: 'from-blue-500 to-cyan-500'
  },
  { 
    id: 'background', 
    label: 'Background', 
    icon: FiImage, 
    path: '/background',
    gradient: 'from-green-500 to-teal-500'
  },
  { 
    id: 'settings', 
    label: 'Settings', 
    icon: FiSettings, 
    path: '/settings',
    gradient: 'from-gray-500 to-slate-500'
  }
];

const TabNavigation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 pb-safe">
      <div className="flex justify-around items-center py-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = location.pathname === tab.path;
          
          return (
            <motion.button
              key={tab.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(tab.path)}
              className={`flex flex-col items-center py-2 px-4 rounded-xl transition-all duration-200 ${
                isActive ? 'text-white' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className={`absolute inset-0 bg-gradient-to-r ${tab.gradient} rounded-xl`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                />
              )}
              
              <div className="relative z-10 flex flex-col items-center">
                <Icon 
                  size={24} 
                  className={`mb-1 transition-all duration-200 ${
                    isActive ? 'text-white' : 'text-gray-500'
                  }`}
                />
                <span className={`text-xs font-medium transition-all duration-200 ${
                  isActive ? 'text-white' : 'text-gray-500'
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