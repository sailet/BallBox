function randomColor(){
    rc ='#'+Math.floor(Math.random()*16777215).toString(16);
    return rc;
}
function calcDistance(a, b){
    return Math.sqrt((a.x - b.x)**2 + (a.y - b.y)**2)
}
function distanceNextFrame(a, b) {
    return Math.sqrt((a.x + a.vx - b.x - b.vx)**2 + (a.y + a.vy - b.y - b.vy)**2) - a.radius - b.radius;
}
function randomX() {
    x = Math.floor(Math.random() * canv.width);
    if (x < 30) {
        x = 30;
    } else if (x + 30 > canv.width) {
        x = canv.width - 30;
    }
    return x;
}

function randomY() {
    y = Math.floor(Math.random() * canv.height);
    if (y < 30) {
        y = 30;
    } else if (y + 30 > canv.height) {
        y = canv.height - 30;
    }
    return y;
}
function randomVx() {
    r = Math.floor(Math.random() * 10 - 5);
    return r;
}

function randomVy() {
    r = Math.floor(Math.random() * 10 - 5);
    return r;
}
function randomRadius(){
    if (difBalls) {
        r = Math.ceil(Math.random() * 10 + 13);
        return r;
    } else {
        r = Math.ceil(Math.random() * 2 + 1);
        //r = 2;
        return r;
    }
}