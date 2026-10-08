const tg=window.Telegram?.WebApp;
if(tg){tg.ready();tg.expand();}

const DEFAULT={
  name:"PETZI FRESH",
  sub:"Bienvenue dans votre espace",
  title:"Petzi Fresh",
  intro:"Découvrez nos produits et nos liens.",
  productsTab:"PRODUITS",
  linksTab:"LINKS",
  logo:"IMG_1913.jpeg",
  pin:"1234",
  design:{bg:"#0d0d0d",card:"#171717",accent:"#ffffff",muted:"#999999",radius:17},
  products:[
    {name:"Produit 01",info:"Catégorie • Information",price:"XX €",image:"IMG_1913.jpeg"},
    {name:"Produit 02",info:"Catégorie • Information",price:"XX €",image:"IMG_1913.jpeg"},
    {name:"Produit 03",info:"Catégorie • Information",price:"XX €",image:"IMG_1913.jpeg"},
    {name:"Produit 04",info:"Catégorie • Information",price:"XX €",image:"IMG_1913.jpeg"}
  ],
  links:[
    {icon:"✈️",name:"Canal Telegram",url:"https://t.me/"},
    {icon:"💬",name:"Contact",url:"https://t.me/"}
  ]
};

function loadData(){
  try{
    const saved=localStorage.getItem("petziFreshData");
    if(saved) return deepMerge(structuredClone(DEFAULT),JSON.parse(saved));
  }catch(e){}
  return structuredClone(DEFAULT);
}
function deepMerge(base,src){
  if(!src||typeof src!=="object") return base;
  for(const k of Object.keys(src)){
    if(src[k]&&typeof src[k]==="object"&&!Array.isArray(src[k])&&base[k]) deepMerge(base[k],src[k]);
    else base[k]=src[k];
  }
  return base;
}
let data=loadData();

const $=s=>document.querySelector(s);
const root=$("#products");

