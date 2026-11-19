export type UserRole = 'buyer' | 'seller' | 'affiliate';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone: string;
  city: string;
  affiliateId?: string;
  storeName?: string;
  storeCategory?: string;
  isSellerApproved?: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  itemCount: number;
  description: string;
  image: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: string;
  categorySlug: string;
  price: number;
  originalPrice: number;
  discountPercent: number;
  rating: number;
  reviewCount: number;
  stock: number;
  sellerName: string;
  sellerRating: number;
  sellerCity: string;
  description: string;
  highlights: string[];
  images: string[];
  sectionTags: ('flash' | 'recommended' | 'bestselling' | 'new')[];
  soldCount: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderItem {
  productId: string;
  productName: string;
  slug: string;
  image: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  date: string;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered';
  total: number;
  paymentMethod: string;
  shippingAddress: string;
  items: OrderItem[];
}

export interface SellerOrder {
  id: string;
  customerName: string;
  productName: string;
  quantity: number;
  totalAmount: number;
  date: string;
  status: 'Pending' | 'Packed' | 'Shipped' | 'Delivered';
}

export type CommissionStatus = 'Pending' | 'Approved' | 'Available';

export interface AffiliateCommission {
  id: string;
  orderId: string;
  productName: string;
  productSlug: string;
  saleAmount: number;
  commissionRate: number;
  commissionAmount: number;
  date: string;
  status: CommissionStatus;
  note: string;
}

export interface AffiliateReferral {
  id: string;
  productName: string;
  productSlug: string;
  referralUrl: string;
  clicks: number;
  conversions: number;
  earnedTotal: number;
  lastActivity: string;
}

export interface BannerSlide {
  id: string;
  kicker: string;
  title: string;
  subtitle: string;
  ctaLabel: string;
  ctaRoute: string;
  image: string;
  accentNote: string;
}
