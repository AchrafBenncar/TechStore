const forumValidity = {
  nameProd: false,
  imgProd: false,
  prixProd: false,
  categorie: false,
  description: false
};

const id = new URL(location.href).searchParams.get("id");

if (id) {
  getProd();
}

async function getProd() {
  const data = await fetch("https://fakestoreapi.com/products/" + id);
  const produit = await data.json();

  document.querySelector(".container h2").innerHTML = "Modifier un Produit";
  document.querySelector("form button").innerHTML = "Modifier le produit";

  document.querySelectorAll("input, textarea").forEach(elem => {
    switch (elem.id) {
      case "ProdName":
        elem.value = produit.title;
        break;
      case "img":
        elem.value = produit.image;
        break;
      case "prix":
        elem.value = produit.price;
        break;
      case "categorie":
        elem.value = produit.category;
        break;
      case "description":
        elem.value = produit.description;
        break;
    }
  });
}

const ErrorMessage = document.querySelectorAll(".err-mess");
const IconsValidity = document.querySelectorAll(".fa-circle-check");
const IconsError = document.querySelectorAll(".fa-circle-exclamation");

const nameProd = document.querySelector("#ProdName");
const imgProd = document.querySelector("#img");
const prixProd = document.querySelector("#prix");
const categorieProd = document.querySelector("#categorie");
const descriptionProd = document.querySelector("#description");

nameProd.addEventListener("input", NameProdVerif);
nameProd.addEventListener("blur", NameProdVerif);

imgProd.addEventListener("input", imgProdVerif);
imgProd.addEventListener("blur", imgProdVerif);

prixProd.addEventListener("input", prixProdVerif);
prixProd.addEventListener("blur", prixProdVerif);

categorieProd.addEventListener("input", categorieProdVerif);
categorieProd.addEventListener("blur", categorieProdVerif);

descriptionProd.addEventListener("input", descriptionProdVerif);
descriptionProd.addEventListener("blur", descriptionProdVerif);

function NameProdVerif() {
  const value = nameProd.value;
  if (!value || value.length < 3) {
    showValidity({ index: 0, verification: false });
    forumValidity.nameProd = false;
  } else {
    showValidity({ index: 0, verification: true });
    forumValidity.nameProd = true;
  }
}

function imgProdVerif() {
  const value = imgProd.value;
  if (!value) {
    showValidity({ index: 1, verification: false });
    forumValidity.imgProd = false;
  } else {
    showValidity({ index: 1, verification: true });
    forumValidity.imgProd = true;
  }
}

function prixProdVerif() {
  const value = parseFloat(prixProd.value);
  if (isNaN(value) || value <= 0) {
    showValidity({ index: 2, verification: false });
    forumValidity.prixProd = false;
  } else {
    showValidity({ index: 2, verification: true });
    forumValidity.prixProd = true;
  }
}

function categorieProdVerif() {
  const value = categorieProd.value;
  if (!value || value.length < 3) {
    showValidity({ index: 3, verification: false });
    forumValidity.categorie = false;
  } else {
    showValidity({ index: 3, verification: true });
    forumValidity.categorie = true;
  }
}

function descriptionProdVerif() {
  const value = descriptionProd.value;
  if (!value || value.length < 5) {
    showValidity({ index: 4, verification: false });
    forumValidity.description = false;
  } else {
    showValidity({ index: 4, verification: true });
    forumValidity.description = true;
  }
}

function showValidity({ index, verification }) {
  if (verification) {
    IconsValidity[index].style.display = "inline";
    IconsError[index].style.display = "none";
    ErrorMessage[index].style.display = "none";
  } else {
    IconsValidity[index].style.display = "none";
    IconsError[index].style.display = "inline";
    ErrorMessage[index].style.display = "block";
  }
}

const form = document.querySelector("form");
const container = document.querySelector(".container");

async function handleSubmit(e) {
  e.preventDefault();

  const keys = Object.keys(forumValidity);
  const failedInput = keys.filter(key => !forumValidity[key]);

  if (failedInput.length === 0) {
    const data = {
      title: nameProd.value,
      price: parseFloat(prixProd.value),
      image: imgProd.value,
      category: categorieProd.value,
      description: descriptionProd.value
    };

    const response = await fetch("https://fakestoreapi.com/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    if (response.ok) {
      location.assign("./index.html");
    }
  } else {
    failedInput.forEach(key => {
      showValidity({ index: keys.indexOf(key), verification: false });
    });

    container.classList.add("shake");
    setTimeout(() => container.classList.remove("shake"), 400);
  }
}

async function ModifyProd(e) {
  e.preventDefault();

  const data = {
    title: nameProd.value,
    price: parseFloat(prixProd.value),
    image: imgProd.value,
    category: categorieProd.value,
    description: descriptionProd.value
  };

  const response = await fetch("https://fakestoreapi.com/products/" + id, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

  if (response.ok) {
    location.assign("./index.html");
  }
}

if (!id) {
  form.addEventListener("submit", handleSubmit);
} else {
  form.addEventListener("submit", ModifyProd);
}
