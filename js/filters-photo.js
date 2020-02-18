"use strict";

(function() {
  var COUNT_RANDOM_PHOTO = 10;
  var compare = function(a, b) {
    if (b.comments.length - a.comments.length === 0) {
      return b.likes - a.likes;
    } else {
      return b.comments.length - a.comments.length;
    }
  };

  var imgFilters = document.querySelector(".img-filters");
  window.photos = [];

  var updatePhotos = window.debounce(function(value) {
    var filteredPhotos = window.photos.slice();

    switch (value) {
      case "filter-random":
        filteredPhotos = [];
        while (filteredPhotos.length < COUNT_RANDOM_PHOTO) {
          var randomValue =
            window.photos[window.util.getRandomValue(window.photos.length)];
          if (filteredPhotos.indexOf(randomValue) === -1) {
            filteredPhotos.push(randomValue);
          }
        }
        break;
      case "filter-discussed":
        filteredPhotos.sort(compare);
        break;
      default:
        break;
    }

    window.render(filteredPhotos);
  });

  var onClickButton = function(evt) {
    var target = evt.target;
    var filtersList = imgFilters.querySelectorAll(".img-filters__button");

    if (!target.classList.contains("img-filters__button--active")) {
      for (var i = 0; i < filtersList.length; i++) {
        if (filtersList[i].classList.contains("img-filters__button--active")) {
          filtersList[i].classList.remove("img-filters__button--active");
        }

        target.classList.add("img-filters__button--active");
      }
      updatePhotos(target.id);
    }
  };

  imgFilters.addEventListener("click", onClickButton);

  var onSuccess = function(images) {
    window.photos = images;
    window.render(window.photos);
    imgFilters.classList.remove("img-filters--inactive");
  };

  var onError = function(errorMessage) {
    window.messages.openErrorWindow(errorMessage, false);
  };

  window.backend.load(onSuccess, onError);
})();
