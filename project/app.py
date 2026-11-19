"""
BazaarLink — Multi-Vendor E-Commerce & Affiliate Marketing Platform
Flask Frontend Prototype (Demo Data Only)
"""

from flask import Flask, render_template, request, redirect, url_for, session

app = Flask(__name__)
app.secret_key = "bazaarlink-frontend-demo-secret"

AFFILIATE_COMMISSION_RATE = 14


def calculate_commission(price: int) -> int:
    """Calculate 14% affiliate commission from product actual price."""
    return round(price * AFFILIATE_COMMISSION_RATE / 100)


CATEGORIES = [
    {
        "name": "Electronics & Audio",
        "slug": "electronics",
        "count": 142,
        "image": "images/categories/electronics.jpg",
    },
    {
        "name": "Watches & Wearables",
        "slug": "wearables",
        "count": 86,
        "image": "images/categories/wearables.jpg",
    },
    {
        "name": "Home & Kitchen",
        "slug": "home-living",
        "count": 119,
        "image": "images/categories/home-living.jpg",
    },
    {
        "name": "Bags & Accessories",
        "slug": "fashion",
        "count": 94,
        "image": "images/categories/fashion.jpg",
    },
    {
        "name": "Sports & Footwear",
        "slug": "footwear",
        "count": 73,
        "image": "images/categories/footwear.jpg",
    },
    {
        "name": "Skincare & Wellness",
        "slug": "beauty",
        "count": 68,
        "image": "images/categories/beauty.jpg",
    },
]

