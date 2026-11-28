var DEMO_MSG = 'نسخة تجريبية: الطلب والتواصل معطّلان في هذه المعاينة العامة. Demo preview: ordering and contact are disabled.';
/* DEMO_GUARD */(function(){var _o=window.open;window.open=function(u){if(u&&String(u).indexOf('https://wa.me')===0){alert(DEMO_MSG);return null;}return _o.apply(window,arguments);};})();
/* t12 — archive bottom sheet, table-driven cart. */
(function(){
  const D={wa: '',shop:"كلين 360",rows:[{"name": "تنظيف شقة غرفتين", "price": 350.0}, {"name": "تنظيف مجلس", "price": 200.0}, {"name": "تنظيف سجاد بالمتر", "price": 15.0}, {"name": "تنظيف خزان مياه", "price": 300.0}, {"name": "تنظيف بعد البناء", "price": 900.0}],key:"cart_clean360"};
  const pick=(id)=>document.getElementById(id);
  let ledger={};
  try{ledger=JSON.parse(localStorage.getItem(D.key)||"{}")}catch(err){ledger={}}
  const rate=(n)=>{for(const r of D.rows){if(r.name===n)return r.price}return 0};
  const commit=()=>{try{localStorage.setItem(D.key,JSON.stringify(ledger))}catch(err){}};
  const note=(m)=>{const n=pick("toast");n.textContent=m;n.classList.add("on");setTimeout(()=>n.classList.remove("on"),1700)};
  const sheet=pick("cartPanel"),shade=pick("cartOverlay"),tbody=pick("cartItems"),grand=pick("cartTotal"),counter=pick("cartCount");
  function sync(){
    const names=Object.keys(ledger).filter(k=>ledger[k]>0);
    let q=0,sum=0,html="";
    for(const n of names){q+=ledger[n];sum+=rate(n)*ledger[n];
      html+=`<div class="ci"><div><p class="ci-name">${n}</p><p class="ci-meta">${rate(n)} ر.س × ${ledger[n]}</p></div>
      <div class="ci-qty"><button type="button" data-op="dec" data-name="${n}">−</button><span>${ledger[n]}</span><button type="button" data-op="inc" data-name="${n}">+</button></div></div>`;}
    tbody.innerHTML=html||'<p class="cart-empty">لم تُضف أي صنف بعد.</p>';
    grand.textContent=sum+" ر.س";counter.textContent=q||"";counter.style.display=q?"grid":"none";
  }
  document.addEventListener("click",(ev)=>{
    const adder=ev.target.closest("[data-add]");
    if(adder){const n=adder.dataset.add;ledger[n]=(ledger[n]||0)+1;commit();sync();note("سُجّل في الطلب");return}
    const op=ev.target.closest("[data-op]");
    if(op){const n=op.dataset.name;ledger[n]=(ledger[n]||0)+(op.dataset.op==="inc"?1:-1);if(ledger[n]<1)delete ledger[n];commit();sync();return}
    const zoom=ev.target.closest("[data-zoom]");
    if(zoom){pick("lbImg").src=zoom.dataset.zoom;pick("lightbox").classList.add("on")}
  });
  pick("cartBtn").onclick=()=>{sheet.classList.add("on");shade.classList.add("on");document.body.style.overflow="hidden"};
  const shut=()=>{sheet.classList.remove("on");shade.classList.remove("on");document.body.style.overflow=""};
  pick("cartClose").onclick=shut;shade.onclick=shut;
  pick("lbClose").onclick=()=>pick("lightbox").classList.remove("on");
  pick("lightbox").onclick=(e)=>{if(e.target.id==="lightbox")pick("lightbox").classList.remove("on")};
  pick("menuToggle").onclick=()=>pick("mainNav").classList.toggle("open");
  pick("mainNav").onclick=(e)=>{if(e.target.tagName==="A")pick("mainNav").classList.remove("open")};
  pick("waFloat").onclick=()=>window.open("https://wa.me/"+D.wa+"?text="+encodeURIComponent("مرحباً "+D.shop+"، أستفسر عن الخدمات."),"_blank");
  pick("orderForm").addEventListener("submit",(e)=>{
    e.preventDefault();
    const names=Object.keys(ledger).filter(k=>ledger[k]>0);
    if(!names.length){note("لم تُضف أي صنف");return}
    let sum=0;const lines=names.map(n=>{const s=rate(n)*ledger[n];sum+=s;return "• "+n+" × "+ledger[n]+" = "+s+" ر.س"});
    const msg="طلب من "+D.shop+"\n"+lines.join("\n")+"\nالإجمالي التقديري: "+sum+" ر.س\nالاسم: "+(pick("custName").value||"—")+(pick("custNotes").value?"\nملاحظات: "+pick("custNotes").value:"");
    window.open("https://wa.me/"+D.wa+"?text="+encodeURIComponent(msg),"_blank");
  });
  sync();
})();
