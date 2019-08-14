// 设定画布
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const para = document.querySelector('p');
var count = 0;

// 设定画布长宽
const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;

// 生成随机数的函数
function random(min,max) {
  return Math.floor(Math.random()*(max-min)) + min;
}

// 生成随机颜色的函数
function randomColor() {
  return 'rgb(' +
         random(0, 255) + ', ' +
         random(0, 255) + ', ' +
         random(0, 255) + ')';
}

function Shape(x,y,velX,velY,exists){
	this.x = x;
	this.y = y;
	this.velX = velX;
	this.velY = velY;
	this.exists = exists;
	//this.color = color;
	//this.size = size;
}

function Ball(x,y,velX,velY,exists,color,size){
	Shape.call(this,x,y,velX,velY,exists);

	this.color = color;
	this.size = size;
}

function EvilCircle(x,y,exists){
	Shape.call(this,x,y,20,20,exists);

	this.color = 'white';
	this.size = 10;
}

EvilCircle.prototype.draw = function(){
	ctx.beginPath();
	ctx.lineWidth = 3;
	ctx.strokeStyle = this.color;
	ctx.arc(this.x , this.y, this.size, 0, 2 * Math.PI);
	ctx.stroke();
}

EvilCircle.prototype.checkBounds = function(){
	if ((this.x + this.size) >= width){
		this.x -= this.size;
	}

	if((this.x - this.size) <= 0){
		this.x += this.size;
	}

	if ((this.y + this.size) >= height){
		this.y -= this.size;
	}

	if((this.y - this.size) <= 0){
		this.y += this.size;
	}
}

EvilCircle.prototype.setControls = function(){
	var _this = this;
	window.onkeydown = function(e) {
		if (e.keyCode === 'a'){
			_this.x -= _this.velX;
		} else if (e.keyCode === 'd'){
			_this.x += _this.velX;
		} else if (e.keyCode === 'w'){
			_this.y -= _this.velY;
		} else if (e.keyCode === 's'){
			_this.y -= _this.velY;
		}
	};
};

EvilCircle.prototype.collisionDetect = function(){
	for(var j = 0; j < balls.length; j++){
		
		var dx = this.x - balls[j].x;
		var dy = this.y - balls[j].y;
		var distance = Math.sqrt(dx*dx+dy*dy);

		if(distance < this.size + balls[j].size) {
			//balls[j].color = this.color = randomColor();
			balls[j].exists =false;
		}
	}
}
Shape.prototype.draw = function(){
	ctx.beginPath();
	ctx.fillStyle = this.color;
	ctx.arc(this.x , this.y, this.size, 0, 2 * Math.PI);
	ctx.fill();
}

Shape.prototype.update = function(){
	if ((this.x + this.size) >= width){
		this.velX = -(this.velX);
	}

	if((this.x - this.size) <= 0){
		this.velX = -(this.velX);
	}

	if ((this.y + this.size) >= height){
		this.velY = -(this.velY);
	}

	if((this.y - this.size) <= 0){
		this.velY = -(this.velY);
	}

	this.x += this.velX;
	this.y += this.velY;


}

Shape.prototype.collisionDetect = function(){
	for(var j = 0; j < balls.length; j++){
		if(!(this === balls[j])){
			var dx = this.x - balls[j].x;
			var dy = this.y - balls[j].y;
			var distance = Math.sqrt(dx*dx+dy*dy);

			if(distance < this.size + balls[j].size) {
				balls[j].color = this.color = randomColor();
			}
		}
	}
}

var balls = [];

function loop(){
	ctx.fillStyle = 'rgba(0,0,0,0.25)';
	ctx.fillRect(0,0,width,height);

	while (balls.length < 25){
		var ball = new Ball(
			random(0,width),
			random(0,height),
			random(-7,7),
			random(-7,7),
			true,
			randomColor(),
			random(10,20)
			);
		balls.push(ball);
		count++;
		p.textContent = "还剩"+count+"个球";
	}

	for(var i = 0; i < balls.length; i++){
		ec.draw();
		ec.checkBounds();
		ec.collisionDetect();
		if(balls[i].exists){
			balls[i].draw();
			balls[i].update();
			balls[i].collisionDetect();
		} else{
			count--;
			p.textContent = "还剩"+count+"个球";
		}
		
	}

	requestAnimationFrame(loop);
}

EvilCircle.prototype = Object.create(Shape.prototype);
EvilCircle.prototype.constructor = EvilCircle;
Ball.prototype = Object.create(Shape.prototype);
Ball.prototype.constructor = Ball;
var ec = new EvilCircle(width/2,height/2,true);
ec.setControls();
loop();