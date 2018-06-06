// canvas & canvas
let canv = document.getElementById("canv");
let ctx = canv.getContext("2d");
//g = м/с^2
const g = 9.806;
//fps
const ppm = 30;
//gravity coeff
const gravity = 0.98;
//resist free drop
const resist = 0.98;
//canvas sizes
const widthCanv = canv.width;
const heightCanv = canv.height;

let audio = new Audio('Select.wav');
audio.volume = 0.06;

let leftMove = false;
let upMove = false;
let rightMove = false;
let downMove = false;

//other values
let gravityOn = false;
let difBalls = false;
let soundOn = true;
let paused = false;
let clearCanv = true;
let timestamp;
let raf;
let dt = 30 / 1000;
let ballArray = [];

document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);
function eventFire(el, etype){
    if (el.fireEvent) {
      el.fireEvent('on' + etype);
    } else {
      var evObj = document.createEvent('Events');
      evObj.initEvent(etype, true, false);
      el.dispatchEvent(evObj);
    }
  }
function keyDownHandler(event){
    if (event.keyCode == 67) { // c
        ballArray[ballArray.length] = new Ball(randomX(), randomY(), randomRadius());
    } else if (event.keyCode == 80) { // p
        paused = !paused;
    } else if (event.keyCode == 71) { // g
        gravityOn = !gravityOn;
    } else if (event.keyCode == 77) { // m
        soundOn = !soundOn;
    } else if (event.keyCode == 65) { // A
        leftMove = true;
    } else if (event.keyCode == 87) { // W
        upMove = true;
    } else if (event.keyCode == 68) { // D
        rightMove = true;
    } else if (event.keyCode == 83) { // S
        downMove = true;
    } else if (event.keyCode == 82) { // r
        ballArray = [];
    } else if (event.keyCode == 75) { // k
        clearCanv = !clearCanv;
    } else if (event.keyCode == 88) { // x
        difBalls = !difBalls;
    }
}
function keyUpHandler(event) {
    if (event.keyCode == 65) { // A
        leftMove = false;
    } else if (event.keyCode == 87) { // W
        console.log('w')
        upMove = false;
    } else if (event.keyCode == 68) { // D
        rightMove = false;
    } else if (event.keyCode == 83) { // S
        downMove = false;
    }
}

