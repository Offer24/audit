var DEMO_MSG = 'نسخة تجريبية: الطلب والتواصل معطّلان في هذه المعاينة العامة. Demo preview: ordering and contact are disabled.';
/* DEMO_GUARD */(function(){var _o=window.open;window.open=function(u){if(u&&String(u).indexOf('https://wa.me')===0){alert(DEMO_MSG);return null;}return _o.apply(window,arguments);};})();
/* t11 — chunky drawer cart, big tap targets. */
(function(){
  var WA_DEAD = '',SHOP="مشويات اسطنبول شيش كباب - فرع باخشب",CAT=[{"name": "نصف دجاج مشوي", "price": 25.0}, {"name": "مشاوي مشكلة", "price": 65.0}, {"name": "كباب لحم", "price": 45.0}, {"name": "ريش غنم", "price": 70.0}, {"name": "شيش طاووق", "price": 38.0}, {"name": "حمص بالطحينة", "price": 12.0}, {"name": "سلطة خضراء", "price": 15.0}],KEY="cart_istanbul_shish_kabab";
  var g=function(id){return document.getElementById(id)};
  var drawer=g("cartPanel"),backdrop=g("cartOverlay"),basket=g("cartItems"),tot=g("cartTotal"),num=g("cartCount");
  var bag={};try{bag=JSON.parse(localStorage.getItem(KEY)||"{}")}catch(e){bag={}}
  function tag(n){var it=CAT.filter(function(c){return c.name===n})[0];return it?it.price:0}
  function stash(){try{localStorage.setItem(KEY,JSON.stringify(bag))}catch(e){}}
  function tip(t){var b=g("toast");b.textContent=t;b.classList.add("on");setTimeout(function(){b.classList.remove("on")},1700)}
  function paint(){
    var out="",n=0,sum=0;
    for(var k in bag){if(!bag[k])continue;n+=bag[k];sum+=tag(k)*bag[k];
      out+='<div class="ci"><div><p class="ci-name">'+k+'</p><p class="ci-meta">'+tag(k)+' ر.س</p></div>'+
      '<div class="ci-qty"><button type="button" data-k="'+k+'" data-d="-1">−</button><span>'+bag[k]+'</span><button type="button" data-k="'+k+'" data-d="1">+</button></div></div>';}
    basket.innerHTML=out||'<p class="cart-empty">السلة فارغة — اختر من القائمة.</p>';
    tot.textContent=sum+" ر.س";num.textContent=n||"";num.style.display=n?"grid":"none";
  }
  document.addEventListener("click",function(e){
    var add=e.target.closest("[data-add]");
    if(add){var nm=add.getAttribute("data-add");bag[nm]=(bag[nm]||0)+1;stash();paint();tip("تمت الإضافة ✓");return}
    var st=e.target.closest("[data-k]");
    if(st){var k=st.getAttribute("data-k"),d=parseInt(st.getAttribute("data-d"),10);bag[k]=(bag[k]||0)+d;if(bag[k]<1)delete bag[k];stash();paint();return}
    var z=e.target.closest("[data-zoom]");if(z){g("lbImg").src=z.getAttribute("data-zoom");g("lightbox").classList.add("on")}
  });
  g("cartBtn").onclick=function(){drawer.classList.add("on");backdrop.classList.add("on");document.body.style.overflow="hidden"};
  var close=function(){drawer.classList.remove("on");backdrop.classList.remove("on");document.body.style.overflow=""};
  g("cartClose").onclick=close;backdrop.onclick=close;
  g("lbClose").onclick=function(){g("lightbox").classList.remove("on")};
  g("lightbox").onclick=function(e){if(e.target.id==="lightbox")g("lightbox").classList.remove("on")};
  g("menuToggle").onclick=function(){g("mainNav").classList.toggle("open")};
  g("mainNav").onclick=function(e){if(e.target.tagName==="A")g("mainNav").classList.remove("open")};
  g("waFloat").onclick=function(){window.open("https://wa.me/"+WA+"?text="+encodeURIComponent("هلا "+SHOP+"، أبغى أستفسر."),"_blank")};
  g("orderForm").addEventListener("submit",function(e){
    e.preventDefault();
    var ks=Object.keys(bag);if(!ks.length){tip("السلة فارغة");return}
    var sum=0,lines=ks.map(function(k){var s=tag(k)*bag[k];sum+=s;return "• "+k+" × "+bag[k]+" = "+s+" ر.س"});
    var text="طلب من "+SHOP+"\n"+lines.join("\n")+"\nالإجمالي التقديري: "+sum+" ر.س\nالاسم: "+(g("custName").value||"—")+(g("custNotes").value?"\nملاحظات: "+g("custNotes").value:"");
    window.open("https://wa.me/"+WA+"?text="+encodeURIComponent(text),"_blank");
  });
  paint();
})();
