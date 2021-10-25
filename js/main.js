const width = 720;
const height = 1080;
const playerSize = 20;
const maxSpd = 10;
var enemies;
const particleSize = 15;
const startx = width / 2,
    starty = height / 2 + 70
let startFrame, startMillis

var onMenu = true;
let menufont;

function preload() {
    menufont = loadFont('css/Symtext.ttf');
}

function randomnum(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}
setup = function () {
    debug = true;

    var myCanvas = createCanvas(width, height);
    myCanvas.parent("game-container");
    startbutton = createSprite(startx, starty, playerSize + 5, playerSize + 5);
    startbutton.shapeColor = color(255, 0, 0);
    noStroke();
    frameRate(120);
    enemies = new Group();

    startbutton.onMousePressed = function () {
        if (onMenu == true) {
            console.log("test");
            startMillis = millis();
            startFrame = frameCount;
            onMenu = false;
            this.visible = false;
            //player.position = startbutton.position;

            player = createSprite(startx, starty, playerSize, playerSize);
            //player.shapeColor = color(255, 0, 0);
            player.setCollider("rectangle", 0, 0, 1, 1)
        }
    }
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
    if (frames % 10 == 0 && Math.round(player.velocity.x) != 0 && Math.round(player.velocity.y != 0) && player.visible == true) {
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
        onMenu = true;
        startbutton.visible = true;
        player.remove();
        //player.visible = false;
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
        curmillis = millis() - startMillis;
        frames = frameCount - startFrame;
        background(0);
        handlePlayer();
        handleEnemies();
        console.log(player.velocity.x, player.velocity.y)
        cleanEnemies();
    } else {
        background(0);
        textFont(menufont);
        textSize(100);
        fill(255, 255, 255)
        textAlign(CENTER);
        text("Bulleteer", width / 2, 100)


        textSize(25);
        text("click the circle to start", width / 2, 450)

        rect(
            width / 2 - 10,
            500,
            20,
            20 + ((Math.sin(frameCount / 20) + 1) * 20)
        )
        triangle(
            width / 2 - 20,
            490 + 20 + ((Math.sin(frameCount / 20) + 1) * 20),

            width / 2 + 20,
            490 + 20 + ((Math.sin(frameCount / 20) + 1) * 20),

            width / 2,
            510 + 20 + ((Math.sin(frameCount / 20) + 1) * 20),
        )

        startbutton.draw = function () {
            fill(255);
            ellipse(0, 0, playerSize + 10, playerSize + 10);
        }

    }
    drawSprites();
}