DEMO_PRODUCTS = [
    {
        "id": 1,
        "slug": "wireless-headphones",
        "name": "Acoustic Studio ANC Wireless Headphones",
        "category": "Electronics & Audio",
        "category_slug": "electronics",
        "price": 5000,
        "original_price": 7500,
        "discount": 33,
        "rating": 4.8,
        "reviews": 318,
        "stock": 42,
        "seller_name": "SoundCraft Official",
        "seller_city": "Lahore",
        "seller_rating": 4.9,
        "description": "Active noise-canceling over-ear wireless headphones with 40mm dynamic drivers, Bluetooth 5.3, and 45-hour battery life.",
        "image": "images/products/wireless-headphones.jpg",
        "gallery": ["images/products/wireless-headphones.jpg", "images/banners/banner_tech.jpg"],
        "tags": ["flash", "recommended", "bestselling"],
    },
    {
        "id": 2,
        "slug": "titanium-amoled-smartwatch",
        "name": "Apex Titanium AMOLED Smartwatch Pro",
        "category": "Watches & Wearables",
        "category_slug": "wearables",
        "price": 12500,
        "original_price": 16000,
        "discount": 22,
        "rating": 4.7,
        "reviews": 214,
        "stock": 27,
        "seller_name": "ChronoTech Store",
        "seller_city": "Karachi",
        "seller_rating": 4.8,
        "description": "Sapphire-crystal 1.43-inch AMOLED smartwatch housed in brushed titanium alloy with dual-band GPS and 14-day battery.",
        "image": "images/products/smartwatch.jpg",
        "gallery": ["images/products/smartwatch.jpg", "images/banners/banner_tech.jpg"],
        "tags": ["flash", "bestselling", "new"],
    },
    {
        "id": 3,
        "slug": "mechanical-keyboard-75",
        "name": "Tactile 75% Wireless Mechanical Keyboard",
        "category": "Electronics & Audio",
        "category_slug": "electronics",
        "price": 9800,
        "original_price": 12500,
        "discount": 22,
        "rating": 4.9,
        "reviews": 164,
        "stock": 19,
        "seller_name": "KeyLab Studio",
        "seller_city": "Islamabad",
        "seller_rating": 4.9,
        "description": "Hot-swappable 75% gasket-mounted mechanical keyboard with double-shot PBT keycaps and CNC rotary volume knob.",
        "image": "images/products/keyboard.jpg",
        "gallery": ["images/products/keyboard.jpg", "images/banners/banner_tech.jpg"],
        "tags": ["recommended", "new"],
    },
    {
        "id": 4,
        "slug": "barista-espresso-machine",
        "name": "Barista Compact Stainless Espresso Maker",
        "category": "Home & Kitchen",
        "category_slug": "home-living",
        "price": 38500,
        "original_price": 45000,
        "discount": 14,
        "rating": 4.8,
        "reviews": 92,
        "stock": 11,
        "seller_name": "BrewHaus Appliances",
        "seller_city": "Lahore",
        "seller_rating": 4.8,
        "description": "15-bar Italian pump espresso machine built in brushed stainless steel with integrated conical burr grinder.",
        "image": "images/products/espresso-maker.jpg",
        "gallery": ["images/products/espresso-maker.jpg", "images/banners/banner_home.jpg"],
        "tags": ["recommended", "bestselling"],
    },
    {
        "id": 5,
        "slug": "commuter-leather-backpack",
        "name": "Norden Ballistic Nylon & Leather Backpack",
        "category": "Bags & Accessories",
        "category_slug": "fashion",
        "price": 6400,
        "original_price": 8500,
        "discount": 25,
        "rating": 4.6,
        "reviews": 145,
        "stock": 34,
        "seller_name": "Norden Carry Co.",
        "seller_city": "Karachi",
        "seller_rating": 4.7,
        "description": "Weather-resistant 1680D ballistic nylon commuter pack with cognac leather trim and padded 16-inch laptop vault.",
        "image": "images/products/backpack.jpg",
        "gallery": ["images/products/backpack.jpg"],
        "tags": ["flash", "recommended"],
    },
    {
        "id": 6,
        "slug": "flow-performance-running-shoes",
        "name": "Aurora Flow Mesh Running Sneakers",
        "category": "Sports & Footwear",
        "category_slug": "footwear",
        "price": 7200,
        "original_price": 9600,
        "discount": 25,
        "rating": 4.7,
        "reviews": 208,
        "stock": 56,
        "seller_name": "Aurora Athletics",
        "seller_city": "Sialkot",
        "seller_rating": 4.8,
        "description": "Breathable engineered knit running shoes with dual-density EVA midsole for responsive road cushioning.",
        "image": "images/products/running-shoes.jpg",
        "gallery": ["images/products/running-shoes.jpg"],
        "tags": ["flash", "bestselling", "new"],
    },
    {
        "id": 7,
        "slug": "vitamin-c-hydration-kit",
        "name": "Aurora Vitamin C Serum & Hydration Duo",
        "category": "Skincare & Wellness",
        "category_slug": "beauty",
        "price": 3500,
        "original_price": 4400,
        "discount": 20,
        "rating": 4.9,
        "reviews": 274,
        "stock": 64,
        "seller_name": "Aurora Botanicals",
        "seller_city": "Islamabad",
        "seller_rating": 4.9,
        "description": "Daily radiance kit pairing 15% stabilized Vitamin C brightening serum with a ceramide hydration moisturizer.",
        "image": "images/products/skincare-kit.jpg",
        "gallery": ["images/products/skincare-kit.jpg"],
        "tags": ["recommended", "bestselling"],
    },
    {
        "id": 8,
        "slug": "architectural-led-desk-lamp",
        "name": "Atelier Matte Black & Brass LED Task Lamp",
        "category": "Home & Kitchen",
        "category_slug": "home-living",
        "price": 8900,
        "original_price": 11200,
        "discount": 21,
        "rating": 4.8,
        "reviews": 88,
        "stock": 23,
        "seller_name": "Atelier Lighting",
        "seller_city": "Lahore",
        "seller_rating": 4.8,
        "description": "Precision-machined aluminum and brushed brass LED task lamp with rotary dimmer and CRI 97+ illumination.",
        "image": "images/products/desk-lamp.jpg",
        "gallery": ["images/products/desk-lamp.jpg", "images/banners/banner_home.jpg"],
        "tags": ["new", "recommended"],
    },
]

