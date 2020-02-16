"use strict";

(function() {
  var errorTemplate = document
    .querySelector("#error")
    .content.querySelector(".error");

  var successTemplate = document
    .querySelector("#success")
    .content.querySelector(".success");

  var loadTemplate = document
    .querySelector("#messages")
    .content.querySelector(".img-upload__message--loading");

  window.messages = {
    errorWindow: function(message, statusButton) {
      var errorElement = errorTemplate.cloneNode(true);
      errorElement.querySelector(".error__title").textContent = message;
      if (statusButton === false) {
        errorElement.querySelector(".error__buttons").classList.add("hidden");
      }
      window.util.placeForIncert.appendChild(
        window.util.getFragment(errorElement)
      );
    },

    successWindow: function() {
      var successElement = successTemplate.cloneNode(true);
      window.util.placeForIncert.appendChild(
        window.util.getFragment(successElement)
      );
    },

    loadWindow: function() {
      var loadWindow = loadTemplate.cloneNode(true);
      window.util.placeForIncert.appendChild(
        window.util.getFragment(loadWindow)
      );
    },

    deleteLoadWindow: function() {
      var loadWindow = document.querySelector(".img-upload__message--loading");
      window.util.placeForIncert.removeChild(loadWindow);
    }
  };
})();
