var DEMO_MSG = 'نسخة تجريبية: الطلب والتواصل معطّلان في هذه المعاينة العامة. Demo preview: ordering and contact are disabled.';
/* t4 «وردة ناعمة» — bottom-sheet nav + fullscreen cart. Arrow-function style. */
const CFG4 = { wa: '', shop: "معمل إبرة فن للخياطة النسائية", key: "cart_ibrat_fann_tailor" };
let cart4 = JSON.parse(localStorage.getItem(CFG4.key) || "[]");
const $id = (i) => document.getElementById(i);
const sar = (n) => n + " ر.س";

// nav: bottom sheet
const nav4 = $id("mainNav");
$id("menuToggle").addEventListener("click", () => nav4.classList.toggle("nav-up"));
nav4.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => nav4.classList.remove("nav-up")));

// cart: fullscreen
const setCart4 = (on) => {
  $id("cartDrawer").classList.toggle("cart-full", on);
  $id("cartOverlay").classList.toggle("open", on);
};
$id("cartBtn").onclick = () => setCart4(true);
$id("cartClose").onclick = () => setCart4(false);
$id("cartOverlay").onclick = () => setCart4(false);

const save4 = () => { localStorage.setItem(CFG4.key, JSON.stringify(cart4)); draw4(); };
const draw4 = () => {
  const count = cart4.reduce((a, c) => a + c.qty, 0);
  const total = cart4.reduce((a, c) => a + c.qty * c.price, 0);
  const badge = $id("cartCount");
  badge.textContent = count;
  badge.style.display = count ? "grid" : "none";
  $id("cartItems").innerHTML = cart4.length
    ? cart4.map((c, i) =>
        `<div class="cart-item"><div class="ci-body"><b>${c.name}</b><span class="ci-price">${sar(c.price)}</span></div>` +
        `<div class="qty-ctrl"><button data-step="-1" data-idx="${i}">−</button><span>${c.qty}</span><button data-step="1" data-idx="${i}">+</button></div>` +
        `<button class="ci-remove" data-idx="${i}">✕</button></div>`).join("")
    : '<p class="cart-empty">السلة فارغة — أضف ما يعجبك من القائمة.</p>';
  $id("cartTotal").textContent = sar(total);
};
const note4 = (m) => {
  const t = $id("toast");
  t.textContent = m; t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 2200);
};
document.addEventListener("click", (e) => {
  const add = e.target.closest(".add-btn");
  if (add) {
    const ex = cart4.find((c) => c.name === add.dataset.name);
    ex ? ex.qty++ : cart4.push({ name: add.dataset.name, price: parseFloat(add.dataset.price) || 0, qty: 1 });
    save4(); note4("أضيف إلى السلة: " + add.dataset.name); return;
  }
  const step = e.target.closest(".qty-ctrl button");
  if (step) {
    const it = cart4[+step.dataset.idx];
    it.qty += +step.dataset.step;
    if (it.qty < 1) cart4.splice(+step.dataset.idx, 1);
    save4(); return;
  }
  const rm = e.target.closest(".ci-remove");
  if (rm) { cart4.splice(+rm.dataset.idx, 1); save4(); return; }
  const g = e.target.closest(".gallink");
  if (g) { e.preventDefault(); $id("lbImg").src = g.getAttribute("href"); $id("lightbox").classList.add("open"); }
});
$id("lbClose").onclick = () => $id("lightbox").classList.remove("open");
$id("lightbox").onclick = (e) => { if (e.target.id === "lightbox") e.target.classList.remove("open"); };
$id("waFloat").onclick = () => alert(DEMO_MSG); /* DEMO_GUARD */
$id("orderForm").addEventListener("submit", (e) => {
  e.preventDefault();
  if (!cart4.length) return note4("السلة فارغة");
  const total = cart4.reduce((a, c) => a + c.qty * c.price, 0);
  let msg = "طلب جديد من موقع " + CFG4.shop + "\n\n";
  cart4.forEach((c) => { msg += `• ${c.name} × ${c.qty} — ${sar(c.qty * c.price)}\n`; });
  msg += `\nالإجمالي التقديري: ${sar(total)}\nالاسم: ${$id("custName").value.trim()}`;
  const notes = $id("custNotes").value.trim();
  if (notes) msg += "\nملاحظات: " + notes;
  msg += "\n\n(الأسعار تقديرية وتؤكدونها عند الرد)";
  alert(DEMO_MSG); /* DEMO_GUARD */
});
draw4();
