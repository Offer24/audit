
const WA_NUMBER = ""; const DEMO_MSG = "نسخة تجريبية: الطلب والتواصل معطّلان في هذه المعاينة العامة. Demo preview: ordering and contact are disabled."; const SHOP_NAME = "صالون رمز الماهر"; const CART_KEY = "cart_ramz_almaher_barber";
const PRODUCTS = [{"name": "قصة شعر رجالية", "price": 40}, {"name": "قصة شعر + لحية", "price": 60}, {"name": "قصة أطفال", "price": 30}, {"name": "صبغة شعر ولحية", "price": 80}, {"name": "عناية بالبشرة (فيشل)", "price": 90}, {"name": "اشتراك شهري", "price": 150}, {"name": "حلاقة ذقن كلاسيكية", "price": 35}, {"name": "باقة العريس", "price": 250}];
let cart = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
const $ = s => document.querySelector(s);
const fmt = n => n + " ر.س";
function save(){ localStorage.setItem(CART_KEY, JSON.stringify(cart)); render(); }
function render(){
  const items = $("#cartItems"), count = cart.reduce((a,c)=>a+c.qty,0), total = cart.reduce((a,c)=>a+c.qty*c.price,0);
  const cc = $("#cartCount"); cc.textContent = count; cc.style.display = count ? "grid" : "none";
  if(!cart.length){ items.innerHTML = '<p class="cart-empty">السلة فارغة — أضف ما يعجبك من القائمة.</p>'; }
  else items.innerHTML = cart.map((c,i)=>`<div class="cart-item"><div class="ci-body"><b>${c.name}</b><span class="ci-price">${fmt(c.price)}</span></div><div class="qty-ctrl"><button data-q="-1" data-i="${i}">−</button><span>${c.qty}</span><button data-q="1" data-i="${i}">+</button></div><button class="ci-remove" data-i="${i}">✕</button></div>`).join("");
  $("#cartTotal").textContent = fmt(total);
}
function toast(msg){ const t=$("#toast"); t.textContent=msg; t.classList.add("show"); setTimeout(()=>t.classList.remove("show"),2200); }
document.addEventListener("click", e=>{
  const add = e.target.closest(".add-btn");
  if(add){ const name=add.dataset.name, price=parseFloat(add.dataset.price)||0;
    const ex = cart.find(c=>c.name===name); if(ex) ex.qty++; else cart.push({name,price,qty:1});
    save(); toast("أضيف إلى السلة: " + name); return; }
  const qb = e.target.closest(".qty-ctrl button");
  if(qb){ const it=cart[+qb.dataset.i]; it.qty += +qb.dataset.q; if(it.qty<1) cart.splice(+qb.dataset.i,1); save(); return; }
  const rm = e.target.closest(".ci-remove"); if(rm){ cart.splice(+rm.dataset.i,1); save(); return; }
  const gl = e.target.closest(".gallink");
  if(gl){ e.preventDefault(); $("#lbImg").src = gl.getAttribute("href"); $("#lightbox").classList.add("open"); return; }
});
function openCart(o){ $("#cartDrawer").classList.toggle("open",o); $("#cartOverlay").classList.toggle("show",o); }
$("#cartBtn").onclick = ()=>openCart(true); $("#cartClose").onclick = ()=>openCart(false); $("#cartOverlay").onclick = ()=>openCart(false);
$("#lbClose").onclick = ()=>$("#lightbox").classList.remove("open");
$("#lightbox").onclick = e=>{ if(e.target.id==="lightbox") e.target.classList.remove("open"); };
$("#waFloat").onclick = ()=>alert(DEMO_MSG); /* DEMO_GUARD */
const mt = $("#menuToggle"); if(mt) mt.onclick = ()=>$("#mainNav").classList.toggle("open");
$("#orderForm").addEventListener("submit", e=>{
  e.preventDefault(); if(!cart.length){ toast("السلة فارغة"); return; }
  const name = $("#custName").value.trim(), notes = $("#custNotes").value.trim();
  const total = cart.reduce((a,c)=>a+c.qty*c.price,0);
  let msg = "طلب جديد من موقع " + SHOP_NAME + "\n\n";
  cart.forEach(c=>{ msg += "• " + c.name + " × " + c.qty + " — " + fmt(c.price*c.qty) + "\n"; });
  msg += "\nالإجمالي التقديري: " + fmt(total) + "\nالاسم: " + name;
  if(notes) msg += "\nملاحظات: " + notes;
  msg += "\n\n(الأسعار تقديرية وتؤكدونها عند الرد)";
  window.open("https://wa.me/"+WA_NUMBER+"?text="+encodeURIComponent(msg),"_blank");
});
render();
