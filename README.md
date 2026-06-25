# 🌶️🔥 GHOST PEPPER — Website + Brand Book

The official site for **GHOST PEPPER** (`ghost.pepper.dnb`) — Liliya "Lily" Semenova.
Drum & bass · fire performance · festival apparel. **Wear the burn.**

Built as a fast, static site that drops straight onto **GitHub Pages**, with a
front-end shopping cart and **Stripe checkout stubbed** and ready to go live.

---

## 📁 What's in here

```
ghost.pepper.dnb/
├── index.html          # Home / landing (hero, pillars, featured drop, shop-the-stream CTA)
├── shop.html           # Shop — filterable product grid + cart drawer
├── product.html        # Product detail template (reads ?id=…)
├── stream.html         # Live stream hub — player embed + live chat + shop-the-stream
├── about.html          # Artist story + the three crafts
├── contact.html        # Booking/contact form + FAQ
├── css/
│   └── styles.css      # Full design system (colors, type, components, cart, animations)
├── js/
│   ├── products.js     # 🛒 Product catalog — EDIT THIS to change apparel
│   ├── cart.js         # Cart engine + Stripe checkout STUB
│   └── main.js         # Nav, scroll-reveal, footer year
├── assets/
│   └── logo.svg        # Ghost-pepper flame mark
├── brand-book/
│   └── index.html      # 📖 Brand Portfolio Book (self-contained — open directly)
└── README.md
```

> **Tip:** Open `brand-book/index.html` in any browser to flip through the full brand
> guidelines. Open `index.html` for the live site.

---

## 🚀 Deploy to GitHub Pages (free hosting)

1. Create a new repo, e.g. `ghost-pepper` (or `ghost.pepper.dnb`).
2. Put **all these files at the repo root** (so `index.html` is at the top level).
3. Commit & push:
   ```bash
   git init
   git add .
   git commit -m "Ghost Pepper site — launch"
   git branch -M main
   git remote add origin https://github.com/<you>/ghost-pepper.git
   git push -u origin main
   ```
4. On GitHub → **Settings → Pages** → Source = `main` / `/ (root)` → **Save**.
5. Your site goes live at `https://<you>.github.io/ghost-pepper/` in ~1 minute.

### Custom domain (when you buy one)
- Buy a domain (Namecheap, Porkbun, Cloudflare, etc.).
- In **Settings → Pages → Custom domain**, enter e.g. `ghostpepper.dnb` and Save
  (this creates a `CNAME` file).
- At your registrar, add the GitHub Pages DNS records:
  - `A` records → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
  - or a `CNAME` for `www` → `<you>.github.io`
- Tick **Enforce HTTPS** once DNS propagates.

---

## 🖼️ Add your real photos

Everything currently shows trippy **gradient placeholders** (the boxes labeled with
what shot goes there). To use real images:

1. Drop files into `assets/` (e.g. make an `assets/products/` and `assets/photos/` folder).
2. **Products:** open `js/products.js` and set each item's `img` to its path, e.g.
   ```js
   { id:'gp-tee-emberskull', name:'Ember Skull Tee', price:38, img:'assets/products/ember-skull.jpg', … }
   ```
   The shop and product pages automatically swap the placeholder for your image.
3. **Page photos** (hero, about, etc.): in the HTML, replace a
   `<div class="ph" data-label="…"></div>` with
   `<img src="assets/photos/your-photo.jpg" alt="…">`.

---

## 🛒 Editing the shop

All products live in **one file**: `js/products.js`.
Add, remove, or edit entries in the `GP_PRODUCTS` array — every page (home featured,
shop grid, product pages, stream rail) updates automatically. Fields:

| field | meaning |
|------|---------|
| `id` | unique slug (used in cart + `product.html?id=`) |
| `name`, `price`, `blurb`, `desc` | display copy |
| `badge` | corner ribbon, e.g. `HOT`, `NEW`, `FLOW`, `ART` (blank = none) |
| `category` | filter group on the shop page |
| `sizes` | array → builds the size selector |
| `img` | path to image (blank = placeholder) |

---

## 💳 Going live with Stripe

The cart is fully working **except** real payment — checkout currently opens a demo
summary (see `stripeCheckout()` in `js/cart.js`). GitHub Pages is **static** (no server),
so pick one of these:

### Option A — Stripe Payment Links (easiest, no code server)
1. In the Stripe Dashboard, create a **Payment Link** for each product.
2. Map them in `js/cart.js`, e.g.
   ```js
   const LINKS = { 'gp-tee-emberskull':'https://buy.stripe.com/xxx', … };
   function stripeCheckout(){
     const first = GPCart.items()[0];
     if(first) window.location = LINKS[first.id];
   }
   ```
   *(Payment Links are single-item; for true multi-item carts use Option B.)*

### Option B — Stripe Checkout Session (real cart, needs one serverless function)
1. Deploy a tiny function on **Netlify / Vercel / Cloudflare Workers** that creates a
   [Checkout Session](https://stripe.com/docs/checkout/quickstart) from the cart and
   returns its URL. Keep your **secret key** on the server only — never in this repo.
2. In `stripeCheckout()`, POST `GPCart.items()` to that function and redirect to the
   returned `session.url`.
3. Add a `success.html` and `cancel.html` for the return URLs.

> ⚠️ Never put a Stripe **secret key** in front-end code or in this repo.
> Only the *publishable* key (`pk_…`) is safe client-side.

---

## 📺 Going live with the stream

`stream.html` has a clearly-marked placeholder where the player goes. Paste your embed
(look for the HTML comment `<!-- PASTE EMBED HERE -->`):

- **YouTube Live:** `<iframe src="https://www.youtube.com/embed/live_stream?channel=CHANNEL_ID" …>`
- **Twitch:** `<iframe src="https://player.twitch.tv/?channel=YOURNAME&parent=yourdomain.com" …>`
- **Kick:** embed per Kick's docs.

The live-chat panel and "shop-the-stream" product rail are already built — viewers can
add to cart while the set rolls.

---

## ✉️ Wiring the contact form

`contact.html` is front-end only (shows a success message). To actually receive messages:
- **Formspree** (no server): set the form `action` to your Formspree endpoint + `method="post"`.
- Or a **mailto** fallback, or the same serverless approach as Stripe.
(Instructions are in an HTML comment inside `contact.html`.)

---

## 🎨 Brand system quick reference

| Color | Hex | Role |
|-------|-----|------|
| Void Black | `#05050a` | Background |
| Char | `#12121c` | Surfaces / cards |
| Ember Orange | `#ff5e1a` | Primary accent (fire) |
| Pepper Red | `#e11212` | Hot accent |
| Blue Flame | `#00b3ff` | Secondary (Blue-Flame Designs) |
| UV Green | `#39ff14` | Neon / blacklight pop |
| Plasma Purple | `#b026ff` | Trippy gradient |
| Bone | `#f5f0e6` | Text |

**Type:** Bebas Neue (display) · Rajdhani (body/UI) · Space Mono (labels/prices).
Full guidelines: **`brand-book/index.html`**.

---

🌶 *Built in fire. Wear the burn.*
