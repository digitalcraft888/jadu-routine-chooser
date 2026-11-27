(function(){
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const P={duo:{name:'Wash Duo',price:51.75,img:'img/pack-duo.jpg',sub:'Shampoo + Conditioner'},
         full:{name:'Full Routine',price:85.5,img:'img/pack-full.jpg',sub:'Split Ends Care + Shampoo + Conditioner'}};
const FREE=69;
let cart={duo:0,full:0},path='full';
try{path=localStorage.getItem('jadu_path')||'full';cart=JSON.parse(localStorage.getItem('jadu_cart')||'{"duo":0,"full":0}')}catch(e){}
const fmt=n=>'$'+n.toFixed(2);

function render(){
  const n=cart.duo+cart.full,tot=cart.duo*P.duo.price+cart.full*P.full.price;
  const c=$('#cartCount');c.textContent=n;c.classList.toggle('on',n>0);
  $('#tot').textContent=fmt(tot);
  const left=FREE-tot;
  $('#fs').innerHTML=(n===0?'Free US shipping on orders $69+':left>0?`You’re <b>${fmt(left)}</b> away from free US shipping`:'You’ve unlocked <b>free US shipping</b>')+`<div class="bar"><i style="width:${Math.min(100,tot/FREE*100)}%"></i></div>`;
  $('#dl').innerHTML=n===0?'<p class="empty">Your cart is empty.<br>Pick a routine to begin.</p>':
    ['duo','full'].filter(k=>cart[k]).map(k=>`<div class="li"><img src="${P[k].img}" alt=""><div><b>${P[k].name}</b><small>${P[k].sub}</small><br><span class="qty"><button data-q="${k}:-1">−</button>${cart[k]}<button data-q="${k}:1">+</button></span></div><span class="pr">${fmt(P[k].price*cart[k])}</span></div>`).join('');
  try{localStorage.setItem('jadu_cart',JSON.stringify(cart))}catch(e){}
}
function openCart(o=true){$('#drawer').classList.toggle('on',o);$('#ov').classList.toggle('on',o)}
function setPath(p){
  path=p;try{localStorage.setItem('jadu_path',p)}catch(e){}
  $('#stImg').src=P[p].img;
  $('#stName').textContent=P[p].name+' · '+fmt(P[p].price);$('#stSub').textContent=P[p].sub;
  $$('[data-sw]').forEach(b=>b.classList.toggle('on',b.dataset.sw===p));
}
function add(k,btn){
  cart[k]++;setPath(k);render();
  if(btn&&!btn.dataset.o){btn.dataset.o=btn.textContent;btn.textContent='Added';btn.classList.add('added');
    setTimeout(()=>{btn.textContent=btn.dataset.o;btn.classList.remove('added');delete btn.dataset.o},1200)}
  setTimeout(()=>openCart(true),350);
}
document.addEventListener('click',e=>{
  const a=e.target.closest('[data-add]');if(a){add(a.dataset.add,a);return}
  const q=e.target.closest('[data-q]');if(q){const[k,d]=q.dataset.q.split(':');cart[k]=Math.max(0,cart[k]+ +d);render();return}
  const pk=e.target.closest('[data-pick]');if(pk){
    $('#choose').scrollIntoView({behavior:'smooth'});
    const c=$('#card-'+pk.dataset.pick);setTimeout(()=>{c.classList.add('pick');setTimeout(()=>c.classList.remove('pick'),1900)},500);setPath(pk.dataset.pick);return}
  const sw=e.target.closest('[data-sw]');if(sw){setPath(sw.dataset.sw);return}
});
$('#cartOpen').onclick=()=>openCart(true);$('#cartClose').onclick=$('#ov').onclick=()=>openCart(false);
$('#stAdd').onclick=e=>add(path,e.currentTarget);
document.addEventListener('keydown',e=>e.key==='Escape'&&openCart(false));

// sticky bar: show after the chooser's top has passed, hide when cards are fully on screen
const st=$('#sticky'),ch=$('.cards');
function sticky(){const r=ch.getBoundingClientRect(),vh=innerHeight;
  const cardsVisible=r.top<vh*.55&&r.bottom>vh*.35;
  st.classList.toggle('show',scrollY>500&&!cardsVisible)}
addEventListener('scroll',sticky,{passive:true});sticky();

// how-to tabs
function how(p){
  const ha=$('#howAdd');if(ha){ha.dataset.add=p;ha.textContent='Add '+P[p].name+' · '+fmt(P[p].price)}
  $$('.tabs button').forEach(b=>b.classList.toggle('on',b.dataset.path===p));
  $$('.step').forEach(s=>s.classList.toggle('hide',!s.dataset.for.split(' ').includes(p)));
  let i=p==='full'?2:1;$$('.step:not(.hide) [data-n]').forEach((n,j)=>{n.textContent=j+(p==='full'?2:1)});
  $$('.step:not(.hide) [data-sn]').forEach((n,j)=>{n.textContent='Step '+(j+(p==='full'?2:1))});
  const im=$('#howImg');im.style.opacity=0;setTimeout(()=>{im.src=p==='full'?'img/jadu-split-ends-care-healthy-hair-lifestyle.jpg':'img/jadu-shampoo-application-lather-scalp.jpg';im.style.opacity=1},200);
}
$$('.tabs button').forEach(b=>b.onclick=()=>how(b.dataset.path));

// before/after
const r=$('#baR'),a2=$('#baA'),h=$('#baH');
function ba(){a2.style.clipPath=`inset(0 0 0 ${r.value}%)`;h.style.left=r.value+'%'}
r.oninput=()=>{ba();const hn=$('#baHint');if(hn)hn.remove()};ba();

// reveal
const io=new IntersectionObserver(es=>es.forEach(x=>{if(x.isIntersecting){x.target.classList.add('in');io.unobserve(x.target)}}),{threshold:.12});
$$('.card,.rule,.q,.step,.why .wrap>div,.oil .wrap>div,.tbl,.bgrid>div').forEach(el=>{el.classList.add('rv');io.observe(el)});

setPath(path);render();how('full');
})();
