var livesPerGame;
var lives = 0;
var paddleX = 0;
var paddleY = 500;
var paddleH = 16;
var paddleColor = "white";
var paddleW;
var pDown = 0; //power up start vert
var pAcross = 0; //power up start horiz
var powerHit = false;
var powerLoc = 162; //used to assign location of power up
var paddleBoost = 0;
var erase = [25,28,49,52,73,74,75,76,97,100,121,124,30,31,32,33,54,57,78,79,80,81,102,105,126,129,35,36,37,38,59,83,107,131,132,133,134,40,43,45,64,66,69,88,89,93,112,114,136,139,141];
var soundEfx;
var inplay = 0; // var to determine screen message
var highScore = 0;
var score = 0;
var fieldW = 408;
var fieldH = 544;
var colorChoice = 220;
var brickStartY = 40;
var brickRows = 7;
var brickColor = [
    // Block color styling
    "hsl("+colorChoice+", 100%, 50%)",
  "hsl("+(colorChoice - 5)+", 100%, 50%)",
  "hsl("+(colorChoice - 10)+", 100%, 50%)",
  "hsl("+(colorChoice - 15)+", 100%, 50%)",
  "hsl("+(colorChoice - 20)+", 100%, 50%)",
  "hsl("+(colorChoice - 25)+", 100%, 50%)",
  "hsl("+(colorChoice - 30)+", 100%, 50%)",
];
var brickW = 17;
var brickH = 17;
var brickColumns = fieldW / brickW;
var bricks = [];
var brickCount = 0;
var brickPoint = 0;
var ballSpeed = 4;
var ballStartX = 10;
var ballStartY = brickStartY + brickRows * brickH;
var ballX = ballStartX;
var ballY = ballStartY;
var ballH = 8;
var ballW = 8;
var ballDX = ballSpeed;
var ballDY = ballSpeed;
var ballNerfed = false;
var canvas;

function hidebuttons(){
    document.getElementById("normal").style.visibility = "hidden";
	document.getElementById("hard").style.visibility = "hidden";
    document.getElementById("image").style.visibility = "hidden";
}

function showbuttons(){
    document.getElementById("normal").style.visibility = "visible";
	document.getElementById("hard").style.visibility = "visible";
}

function normal() {    
    hidebuttons();
    livesPerGame = 3;
    ballSpeed = 4;
    paddleW = 100;
    startGame(); 
}

function hard() {
    hidebuttons();
    livesPerGame = 2;
    ballSpeed = 10;
    paddleW = 50;
    startGame();
}

function boardRefresh() {
erase = eval("[" + document.getElementById('customGrid').value + "]");
setupBricks();
}

function colorRefresh(){
 colorChoice = parseInt(document.getElementById('colorChoice').value);
brickColor = [
    // Block color styling
    "hsl("+colorChoice+", 100%, 50%)",
  "hsl("+(colorChoice - 5)+", 100%, 50%)",
  "hsl("+(colorChoice - 10)+", 100%, 50%)",
  "hsl("+(colorChoice - 15)+", 100%, 50%)",
  "hsl("+(colorChoice - 20)+", 100%, 50%)",
  "hsl("+(colorChoice - 25)+", 100%, 50%)",
  "hsl("+(colorChoice - 30)+", 100%, 50%)",
];
}

function setupBricks() {
  
    var x, y;
    for (y = 0; y < brickRows; y++) {
        for (x = 0; x < brickColumns; x++) {
            bricks[x + y * brickColumns] = true;
        }
    }
    brickCount = brickRows * brickColumns;

// Set coordinates to 'false'

for (var i = 0; i < bricks.length; i++) {
   d = erase[i]
   bricks[d] = false
}

}

function drawPicture(){
    
var context = canvas.getContext('2d');

context.font = "16px Arial";
context.fillStyle = "blue";
context.textAlign = "center";
context.clearRect(0, 0, fieldW, fieldH);
context.fillText("High Score: " + highScore + "  Score: " + score + "  Balls Remaining: " + lives, canvas.width - 200, canvas.height - 3); 

    // Draws background
    
    context.fillStyle = "black";
    
    context.fillRect(0, 0, fieldW, fieldH - 20);
    
    // Draws bricks
 
    var x, y;

    for (y = 0; y < brickRows; y++) {
        context.fillStyle = brickColor[y];
        context.strokeStyle = "white";
        for (x = 0; x < brickColumns; x++) {
            if (bricks[x + y * brickColumns] ) {
                context.strokeRect(brickW * x, brickStartY + brickH * y,
                                 brickW, brickH);
                context.fillRect(brickW * x, brickStartY + brickH * y,
                                 brickW, brickH);
            }
          
        }
               
    }
  

// Flagging power up
//  context.strokeStyle = "orange";
//  context.strokeRect(brickW * 18, brickStartY + brickH * 6, brickW, brickH);
  
    // Draws paddle

    if (lives > 0) {
        context.fillStyle = paddleColor;
        context.fillRect(paddleX, paddleY, paddleW + paddleBoost,  paddleH);
      
     // Draws power up
      
     if(powerHit && pDown < fieldH - 35){    
        context.fillStyle = "rgb("+Math.floor(Math.random()*256)+","+Math.floor(Math.random()*256)+","+Math.floor(Math.random()*256)+")";
        context.fillRect(pAcross, pDown, brickW, brickH);
        pDown += 1; 
     }
     else{
       powerHit = false;
     }    
      
      // Draws ball

      context.beginPath();
      context.arc(ballX, ballY, ballH, 0, 2 * Math.PI, false);
      context.fillStyle = "white";
      context.fill();
      
    }

    else {   // End of game
         if (inplay > 0){
            context.font = "bold 24px Georgia";
            context.fillStyle = "red";
            context.fillText("Game Over - ", 200, 270);
            context.fillText("Thanks for playing!", 200, 300);
			showbuttons();
                         }  
      context.font = "bold 24px Georgia";
      context.fillStyle = "red";
      context.fillText("Select a difficulty", 200, 360);
      context.fillText("mode to begin:", 200, 390);
         }  

}

