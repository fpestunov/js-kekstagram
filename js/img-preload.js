"use strict";

(function() {
  var FILE_TYPES = ["gif", "jpeg", "jpg", "png"];
  var fileChooser = document.querySelector(".img-upload__input");

  fileChooser.addEventListener("change", function() {
    var previewContainer = document.querySelector(".img-upload__preview");
    var preview = previewContainer.querySelector("img");
    var effectsPreviewItems = document.querySelectorAll(".effects__preview");

    var file = fileChooser.files[0];
    var fileName = file.name.toLowerCase();

    var matches = FILE_TYPES.some(function(it) {
      return fileName.endsWith(it);
    });

    if (matches) {
      var reader = new FileReader();

      reader.addEventListener("load", function() {
        preview.src = reader.result;
        for (var i = 0; i < effectsPreviewItems.length; i++) {
          effectsPreviewItems[i].style.backgroundImage =
            "url(" + reader.result + ")";
        }
      });

      reader.readAsDataURL(file);
    }
  });
})();
