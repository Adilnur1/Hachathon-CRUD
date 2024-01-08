const API = "http://localhost:8000/phones";
let inpName = document.querySelector("#inpName");
let inpAuthor = document.querySelector("#inpAuthor");
let inpImg = document.querySelector("#inpImg");
let inpPrice = document.querySelector("#inpPrice");
let inpAdditionalInfo = document.querySelector("#inpAdditionalInfo");
let btnAdd = document.querySelector("#btnAdd");
let sectionBooks = document.querySelector("#sectionBooks");
let btnOpenForm = document.querySelector("#collapseThree");
let inpSearch = document.querySelector("#inpSearch");
let searchValue = "";
let countPage = 1;
let currentPage = 1;
let prevBtn = document.querySelector("#prevBtn");
let nextBtn = document.querySelector("#nextBtn");
let container1 = document.querySelector(".container1");
let qq = document.querySelector(".qq");

btnAdd.addEventListener("click", () => {
  if (
    !inpName.value.trim() ||
    !inpAuthor.value.trim() ||
    !inpImg.value.trim() ||
    !inpPrice.value.trim()
  ) {
    alert("Заполните все поля");
    return;
  }
  let newBook = {
    bookName: inpName.value,
    bookAuthor: inpAuthor.value,
    bookImg: inpImg.value,
    bookPrice: inpPrice.value,
  };
  createBook(newBook);
  readBooks();
});
//! ===================================CREATE=================================
function createBook(book) {
  fetch(API, {
    method: "POST",
    headers: {
      "Content-type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(book),
  });
  btnOpenForm.classList.toggle("show");

  inpName.value = "";
  inpAuthor.value = "";
  inpImg.value = "";
  inpPrice.value = "";
}
//! ==============================READ=============================
async function readBooks() {
  const res = await fetch(
    `${API}?q=${searchValue}&_page=${currentPage}&_limit=3`
  );
  const data = await res.json();
  sectionBooks.innerHTML = "";
  data.forEach((elem) => {
    sectionBooks.innerHTML += `
    <div id="qq" class="card m-4 cardBook" style="width: 15rem">
    <img style="height:280px" src="${elem.bookImg}" alt="${elem.bookName}" />
    <div class="card-body">
      <h5 class="card-title">${elem.bookName}</h5>
      <p class="card-text">${elem.bookAuthor}</p>
      <span>${elem.bookPrice}</span>
      <button class="btn btn-outline-danger btnDelete" id="${elem.id}">Удалить</button>
      <button data-bs-toggle="modal" data-bs-target="#exampleModal" class="btn btn-outline-warning btnEdit" id="${elem.id}">Редактировать</button>
      <button class="btn btn-outline-info btnDetails" id="${elem.id}">Детали</button>
      <button class="btn btn-outline-success btnAddToCart" id="${elem.id}">Добавить в корзину</button>
    </div>
  </div>
    `;
  });
  pageFunc();
}

readBooks();
// ! ==========================DELETE===============================
document.addEventListener("click", (e) => {
  let del_id = e.target.id;
  let del_class = [...e.target.classList];
  if (del_class.includes("btnDelete")) {
    fetch(`${API}/${del_id}`, {
      method: "DELETE",
    }).then(() => readBooks());
  }
});
// ! ==========================EDIT===============================
let editInpName = document.querySelector("#editInpName");
let editInpAuthor = document.querySelector("#editInpAuthor");
let editInpImg = document.querySelector("#editInpImg");
let editInpPrice = document.querySelector("#editInpPrice");
let editBtnSave = document.querySelector("#editBtnSave");
document.addEventListener("click", (e) => {
  let edit_class = [...e.target.classList];
  if (edit_class.includes("btnEdit")) {
    let id = e.target.id;
    fetch(`${API}/${id}`)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        editInpName.value = data.bookName;
        editInpAuthor.value = data.bookAuthor;
        editInpImg.value = data.bookImg;
        editInpPrice.value = data.bookPrice;
        editBtnSave.setAttribute("id", data.id);
      });
  }
});
editBtnSave.addEventListener("click", () => {
  let editedBook = {
    bookName: editInpName.value,
    bookAuthor: editInpAuthor.value,
    bookImg: editInpImg.value,
    bookPrice: editInpPrice.value,
  };
  editBook(editedBook, editBtnSave.id);
});

