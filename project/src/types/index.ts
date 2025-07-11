export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  location?: {
    lat: number;
    lng: number;
    address: string;
  };
  profilePhoto?: string;
  farmSize?: string;
  cropTypes?: string[];
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  category: 'fertilizers' | 'seeds' | 'equipment' | 'tools' | 'pesticides';
  price: number;
  description: string;
  image: string;
  brand: string;
  rating: number;
  reviews: number;
  inStock: boolean;
  usageGuide?: string;
  specifications?: Record<string, string>;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  orderDate: string;
  shippingAddress: string;
  trackingNumber?: string;
}

export interface CropRecommendation {
  id: string;
  name: string;
  season: string;
  growthPeriod: string;
  expectedYield: string;
  soilType: string[];
  climateRequirements: string;
  fertilizers: string[];
  plantingTips: string[];
  harvestTime: string;
  marketPrice?: number;
}

export interface Location {
  lat: number;
  lng: number;
  address: string;
  region: string;
  climate: string;
}