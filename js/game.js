ingame = true;
var canvas = document.getElementById("game");
var ctx = canvas.getContext("2d");

var TILE_SIZE = 32;
var WIDTH = 640;
var HEIGHT = 360;
var CANVAS_WIDTH = 640;
var CANVAS_HEIGHT = 360;
var timeWhenGameStarted = Date.now(); //return time in ms

let resizeCanvas = function () {
  CANVAS_WIDTH = window.innerWidth - 4;
  CANVAS_HEIGHT = window.innerHeight - 4;

  let ratio = 16 / 9;
  if (CANVAS_HEIGHT < CANVAS_WIDTH / ratio)
    CANVAS_WIDTH = CANVAS_HEIGHT * ratio;
  else CANVAS_HEIGHT = CANVAS_WIDTH / ratio;

  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  ctx.font = "30px Arial";
  ctx.mozImageSmoothingEnabled = false;
  ctx.msImageSmoothingEnabled = false;
  ctx.imageSmoothingEnabled = false;
  ctx.fillStyle = "#FFFFFF";

  canvas.style.width = "" + CANVAS_WIDTH + "px";
  canvas.style.height = "" + CANVAS_HEIGHT + "px";
};
resizeCanvas();

window.addEventListener("resize", function () {
  resizeCanvas();
});

var frameCount = 0;

var score = 0;

var paused = false;

var Img = {};
Img.player = new Image();
Img.player.src = "/img/player.png";
Img.bat = new Image();
Img.bat.src = "/img/blaze.png";
Img.bee = new Image();
Img.bee.src = "/img/ghast.png";
Img.bullet = new Image();
Img.bullet.src = "/img/fireball.png";
Img.obsidian = new Image();
Img.obsidian.src = "/img/obsidian.png";
Img.start_screen = new Image();
Img.start_screen.src = "/img/start_screen.png";

testCollisionRectRect = function (rect1, rect2) {
  return (
    rect1.x <= rect2.x + rect2.width &&
    rect2.x <= rect1.x + rect1.width &&
    rect1.y <= rect2.y + rect2.height &&
    rect2.y <= rect1.y + rect1.height
  );
};

document.onmousedown = function (mouse) {
  if (mouse.which === 1) player.pressingMouseLeft = true;
  else player.pressingMouseRight = true;
};
document.onmouseup = function (mouse) {
  if (mouse.which === 1) player.pressingMouseLeft = false;
  else player.pressingMouseRight = false;
};
document.oncontextmenu = function (mouse) {
  mouse.preventDefault();
};
document.onmousemove = function (mouse) {
  var mouseX = mouse.clientX - canvas.getBoundingClientRect().left;
  var mouseY = mouse.clientY - canvas.getBoundingClientRect().top;

  mouseX -= CANVAS_WIDTH / 2;
  mouseY -= CANVAS_HEIGHT / 2;

  player.aimAngle = (Math.atan2(mouseY, mouseX) / Math.PI) * 180;
};

document.onkeydown = function (event) {
  if (event.keyCode === 39)
    // right
    player.pressingRight = true;
  if (event.keyCode === 40)
    // down
    player.pressingDown = true;
  if (event.keyCode === 37)
    // left
    player.pressingLeft = true;
  if (event.keyCode === 38)
    // up
    player.pressingUp = true;
  if (event.keyCode === 80)
    //p
    paused = !paused;
  if (event.keyCode === 27)
    //p
    open("/index.html");
  if (event.keyCode === 32)
    //space
    player.pressingMouseLeft = true;
  if (event.keyCode === 77)
    //m
    player.pressingMouseRight = true;
};

document.onkeyup = function (event) {
  if (event.keyCode === 39)
    //d
    player.pressingRight = false;
  if (event.keyCode === 40)
    //s
    player.pressingDown = false;
  if (event.keyCode === 37)
    //a
    player.pressingLeft = false;
  if (event.keyCode === 38)
    // w
    player.pressingUp = false;
  if (event.keyCode === 32)
    //space
    player.pressingMouseLeft = false;
  if (event.keyCode === 77)
    //m
    player.pressingMouseRight = false;
};

update = function () {
  if (paused) {
    ctx.fillText("Paused", WIDTH / 2, HEIGHT / 2);
    return;
  }
  ctx.clearRect(0, 0, WIDTH, HEIGHT);
  Maps.current.draw();
  frameCount++;
  Bullet.update();
  Upgrade.update();
  Enemy.update();

  player.update();

  ctx.fillText(player.hp + " Hp", 0, 30);
  ctx.fillText("Score: " + score, 200, 30);
  player.atkSpd = 28
  if (score > 9) {
    var timeSurvived = Date.now() - timeWhenGameStarted;	
		alert("You won! You took " + timeSurvived + " ms to find everything. Click ok to go back to homescreen.")
		self.hp = 10
		open("/index.html")	
  }
};

