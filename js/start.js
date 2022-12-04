var canvas2 = document.getElementById("start_screen");
var context = canvas2.getContext("2d");

var TILE_SIZE = 32;
var WIDTH = 640;
var HEIGHT = 360;
var CANVAS_WIDTH = 640;
var CANVAS_HEIGHT = 360;

let resizeCanvas = function () {
  CANVAS_WIDTH = window.innerWidth - 4;
  CANVAS_HEIGHT = window.innerHeight - 4;

  let ratio = 16 / 9;
  if (CANVAS_HEIGHT < CANVAS_WIDTH / ratio)
    CANVAS_WIDTH = CANVAS_HEIGHT * ratio;
  else CANVAS_HEIGHT = CANVAS_WIDTH / ratio;

  canvas2.width = WIDTH;
  canvas2.height = HEIGHT;

  canvas2.style.width = "" + CANVAS_WIDTH + "px";
  canvas2.style.height = "" + CANVAS_HEIGHT + "px";
};
resizeCanvas();

window.addEventListener("resize", function () {
  resizeCanvas();
});

var img = new Image();
img.src = "/img/start_screen.png";
context.drawImage(img, 0, 0, 640, 360);
