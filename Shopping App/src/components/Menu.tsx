import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import imgRectangle6537 from "figma:asset/73a0a2712c55c814e558e14ad018e308fab9b18c.png";

interface MenuProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (screen: string) => void;
  totalBambicoins: number;
}

export default function Menu({ isOpen, onClose, onNavigate, totalBambicoins }: MenuProps) {
  const { user, isAuthenticated, logout } = useAuth();
  
  const handleNavigation = (screen: string) => {
    onNavigate(screen);
    onClose();
  };

  const handleLogout = () => {
    logout();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-black/50 z-40"
            onClick={onClose}
          />
          
          {/* Menu */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: "0%" }}
            exit={{ x: "-100%" }}
            transition={{
              type: "spring",
              damping: 25,
              stiffness: 400,
              mass: 0.8
            }}
            className="absolute left-0 top-0 bottom-0 w-[280px] bg-[#8B4513] z-50 overflow-hidden"
          >
            {/* Background Illustration */}
            <MaskGroup />
            
            {/* User Info & Bambicoins Display */}
            <div className="absolute top-[60px] left-4 right-4">
              {isAuthenticated && user ? (
                <div className="bg-[#FFD700] rounded-lg p-3 mb-3">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-[#8B4513] rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <div className="text-[#8B4513] font-medium text-[14px]">{user.name}</div>
                      <div className="text-[#8B4513] text-[12px] opacity-75">{user.email}</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-[16px]">🪙</span>
                      <span className="text-[#8B4513] font-medium text-[14px]">Бамбикоины</span>
                    </div>
                    <span className="text-[#8B4513] font-bold text-[16px]">{user.bambicoins}</span>
                  </div>
                </div>
              ) : (
                <div className="bg-[#FFD700] rounded-lg p-3 mb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-[20px]">🪙</span>
                      <span className="text-[#8B4513] font-medium">Бамбикоины</span>
                    </div>
                    <span className="text-[#8B4513] font-bold text-[18px]">{totalBambicoins}</span>
                  </div>
                </div>
              )}
            </div>
            
            {/* Menu Items */}
            <MenuItems onNavigate={handleNavigation} isAuthenticated={isAuthenticated} />
            
            {/* Logout Button */}
            {isAuthenticated && (
              <div className="absolute bottom-4 left-4 right-4">
                <button
                  onClick={handleLogout}
                  className="w-full bg-red-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-red-700 transition-colors"
                >
                  Выйти из аккаунта
                </button>
              </div>
            )}
            
            {/* Close Button */}
            <CloseButton onClick={onClose} />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function MaskGroup() {
  return null;
}

interface MenuItemsProps {
  onNavigate: (screen: string) => void;
  isAuthenticated: boolean;
}

function MenuItems({ onNavigate, isAuthenticated }: MenuItemsProps) {
  const menuItems = [
    { label: "Каталог", screen: "list", icon: "🏠" },
    { label: "Категории", screen: "categories", icon: "📂" },
    { label: "Бамбикоины", screen: "bambicoins", icon: "🪙" },
    { label: "О компании", screen: "about", icon: "ℹ️" },
    { label: isAuthenticated ? "Профиль" : "Войти", screen: "profile", icon: isAuthenticated ? "👤" : "🔑" },
    { label: "Корзина", screen: "basket", icon: "🛒" },
  ];

  return (
    <div className={`absolute left-4 ${isAuthenticated ? 'top-[200px]' : 'top-[140px]'} ${isAuthenticated ? 'bottom-20' : ''}`}>
      <div className="box-border content-stretch flex flex-col gap-6 items-start justify-start p-0 relative">
        {menuItems.map((item) => (
          <button
            key={item.screen}
            onClick={() => onNavigate(item.screen)}
            className="flex items-center gap-3 font-['Newsreader:Regular',_sans-serif] font-normal relative text-[#ffffff] text-[20px] text-left hover:opacity-80 transition-opacity"
          >
            <span className="text-[18px]">{item.icon}</span>
            <p className="adjustLetterSpacing block leading-[30px] whitespace-pre text-[20px]">
              {item.label}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}

interface CloseButtonProps {
  onClick: () => void;
}

function CloseButton({ onClick }: CloseButtonProps) {
  return (
    <button
      onClick={onClick}
      className="absolute block cursor-pointer left-[14px] overflow-visible rounded-2xl size-6 top-[35px] hover:opacity-80 transition-opacity"
    >
      <div className="absolute h-[9.5px] left-[5px] top-[5px] w-[9.6px]">
        <div className="absolute bottom-[-4.167%] left-[-4.123%] right-[-4.123%] top-[-4.167%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 15">
            <g>
              <path
                d="M1 1.00003L13.7279 13.7279"
                stroke="var(--stroke-0, white)"
                strokeWidth="1.5"
              />
              <path
                d="M1.13605 13.7279L13.864 1"
                stroke="var(--stroke-0, white)"
                strokeWidth="1.5"
              />
            </g>
          </svg>
        </div>
      </div>
    </button>
  );
}