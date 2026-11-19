import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  DEMO_USERS,
  INITIAL_BUYER_ORDERS,
  INITIAL_COMMISSIONS,
  INITIAL_PRODUCTS,
  INITIAL_REFERRALS,
  INITIAL_SELLER_ORDERS,
  calculateAffiliateCommission,
} from '../data/mockData';
import {
  AffiliateCommission,
  AffiliateReferral,
  CartItem,
  Order,
  Product,
  SellerOrder,
  User,
  UserRole,
} from '../types';

interface StoreContextType {
  currentPath: string;
  queryParams: URLSearchParams;
  navigate: (to: string) => void;
  user: User | null;
  loginAsRole: (role: UserRole, customEmail?: string) => void;
  signupUser: (data: { name: string; email: string; role: UserRole }) => void;
  registerAffiliate: (data: { name: string; email: string }) => User;
  upgradeBuyerToSeller: (data: { storeName: string; storeCategory: string; phone: string; city: string }) => void;
  updateUserProfile: (data: Partial<User>) => void;
  logout: () => void;
  products: Product[];
  addSellerProduct: (data: {
    name: string;
    category: string;
    categorySlug: string;
    price: number;
    originalPrice: number;
    stock: number;
    description: string;
    imageUrl: string;
  }) => Product;
  deleteSellerProduct: (id: string) => void;
  updateSellerProductStock: (id: string, stock: number) => void;
  cart: CartItem[];
  cartCount: number;
  cartSubtotal: number;
  addToCart: (product: Product, quantity?: number) => void;
  updateCartQty: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  wishlistIds: string[];
  toggleWishlist: (productId: string) => void;
  buyerOrders: Order[];
  placeOrder: (paymentMethod: string, shippingAddress: string) => Order;
  sellerOrders: SellerOrder[];
  updateSellerOrderStatus: (orderId: string, status: SellerOrder['status']) => void;
  commissions: AffiliateCommission[];
  referrals: AffiliateReferral[];
  activeAffiliateId: string;
  visitedRefCode: string | null;
  shareProductModal: Product | null;
  setShareProductModal: (product: Product | null) => void;
  toast: string | null;
  showToast: (msg: string) => void;
}

