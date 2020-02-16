"use strict";

(function() {
  var ESC_KEYCODE = 27;
  var ENTER_KEYCODE = 13;
  window.util = {
    getRandomValue: function(range) {
      return Math.floor(Math.random() * range);
    },
    isEsc: function(evt, action) {
      if (evt.keyCode === ESC_KEYCODE) {
        action();
      }
    },
    isEntr: function(evt, action) {
      if (evt.keyCode === ENTER_KEYCODE) {
        action(evt);
      }
    },
    getFragment: function(renderFragment) {
      var fragment = document.createDocumentFragment();
      fragment.appendChild(renderFragment);
      return fragment;
    },
    clearElements: function(parrentElement, deletedElements) {
      for (var i = 0; i < deletedElements.length; i++) {
        parrentElement.removeChild(deletedElements[i]);
      }
    },

    placeForIncert: document.querySelector("main")
  };
})();
