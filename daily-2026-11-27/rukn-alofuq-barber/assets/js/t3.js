var DEMO_MSG = 'نسخة تجريبية: الطلب والتواصل معطّلان في هذه المعاينة العامة. Demo preview: ordering and contact are disabled.';
/* DEMO_GUARD */(function(){var _o=window.open;window.open=function(u){if(u&&String(u).indexOf('https://wa.me')===0){alert(DEMO_MSG);return null;}return _o.apply(window,arguments);};})();
/* t3 «صلابة» — fullscreen overlay nav + side cart drawer. Object-literal app style. */
var App3 = {
  wa: '', shop: "حلاق ركن الٱفق", key: "cart_rukn_alofuq_barber",
  cart: [],
  init: function () {
    try { this.cart = JSON.parse(localStorage.getItem(this.key) || "[]"); } catch (e) { this.cart = []; }
    this.bindNav(); this.bindCart(); this.bindGallery(); this.render();
  },
  $: function (id) { return document.getElementById(id); },
  fmt: function (n) { return n + " ر.س"; },

  bindNav: function () {
    var self = this, nav = this.$("mainNav");
    this.$("menuToggle").addEventListener("click", function () {
      var open = nav.classList.toggle("nav-full-open");
      document.body.style.overflow = open ? "hidden" : "";
    });
    nav.addEventListener("click", function (e) {
      if (e.target.tagName === "A") { nav.classList.remove("nav-full-open"); document.body.style.overflow = ""; }
    });
  },

  bindCart: function () {
    var self = this;
    this.$("cartBtn").addEventListener("click", function () { self.cartUI(true); });
    this.$("cartClose").addEventListener("click", function () { self.cartUI(false); });
    this.$("cartOverlay").addEventListener("click", function () { self.cartUI(false); });
    document.addEventListener("click", function (e) { self.onDocClick(e); });
    this.$("orderForm").addEventListener("submit", function (e) { self.submit(e); });
  },
  cartUI: function (open) {
    this.$("cartDrawer").classList.toggle("open", open);
    this.$("cartOverlay").classList.toggle("open", open);
  },
  onDocClick: function (e) {
    var add = e.target.closest(".add-btn");
    if (add) { this.addItem(add.getAttribute("data-name"), parseFloat(add.getAttribute("data-price")) || 0); return; }
    var qb = e.target.closest(".qty-ctrl button");
    if (qb) { this.bump(+qb.getAttribute("data-i"), +qb.getAttribute("data-d")); return; }
    var rm = e.target.closest(".ci-remove");
    if (rm) { this.cart.splice(+rm.getAttribute("data-i"), 1); this.save(); }
  },
  addItem: function (name, price) {
    for (var i = 0; i < this.cart.length; i++) if (this.cart[i].name === name) { this.cart[i].qty++; this.save(); this.toast("أضيف إلى السلة: " + name); return; }
    this.cart.push({ name: name, price: price, qty: 1 });
    this.save(); this.toast("أضيف إلى السلة: " + name);
  },
  bump: function (i, d) {
    this.cart[i].qty += d;
    if (this.cart[i].qty < 1) this.cart.splice(i, 1);
    this.save();
  },
  save: function () { localStorage.setItem(this.key, JSON.stringify(this.cart)); this.render(); },
  render: function () {
    var n = 0, total = 0, html = "", i;
    for (i = 0; i < this.cart.length; i++) { n += this.cart[i].qty; total += this.cart[i].qty * this.cart[i].price; }
    var badge = this.$("cartCount");
    badge.textContent = n; badge.style.display = n ? "grid" : "none";
    if (!this.cart.length) html = '<p class="cart-empty">السلة فارغة — أضف ما يعجبك من القائمة.</p>';
    else for (i = 0; i < this.cart.length; i++)
      html += '<div class="cart-item"><div class="ci-body"><b>' + this.cart[i].name + '</b><span class="ci-price">' + this.fmt(this.cart[i].price) + '</span></div>'
        + '<div class="qty-ctrl"><button data-d="-1" data-i="' + i + '">−</button><span>' + this.cart[i].qty + '</span><button data-d="1" data-i="' + i + '">+</button></div>'
        + '<button class="ci-remove" data-i="' + i + '">✕</button></div>';
    this.$("cartItems").innerHTML = html;
    this.$("cartTotal").textContent = this.fmt(total);
  },
  bindGallery: function () {
    var self = this;
    document.addEventListener("click", function (e) {
      var g = e.target.closest(".gallink");
      if (g) { e.preventDefault(); self.$("lbImg").src = g.getAttribute("href"); self.$("lightbox").classList.add("open"); }
    });
    this.$("lbClose").addEventListener("click", function () { self.$("lightbox").classList.remove("open"); });
    this.$("lightbox").addEventListener("click", function (e) { if (e.target.id === "lightbox") e.target.classList.remove("open"); });
    this.$("waFloat").addEventListener("click", function () { window.open("https://wa.me/" + self.wa, "_blank"); });
  },
  toast: function (msg) {
    var t = this.$("toast");
    t.textContent = msg; t.classList.add("show");
    setTimeout(function () { t.classList.remove("show"); }, 2200);
  },
  submit: function (e) {
    e.preventDefault();
    if (!this.cart.length) { this.toast("السلة فارغة"); return; }
    var total = 0, msg = "طلب جديد من موقع " + this.shop + "\n\n", i;
    for (i = 0; i < this.cart.length; i++) { msg += "• " + this.cart[i].name + " × " + this.cart[i].qty + " — " + this.fmt(this.cart[i].qty * this.cart[i].price) + "\n"; total += this.cart[i].qty * this.cart[i].price; }
    msg += "\nالإجمالي التقديري: " + this.fmt(total) + "\nالاسم: " + this.$("custName").value.trim();
    var notes = this.$("custNotes").value.trim(); if (notes) msg += "\nملاحظات: " + notes;
    msg += "\n\n(الأسعار تقديرية وتؤكدونها عند الرد)";
    window.open("https://wa.me/" + this.wa + "?text=" + encodeURIComponent(msg), "_blank");
  }
};
App3.init();
