//Constructor
class Ball {
    constructor(x, y, radius) {
        this.radius = radius;
        this.vx = randomVx();
        this.vy = randomVy();
        this.x = x;
        this.y = y;
        this.mass = this.radius;
        this.timestamp = Date.now();
        this.color = randomColor();
        this.draw = function () {
            ctx.beginPath();
            ctx.arc(Math.round(this.x), Math.round(this.y), this.radius, 0, Math.PI * 2, false);
            ctx.fillStyle = this.color;
            ctx.fill();
            ctx.strokeStyle = 'rgba(0, 0, 0, 0.6)';
            ctx.stroke();
            ctx.closePath();
        };
        this.checkGround = function () {
            return (this.y + this.radius >= canv.height);
        };
        this.speed = function () {
            return Math.sqrt(this.vx * this.vx + this.vy * this.vy)
          }
        this.dir = function () {
              return Math.atan2(this.vy, this.vx)
            }
    }
}
