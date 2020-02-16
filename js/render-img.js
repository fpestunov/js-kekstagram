"use strict";

(function() {
  window.photos = [];

  var pictureTemplate = document
    .querySelector("#picture")
    .content.querySelector(".picture");

  var picturesListElement = document.querySelector(".pictures");

  var renderPicture = function(picture, index) {
    var pictureElement = pictureTemplate.cloneNode(true);
    pictureElement
      .querySelector(".picture__img")
      .setAttribute("src", picture.url);
    pictureElement
      .querySelector(".picture__img")
      .setAttribute("alt", picture.description);
    pictureElement.querySelector(".picture__comments").textContent =
      picture.comments.length;
    pictureElement.querySelector(".picture__likes").textContent = picture.likes;
    pictureElement
      .querySelector(".picture__img")
      .setAttribute("data-number", index);

    return pictureElement;
  };

  var getFragment = function(data) {
    var fragment = document.createDocumentFragment();

    for (var i = 0; i < data.length; i++) {
      fragment.appendChild(renderPicture(data[i], i));
    }
    picturesListElement.appendChild(fragment);
  };

  var onSuccess = function(images) {
    getFragment(images);
    window.photos = images;
  };

  var onError = function(errorMessage) {
    window.errorWindow(errorMessage);
  };

  window.load(onSuccess, onError);
})();
