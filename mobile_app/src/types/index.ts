export interface Partner {
  id: string;
  name: string;
  description: string;
  website: string;
  category: string;
}

export interface Product {
  id: string;
  partnerId: string;
  title: string;
  description: string;
  price: number;
  image: string;
  tags: string[];
  bonusMultiplier: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface BonusHistoryItem {
  id: string;
  title: string;
  change: number;
  date: string;
  type: 'earned' | 'spent';
}

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  city: string;
  notifications: {
    marketing: boolean;
    updates: boolean;
    partners: boolean;
  };
  bonusBalance: number;
}

export interface OrderPayload {
  items: CartItem[];
  total: number;
  deliveryAddress: string;
  paymentMethod: string;
  comment?: string;
}

export interface OrderConfirmation {
  orderId: string;
  estimatedDelivery: string;
  bonusEarned: number;
}
