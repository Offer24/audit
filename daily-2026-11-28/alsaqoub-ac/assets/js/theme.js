var DEMO_MSG = 'نسخة تجريبية: الطلب والتواصل معطّلان في هذه المعاينة العامة. Demo preview: ordering and contact are disabled.';
/* DEMO_GUARD */(function(){var _o=window.open;window.open=function(u){if(u&&String(u).indexOf('https://wa.me')===0){alert(DEMO_MSG);return null;}return _o.apply(window,arguments);};})();
/* t9 — side drawer cart + rail arrows. */
(function(){
  "use strict";
  var cfg={wa: '',shop:"الصقعوب لصيانة التكييف والتبريد والأجهزة المنزلية",items:[{"name": "تركيب مكيف سبليت", "price": 350.0}, {"name": "صيانة وتنظيف", "price": 150.0}, {"name": "تعبئة فريون", "price": 220.0}, {"name": "صيانة مكيف مركزي", "price": 500.0}, {"name": "فحص أعطال", "price": 0.0}],key:"cart_alsaqoub_ac"};
  var byId=function(i){return document.getElementById(i)};
  var drawer=byId("cartPanel"),scrim=byId("cartOverlay"),basket=byId("cartItems"),sumEl=byId("cartTotal"),cnt=byId("cartCount");
  var state={};try{state=JSON.parse(localStorage.getItem(cfg.key)||"{}")}catch(e){state={}}
  function unit(n){var m=cfg.items.filter(function(x){return x.name===n})[0];return m?m.price:0}
  function store(){try{localStorage.setItem(cfg.key,JSON.stringify(state))}catch(e){}}
  function flash(t){var b=byId("toast");b.textContent=t;b.classList.add("on");setTimeout(function(){b.classList.remove("on")},1700)}
  function openDrawer(){drawer.classList.add("on");scrim.classList.add("on");document.body.style.overflow="hidden"}
  function shutDrawer(){drawer.classList.remove("on");scrim.classList.remove("on");document.body.style.overflow=""}
  function draw(){
    var ks=Object.keys(state),q=0,sum=0,out="";
    ks.forEach(function(k){q+=state[k];sum+=unit(k)*state[k];
      out+='<div class="ci"><div><p class="ci-name">'+k+'</p><p class="ci-meta">'+unit(k)+' ر.س</p></div>'+
      '<div class="ci-qty"><button type="button" data-m="'+k+'">−</button><span>'+state[k]+'</span><button type="button" data-p="'+k+'">+</button></div></div>';});
    basket.innerHTML=out||'<p class="cart-empty">السلة فارغة.</p>';
    sumEl.textContent=sum+" ر.س";cnt.textContent=q||"";cnt.style.display=q?"grid":"none";
  }
  document.addEventListener("click",function(ev){
    var a=ev.target.closest("[data-add]");
    if(a){state[a.getAttribute("data-add")]=(state[a.getAttribute("data-add")]||0)+1;store();draw();flash("أُضيف للسلة");return}
    var p=ev.target.closest("[data-p]");if(p){state[p.getAttribute("data-p")]++;store();draw();return}
    var m=ev.target.closest("[data-m]");
    if(m){var k=m.getAttribute("data-m");state[k]--;if(state[k]<1)delete state[k];store();draw();return}
    var z=ev.target.closest("[data-zoom]");if(z){byId("lbImg").src=z.getAttribute("data-zoom");byId("lightbox").classList.add("on");return}
    var arrow=ev.target.closest("[data-rail]");
    if(arrow){var rail=document.getElementById(arrow.getAttribute("data-rail"));var dir=arrow.getAttribute("data-dir")==="next"?-1:1;rail.scrollBy({left:dir*320,behavior:"smooth"})}
  });
  byId("cartBtn").onclick=openDrawer;byId("cartClose").onclick=shutDrawer;scrim.onclick=shutDrawer;
  byId("lbClose").onclick=function(){byId("lightbox").classList.remove("on")};
  byId("lightbox").onclick=function(e){if(e.target.id==="lightbox")byId("lightbox").classList.remove("on")};
  byId("menuToggle").onclick=function(){byId("mainNav").classList.toggle("open")};
  byId("mainNav").onclick=function(e){if(e.target.tagName==="A")byId("mainNav").classList.remove("open")};
  byId("waFloat").onclick=function(){window.open("https://wa.me/"+cfg.wa+"?text="+encodeURIComponent("مرحباً "+cfg.shop+"، عندي استفسار."),"_blank")};
  byId("orderForm").addEventListener("submit",function(e){
    e.preventDefault();var ks=Object.keys(state);if(!ks.length){flash("السلة فارغة");return}
    var total=0;var lines=ks.map(function(k){var s=unit(k)*state[k];total+=s;return "• "+k+" × "+state[k]+" = "+s+" ر.س"});
    var msg="طلب من "+cfg.shop+"\n"+lines.join("\n")+"\nالإجمالي التقديري: "+total+" ر.س\nالاسم: "+(byId("custName").value||"—")+(byId("custNotes").value?"\nملاحظات: "+byId("custNotes").value:"");
    window.open("https://wa.me/"+cfg.wa+"?text="+encodeURIComponent(msg),"_blank");
  });
  draw();
})();