for item in DEMO_PRODUCTS:
    item["commission"] = calculate_commission(item["price"])

DEMO_COMMISSIONS = [
    {"id": "COM-409", "order_id": "ORD-9012", "product": "Acoustic Studio ANC Wireless Headphones", "sale": 5000, "commission": 700, "date": "2026-11-19", "status": "Pending", "note": "Awaiting delivery verification"},
    {"id": "COM-402", "order_id": "ORD-8988", "product": "Apex Titanium AMOLED Smartwatch Pro", "sale": 12500, "commission": 1750, "date": "2026-11-16", "status": "Pending", "note": "In transit — clears after delivery"},
    {"id": "COM-391", "order_id": "ORD-8941", "product": "Tactile 75% Wireless Mechanical Keyboard", "sale": 9800, "commission": 1372, "date": "2026-11-12", "status": "Approved", "note": "Verified — clearing into wallet"},
    {"id": "COM-378", "order_id": "ORD-8890", "product": "Barista Compact Stainless Espresso Maker", "sale": 38500, "commission": 5390, "date": "2026-11-05", "status": "Available", "note": "Verified & withdrawable"},
    {"id": "COM-364", "order_id": "ORD-8842", "product": "Acoustic Studio ANC Wireless Headphones", "sale": 5000, "commission": 700, "date": "2026-11-01", "status": "Available", "note": "Verified & withdrawable"},
]


@app.context_processor
def inject_globals():
    return {
        "categories": CATEGORIES,
        "affiliate_id": session.get("affiliate_id", "AF1025"),
        "affiliate_rate": AFFILIATE_COMMISSION_RATE,
        "demo_user": session.get("user"),
    }


# ---------------- PUBLIC ROUTES ----------------
@app.route("/")
def home():
    flash_deals = [p for p in DEMO_PRODUCTS if "flash" in p["tags"]]
    recommended = [p for p in DEMO_PRODUCTS if "recommended" in p["tags"]]
    bestselling = [p for p in DEMO_PRODUCTS if "bestselling" in p["tags"]]
    new_arrivals = [p for p in DEMO_PRODUCTS if "new" in p["tags"]]
    return render_template(
        "index.html",
        flash_deals=flash_deals,
        recommended=recommended,
        bestselling=bestselling,
        new_arrivals=new_arrivals,
    )


@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        role = request.form.get("role", "buyer")
        session["user"] = {"email": request.form.get("email"), "role": role}
        return redirect(url_for(f"{role}_dashboard"))
    return render_template("login.html")


@app.route("/signup", methods=["GET", "POST"])
def signup():
    if request.method == "POST":
        role = request.form.get("account_type", "buyer")
        session["user"] = {"name": request.form.get("full_name"), "email": request.form.get("email"), "role": role}
        if role == "affiliate":
            session["affiliate_id"] = "AF1042"
        return redirect(url_for(f"{role}_dashboard"))
    return render_template("signup.html")


@app.route("/categories")
def categories():
    cat_slug = request.args.get("cat", "all")
    filtered = DEMO_PRODUCTS if cat_slug == "all" else [p for p in DEMO_PRODUCTS if p["category_slug"] == cat_slug]
    return render_template("categories.html", products=filtered, active_cat=cat_slug)


@app.route("/product/<slug>")
def product_detail(slug):
    product = next((p for p in DEMO_PRODUCTS if p["slug"] == slug), DEMO_PRODUCTS[0])
    ref_code = request.args.get("ref")
    related = [p for p in DEMO_PRODUCTS if p["slug"] != product["slug"]][:4]
    return render_template("product.html", product=product, ref_code=ref_code, related=related)


@app.route("/search")
def search():
    query = request.args.get("q", "").strip().lower()
    results = (
        DEMO_PRODUCTS
        if not query
        else [
            p
            for p in DEMO_PRODUCTS
            if query in p["name"].lower() or query in p["category"].lower() or query in p["seller_name"].lower()
        ]
    )
    return render_template("search.html", query=request.args.get("q", ""), products=results)


