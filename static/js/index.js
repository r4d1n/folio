"use strict";

// load an image and remove placeholder sibling node
const lazyLoad = img => {
  img.setAttribute('src', img.getAttribute('data-src'));
  img.onload = event => {
    img.removeAttribute('data-src');
    if (img.nextElementSibling) {
      img.parentNode.removeChild(img.nextElementSibling);
    }
  }
}

// check if image is visible or will be soon
const inViewport = el => el.getBoundingClientRect().top < (window.innerHeight + 150);

// event handler to lazy load images in the viewport
const imageLoadHandler = event => {
  let images = Array.from(document.querySelectorAll("img[data-src]"))
    .filter(img => inViewport(img))
    .map(img => lazyLoad(img));
}

document.addEventListener("DOMContentLoaded", imageLoadHandler);
document.addEventListener("scroll", imageLoadHandler);
