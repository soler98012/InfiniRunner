gameContainer = document.getElementById("game-container");
player = document.createElement('div');
player.style.backgroundColor = "#ff0000"
player.style.width = "100px";
player.style.height = "100px";

var i = 0;
gameContainer.appendChild(player);
function update(){
    i++
    player.style.transform = "rotate(" + i + "deg)";
}


setInterval(() => {
 update()   
});