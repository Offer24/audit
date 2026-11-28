var DEMO_MSG = 'نسخة تجريبية: الطلب والتواصل معطّلان في هذه المعاينة العامة. Demo preview: ordering and contact are disabled.';
/* DEMO_GUARD */(function(){var _o=window.open;window.open=function(u){if(u&&String(u).indexOf('https://wa.me')===0){alert(DEMO_MSG);return null;}return _o.apply(window,arguments);};})();
/* t8 — bottom-sheet cart with steppers, bento. */
(function(){
  const WA_DEAD = '', SHOP="لمعة لخدمات التنظيف بالأحساء", PRODUCTS=[{"name": "تنظيف شقة غرفتين", "price": 350.0}, {"name": "تنظيف مجلس", "price": 200.0}, {"name": "تنظيف سجاد بالمتر", "price": 15.0}, {"name": "تنظيف خزان مياه", "price": 300.0}, {"name": "تنظيف بعد البناء", "price": 900.0}], KEY="cart_lamaa_cleaning";
  const el=(id)=>document.getElementById(id);
  const sheet=el("cartPanel"), scrim=el("cartOverlay"), list=el("cartItems"), totalBox=el("cartTotal"), badge=el("cartCount");
  let cart={};
  try{cart=JSON.parse(localStorage.getItem(KEY)||"{}")}catch(_){cart={}}
  const cost=(name)=>{const p=PRODUCTS.find(x=>x.name===name);return p?p.price:0};
  const persist=()=>{try{localStorage.setItem(KEY,JSON.stringify(cart))}catch(_){}};
  const say=(t)=>{const n=el("toast");n.textContent=t;n.classList.add("on");setTimeout(()=>n.classList.remove("on"),1800)};
  const show=()=>{sheet.classList.add("on");scrim.classList.add("on");document.body.style.overflow="hidden"};
  const hide=()=>{sheet.classList.remove("on");scrim.classList.remove("on");document.body.style.overflow=""};
  function paint(){
    const names=Object.keys(cart);
    if(names.length===0){list.innerHTML='<p class="cart-empty">السلة فارغة — أضف ما يعجبك من القائمة.</p>'}
    else{
      list.innerHTML=names.map(n=>{
        const q=cart[n];
        return `<div class="ci"><div><p class="ci-name">${n}</p><p class="ci-meta">${cost(n)} ر.س × ${q}</p></div>
        <div class="ci-qty"><button type="button" data-minus="${n}">−</button><span>${q}</span><button type="button" data-plus="${n}">+</button></div></div>`;
      }).join("");
    }
    let sum=0,count=0;
    names.forEach(n=>{sum+=cost(n)*cart[n];count+=cart[n]});
    totalBox.textContent=sum.toLocaleString("ar-SA")+" ر.س";
    badge.textContent=count||"";
    badge.style.display=count?"grid":"none";
  }
  document.body.addEventListener("click",(ev)=>{
    const add=ev.target.closest("[data-add]");
    if(add){const n=add.dataset.add;cart[n]=(cart[n]||0)+1;persist();paint();say("تمت الإضافة");return}
    const plus=ev.target.closest("[data-plus]"); if(plus){cart[plus.dataset.plus]++;persist();paint();return}
    const minus=ev.target.closest("[data-minus]");
    if(minus){const n=minus.dataset.minus;cart[n]--;if(cart[n]<1)delete cart[n];persist();paint();return}
    const zoom=ev.target.closest("[data-zoom]");
    if(zoom){el("lbImg").src=zoom.dataset.zoom;el("lightbox").classList.add("on")}
  });
  el("cartBtn").onclick=show; el("cartClose").onclick=hide; scrim.onclick=hide;
  el("lbClose").onclick=()=>el("lightbox").classList.remove("on");
  el("lightbox").onclick=(e)=>{if(e.target.id==="lightbox")el("lightbox").classList.remove("on")};
  el("menuToggle").onclick=()=>el("mainNav").classList.toggle("open");
  el("mainNav").addEventListener("click",(e)=>{if(e.target.tagName==="A")el("mainNav").classList.remove("open")});
  el("waFloat").onclick=()=>window.open("https://wa.me/"+WA+"?text="+encodeURIComponent("مرحباً "+SHOP+"، عندي استفسار."),"_blank");
  el("orderForm").addEventListener("submit",(e)=>{
    e.preventDefault();
    const names=Object.keys(cart);
    if(!names.length){say("السلة فارغة");return}
    let total=0;
    const lines=names.map(n=>{const s=cost(n)*cart[n];total+=s;return `• ${n} × ${cart[n]} = ${s} ر.س`});
    const msg=`طلب من ${SHOP}\n${lines.join("\n")}\nالإجمالي التقديري: ${total} ر.س\nالاسم: ${el("custName").value||"—"}${el("custNotes").value?"\nملاحظات: "+el("custNotes").value:""}`;
    window.open("https://wa.me/"+WA+"?text="+encodeURIComponent(msg),"_blank");
  });
  paint();
})();
