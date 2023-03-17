import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchImages } from './fetchImages';

const lightbox = new SimpleLightbox('.gallery a');

const formEl = document.querySelector('#search-form');
const galleryEl = document.querySelector('.gallery');
const loadMoreEl = document.querySelector('.load-more');

const pagination = {
  page: 1,
  per_page: 40,
  total: 0,
};

loadMoreEl.classList.add('hidden');

formEl.addEventListener('submit', onFormSubmit);
loadMoreEl.addEventListener('click', onLoadMoreClick);

async function onFormSubmit(event) {
  event.preventDefault();
  clearGallery();

  pagination.page = 1;
  const images = await fetchImages(pagination.page);
  renderImages(images);
}

async function onLoadMoreClick() {
  pagination.page += 1;
  const images = await fetchImages(pagination.page);
  renderImages(images);
}

function renderImages(images) {
  if (images.length === 0) {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  } else {
    if (pagination.page === 1) {
      galleryEl.innerHTML = '';
    }
    const markup = createMarkup(images);
    galleryEl.insertAdjacentHTML('beforeend', markup);
    if (images.length < pagination.per_page) {
      loadMoreEl.classList.add('hidden');
      if (pagination.page === 1) {
        Notify.warning("We're sorry, but there are no more search results.");
      }
    } else {
      loadMoreEl.classList.remove('hidden');
    }
    lightbox.refresh();
  }
}

function createMarkup(hits) {
  const markup = hits
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `<div class="photo-card"><a href="${largeImageURL}"><img src="${webformatURL}" alt="${tags}" loading="lazy" width=300 height=300/></a>

  <div class="info">
    <p class="info-item">
      <b>Likes <span>${likes}</span></b>
    </p>
    <p class="info-item">
      <b>Views <span>${views}</span></b>
    </p>
    <p class="info-item">
      <b>Comments <span>${comments}</span></b>
    </p>
    <p class="info-item">
      <b>Downloads <span>${downloads}</span></b>
    </p>
  </div>
</div>`;
      }
    )
    .join('');

  return markup;
}

function clearGallery() {
  galleryEl.innerHTML = '';
}
