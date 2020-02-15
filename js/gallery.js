"use strict";

(function() {
  var photoList = [];

  var getListAuthor = function() {
    var authors = {};
    authors.avatar =
      "img/avatar-" + (window.util.getRandomValue(5) + 1) + ".svg";
    authors.message =
      window.date.commentsList[
        window.util.getRandomValue(window.date.commentsList.length)
      ];
    authors.name =
      window.date.namesAuthor[
        window.util.getRandomValue(window.date.namesAuthor.length)
      ];

    return authors;
  };

  var getListImages = function(maxIndex, images) {
    for (var i = 0; i < maxIndex; i++) {
      images[i] = {};
      images[i].url = "photos/" + (i + 1) + ".jpg";
      images[i].description = "Мяу!";
      images[i].likes = window.util.getRandomValue(185) + 15;
      images[i].commentsQuantity =
        window.util.getRandomValue(window.date.maxCommentQuantity) + 1;
      images[i].comments = [];
      for (var j = 0; j < images[i].commentsQuantity; j++) {
        images[i].comments[j] = getListAuthor();
      }
    }
  };
  getListImages(window.date.photoQuantity, photoList);

  window.date.picturesListElement.appendChild(window.getFragment(photoList));
})();
