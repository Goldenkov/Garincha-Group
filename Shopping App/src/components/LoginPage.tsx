import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';

interface LoginPageProps {
  onBack: () => void;
  onMenuClick: () => void;
  cartCount: number;
  totalBambicoins: number;
  onLoginSuccess?: () => void;
}

export default function LoginPage({ onBack, onMenuClick, cartCount, totalBambicoins, onLoginSuccess }: LoginPageProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [identifier, setIdentifier] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [needsOtp, setNeedsOtp] = useState(false);
  const [otpCode, setOtpCode] = useState('');

  const { login, register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (isLogin) {
        if (!identifier.trim()) {
          setError('Введите email или номер телефона');
          setIsLoading(false);
          return;
        }

        const result = await login(identifier, password, needsOtp ? otpCode : undefined);

        if (result.success) {
          setNeedsOtp(false);
          setOtpCode('');
          setIdentifier('');
          setPassword('');
          if (onLoginSuccess) {
            onLoginSuccess();
          } else {
            onBack();
          }
          return;
        }

        if (result.requiresOtp) {
          setNeedsOtp(true);
          setError(result.message || 'Введите одноразовый код из приложения-аутентификатора');
        } else {
          setNeedsOtp(false);
          setOtpCode('');
          setError(result.message || 'Неверный email/телефон или пароль');
        }
      } else {
        if (!name.trim()) {
          setError('Введите имя');
          setIsLoading(false);
          return;
        }
        const success = await register(email, password, name, phone);
        if (!success) {
          setError('Пользователь с таким email или телефоном уже существует');
        } else {
          setIdentifier('');
          setPassword('');
          setName('');
          setPhone('');
          setEmail('');
          if (onLoginSuccess) {
            onLoginSuccess();
          } else {
            onBack();
          }
          setIsLoading(false);
          return;
        }
      }
    } catch (error) {
      console.error('Ошибка при обработке формы входа/регистрации:', error);
      setError('Произошла ошибка. Попробуйте еще раз.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setIdentifier('demo@example.com');
    setPassword('demo123');
    setIsLoading(true);

    try {
      const result = await login('demo@example.com', 'demo123', needsOtp ? otpCode : undefined);

      if (result.success) {
        setNeedsOtp(false);
        setOtpCode('');
        if (onLoginSuccess) {
          onLoginSuccess();
        } else {
          onBack();
        }
      } else if (result.requiresOtp) {
        setNeedsOtp(true);
        setError(result.message || 'Введите код из приложения-аутентификатора для демо-аккаунта');
      } else {
        setError(result.message || 'Ошибка демо-входа');
      }
    } catch (demoError) {
      console.error('Ошибка демо-входа:', demoError);
      setError('Не удалось выполнить демо-вход. Попробуйте еще раз.');
    } finally {
      setIsLoading(false);
    }
  };

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

      {/* Main Content */}
      <div className="pt-[47px] px-6 pb-6 h-full overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-sm mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-[28px] font-bold text-gray-900 mb-2">
              {isLogin ? 'Вход' : 'Регистрация'}
            </h1>
            <p className="text-[16px] text-gray-600">
              {isLogin 
                ? 'Войдите в свой аккаунт' 
                : 'Создайте новый аккаунт'
              }
            </p>
          </div>

          {/* Demo Login Button */}
          {isLogin && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              onClick={handleDemoLogin}
              disabled={isLoading}
              className="w-full mb-6 bg-[#8B4513] text-white py-3 px-4 rounded-lg font-medium hover:bg-[#6B3410] transition-colors disabled:opacity-50"
            >
              🚀 Демо-вход
            </motion.button>
          )}

          {/* Form */}
          <motion.form
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            {!isLogin && (
              <div>
                <label className="block text-[14px] font-medium text-gray-700 mb-2">
                  Имя *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B4513] focus:border-transparent outline-none"
                  placeholder="Введите ваше имя"
                  required={!isLogin}
                />
              </div>
            )}

            {isLogin ? (
              <div>
                <label className="block text-[14px] font-medium text-gray-700 mb-2">
                  Email или телефон *
                </label>
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B4513] focus:border-transparent outline-none"
                  placeholder="example@email.com или +7 (999) 123-45-67"
                  required={isLogin}
                />
              </div>
            ) : (
              <div>
                <label className="block text-[14px] font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B4513] focus:border-transparent outline-none"
                  placeholder="example@email.com"
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-[14px] font-medium text-gray-700 mb-2">
                Пароль *
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B4513] focus:border-transparent outline-none"
                placeholder="Введите пароль"
                required
                minLength={6}
              />
            </div>

            {needsOtp && (
              <div>
                <label className="block text-[14px] font-medium text-gray-700 mb-2">
                  Код подтверждения *
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B4513] focus:border-transparent outline-none tracking-[0.3em] text-center uppercase"
                  placeholder="123456"
                  required={needsOtp}
                />
                <p className="mt-2 text-[12px] text-gray-600">
                  Откройте Google Authenticator или Яндекс.Аутентификатор и введите текущий 6-значный код.
                </p>
              </div>
            )}

            {!isLogin && (
              <div>
                <label className="block text-[14px] font-medium text-gray-700 mb-2">
                  Телефон
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B4513] focus:border-transparent outline-none"
                  placeholder="+7 (999) 123-45-67"
                />
              </div>
            )}

            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-[14px]"
              >
                {error}
              </motion.div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#8B4513] text-white py-3 px-4 rounded-lg font-medium hover:bg-[#6B3410] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  {isLogin ? 'Вход...' : 'Регистрация...'}
                </div>
              ) : (
                isLogin ? 'Войти' : 'Зарегистрироваться'
              )}
            </button>
          </motion.form>

          {/* Switch Mode */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-center mt-6"
          >
            <p className="text-[14px] text-gray-600">
              {isLogin ? 'Нет аккаунта?' : 'Уже есть аккаунт?'}
                <button
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setError('');
                    setIsLoading(false);
                    setEmail('');
                    setIdentifier('');
                    setPassword('');
                    setName('');
                    setPhone('');
                  setNeedsOtp(false);
                  setOtpCode('');
                }}
                className="ml-2 text-[#8B4513] font-medium hover:underline"
              >
                {isLogin ? 'Зарегистрироваться' : 'Войти'}
              </button>
            </p>
          </motion.div>

          {/* Demo Credentials Info */}
          {isLogin && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-6 p-4 bg-gray-50 rounded-lg"
            >
              <p className="text-[12px] text-gray-600 text-center">
                <strong>Демо-аккаунт:</strong><br />
                Email: demo@example.com<br />
                Пароль: demo123
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
