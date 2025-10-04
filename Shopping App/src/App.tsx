import React, { useState, useMemo } from "react";
import { ImageWithFallback } from "./components/figma/ImageWithFallback";
import { useAuth } from "./contexts/AuthContext";

// Import all page components
import ProductListPage from "./components/ProductListPage";
import ProductDetailPage from "./components/ProductDetailPage";
import BasketPage from "./components/BasketPage";
import CheckoutPage from "./components/CheckoutPage";
import PaymentPage from "./components/PaymentPage";
import ConfirmationPage from "./components/ConfirmationPage";
import OrderConfirmationPage from "./components/OrderConfirmationPage";
import PlaceholderPage from "./components/PlaceholderPage";
import AddToCartOverlay from "./components/AddToCartOverlay";
import Menu from "./components/Menu";
import LoginPage from "./components/LoginPage";
import ProfilePage from "./components/ProfilePage";

// Room types for categorization
export const ROOM_TYPES = {
  BATHROOM: "bathroom", // Ванная комната
  HALLWAY: "hallway", // Коридор
  KITCHEN: "kitchen", // Кухня
  LIVING_ROOM: "living_room", // Гостиная
  BEDROOM: "bedroom", // Спальня
  CHILDREN_ROOM: "children_room", // Детская комната
} as const;

// Product categories
export const CATEGORIES = {
  MIRRORS_WITH_LIGHTING: "mirrors_with_lighting", // Зеркала с подсветкой
  MIRRORS_WITHOUT_LIGHTING: "mirrors_without_lighting", // Зеркала без подсветки
  CHAIRS: "chairs", // Стулья
  TABLES: "tables", // Столы из торцевых спилов
  BEDSIDE_TABLES: "bedside_tables", // Прикроватные тумбы
  LIGHTING: "lighting", // Освещение
  MATTRESSES: "mattresses", // Матрасы
  BEDS: "beds", // Кровати
  FINISHING_MATERIALS: "finishing_materials", // Отделочные материалы
  SOFAS: "sofas", // Диваны
  CHILDREN_FURNITURE: "children_furniture", // Детская мебель
  CHILDREN_LIGHTING: "children_lighting", // Детские светильники и ночники
  CHILDREN_TOYS: "children_toys", // Детские игрушки
  CHILDREN_STATIONERY: "children_stationery", // Детские канцтовары
} as const;

