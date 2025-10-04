import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { verifyTotpToken } from '../utils/totp';

export type TwoFactorProvider = 'google' | 'yandex';

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  avatar?: string;
  bambicoins: number;
  joinDate: string;
  totalOrders: number;
  favoriteProducts: number[];
  twoFactorEnabled: boolean;
  twoFactorType?: TwoFactorProvider;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (identifier: string, password: string, otpCode?: string) => Promise<LoginResult>;
  register: (email: string, password: string, name: string, phone?: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
  addToFavorites: (productId: number) => void;
  removeFromFavorites: (productId: number) => void;
  enableTwoFactor: (options: { type: TwoFactorProvider; secret: string }) => void;
  disableTwoFactor: () => void;
}

interface StoredUser extends Omit<User, 'twoFactorEnabled' | 'twoFactorType'> {
  password: string;
  twoFactorEnabled?: boolean;
  twoFactorType?: TwoFactorProvider;
  twoFactorSecret?: string | null;
}

interface LoginResult {
  success: boolean;
  requiresOtp?: boolean;
  message?: string;
}

const DEMO_USER_ID = 'demo-user';

const normalizeEmail = (value?: string) => (value || '').trim().toLowerCase();
const normalizePhone = (value?: string) => (value || '').replace(/\D/g, '');

const getStorage = (): Storage | null => {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    return window.localStorage;
  } catch (error) {
    console.error('Локальное хранилище недоступно:', error);
    return null;
  }
};

const loadRegisteredUsers = (): StoredUser[] => {
  const storage = getStorage();

  if (!storage) {
    return [];
  }

  try {
    return JSON.parse(storage.getItem('registeredUsers') || '[]');
  } catch (error) {
    console.error('Ошибка при загрузке зарегистрированных пользователей:', error);
    return [];
  }
};

const saveRegisteredUsers = (users: StoredUser[]) => {
  const storage = getStorage();

  if (!storage) {
    return;
  }

  storage.setItem('registeredUsers', JSON.stringify(users));
};

const isDemoUser = (user: { id: string; email: string }) =>
  user.id === DEMO_USER_ID || user.email === 'demo@example.com';

const persistUserChanges = (userId: string, updates: Partial<StoredUser>) => {
  const storage = getStorage();

  if (!storage) {
    return;
  }

  const existingUsers = loadRegisteredUsers();
  const userIndex = existingUsers.findIndex((stored) => stored.id === userId);

  if (userIndex !== -1) {
    existingUsers[userIndex] = { ...existingUsers[userIndex], ...updates };
    saveRegisteredUsers(existingUsers);
  }
};

const storedToUser = (stored: StoredUser): User => ({
  id: stored.id,
  email: stored.email,
  name: stored.name,
  phone: stored.phone,
  avatar: stored.avatar,
  bambicoins: stored.bambicoins ?? 0,
  joinDate: stored.joinDate,
  totalOrders: stored.totalOrders ?? 0,
  favoriteProducts: Array.isArray(stored.favoriteProducts) ? stored.favoriteProducts : [],
  twoFactorEnabled: !!stored.twoFactorEnabled,
  twoFactorType: stored.twoFactorType,
});

