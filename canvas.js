console.log("Loaded the canvas JS")
var can = document.getElementById('canvas1');
var ctx = can.getContext('2d');
var isPressed = false;

var mx = 4, my = 4;

function move(e) {
  getMouse(e);
  if (isPressed) {
    ctx.lineTo(mx, my);
    ctx.stroke()
  }
}

function up(e) {
  getMouse(e);
  isPressed = false;
}

function down(e) {
  getMouse(e);
  ctx.beginPath();
  ctx.moveTo(mx, my);
  isPressed = true;
}

can.onmousemove = move;
can.onmousedown = down;
can.onmouseup = up;

function getMouse(e) {
    var element = can, offsetX = 0, offsetY = 0;
    mx = e.pageX;
    my = e.pageY;

}