// Enhanced product data with furniture and home decor items
const PRODUCTS = [
  {
    id: 1,
    name: "Зеркало с LED подсветкой",
    nameEn: "LED Bathroom Mirror",
    price: "₽25,990",
    priceValue: 25990,
    manufacturer: "LuxHome Studio",
    images: [
      "https://images.unsplash.com/photo-1584092352562-6d24e5635f35?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBiZWRyb29tJTIwbWlycm9yJTIwbGlnaHRpbmd8ZW58MXx8fHwxNzU4MzYxNzI3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    ],
    isFavorite: false,
    description: "Современное зеркало с встроенной LED подсветкой. Сенсорное управление, регулировка яркости. Идеально для ванной комнаты.",
    location: "Произведено в России, LuxHome Studio",
    category: CATEGORIES.MIRRORS_WITH_LIGHTING,
    roomType: ROOM_TYPES.BATHROOM,
    bambicoins: 260, // 1% от стоимости
    specifications: ["Размер: 80x60 см", "LED подсветка", "Сенсорное управление", "IP44"],
  },
  {
    id: 2,
    name: "Деревянный стул",
    nameEn: "Wooden Dining Chair",
    price: "₽8,500",
    priceValue: 8500,
    manufacturer: "Скандинавия Мебель",
    images: [
      "https://images.unsplash.com/photo-1702018706865-e5306a8fa007?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b29kZW4lMjBkaW5pbmclMjBjaGFpcnxlbnwxfHx8fDE3NTgyOTA3NzN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    ],
    isFavorite: false,
    description: "Эргономичный деревянный стул из массива дуба. Классический дизайн, удобная спинка. Подходит для кухни и столовой.",
    location: "Изготовлено в Калининграде, Скандинавия Мебель",
    category: CATEGORIES.CHAIRS,
    roomType: ROOM_TYPES.KITCHEN,
    bambicoins: 85,
    specifications: ["Материал: массив дуба", "Высота: 82 см", "Грузоподъемность: 120 кг"],
  },
  {
    id: 3,
    name: "Стол из торцевого спила",
    nameEn: "End Grain Wood Table",
    price: "₽45,000",
    priceValue: 45000,
    manufacturer: "Русская Столярка",
    images: [
      "https://images.unsplash.com/photo-1635826082437-1123d04d221e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b29kJTIwc2xhYiUyMGRpbmluZyUyMHRhYmxlfGVufDF8fHx8MTc1ODM2MTcyOHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    ],
    isFavorite: false,
    description: "Уникальный обеденный стол из торцевого спила карельской березы. Каждая текстура неповторима. Покрыт экологичным лаком.",
    location: "Ручная работа, Карелия, Русская Столярка",
    category: CATEGORIES.TABLES,
    roomType: ROOM_TYPES.KITCHEN,
    bambicoins: 450,
    specifications: ["Размер: 180x90 см", "Карельская береза", "Ручная работа", "Экологичный лак"],
  },
  {
    id: 4,
    name: "Прикроватная тумба",
    nameEn: "Bedside Nightstand",
    price: "₽12,900",
    priceValue: 12900,
    manufacturer: "Мебель Плюс",
    images: [
      "https://images.unsplash.com/photo-1589335429144-328a42be176e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxiZWRzaWRlJTIwbmlnaHRzdGFuZHxlbnwxfHx8fDE3NTgzNjE3Mjh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    ],
    isFavorite: false,
    description: "Современная прикроватная тумба с выдвижным ящиком и открытой полкой. Минималистичный дизайн в скандинавском стиле.",
    location: "Произведено в Санкт-Петербурге, Мебель Плюс",
    category: CATEGORIES.BEDSIDE_TABLES,
    roomType: ROOM_TYPES.BEDROOM,
    bambicoins: 129,
    specifications: ["Размер: 50x40x55 см", "ЛДСП с покрытием", "1 ящик, 1 полка"],
  },
  {
    id: 5,
    name: "Потолочный светильник",
    nameEn: "Pendant Ceiling Light",
    price: "₽7,200",
    priceValue: 7200,
    manufacturer: "Светодизайн",
    images: [
      "https://images.unsplash.com/photo-1714425341725-b7d9825f6e83?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZW5kYW50JTIwY2VpbGluZyUyMGxpZ2h0fGVufDF8fHx8MTc1ODM2MTcyOHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    ],
    isFavorite: false,
    description: "Стильный потолочный светильник в стиле лофт. Металлический абажур создает направленный свет. LED лампа в комплекте.",
    location: "Произведено в Москве, Светодизайн",
    category: CATEGORIES.LIGHTING,
    roomType: ROOM_TYPES.LIVING_ROOM,
    bambicoins: 72,
    specifications: ["Материал: металл", "LED лампа 12W", "Диммируемый", "E27"],
  },
  {
    id: 6,
    name: "Ортопедический матрас",
    nameEn: "Orthopedic Mattress",
    price: "₽28,500",
    priceValue: 28500,
    manufacturer: "СонКомфорт",
    images: [
      "https://images.unsplash.com/photo-1655728664483-1e3b0778e1a5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21mb3J0YWJsZSUyMG1hdHRyZXNzfGVufDF8fHx8MTc1ODM2MTcyOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    ],
    isFavorite: false,
    description: "Premium ортопедический матрас с независимыми пружинами. Анатомическая поддержка позвоночника. Гипоаллергенные материалы.",
    location: "Произведено в России, СонКомфорт",
    category: CATEGORIES.MATTRESSES,
    roomType: ROOM_TYPES.BEDROOM,
    bambicoins: 285,
    specifications: ["Размер: 160x200 см", "Независимые пружины", "Гипоаллергенный", "Средняя жесткость"],
  },
  {
    id: 7,
    name: "Кровать с подъемным механизмом",
    nameEn: "Storage Bed Frame",
    price: "₽35,900",
    priceValue: 35900,
    manufacturer: "Домашний Уют",
    images: [
      "https://images.unsplash.com/photo-1690957530220-98bacb3c1163?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBiZWQlMjBmcmFtZXxlbnwxfHx8fDE3NTgzNjE3Mjl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    ],
    isFavorite: false,
    description: "Современная кровать с газовым подъемным механизмом и встроенным ящиком для белья. Удобное изголовье с мягкой обивкой.",
    location: "Изготовлено в Нижнем Новгороде, Домашний Уют",
    category: CATEGORIES.BEDS,
    roomType: ROOM_TYPES.BEDROOM,
    bambicoins: 359,
    specifications: ["Размер: 160x200 см", "Газовый подъемник", "Встроенный ящик", "Мягкое изголовье"],
  },
  {
    id: 8,
    name: "Угловой диван",
    nameEn: "Sectional Sofa",
    price: "₽52,000",
    priceValue: 52000,
    manufacturer: "СофаЛюкс",
    images: [
      "https://images.unsplash.com/photo-1698936061086-2bf99c7b9fc5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxncmF5JTIwc2VjdGlvbmFsJTIwc29mYXxlbnwxfHx8fDE3NTgzNDc3Mjd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    ],
    isFavorite: false,
    description: "Большой угловой диван с функцией раскладывания. Высококачественная ткань, ортопедическая основа. Идеален для больших гостиных.",
    location: "Произведено в Воронеже, СофаЛюкс",
    category: CATEGORIES.SOFAS,
    roomType: ROOM_TYPES.LIVING_ROOM,
    bambicoins: 520,
    specifications: ["Размер: 280x180 см", "Раскладной", "Ортопедическая основа", "Съемные чехлы"],
  },
  {
    id: 9,
    name: "Детский домик для кукол",
    nameEn: "Children's Dollhouse",
    price: "₽15,600",
    priceValue: 15600,
    manufacturer: "Детский Мир+",
    images: [
      "https://images.unsplash.com/photo-1714893044433-17fa46be8029?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlsZHJlbiUyMHdvb2RlbiUyMHRveSUyMGhvdXNlfGVufDF8fHx8MTc1ODM2MTczMHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    ],
    isFavorite: false,
    description: "Многоэтажный деревянный домик для кукол с мебелью. Развивает воображение и мелкую моторику. Экологически чистые материалы.",
    location: "Произведено в России, Детский Мир+",
    category: CATEGORIES.CHILDREN_FURNITURE,
    roomType: ROOM_TYPES.CHILDREN_ROOM,
    bambicoins: 156,
    specifications: ["Размер: 60x40x80 см", "Натуральное дерево", "Включает мебель", "Возраст: 3+"],
  },
  {
    id: 10,
    name: "Детский настольный светильник",
    nameEn: "Kids Desk Lamp",
    price: "₽4,200",
    priceValue: 4200,
    manufacturer: "БэбиСвет",
    images: [
      "https://images.unsplash.com/photo-1727859688237-b77db0146293?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxraWRzJTIwZGVzayUyMGxhbXB8ZW58MXx8fHwxNzU4MzYxNzMwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    ],
    isFavorite: false,
    description: "Яркий детский светильник с регулируемой высотой. Безопасный LED свет, не нагревается. Веселый дизайн понравится детям.",
    location: "Произведено в Казани, БэбиСвет",
    category: CATEGORIES.CHILDREN_LIGHTING,
    roomType: ROOM_TYPES.CHILDREN_ROOM,
    bambicoins: 42,
    specifications: ["LED лампа 8W", "Регулируемая высота", "Сенсорное управление", "Безопасный пластик"],
  },
  {
    id: 11,
    name: "Зеркало классическое",
    nameEn: "Classic Bathroom Mirror",
    price: "₽8,900",
    priceValue: 8900,
    manufacturer: "Стекло Мастер",
    images: [
      "https://images.unsplash.com/photo-1690603935467-630341102dd5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYXRocm9vbSUyMHZhbml0eSUyMG1pcnJvcnxlbnwxfHx8fDE3NTgzNjE3MzB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    ],
    isFavorite: false,
    description: "Классическое зеркало без подсветки в элегантной раме. Высококачественное стекло без искажений. Подходит для ванной комнаты.",
    location: "Произведено в Санкт-Петербурге, Стекло Мастер",
    category: CATEGORIES.MIRRORS_WITHOUT_LIGHTING,
    roomType: ROOM_TYPES.BATHROOM,
    bambicoins: 89,
    specifications: ["Размер: 70x50 см", "Влагостойкая рама", "Качественное стекло", "Крепления в комплекте"],
  },
  {
    id: 12,
    name: "Торшер для гостиной",
    nameEn: "Living Room Floor Lamp",
    price: "₽11,800",
    priceValue: 11800,
    manufacturer: "Свет & Стиль",
    images: [
      "https://images.unsplash.com/photo-1743578666060-49a1747d61df?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmbG9vciUyMGxhbXAlMjBsaXZpbmclMjByb29tfGVufDF8fHx8MTc1ODM2MTczMXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    ],
    isFavorite: false,
    description: "Элегантный торшер с регулируемой головкой. Создает мягкое освещение для чтения. Устойчивое основание, современный дизайн.",
    location: "Произведено в Москве, Свет & Стиль",
    category: CATEGORIES.LIGHTING,
    roomType: ROOM_TYPES.LIVING_ROOM,
    bambicoins: 118,
    specifications: ["Высота: 150 см", "Регулируемая головка", "Утяжеленное основание", "E27 лампа"],
  }
];

type SortOption = "default" | "a-z" | "price";
type ViewMode =
  | "list"
  | "detail"
  | "basket"
  | "checkout"
  | "payment"
  | "confirmation"
  | "orderConfirmation"
  | "newsstand"
  | "about"
  | "profile"
  | "login"
  | "categories"
  | "bambicoins";

interface CartItem {
  id: number;
  name: string;
  price: string;
  priceValue: number;
  image: string;
  quantity: number;
  bambicoins?: number;
}

interface OverlayProduct {
  id: number;
  name: string;
  image: string;
}

interface CustomerInfo {
  fullName: string;
  address: string;
  city: string;
  country: string;
  state: string;
  zipCode: string;
}

export default function App() {
  const { user, isAuthenticated } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [favorites, setFavorites] = useState<Set<number>>(
    new Set(),
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] =
    useState<SortOption>("default");
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [selectedProduct, setSelectedProduct] = useState<
    (typeof PRODUCTS)[0] | null
  >(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [totalBambicoins, setTotalBambicoins] = useState(500); // Starting bambicoins

  // Customer information from checkout
  const [customerInfo, setCustomerInfo] =
    useState<CustomerInfo>({
      fullName: "",
      address: "",
      city: "",
      country: "",
      state: "",
      zipCode: "",
    });

  // Add to cart overlay state
  const [showOverlay, setShowOverlay] = useState(false);
  const [overlayProduct, setOverlayProduct] =
    useState<OverlayProduct | null>(null);
  const [overlayQuantity, setOverlayQuantity] = useState(1);

  const cartCount = cartItems.reduce(
    (sum, item) => sum + item.quantity,
    0,
  );

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = PRODUCTS.filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) || 
        product.nameEn
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      
      const matchesCategory = !selectedCategory || product.category === selectedCategory;
      const matchesRoom = !selectedRoom || product.roomType === selectedRoom;
      
      return matchesSearch && matchesCategory && matchesRoom;
    });

    switch (sortOption) {
      case "a-z":
        return filtered.sort((a, b) =>
          a.name.localeCompare(b.name),
        );
      case "price":
        return filtered.sort(
          (a, b) => a.priceValue - b.priceValue,
        );
      default:
        return filtered;
    }
  }, [searchTerm, sortOption, selectedCategory, selectedRoom]);

  const toggleFavorite = (productId: number) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(productId)) {
      newFavorites.delete(productId);
    } else {
      newFavorites.add(productId);
    }
    setFavorites(newFavorites);
  };

  const showAddToCartOverlay = (
    product: (typeof PRODUCTS)[0],
    quantity = 1,
  ) => {
    setOverlayProduct({
      id: product.id,
      name: product.name,
      image: product.images[0],
    });
    setOverlayQuantity(quantity);
    setShowOverlay(true);

    // Hide overlay after 1 second
    setTimeout(() => {
      setShowOverlay(false);
    }, 1000);
  };

  const addToCart = (productId?: number, quantityToAdd = 1) => {
    let targetProduct;

    if (productId) {
      targetProduct = PRODUCTS.find((p) => p.id === productId);
    } else if (selectedProduct) {
      targetProduct = selectedProduct;
    }

    if (!targetProduct) return;

    // Show overlay
    showAddToCartOverlay(targetProduct, quantityToAdd);

    // Add bambicoins to total
    const earnedBambicoins = (targetProduct.bambicoins || 0) * quantityToAdd;
    setTotalBambicoins(prev => prev + earnedBambicoins);

    setCartItems((prevItems) => {
      const existingItem = prevItems.find(
        (item) => item.id === targetProduct.id,
      );

      if (existingItem) {
        return prevItems.map((item) =>
          item.id === targetProduct.id
            ? {
                ...item,
                quantity: item.quantity + quantityToAdd,
              }
            : item,
        );
      } else {
        return [
          ...prevItems,
          {
            id: targetProduct.id,
            name: targetProduct.name,
            price: targetProduct.price,
            priceValue: targetProduct.priceValue,
            image: targetProduct.images[0],
            quantity: quantityToAdd,
            bambicoins: targetProduct.bambicoins,
          },
        ];
      }
    });
  };

  const updateCartItemQuantity = (
    productId: number,
    quantity: number,
  ) => {
    const product = PRODUCTS.find(p => p.id === productId);
    const currentItem = cartItems.find(item => item.id === productId);
    
    if (currentItem && product) {
      const quantityDiff = quantity - currentItem.quantity;
      const bambicoinsDiff = (product.bambicoins || 0) * quantityDiff;
      setTotalBambicoins(prev => prev + bambicoinsDiff);
    }

    if (quantity === 0) {
      setCartItems((prevItems) =>
        prevItems.filter((item) => item.id !== productId),
      );
    } else {
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.id === productId ? { ...item, quantity } : item,
        ),
      );
    }
  };

  // Category and room filter handlers
  const handleCategoryFilter = (category: string) => {
    setSelectedCategory(category === selectedCategory ? null : category);
  };

  const handleRoomFilter = (room: string) => {
    setSelectedRoom(room === selectedRoom ? null : room);
  };

  const clearFilters = () => {
    setSelectedCategory(null);
    setSelectedRoom(null);
    setSearchTerm("");
  };

  // Navigation handlers
  const handleProductClick = (
    product: (typeof PRODUCTS)[0],
  ) => {
    setSelectedProduct(product);
    setViewMode("detail");
  };

  const handleBackToList = () => {
    setViewMode("list");
    setSelectedProduct(null);
  };

  const handleCartClick = () => {
    setViewMode("basket");
  };

  const handleBackFromBasket = () => {
    setViewMode("list");
  };

  const handleGoToCheckout = () => {
    setViewMode("checkout");
  };

  const handleBackFromCheckout = () => {
    setViewMode("basket");
  };

  const handleProceedToPayment = (
    customerData: CustomerInfo,
  ) => {
    setCustomerInfo(customerData);
    setViewMode("payment");
  };

  const handleBackFromPayment = () => {
    setViewMode("checkout");
  };

  const handleProceedToConfirmation = () => {
    setViewMode("confirmation");
  };

  const handleBackFromConfirmation = () => {
    setViewMode("payment");
  };

  const handleCompletePurchase = () => {
    // Show order confirmation and clear cart
    setViewMode("orderConfirmation");
    setCartItems([]);
  };

  const handleShopFromOrderConfirmation = () => {
    setViewMode("list");
    setSelectedProduct(null);
    // Reset customer info for new order
    setCustomerInfo({
      fullName: "",
      address: "",
      city: "",
      country: "",
      state: "",
      zipCode: "",
    });
  };

  const handleMenuNavigation = (screen: string) => {
    if (screen === "profile") {
      if (isAuthenticated) {
        setViewMode("profile");
      } else {
        setViewMode("login");
      }
    } else {
      setViewMode(screen as ViewMode);
    }
    setSelectedProduct(null);
  };

  const handleLoginSuccess = () => {
    setViewMode("profile");
  };

  const handleBackFromLogin = () => {
    setViewMode("list");
  };

  const handleBackFromProfile = () => {
    setViewMode("list");
  };

  const handleLoginClick = () => {
    setViewMode("login");
  };

  // Render current view based on viewMode
  const renderCurrentView = () => {
    switch (viewMode) {
      case "list":
        return (
          <ProductListPage
            products={filteredAndSortedProducts}
            favorites={favorites}
            searchTerm={searchTerm}
            sortOption={sortOption}
            cartCount={cartCount}
            totalBambicoins={totalBambicoins}
            selectedCategory={selectedCategory}
            selectedRoom={selectedRoom}
            onSearchChange={setSearchTerm}
            onSortChange={setSortOption}
            onToggleFavorite={toggleFavorite}
            onAddToCart={(productId) => addToCart(productId, 1)}
            onProductClick={handleProductClick}
            onMenuClick={() => setIsNavOpen(true)}
            onCartClick={handleCartClick}
            onCategoryFilter={handleCategoryFilter}
            onRoomFilter={handleRoomFilter}
            onClearFilters={clearFilters}
          />
        );

      case "detail":
        return selectedProduct ? (
          <ProductDetailPage
            product={selectedProduct}
            cartCount={cartCount}
            totalBambicoins={totalBambicoins}
            onBack={handleBackToList}
            onAddToCart={(quantity) =>
              addToCart(undefined, quantity)
            }
            onMenuClick={() => setIsNavOpen(true)}
            onCartClick={handleCartClick}
          />
        ) : null;

      case "basket":
        return (
          <BasketPage
            cartItems={cartItems}
            totalBambicoins={totalBambicoins}
            onBack={handleBackFromBasket}
            onMenuClick={() => setIsNavOpen(true)}
            onUpdateQuantity={updateCartItemQuantity}
            onGoToCheckout={handleGoToCheckout}
          />
        );

      case "checkout":
        return (
          <CheckoutPage
            cartCount={cartCount}
            customerInfo={customerInfo}
            totalBambicoins={totalBambicoins}
            onBack={handleBackFromCheckout}
            onMenuClick={() => setIsNavOpen(true)}
            onProceedToPayment={handleProceedToPayment}
          />
        );

      case "payment":
        return (
          <PaymentPage
            cartCount={cartCount}
            totalBambicoins={totalBambicoins}
            onBack={handleBackFromPayment}
            onMenuClick={() => setIsNavOpen(true)}
            onProceedToConfirmation={
              handleProceedToConfirmation
            }
          />
        );

      case "confirmation":
        return (
          <ConfirmationPage
            cartItems={cartItems}
            cartCount={cartCount}
            totalBambicoins={totalBambicoins}
            onBack={handleBackFromConfirmation}
            onMenuClick={() => setIsNavOpen(true)}
            onUpdateQuantity={updateCartItemQuantity}
            onCompletePurchase={handleCompletePurchase}
          />
        );

      case "orderConfirmation":
        return (
          <OrderConfirmationPage
            cartCount={0} // Cart is cleared after purchase
            customerInfo={customerInfo}
            totalBambicoins={totalBambicoins}
            onShop={handleShopFromOrderConfirmation}
            onMenuClick={() => setIsNavOpen(true)}
          />
        );

      case "login":
        return (
          <LoginPage
            onBack={handleBackFromLogin}
            onMenuClick={() => setIsNavOpen(true)}
            cartCount={cartCount}
            totalBambicoins={totalBambicoins}
            onLoginSuccess={handleLoginSuccess}
          />
        );

      case "profile":
        return (
          <ProfilePage
            onBack={handleBackFromProfile}
            onMenuClick={() => setIsNavOpen(true)}
            cartCount={cartCount}
            totalBambicoins={totalBambicoins}
            onLoginClick={handleLoginClick}
          />
        );

      case "categories":
      case "bambicoins":
      case "newsstand":
      case "about":
        return (
          <PlaceholderPage
            title={
              viewMode === "categories"
                ? "Категории товаров"
                : viewMode === "bambicoins"
                  ? "Мои Бамбикоины"
                  : viewMode === "newsstand"
                    ? "Новости"
                    : "О нас"
            }
            onBack={handleBackToList}
            onMenuClick={() => setIsNavOpen(true)}
            cartCount={cartCount}
            totalBambicoins={totalBambicoins}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      {/* iPhone 16 Container */}
      <div className="w-[393px] h-[852px] bg-[#ffffff] relative overflow-hidden rounded-[40px] shadow-2xl border-8 border-black">
        {renderCurrentView()}

        {/* Add to Cart Overlay */}
        <AddToCartOverlay
          isVisible={showOverlay}
          product={overlayProduct}
          quantity={overlayQuantity}
        />

        {/* Custom Menu */}
        <Menu
          isOpen={isNavOpen}
          onClose={() => setIsNavOpen(false)}
          onNavigate={handleMenuNavigation}
          totalBambicoins={totalBambicoins}
        />
      </div>
    </div>
  );
}