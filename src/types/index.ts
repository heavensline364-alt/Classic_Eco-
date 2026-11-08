export interface Product {
  id: string;
  name: string;
  category: string;
  categorySlug: string;
  description: string;
  price: number;
  moq: number;
  sizes: string[];
  material: string;
  isCustomizable: boolean;
  stockStatus: string;
  featured: boolean;
  images: string[];
  rating: number;
  reviewsCount: number;
  createdAt?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  itemCount?: number;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  moq: number;
  quantity: number;
  selectedSize: string;
  image: string;
  category: string;
}

export interface OrderItem {
  id: string;
  name: string;
  size: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface Order {
  id: string;
  userId?: string | null;
  customerName: string;
  phone: string;
  email?: string;
  address: string;
  district: string;
  area: string;
  orderNotes?: string;
  paymentMethod: string;
  paymentStatus: string;
  trxId?: string;
  orderStatus: 'Pending' | 'Confirmed' | 'Processing' | 'Production' | 'Shipped' | 'Delivered' | 'Cancelled';
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  statusHistory?: Array<{ status: string; timestamp: string; note: string }>;
  createdAt: string;
}

export interface QuoteRequest {
  id: string;
  userId?: string | null;
  name: string;
  businessName: string;
  phone: string;
  email?: string;
  productType: string;
  requiredQuantity: string;
  packagingSize: string;
  materialPreference: string;
  logoFile?: string | null;
  designFile?: string | null;
  instructions?: string;
  status: 'Pending' | 'Under Review' | 'Quoted' | 'Approved' | 'Rejected' | 'Completed';
  quotedPrice?: number | null;
  adminNotes?: string;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'customer' | 'admin';
  businessName?: string;
  address?: string;
  isBlocked?: boolean;
  createdAt?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  comment: string;
  rating: number;
  avatar?: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface WebsiteSettings {
  siteName: string;
  phone: string;
  secondaryPhone: string;
  email: string;
  address: string;
  facebookUrl: string;
  deliveryDhaka: number;
  deliveryOutside: number;
  freeDeliveryThreshold: number;
  bkashNumber: string;
  bkashType: string;
  nagadNumber: string;
  nagadType: string;
  heroTitle: string;
  heroSubtitle: string;
  seoTitle: string;
  seoDescription: string;
}
