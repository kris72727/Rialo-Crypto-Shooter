const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let score = 0;
let gameOver = false;

// Rialo player
const player = { x: 370, y: 420, w: 60, h: 60, speed: 7 };

// Bullets (coins Rialo shoots)
const bullets = [];

// Falling crypto coins
const enemies = [];

// Crypto coin emojis (can swap with images later)
const cryptoIcons = ["🪙","₿","Ξ","💎","🌕"];

// Draw player
function drawPlayer() {
  ctx.fillStyle = "cyan";
  ctx.fillRect(player.x, player.y, player.w, player.h);
  ctx.fillStyle = "black";
  ctx.fillText("🌀", player.x + 20, player.y + 40);
}

// Shoot bullet
function shoot() {
  bullets.push({ x: player.x + player.w/2 - 10, y: player.y, w: 20, h: 20 });
}

// Spawn falling crypto coin
function spawnEnemy() {
  const icon = cryptoIcons[Math.floor(Math.random()*cryptoIcons.length)];
  enemies.push({
    x: Math.random() * (canvas.width-40),
    y: -50,
    w: 40,
    h: 40,
    vy: 2 + Math.random()*3,
    icon: icon
  });
}

// Game loop
function gameLoop() {
  if (gameOver) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // background
  let g = ctx.createLinearGradient(0,0,canvas.width,canvas.height);
  g.addColorStop(0,"#222");
  g.addColorStop(1,"#000");
  ctx.fillStyle = g;
  ctx.fillRect(0,0,canvas.width,canvas.height);

  // Draw player
  drawPlayer();

  // Draw bullets
  bullets.forEach((b,i)=>{
    b.y -= 6;
    ctx.fillStyle = "yellow";
    ctx.fillText("💰", b.x, b.y);
    if (b.y < 0) bullets.splice(i,1);
  });

  // Draw enemies (falling coins)
  enemies.forEach((e,ei)=>{
    e.y += e.vy;
    ctx.fillText(e.icon, e.x, e.y);
    if (e.y > canvas.height) {
      enemies.splice(ei,1);
      gameOverScreen();
    }
  });

  // Collision detection
  for (let i=enemies.length-1;i>=0;i--){
    for (let j=bullets.length-1;j>=0;j--){
      let e=enemies[i], b=bullets[j];
      if (b.x < e.x+e.w && b.x+b.w > e.x && b.y < e.y+e.h && b.y+b.h > e.y) {
        enemies.splice(i,1);
        bullets.splice(j,1);
        score+=10;
        document.getElementById("score").textContent = `Score: ${score}`;
        break;
      }
    }
  }

  requestAnimationFrame(gameLoop);
}

// Game over screen
function gameOverScreen() {
  gameOver = true;
  ctx.fillStyle = "white";
  ctx.font = "40px Arial";
  ctx.fillText("💀 Game Over 💀", canvas.width/2 - 120, canvas.height/2);
  document.getElementById("restartBtn").style.display = "block";
}

// Controls
window.addEventListener("keydown",(e)=>{
  if(e.key==="ArrowLeft" && player.x>0) player.x -= player.speed;
  if(e.key==="ArrowRight" && player.x<canvas.width-player.w) player.x += player.speed;
  if(e.key===" ") shoot();
});

// Restart
document.getElementById("restartBtn").addEventListener("click",()=>{
  score=0;
  enemies.length=0;
  bullets.length=0;
  gameOver=false;
  document.getElementById("score").textContent=`Score: ${score}`;
  document.getElementById("restartBtn").style.display="none";
  gameLoop();
});

// Spawning enemies
setInterval(spawnEnemy, 1000);

// Start
ctx.font = "20px Arial";
gameLoop();
