// Frontend Demo Shopping Cart using localStorage
const CART_STORAGE_KEY = "bazaarlink_demo_cart";

function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  updateCartBadge();
}

function updateCartBadge() {
  const badge = document.getElementById("navCartCount");
  if (!badge) return;
  const totalQty = getCart().reduce((sum, item) => sum + item.qty, 0);
  badge.textContent = totalQty;
}

function addToCart(name, price, slug) {
  const cart = getCart();
  const existing = cart.find((item) => item.slug === slug);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ name, price: Number(price), slug, qty: 1 });
  }
  saveCart(cart);
  if (typeof showToast === "function") {
    showToast(`Added "${name}" to cart`);
  }
}

document.addEventListener("DOMContentLoaded", updateCartBadge);
