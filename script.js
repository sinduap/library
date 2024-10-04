const STARTING_BOOKS = [
  {
    title: 'Eloquent JavaScript',
    author: 'Marijn Haverbee',
    year: 2024,
    coverUrl: 'https://eloquentjavascript.net/img/cover.jpg',
    status: 'finished',
    review:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellendus deleniti id consequatur suscipit deserunt eligendi aliquam dolorem voluptate delectus at ab iure quo, architecto eveniet voluptatibus dolores neque nemo sed temporibus nam accusantium, illo, optio harum impedit! Cum, error deleniti!',
  },
  {
    title: 'Clean Code',
    author: 'Robert C. Martin',
    year: 2012,
    coverUrl: 'https://m.media-amazon.com/images/I/51E2055ZGUL._SL1000_.jpg',
    status: 'to-read',
    review:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellendus deleniti id consequatur suscipit deserunt eligendi aliquam dolorem voluptate delectus at ab iure quo, architecto eveniet voluptatibus dolores neque nemo sed temporibus nam accusantium, illo, optio harum impedit! Cum, error deleniti!',
  },
];

let books = STARTING_BOOKS.map(
  ({ title, author, year, coverUrl, status, review }) =>
    new Book(title, author, year, status, coverUrl, review)
);

const formAddBook = document.querySelector('.form--add-book');
const btnAddBook = document.querySelector('.btn--add-book');
const btnCancel = document.querySelector('.btn--cancel');
const dialogAddBook = document.querySelector('.dialog--add-book');
const dialogBookDetail = document.querySelector('.dialog--book-detail');
const library = document.querySelector('.library');

function Book(title, author, year, status, coverUrl, review) {
  this.id = String(Math.random());
  this.title = title;
  this.author = author;
  this.year = year;
  this.coverUrl = coverUrl;
  this.status = status;
  this.review = review;
}

Book.prototype.updateStatus = function (newStatus) {
  this.status = newStatus;
};

function handleAddBook() {
  const formData = new FormData(formAddBook);
  const book = new Book(...formData.values());
  books.push(book);
  formAddBook.reset();
  renderBooks(books);
}

function handleClickBackdrop(e) {
  const dialog = e.target.closest('.dialog');
  if (!dialog) return;
  const dialogRect = dialog.getBoundingClientRect();

  const isInDialog =
    e.clientY >= dialogRect.top &&
    e.clientY <= dialogRect.bottom &&
    e.clientX >= dialogRect.left &&
    e.clientX <= dialogRect.right;

  if (isInDialog) return;
  formAddBook.reset();
  dialog.close();
}

function renderBooks(books) {
  const booksHtml = books
    .map(
      book => `<article data-id="${book.id}" class="book ${
        book.status === 'finished' ? 'finished' : ''
      }">
            <picture class="book__img-box">
              <img
                src="${book.coverUrl || 'images/book-cover.png'}"
                alt="${book.title} cover"
                class="book__img"
              />
            </picture>
            <h1 class="book__title">${book.title}</h1>
            <h2 class="book__author">${book.author}</h2>
            <div class="book__controls">
              <i title="finish" class="book__read ph-bold ph-check"></i>
              <i title="detail" class="book__detail ph-bold ph-eye"></i>
              <i title="delete" class="book__delete ph-bold ph-trash"></i>
            </div>
          </article>`
    )
    .join('');
  library.innerHTML = '';
  library.insertAdjacentHTML('afterbegin', booksHtml);
}

function handleClickBook(e) {
  const bookEl = e.target.closest('.book');
  if (!bookEl) return;

  const { id } = bookEl.dataset;
  const book = books.find(b => b.id === id);

  const toggleReadBtn = e.target.closest('.book__read');
  if (toggleReadBtn) {
    if (book.status === 'finished') {
      book.updateStatus('to-read');
    } else {
      book.updateStatus('finished');
    }
    renderBooks(books);
    return;
  }

  const deleteBookBtn = e.target.closest('.book__delete');
  if (deleteBookBtn) {
    books = books.filter(b => b.id !== id);
    renderBooks(books);
    return;
  }

  dialogBookDetail.innerHTML = '';
  const bookDetailHtml = `<h1>Book details</h1>
      <article class="book-detail">
        <picture class="book-detail__img">
          <img
            src="${book.coverUrl || 'images/book-cover.png'}"
            alt="${book.title}"
          />
        </picture>
        <section>
          <dl class="book-detail__info">
            <dt>Title</dt>
            <dd>${book.title}</dd>
            <dt>Author</dt>
            <dd>${book.author}</dd>
            <dt>Year</dt>
            <dd>${book.year || 'N/A'}</dd>
            <dt>Status</dt>
            <dd>${book.status[0].toUpperCase() + book.status.slice(1)}</dd>
            <dt>Review</dt>
            <dd>${book.review}</dd>
          </dl>
        </section>
      </article>`;
  dialogBookDetail.insertAdjacentHTML('afterbegin', bookDetailHtml);
  dialogBookDetail.showModal();
}

function handleClickAddBook() {
  dialogAddBook.showModal();
  dialogAddBook.scrollTo({ top: 0 });
}

function handleClickCancel() {
  formAddBook.reset();
  dialogAddBook.close();
}

function init() {
  renderBooks(books);
}

window.addEventListener('load', init);
btnAddBook.addEventListener('click', handleClickAddBook);
btnCancel.addEventListener('click', handleClickCancel);
formAddBook.addEventListener('submit', handleAddBook);
window.addEventListener('mousedown', handleClickBackdrop);
library.addEventListener('click', handleClickBook);