function editBook(editBook, id) {
  fetch(`${API}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(editBook),
  }).then(() => readBooks());
}
// ! ==========================SEARCH===============================
inpSearch.addEventListener("input", (e) => {
  searchValue = e.target.value.trim();
  readBooks();
  if (!currentPage == currentPage) {
    return;
  }
});
// ! ==========================PAGINATION===============================
function pageFunc() {
  fetch(`${API}?q=5${searchValue}`)
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      countPage = Math.ceil(data.length / 3);
    });
}
prevBtn.addEventListener("click", () => {
  if (currentPage <= 1) return;
  currentPage--;
  readBooks();
});
nextBtn.addEventListener("click", () => {
  if (currentPage >= countPage) return;
  currentPage++;
  readBooks();
});

// ! ==================== Детальный обзор ======================

document.addEventListener("click", (e) => {
  let details_class = [...e.target.classList];
  if (details_class.includes("btnDetails")) {
    let id = e.target.id;
    fetch(`${API}/${id}`)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        // Здесь вы можете заполнить модальное окно детальной информацией
        // Пример:
        document.getElementById("myModal").style.display = "block";
        document.querySelector("#myModal h2").innerText = data.bookName;

        // Создаем элемент изображения и устанавливаем его атрибут src
        let imgElement = document.createElement("img");
        imgElement.src = data.bookImg;
        imgElement.style.maxWidth = "200px";
        imgElement.style.height = "auto";

        // Получаем элемент, куда добавим изображение, и очищаем его
        let imgContainer = document.getElementById("myModalImageContainer");
        imgContainer.innerHTML = "";

        // Добавляем изображение в контейнер внутри модального окна
        imgContainer.appendChild(imgElement);

        // Остальные данные (автор и цена)
        document.querySelector(
          "#myModal p"
        ).innerText = `Автор: ${data.bookAuthor}\nЦена: ${data.bookPrice}`;
      });
  }
});

function openModal() {
  document.getElementById("myModal").style.display = "block";
}

// Закрывает модальное окно
function closeModal() {
  document.getElementById("myModal").style.display = "none";
}

// Закрывает модальное окно, если пользователь кликнул вне его
window.onclick = function (event) {
  var modal = document.getElementById("myModal");
  if (event.target === modal) {
    modal.style.display = "none";
  }
};

// ! -----------------------------------------------

// Получаем элементы, связанные с корзиной
let cartIcon = document.getElementById("cartIcon");
let cartModal = document.getElementById("cartModal");
let cartContent = document.getElementById("cartContent");

// Добавление слушателя на кнопку "Добавить в корзину"
sectionBooks.addEventListener("click", (e) => {
  if (e.target.classList.contains("btnAddToCart")) {
    let bookId = e.target.id;
    addToCart(bookId);
  }
});

// Добавление товара в корзину
function addToCart(bookId) {
  fetch(`${API}/${bookId}`)
    .then((res) => res.json())
    .then((data) => {
      let cartItem = document.createElement("div");
      cartItem.classList.add("cart-item");
      cartItem.innerHTML = `
        <div class="cart-item-details">
          <p>${data.bookName}</p>
          <p>${data.bookPrice}</p>
        </div>
        <button class="btn btn-danger btnRemoveFromCart" id="${data.id}">Удалить</button>
      `;
      cartContent.appendChild(cartItem);
    });
}

// Добавление слушателя на иконку корзины в Navbar
cartIcon.addEventListener("click", () => {
  openCartModal();
});

// Открывает модальное окно корзины
function openCartModal() {
  cartModal.style.display = "block";
}

// ... (ваш JavaScript-код) ...

// ... (ваш JavaScript-код) ...

// Закрывает модальное окно корзины
function closeCartModal() {
  cartModal.style.display = "none";
}

// ... (ваш JavaScript-код) ...
