"use strict";

const lazyLoad = (img) => {
  img.src = img.dataset.src;
  img.onload = event => img.removeAttribute('data-src');
}

document.addEventListener("DOMContentLoaded", (event) => {
  let images = Array.from(document.querySelectorAll("img.portfolio-img"));

  images.forEach(img => {
    lazyLoad(img);
  });
});
