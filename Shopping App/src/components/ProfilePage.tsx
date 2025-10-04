import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';

interface ProfilePageProps {
  onBack: () => void;
  onMenuClick: () => void;
  cartCount: number;
  totalBambicoins: number;
  onLoginClick?: () => void;
}

export default function ProfilePage({ onBack, onMenuClick, cartCount, totalBambicoins, onLoginClick }: ProfilePageProps) {
  const { user, logout, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || ''
  });

  const handleEdit = () => {
    setIsEditing(true);
    setEditForm({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || ''
    });
  };

  const handleSave = () => {
    updateProfile(editForm);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditForm({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || ''
    });
  };

  const handleLogout = () => {
    logout();
    onBack();
  };

  if (!user) {
    return (
      <div className="w-full h-full bg-white relative overflow-hidden">
        {/* Status Bar */}
        <div className="absolute top-0 left-0 right-0 h-[47px] bg-white z-10 flex items-center justify-between px-6">
          <button
            onClick={onBack}
            className="w-6 h-6 flex items-center justify-center"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M15 18L9 12L15 6"
                stroke="black"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <span className="text-[16px]">🪙</span>
              <span className="text-[14px] font-medium text-gray-700">{totalBambicoins}</span>
            </div>
            
            <button
              onClick={onMenuClick}
              className="w-6 h-6 flex items-center justify-center"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M3 12H21M3 6H21M3 18H21"
                  stroke="black"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Not Logged In State */}
        <div className="pt-[47px] px-6 pb-6 h-full flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">👤</span>
            </div>
            <h2 className="text-[24px] font-bold text-gray-900 mb-2">
              Войдите в аккаунт
            </h2>
            <p className="text-[16px] text-gray-600 mb-6">
              Чтобы просмотреть свой профиль и управлять настройками
            </p>
            <button
              onClick={onLoginClick || onBack}
              className="bg-[#8B4513] text-white py-3 px-6 rounded-lg font-medium hover:bg-[#6B3410] transition-colors"
            >
              Войти
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-white relative overflow-hidden">
      {/* Status Bar */}
      <div className="absolute top-0 left-0 right-0 h-[47px] bg-white z-10 flex items-center justify-between px-6">
        <button
          onClick={onBack}
          className="w-6 h-6 flex items-center justify-center"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M15 18L9 12L15 6"
              stroke="black"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <span className="text-[16px]">🪙</span>
            <span className="text-[14px] font-medium text-gray-700">{user.bambicoins}</span>
          </div>
          
          <button
            onClick={onMenuClick}
            className="w-6 h-6 flex items-center justify-center"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M3 12H21M3 6H21M3 18H21"
                stroke="black"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-[47px] px-6 pb-6 h-full overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Profile Header */}
          <div className="text-center mb-8">
            <div className="w-24 h-24 bg-[#8B4513] rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl text-white">
                {user.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <h1 className="text-[28px] font-bold text-gray-900 mb-2">
              {user.name}
            </h1>
            <p className="text-[16px] text-gray-600">
              {user.email}
            </p>
          </div>

          {/* Profile Stats */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <div className="text-[24px] font-bold text-[#8B4513] mb-1">
                {user.bambicoins}
              </div>
              <div className="text-[12px] text-gray-600">Бамбикоины</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <div className="text-[24px] font-bold text-[#8B4513] mb-1">
                {user.totalOrders}
              </div>
              <div className="text-[12px] text-gray-600">Заказов</div>
            </div>
          </div>

          {/* Profile Information */}
          <div className="space-y-6">
            <div>
              <h2 className="text-[20px] font-bold text-gray-900 mb-4">
                Личная информация
              </h2>
              
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-[14px] font-medium text-gray-700 mb-2">
                      Имя
                    </label>
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B4513] focus:border-transparent outline-none"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-[14px] font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={editForm.email}
                      onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B4513] focus:border-transparent outline-none"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-[14px] font-medium text-gray-700 mb-2">
                      Телефон
                    </label>
                    <input
                      type="tel"
                      value={editForm.phone}
                      onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B4513] focus:border-transparent outline-none"
                      placeholder="+7 (999) 123-45-67"
                    />
                  </div>
                  
                  <div className="flex gap-3">
                    <button
                      onClick={handleSave}
                      className="flex-1 bg-[#8B4513] text-white py-3 px-4 rounded-lg font-medium hover:bg-[#6B3410] transition-colors"
                    >
                      Сохранить
                    </button>
                    <button
                      onClick={handleCancel}
                      className="flex-1 bg-gray-200 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                    >
                      Отмена
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b border-gray-200">
                    <span className="text-[16px] text-gray-600">Имя</span>
                    <span className="text-[16px] font-medium text-gray-900">{user.name}</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-3 border-b border-gray-200">
                    <span className="text-[16px] text-gray-600">Email</span>
                    <span className="text-[16px] font-medium text-gray-900">{user.email}</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-3 border-b border-gray-200">
                    <span className="text-[16px] text-gray-600">Телефон</span>
                    <span className="text-[16px] font-medium text-gray-900">
                      {user.phone || 'Не указан'}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center py-3 border-b border-gray-200">
                    <span className="text-[16px] text-gray-600">Дата регистрации</span>
                    <span className="text-[16px] font-medium text-gray-900">
                      {new Date(user.joinDate).toLocaleDateString('ru-RU')}
                    </span>
                  </div>
                  
                  <button
                    onClick={handleEdit}
                    className="w-full bg-[#8B4513] text-white py-3 px-4 rounded-lg font-medium hover:bg-[#6B3410] transition-colors"
                  >
                    Редактировать профиль
                  </button>
                </div>
              )}
            </div>

            {/* Account Actions */}
            <div>
              <h2 className="text-[20px] font-bold text-gray-900 mb-4">
                Управление аккаунтом
              </h2>
              
              <div className="space-y-3">
                <button className="w-full bg-gray-50 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-100 transition-colors text-left">
                  📋 История заказов
                </button>
                
                <button className="w-full bg-gray-50 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-100 transition-colors text-left">
                  ❤️ Избранные товары
                </button>
                
                <button className="w-full bg-gray-50 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-100 transition-colors text-left">
                  🔔 Уведомления
                </button>
                
                <button className="w-full bg-gray-50 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-100 transition-colors text-left">
                  🛡️ Безопасность
                </button>
              </div>
            </div>

            {/* Logout Button */}
            <div className="pt-6">
              <button
                onClick={handleLogout}
                className="w-full bg-red-50 text-red-600 py-3 px-4 rounded-lg font-medium hover:bg-red-100 transition-colors border border-red-200"
              >
                Выйти из аккаунта
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