function applyDesign(){
  document.documentElement.style.setProperty("--bg",data.design.bg);
  document.documentElement.style.setProperty("--card",data.design.card);
  document.documentElement.style.setProperty("--accent",data.design.accent);
  document.documentElement.style.setProperty("--muted",data.design.muted);
  document.documentElement.style.setProperty("--radius",data.design.radius+"px");
}
function applyGeneral(){
  $("#heroName").textContent=data.name;
  $("#heroSub").textContent=data.sub;
  $("#mainTitle").textContent=data.title;
  $("#mainIntro").textContent=data.intro;
  $("#productsTab").textContent=data.productsTab;
  $("#linksTab").textContent=data.linksTab;
  $("#heroLogo").src=data.logo;
}
function renderProducts(list=data.products){
  root.innerHTML=list.map((p,i)=>`
    <article class="card" data-index="${i}">
      <img src="${p.image||data.logo}" alt="">
      <div><b>${esc(p.name)}</b><small>${esc(p.info)}</small><div class="price">${esc(p.price)}</div></div>
    </article>`).join("");
}
function renderLinks(){
  $("#links").innerHTML=data.links.map(l=>`
    <a href="${escAttr(l.url)}" target="_blank" rel="noopener">
      <span class="linkIcon">${esc(l.icon||"🔗")}</span><b>${esc(l.name)}</b><span class="arrow">›</span>
    </a>`).join("");
}
function esc(v){return String(v??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));}
function escAttr(v){return esc(v).replace(/`/g,"&#096;");}

function renderAll(){applyDesign();applyGeneral();renderProducts();renderLinks();}
renderAll();

$("#search").addEventListener("input",e=>{
  const q=e.target.value.toLowerCase().trim();
  renderProducts(data.products.filter(p=>(p.name+" "+p.info+" "+p.price).toLowerCase().includes(q)));
});

document.querySelectorAll("nav button").forEach(b=>b.onclick=()=>{
  document.querySelectorAll("nav button").forEach(x=>x.classList.remove("active"));
  b.classList.add("active");
  const links=b.dataset.tab==="links";
  root.classList.toggle("hidden",links);
  $("#links").classList.toggle("hidden",!links);
  $("#searchBox").classList.toggle("hidden",links);
});

const modal=$("#adminModal");
$("#adminOpen").onclick=()=>{modal.classList.remove("hidden");$("#pinInput").focus();};
$("#adminClose").onclick=()=>modal.classList.add("hidden");
$("#pinBtn").onclick=()=>{
  if($("#pinInput").value===data.pin){
    $("#pinView").classList.add("hidden");
    $("#editorView").classList.remove("hidden");
    fillEditor();
  }else $("#pinError").classList.remove("hidden");
};
$("#pinInput").addEventListener("keydown",e=>{if(e.key==="Enter")$("#pinBtn").click();});

document.querySelectorAll(".editorTab").forEach(b=>b.onclick=()=>{
  document.querySelectorAll(".editorTab").forEach(x=>x.classList.remove("active"));
  document.querySelectorAll(".editorSection").forEach(x=>x.classList.remove("active"));
  b.classList.add("active");
  $(`[data-panel="${b.dataset.editor}"]`).classList.add("active");
});

function fillEditor(){
  $("#eName").value=data.name;$("#eSub").value=data.sub;$("#eTitle").value=data.title;
  $("#eIntro").value=data.intro;$("#eProductsTab").value=data.productsTab;$("#eLinksTab").value=data.linksTab;
  $("#eBg").value=data.design.bg;$("#eCard").value=data.design.card;$("#eAccent").value=data.design.accent;$("#eMuted").value=data.design.muted;
  $("#eRadius").value=data.design.radius;$("#radiusValue").textContent=data.design.radius+" px";
  renderProductEditor();renderLinkEditor();
}
$("#eRadius").oninput=()=>$("#radiusValue").textContent=$("#eRadius").value+" px";

function renderProductEditor(){
  $("#productEditor").innerHTML=data.products.map((p,i)=>`
    <div class="editCard">
      <div class="editTitle">Produit ${i+1}<button class="miniDanger" data-del-product="${i}">Supprimer</button></div>
      <label>Nom</label><input data-p="${i}" data-k="name" value="${escAttr(p.name)}">
      <label>Catégorie / information</label><input data-p="${i}" data-k="info" value="${escAttr(p.info)}">
      <label>Prix</label><input data-p="${i}" data-k="price" value="${escAttr(p.price)}">
      <label>Image URL</label><input data-p="${i}" data-k="image" value="${escAttr(p.image||"IMG_1913.jpeg")}">
      <input type="file" accept="image/*" data-file-product="${i}">
    </div>`).join("");
  $("#productEditor").querySelectorAll("[data-p]").forEach(el=>el.oninput=()=>{
    data.products[+el.dataset.p][el.dataset.k]=el.value;
  });
  $("#productEditor").querySelectorAll("[data-del-product]").forEach(el=>el.onclick=()=>{
    data.products.splice(+el.dataset.delProduct,1);renderProductEditor();
  });
  $("#productEditor").querySelectorAll("[data-file-product]").forEach(el=>el.onchange=e=>{
    const file=e.target.files[0]; if(!file)return;
    const r=new FileReader();r.onload=()=>{data.products[+el.dataset.fileProduct].image=r.result;};r.readAsDataURL(file);
  });
}
$("#addProduct").onclick=()=>{data.products.push({name:"Nouveau produit",info:"Catégorie • Information",price:"XX €",image:data.logo});renderProductEditor();};

function renderLinkEditor(){
  $("#linkEditor").innerHTML=data.links.map((l,i)=>`
    <div class="editCard">
      <div class="editTitle">Lien ${i+1}<button class="miniDanger" data-del-link="${i}">Supprimer</button></div>
      <label>Icône</label><input data-l="${i}" data-k="icon" value="${escAttr(l.icon||"🔗")}">
      <label>Nom</label><input data-l="${i}" data-k="name" value="${escAttr(l.name)}">
      <label>URL</label><input data-l="${i}" data-k="url" value="${escAttr(l.url)}">
    </div>`).join("");
  $("#linkEditor").querySelectorAll("[data-l]").forEach(el=>el.oninput=()=>{
    data.links[+el.dataset.l][el.dataset.k]=el.value;
  });
  $("#linkEditor").querySelectorAll("[data-del-link]").forEach(el=>el.onclick=()=>{
    data.links.splice(+el.dataset.delLink,1);renderLinkEditor();
  });
}
$("#addLink").onclick=()=>{data.links.push({icon:"🔗",name:"Nouveau lien",url:"https://t.me/"});renderLinkEditor();};

["eName","eSub","eTitle","eIntro","eProductsTab","eLinksTab"].forEach(id=>{
  $("#"+id).addEventListener("input",()=>{
    const map={eName:"name",eSub:"sub",eTitle:"title",eIntro:"intro",eProductsTab:"productsTab",eLinksTab:"linksTab"};
    data[map[id]]=$("#"+id).value;
  });
});
["eBg","eCard","eAccent","eMuted"].forEach(id=>$("#"+id).oninput=()=>{
  const map={eBg:"bg",eCard:"card",eAccent:"accent",eMuted:"muted"};data.design[map[id]]=$("#"+id).value;applyDesign();
});
$("#logoFile").onchange=e=>{
  const file=e.target.files[0];if(!file)return;
  const r=new FileReader();r.onload=()=>{data.logo=r.result;applyGeneral();};r.readAsDataURL(file);
};
$("#removeLogo").onclick=()=>{data.logo="IMG_1913.jpeg";applyGeneral();};

$("#saveBtn").onclick=()=>{
  try{localStorage.setItem("petziFreshData",JSON.stringify(data));renderAll();alert("Modifications enregistrées sur cet appareil.");}
  catch(e){alert("Impossible d'enregistrer : les images sont peut-être trop volumineuses.");}
};
$("#resetBtn").onclick=()=>{
  if(confirm("Réinitialiser toute la Mini App ?")){
    localStorage.removeItem("petziFreshData");data=structuredClone(DEFAULT);fillEditor();renderAll();
  }
};