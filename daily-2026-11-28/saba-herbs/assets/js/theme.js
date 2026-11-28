var DEMO_MSG = 'نسخة تجريبية: الطلب والتواصل معطّلان في هذه المعاينة العامة. Demo preview: ordering and contact are disabled.';
/* DEMO_GUARD */(function(){var _o=window.open;window.open=function(u){if(u&&String(u).indexOf('https://wa.me')===0){alert(DEMO_MSG);return null;}return _o.apply(window,arguments);};})();
/* t10 — minimal slide-up cart, mono numerals. */
(function(){
  const C={wa: '',shop:"عطاره سبأ السعيده فرع الشاكرين",list:[{"name": "بهارات مشكلة", "price": 18.0}, {"name": "أعشاب تنحيف", "price": 35.0}, {"name": "عسل جبلي", "price": 95.0}, {"name": "زيت حبة البركة", "price": 40.0}, {"name": "قرفة عيدان", "price": 22.0}],key:"cart_saba_herbs"};
  const q=(s)=>document.querySelector(s);
  const cart=new Map();
  try{const raw=JSON.parse(localStorage.getItem(C.key)||"{}");Object.keys(raw).forEach(k=>cart.set(k,raw[k]))}catch(e){}
  const price=(n)=>{const f=C.list.find(p=>p.name===n);return f?f.price:0};
  const keep=()=>{const o={};cart.forEach((v,k)=>{o[k]=v});try{localStorage.setItem(C.key,JSON.stringify(o))}catch(e){}};
  const panel=q("#cartPanel"),ov=q("#cartOverlay"),box=q("#cartItems"),ttl=q("#cartTotal"),badge=q("#cartCount");
  const msg=(t)=>{const el=q("#toast");el.textContent=t;el.classList.add("on");setTimeout(()=>el.classList.remove("on"),1600)};
  function paint(){
    let html="",count=0,sum=0;
    cart.forEach((n,name)=>{count+=n;sum+=price(name)*n;
      html+=`<div class="ci"><div><p class="ci-name">${name}</p><p class="ci-meta">${price(name)} ر.س</p></div>
      <div class="ci-qty"><button type="button" data-step="-1" data-n="${name}">−</button><span>${n}</span><button type="button" data-step="1" data-n="${name}">+</button></div></div>`});
    box.innerHTML=html||'<p class="cart-empty">السلة فارغة.</p>';
    ttl.textContent=sum+" ر.س";badge.textContent=count||"";badge.style.display=count?"grid":"none";
  }
  document.addEventListener("click",(e)=>{
    const add=e.target.closest("[data-add]");
    if(add){const n=add.dataset.add;cart.set(n,(cart.get(n)||0)+1);keep();paint();msg("أُضيف");return}
    const st=e.target.closest("[data-step]");
    if(st){const n=st.dataset.n,d=Number(st.dataset.step),v=(cart.get(n)||0)+d;v<1?cart.delete(n):cart.set(n,v);keep();paint();return}
    const zi=e.target.closest("[data-zoom]");
    if(zi){q("#lbImg").src=zi.dataset.zoom;q("#lightbox").classList.add("on")}
  });
  q("#cartBtn").onclick=()=>{panel.classList.add("on");ov.classList.add("on");document.body.style.overflow="hidden"};
  const shut=()=>{panel.classList.remove("on");ov.classList.remove("on");document.body.style.overflow=""};
  q("#cartClose").onclick=shut;ov.onclick=shut;
  q("#lbClose").onclick=()=>q("#lightbox").classList.remove("on");
  q("#lightbox").onclick=(e)=>{if(e.target.id==="lightbox")q("#lightbox").classList.remove("on")};
  q("#menuToggle").onclick=()=>q("#mainNav").classList.toggle("open");
  q("#mainNav").onclick=(e)=>{if(e.target.tagName==="A")q("#mainNav").classList.remove("open")};
  q("#waFloat").onclick=()=>window.open("https://wa.me/"+C.wa+"?text="+encodeURIComponent("مرحباً "+C.shop+"، عندي استفسار."),"_blank");
  q("#orderForm").addEventListener("submit",(e)=>{
    e.preventDefault();
    if(!cart.size){msg("السلة فارغة");return}
    let sum=0;const lines=[];
    cart.forEach((n,name)=>{sum+=price(name)*n;lines.push("• "+name+" × "+n+" = "+(price(name)*n)+" ر.س")});
    const body="طلب من "+C.shop+"\n"+lines.join("\n")+"\nالإجمالي التقديري: "+sum+" ر.س\nالاسم: "+(q("#custName").value||"—")+(q("#custNotes").value?"\nملاحظات: "+q("#custNotes").value:"");
    window.open("https://wa.me/"+C.wa+"?text="+encodeURIComponent(body),"_blank");
  });
  paint();
})();
