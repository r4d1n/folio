"use strict";

// load an image and remove placeholder sibling node
const lazyLoad = img => {
  img.setAttribute('src', img.getAttribute('data-src'));
  img.onload = event => {
    img.removeAttribute('data-src');
    img.parentNode.parentNode.classList.remove("placeholder"); // parent of parent, because of the <a>
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

// toggle mobile nav open/closed
document.querySelector("nav#main-nav").addEventListener("click", e => {
  if (e.target.id === "menu-toggle") {
    e.stopPropagation();
    document.querySelector("ul#menu").classList.toggle("open");
  }
});
