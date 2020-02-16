"use strict";

(function() {
  window.getValidity = function(evt) {
    var target = evt.target;
    var hash = target.value;
    hash = hash.toUpperCase();
    var tags = hash.trim().split(/\s+/g);

    target.setCustomValidity("");

    if (tags.length > 5) {
      target.setCustomValidity("Количество хеш-тегов не может быть больше 5");
    }
    for (var i = 0; i < tags.length; i++) {
      if (tags[i] === "#") {
        target.setCustomValidity(
          "Хэш-тэг не может состоять только из символа #"
        );
      } else if (tags[i].indexOf("#", 0) !== 0) {
        target.setCustomValidity("Хэш-тэг должен начинаться с символа #");
      } else if (tags[i].length > 20) {
        target.setCustomValidity(
          "Хэш-тэг не может содержать больше 20 символов, включая #"
        );
      } else if (
        tags.indexOf(tags[i], 0) !== -1 &&
        tags.indexOf(tags[i], 0) !== i
      ) {
        target.setCustomValidity("Хэш-тэги не могут повторяться");
      }
    }
    return target.setCustomValidity;
  };
})();