function wasdControl() {
    if (leftMove) { // left arrow
        for (var ball in ballArray) {
            ballArray[ball].vx -= 0.3;
        }
    } if (upMove) { // up arrow
        for (var ball in ballArray) {
            if(gravityOn)
            ballArray[ball].vy -= 1.5;
            else ballArray[ball].vy -= 0.3;
        }
    } if (rightMove) { // right arrow
        for (var ball in ballArray) {
            ballArray[ball].vx += 0.3;
        }
    } if (downMove) { // down arrow
        for (var ball in ballArray) {
            ballArray[ball].vy += 0.3;
        }
    }
}
//redraw
function draw(){

    if(clearCanv) clearCanvas();    
if (!paused) {
    wasdControl();
    if (gravityOn) {
        for(let index in ballArray){
            let now = Date.now();
            ballArray[index].dt = (Date.now() - ballArray[index].timestamp) /1000;
            ballArray[index].vy = (ballArray[index].vy + gravity + (g*ballArray[index].dt)) * resist
            ballArray[index].y = (ballArray[index].y / 30 + ballArray[index].vy * ballArray[index].dt + g * ballArray[index].dt * ballArray[index].dt / 2) * ppm;
            ballArray[index].vx = ballArray[index].vx * resist;
            ballArray[index].x = (ballArray[index].x / 30 + ballArray[index].vx * ballArray[index].dt +  ballArray[index].dt * ballArray[index].dt / 2) * ppm;
            ballArray[index].timestamp = now
        }
    }
     else moveBall();
}
drawBalls();
checkStaticCollision();
checkCollision();
requestAnimationFrame(draw)
}
//check balls collision & wall collision
function checkCollision(){
    for(let ball1 in ballArray){
        for(let ball2 in ballArray){
            if(ball1 != ball2 && distanceNextFrame(ballArray[ball1], ballArray[ball2]) <= 0){
                let v1 = ballArray[ball1].speed();
                let v2 = ballArray[ball2].speed();
                let dir1 = ballArray[ball1].dir();
                let dir2 = ballArray[ball2].dir();
                let m1 = ballArray[ball1].mass;
                let m2 = ballArray[ball2].mass;
                let angle = Math.atan2(ballArray[ball2].y - ballArray[ball1].y, ballArray[ball2].x - ballArray[ball1].x)

                let fin_vx1 = ((m1 - m2) * (v1 * Math.cos(dir1 - angle)) +
                ((m2 + m2)*(v2 * Math.cos(dir2 - angle)))) / (m1 + m2) * Math.cos(angle)
                
                let fin_vy1 = ((m1 - m2) * (v1 * Math.cos(dir1 - angle)) +
                ((m2 + m2)*(v2 * Math.cos(dir2 - angle)))) / (m1 + m2) * Math.sin(angle)

                let fin_vx2 = ((m1 + m1) * (v1 * Math.cos(dir1 - angle)) +
                ((m2 - m1) * (v2 * Math.cos(dir2 - angle)))) / (m1 + m2) * Math.cos(angle)

                let fin_vy2 = ((m1 + m1) * (v1 * Math.cos(dir1 - angle)) +
                ((m2 - m1) * (v2 * Math.cos(dir2 - angle)))) / (m1 + m2) * Math.sin(angle)
                let vx1 = fin_vx1 + Math.cos(angle + Math.PI/2) * (v1 * Math.sin(dir1 - angle))
                let vy1 = fin_vy1 + Math.sin(angle + Math.PI/2) * (v1 * Math.sin(dir1 - angle))
                let vx2 = fin_vx2 + Math.cos(angle + Math.PI/2) * (v2 * Math.sin(dir2 - angle))
                let vy2 = fin_vy2 + Math.sin(angle + Math.PI/2) *  (v2 * Math.sin(dir2 - angle))
                ballArray[ball1].vx = vx1;
                ballArray[ball1].vy = vy1;
                ballArray[ball2].vx = vx2;
                ballArray[ball2].vy = vy2;
                if (soundOn)
                audio.play();
            }
        }
        checkWalls(ballArray[ball1])
    }
}
function checkStaticCollision(){
    for(let ball1 in ballArray){
        for(let ball2 in ballArray){
            if(ball1 != ball2 && calcDistance(ballArray[ball1], ballArray[ball2]) < ballArray[ball1].radius + ballArray[ball2].radius){
                let angle = Math.atan2((ballArray[ball1].y - ballArray[ball2].y), (ballArray[ball1].x - ballArray[ball2].x));
                let overlap = ballArray[ball1].radius + ballArray[ball2].radius - calcDistance (ballArray[ball1], ballArray[ball2]);
                let smallerObject = ballArray[ball1].radius < ballArray[ball2].radius ? ball1 : ball2
                ballArray[smallerObject].x -= overlap * Math.cos(angle);
                ballArray[smallerObject].y -= overlap * Math.sin(angle);
            }
        }
    }
}
function checkWalls(ball) {
    if (ball.y > heightCanv - ball.radius) {
        ball.y = heightCanv - ball.radius;
        ball.vy *= -1;
    }
    if (ball.y < ball.radius) {
        ball.y = ball.radius;
        ball.vy *= -1;
    }
    if (ball.x > widthCanv - ball.radius) {
        ball.x = widthCanv - ball.radius;
        ball.vx *= -1;
    }
    if (ball.x < ball.radius) {
        ball.x = ball.radius;
        ball.vx *= -1;
    }
}

function moveBall() {
    for (var ball in ballArray) {
        ballArray[ball].x += ballArray[ball].vx;
        ballArray[ball].y += ballArray[ball].vy;
    }    
}
function drawBalls() {
    for (var ball in ballArray) {
        ballArray[ball].draw();
    }
}

//clear
function clearCanvas() {
    ctx.clearRect(0, 0, canv.width, canv.height);
}
    for (let i = 0; i < 5; i++) {
    let temp = new Ball(randomX(), randomY(), 20)    
    ballArray[ballArray.length] = temp
}
for (let i = 0; i < 100; i++) {
    let temp = new Ball(randomX(), randomY(), 5)    
    ballArray[ballArray.length] = temp
}
//run this shit
window.onload=function() {
    eventFire(document.getElementById('bg'), 'click');
    draw()
}
