console.log("Loaded the canvas JS")
var can = document.getElementById('canvas1');
var ctx = can.getContext('2d');
ctx.lineWidth = 8;
var isPressed = false;

var can2 = document.getElementById('canvas2')
var ctx2 = can2.getContext('2d');
ctx2.lineWidth = 1;

var mx = 4, my = 4;

function move(e) {
  getMouse(e);
  if (isPressed) {
  
    ctx.lineTo(mx, my);
    ctx2.lineTo(mx/8, my/8);
    ctx.stroke()
    ctx2.stroke()
  }
}

function up(e) {
  getMouse(e);
  isPressed = false;
}

function down(e) {
  getMouse(e);
  ctx.beginPath();
  ctx2.beginPath();
  ctx.moveTo(mx, my);
  ctx2.moveTo(mx/8, my/8);
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

//28x28 = 784 pixels stacked by rows 
function getPixels() {
    const pixelData = ctx2.getImageData(0, 0, 28, 28).data;
    let testPixels = [];
    for (let i = 3; i < pixelData.length; i+=4) {
        if (pixelData[i] > 0) {
            testPixels.push(1);
        } else {
          testPixels.push(0)
        }
    }
    return testPixels
}

//28 by 28 to test if testPixels() works 
function convToArr(arr) {
  let numArr = Array(28).fill(0).map(elem => Array(28).fill(0))
  for(let i = 0; i < 28; i++){
      for(let j = 0; j < 28; j++){
          numArr[i][j] = arr[i*28+j]
      }
  }
  return numArr
}


const testPixels = getPixels();

export const canvasPixels = testPixels;




