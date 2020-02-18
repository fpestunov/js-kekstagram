"use strict";

(function() {
  var bigPicture = document.querySelector(".big-picture");
  var commentsLoader = bigPicture.querySelector(".social__comments-loader");

  var commentsList = bigPicture.querySelector(".social__comments");

  var addComments = function(numberPhoto, startIndex) {
    var commentsData = window.photos[numberPhoto].comments;
    var commentCountActive = bigPicture.querySelector(
      ".comments-count__active"
    );

    var endIndex =
      startIndex + 5 > commentsData.length
        ? commentsData.length
        : startIndex + 5;

    if (endIndex === commentsData.length) {
      commentsLoader.classList.add("hidden");
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
      commentCountActive.textContent =
        window.photos[numberPhoto].comments.length;
    } else {
      commentCountActive.textContent = endIndex;
    }
  };

  var onClickPreviewImg = function(evt) {
    var target = evt.target;
    var previewImg = bigPicture.querySelector("img");
    var descriptionImg = bigPicture.querySelector(".social__caption");
    var likesCount = bigPicture.querySelector(".likes-count");
    var countComments = bigPicture.querySelector(".comments-count");
    var bigPictureCancel = bigPicture.querySelector(".big-picture__cancel");

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
        commentsLoader.removeEventListener("click", onLoadComments);
        commentsLoader.removeEventListener("keydown", onEnterLoadComments);

        bigPictureCancel.removeEventListener("click", onClickCloseBigImg);
        bigPictureCancel.removeEventListener("keydown", onEntrCloseBigImg);
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

      if (commentsLoader.classList.contains("hidden")) {
        commentsLoader.classList.remove("hidden");
      }

      var comments = bigPicture.querySelectorAll(".social__comment");
      window.util.clearElements(commentsList, comments);

      var srcAttribute = target.getAttribute("src");
      var numberPhoto = window.photos.findIndex(function(obj) {
        return obj.url === srcAttribute;
      });
      bigPicture.classList.remove("hidden");
      previewImg.setAttribute("src", srcAttribute);
      previewImg.setAttribute("alt", window.photos[numberPhoto].description);
      descriptionImg.textContent = window.photos[numberPhoto].description;
      likesCount.textContent = window.photos[numberPhoto].likes;

      countComments.textContent = window.photos[numberPhoto].comments.length;

      addComments(numberPhoto, commentsCount);

      commentsLoader.addEventListener("click", onLoadComments);
      commentsLoader.addEventListener("keydown", onEnterLoadComments);

      bigPictureCancel.addEventListener("click", onClickCloseBigImg);
      bigPictureCancel.addEventListener("keydown", onEntrCloseBigImg);
      document.addEventListener("keydown", onEscCloseBigImg);
    }
  };

  var onEntrOpenBigImg = function(evt) {
    window.util.isEntr(evt, onClickPreviewImg);
  };

  document.addEventListener("keydown", onEntrOpenBigImg);
  document.addEventListener("click", onClickPreviewImg);
})();
