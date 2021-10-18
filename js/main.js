const width = 720;
const height = 1080;
const playerSize = 5;
const maxSpd = 10;
var enemies;
setup = function () {
    var myCanvas = createCanvas(width, height);
    myCanvas.parent("game-container");

    player = createSprite(width / 2, height / 2, playerSize, playerSize);
    player.shapeColor = color(255, 0, 0);
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
    enemies.add(e);
}



function enemyLine(side, size, spd, sep, offset = 0) {
    for (i = offset; i <= width; i += sep) {
        createEnemy(i, 0, size, size, spd, 90);
    }
}

function cleanEnemies() {
    for (var i = 0; i < enemies.length; i++) {
        if (enemies[i].position.x < 0 || enemies[i].position.x > width || enemies[i].position.y < 0 || enemies[i].position.y > height)
            enemies[i].remove();
    }
}

function handlePlayer() {
    if (!(mouseX < 0 || mouseX > width || mouseY < 0 || mouseY > height)) {
        //player.position.x = mouseX;
        //player.position.y = mouseY;
        player.velocity.x = Math.min((mouseX-player.position.x)/10,maxSpd);
        player.velocity.y = Math.min((mouseY-player.position.y)/10,maxSpd);
    }
    if (player.overlap(enemies) || enemies.overlap(player)) {
        player.remove();
    }
}

function handleEnemies() {
    //phase 0
    if (curmillis < 10000) {
        if (frameCount % 60 == 0) {
            if (frameCount / 60 % 2 == 0) createEnemy(width / 4, 0, 20, width / 2, 5, 90);
            else createEnemy(width - width / 4, 0, 20, width / 2, 5, 90);
        }
    }
    //phase 1
    else if (curmillis < 30000 && frameCount % 10 == 0) {
        createEnemy()
    }

}

function draw() {
    curmillis = millis();
    background(0);
    handlePlayer()
    handleEnemies()

    cleanEnemies();

    drawSprites();
}