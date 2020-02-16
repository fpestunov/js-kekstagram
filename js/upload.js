"use strict";

(function() {
  var DEFAULT_SCALE_VALUE = 100;
  var uploadForm = document.querySelector(".img-upload__form");
  var uploadFormElements = {
    uploadFile: uploadForm.querySelector("#upload-file"),
    editWindow: uploadForm.querySelector(".img-upload__overlay"),
    closeButton: uploadForm.querySelector(".img-upload__cancel"),
    hashtagsInput: uploadForm.querySelector(".text__hashtags"),
    descriptionTextarea: uploadForm.querySelector(".text__description"),
    scaleControlSmaller: uploadForm.querySelector(".scale__control--smaller"),
    scaleControlValue: uploadForm.querySelector(".scale__control--value"),
    scaleControlBigger: uploadForm.querySelector(".scale__control--bigger"),
    slideOfEffectLevel: uploadForm.querySelector(".img-upload__effect-level")
  };
  var scaleValue = DEFAULT_SCALE_VALUE;

  var imgUploadPreview = uploadForm.querySelector(".img-upload__preview");
  var imgPreview = imgUploadPreview.querySelector("img");
  var imgUploadEffects = uploadForm.querySelector(".img-upload__effects");
  var currentEffect = "none";

  var controlsEffect = {
    valueInput: uploadFormElements.slideOfEffectLevel.querySelector(
      ".effect-level__value"
    ),
    pinContainer: uploadForm.querySelector(".img-upload__preview-container"),
    pinLine: uploadForm.querySelector(".effect-level"),
    pin: uploadFormElements.slideOfEffectLevel.querySelector(
      ".effect-level__pin"
    ),
    line: uploadForm.querySelector(".effect-level__line"),
    effectLine: uploadForm.querySelector(".effect-level__depth")
  };

  var setSizePreviewImg = function() {
    uploadFormElements.scaleControlValue.value = scaleValue + "%";
    imgPreview.style.transform = "scale(" + scaleValue / 100 + ")";
  };

  // Открытие/закрытие формы загрузки изображения

  var onClickEditWindowClose = function() {
    uploadFormElements.editWindow.classList.add("hidden");
    uploadFormElements.uploadFile.value = null;
    imgPreview.style.filter = "none";
    scaleValue = DEFAULT_SCALE_VALUE;
    setSizePreviewImg();
    uploadFormElements.closeButton.removeEventListener(
      "click",
      onClickEditWindowClose
    );
    uploadFormElements.closeButton.removeEventListener(
      "keydown",
      onEnterEditWindowClose
    );
    document.removeEventListener("keydown", onEscEditWindow);
    uploadForm.removeEventListener("click", changeScaleImgClickHandler);
    uploadForm.removeEventListener("keydown", onEntrChangeScaleImg);
    controlsEffect.pin.removeEventListener("mousedown", ChangeDepthEffect);
    uploadFormElements.hashtagsInput.removeEventListener(
      "input",
      window.getValidity
    );
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

    uploadForm.addEventListener("click", changeScaleImgClickHandler);
    uploadForm.addEventListener("keydown", onEntrChangeScaleImg);

    uploadFormElements.slideOfEffectLevel.classList.add("hidden");
    selectEffect();
    controlsEffect.pin.addEventListener("mousedown", ChangeDepthEffect);
    uploadFormElements.hashtagsInput.addEventListener(
      "input",
      window.getValidity
    );
  });

  // Маштабирование изображения

  var changeScaleImgClickHandler = function(evt) {
    scaleValue = parseInt(uploadFormElements.scaleControlValue.value, 10);

    var target = evt.target;
    if (target === uploadFormElements.scaleControlSmaller) {
      scaleValue = scaleValue - 25 > 25 ? (scaleValue -= 25) : 25;
    }

    if (target === uploadFormElements.scaleControlBigger) {
      scaleValue = scaleValue + 25 < 100 ? (scaleValue += 25) : 100;
    }

    setSizePreviewImg();
  };

  var onEntrChangeScaleImg = function(evt) {
    window.util.isEntr(evt, changeScaleImgClickHandler);
  };

  // Наложение эффекта

  var selectEffect = function() {
    imgUploadEffects.addEventListener("change", function(evt) {
      var target = evt.target;
      var effectsValue = imgPreview.classList;

      if (effectsValue.length > 0) {
        imgPreview.classList.remove(effectsValue);
      }

      if (target.value !== "none") {
        var effectClass = "effects__preview--" + target.value;
        imgPreview.classList.add(effectClass);
        controlsEffect.valueInput.value = 100;
        controlsEffect.pin.style.left = controlsEffect.valueInput.value + "%";
        controlsEffect.effectLine.style.width =
          controlsEffect.valueInput.value + "%";
        uploadFormElements.slideOfEffectLevel.classList.remove("hidden");
      } else if (target.value === "none") {
        uploadFormElements.slideOfEffectLevel.classList.add("hidden");
      }
      currentEffect = target.value;
      setEffectValue(target.value, controlsEffect.valueInput.value);
    });
  };

  // изменение глубины эффекта

  var setEffectValue = function(effectName, value) {
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
  };

  // Изменение глубины эффекта
  var getCoords = function(element, evt) {
    var rect = element.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
  };

  var ChangeDepthEffect = function(evt) {
    evt.preventDefault();

    var target = evt.target;
    var shifts = getCoords(target, evt);

    var onMouseMove = function(moveEvt) {
      moveEvt.preventDefault();

      var coords = getCoords(controlsEffect.line, moveEvt);
      var value = Math.ceil(
        ((coords.x + target.offsetWidth / 2 - shifts.x) /
          controlsEffect.line.offsetWidth) *
          100
      );

      if (value < 0) {
        value = 0;
      }
      if (value > 100) {
        value = 100;
      }

      controlsEffect.pin.style.left = value + "%";
      controlsEffect.effectLine.style.width = value + "%";
      controlsEffect.valueInput.setAttribute("value", value);
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
})();
