"use strict";

(function() {
  var bigPicture = document.querySelector(".big-picture");
  var previewElement = {
    previewImg: bigPicture.querySelector("img"),
    descriptionImg: bigPicture.querySelector(".social__caption"),
    likesCount: bigPicture.querySelector(".likes-count"),
    commentCountActive: bigPicture.querySelector(".comments-count__active"),
    commentsCount: bigPicture.querySelector(".comments-count"),
    bigPictureCancel: bigPicture.querySelector(".big-picture__cancel"),
    commentsLoader: bigPicture.querySelector(".social__comments-loader")
  };

  var commentsList = bigPicture.querySelector(".social__comments");

  var addComments = function(numberPhoto, startIndex) {
    var commentsData = window.photos[numberPhoto].comments;

    var endIndex =
      startIndex + 5 > commentsData.length
        ? commentsData.length
        : startIndex + 5;

    if (endIndex === commentsData.length) {
      previewElement.commentsLoader.classList.add("hidden");
    }

    for (var i = startIndex; i < endIndex; i++) {
      var commentItem = document.createElement("li");
      commentItem.setAttribute("class", "social__comment social__text");

      var commentAvatar = document.createElement("img");
      commentAvatar.setAttribute("src", commentsData[i].avatar);
      commentAvatar.setAttribute("alt", commentsData[i].name);
      commentAvatar.setAttribute("class", "social__picture");

      var commentText = document.createElement("p");
      commentText.textContent = commentsData[i].message;

      commentsList.insertAdjacentElement("beforeend", commentItem);
      commentItem.insertAdjacentElement("afterbegin", commentAvatar);
      commentItem.insertAdjacentElement("beforeend", commentText);
    }

    if (window.photos[numberPhoto].comments.length < 5) {
      previewElement.commentCountActive.textContent =
        window.photos[numberPhoto].comments.length;
    } else {
      previewElement.commentCountActive.textContent = endIndex;
    }
  };

  var onClickPreviewImg = function(evt) {
    var target = evt.target;
    if (target.classList.contains("picture")) {
      target = target.firstElementChild;
    }
    if (target.classList.contains("picture__img")) {
      var commentsCount = 0;

      document.removeEventListener("keydown", onEntrOpenBigImg);
      document.removeEventListener("click", onClickPreviewImg);

      var onLoadComments = function() {
        commentsCount = commentsCount + 5;
        addComments(numberPhoto, commentsCount);
      };

      var onEnterLoadComments = function(evtLoad) {
        window.util.isEntr(evtLoad, onLoadComments);
      };

      var onClickCloseBigImg = function() {
        bigPicture.classList.add("hidden");
        previewElement.commentsLoader.removeEventListener(
          "click",
          onLoadComments
        );
        previewElement.commentsLoader.removeEventListener(
          "keydown",
          onEnterLoadComments
        );

        previewElement.bigPictureCancel.removeEventListener(
          "click",
          onClickCloseBigImg
        );
        previewElement.bigPictureCancel.removeEventListener(
          "keydown",
          onEntrCloseBigImg
        );
        document.removeEventListener("keydown", onEscCloseBigImg);

        document.addEventListener("keydown", onEntrOpenBigImg);
        document.addEventListener("click", onClickPreviewImg);
      };

      var onEscCloseBigImg = function(evtClose) {
        window.util.isEsc(evtClose, onClickCloseBigImg);
      };

      var onEntrCloseBigImg = function(evtEntr) {
        window.util.isEntr(evtEntr, onClickCloseBigImg);
      };

      if (previewElement.commentsLoader.classList.contains("hidden")) {
        previewElement.commentsLoader.classList.remove("hidden");
      }

      var comments = bigPicture.querySelectorAll(".social__comment");
      window.util.clearElements(commentsList, comments);

      var srcAttribute = target.getAttribute("src");
      var numberPhoto = window.photos.findIndex(function(obj) {
        return obj.url === srcAttribute;
      });
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

      addComments(numberPhoto, commentsCount);

      previewElement.commentsLoader.addEventListener("click", onLoadComments);
      previewElement.commentsLoader.addEventListener(
        "keydown",
        onEnterLoadComments
      );

      previewElement.bigPictureCancel.addEventListener(
        "click",
        onClickCloseBigImg
      );
      previewElement.bigPictureCancel.addEventListener(
        "keydown",
        onEntrCloseBigImg
      );
      document.addEventListener("keydown", onEscCloseBigImg);
    }
  };

  var onEntrOpenBigImg = function(evt) {
    window.util.isEntr(evt, onClickPreviewImg);
  };

  document.addEventListener("keydown", onEntrOpenBigImg);
  document.addEventListener("click", onClickPreviewImg);
})();