const sanitizeUser = (data: any): User => ({
  id: data?.id || '',
  email: data?.email || '',
  name: data?.name || '',
  phone: data?.phone,
  avatar: data?.avatar,
  bambicoins: data?.bambicoins ?? 0,
  joinDate: data?.joinDate || new Date().toISOString().split('T')[0],
  totalOrders: data?.totalOrders ?? 0,
  favoriteProducts: Array.isArray(data?.favoriteProducts) ? data.favoriteProducts : [],
  twoFactorEnabled: !!data?.twoFactorEnabled,
  twoFactorType: data?.twoFactorType,
});

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Загружаем данные пользователя из localStorage при инициализации
  useEffect(() => {
    const storage = getStorage();
    if (!storage) {
      setIsLoading(false);
      return;
    }

    const savedUser = storage.getItem('user');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        setUser(sanitizeUser(parsed));
      } catch (error) {
        console.error('Ошибка при загрузке данных пользователя:', error);
        storage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  // Сохраняем данные пользователя в localStorage при изменении
  useEffect(() => {
    const storage = getStorage();

    if (!storage) {
      return;
    }

    if (user) {
      storage.setItem('user', JSON.stringify(user));
    } else {
      storage.removeItem('user');
    }
  }, [user]);

  const login = async (
    identifier: string,
    password: string,
    otpCode?: string
  ): Promise<LoginResult> => {
    setIsLoading(true);

    try {
      // Имитация API запроса
      await new Promise(resolve => setTimeout(resolve, 1000));

      const trimmedIdentifier = identifier.trim();
      const emailCandidate = trimmedIdentifier.includes('@') ? normalizeEmail(trimmedIdentifier) : '';
      const phoneCandidate = normalizePhone(trimmedIdentifier);

      // Проверка демо-аккаунта
      const demoEmail = 'demo@example.com';
      const demoPhone = normalizePhone('+7 (999) 123-45-67');
      const matchesDemoEmail = emailCandidate === demoEmail;
      const matchesDemoPhone = phoneCandidate && phoneCandidate === demoPhone;

      if ((matchesDemoEmail || matchesDemoPhone) && password === 'demo123') {
        let demoTwoFactorSettings: { enabled: boolean; type?: TwoFactorProvider; secret?: string } | null = null;

        const storage = getStorage();

        try {
          demoTwoFactorSettings = JSON.parse(storage?.getItem('demoTwoFactorSettings') || 'null');
        } catch (error) {
          console.error('Ошибка при чтении настроек 2FA демо-пользователя:', error);
        }

        if (demoTwoFactorSettings?.enabled && demoTwoFactorSettings.secret) {
          if (!otpCode) {
            setIsLoading(false);
            return {
              success: false,
              requiresOtp: true,
              message: 'Введите одноразовый код из приложения-аутентификатора.'
            };
          }

          const isValidOtp = await verifyTotpToken(otpCode, demoTwoFactorSettings.secret);

          if (!isValidOtp) {
            setIsLoading(false);
            return {
              success: false,
              requiresOtp: true,
              message: 'Неверный одноразовый код'
            };
          }
        }

        let demoProfileOverrides: Partial<User> | null = null;

        const storage = getStorage();

        try {
          demoProfileOverrides = JSON.parse(storage?.getItem('demoUserProfile') || 'null');
        } catch (error) {
          console.error('Ошибка при чтении профиля демо-пользователя:', error);
        }

        const baseDemoUser = {
          id: DEMO_USER_ID,
          email: demoEmail,
          name: 'Демо Пользователь',
          phone: '+7 (999) 123-45-67',
          bambicoins: 500,
          joinDate: '2024-01-15',
          totalOrders: 3,
          favoriteProducts: [1, 3, 5],
        };

        const newUser = {
          ...sanitizeUser({ ...baseDemoUser, ...demoProfileOverrides }),
          twoFactorEnabled: !!demoTwoFactorSettings?.enabled,
          twoFactorType: demoTwoFactorSettings?.type,
        };

        setUser(newUser);
        setIsLoading(false);
        return { success: true };
      }

      // Проверяем существующих пользователей в localStorage
      const existingUsers = loadRegisteredUsers();
      const foundUser = existingUsers.find((storedUser) => {
        const matchesEmail = emailCandidate && normalizeEmail(storedUser.email) === emailCandidate;
        const matchesPhone = phoneCandidate && normalizePhone(storedUser.phone) === phoneCandidate;

        return (matchesEmail || matchesPhone) && storedUser.password === password;
      });

      if (foundUser) {
        if (foundUser.twoFactorEnabled && foundUser.twoFactorSecret) {
          if (!otpCode) {
            setIsLoading(false);
            return {
              success: false,
              requiresOtp: true,
              message: 'Введите одноразовый код из приложения-аутентификатора.'
            };
          }

          const isValidOtp = await verifyTotpToken(otpCode, foundUser.twoFactorSecret);

          if (!isValidOtp) {
            setIsLoading(false);
            return {
              success: false,
              requiresOtp: true,
              message: 'Неверный одноразовый код'
            };
          }
        }

        const userData = storedToUser(foundUser);
        setUser(userData);
        setIsLoading(false);
        return { success: true };
      }

      setIsLoading(false);
      return {
        success: false,
        message: 'Неверный email/телефон или пароль'
      };
    } catch (error) {
      console.error('Ошибка при входе:', error);
      setIsLoading(false);
      return {
        success: false,
        message: 'Не удалось выполнить вход. Попробуйте еще раз.'
      };
    }
  };

  const register = async (email: string, password: string, name: string, phone?: string): Promise<boolean> => {
    setIsLoading(true);

    try {
      // Имитация API запроса
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Проверяем, не существует ли уже пользователь с таким email
      const existingUsers = loadRegisteredUsers();
      const normalizedEmail = normalizeEmail(email);
      const trimmedPhone = phone?.trim();
      const normalizedPhone = trimmedPhone ? normalizePhone(trimmedPhone) : '';
      const userExists = existingUsers.some((stored) => {
        const sameEmail = normalizeEmail(stored.email) === normalizedEmail;
        const samePhone = normalizedPhone && normalizePhone(stored.phone) === normalizedPhone;
        return sameEmail || samePhone;
      });

      if (userExists) {
        setIsLoading(false);
        return false;
      }

      const newUser: StoredUser = {
        id: Date.now().toString(),
        email: email.trim(),
        password, // В реальном приложении пароль должен быть зашифрован
        name: name.trim(),
        phone: trimmedPhone || undefined,
        bambicoins: 100, // Бонус за регистрацию
        joinDate: new Date().toISOString().split('T')[0],
        totalOrders: 0,
        favoriteProducts: [],
        twoFactorEnabled: false,
        twoFactorType: undefined,
        twoFactorSecret: null
      };

      // Сохраняем пользователя в localStorage
      const updatedUsers = [...existingUsers, newUser];
      saveRegisteredUsers(updatedUsers);

      // Автоматически входим после регистрации
      const userData = storedToUser(newUser);
      setUser(userData);
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error('Ошибка при регистрации:', error);
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
  };

  const updateProfile = (updates: Partial<User>) => {
    if (user) {
      const normalizedUpdates: Partial<User> = {
        ...updates,
        email: updates.email?.trim(),
        name: updates.name?.trim(),
        phone: updates.phone?.trim(),
      };

      const updatedUser = sanitizeUser({ ...user, ...normalizedUpdates });
      setUser(updatedUser);

      if (isDemoUser(user)) {
        const storage = getStorage();
        storage?.setItem('demoUserProfile', JSON.stringify(updatedUser));
      } else {
        const storedUpdates: Partial<StoredUser> = {
          email: normalizedUpdates.email ?? user.email,
          name: normalizedUpdates.name ?? user.name,
          phone: normalizedUpdates.phone ?? user.phone,
          bambicoins: normalizedUpdates.bambicoins ?? user.bambicoins,
          totalOrders: normalizedUpdates.totalOrders ?? user.totalOrders,
          favoriteProducts: normalizedUpdates.favoriteProducts ?? user.favoriteProducts,
        };

        persistUserChanges(user.id, storedUpdates);
      }
    }
  };

  const addToFavorites = (productId: number) => {
    if (user && !user.favoriteProducts.includes(productId)) {
      const updatedFavorites = [...user.favoriteProducts, productId];
      const updatedUser = { ...user, favoriteProducts: updatedFavorites };
      setUser(updatedUser);

      if (!isDemoUser(user)) {
        persistUserChanges(user.id, { favoriteProducts: updatedFavorites });
      }
    }
  };

  const removeFromFavorites = (productId: number) => {
    if (user) {
      const updatedFavorites = user.favoriteProducts.filter(id => id !== productId);
      const updatedUser = { ...user, favoriteProducts: updatedFavorites };
      setUser(updatedUser);

      if (!isDemoUser(user)) {
        persistUserChanges(user.id, { favoriteProducts: updatedFavorites });
      }
    }
  };

  const enableTwoFactor = ({ type, secret }: { type: TwoFactorProvider; secret: string }) => {
    if (!user) {
      return;
    }

    const updatedUser = { ...user, twoFactorEnabled: true, twoFactorType: type };
    setUser(updatedUser);

    if (isDemoUser(user)) {
      const storage = getStorage();
      storage?.setItem(
        'demoTwoFactorSettings',
        JSON.stringify({ enabled: true, type, secret })
      );
      storage?.setItem('user', JSON.stringify(updatedUser));
    } else {
      persistUserChanges(user.id, {
        twoFactorEnabled: true,
        twoFactorType: type,
        twoFactorSecret: secret,
      });
    }
  };

  const disableTwoFactor = () => {
    if (!user) {
      return;
    }

    const updatedUser = { ...user, twoFactorEnabled: false, twoFactorType: undefined };
    setUser(updatedUser);

    if (isDemoUser(user)) {
      const storage = getStorage();
      storage?.setItem('demoTwoFactorSettings', JSON.stringify({ enabled: false }));
      storage?.setItem('user', JSON.stringify(updatedUser));
    } else {
      persistUserChanges(user.id, {
        twoFactorEnabled: false,
        twoFactorType: undefined,
        twoFactorSecret: null,
      });
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    updateProfile,
    addToFavorites,
    removeFromFavorites,
    enableTwoFactor,
    disableTwoFactor,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth должен использоваться внутри AuthProvider');
  }
  return context;
}