startNewGame = function () {
  player.hp = 10;
  timeWhenGameStarted = Date.now();
  frameCount = 0;
  score = 0;
  Enemy.list = {};
  Upgrade.list = {};
  Bullet.list = {};
  Enemy.randomlyGenerate();
  Enemy.randomlyGenerate();
  Enemy.randomlyGenerate();
};

Maps = function (id, imgSrc, grid) {
  var self = {
    id: id,
    image: new Image(),
    width: grid[0].length * TILE_SIZE,
    height: grid.length * TILE_SIZE,
    grid: grid,
  };
  self.image.src = imgSrc;

  self.isPositionWall = function (pt) {
    var gridX = Math.floor(pt.x / TILE_SIZE);
    var gridY = Math.floor(pt.y / TILE_SIZE);
    if (gridX < 0 || gridX >= self.grid[0].length) return true;
    if (gridY < 0 || gridY >= self.grid.length) return true;
    return self.grid[gridY][gridX];
  };

  self.draw = function () {
    var x = WIDTH / 2 - player.x;
    var y = HEIGHT / 2 - player.y;
    ctx.drawImage(
      self.image,
      0,
      0,
      self.image.width,
      self.image.height,
      x,
      y,
      self.image.width * 2,
      self.image.height * 2
    );
  };
  return self;
};

var array = [
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 502, 502, 502, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  502, 502, 502, 502, 502, 502, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 502, 502, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 502, 502,
  502, 502, 502, 502, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 502, 502, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 502, 502, 0, 0, 0, 0, 0, 0, 0, 502, 502, 502, 502,
  502, 502, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 502, 502, 0, 0, 0, 0, 0, 0, 0, 502, 502, 502, 502, 502, 502,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 502, 502, 502, 502, 502, 502, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 502, 502, 502, 502, 502, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 502, 502, 502, 502, 502, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 502, 502, 502, 502, 502, 502, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 502, 502, 502, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 502, 502, 502, 502, 502, 502, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 502, 502, 502,
  502, 502, 502, 502, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 502, 502, 502, 502, 502, 502,
  502, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 502, 502, 502, 502, 502, 502, 502, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 502, 502, 502, 502, 502, 0, 0, 0, 0, 0, 502, 502, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 502, 502, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 502, 502, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 502, 502, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 502, 502, 502, 502, 502, 502,
  502, 502, 502, 502, 502, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 502, 502, 502, 502, 502, 502, 502,
  502, 502, 502, 502, 502, 502, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 502, 502, 502, 502, 502, 502, 502,
  502, 502, 502, 502, 502, 502, 0, 0, 0, 0, 0, 0, 502, 502, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 502, 502, 0, 0, 0, 0, 0, 502, 502, 502, 502, 502,
  502, 502, 502, 502, 502, 502, 502, 502, 0, 0, 0, 0, 0, 0, 502, 502, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 502, 502, 0, 0, 0, 0, 0, 502, 502, 502, 502,
  502, 502, 502, 502, 502, 502, 502, 502, 502, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 502, 502, 502, 502,
  502, 502, 502, 502, 502, 502, 502, 502, 502, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 502, 502, 502, 502,
  502, 502, 502, 502, 502, 502, 502, 502, 502, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  502, 502, 502, 502, 502, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 502, 502,
  502, 502, 502, 502, 502, 502, 502, 502, 502, 502, 502, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 502, 502, 502, 502, 502, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  502, 502, 502, 502, 502, 502, 502, 502, 502, 502, 502, 502, 502, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 502, 502, 502, 502, 502, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 502, 502, 502, 502, 502, 502, 502, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 502, 502, 502, 502, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 502, 502, 502, 502, 502, 502, 502, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 502, 502, 502, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 502, 502, 502, 502, 502, 502, 502, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 502, 502, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 502, 502, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 502, 502, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 502,
  502, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 502, 502, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 502, 502,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
];

var array2D = [];
for (var i = 0; i < 40; i++) {
  array2D[i] = [];
  for (var j = 0; j < 40; j++) {
    array2D[i][j] = array[i * 40 + j];
  }
}

Maps.current = Maps("field", "img/map.png", array2D);

player = Player();
playerInventory = Inventory();
startNewGame();

setInterval(update, 40);
