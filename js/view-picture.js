"use strict";

(function() {
  var bigPicture = document.querySelector(".big-picture");
  var previewElement = {
    previewImg: bigPicture.querySelector("img"),
    descriptionImg: bigPicture.querySelector(".social__caption"),
    likesCount: bigPicture.querySelector(".likes-count"),
    commentsCount: bigPicture.querySelector(".comments-count"),
    bigPictureCancel: bigPicture.querySelector(".big-picture__cancel")
  };

  var onClickCloseBigImg = function() {
    bigPicture.classList.add("hidden");
    previewElement.bigPictureCancel.removeEventListener(
      "click",
      onClickCloseBigImg
    );
    document.removeEventListener("keydown", onEscCloseBigImg);
  };

  var onEscCloseBigImg = function(evt) {
    window.util.isEsc(evt, onClickCloseBigImg);
  };

  var onEnterCloseBigImg = function(evt) {
    window.util.isEnter(evt, onClickCloseBigImg);
  };

  var openBigImg = function(evt) {
    var target = evt.target;
    if (target.classList.contains("picture__img")) {
      var srcAttribute = target.getAttribute("src");
      var numberPhoto = target.getAttribute("data-number");
      bigPicture.classList.remove("hidden");
      previewElement.previewImg.setAttribute("src", srcAttribute);
      previewElement.previewImg.setAttribute(
        "alt",
        window.photos[numberPhoto].description
      );
      previewElement.descriptionImg.textContent =
        window.photos[numberPhoto].description;
      previewElement.likesCount.textContent = window.photos[numberPhoto].likes;
      previewElement.commentsCount.textContent =
        window.photos[numberPhoto].comments.length;

      previewElement.bigPictureCancel.addEventListener(
        "click",
        onClickCloseBigImg
      );
      previewElement.bigPictureCancel.addEventListener(
        "keydown",
        onEnterCloseBigImg
      );
      document.addEventListener("keydown", onEscCloseBigImg);
    }
  };

  document.addEventListener("click", openBigImg);
})();
