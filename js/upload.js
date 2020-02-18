"use strict";

(function() {
  var DEFAULT_SCALE_VALUE = 100;
  var ARROW_LEFT = 37;
  var ARROW_RIGHT = 39;

  var uploadForm = document.querySelector(".img-upload__form");
  var uploadFormElements = {
    uploadFile: uploadForm.querySelector("#upload-file"),
    editWindow: uploadForm.querySelector(".img-upload__overlay"),
    closeButton: uploadForm.querySelector(".img-upload__cancel"),
    hashtagsInput: uploadForm.querySelector(".text__hashtags"),
    descriptionTextarea: uploadForm.querySelector(".text__description"),
    scaleControlValue: uploadForm.querySelector(".scale__control--value"),
    slideOfEffectLevel: uploadForm.querySelector(".img-upload__effect-level")
  };

  var scaleValue = DEFAULT_SCALE_VALUE;
  var currentEffect = "none";

  var imgPreview = uploadForm.querySelector("img");
  var imgUploadEffects = uploadForm.querySelector(".img-upload__effects");

  var effectLevelPin = uploadForm.querySelector(".effect-level__pin");
  var effectLevelValue = uploadForm.querySelector(".effect-level__value");
  var effectLevelDeepth = uploadForm.querySelector(".effect-level__depth");

  var setSizePreviewImg = function() {
    uploadFormElements.scaleControlValue.value = scaleValue + "%";
    imgPreview.style.transform = "scale(" + scaleValue / 100 + ")";
  };

  // Открытие/закрытие формы загрузки изображения
  var onClickEditWindowClose = function() {
    uploadFormElements.editWindow.classList.add("hidden");
    uploadFormElements.closeButton.removeEventListener(
      "click",
      onClickEditWindowClose
    );
    uploadFormElements.closeButton.removeEventListener(
      "keydown",
      onEnterEditWindowClose
    );
    document.removeEventListener("keydown", onEscEditWindow);
    uploadForm.removeEventListener("click", onChangeScaleImg);
    uploadForm.removeEventListener("keydown", onEntrChangeScaleImg);
    effectLevelPin.removeEventListener("mousedown", ChangeDepthEffect);
    effectLevelPin.removeEventListener("mousedown", onKeyChangeDepthEffect);
    imgUploadEffects.removeEventListener("change", selectEffect);

    uploadFormElements.hashtagsInput.removeEventListener(
      "input",
      window.getValidity
    );

    // Установка первоначальных значений
    uploadFormElements.hashtagsInput.value = null;
    uploadFormElements.descriptionTextarea.value = null;
    uploadFormElements.uploadFile.value = null;
    imgPreview.style.filter = "none";
    scaleValue = DEFAULT_SCALE_VALUE;
    setSizePreviewImg();
  };

  var onEscEditWindow = function(evt) {
    if (
      evt.target !== uploadFormElements.hashtagsInput &&
      evt.target !== uploadFormElements.descriptionTextarea
    ) {
      window.util.isEsc(evt, onClickEditWindowClose);
    }
  };

  var onEnterEditWindowClose = function(evt) {
    window.util.isEntr(evt, onClickEditWindowClose);
  };

  uploadFormElements.uploadFile.addEventListener("change", function() {
    uploadFormElements.editWindow.classList.remove("hidden");
    uploadFormElements.scaleControlValue.value = DEFAULT_SCALE_VALUE + "%";
    effectLevelPin.setAttribute("tabindex", "0");
    var effectsValue = imgPreview.classList;
    if (effectsValue.length > 0) {
      imgPreview.classList.remove(effectsValue);
    }

    uploadFormElements.closeButton.addEventListener(
      "click",
      onClickEditWindowClose
    );
    uploadFormElements.closeButton.addEventListener(
      "keydown",
      onEnterEditWindowClose
    );

    document.addEventListener("keydown", onEscEditWindow);

    uploadForm.addEventListener("click", onChangeScaleImg);
    uploadForm.addEventListener("keydown", onEntrChangeScaleImg);

    uploadFormElements.slideOfEffectLevel.classList.add("hidden");
    imgUploadEffects.addEventListener("change", selectEffect);
    effectLevelPin.addEventListener("mousedown", ChangeDepthEffect);
    effectLevelPin.addEventListener("keydown", onKeyChangeDepthEffect);
    uploadFormElements.hashtagsInput.addEventListener(
      "input",
      window.getValidity
    );
    uploadForm.addEventListener("submit", sendForm);
  });

  // Отправка формы на сервер
  var onSave = function() {
    onClickEditWindowClose();
    window.messages.openSuccessWindow();
    window.controlPopup.controlSuccessWindow();
  };

  var onError = function(message) {
    onClickEditWindowClose();
    window.messages.openErrorWindow(message, true);
    window.controlPopup.controlErrorWindow();
  };

  var sendForm = function(evt) {
    window.backend.save(new FormData(uploadForm), onSave, onError);
    evt.preventDefault();
  };

  // Маштабирование изображения
  var onChangeScaleImg = function(evt) {
    scaleValue = parseInt(uploadFormElements.scaleControlValue.value, 10);
    var scaleControlSmaller = uploadForm.querySelector(
      ".scale__control--smaller"
    );
    var scaleControlBigger = uploadForm.querySelector(
      ".scale__control--bigger"
    );

    var target = evt.target;
    if (target === scaleControlSmaller) {
      scaleValue = scaleValue - 25 > 25 ? (scaleValue -= 25) : 25;
    }

    if (target === scaleControlBigger) {
      scaleValue = scaleValue + 25 < 100 ? (scaleValue += 25) : 100;
    }

    setSizePreviewImg();
  };

  var onEntrChangeScaleImg = function(evt) {
    window.util.isEntr(evt, onChangeScaleImg);
  };

  // Наложение эффекта
  var selectEffect = function(evt) {
    var target = evt.target;
    var effectsValue = imgPreview.classList;

    if (effectsValue.length > 0) {
      imgPreview.classList.remove(effectsValue);
    }

    if (target.value !== "none") {
      var effectClass = "effects__preview--" + target.value;
      imgPreview.classList.add(effectClass);
      effectLevelValue.value = 100;
      effectLevelPin.style.left = effectLevelValue.value + "%";
      effectLevelDeepth.style.width = effectLevelValue.value + "%";
      uploadFormElements.slideOfEffectLevel.classList.remove("hidden");
    } else if (target.value === "none") {
      uploadFormElements.slideOfEffectLevel.classList.add("hidden");
    }
    currentEffect = target.value;
    setEffectValue(currentEffect, effectLevelValue.value);
  };

  // изменение глубины эффекта
  var setEffectValue = window.debounce(function(effectName, value) {
    var propertyEffect = "none";

    switch (effectName) {
      case "chrome":
        value = value / 100;
        propertyEffect = "grayscale(" + value + ")";
        break;
      case "sepia":
        value = value / 100;
        propertyEffect = "sepia(" + value + ")";
        break;
      case "marvin":
        propertyEffect = "invert(" + value + "%)";
        break;
      case "phobos":
        value = (3 * value) / 100;
        propertyEffect = "blur(" + value + "px)";
        break;
      case "heat":
        value = (2 * value) / 100 + 1;
        propertyEffect = "brightness(" + value + ")";
        break;
      case "none":
        value = 100;
        propertyEffect = "none";
        break;

      default:
        break;
    }
    imgPreview.style.filter = propertyEffect;
  });

  // Перемещение пина
  var setEffectAttribute = function(value) {
    effectLevelPin.style.left = value + "%";
    effectLevelDeepth.style.width = value + "%";
    effectLevelValue.setAttribute("value", value);
  };

  var ChangeDepthEffect = function(evt) {
    evt.preventDefault();

    var getCoords = function(element, evtCoords) {
      var rect = element.getBoundingClientRect();
      return {
        x: evtCoords.clientX - rect.left,
        y: evtCoords.clientY - rect.top
      };
    };

    var target = evt.target;
    var shifts = getCoords(target, evt);

    var onMouseMove = function(moveEvt) {
      moveEvt.preventDefault();
      var effectLevelLine = uploadForm.querySelector(".effect-level__line");

      var coords = getCoords(effectLevelLine, moveEvt);
      var value = Math.ceil(
        ((coords.x + target.offsetWidth / 2 - shifts.x) /
          effectLevelLine.offsetWidth) *
          100
      );

      if (value < 0) {
        value = 0;
      }
      if (value > 100) {
        value = 100;
      }

      setEffectAttribute(value);
      setEffectValue(currentEffect, value);
    };

    var onMouseUp = function(upEvt) {
      upEvt.preventDefault();

      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  var onKeyChangeDepthEffect = function(evt) {
    var attributeValue = effectLevelPin.style.left;
    var value = Number(attributeValue.slice(0, attributeValue.indexOf("%")));

    switch (evt.keyCode) {
      case ARROW_RIGHT:
        value = value + 1;

        if (value > 100) {
          value = 100;
        }
        break;
      case ARROW_LEFT:
        value = value - 1;

        if (value < 0) {
          value = 0;
        }
        break;
      default:
        break;
    }

    setEffectAttribute(value);
    setEffectValue(currentEffect, value);
  };
})();
