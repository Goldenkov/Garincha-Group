import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth, TwoFactorProvider } from '../contexts/AuthContext';
import { createOtpAuthUrl, generateTwoFactorSecret, verifyTotpToken } from '../utils/totp';

interface ProfilePageProps {
  onBack: () => void;
  onMenuClick: () => void;
  cartCount: number;
  totalBambicoins: number;
  onLoginClick?: () => void;
}

export default function ProfilePage({ onBack, onMenuClick, cartCount, totalBambicoins, onLoginClick }: ProfilePageProps) {
  const { user, logout, updateProfile, enableTwoFactor, disableTwoFactor } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || ''
  });
  const [twoFactorInfo, setTwoFactorInfo] = useState('');
  const [isTwoFactorSetupVisible, setIsTwoFactorSetupVisible] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<TwoFactorProvider>('google');
  const [twoFactorSecret, setTwoFactorSecret] = useState<string | null>(null);
  const [twoFactorOtp, setTwoFactorOtp] = useState('');
  const [twoFactorOtpauth, setTwoFactorOtpauth] = useState<string | null>(null);

  const getProviderLabel = (provider?: TwoFactorProvider) => {
    switch (provider) {
      case 'yandex':
        return 'Яндекс.Аутентификатор';
      case 'google':
        return 'Google Authenticator';
      default:
        return 'приложение-аутентификатор';
    }
  };

  const resetTwoFactorSetup = () => {
    setIsTwoFactorSetupVisible(false);
    setTwoFactorSecret(null);
    setTwoFactorOtp('');
    setTwoFactorOtpauth(null);
  };

  const handleCancelTwoFactor = () => {
    resetTwoFactorSetup();
    setTwoFactorInfo('Настройка двухфакторной аутентификации отменена.');
  };

  const handleStartTwoFactor = (provider: TwoFactorProvider) => {
    if (!user) {
      return;
    }

    setSelectedProvider(provider);
    setTwoFactorInfo('');

    try {
      const secret = generateTwoFactorSecret();
      const identifier = user.email || user.phone || user.name || 'Shopping App';
      const otpauth = createOtpAuthUrl(secret, identifier, 'Shopping App', provider);

      setTwoFactorSecret(secret);
      setTwoFactorOtpauth(otpauth);
      setTwoFactorOtp('');
      setIsTwoFactorSetupVisible(true);
    } catch (error) {
      console.error('Не удалось сгенерировать секрет для 2FA:', error);
      setTwoFactorInfo('Не удалось сгенерировать секретный ключ. Проверьте поддержку Web Crypto API в браузере.');
      resetTwoFactorSetup();
    }
  };

  const handleConfirmTwoFactor = async () => {
    if (!twoFactorSecret) {
      setTwoFactorInfo('Сначала сгенерируйте секретный ключ.');
      return;
    }

    if (!twoFactorOtp.trim()) {
      setTwoFactorInfo('Введите код подтверждения из приложения-аутентификатора.');
      return;
    }

    try {
      const isValid = await verifyTotpToken(twoFactorOtp.trim(), twoFactorSecret);

      if (!isValid) {
        setTwoFactorInfo('Неверный код. Проверьте приложение и попробуйте снова.');
        return;
      }

      enableTwoFactor({ type: selectedProvider, secret: twoFactorSecret });
      setTwoFactorInfo('Двухфакторная аутентификация успешно включена.');
      resetTwoFactorSetup();
    } catch (error) {
      console.error('Не удалось проверить код двухфакторной аутентификации:', error);
      setTwoFactorInfo('Не удалось проверить код. Убедитесь, что устройство поддерживает Web Crypto API.');
    }
  };

  const handleDisableTwoFactor = () => {
    disableTwoFactor();
    setTwoFactorInfo('Двухфакторная аутентификация отключена.');
    resetTwoFactorSetup();
  };

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
              </div>
            </div>

            <div>
              <h2 className="text-[20px] font-bold text-gray-900 mb-4">
                Безопасность
              </h2>

              <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <p className="text-[16px] font-semibold text-gray-900">Двухфакторная аутентификация</p>
                    <p className="text-[14px] text-gray-600">
                      {user.twoFactorEnabled
                        ? `Включена (${getProviderLabel(user.twoFactorType)})`
                        : 'Выключена'}
                    </p>
                  </div>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-[12px] font-medium ${user.twoFactorEnabled ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-700'}`}>
                    {user.twoFactorEnabled ? 'Активна' : 'Выключена'}
                  </span>
                </div>

                {twoFactorInfo && (
                  <div className="bg-white border border-[#8B4513]/20 rounded-lg px-4 py-3 text-[14px] text-gray-700">
                    {twoFactorInfo}
                  </div>
                )}

                {user.twoFactorEnabled ? (
                  <div className="space-y-3">
                    <p className="text-[14px] text-gray-600">
                      При входе после пароля потребуется код из {getProviderLabel(user.twoFactorType)}.
                    </p>
                    <button
                      onClick={handleDisableTwoFactor}
                      className="w-full bg-red-50 text-red-600 py-3 px-4 rounded-lg font-medium hover:bg-red-100 transition-colors border border-red-200"
                    >
                      Отключить двухфакторную аутентификацию
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-[14px] text-gray-600">
                      Подключите второй фактор через любимое приложение-аутентификатор. Поддерживаются Google Authenticator и Яндекс.Аутентификатор.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={() => handleStartTwoFactor('google')}
                        className="flex-1 bg-[#8B4513] text-white py-3 px-4 rounded-lg font-medium hover:bg-[#6B3410] transition-colors"
                      >
                        Google Authenticator
                      </button>
                      <button
                        onClick={() => handleStartTwoFactor('yandex')}
                        className="flex-1 bg-gray-200 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                      >
                        Яндекс.Аутентификатор
                      </button>
                    </div>
                  </div>
                )}

                {isTwoFactorSetupVisible && !user.twoFactorEnabled && (
                  <div className="border border-[#8B4513]/20 rounded-lg p-4 bg-white space-y-4">
                    <h3 className="text-[16px] font-semibold text-gray-900">
                      Подключение ({getProviderLabel(selectedProvider)})
                    </h3>
                    <p className="text-[14px] text-gray-600">
                      Добавьте аккаунт вручную и подтвердите 6-значным кодом из приложения.
                    </p>

                    <div className="bg-gray-100 rounded-lg p-3">
                      <p className="text-[12px] text-gray-600">Секретный ключ для ввода вручную:</p>
                      <p className="font-mono text-[16px] text-gray-900 break-all">{twoFactorSecret}</p>
                    </div>

                    {twoFactorOtpauth && (
                      <p className="text-[12px] text-gray-600 break-all">
                        Быстрое добавление (откроется соответствующее приложение):{' '}
                        <a href={twoFactorOtpauth} className="text-[#8B4513] underline break-all">{twoFactorOtpauth}</a>
                      </p>
                    )}

                    <ol className="list-decimal list-inside space-y-1 text-[12px] text-gray-600">
                      <li>Откройте {getProviderLabel(selectedProvider)} и выберите добавление аккаунта.</li>
                      <li>Введите секретный ключ вручную или воспользуйтесь ссылкой выше.</li>
                      <li>Введите текущий код из приложения в поле ниже и подтвердите.</li>
                    </ol>

                    <div>
                      <label className="block text-[14px] font-medium text-gray-700 mb-2">
                        Код из приложения
                      </label>
                      <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={twoFactorOtp}
                        onChange={(e) => setTwoFactorOtp(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B4513] focus:border-transparent outline-none tracking-[0.3em] text-center"
                        placeholder="123456"
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={handleConfirmTwoFactor}
                        className="flex-1 bg-[#8B4513] text-white py-3 px-4 rounded-lg font-medium hover:bg-[#6B3410] transition-colors"
                      >
                        Подтвердить код
                      </button>
                      <button
                        onClick={handleCancelTwoFactor}
                        className="flex-1 bg-gray-200 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                      >
                        Отмена
                      </button>
                    </div>
                  </div>
                )}
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
