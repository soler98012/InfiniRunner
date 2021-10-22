const width = 720;
const height = 1080;
const playerSize = 20;
const maxSpd = 10;
var enemies;
const particleSize = 15;

let startFrame, startMilis

var onMenu = true;
let menufont;

function preload() {
    menufont = loadFont('./Symtext.ttf');
}

function randomnum(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}
setup = function () {
    var myCanvas = createCanvas(width, height);
    myCanvas.parent("game-container");

    player = createSprite(width / 2, height / 2, playerSize, playerSize);
    player.shapeColor = color(255, 0, 0);

    player.setCollider("rectangle", 0, 0, 1, 1)
    noStroke();
    frameRate(120);
    enemies = new Group();
}

function createEnemy(x, y, sizex, sizey, spd, dir) {
    var e = createSprite(x, y, sizey, sizex);
    e.shapeColor = color(0, 255, 0);
    e.setSpeed(spd, dir);
    enemies.add(e);
}

function createCircleEnemy(x, y, sizex, sizey, spd, dir) {
    var e = createSprite(x, y, sizey, sizex);
    e.shapeColor = color(0, 255, 0);
    e.setSpeed(spd, dir);
    e.setCollider("circle")
    e.draw = function () {
        fill(e.shapeColor)
        ellipse(0, 0, sizey, sizex)
    }
    enemies.add(e);
}



function enemyLine(side, size, spd, sep, offset = 0) {
    for (i = offset; i <= width; i += sep) {
        createEnemy(i, 0, size, size, spd, 90);
    }
}

function cleanEnemies() {
    for (var i = 0; i < enemies.length; i++) {
        if (enemies[i].position.x + enemies[i].width < 0 || enemies[i].position.x - enemies[i].width > width || enemies[i].position.y + enemies[i].height < 0 || enemies[i].position.y - enemies[i].height > height)
            enemies[i].remove();
    }
}

function handlePlayer() {
    //particles
    if (frames % 10 == 0 && Math.round(player.velocity.x) != 0 && Math.round(player.velocity.y != 0)) {
        part = createSprite(player.position.x, player.position.y, particleSize, particleSize);
        part.rotationSpeed = player.velocity.x;
        part.depth = -100;
        part.shapeColor = color(255, randomnum(0, 255), 0, 129)
        part.velocity.x = -player.velocity.x * 0.5;
        part.velocity.y = -player.velocity.y * 0.5;
        part.life = 120;
    }
    //movement
    if (!(mouseX < 0 || mouseX > width || mouseY < 0 || mouseY > height)) {
        //player.position.x = mouseX;
        //player.position.y = mouseY;
        player.velocity.x = Math.min((mouseX - player.position.x) / 10, maxSpd);
        player.velocity.y = Math.min((mouseY - player.position.y) / 10, maxSpd);
    } else {
        player.velocity.x = 0;
        player.velocity.y = 0;
    }
    //death
    if (player.overlap(enemies) || enemies.overlap(player)) {
        player.remove();
    }
    //draw
    player.draw = function () {
        fill(255)
        //ellipse(0, 0, playerSize, playerSize)
        push();
        rotate(radians(this.getDirection()));
        ellipse(0, 0, playerSize + (this.getSpeed() * 0.5), playerSize - this.getSpeed() * 0.5);
        pop();
        fill(player.shapeColor)
        ellipse(0, 0, 5, 5)
    }

}

function handleEnemies() {
    //phase 0
    if (curmillis < 10000) {
        if (frames % 60 == 0) {
            if (frames / 60 % 2 == 0) createEnemy(width / 4, 0, 20, width / 2, 5, 90);
            else createEnemy(width - width / 4, 0, 20, width / 2, 5, 90);
        }
    }
    //phase 1
    else if (curmillis < 30000) {
        if (frames % 120 == 0) {
            if (frames / 120 % 2 == 0) createCircleEnemy(0, -width / 2, width, width, 5, 90);
            else createCircleEnemy(width, -width / 2, width, width, 5, 90);
        }
    }

}

function draw() {
    if (onMenu == false) {
        curmillis = millis() - startMilis;
        frames = frameCount - startFrame;
        background(0);
        handlePlayer();
        handleEnemies();
        console.log(player.velocity.x, player.velocity.y)
        cleanEnemies();
        drawSprites();
    } else{
        textFont(menufont);
        textAlign(CENTER);
        text("Bulleteer",width/2,20)
    }
}