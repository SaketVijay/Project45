const canvas = document.getElementById('canvas1');
const ctx = canvas1.getContext('2d');
canvas1.width = 900;
canvas1.height = 600;

// global variables
const cellSize = 100;
const cellGap = 3;
const gameGrid = [];
const defenders = [];
let numberOfResources = 300;
const enemies = [];
const enemyPositions = [];
let enemiesInterval = 600;
let frame = 0;
let gameOver = false;

//mouse
const mouse = {
    x: 10,
    y: 10,
    width: 0.1,
    height: 0.1,
    
}
let canvas1Position = canvas1.getBoundingClientRect();
canvas1.addEventListener('mousemove', function(e){
    mouse.x = e.x - canvas1Position.left;
    mouse.y = e.y - canvas1Position.top;
});
canvas1.addEventListener('mouseleave', function(){
    mouse.x = undefined;
    mouse.y = undefined;
})
// game board
const controlsBar = {
    width: canvas1.width,
    height: cellSize,
}
class Cell {
    constructor(x, y){
        this.x = x;
        this.y = y;
        this.width = cellSize;
        this.height = cellSize;
    }
    draw(){
        if (mouse.x && mouse.y && collision(this, mouse)){
            ctx.strokeStyle = 'black';
            ctx.strokeRect(this.x, this.y, this.width, this.height);  
        }
    }
}
function createGrid(){
    for(let y = cellSize; y < canvas1.height; y += cellSize){
        for(let x = 0; x < canvas1.width; x += cellSize){
        gameGrid.push(new Cell(x, y));
        }
    }
}
createGrid();
function handleGameGrid(){
    for(let i = 0; i < gameGrid.length; i++){
        gameGrid[i].draw();
    }
}
// projectiles

// defenders
class Defender {
    constructor(x, y){
        this.x = x;
        this.y = y;
        this.width = cellSize;
        this.height = cellSize;
        this.shooting = false;
        this.health = 100;
        this.projectiles = [];
        this.timer = 0;
    }
    draw(){
        ctx.fillStyle = 'turquoise';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = 'red';
        ctx.font = '30px Arial';
        ctx.fillText(Math.floor(this.health), this.x + 15, this.y + 30);
    }
}
canvas1.addEventListener('click', function(){
    const gridPositionX = mouse.x   - (mouse.x % cellSize);
    const gridPositionY = mouse.y - (mouse.y % cellSize);
    if (gridPositionY < cellSize) return;
    for (let i = 0; i < defenders.length; i++){
        if(defenders[i].x === gridPositionX && defenders[i].y === gridPositionY) return;
    }
    let defenderCost = 100;
    if(numberOfResources >= defenderCost){
        defenders.push(new Defender(gridPositionX, gridPositionY))
        numberOfResources -= defenderCost;
    }
})
function handleDefenders(){
    for(let i = 0; i < defenders.length; i++){
        defenders[i].draw();
        for(let j = 0; j <enemies.length; j++){
            if(collision(defenders[i], enemies[j])){
                enemies[j].movement = 0;
                defenders[i].health -= 0.2;
            }
            if(defenders[i] && defenders[i].health <= 0){
                defenders.splice[i, 1];
                i--;
                enemies[j].movement = enemies[j].speed;
            }
        }
    }
}
// enemies
class Enemy{
    constructor(verticalPosition){
        this.x = canvas1.width;
        this.y = verticalPosition;
        this.width = cellSize;
        this.height = cellSize;
        this.speed = Math.random() * 0.2 + 0.4;
        this.movement = this.speed;
        this.health = 100;
        this.maxHealth = this.health;
    }
    update(){
        this.x -= this.movement;
    }
    draw(){
        ctx.fillStyle = 'red';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = 'black';
        ctx.font = '30px Arial';
        ctx.fillText(Math.floor(this.health), this.x + 15, this.y + 30);
    }
}
function handleEnemies(){
    for(let i = 0; i < enemies.length; i++){
        enemies[i].update();
        enemies[i].draw();
        if(enemies[i].x < 0){
            gameOver = true;
        }
    }
    if (frame % enemiesInterval === 0){
        let verticalPosition = Math.floor(Math.round() * 5 + 1) * cellSize;
        enemies.push(new Enemy(verticalPosition));
        enemyPositions.push(verticalPosition)
        if(enemiesInterval > 120) enemiesInterval -= 50;
    }
}

// resources
// utility
function handleGameStatus(){
    ctx.fillStyle = 'black';
    ctx.font = '30px Arial';
    ctx.fillText('Resources: ' + numberOfResources, 20, 55);
    if(gameOver){
        ctx.fillStyle = 'black';
        ctx.font = '60px Arial';
        ctx.fillText('GAME OVER', 135, 330)
    }
}

function animate(){
    ctx.clearRect(0, 0, canvas1.width, canvas1.height);
    ctx.fillStyle = 'cyan'
    ctx.fillRect(0,0,controlsBar.width, controlsBar.height);
    handleGameGrid();
    handleDefenders();
    handleGameStatus();
    handleEnemies();
    requestAnimationFrame(animate);
    ctx.fillText('Resources: ' + numberOfResources, 20, 55);
    frame++;
  if(!gameOver)requestAnimationFrame(animate);
}
animate();
function collision(first, second){
    if(     !(  first.x > second.x + second.width ||
                first.x + first.width < second.x ||
                first.y > second.y + second.height ||
                first.y + first.height < second.y)
    ){
        return true;
    };
}; 