function updateScore() {
    if (highScore < score) {
        highScore = score;
    }
    document.getElementById("highscore").innerHTML = '' + highScore;
    document.getElementById("score").innerHTML = '' + score;
    document.getElementById("lives").innerHTML = '' + lives;
}

function overlap(ax, aw, bx, bw) {
    return ! ((ax + aw) <= bx || ax >= (bx + bw + paddleBoost)); //logic checking that the ball has hit the paddle, only returning true if X,Y coords don't fall beyond paddle  
}

function overlap2D(ax, ay, aw, ah, bx, by, bw, bh) {
    return overlap(ax, aw, bx, bw) &&
        overlap(ay, ah, by, bh); // if not 'true' 'true' then ball not nerfed
}
//ballX, ballY, ballW, ballH, paddleX, paddleY, paddleW, paddle

function overlapPU(ax, ay, aw, ah, bx, by, bw, bh) {
    return overlap(ax, aw, bx, bw) &&
        overlap(ay, ah, by, bh); // if not 'true' 'true' then power up not caught
}
//puX, puY, puW, puH, paddleX, paddleY, paddleW, paddle


function serveBall() {
    ballX = ballStartX;
    ballY = ballStartY;
    ballDY = ballSpeed;
    ballDX = ballSpeed;
    ballNerfed = true;
    inplay = 1; //Logic for end of game message
    paddleColor = "white";
    if (bricks[powerLoc] == false){
      paddleBoost = 0;
    }
}

function moveBall() {
    ballX += ballDX; //move ball horizontally
    ballY += ballDY; //move ball vertically
    
    var rightSide = fieldW - ballW;
    
    if (ballX > rightSide) {
        ballX = 2 * rightSide - ballX;
        ballDX = - ballDX;
    }
    
    if (ballX - ballW < 0) { // Adjust for left-side margin
        ballX = ballW;
        ballDX = -ballDX;
    }
    
    if (ballY < 0) { // Change direction, hitting top of canvas
        ballY = -ballY;
        ballDY = -ballDY;
        ballNerfed = false;
    }
    
    if (ballY > fieldH -25) { // -25 reflects score elements space
        lives = lives - 1;
        powerHit = false;
        updateScore();
        if (lives > 0) {
            serveBall();
        }
        
    }
  
  // Power up effects
  
if (overlapPU (pAcross, pDown, brickW, brickH, paddleX, paddleY, paddleW, paddleH) && powerHit) {
        paddleBoost = 25;  
        powerHit = false;
        paddleColor = "green";  
}
    
    var ballBottom = ballY + ballH;
    if (overlap2D(ballX, ballY, ballW, ballH,
                  paddleX, paddleY, paddleW, paddleH)) {
        ballNerfed = false;
        ballY = 2 * paddleY - ballBottom - ballH;
        ballDY = -ballDY;
        ballDX = ((ballX + ballW * 0.5) - (paddleX + paddleW * 0.5)) * 4 / paddleW; //deflection off of paddle
    }
    
    // Check for hitting a brick.
    if (! ballNerfed) {
        var bx = Math.floor(ballX / brickW);
        var by = Math.floor((ballY - brickStartY) / brickH);
        if (by >= 0 && by < brickRows) {
            var index = bx + by * brickColumns;
            if (bricks[index]) {
                ballNerfed = true;
                if (! powerHit && index == powerLoc){
                  pAcross = bx * brickW;
                  pDown = by * brickH + brickStartY;
                  powerHit = true;                  
                }
                bricks[index] = false;
                brickCount = brickCount - 1;
                brickPoint = 10 * (brickRows - by);
                score += brickPoint;
				        soundEfx.play();
                explosion();
                updateScore();
             
                if (brickCount <= 0) {
                    setupBricks();
                }
                ballDY = -ballDY;
                if (by === 0) {
                    if (ballDY < 0) {
                        ballDY = -2 * ballSpeed;
                    } else {
                        ballDY = 2 * ballSpeed;
                    }
                }
            }
        }
    }
}

function explosion(){

    var context2 = canvas2.getContext('2d');
  
    context2.font = "60px Georgia";
    context2.fillStyle = "red";
    context2.fillText("*",ballX - ballW, ballY + 30);

    setTimeout(function(){ 
    context2.clearRect(0, 0, fieldW, fieldH - 20);
    }, 500);

}


function startGame() {
    lives = livesPerGame;
    score = 0;
    updateScore();
    setupBricks();
    serveBall();
}

// Start the game

function domousemove(event) {
    var x=event.clientX;
    paddleX = x - 10; // Adjust for the left margin on the Canvas tag.
    paddleX -= (paddleW / 2);
    var leftEdge = 0;
    var rightEdge = fieldW - paddleW - paddleBoost;
    if (paddleX < leftEdge) {
        paddleX = leftEdge;
    }
    if (paddleX > rightEdge) {
        paddleX = rightEdge;
    }
}

function gameStep() {
    drawPicture();
    if (lives > 0) {
        moveBall();
    }
    
}

function setupGlobals() {
    canvas = document.getElementById('gameCanvas');
    canvas2 = document.getElementById('effectCanvas');
    soundEfx = document.getElementById('soundEfx');
    lives = 0;
    score = 0;
}

function game() {
    setupGlobals();
    setupBricks();
    lives = 0;
    setInterval(gameStep, 15);
}

document.onmousemove = domousemove;
