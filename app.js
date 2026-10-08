const tg=window.Telegram?.WebApp;if(tg){tg.ready();tg.expand();}
const products=[{name:"Produit 01",info:"Catégorie • Information",price:"XX €"},{name:"Produit 02",info:"Catégorie • Information",price:"XX €"},{name:"Produit 03",info:"Catégorie • Information",price:"XX €"},{name:"Produit 04",info:"Catégorie • Information",price:"XX €"}];
const root=document.querySelector("#products");
function render(list){root.innerHTML=list.map(p=>`<article class="card"><img src="IMG_1913.jpeg" alt=""><div><b>${p.name}</b><small>${p.info}</small><div class="price">${p.price}</div></div></article>`).join("")}
render(products);
document.querySelector("#search").addEventListener("input",e=>{const q=e.target.value.toLowerCase();render(products.filter(p=>(p.name+" "+p.info).toLowerCase().includes(q)))});
document.querySelectorAll("nav button").forEach(b=>b.onclick=()=>{document.querySelectorAll("nav button").forEach(x=>x.classList.remove("active"));b.classList.add("active");const links=b.dataset.tab==="links";root.classList.toggle("hidden",links);document.querySelector("#links").classList.toggle("hidden",!links);document.querySelector(".search").classList.toggle("hidden",links)})