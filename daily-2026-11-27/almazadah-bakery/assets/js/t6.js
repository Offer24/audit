var DEMO_MSG = "نسخة تجريبية: الطلب والتواصل معطّلان في هذه المعاينة العامة. Demo preview: ordering and contact are disabled.";
/* t6 «دفء الطين» — bottom dock nav (no toggle) + bottom-sheet cart. Minimal procedural style. */
var WA_DEAD = \"\", SHOP6 = "المزادة بيكري", KEY6 = "cart_almazadah_bakery";
var cart6 = JSON.parse(localStorage.getItem(KEY6) || "[]");

function g6(i) { return document.getElementById(i); }
function money6(n) { return n + " ر.س"; }
function toast6(m) {
  var t = g6("toast");
  t.textContent = m; t.classList.add("show");
  setTimeout(function () { t.classList.remove("show"); }, 2200);
}
function sheet6(on) {
  g6("cartDrawer").classList.toggle("sheet-up", on);
  g6("cartOverlay").classList.toggle("open", on);
}
g6("cartBtn").onclick = function () { sheet6(true); };
g6("cartClose").onclick = function () { sheet6(false); };
g6("cartOverlay").onclick = function () { sheet6(false); };
/* dock nav: always visible on mobile; still close any state on tap for safety */
g6("mainNav").addEventListener("click", function () { g6("mainNav").classList.remove("nav-open"); });

function paint6() {
  var count = 0, total = 0, html = "";
  cart6.forEach(function (c, i) {
    count += c.qty; total += c.qty * c.price;
    html += '<div class="cart-item"><div class="ci-body"><b>' + c.name + '</b><span class="ci-price">' + money6(c.price) + '</span></div>' +
      '<div class="qty-ctrl"><button data-x="-1" data-p="' + i + '">−</button><span>' + c.qty + '</span><button data-x="1" data-p="' + i + '">+</button></div>' +
      '<button class="ci-remove" data-p="' + i + '">✕</button></div>';
  });
  if (!cart6.length) html = '<p class="cart-empty">السلة فارغة — أضف ما يعجبك من القائمة.</p>';
  g6("cartItems").innerHTML = html;
  g6("cartTotal").textContent = money6(total);
  var b = g6("cartCount");
  b.textContent = count; b.style.display = count ? "grid" : "none";
  localStorage.setItem(KEY6, JSON.stringify(cart6));
}
document.addEventListener("click", function (e) {
  var add = e.target.closest(".add-btn");
  if (add) {
    var ex = null;
    cart6.forEach(function (c) { if (c.name === add.getAttribute("data-name")) ex = c; });
    if (ex) ex.qty++; else cart6.push({ name: add.getAttribute("data-name"), price: parseFloat(add.getAttribute("data-price")) || 0, qty: 1 });
    paint6(); toast6("أضيف إلى السلة: " + add.getAttribute("data-name")); return;
  }
  var q = e.target.closest(".qty-ctrl button");
  if (q) {
    var it = cart6[+q.getAttribute("data-p")];
    it.qty += +q.getAttribute("data-x");
    if (it.qty < 1) cart6.splice(+q.getAttribute("data-p"), 1);
    paint6(); return;
  }
  var rm = e.target.closest(".ci-remove");
  if (rm) { cart6.splice(+rm.getAttribute("data-p"), 1); paint6(); return; }
  var gl = e.target.closest(".gallink");
  if (gl) { e.preventDefault(); g6("lbImg").src = gl.getAttribute("href"); g6("lightbox").classList.add("open"); }
});
g6("lbClose").onclick = function () { g6("lightbox").classList.remove("open"); };
g6("lightbox").onclick = function (e) { if (e.target.id === "lightbox") e.target.classList.remove("open"); };
g6("waFloat").onclick = function () { alert(DEMO_MSG); /* DEMO_GUARD */ };
g6("orderForm").addEventListener("submit", function (e) {
  e.preventDefault();
  if (!cart6.length) { toast6("السلة فارغة"); return; }
  var total = 0, msg = "طلب جديد من موقع " + SHOP6 + "\n\n";
  cart6.forEach(function (c) { msg += "• " + c.name + " × " + c.qty + " — " + money6(c.qty * c.price) + "\n"; total += c.qty * c.price; });
  msg += "\nالإجمالي التقديري: " + money6(total) + "\nالاسم: " + g6("custName").value.trim();
  var notes = g6("custNotes").value.trim();
  if (notes) msg += "\nملاحظات: " + notes;
  msg += "\n\n(الأسعار تقديرية وتؤكدونها عند الرد)";
  alert(DEMO_MSG); /* DEMO_GUARD */
});
paint6();
