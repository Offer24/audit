/* ورد الشيم | Sheam Flower — cart + WhatsApp ordering */
(function () {
  'use strict';

  var WA_NUMBER = '966500239888';
  var SHOP_NAME = 'ورد الشيم';

  var PRODUCTS = [
    { id: 'p01', name: 'باقة الورد الأحمر الملكية', price: 250, img: 'assets/img/bouquet-red.jpg',
      desc: 'باقة ورد أحمر فاخرة ملفوفة بورق أبيض أنيق، مثالية للاعتراف والمناسبات الرومانسية.', tag: 'الأكثر طلباً' },
    { id: 'p02', name: 'باقة الباستيل الناعمة', price: 220, img: 'assets/img/bouquet-pastel.jpg',
      desc: 'مزيج ورد كريمي وردي مع لمسات خضراء وتغليف بنفسجي راقٍ.' },
    { id: 'p03', name: 'صندوق الورد الذهبي', price: 280, img: 'assets/img/gift-yellow-bag.jpg',
      desc: 'صندوق أصفر مميز ممتلئ بالورد الوردي الطبيعي، هدية تترك انطباعاً لا يُنسى.', tag: 'هدية مميزة' },
    { id: 'p04', name: 'سلة الورد الريفية', price: 260, img: 'assets/img/basket-kraft.jpg',
      desc: 'سلة كرافت أنيقة بورد أحمر ووردي مع إضاءة داخلية وزخارف خضراء.' },
    { id: 'p05', name: 'باقة اللافندر والأبيض', price: 240, img: 'assets/img/bouquet-lavender.jpg',
      desc: 'ورد أبيض ناعم مع لمسات لافندر بنفسجية في تغليف هندسي عصري.' },
    { id: 'p06', name: 'باقة شمس الصباح', price: 190, img: 'assets/img/bouquet-orange.jpg',
      desc: 'ورد برتقالي وأصفر مشرق مع كرت إهداء شخصي، تفاؤل يوصل لباب البيت.' },
    { id: 'p07', name: 'هدية الورد مع شنطة براند', price: 450, img: 'assets/img/gift-brand-bag.jpg',
      desc: 'تنسيق ورد أبيض فاخر مع شنطة براند عالمي، الهدية الكاملة للمناسبات الكبيرة.', tag: 'فاخر' },
    { id: 'p08', name: 'تنسيق كوشة أفراح', price: 1500, priceFrom: true, img: 'assets/img/gift-wall.jpg',
      desc: 'تصميم وتنفيذ كوشة العروس بورد طبيعي حسب ثيم الحفلة وألوانها.' },
    { id: 'p09', name: 'طاولات ملك واستقبال', price: 600, priceFrom: true, img: 'assets/img/interior-1.jpg',
      desc: 'تجهيز طاولات الملك والاستقبال بتنسيقات ورد طبيعية فاخرة للمناسبات.' },
    { id: 'p10', name: 'دروع وتكريم مخصصة', price: 180, priceFrom: true, img: 'assets/img/shelves.jpg',
      desc: 'دروع تكريم أنيقة مع تغليف فاخر وعبارات مخصصة للمكرَّمين.' },
    { id: 'p11', name: 'تغليف هدايا فاخر', price: 30, priceFrom: true, img: 'assets/img/interior-2.jpg',
      desc: 'تغليف احترافي لهداياكم بخامات راقية ولمسات ورد الشيم الخاصة.' },
    { id: 'p12', name: 'باقة مفاجأة على ذوقنا', price: 200, priceFrom: true, img: 'assets/img/entrance.jpg',
      desc: 'قولولنا المناسبة والميزانية، وفريقنا ينسق لكم باقة تفاجئ صاحبها.' }
  ];

  /* ---------- storage ---------- */
  function getCart() {
    try { return JSON.parse(localStorage.getItem('sheam_cart') || '[]'); }
    catch (e) { return []; }
  }
  function saveCart(c) { localStorage.setItem('sheam_cart', JSON.stringify(c)); updateBadge(); }

  /* ---------- cart ops ---------- */
  function addToCart(id) {
    var cart = getCart();
    var line = cart.find(function (l) { return l.id === id; });
    if (line) line.qty += 1; else cart.push({ id: id, qty: 1 });
    saveCart(cart);
    var p = PRODUCTS.find(function (x) { return x.id === id; });
    toast('أُضيفت «' + p.name + '» إلى الطلب ✓');
    renderCartItems();
  }
  function setQty(id, qty) {
    var cart = getCart();
    var line = cart.find(function (l) { return l.id === id; });
    if (!line) return;
    line.qty = qty;
    if (line.qty <= 0) cart = cart.filter(function (l) { return l.id !== id; });
    saveCart(cart); renderCartItems();
  }
  function cartTotal() {
    return getCart().reduce(function (s, l) {
      var p = PRODUCTS.find(function (x) { return x.id === l.id; });
      return p ? s + p.price * l.qty : s;
    }, 0);
  }

  /* ---------- UI ---------- */
  function updateBadge() {
    var n = getCart().reduce(function (s, l) { return s + l.qty; }, 0);
    document.querySelectorAll('.cart-count').forEach(function (b) {
      b.textContent = n; b.style.display = n ? 'grid' : 'none';
    });
  }
  function toast(msg) {
    var t = document.querySelector('.toast');
    if (!t) { t = document.createElement('div'); t.className = 'toast'; document.body.appendChild(t); }
    t.textContent = msg; t.classList.add('show');
    clearTimeout(t._h); t._h = setTimeout(function () { t.classList.remove('show'); }, 2200);
  }

  function renderCartItems() {
    var box = document.getElementById('cartItems');
    if (!box) return;
    var cart = getCart();
    if (!cart.length) {
      box.innerHTML = '<div class="cart-empty">🌷<br>طلبك فارغ حالياً<br><small>تصفح الباقات وأضف ما يعجبك</small></div>';
    } else {
      box.innerHTML = cart.map(function (l) {
        var p = PRODUCTS.find(function (x) { return x.id === l.id; });
        if (!p) return '';
        return '<div class="cart-item">' +
          '<img src="' + relRoot() + p.img + '" alt="' + p.name + '">' +
          '<div class="ci-body"><b>' + p.name + '</b>' +
          '<span class="ci-price">' + p.price + ' ر.س' + (p.priceFrom ? ' (يبدأ من)' : '') + '</span>' +
          '<div class="qty-ctrl">' +
          '<button type="button" onclick="SheamCart.setQty(\'' + p.id + '\',' + (l.qty + 1) + ')">+</button>' +
          '<span>' + l.qty + '</span>' +
          '<button type="button" onclick="SheamCart.setQty(\'' + p.id + '\',' + (l.qty - 1) + ')">−</button>' +
          '</div></div>' +
          '<button type="button" class="ci-remove" onclick="SheamCart.setQty(\'' + p.id + '\',0)" title="حذف">🗑</button>' +
          '</div>';
      }).join('');
    }
    var totalEl = document.getElementById('cartTotal');
    if (totalEl) totalEl.textContent = cartTotal() + ' ر.س';
  }

  function relRoot() {
    return document.body.getAttribute('data-root') || '';
  }

  /* ---------- WhatsApp checkout ---------- */
  function checkout(ev) {
    ev.preventDefault();
    var cart = getCart();
    if (!cart.length) { toast('أضف منتجاً واحداً على الأقل قبل إرسال الطلب'); return false; }
    var f = ev.target;
    var name = (f.cname.value || '').trim();
    var area = (f.area.value || '').trim();
    var when = (f.wdate.value || '').trim();
    var notes = (f.notes.value || '').trim();

    var lines = ['السلام عليكم ' + SHOP_NAME + '🌷', 'أود إرسال طلب جديد من الموقع:', ''];
    cart.forEach(function (l, i) {
      var p = PRODUCTS.find(function (x) { return x.id === l.id; });
      if (!p) return;
      lines.push((i + 1) + '. ' + p.name + ' × ' + l.qty + ' = ' + (p.price * l.qty) + ' ر.س' + (p.priceFrom ? ' (سعر يبدأ من)' : ''));
    });
    lines.push('');
    lines.push('الإجمالي التقريبي: ' + cartTotal() + ' ر.س');
    if (name) lines.push('الاسم: ' + name);
    if (area) lines.push('الحي / منطقة التوصيل: ' + area);
    if (when) lines.push('موعد التوصيل المطلوب: ' + when);
    if (notes) lines.push('ملاحظات: ' + notes);
    lines.push('', 'شكراً لكم 🌹');

    var url = 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(lines.join('\n'));
    window.open(url, '_blank');
    return false;
  }

  function quickOrder(id) {
    var p = PRODUCTS.find(function (x) { return x.id === id; });
    var msg = 'السلام عليكم ' + SHOP_NAME + '🌷\nأستفسر عن: ' + p.name + ' (' + p.price + ' ر.س' + (p.priceFrom ? ' - يبدأ من' : '') + ')\nهل هو متوفر اليوم؟';
    window.open('https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(msg), '_blank');
  }

  /* ---------- render product cards ---------- */
  function productCard(p) {
    return '<article class="product-card">' +
      '<div class="product-media"><img loading="lazy" src="' + relRoot() + p.img + '" alt="' + p.name + ' - ورد الشيم أبها">' +
      (p.tag ? '<span class="product-tag">' + p.tag + '</span>' : '') + '</div>' +
      '<div class="product-body"><h3>' + p.name + '</h3><p>' + p.desc + '</p>' +
      '<div class="product-foot">' +
      '<span class="price">' + (p.priceFrom ? 'من ' : '') + p.price + ' <small>ر.س</small></span>' +
      '<span>' +
      '<button type="button" class="add-btn" onclick="SheamCart.add(\'' + p.id + '\')">🛒 أضف</button> ' +
      '<button type="button" class="add-btn" style="background:var(--whatsapp);color:#fff" onclick="SheamCart.quick(\'' + p.id + '\')">واتساب</button>' +
      '</span></div></div></article>';
  }

  function renderProducts() {
    var all = document.getElementById('allProducts');
    if (all) all.innerHTML = PRODUCTS.map(productCard).join('');
    var feat = document.getElementById('featuredProducts');
    if (feat) feat.innerHTML = PRODUCTS.slice(0, 4).map(productCard).join('');
  }

  /* ---------- drawer ---------- */
  function openCart() {
    renderCartItems();
    document.getElementById('cartDrawer').classList.add('open');
    document.getElementById('cartOverlay').classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeCart() {
    document.getElementById('cartDrawer').classList.remove('open');
    document.getElementById('cartOverlay').classList.remove('open');
    document.body.style.overflow = '';
  }

  /* ---------- gallery lightbox ---------- */
  function initLightbox() {
    var lb = document.getElementById('lightbox');
    if (!lb) return;
    document.querySelectorAll('[data-lightbox]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        e.preventDefault();
        lb.querySelector('img').src = a.getAttribute('href');
        lb.classList.add('open');
      });
    });
    lb.addEventListener('click', function () { lb.classList.remove('open'); });
  }

  /* ---------- boot ---------- */
  document.addEventListener('DOMContentLoaded', function () {
    renderProducts();
    updateBadge();
    initLightbox();
    var form = document.getElementById('orderForm');
    if (form) form.addEventListener('submit', checkout);
    var ov = document.getElementById('cartOverlay');
    if (ov) ov.addEventListener('click', closeCart);
    var mt = document.querySelector('.menu-toggle');
    if (mt) mt.addEventListener('click', function () {
      document.querySelector('.main-nav').classList.toggle('open');
    });
    document.querySelectorAll('.cart-btn').forEach(function (b) {
      b.addEventListener('click', openCart);
    });
    var cc = document.querySelector('.cart-close');
    if (cc) cc.addEventListener('click', closeCart);
  });

  window.SheamCart = { add: addToCart, setQty: setQty, quick: quickOrder, open: openCart };
})();
