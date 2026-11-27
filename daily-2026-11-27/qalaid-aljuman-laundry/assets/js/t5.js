/* t5 «تقني» — dropdown grid nav + fullscreen cart. IIFE module with tiny pub-style API. */
const Site5 = (() => {
  const WA = "966504641226", SHOP = "مغاسل قلائد الجمان", KEY = "cart_qalaid_aljuman_laundry";
  const store = {
    read() { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) { return []; } },
    write(v) { localStorage.setItem(KEY, JSON.stringify(v)); }
  };
  let cart = store.read();
  const byId = (i) => document.getElementById(i);
  const price = (n) => n + " ر.س";

  const nav = {
    el: null,
    open() { this.el.classList.add("nav-drop-open"); },
    close() { this.el.classList.remove("nav-drop-open"); },
    toggle() { this.el.classList.contains("nav-drop-open") ? this.close() : this.open(); },
    init() {
      this.el = byId("mainNav");
      byId("menuToggle").addEventListener("click", () => this.toggle());
      this.el.addEventListener("click", (e) => { if (e.target.closest("a")) this.close(); });
    }
  };

  const cartUI = {
    open() { byId("cartDrawer").classList.add("cart-full"); byId("cartOverlay").classList.add("open"); },
    close() { byId("cartDrawer").classList.remove("cart-full"); byId("cartOverlay").classList.remove("open"); }
  };

  function render() {
    const count = cart.reduce((a, c) => a + c.qty, 0);
    const total = cart.reduce((a, c) => a + c.qty * c.price, 0);
    const badge = byId("cartCount");
    badge.textContent = count;
    badge.style.display = count ? "grid" : "none";
    byId("cartItems").innerHTML = !cart.length
      ? '<p class="cart-empty">السلة فارغة — أضف ما يعجبك من القائمة.</p>'
      : cart.map((c, i) => '<div class="cart-item"><div class="ci-body"><b>' + c.name + '</b><span class="ci-price">' + price(c.price) + '</span></div>' +
          '<div class="qty-ctrl"><button data-m="-1" data-k="' + i + '">−</button><span>' + c.qty + '</span><button data-m="1" data-k="' + i + '">+</button></div>' +
          '<button class="ci-remove" data-k="' + i + '">✕</button></div>').join("");
    byId("cartTotal").textContent = price(total);
  }
  function commit() { store.write(cart); render(); }
  function flash(msg) {
    const t = byId("toast");
    t.textContent = msg; t.classList.add("show");
    setTimeout(() => t.classList.remove("show"), 2200);
  }

  function onClick(e) {
    const add = e.target.closest(".add-btn");
    if (add) {
      const hit = cart.find((c) => c.name === add.dataset.name);
      if (hit) hit.qty++; else cart.push({ name: add.dataset.name, price: Number(add.dataset.price) || 0, qty: 1 });
      commit(); flash("أضيف إلى السلة: " + add.dataset.name); return;
    }
    const mod = e.target.closest(".qty-ctrl button");
    if (mod) {
      const it = cart[+mod.dataset.k];
      it.qty += +mod.dataset.m;
      if (it.qty < 1) cart.splice(+mod.dataset.k, 1);
      commit(); return;
    }
    const del = e.target.closest(".ci-remove");
    if (del) { cart.splice(+del.dataset.k, 1); commit(); return; }
    const g = e.target.closest(".gallink");
    if (g) { e.preventDefault(); byId("lbImg").src = g.getAttribute("href"); byId("lightbox").classList.add("open"); }
  }

  function checkout(e) {
    e.preventDefault();
    if (!cart.length) return flash("السلة فارغة");
    const total = cart.reduce((a, c) => a + c.qty * c.price, 0);
    const body = cart.map((c) => "• " + c.name + " × " + c.qty + " — " + price(c.qty * c.price)).join("\n");
    let msg = "طلب جديد من موقع " + SHOP + "\n\n" + body + "\n\nالإجمالي التقديري: " + price(total) + "\nالاسم: " + byId("custName").value.trim();
    const notes = byId("custNotes").value.trim();
    if (notes) msg += "\nملاحظات: " + notes;
    msg += "\n\n(الأسعار تقديرية وتؤكدونها عند الرد)";
    window.open("https://wa.me/" + WA + "?text=" + encodeURIComponent(msg), "_blank");
  }

  function init() {
    nav.init();
    byId("cartBtn").addEventListener("click", cartUI.open);
    byId("cartClose").addEventListener("click", cartUI.close);
    byId("cartOverlay").addEventListener("click", cartUI.close);
    document.addEventListener("click", onClick);
    byId("lbClose").addEventListener("click", () => byId("lightbox").classList.remove("open"));
    byId("lightbox").addEventListener("click", (e) => { if (e.target.id === "lightbox") e.target.classList.remove("open"); });
    byId("waFloat").addEventListener("click", () => window.open("https://wa.me/" + WA, "_blank"));
    byId("orderForm").addEventListener("submit", checkout);
    render();
  }
  return { init };
})();
Site5.init();