const StoreContext = createContext<StoreContextType | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [fullUrl, setFullUrl] = useState<string>(() => {
    return window.location.pathname + window.location.search;
  });

  const [user, setUser] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [cart, setCart] = useState<CartItem[]>([
    { product: INITIAL_PRODUCTS[0], quantity: 1 },
  ]);
  const [wishlistIds, setWishlistIds] = useState<string[]>(['prod-2', 'prod-7']);
  const [buyerOrders, setBuyerOrders] = useState<Order[]>(INITIAL_BUYER_ORDERS);
  const [sellerOrders, setSellerOrders] = useState<SellerOrder[]>(INITIAL_SELLER_ORDERS);
  const [commissions, setCommissions] = useState<AffiliateCommission[]>(INITIAL_COMMISSIONS);
  const [referrals, setReferrals] = useState<AffiliateReferral[]>(INITIAL_REFERRALS);
  const [visitedRefCode, setVisitedRefCode] = useState<string | null>(null);
  const [shareProductModal, setShareProductModal] = useState<Product | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
  };

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3200);
    return () => clearTimeout(t);
  }, [toast]);

  useEffect(() => {
    const onPopState = () => {
      setFullUrl(window.location.pathname + window.location.search);
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const parsedUrl = useMemo(() => {
    const [pathname, search = ''] = fullUrl.split('?');
    return {
      pathname: pathname || '/',
      params: new URLSearchParams(search),
    };
  }, [fullUrl]);

  useEffect(() => {
    const ref = parsedUrl.params.get('ref');
    if (ref) {
      setVisitedRefCode(ref);
    }
  }, [parsedUrl.params]);

  const navigate = (to: string) => {
    const normalized = to.startsWith('/') ? to : `/${to}`;
    window.history.pushState({}, '', normalized);
    setFullUrl(normalized);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const loginAsRole = (role: UserRole, customEmail?: string) => {
    const base = DEMO_USERS[role];
    setUser({
      ...base,
      email: customEmail && customEmail.trim() ? customEmail.trim() : base.email,
    });
    showToast(`Signed in as ${base.name} (${role})`);
  };

  const signupUser = (data: { name: string; email: string; role: UserRole }) => {
    const base = DEMO_USERS[data.role];
    const generatedAffId =
      data.role === 'affiliate'
        ? `AF${Math.floor(1030 + Math.random() * 8900)}`
        : undefined;
    setUser({
      ...base,
      id: `usr-${Date.now()}`,
      name: data.name.trim() || base.name,
      email: data.email.trim() || base.email,
      role: data.role,
      affiliateId: generatedAffId,
      storeName: data.role === 'seller' ? `${data.name.split(' ')[0]}'s Store` : undefined,
      isSellerApproved: data.role === 'seller',
    });
    showToast(`Account created as ${data.role}`);
  };

  const registerAffiliate = (data: { name: string; email: string }): User => {
    const uniqueId = `AF${Math.floor(1040 + Math.random() * 8900)}`;
    const newAffiliate: User = {
      id: `usr-aff-${Date.now()}`,
      name: data.name.trim() || 'New Affiliate Partner',
      email: data.email.trim() || 'partner@bazaarlink.demo',
      role: 'affiliate',
      phone: '+92 300 0000000',
      city: 'Lahore',
      affiliateId: uniqueId,
    };
    setUser(newAffiliate);
    showToast(`Affiliate account activated · ID ${uniqueId}`);
    return newAffiliate;
  };

  const upgradeBuyerToSeller = (data: {
    storeName: string;
    storeCategory: string;
    phone: string;
    city: string;
  }) => {
    setUser((prev) => {
      const current = prev ?? DEMO_USERS.buyer;
      return {
        ...current,
        role: 'seller',
        storeName: data.storeName,
        storeCategory: data.storeCategory,
        phone: data.phone,
        city: data.city,
        isSellerApproved: true,
      };
    });
    showToast(`Seller storefront "${data.storeName}" activated`);
  };

  const updateUserProfile = (data: Partial<User>) => {
    setUser((prev) => (prev ? { ...prev, ...data } : prev));
    showToast('Profile settings saved');
  };

  const logout = () => {
    setUser(null);
    showToast('Signed out');
    navigate('/');
  };

  const addSellerProduct = (data: {
    name: string;
    category: string;
    categorySlug: string;
    price: number;
    originalPrice: number;
    stock: number;
    description: string;
    imageUrl: string;
  }): Product => {
    const slug = data.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    const discountPercent =
      data.originalPrice > data.price
        ? Math.round(((data.originalPrice - data.price) / data.originalPrice) * 100)
        : 0;
    const newProd: Product = {
      id: `prod-${Date.now()}`,
      slug: `${slug}-${Math.floor(100 + Math.random() * 899)}`,
      name: data.name,
      category: data.category,
      categorySlug: data.categorySlug,
      price: data.price,
      originalPrice: data.originalPrice,
      discountPercent,
      rating: 4.8,
      reviewCount: 1,
      stock: data.stock,
      sellerName: user?.storeName || 'SoundCraft Official',
      sellerRating: 4.9,
      sellerCity: user?.city || 'Lahore',
      description: data.description,
      highlights: [
        'Verified marketplace seller listing',
        `14% Affiliate Commission eligible (Rs. ${calculateAffiliateCommission(data.price).toLocaleString('en-PK')})`,
        '7-day buyer protection return guarantee',
      ],
      images: [
        data.imageUrl || '/src/assets/images/product_wireless_headphones_1795091572557.jpg',
      ],
      sectionTags: ['new', 'recommended'],
      soldCount: 0,
    };
    setProducts((prev) => [newProd, ...prev]);
    showToast(`Published "${newProd.name}" to marketplace`);
    return newProd;
  };

  const deleteSellerProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    showToast('Product removed from catalog');
  };

  const updateSellerProductStock = (id: string, stock: number) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, stock: Math.max(0, stock) } : p))
    );
    showToast('Stock quantity updated');
  };

  const addToCart = (product: Product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id
            ? { ...i, quantity: Math.min(product.stock, i.quantity + quantity) }
            : i
        );
      }
      return [...prev, { product, quantity }];
    });
    showToast(`Added "${product.name}" to cart`);
  };

  const updateCartQty = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((i) =>
        i.product.id === productId
          ? { ...i, quantity: Math.min(i.product.stock, quantity) }
          : i
      )
    );
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((i) => i.product.id !== productId));
    showToast('Removed item from cart');
  };

  const clearCart = () => setCart([]);

  const toggleWishlist = (productId: string) => {
    setWishlistIds((prev) => {
      const exists = prev.includes(productId);
      showToast(exists ? 'Removed from wishlist' : 'Saved to wishlist');
      return exists ? prev.filter((id) => id !== productId) : [...prev, productId];
    });
  };

  const cartCount = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );

  const cartSubtotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
    [cart]
  );

  const placeOrder = (paymentMethod: string, shippingAddress: string): Order => {
    const newOrder: Order = {
      id: `ORD-${Math.floor(9100 + Math.random() * 899)}`,
      date: '2026-11-19',
      status: 'Pending',
      total: cartSubtotal,
      paymentMethod,
      shippingAddress,
      items: cart.map((i) => ({
        productId: i.product.id,
        productName: i.product.name,
        slug: i.product.slug,
        image: i.product.images[0],
        price: i.product.price,
        quantity: i.quantity,
      })),
    };
    setBuyerOrders((prev) => [newOrder, ...prev]);

    if (visitedRefCode && cart.length > 0) {
      const firstItem = cart[0];
      const commAmt = calculateAffiliateCommission(cartSubtotal);
      setCommissions((prev) => [
        {
          id: `COM-${Math.floor(410 + Math.random() * 500)}`,
          orderId: newOrder.id,
          productName: firstItem.product.name,
          productSlug: firstItem.product.slug,
          saleAmount: cartSubtotal,
          commissionRate: 14,
          commissionAmount: commAmt,
          date: '2026-11-19',
          status: 'Pending',
          note: `Attributed to ${visitedRefCode} — awaiting delivery verification`,
        },
        ...prev,
      ]);
      setReferrals((prev) =>
        prev.map((r) =>
          r.productSlug === firstItem.product.slug
            ? { ...r, conversions: r.conversions + 1, lastActivity: 'Just now' }
            : r
        )
      );
    }

    setCart([]);
    showToast(`Order ${newOrder.id} placed successfully`);
    return newOrder;
  };

  const updateSellerOrderStatus = (
    orderId: string,
    status: SellerOrder['status']
  ) => {
    setSellerOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
    showToast(`Order ${orderId} marked as ${status}`);
  };

  const activeAffiliateId = user?.affiliateId || 'AF1025';

  return (
    <StoreContext.Provider
      value={{
        currentPath: parsedUrl.pathname,
        queryParams: parsedUrl.params,
        navigate,
        user,
        loginAsRole,
        signupUser,
        registerAffiliate,
        upgradeBuyerToSeller,
        updateUserProfile,
        logout,
        products,
        addSellerProduct,
        deleteSellerProduct,
        updateSellerProductStock,
        cart,
        cartCount,
        cartSubtotal,
        addToCart,
        updateCartQty,
        removeFromCart,
        clearCart,
        wishlistIds,
        toggleWishlist,
        buyerOrders,
        placeOrder,
        sellerOrders,
        updateSellerOrderStatus,
        commissions,
        referrals,
        activeAffiliateId,
        visitedRefCode,
        shareProductModal,
        setShareProductModal,
        toast,
        showToast,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) {
    throw new Error('useStore must be used inside StoreProvider');
  }
  return ctx;
}
