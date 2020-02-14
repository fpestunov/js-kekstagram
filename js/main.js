"use strict";

var commentDescription = {
  commentsList: [
    "Все отлично!",
    "В целом все неплохо. Но не все.",
    "Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это не профессионально",
    "Моя бабушка случайно чихнула с фотоаппаратом в руках и у нее получилась фотография лучше.",
    "Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота, и у меня получилась фотография лучше.",
    "Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!"
  ],
  namesAuthor: ["Артем", "Николай", "Евгения", "Никодим", "Феофан", "Авдотья"],
  maxCommentQuantity: 9
};

var PHOTO_QUANTITY = 25;
var ESC_KEYCODE = 27;
var ENTER_KEYCODE = 13;
var DEFAULT_SCALE_VALUE = 100;

var getRandomValue = function(range) {
  return Math.floor(Math.random() * range);
};

var getListAuthor = function() {
  var authors = {};
  authors.avatar = "img/avatar-" + (getRandomValue(5) + 1) + ".svg";
  authors.message =
    commentDescription.commentsList[
      getRandomValue(commentDescription.commentsList.length)
    ];
  authors.name =
    commentDescription.namesAuthor[
      getRandomValue(commentDescription.namesAuthor.length)
    ];

  return authors;
};

var getListImages = function(maxIndex, images) {
  for (var i = 0; i < maxIndex; i++) {
    images[i] = {};
    images[i].url = "photos/" + (i + 1) + ".jpg";
    images[i].description = "Мяу!";
    images[i].likes = getRandomValue(185) + 15;
    images[i].commentsQuantity =
      getRandomValue(commentDescription.maxCommentQuantity) + 1;
    images[i].comments = [];
    for (var j = 0; j < images[i].commentsQuantity; j++) {
      images[i].comments[j] = getListAuthor();
    }
  }
};

var photoList = [];
getListImages(PHOTO_QUANTITY, photoList);

var picturesListElement = document.querySelector(".pictures");
var pictureTemplate = document
  .querySelector("#picture")
  .content.querySelector(".picture");

var renderPicture = function(picture) {
  var pictureElement = pictureTemplate.cloneNode(true);
  pictureElement
    .querySelector(".picture__img")
    .setAttribute("src", picture.url);
  pictureElement
    .querySelector(".picture__img")
    .setAttribute("alt", picture.description);
  pictureElement.querySelector(".picture__comments").textContent =
    picture.commentsQuantity;
  pictureElement.querySelector(".picture__likes").textContent = picture.likes;

  return pictureElement;
};

var getFragment = function() {
  var fragment = document.createDocumentFragment();

  for (var i = 0; i < photoList.length; i++) {
    fragment.appendChild(renderPicture(photoList[i]));
  }
  return fragment;
};

picturesListElement.appendChild(getFragment());

// модуль реализации загрузки и редактирования изображений

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

var editWindowCloseClickHandler = function() {
  uploadFormElements.editWindow.classList.add("hidden");
  uploadFormElements.uploadFile.value = null;
  imgPreview.style.filter = "none";
  scaleValue = DEFAULT_SCALE_VALUE;
  setSizePreviewImg();
  uploadFormElements.closeButton.removeEventListener(
    "click",
    editWindowCloseClickHandler
  );
  uploadFormElements.closeButton.removeEventListener(
    "keydown",
    editWindowCloseEnterHandler
  );
  document.removeEventListener("keydown", editWindowEscHandler);
  uploadForm.removeEventListener("click", changeScaleImgClickHandler);
  uploadForm.removeEventListener("keydown", changeScaleImgEnterHandler);
  controlsEffect.pin.removeEventListener("mousedown", ChangeDepthEffect);
  uploadFormElements.hashtagsInput.removeEventListener(
    "input",
    getHashValidity
  );
};

var editWindowEscHandler = function(evt) {
  if (
    evt.keyCode === ESC_KEYCODE &&
    evt.target !== uploadFormElements.hashtagsInput &&
    evt.target !== uploadFormElements.descriptionTextarea
  ) {
    editWindowCloseClickHandler();
  }
};

var editWindowCloseEnterHandler = function(evt) {
  if (evt.keyCode === ESC_KEYCODE) {
    editWindowCloseClickHandler();
  }
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
    editWindowCloseClickHandler
  );
  uploadFormElements.closeButton.addEventListener(
    "keydown",
    editWindowCloseEnterHandler
  );

  document.addEventListener("keydown", editWindowEscHandler);

  uploadForm.addEventListener("click", changeScaleImgClickHandler);
  uploadForm.addEventListener("keydown", changeScaleImgEnterHandler);

  uploadFormElements.slideOfEffectLevel.classList.add("hidden");
  selectEffect();
  controlsEffect.pin.addEventListener("mousedown", ChangeDepthEffect);
  uploadFormElements.hashtagsInput.addEventListener("input", getHashValidity);
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

var changeScaleImgEnterHandler = function(evt) {
  if (evt.keyCode === ENTER_KEYCODE) {
    changeScaleImgClickHandler();
  }
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

// проверка валидации хэштэгов

var getHashValidity = function(evt) {
  var target = evt.target;
  var hash = target.value;
  hash = hash.toUpperCase();
  var tags = hash.split(" ");

  if (tags.length > 5) {
    target.setCustomValidity("Количество хеш-тегов не может быть больше 5");
  } else {
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
      } else if (tags.indexOf(tags[i], tags[i + 1]) !== -1) {
        target.setCustomValidity("Хэш-тэги не могут повторяться");
      } else {
        target.setCustomValidity("");
      }
    }
  }
};
