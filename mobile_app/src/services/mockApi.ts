import { BonusHistoryItem, OrderConfirmation, OrderPayload, Partner, Product, UserProfile } from '@/types';

const partners: Partner[] = [
  {
    id: 'partner-1',
    name: 'Garincha Travel',
    description: 'Премиальные путешествия и персональные консьерж-сервисы по всему миру.',
    website: 'https://travel.garincha.group',
    category: 'Путешествия'
  },
  {
    id: 'partner-2',
    name: 'Garincha Health',
    description: 'Медицинские и оздоровительные программы для членов клуба.',
    website: 'https://health.garincha.group',
    category: 'Здоровье'
  },
  {
    id: 'partner-3',
    name: 'Garincha Lifestyle',
    description: 'Персонализированные решения для образа жизни, fashion и event-направлений.',
    website: 'https://lifestyle.garincha.group',
    category: 'Lifestyle'
  }
];

const products: Product[] = [
  {
    id: 'product-1',
    partnerId: 'partner-1',
    title: 'Авторский тур «Анды и океан»',
    description: '10-дневное путешествие с личным гидом, vip-трансферы и проживание в бутик-отелях.',
    price: 4490,
    image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee',
    tags: ['путешествия', 'luxury', 'эндорфины'],
    bonusMultiplier: 1.5
  },
  {
    id: 'product-2',
    partnerId: 'partner-2',
    title: 'Детокс-программа «Новая энергия»',
    description: '7 дней в частном велнес-центре, индивидуальные консультации и супервизия врача.',
    price: 1890,
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773',
    tags: ['здоровье', 'wellness'],
    bonusMultiplier: 2
  },
  {
    id: 'product-3',
    partnerId: 'partner-3',
    title: 'Fashion-консьерж на сезон',
    description: 'Личный стилист, доступ в закрытые шоурумы и подбор капсульного гардероба.',
    price: 990,
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518',
    tags: ['lifestyle', 'fashion'],
    bonusMultiplier: 1.2
  }
];

const bonusHistory: BonusHistoryItem[] = [
  {
    id: 'bonus-1',
    title: 'Покупка тура Garincha Travel',
    change: 4500,
    date: '2024-03-18',
    type: 'earned'
  },
  {
    id: 'bonus-2',
    title: 'Участие в закрытом мероприятии',
    change: -1200,
    date: '2024-02-09',
    type: 'spent'
  },
  {
    id: 'bonus-3',
    title: 'Пополнение баланса партнёром Garincha Health',
    change: 800,
    date: '2024-01-30',
    type: 'earned'
  }
];

let profile: UserProfile = {
  id: 'user-1',
  fullName: 'Александр Петров',
  email: 'alexander.petrov@example.com',
  phone: '+7 (900) 123-45-67',
  city: 'Москва',
  notifications: {
    marketing: true,
    updates: true,
    partners: false
  },
  bonusBalance: 18750
};

const wait = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms));

export const mockApi = {
  async login(email: string, _password: string): Promise<UserProfile> {
    await wait();
    if (!email.endsWith('@example.com')) {
      throw new Error('Пользователь не найден в клубе Garincha Group.');
    }
    return profile;
  },

  async fetchPartners(): Promise<Partner[]> {
    await wait();
    return partners;
  },

  async fetchProducts(): Promise<Product[]> {
    await wait();
    return products;
  },

  async fetchBonusHistory(): Promise<BonusHistoryItem[]> {
    await wait();
    return bonusHistory;
  },

  async updateProfile(partial: Partial<UserProfile>): Promise<UserProfile> {
    await wait();
    const notifications = partial.notifications
      ? { ...profile.notifications, ...partial.notifications }
      : profile.notifications;
    profile = { ...profile, ...partial, notifications };
    return profile;
  },

  async submitOrder(payload: OrderPayload): Promise<OrderConfirmation> {
    await wait(800);
    const bonusEarned = Math.round(payload.total * 0.1);
    profile = { ...profile, bonusBalance: profile.bonusBalance + bonusEarned };
    return {
      orderId: `GG-${Date.now()}`,
      estimatedDelivery: '3-5 рабочих дней',
      bonusEarned
    };
  }
};
