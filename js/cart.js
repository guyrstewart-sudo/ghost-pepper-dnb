/* =====================================================================
   GHOST PEPPER — Cart (localStorage) + Stripe checkout STUB
   ---------------------------------------------------------------------
   Front-end cart for GitHub Pages (static). When Lily is ready to take
   real payments, swap stripeCheckout() for Stripe Payment Links or a
   serverless Checkout Session. See README for the exact wiring.
   ===================================================================== */
(function (global) {
  const KEY = 'gp_cart_v1';

  const read = () => { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch { return []; } };
  const write = (c) => { localStorage.setItem(KEY, JSON.stringify(c)); render(); };

  const fmt = (n) => '$' + n.toFixed(2);

  function add(item) {
    const cart = read();
    const id = item.id + '|' + (item.size || 'OS');
    const found = cart.find(i => i.key === id);
    if (found) found.qty += (item.qty || 1);
    else cart.push({ key: id, id: item.id, name: item.name, price: item.price, size: item.size || 'OS', qty: item.qty || 1 });
    write(cart);
    toast(`Added · ${item.name}${item.size ? ' ('+item.size+')' : ''}`);
  }
  function setQty(key, qty) {
    let cart = read();
    cart = cart.map(i => i.key === key ? { ...i, qty: Math.max(0, qty) } : i).filter(i => i.qty > 0);
    write(cart);
  }
  function remove(key) { write(read().filter(i => i.key !== key)); }
  function clear() { write([]); }
  const count = () => read().reduce((n, i) => n + i.qty, 0);
  const total = () => read().reduce((s, i) => s + i.price * i.qty, 0);

  /* ---- Stripe checkout STUB ----
     Replace the body with one of:
     (A) Stripe Payment Links: map each item.id -> a payment link URL.
     (B) Stripe Checkout Session via serverless fn (Netlify/Vercel/Workers).
  */
  function stripeCheckout() {
    const items = read();
    if (!items.length) { toast('Your cart is empty'); return; }
    const summary = items.map(i => `${i.qty}× ${i.name} (${i.size}) — ${fmt(i.price * i.qty)}`).join('\n');
    alert(
      'GHOST PEPPER — Checkout (DEMO)\n' +
      '────────────────────────────\n' +
      summary +
      `\n────────────────────────────\nTOTAL: ${fmt(total())}\n\n` +
      'Stripe is not live yet. See README.md → "Going live with Stripe"\n' +
      'to connect Payment Links or a Checkout Session.'
    );
  }

  /* ---- Render: cart count badges + drawer (if present) ---- */
  function render() {
    document.querySelectorAll('[data-cart-count]').forEach(el => {
      el.textContent = count();
      el.style.display = count() ? '' : '';
    });
    const drawer = document.querySelector('[data-cart-items]');
    if (drawer) {
      const items = read();
      drawer.innerHTML = items.length ? items.map(i => `
        <div class="cart-row">
          <div>
            <div class="cart-row__name">${i.name}</div>
            <div class="cart-row__meta">${i.size} · ${fmt(i.price)}</div>
          </div>
          <div class="cart-row__qty">
            <button aria-label="decrease" data-qty-dec="${i.key}">−</button>
            <span>${i.qty}</span>
            <button aria-label="increase" data-qty-inc="${i.key}">+</button>
          </div>
          <button class="cart-row__rm" aria-label="remove" data-rm="${i.key}">✕</button>
        </div>`).join('') : '<p class="cart-empty">Cart is empty — go grab some heat. 🌶</p>';
      const tot = document.querySelector('[data-cart-total]');
      if (tot) tot.textContent = fmt(total());
    }
  }

  /* ---- Toast ---- */
  let toastEl;
  function toast(msg) {
    if (!toastEl) {
      toastEl = document.createElement('div');
      toastEl.className = 'gp-toast';
      document.body.appendChild(toastEl);
    }
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toast._t);
    toast._t = setTimeout(() => toastEl.classList.remove('show'), 2200);
  }

  /* ---- Event delegation ---- */
  document.addEventListener('click', (e) => {
    const a = e.target.closest('[data-add]');
    if (a) {
      e.preventDefault();
      const card = a.closest('[data-product]') || a;
      const sizeSel = card.querySelector('[data-size]');
      add({
        id: a.dataset.add || card.dataset.product,
        name: a.dataset.name || card.dataset.name,
        price: parseFloat(a.dataset.price || card.dataset.price),
        size: sizeSel ? sizeSel.value : (a.dataset.size || 'OS')
      });
    }
    const inc = e.target.closest('[data-qty-inc]'); if (inc) setQty(inc.dataset.qtyInc, qtyOf(inc.dataset.qtyInc) + 1);
    const dec = e.target.closest('[data-qty-dec]'); if (dec) setQty(dec.dataset.qtyDec, qtyOf(dec.dataset.qtyDec) - 1);
    const rm  = e.target.closest('[data-rm]');      if (rm)  remove(rm.dataset.rm);
    if (e.target.closest('[data-checkout]')) { e.preventDefault(); stripeCheckout(); }
    if (e.target.closest('[data-cart-open]'))  document.querySelector('[data-cart-drawer]')?.classList.add('open');
    if (e.target.closest('[data-cart-close]')) document.querySelector('[data-cart-drawer]')?.classList.remove('open');
  });
  const qtyOf = (key) => (read().find(i => i.key === key)?.qty || 0);

  global.GPCart = { add, remove, setQty, clear, count, total, checkout: stripeCheckout, items: read };
  document.addEventListener('DOMContentLoaded', render);
})(window);
