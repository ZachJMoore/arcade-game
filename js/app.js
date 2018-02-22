//set score and lives html elements
const score = document.querySelector("#score");
const lives = document.querySelector("#lives");
const enemyPositions = [72, 155, 238]; //the only three available places for a bug to be
lives.textContent = 3;
var Enemy = function (speed = 1, x = 0, y = 65) {
    this.x = x;
    this.y = y;
    this.speed = speed
    this.sprite = "images/enemy-bug.png";
};
Enemy.prototype.update = function () {
    this.x += this.speed + (score.textContent / 20)//sets the speed equal to the value input when a new object is created, plus increases everytime a player scores

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

let Player = function (x = 202, y = 404) {
    this.sprite = "images/char-boy.png";
    this.x = x;
    this.y = y;
}

Player.prototype.update = function () {
    //checks or collision and decreases a life if so.
    if ((this.y === enemyOne.y) && (this.x - 50 <= enemyOne.x) && (this.x + 50 >= enemyOne.x) ||
        (this.y === enemyTwo.y) && (this.x - 50 <= enemyTwo.x && this.x + 50 >= enemyTwo.x) ||
        (this.y === enemyThree.y) && (this.x - 50 <= enemyThree.x && this.x + 50 >= enemyThree.x)) {
        console.log("collision")
        this.y = 404;
        this.x = 202;
        lives.textContent--;
    }
    //checks for lives left, if none, display an alert which effectively pauses the game, while returning the player score.
    if (lives.textContent == 0) {
        console.log("you lost")
        this.y = 404;
        this.x = 202;
        alert(`Game Over! You were getting so far. You got a score of ${score.textContent}`);
        lives.textContent = 3;
        score.textContent = 0;
    }
    //checks if the player has reached the end and increases the points by about 10 each time. the setTimeout() also provides visual aid that the player made it to the end before resetting their position
    if (thePlayer.y === -11) {
        console.log("reached end")
        setTimeout(function () {
            thePlayer.y = 404;
            thePlayer.x = 202;
            score.textContent++
        }, 150)

    }
}
Player.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}
Player.prototype.handleInput = function (key) {
    //handles whether or not an arrow key will take the player out of the canvas, and if it does, then break. otherwise move the player.
    switch (key) {
        case "left":
            if ((this.x - 101) < 0) {
                break;
            }
            this.x += -101;
            break;
        case "up":
            if ((this.y - 83) < -50) {
                break
            }
            this.y += -83;
            break;
        case "right":
            if ((this.x + 101) > 500) {
                break
            }
            this.x += 101;
            break;
        case "down":
            if ((this.y + 83) > 450) {
                break
            }
            this.y += 83;
            break;
    }
}
//make all objects and add them to the arrays
let enemyOne = new Enemy(1, 0, enemyPositions[0]);
let enemyTwo = new Enemy(2, 0, enemyPositions[1]);
let enemyThree = new Enemy(4, 0, enemyPositions[2]);
let thePlayer = new Player();
let allEnemies = [enemyOne, enemyTwo, enemyThree];
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
