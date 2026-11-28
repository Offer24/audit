var DEMO_MSG = 'نسخة تجريبية: الطلب والتواصل معطّلان في هذه المعاينة العامة. Demo preview: ordering and contact are disabled.';
/* DEMO_GUARD */(function(){var _o=window.open;window.open=function(u){if(u&&String(u).indexOf('https://wa.me')===0){alert(DEMO_MSG);return null;}return _o.apply(window,arguments);};})();
/* t7 — full-screen cart sheet, editorial. */
(function(){
  var WA_DEAD = '', SHOP="مطبعة الجديد للنسخ والتصوير New Print Copy Center", PRODUCTS=[{"name": "كروت شخصية ٥٠٠ حبة", "price": 120.0}, {"name": "بروشور A5", "price": 250.0}, {"name": "رول أب", "price": 180.0}, {"name": "استيكرات", "price": 100.0}, {"name": "تصميم هوية", "price": 800.0}, {"name": "أكياس ورقية", "price": 320.0}], KEY="cart_aljadeed_print";
  var $=function(s){return document.querySelector(s)};
  var panel=$("#cartPanel"), overlay=$("#cartOverlay"), itemsEl=$("#cartItems"), totalEl=$("#cartTotal"), countEl=$("#cartCount");
  var nav=$("#mainNav"), toggle=$("#menuToggle"), lb=$("#lightbox"), lbImg=$("#lbImg"), toastEl=$("#toast");
  var store={};
  try{store=JSON.parse(localStorage.getItem(KEY)||"{}")}catch(e){store={}}
  function priceOf(n){for(var i=0;i<PRODUCTS.length;i++){if(PRODUCTS[i].name===n)return PRODUCTS[i].price}return 0}
  function save(){try{localStorage.setItem(KEY,JSON.stringify(store))}catch(e){}}
  function money(v){return v.toLocaleString("ar-SA")}
  function toast(m){toastEl.textContent=m;toastEl.classList.add("on");clearTimeout(toastEl._t);toastEl._t=setTimeout(function(){toastEl.classList.remove("on")},1900)}
  function render(){
    var keys=Object.keys(store), qty=0, total=0, html="";
    if(!keys.length){html='<p class="cart-empty">السلة فارغة — أضف ما يعجبك من القائمة.</p>'}
    keys.forEach(function(k){
      var q=store[k]; qty+=q; total+=priceOf(k)*q;
      html+='<div class="ci"><div><p class="ci-name">'+k+'</p><p class="ci-meta">'+money(priceOf(k))+' ر.س × '+q+'</p></div>'+
        '<div class="ci-qty"><button type="button" data-dec="'+k+'">−</button><span>'+q+'</span><button type="button" data-inc="'+k+'">+</button></div></div>';
    });
    itemsEl.innerHTML=html; totalEl.textContent=money(total)+" ر.س"; countEl.textContent=qty||"";
    countEl.style.display=qty?"grid":"none";
  }
  function open(){panel.classList.add("on");overlay.classList.add("on");document.body.style.overflow="hidden"}
  function close(){panel.classList.remove("on");overlay.classList.remove("on");document.body.style.overflow=""}
  document.addEventListener("click",function(e){
    var t=e.target.closest("[data-add]");
    if(t){var n=t.getAttribute("data-add");store[n]=(store[n]||0)+1;save();render();toast("أُضيف: "+n);return}
    var inc=e.target.closest("[data-inc]"), dec=e.target.closest("[data-dec]");
    if(inc){store[inc.getAttribute("data-inc")]++;save();render();return}
    if(dec){var k=dec.getAttribute("data-dec");store[k]--;if(store[k]<=0)delete store[k];save();render();return}
    var fig=e.target.closest("[data-zoom]");
    if(fig){lbImg.src=fig.getAttribute("data-zoom");lb.classList.add("on");return}
  });
  $("#cartBtn").addEventListener("click",open);
  $("#cartClose").addEventListener("click",close);
  overlay.addEventListener("click",close);
  $("#lbClose").addEventListener("click",function(){lb.classList.remove("on")});
  lb.addEventListener("click",function(e){if(e.target===lb)lb.classList.remove("on")});
  toggle.addEventListener("click",function(){nav.classList.toggle("open")});
  nav.addEventListener("click",function(e){if(e.target.tagName==="A")nav.classList.remove("open")});
  document.addEventListener("keydown",function(e){if(e.key==="Escape"){close();lb.classList.remove("on")}});
  $("#waFloat").addEventListener("click",function(){
    var msg="مرحباً "+SHOP+"، أرغب بالاستفسار عن الخدمات.";
    window.open("https://wa.me/"+WA+"?text="+encodeURIComponent(msg),"_blank");
  });
  $("#orderForm").addEventListener("submit",function(e){
    e.preventDefault();
    var keys=Object.keys(store); if(!keys.length){toast("السلة فارغة");return}
    var name=($("#custName").value||"").trim(), notes=($("#custNotes").value||"").trim(), total=0;
    var lines=keys.map(function(k){var q=store[k];total+=priceOf(k)*q;return "• "+k+" × "+q+" = "+(priceOf(k)*q)+" ر.س"});
    var msg="طلب جديد — "+SHOP+"\n"+lines.join("\n")+"\nالإجمالي التقديري: "+total+" ر.س\nالاسم: "+(name||"—")+(notes?"\nملاحظات: "+notes:"");
    window.open("https://wa.me/"+WA+"?text="+encodeURIComponent(msg),"_blank");
  });
  render();
})();
