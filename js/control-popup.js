"use strict";

(function() {
  var deleteElement = function(element) {
    window.util.placeForIncert.removeChild(element);
  };

  window.controlPopup = {
    controlErrorWindow: function() {
      var errorContainer = document.querySelector(".error");
      var errorBlock = errorContainer.querySelector(".error__inner");
      var errorButton = errorContainer.querySelector(".error__button");

      errorButton.setAttribute("tab-index", 0);

      var onCloseErrorWindow = function() {
        deleteElement(errorContainer);
        errorButton.removeEventListener("click", onCloseErrorWindow);
        errorContainer.removeEventListener("click", onOutClick);
        document.removeEventListener("keydown", onEscErrorWindow);
        errorButton.removeEventListener("keydown", onEnterErrorButton);
      };

      var onOutClick = function(evt) {
        var target = evt.target;
        if (target !== errorBlock) {
          onCloseErrorWindow();
        }
      };

      var onEscErrorWindow = function(evt) {
        window.util.isEsc(evt, onCloseErrorWindow);
      };

      var onEnterErrorButton = function(evt) {
        window.util.isEnter(evt, onCloseErrorWindow);
      };

      errorButton.addEventListener("click", onCloseErrorWindow);
      errorContainer.addEventListener("click", onOutClick);
      document.addEventListener("keydown", onEscErrorWindow);
      errorButton.addEventListener("keydown", onEnterErrorButton);
    },

    controlSuccessWindow: function() {
      var successContainer = document.querySelector(".success");
      var successBlock = successContainer.querySelector(".success__inner");
      var successButton = successContainer.querySelector(".success__button");

      successButton.setAttribute("tab-index", 0);

      var onCloseSuccessWindow = function() {
        deleteElement(successContainer);
        successButton.removeEventListener("click", onCloseSuccessWindow);
        successContainer.removeEventListener("click", onOutClick);
        document.removeEventListener("keydown", onEscSuccessWindow);
        successButton.removeEventListener("keydown", onEnterSuccessButton);
      };

      var onOutClick = function(evt) {
        var target = evt.target;
        if (target !== successBlock) {
          onCloseSuccessWindow();
        }
      };

      var onEscSuccessWindow = function(evt) {
        window.util.isEsc(evt, onCloseSuccessWindow);
      };

      var onEnterSuccessButton = function(evt) {
        window.util.isEnter(evt, onCloseSuccessWindow);
      };

      successButton.addEventListener("click", onCloseSuccessWindow);
      successContainer.addEventListener("click", onOutClick);
      document.addEventListener("keydown", onEscSuccessWindow);
      successButton.addEventListener("keydown", onEnterSuccessButton);
    }
  };
})();
