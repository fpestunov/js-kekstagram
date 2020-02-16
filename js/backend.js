"use strict";

(function() {
  var URL = "https://js.dump.academy/kekstagram/data";
  var URL_FOR_SEND = "https://js.dump.academy/kekstagram";

  window.backend = {
    load: function(onSuccess, onError) {
      var xhr = new XMLHttpRequest();
      xhr.responseType = "json";
      xhr.addEventListener("load", function() {
        if (xhr.status === 200) {
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

      xhr.timeout = 10000;

      xhr.open("GET", URL);
      xhr.send();
    },
    save: function(data, onLoad, onError) {
      var xhr = new XMLHttpRequest();
      xhr.responseType = "json";

      xhr.addEventListener("loadstart", function() {
        window.messages.loadWindow();
      });

      xhr.addEventListener("loadend", function() {
        window.messages.deleteLoadWindow();
      });

      xhr.addEventListener("load", function() {
        if (xhr.status === 200) {
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

      xhr.timeout = 10000;

      xhr.open("POST", URL_FOR_SEND);
      xhr.send(data);
    }
  };
})();
