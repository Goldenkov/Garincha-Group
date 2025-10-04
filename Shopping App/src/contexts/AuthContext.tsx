import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string, phone?: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
  addToFavorites: (productId: number) => void;
  removeFromFavorites: (productId: number) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Загружаем данные пользователя из localStorage при инициализации
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Ошибка при загрузке данных пользователя:', error);
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  // Сохраняем данные пользователя в localStorage при изменении
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Имитация API запроса
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Простая проверка для демонстрации
      if (email === 'demo@example.com' && password === 'demo123') {
        const newUser: User = {
          id: '1',
          email: 'demo@example.com',
          name: 'Демо Пользователь',
          phone: '+7 (999) 123-45-67',
          bambicoins: 500,
          joinDate: '2024-01-15',
          totalOrders: 3,
          favoriteProducts: [1, 3, 5]
        };
        setUser(newUser);
        setIsLoading(false);
        return true;
      }
      
      // Проверяем существующих пользователей в localStorage
      const existingUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      const foundUser = existingUsers.find((u: any) => u.email === email && u.password === password);
      
      if (foundUser) {
        const { password: _, ...userData } = foundUser;
        setUser(userData);
        setIsLoading(false);
        return true;
      }
      
      setIsLoading(false);
      return false;
    } catch (error) {
      console.error('Ошибка при входе:', error);
      setIsLoading(false);
      return false;
    }
  };

  const register = async (email: string, password: string, name: string, phone?: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Имитация API запроса
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Проверяем, не существует ли уже пользователь с таким email
      const existingUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      const userExists = existingUsers.some((u: any) => u.email === email);
      
      if (userExists) {
        setIsLoading(false);
        return false;
      }
      
      const newUser = {
        id: Date.now().toString(),
        email,
        password, // В реальном приложении пароль должен быть зашифрован
        name,
        phone,
        bambicoins: 100, // Бонус за регистрацию
        joinDate: new Date().toISOString().split('T')[0],
        totalOrders: 0,
        favoriteProducts: []
      };
      
      // Сохраняем пользователя в localStorage
      const updatedUsers = [...existingUsers, newUser];
      localStorage.setItem('registeredUsers', JSON.stringify(updatedUsers));
      
      // Автоматически входим после регистрации
      const { password: _, ...userData } = newUser;
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
      setUser({ ...user, ...updates });
    }
  };

  const addToFavorites = (productId: number) => {
    if (user && !user.favoriteProducts.includes(productId)) {
      setUser({
        ...user,
        favoriteProducts: [...user.favoriteProducts, productId]
      });
    }
  };

  const removeFromFavorites = (productId: number) => {
    if (user) {
      setUser({
        ...user,
        favoriteProducts: user.favoriteProducts.filter(id => id !== productId)
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
    removeFromFavorites
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
