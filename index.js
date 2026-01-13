const slideBarLinks = document.querySelectorAll(".sidebar-links li");
const products = document.querySelectorAll(".products");
const addProduct = document.querySelector(".action .add-product");
const searchInput = document.querySelector(".search-product input");
const categorySelect = document.querySelector(".cat-select");

let allProducts = [];
let categories = [];

addProduct.addEventListener("click", () => {
  location.assign("http://127.0.0.1:5500/add.html");
});

slideBarLinks[0].addEventListener("click", showProduct);
slideBarLinks[1].addEventListener("click", showCategory);
slideBarLinks[2].addEventListener("click", showStatistics);
slideBarLinks[3].addEventListener("click", showAnalytics);

function removeShow() {
  products.forEach(elem => elem.classList.remove("show"));
}

async function fetchProducts() {
  if (allProducts.length === 0) {
    const res = await fetch("https://fakestoreapi.com/products");
    allProducts = await res.json();
  }
}

// PRODUCTS
async function showProduct() {
  await fetchProducts();
  removeShow();
  products[0].classList.add("show");

  renderProducts(allProducts);
  loadCategories(allProducts);
}

function renderProducts(list) {
  products[0].innerHTML = "";

  list.forEach(elem => {
    products[0].innerHTML += `
      <div class="product">
        <span class="material-symbols-outlined edit-product" data-product-id="${elem.id}">edit</span>
        <img src="${elem.image}" alt="">
        <p class="title">${elem.title}</p>
        <p class="price">${elem.price * 10}dh</p>
        <button class="btn-delete">Supprimer</button>
      </div>
    `;
  });

  document.querySelectorAll(".edit-product").forEach(btn => {
    btn.addEventListener("click", e => {
      const productId = e.target.dataset.productId;
      location.assign(`add.html?id=${productId}`);
    });
  });
}

function loadCategories(data) {
  categories = [...new Set(data.map(p => p.category))];
  categorySelect.innerHTML = `<option value="">Toutes les catégories</option>`;
  categories.forEach(cat => {
    categorySelect.innerHTML += `<option value="${cat}">${cat}</option>`;
  });
}

searchInput.addEventListener("input", () => {
  const value = searchInput.value.toLowerCase();
  const filtered = allProducts.filter(p =>
    p.title.toLowerCase().includes(value)
  );
  renderProducts(filtered);
});

categorySelect.addEventListener("change", () => {
  const value = categorySelect.value;
  if (value === "") {
    renderProducts(allProducts);
  } else {
    renderProducts(allProducts.filter(p => p.category === value));
  }
});

// CATEGORY CRUD
async function showCategory() {
  removeShow();
  products[0].classList.add("show");

  if (categories.length === 0) {
    const response = await fetch("https://fakestoreapi.com/products/categories");
    categories = await response.json();
  }

  renderCategory();
}

function renderCategory() {
  products[0].innerHTML = `
    <div class="category-box">
      <div class="add-category">
        <input type="text" placeholder="Nouvelle catégorie">
        <button class="add-cat-btn">Ajouter</button>
      </div>
      <div class="category-list"></div>
    </div>
  `;

  const list = products[0].querySelector(".category-list");

  categories.forEach(cat => {
    list.innerHTML += `
      <div class="category-item">
        <span>${cat}</span>
        <button class="delete-cat" data-cat="${cat}">Supprimer</button>
      </div>
    `;
  });

  products[0].querySelector(".add-cat-btn").addEventListener("click", () => {
    const input = products[0].querySelector(".add-category input");
    const value = input.value.trim();
    if (value && !categories.includes(value)) {
      categories.push(value);
      renderCategory();
    }
  });

  products[0].querySelectorAll(".delete-cat").forEach(btn => {
    btn.addEventListener("click", e => {
      const cat = e.target.dataset.cat;
      categories = categories.filter(c => c !== cat);
      renderCategory();
    });
  });
}

// STATISTICS
async function showStatistics() {
  await fetchProducts();
  removeShow();
  products[0].classList.add("show");

  const totalProducts = allProducts.length;
  const uniqueCategories = [...new Set(allProducts.map(p => p.category))];
  const avgPrice = (
    allProducts.reduce((s, p) => s + p.price, 0) / totalProducts
  ).toFixed(2);
  const stockValue = allProducts.reduce((s, p) => s + p.price * 10, 0).toFixed(2);

  products[0].innerHTML = `
    <div class="kpi-container">
      <div class="kpi-card">
        <h3>Total Products</h3>
        <p>${totalProducts}</p>
      </div>
      <div class="kpi-card">
        <h3>Total Categories</h3>
        <p>${uniqueCategories.length}</p>
      </div>
      <div class="kpi-card">
        <h3>Average Price</h3>
        <p>${avgPrice} $</p>
      </div>
      <div class="kpi-card">
        <h3>Stock Value</h3>
        <p>${stockValue} $</p>
      </div>
    </div>
  `;
}

// ANALYTICS
async function showAnalytics() {
  await fetchProducts();
  removeShow();
  products[0].classList.add("show");

  products[0].innerHTML = `
    <div class="chart-box">
      <canvas id="categoryChart"></canvas>
    </div>
  `;

  const catCounts = {};
  allProducts.forEach(p => {
    catCounts[p.category] = (catCounts[p.category] || 0) + 1;
  });

  new Chart(document.getElementById("categoryChart"), {
    type: "bar",
    data: {
      labels: Object.keys(catCounts),
      datasets: [
        {
          label: "Products per Category",
          data: Object.values(catCounts),
          backgroundColor: "#4f46e5"
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        title: { display: true, text: "Produits par catégorie" }
      }
    }
  });
}

showProduct();
