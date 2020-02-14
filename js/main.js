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
