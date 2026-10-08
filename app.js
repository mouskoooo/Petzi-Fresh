const tg = window.Telegram?.WebApp;
if (tg) {
  tg.ready();
  tg.expand();
  try { tg.setHeaderColor("#0d0d0d"); tg.setBackgroundColor("#0d0d0d"); } catch(e) {}
}

const products = [
  {name:"Produit 01", meta:"Catégorie • Information", price:"XX €", image:"https://placehold.co/700x700/202020/ffffff?text=PETZI+FRESH"},
  {name:"Produit 02", meta:"Catégorie • Information", price:"XX €", image:"https://placehold.co/700x700/202020/ffffff?text=PETZI+FRESH"},
  {name:"Produit 03", meta:"Catégorie • Information", price:"XX €", image:"https://placehold.co/700x700/202020/ffffff?text=PETZI+FRESH"},
  {name:"Produit 04", meta:"Catégorie • Information", price:"XX €", image:"https://placehold.co/700x700/202020/ffffff?text=PETZI+FRESH"}
];

const productRoot = document.getElementById("products");
const search = document.getElementById("search");
const links = document.getElementById("links");

function render(list) {
  productRoot.innerHTML = "";
  if (!list.length) {
    productRoot.innerHTML = '<div class="empty">Aucun produit trouvé.</div>';
    return;
  }
  list.forEach(p => {
    const card = document.createElement("article");
    card.className = "product";
    card.innerHTML = `
      <img class="product-img" src="${p.image}" alt="">
      <div class="product-body">
        <div class="product-name">${p.name}</div>
        <div class="product-meta">${p.meta}</div>
        <div class="price">${p.price}</div>
      </div>`;
    productRoot.appendChild(card);
  });
}

render(products);

search.addEventListener("input", e => {
  const q = e.target.value.trim().toLowerCase();
  render(products.filter(p => `${p.name} ${p.meta}`.toLowerCase().includes(q)));
});

document.querySelectorAll(".nav-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".nav-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    const tab = btn.dataset.tab;
    productRoot.classList.toggle("hidden", tab !== "products");
    links.classList.toggle("hidden", tab !== "links");
    document.querySelector(".search-wrap").classList.toggle("hidden", tab !== "products");
  });
});

document.querySelectorAll(".link-card").forEach(btn => {
  btn.addEventListener("click", () => {
    const url = btn.dataset.url;
    if (tg?.openTelegramLink && url.includes("t.me/")) tg.openTelegramLink(url);
    else window.open(url, "_blank");
  });
});
