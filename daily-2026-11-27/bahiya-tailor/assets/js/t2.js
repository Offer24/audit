var DEMO_MSG = 'نسخة تجريبية: الطلب والتواصل معطّلان في هذه المعاينة العامة. Demo preview: ordering and contact are disabled.';
/* DEMO_GUARD */(function(){var _o=window.open;window.open=function(u){if(u&&String(u).indexOf('https://wa.me')===0){alert(DEMO_MSG);return null;}return _o.apply(window,arguments);};})();
/* t2 «نسيم أخضر» — side-drawer nav with scrim + bottom-sheet cart. Event-delegation style. */
const T2 = { wa: '', shop: "مشغل باهية خياطة", key: "cart_bahiya_tailor" };
const state = { cart: JSON.parse(localStorage.getItem(T2.key) || "[]") };
const q = (s) => document.querySelector(s);

/* nav: left side drawer + dynamically created scrim */
const scrim = document.createElement("div");
scrim.className = "navscrim";
document.body.appendChild(scrim);
function navSet(open) {
  q("#mainNav").classList.toggle("nav-in", open);
  scrim.classList.toggle("on", open);
  document.body.style.overflow = open ? "hidden" : "";
}
q("#menuToggle").addEventListener("click", () => navSet(!q("#mainNav").classList.contains("nav-in")));
scrim.addEventListener("click", () => navSet(false));
q("#mainNav").addEventListener("click", (e) => { if (e.target.closest("a")) navSet(false); });

/* cart: bottom sheet */
function sheetSet(open) {
  q("#cartDrawer").classList.toggle("sheet-up", open);
  q("#cartOverlay").classList.toggle("open", open);
}
q("#cartBtn").addEventListener("click", () => sheetSet(true));
q("#cartClose").addEventListener("click", () => sheetSet(false));
q("#cartOverlay").addEventListener("click", () => sheetSet(false));

const fmt = (n) => `${n} ر.س`;
function sync() {
  localStorage.setItem(T2.key, JSON.stringify(state.cart));
  const count = state.cart.reduce((a, c) => a + c.qty, 0);
  const total = state.cart.reduce((a, c) => a + c.qty * c.price, 0);
  const badge = q("#cartCount");
  badge.textContent = count; badge.style.display = count ? "grid" : "none";
  q("#cartItems").innerHTML = state.cart.length
    ? state.cart.map((c, i) => `<div class="cart-item"><div class="ci-body"><b>${c.name}</b><span class="ci-price">${fmt(c.price)}</span></div><div class="qty-ctrl"><button data-d="-1" data-i="${i}">−</button><span>${c.qty}</span><button data-d="1" data-i="${i}">+</button></div><button class="ci-remove" data-i="${i}">✕</button></div>`).join("")
    : '<p class="cart-empty">السلة فارغة — أضف ما يعجبك من القائمة.</p>';
  q("#cartTotal").textContent = fmt(total);
}
let toastTimer;
function ping(msg) {
  const t = q("#toast");
  t.textContent = msg; t.classList.add("show");
  clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove("show"), 2200);
}
document.body.addEventListener("click", (e) => {
  const add = e.target.closest(".add-btn");
  if (add) {
    const row = state.cart.find((c) => c.name === add.dataset.name);
    row ? row.qty++ : state.cart.push({ name: add.dataset.name, price: +add.dataset.price || 0, qty: 1 });
    sync(); ping("أضيف إلى السلة: " + add.dataset.name); return;
  }
  const qb = e.target.closest(".qty-ctrl button");
  if (qb) {
    const it = state.cart[+qb.dataset.i];
    it.qty += +qb.dataset.d;
    if (it.qty < 1) state.cart.splice(+qb.dataset.i, 1);
    sync(); return;
  }
  const rm = e.target.closest(".ci-remove");
  if (rm) { state.cart.splice(+rm.dataset.i, 1); sync(); return; }
  const gl = e.target.closest(".gallink");
  if (gl) { e.preventDefault(); q("#lbImg").src = gl.href; q("#lightbox").classList.add("open"); }
});
q("#lbClose").addEventListener("click", () => q("#lightbox").classList.remove("open"));
q("#lightbox").addEventListener("click", (e) => { if (e.target === e.currentTarget) e.currentTarget.classList.remove("open"); });
q("#waFloat").addEventListener("click", () => window.open(`https://wa.me/${T2.wa}`, "_blank"));
q("#orderForm").addEventListener("submit", (e) => {
  e.preventDefault();
  if (!state.cart.length) return ping("السلة فارغة");
  const total = state.cart.reduce((a, c) => a + c.qty * c.price, 0);
  const lines = state.cart.map((c) => `• ${c.name} × ${c.qty} — ${fmt(c.qty * c.price)}`);
  let msg = `طلب جديد من موقع ${T2.shop}\n\n${lines.join("\n")}\n\nالإجمالي التقديري: ${fmt(total)}\nالاسم: ${q("#custName").value.trim()}`;
  const notes = q("#custNotes").value.trim();
  if (notes) msg += `\nملاحظات: ${notes}`;
  msg += "\n\n(الأسعار تقديرية وتؤكدونها عند الرد)";
  window.open(`https://wa.me/${T2.wa}?text=${encodeURIComponent(msg)}`, "_blank");
});
sync();
