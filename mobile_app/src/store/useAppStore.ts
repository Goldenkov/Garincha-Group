import { create } from 'zustand';
import { mockApi } from '@/services/mockApi';
import {
  BonusHistoryItem,
  CartItem,
  OrderConfirmation,
  Partner,
  Product,
  UserProfile
} from '@/types';

interface CheckoutDetails {
  deliveryAddress: string;
  paymentMethod: string;
  comment?: string;
}

interface AppStore {
  user: UserProfile | null;
  partners: Partner[];
  products: Product[];
  bonusHistory: BonusHistoryItem[];
  cart: CartItem[];
  lastOrder?: OrderConfirmation;
  isBootstrapping: boolean;
  error?: string;
  actions: {
    bootstrap: () => Promise<void>;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    addToCart: (product: Product) => void;
    removeFromCart: (productId: string) => void;
    changeQuantity: (productId: string, quantity: number) => void;
    clearCart: () => void;
    checkout: (details: CheckoutDetails) => Promise<OrderConfirmation>;
    updateProfile: (partial: Partial<UserProfile>) => Promise<void>;
    refreshBonusHistory: () => Promise<void>;
  };
}

export const useAppStore = create<AppStore>((set, get) => ({
  user: null,
  partners: [],
  products: [],
  bonusHistory: [],
  cart: [],
  lastOrder: undefined,
  isBootstrapping: false,
  error: undefined,
  actions: {
    bootstrap: async () => {
      set({ isBootstrapping: true, error: undefined });
      try {
        const [partners, products, bonusHistory] = await Promise.all([
          mockApi.fetchPartners(),
          mockApi.fetchProducts(),
          mockApi.fetchBonusHistory()
        ]);
        set({ partners, products, bonusHistory, isBootstrapping: false });
      } catch (error) {
        set({ error: error instanceof Error ? error.message : 'Не удалось загрузить данные', isBootstrapping: false });
      }
    },
    login: async (email, password) => {
      set({ error: undefined });
      try {
        const user = await mockApi.login(email, password);
        set({ user });
      } catch (error) {
        set({ error: error instanceof Error ? error.message : 'Ошибка авторизации' });
        throw error;
      }
    },
    logout: () => {
      set({ user: null, cart: [], lastOrder: undefined });
    },
    addToCart: (product) => {
      const { cart } = get();
      const itemIndex = cart.findIndex((item) => item.product.id === product.id);
      if (itemIndex >= 0) {
        const updated = [...cart];
        updated[itemIndex] = { ...updated[itemIndex], quantity: updated[itemIndex].quantity + 1 };
        set({ cart: updated });
      } else {
        set({ cart: [...cart, { product, quantity: 1 }] });
      }
    },
    removeFromCart: (productId) => {
      const filtered = get().cart.filter((item) => item.product.id !== productId);
      set({ cart: filtered });
    },
    changeQuantity: (productId, quantity) => {
      if (quantity <= 0) {
        get().actions.removeFromCart(productId);
        return;
      }
      const updated = get().cart.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      );
      set({ cart: updated });
    },
    clearCart: () => set({ cart: [] }),
    checkout: async (details) => {
      const state = get();
      if (!state.user) {
        throw new Error('Необходимо войти в личный кабинет для оформления заказа.');
      }
      if (!state.cart.length) {
        throw new Error('Корзина пуста.');
      }
      const total = state.cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
      const orderConfirmation = await mockApi.submitOrder({
        items: state.cart,
        total,
        deliveryAddress: details.deliveryAddress,
        paymentMethod: details.paymentMethod,
        comment: details.comment
      });
      set({
        cart: [],
        lastOrder: orderConfirmation
      });
      await get().actions.refreshBonusHistory();
      return orderConfirmation;
    },
    updateProfile: async (partial) => {
      const updated = await mockApi.updateProfile(partial);
      set({ user: updated });
    },
    refreshBonusHistory: async () => {
      const bonusHistory = await mockApi.fetchBonusHistory();
      set({ bonusHistory });
    }
  }
}));

export const selectCartTotal = (cart: CartItem[]) =>
  cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

export const selectBonusEarned = (cart: CartItem[]) =>
  cart.reduce((sum, item) => sum + item.product.price * item.quantity * item.product.bonusMultiplier, 0);
