"use strict";

(function() {
  var URL = "https://js.dump.academy/kekstagram/data";
  var URL_FOR_SEND = "https://js.dump.academy/kekstagram";
  var TIMEOUT = 10000;
  var CODE_SUCCESS = 200;

  window.backend = {
    load: function(onSuccess, onError) {
      var xhr = new XMLHttpRequest();
      xhr.responseType = "json";
      xhr.addEventListener("load", function() {
        if (xhr.status === CODE_SUCCESS) {
          onSuccess(xhr.response);
        } else {
          onError("Статус ответа: " + xhr.status + " " + xhr.statusText);
        }
      });
      xhr.addEventListener("error", function() {
        onError("Произошла ошибка соединения");
      });
      xhr.addEventListener("timeout", function() {
        onError("Запрос не успел выполниться за " + xhr.timeout + " мс");
      });

      xhr.timeout = TIMEOUT;

      xhr.open("GET", URL);
      xhr.send();
    },
    save: function(data, onLoad, onError) {
      var xhr = new XMLHttpRequest();
      xhr.responseType = "json";

      xhr.addEventListener("loadstart", function() {
        window.messages.openLoadWindow();
      });

      xhr.addEventListener("loadend", function() {
        window.messages.deleteLoadWindow();
      });

      xhr.addEventListener("load", function() {
        if (xhr.status === CODE_SUCCESS) {
          onLoad(xhr.response);
        } else {
          onError("Статус ответа: " + xhr.status + " " + xhr.statusText);
        }
      });
      xhr.addEventListener("error", function() {
        onError("Произошла ошибка соединения");
      });
      xhr.addEventListener("timeout", function() {
        onError("Запрос не успел выполниться за " + xhr.timeout + " мс");
      });

      xhr.timeout = TIMEOUT;

      xhr.open("POST", URL_FOR_SEND);
      xhr.send(data);
    }
  };
})();
