"use strict";

//set score and lives html elements
const scoreText = document.querySelector("#score");
const highscoreText = document.querySelector("#highscore");
const lives = document.querySelector("#lives");
const enemyPositions = [72, 155, 238]; //the only three available places for a bug to be
lives.textContent = 3;
let highscore;
let score = 0
let highscoreStorage = window.localStorage;

//check whether there is a highscore already and if it needs to be set or updated
if (highscoreStorage.getItem("highscore") === null) {
    highscore = score;
    highscoreStorage.setItem("highscore", highscore);
} else {
    highscore = parseInt(highscoreStorage.getItem("highscore"));
    highscoreText.textContent = highscore;
}

var Enemy = function (speed = 1, x = 0, y = 65) {
    this.x = x;
    this.y = y;
    this.speed = speed
    this.sprite = "images/enemy-bug.png";
};
Enemy.prototype.update = function (dt) {

    //sets the speed equal to the value input when a new object is created, plus increases everytime a player scores
    this.x = (this.x + score / 15) + (dt * this.speed);

    //checks whether the bug is out of view, then resets to the other side if true.
    if (this.x > 600) {
        this.x = -100

        //randomizes the bug spawn position on the y axis/
        let newPosition = Math.floor(Math.random() * 3);
        this.y = enemyPositions[newPosition];
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

//make all objects and add them to the arrays
let enemyOne = new Enemy(60, 0, enemyPositions[0]);
let enemyTwo = new Enemy(90, 0, enemyPositions[1]);
let enemyThree = new Enemy(120, 0, enemyPositions[2]);
let allEnemies = [enemyOne, enemyTwo, enemyThree];

let Player = function (x = 202, y = 404) {
    this.sprite = "images/char-boy.png";
    this.x = x;
    this.y = y;
}

//add up score, Player function
Player.prototype.score = function (playerObject) {
    console.log("reached end")
    // the setTimeout() provides visual aid that the player made it to the end before resetting their position
    setTimeout(function () {
        playerObject.y = 404;
        playerObject.x = 202;
        score += 10;
        updateScore();
    }, 350)
}

Player.prototype.update = function () {
    //checks or collision and decreases a life if so.
    for (let i = 0; i <= 2; i++) {
        if ((this.y === allEnemies[i].y) && (this.x - 50 <= allEnemies[i].x) && (this.x + 50 >= allEnemies[i].x)) {
            console.log("collision")
            this.y = 404;
            this.x = 202;
            lives.textContent--;
        }
    }
    //checks for lives left, if none, display an alert which effectively pauses the game, while returning the player score.
    if (lives.textContent == 0) {
        console.log("you lost")
        this.y = 404;
        this.x = 202;
        alert(`Game Over! You were getting so far. You got a score of ${score}`);
        lives.textContent = 3;
        score = 0;
        updateScore();
    }
}
Player.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}
Player.prototype.handleInput = function (key) {
    //check if the player has reached the end. Call it down below whenever a move is made
    let checkEnd = function (playerObject) {
        if (playerObject.y === -11) {
            playerObject.score(playerObject);
        }
    }
    //handles whether or not an arrow key will take the player out of the canvas, and if it does, then break. otherwise move the player and check for a win.
    switch (key) {
        case "left":
            if ((this.x - 101) < 0) {
                break;
            }
            this.x += -101;
            checkEnd(this);
            break;
        case "up":
            if ((this.y - 83) < -50) {
                break
            }
            this.y += -83;
            checkEnd(this);
            break;
        case "right":
            if ((this.x + 101) > 500) {
                break
            }
            this.x += 101;
            checkEnd(this);
            break;
        case "down":
            if ((this.y + 83) > 450) {
                break
            }
            this.y += 83;
            checkEnd(this);
            break;
    }

}
//initalize player
let thePlayer = new Player();
let player = thePlayer

document.addEventListener('keyup', function (e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

function updateScore() {
    scoreText.textContent = score;
    //update highscore if it is less than the new score
    if (parseInt(highscoreStorage.getItem("highscore")) < score) {
        highscore = score;
        highscoreStorage.setItem("highscore", highscore);
    }
    highscoreText.textContent = highscore
}
