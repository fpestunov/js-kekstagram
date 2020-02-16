"use strict";

(function() {
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

  window.render = function(data) {
    var photos = picturesListElement.querySelectorAll(".picture");
    if (photos.length > 0) {
      window.util.clearElements(picturesListElement, photos);
    }
    for (var i = 0; i < data.length; i++) {
      picturesListElement.appendChild(
        window.util.getFragment(renderPicture(data[i], i))
      );
    }
  };
})();