@app.route("/become-member")
def become_member():
    return render_template("become_member.html")


# ---------------- BUYER ROUTES ----------------
@app.route("/buyer/dashboard")
def buyer_dashboard():
    return render_template("buyer/dashboard.html")


@app.route("/buyer/orders")
def buyer_orders():
    return render_template("buyer/orders.html")


@app.route("/buyer/wishlist")
def buyer_wishlist():
    return render_template("buyer/wishlist.html", products=DEMO_PRODUCTS[:2])


@app.route("/buyer/cart")
def buyer_cart():
    return render_template("buyer/cart.html", cart_items=[{"product": DEMO_PRODUCTS[0], "qty": 1}])


@app.route("/buyer/settings", methods=["GET", "POST"])
def buyer_settings():
    seller_activated = False
    if request.method == "POST" and request.form.get("action") == "become_seller":
        seller_activated = True
        session["store_name"] = request.form.get("store_name", "Demo Vendor Store")
    return render_template("buyer/settings.html", seller_activated=seller_activated)


# ---------------- SELLER ROUTES ----------------
@app.route("/seller/dashboard")
def seller_dashboard():
    return render_template("seller/dashboard.html", products=DEMO_PRODUCTS)


@app.route("/seller/add-product", methods=["GET", "POST"])
def seller_add_product():
    added = False
    if request.method == "POST":
        added = True
    return render_template("seller/add_product.html", added=added)


@app.route("/seller/products")
def seller_products():
    return render_template("seller/products.html", products=DEMO_PRODUCTS)


@app.route("/seller/orders")
def seller_orders():
    return render_template("seller/orders.html")


@app.route("/seller/profile")
def seller_profile():
    return render_template("seller/profile.html")


# ---------------- AFFILIATE ROUTES ----------------
@app.route("/affiliate/signup", methods=["GET", "POST"])
def affiliate_signup():
    new_id = None
    if request.method == "POST":
        new_id = "AF1042"
        session["affiliate_id"] = new_id
    return render_template("affiliate/signup.html", new_affiliate_id=new_id)


@app.route("/affiliate/dashboard")
def affiliate_dashboard():
    pending = sum(c["commission"] for c in DEMO_COMMISSIONS if c["status"] == "Pending")
    approved = sum(c["commission"] for c in DEMO_COMMISSIONS if c["status"] == "Approved")
    available = sum(c["commission"] for c in DEMO_COMMISSIONS if c["status"] == "Available")
    return render_template(
        "affiliate/dashboard.html",
        commissions=DEMO_COMMISSIONS,
        pending=pending,
        approved=approved,
        available=available,
        total_earnings=pending + approved + available,
    )


@app.route("/affiliate/referrals")
def affiliate_referrals():
    return render_template("affiliate/referrals.html", products=DEMO_PRODUCTS[:4])


@app.route("/affiliate/wallet")
def affiliate_wallet():
    pending = sum(c["commission"] for c in DEMO_COMMISSIONS if c["status"] == "Pending")
    approved = sum(c["commission"] for c in DEMO_COMMISSIONS if c["status"] == "Approved")
    available = sum(c["commission"] for c in DEMO_COMMISSIONS if c["status"] == "Available")
    return render_template(
        "affiliate/wallet.html",
        pending=pending,
        approved=approved,
        available=available,
    )


@app.route("/affiliate/commissions")
def affiliate_commissions():
    return render_template("affiliate/commissions.html", commissions=DEMO_COMMISSIONS)


@app.route("/affiliate/links")
def affiliate_links():
    return render_template("affiliate/links.html", products=DEMO_PRODUCTS)


@app.route("/affiliate/profile")
def affiliate_profile():
    return render_template("affiliate/profile.html")


if __name__ == "__main__":
    app.run(debug=True, port=5000)
