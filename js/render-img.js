"use strict";

(function() {
  var pictureTemplate = document
    .querySelector("#picture")
    .content.querySelector(".picture");

  var renderPicture = function(picture) {
    var pictureElement = pictureTemplate.cloneNode(true);
    pictureElement
      .querySelector(".picture__img")
      .setAttribute("src", picture.url);
    pictureElement
      .querySelector(".picture__img")
      .setAttribute("alt", picture.description);
    pictureElement.querySelector(".picture__comments").textContent =
      picture.commentsQuantity;
    pictureElement.querySelector(".picture__likes").textContent = picture.likes;

    return pictureElement;
  };

  window.getFragment = function(collectionFragments) {
    var fragment = document.createDocumentFragment();

    for (var i = 0; i < collectionFragments.length; i++) {
      fragment.appendChild(renderPicture(collectionFragments[i]));
    }
    return fragment;
  };
})();
