"use strict";

const tableBody = document.querySelector("tbody");

const modalWrapper = document.querySelector(".modal-wrapper");
const bookForm = document.forms["book-form"];

// library array to store all Book instances
const library = [];

// constructor for Book objects
function Book({ title, author, pages, read }) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.read = !!read; // if it's present, true, if undefined then false
}

Book.prototype.generateButton = function (
  index,
  callback,
  className,
  title = className
) {
  const btn = document.createElement("button");
  btn.textContent = title;
  btn.classList.add("action", className);
  btn.dataset.id = index;
  btn.addEventListener("click", (e) => callback(e.target.dataset.id));
  return btn;
};

Book.prototype.toggleRead = function () {
  this.read = !this.read;
  displayLibrary();
};

function removeFromLibrary(index) {
  library.splice(index, 1);
  displayLibrary();
}

function editBookFromLibrary(index) {
  const book = library[index];
  bookForm.dataset.id = index;
  bookForm.querySelector("button").textContent = "Edit Book";
  Object.entries(book).forEach(([key, value]) => {
    console.log(key, value);
    bookForm.elements[key].value = value;
  });
}

function updateBookInLibrary(index, book) {
  library[index] = book;
  displayLibrary();
}

// add a newly created Book to the library
function addBookToLibrary(book) {
  library.push(book);
  displayLibrary();
}

function displayLibrary() {
  tableBody.replaceChildren();

  library.forEach((book, index) => {
    const row = document.createElement("tr");
    Object.entries(book).forEach(([key, value]) => {
      if (key === "read") return;

      const cell = document.createElement("td");
      cell.textContent = value;
      cell.classList.add(key);
      row.appendChild(cell);
    });

    const btns = [
      book.generateButton(
        index,
        book.toggleRead.bind(book),
        "read",
        book.read ? "read" : "not read"
      ),
      book.generateButton(index, editBookFromLibrary, "edit"),
      book.generateButton(index, removeFromLibrary, "remove"),
    ];
    btns.forEach((btn) => {
      const cell = document.createElement("td");
      cell.classList.add("action");
      cell.appendChild(btn);
      row.appendChild(cell);
    });
    tableBody.appendChild(row);
  });
}

function handleFormSubmit(e) {
  e.preventDefault();
  const data = new FormData(e.target);
  const bookData = {};
  data.forEach((value, key) => {
    bookData[key] = value;
  });
  const book = new Book(bookData);
  const index = e.target.dataset.id;
  if (index) {
    updateBookInLibrary(index, book);
    e.target.removeAttribute("data-id");
    e.target.querySelector("button").textContent = "Add Book";
    e.target.reset();
  } else addBookToLibrary(new Book(book));
}

bookForm.addEventListener("submit", handleFormSubmit);

// dummy data
addBookToLibrary(
  new Book({
    title: "The Fellowship of the Ring",
    author: "J.R.R. Tolkien",
    pages: 986,
    read: true,
  })
);
addBookToLibrary(
  new Book({
    title: "The Two Towers",
    author: "J.R.R. Tolkien",
    pages: 784,
  })
);
addBookToLibrary(
  new Book({
    title: "The Return of the King",
    author: "J.R.R. Tolkien",
    pages: 1005,
  })
);
