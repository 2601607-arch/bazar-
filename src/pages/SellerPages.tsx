import React, { useState } from 'react';
import {
  Boxes,
  ClipboardList,
  LayoutDashboard,
  PlusCircle,
  Store,
  Trash2,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { DashboardLayout, DashboardNavItem } from '../components/DashboardLayout';
import { CATEGORIES, calculateAffiliateCommission, formatRs } from '../data/mockData';
import { SellerOrder } from '../types';

const SELLER_NAV: DashboardNavItem[] = [
  { label: 'Seller Dashboard', route: '/seller/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
  { label: 'Add Product', route: '/seller/add-product', icon: <PlusCircle className="w-4 h-4" /> },
  { label: 'Manage Products', route: '/seller/products', icon: <Boxes className="w-4 h-4" /> },
  { label: 'Seller Orders', route: '/seller/orders', icon: <ClipboardList className="w-4 h-4" /> },
  { label: 'Seller Profile', route: '/seller/profile', icon: <Store className="w-4 h-4" /> },
];

const DEMO_IMAGE_PRESETS = [
  { label: 'Wireless Headphones', url: '/src/assets/images/product_wireless_headphones_1795091572557.jpg' },
  { label: 'Titanium Smartwatch', url: '/src/assets/images/product_smartwatch_pro_1795091572240.jpg' },
  { label: 'Mechanical Keyboard', url: '/src/assets/images/product_mechanical_keyboard_1795091572145.jpg' },
  { label: 'Espresso Maker', url: '/src/assets/images/product_espresso_maker_1795091572911.jpg' },
  { label: 'Commuter Backpack', url: '/src/assets/images/product_commuter_backpack_1795091572258.jpg' },
  { label: 'LED Desk Lamp', url: '/src/assets/images/product_desk_lamp_1795091573326.jpg' },
];

export function SellerDashboardPage() {
  const { products, sellerOrders, navigate } = useStore();
  const totalSales = sellerOrders.reduce((sum, o) => sum + o.totalAmount, 0);
  const pendingOrdersCount = sellerOrders.filter((o) => o.status === 'Pending').length;

  return (
    <DashboardLayout
      portalTitle="Seller Dashboard"
      portalRole="seller"
      breadcrumb="Home / Seller / Dashboard"
      navItems={SELLER_NAV}
    >
      {/* 4 Core Seller KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-zinc-200 rounded-xl p-5">
          <div className="text-xs text-zinc-500">Total Products</div>
          <div className="font-mono text-2xl font-bold text-[#18181B] mt-1 tabular-nums">
            {products.length}
          </div>
        </div>
        <div className="bg-white border border-zinc-200 rounded-xl p-5">
          <div className="text-xs text-zinc-500">Total Orders</div>
          <div className="font-mono text-2xl font-bold text-[#18181B] mt-1 tabular-nums">
            {sellerOrders.length}
          </div>
        </div>
        <div className="bg-white border border-zinc-200 rounded-xl p-5">
          <div className="text-xs text-zinc-500">Total Sales</div>
          <div className="font-mono text-2xl font-bold text-[#F85606] mt-1 tabular-nums">
            {formatRs(totalSales)}
          </div>
        </div>
        <div className="bg-white border border-zinc-200 rounded-xl p-5">
          <div className="text-xs text-zinc-500">Pending Orders</div>
          <div className="font-mono text-2xl font-bold text-amber-600 mt-1 tabular-nums">
            {pendingOrdersCount}
          </div>
        </div>
      </div>

      {/* Quick Actions & Recent Orders */}
      <div className="bg-white border border-zinc-200 rounded-xl p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="font-display text-lg font-bold text-[#18181B]">Recent Vendor Orders</h2>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => navigate('/seller/add-product')}
              className="px-4 py-2 rounded-lg bg-[#F85606] hover:bg-[#D94802] text-white text-xs font-semibold cursor-pointer"
            >
              Add New Product
            </button>
            <button
              type="button"
              onClick={() => navigate('/seller/products')}
              className="px-4 py-2 rounded-lg border border-zinc-200 hover:border-[#F85606] text-xs font-semibold text-[#18181B] cursor-pointer"
            >
              Manage Products
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-zinc-200 text-xs text-zinc-500">
                <th className="py-2.5 pr-4 font-medium">Order</th>
                <th className="py-2.5 px-4 font-medium">Customer</th>
                <th className="py-2.5 px-4 font-medium">Product</th>
                <th className="py-2.5 px-4 font-medium">Status</th>
                <th className="py-2.5 pl-4 font-medium text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {sellerOrders.map((ord) => (
                <tr key={ord.id} className="hover:bg-[#F4F5F7]/60">
                  <td className="py-3 pr-4 font-mono font-semibold tabular-nums">{ord.id}</td>
                  <td className="py-3 px-4 text-zinc-700">{ord.customerName}</td>
                  <td className="py-3 px-4 text-zinc-800">{ord.productName}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`text-xs font-semibold ${
                        ord.status === 'Delivered'
                          ? 'text-emerald-700'
                          : ord.status === 'Pending'
                            ? 'text-amber-700'
                            : 'text-blue-700'
                      }`}
                    >
                      {ord.status}
                    </span>
                  </td>
                  <td className="py-3 pl-4 text-right font-mono font-semibold tabular-nums">
                    {formatRs(ord.totalAmount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}

export function SellerAddProductPage() {
  const { addSellerProduct, navigate } = useStore();
  const [name, setName] = useState('');
  const [categorySlug, setCategorySlug] = useState(CATEGORIES[0].slug);
  const [price, setPrice] = useState(5000);
  const [originalPrice, setOriginalPrice] = useState(6500);
  const [stock, setStock] = useState(25);
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState(DEMO_IMAGE_PRESETS[0].url);

  const selectedCat = CATEGORIES.find((c) => c.slug === categorySlug) || CATEGORIES[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addSellerProduct({
      name,
      category: selectedCat.name,
      categorySlug: selectedCat.slug,
      price: Number(price),
      originalPrice: Number(originalPrice),
      stock: Number(stock),
      description,
      imageUrl,
    });
    navigate('/seller/products');
  };

  return (
    <DashboardLayout
      portalTitle="Add New Product"
      portalRole="seller"
      breadcrumb="Home / Seller / Add Product"
      navItems={SELLER_NAV}
    >
      <form onSubmit={handleSubmit} className="bg-white border border-zinc-200 rounded-xl p-6 space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label htmlFor="sp-name" className="block text-xs font-semibold text-zinc-700 mb-1.5">
              Product Name
            </label>
            <input
              id="sp-name"
              type="text"
              required
              placeholder="e.g. Studio Wireless Earbuds Pro"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-200 text-sm focus:outline-none focus:border-[#F85606]"
            />
          </div>

          <div>
            <label htmlFor="sp-cat" className="block text-xs font-semibold text-zinc-700 mb-1.5">
              Category
            </label>
            <select
              id="sp-cat"
              value={categorySlug}
              onChange={(e) => setCategorySlug(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-200 text-sm bg-white focus:outline-none focus:border-[#F85606]"
            >
              {CATEGORIES.map((c) => (
                <option key={c.id} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div>
            <label htmlFor="sp-price" className="block text-xs font-semibold text-zinc-700 mb-1.5">
              Product Price (Rs.)
            </label>
            <input
              id="sp-price"
              type="number"
              min={50}
              required
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-200 font-mono text-sm tabular-nums focus:outline-none focus:border-[#F85606]"
            />
          </div>

          <div>
            <label htmlFor="sp-orig" className="block text-xs font-semibold text-zinc-700 mb-1.5">
              Compare-At Price (Rs.)
            </label>
            <input
              id="sp-orig"
              type="number"
              min={50}
              required
              value={originalPrice}
              onChange={(e) => setOriginalPrice(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-200 font-mono text-sm tabular-nums focus:outline-none focus:border-[#F85606]"
            />
          </div>

          <div>
            <label htmlFor="sp-stock" className="block text-xs font-semibold text-zinc-700 mb-1.5">
              Stock Quantity
            </label>
            <input
              id="sp-stock"
              type="number"
              min={0}
              required
              value={stock}
              onChange={(e) => setStock(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-200 font-mono text-sm tabular-nums focus:outline-none focus:border-[#F85606]"
            />
          </div>
        </div>

        {/* Product Image Selection */}
        <div>
          <label className="block text-xs font-semibold text-zinc-700 mb-2">
            Product Image (Select Studio Asset or Custom URL)
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5 mb-3">
            {DEMO_IMAGE_PRESETS.map((preset) => (
              <button
                key={preset.url}
                type="button"
                onClick={() => setImageUrl(preset.url)}
                className={`rounded-lg overflow-hidden border-2 p-0.5 transition-colors cursor-pointer ${
                  imageUrl === preset.url ? 'border-[#F85606]' : 'border-zinc-200'
                }`}
              >
                <img
                  src={preset.url}
                  alt={preset.label}
                  referrerPolicy="no-referrer"
                  className="w-full aspect-[4/3] object-cover rounded"
                />
              </button>
            ))}
          </div>
          <input
            type="text"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="/src/assets/images/..."
            className="w-full px-3.5 py-2 rounded-lg border border-zinc-200 font-mono text-xs focus:outline-none focus:border-[#F85606]"
          />
        </div>

        <div>
          <label htmlFor="sp-desc" className="block text-xs font-semibold text-zinc-700 mb-1.5">
            Product Description
          </label>
          <textarea
            id="sp-desc"
            rows={4}
            required
            placeholder="Describe key specifications, materials, and warranty..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-200 text-sm focus:outline-none focus:border-[#F85606]"
          />
        </div>

        <div className="bg-[#F4F5F7] border border-zinc-200 rounded-lg p-4 flex items-center justify-between text-xs sm:text-sm">
          <span className="text-zinc-600">
            Automatic 14% Affiliate Commission for partners promoting this product:
          </span>
          <span className="font-mono font-bold text-emerald-700 tabular-nums">
            {formatRs(calculateAffiliateCommission(Number(price) || 0))} per sale
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-lg bg-[#F85606] hover:bg-[#D94802] text-white text-sm font-semibold cursor-pointer"
          >
            Publish Product
          </button>
          <button
            type="button"
            onClick={() => navigate('/seller/products')}
            className="px-5 py-2.5 rounded-lg border border-zinc-200 text-sm font-semibold text-zinc-700 cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </form>
    </DashboardLayout>
  );
}

export function SellerProductsPage() {
  const { products, deleteSellerProduct, updateSellerProductStock, navigate } = useStore();

  return (
    <DashboardLayout
      portalTitle="Manage Products"
      portalRole="seller"
      breadcrumb="Home / Seller / Manage Products"
      navItems={SELLER_NAV}
    >
      <div className="bg-white border border-zinc-200 rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between gap-4">
          <h2 className="font-display text-lg font-bold text-[#18181B]">
            Catalog Inventory ({products.length})
          </h2>
          <button
            type="button"
            onClick={() => navigate('/seller/add-product')}
            className="px-4 py-2 rounded-lg bg-[#F85606] hover:bg-[#D94802] text-white text-xs font-semibold cursor-pointer"
          >
            + Add Product
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-zinc-200 text-xs text-zinc-500">
                <th className="py-2.5 pr-4 font-medium">Product</th>
                <th className="py-2.5 px-4 font-medium">Category</th>
                <th className="py-2.5 px-4 font-medium text-right">Price</th>
                <th className="py-2.5 px-4 font-medium text-right">Stock</th>
                <th className="py-2.5 pl-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {products.map((prod) => (
                <tr key={prod.id} className="hover:bg-[#F4F5F7]/60">
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={prod.images[0]}
                        alt={prod.name}
                        referrerPolicy="no-referrer"
                        className="w-12 h-10 rounded object-cover bg-[#F4F5F7] shrink-0"
                      />
                      <button
                        type="button"
                        onClick={() => navigate(`/product/${prod.slug}`)}
                        className="font-semibold text-[#18181B] hover:text-[#F85606] text-left cursor-pointer"
                      >
                        {prod.name}
                      </button>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-zinc-600">{prod.category}</td>
                  <td className="py-3 px-4 text-right font-mono font-semibold tabular-nums">
                    {formatRs(prod.price)}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="inline-flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => updateSellerProductStock(prod.id, prod.stock - 1)}
                        className="w-6 h-6 rounded border border-zinc-200 text-xs font-bold hover:border-[#F85606] cursor-pointer"
                      >
                        -
                      </button>
                      <span className="font-mono text-xs font-semibold w-8 text-center tabular-nums">
                        {prod.stock}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateSellerProductStock(prod.id, prod.stock + 1)}
                        className="w-6 h-6 rounded border border-zinc-200 text-xs font-bold hover:border-[#F85606] cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td className="py-3 pl-4 text-right">
                    <button
                      type="button"
                      onClick={() => deleteSellerProduct(prod.id)}
                      aria-label={`Delete ${prod.name}`}
                      className="p-1.5 rounded text-zinc-400 hover:text-red-600 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}

export function SellerOrdersPage() {
  const { sellerOrders, updateSellerOrderStatus } = useStore();

  return (
    <DashboardLayout
      portalTitle="Seller Orders"
      portalRole="seller"
      breadcrumb="Home / Seller / Orders"
      navItems={SELLER_NAV}
    >
      <div className="bg-white border border-zinc-200 rounded-xl p-6 space-y-4">
        <h2 className="font-display text-lg font-bold text-[#18181B]">Fulfillment Queue</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-zinc-200 text-xs text-zinc-500">
                <th className="py-2.5 pr-4 font-medium">Order ID</th>
                <th className="py-2.5 px-4 font-medium">Customer</th>
                <th className="py-2.5 px-4 font-medium">Product</th>
                <th className="py-2.5 px-4 font-medium text-right">Qty</th>
                <th className="py-2.5 px-4 font-medium text-right">Total</th>
                <th className="py-2.5 pl-4 font-medium">Fulfillment Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {sellerOrders.map((ord) => (
                <tr key={ord.id} className="hover:bg-[#F4F5F7]/60">
                  <td className="py-3 pr-4 font-mono font-semibold tabular-nums">{ord.id}</td>
                  <td className="py-3 px-4 text-zinc-700">{ord.customerName}</td>
                  <td className="py-3 px-4 text-zinc-800">{ord.productName}</td>
                  <td className="py-3 px-4 text-right font-mono tabular-nums">{ord.quantity}</td>
                  <td className="py-3 px-4 text-right font-mono font-semibold tabular-nums">
                    {formatRs(ord.totalAmount)}
                  </td>
                  <td className="py-3 pl-4">
                    <select
                      value={ord.status}
                      onChange={(e) =>
                        updateSellerOrderStatus(ord.id, e.target.value as SellerOrder['status'])
                      }
                      aria-label={`Update status for ${ord.id}`}
                      className="px-2.5 py-1.5 rounded-lg border border-zinc-200 bg-white text-xs font-semibold focus:outline-none focus:border-[#F85606]"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Packed">Packed</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}

export function SellerProfilePage() {
  const { user, updateUserProfile } = useStore();
  const [storeName, setStoreName] = useState(user?.storeName || 'SoundCraft Official');
  const [storeCategory, setStoreCategory] = useState(user?.storeCategory || 'Electronics & Audio');
  const [phone, setPhone] = useState(user?.phone || '+92 321 8845102');
  const [city, setCity] = useState(user?.city || 'Lahore');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({ storeName, storeCategory, phone, city });
  };

  return (
    <DashboardLayout
      portalTitle="Seller Profile"
      portalRole="seller"
      breadcrumb="Home / Seller / Profile"
      navItems={SELLER_NAV}
    >
      <form onSubmit={handleSubmit} className="bg-white border border-zinc-200 rounded-xl p-6 max-w-xl space-y-4">
        <h2 className="font-display text-lg font-bold text-[#18181B]">Storefront Details</h2>
        <div>
          <label className="block text-xs font-semibold text-zinc-700 mb-1.5">Store Name</label>
          <input
            type="text"
            required
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-200 text-sm focus:outline-none focus:border-[#F85606]"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-zinc-700 mb-1.5">Primary Category</label>
          <select
            value={storeCategory}
            onChange={(e) => setStoreCategory(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-200 text-sm bg-white focus:outline-none focus:border-[#F85606]"
          >
            {CATEGORIES.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1.5">Phone</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-200 text-sm focus:outline-none focus:border-[#F85606]"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1.5">City</label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-200 text-sm focus:outline-none focus:border-[#F85606]"
            />
          </div>
        </div>
        <button
          type="submit"
          className="px-5 py-2.5 rounded-lg bg-[#F85606] hover:bg-[#D94802] text-white text-sm font-semibold cursor-pointer"
        >
          Update Seller Profile
        </button>
      </form>
    </DashboardLayout>
  );
}
