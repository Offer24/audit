var DEMO_MSG = 'نسخة تجريبية: الطلب والتواصل معطّلان في هذه المعاينة العامة. Demo preview: ordering and contact are disabled.';
/* DEMO_GUARD */(function(){var _o=window.open;window.open=function(u){if(u&&String(u).indexOf('https://wa.me')===0){alert(DEMO_MSG);return null;}return _o.apply(window,arguments);};})();
/* t1 «ليل وذهب» — slide-down nav panel + side cart drawer. Classic function style. */
(function () {
  var WA_DEAD = '', SHOP = "ناظر تشوكلت", KEY = "cart_moule_chocolate";
  var cart = [];
  try { cart = JSON.parse(localStorage.getItem(KEY) || "[]"); } catch (e) {}

  function el(id) { return document.getElementById(id); }
  function money(n) { return n + " ر.س"; }

  /* --- nav: slide-down panel --- */
  var nav = el("mainNav"), toggle = el("menuToggle");
  function closeNav() { nav.classList.remove("nav-open"); }
  toggle.addEventListener("click", function () { nav.classList.toggle("nav-open"); });
  nav.addEventListener("click", function (e) { if (e.target.tagName === "A") closeNav(); });

  /* --- cart drawer --- */
  var drawer = el("cartDrawer"), overlay = el("cartOverlay");
  function openCart() { drawer.classList.add("open"); overlay.classList.add("open"); }
  function closeCart() { drawer.classList.remove("open"); overlay.classList.remove("open"); }
  el("cartBtn").addEventListener("click", openCart);
  el("cartClose").addEventListener("click", closeCart);
  overlay.addEventListener("click", closeCart);

  function persist() { localStorage.setItem(KEY, JSON.stringify(cart)); paint(); }
  function paint() {
    var items = el("cartItems"), n = 0, total = 0, i, html = "";
    for (i = 0; i < cart.length; i++) { n += cart[i].qty; total += cart[i].qty * cart[i].price; }
    var badge = el("cartCount");
    badge.textContent = n; badge.style.display = n ? "grid" : "none";
    if (!cart.length) { html = '<p class="cart-empty">السلة فارغة — أضف ما يعجبك من القائمة.</p>'; }
    else for (i = 0; i < cart.length; i++) {
      html += '<div class="cart-item"><div class="ci-body"><b>' + cart[i].name + '</b><span class="ci-price">' + money(cart[i].price) + '</span></div>'
        + '<div class="qty-ctrl"><button data-act="dec" data-i="' + i + '">−</button><span>' + cart[i].qty + '</span><button data-act="inc" data-i="' + i + '">+</button></div>'
        + '<button class="ci-remove" data-i="' + i + '">✕</button></div>';
    }
    items.innerHTML = html;
    el("cartTotal").textContent = money(total);
  }
  function notify(msg) {
    var t = el("toast"); t.textContent = msg; t.classList.add("show");
    setTimeout(function () { t.classList.remove("show"); }, 2200);
  }

  document.addEventListener("click", function (e) {
    var b = e.target.closest(".add-btn");
    if (b) {
      var found = null;
      for (var i = 0; i < cart.length; i++) if (cart[i].name === b.getAttribute("data-name")) found = cart[i];
      if (found) found.qty++; else cart.push({ name: b.getAttribute("data-name"), price: parseFloat(b.getAttribute("data-price")) || 0, qty: 1 });
      persist(); notify("أضيف إلى السلة: " + b.getAttribute("data-name")); return;
    }
    var q = e.target.closest(".qty-ctrl button");
    if (q) { var it = cart[+q.getAttribute("data-i")]; it.qty += q.getAttribute("data-act") === "inc" ? 1 : -1; if (it.qty < 1) cart.splice(+q.getAttribute("data-i"), 1); persist(); return; }
    var r = e.target.closest(".ci-remove");
    if (r) { cart.splice(+r.getAttribute("data-i"), 1); persist(); return; }
    var g = e.target.closest(".gallink");
    if (g) { e.preventDefault(); el("lbImg").src = g.getAttribute("href"); el("lightbox").classList.add("open"); }
  });
  el("lbClose").addEventListener("click", function () { el("lightbox").classList.remove("open"); });
  el("lightbox").addEventListener("click", function (e) { if (e.target.id === "lightbox") e.target.classList.remove("open"); });
  el("waFloat").addEventListener("click", function () { window.open("https://wa.me/" + WA, "_blank"); });

  el("orderForm").addEventListener("submit", function (e) {
    e.preventDefault();
    if (!cart.length) { notify("السلة فارغة"); return; }
    var total = 0, msg = "طلب جديد من موقع " + SHOP + "\n\n";
    for (var i = 0; i < cart.length; i++) { msg += "• " + cart[i].name + " × " + cart[i].qty + " — " + money(cart[i].qty * cart[i].price) + "\n"; total += cart[i].qty * cart[i].price; }
    msg += "\nالإجمالي التقديري: " + money(total) + "\nالاسم: " + el("custName").value.trim();
    var notes = el("custNotes").value.trim(); if (notes) msg += "\nملاحظات: " + notes;
    msg += "\n\n(الأسعار تقديرية وتؤكدونها عند الرد)";
    window.open("https://wa.me/" + WA + "?text=" + encodeURIComponent(msg), "_blank");
  });
  paint();
})();
