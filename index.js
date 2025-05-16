 // Configurações do canvas
 const canvas = document.getElementById("gameCanvas");
 const ctx = canvas.getContext("2d");

 const playerWidth = 50;
 const playerHeight = 50;
 let player = {
     x: canvas.width / 2 - playerWidth / 2,
     y: canvas.height - playerHeight - 10,
     width: playerWidth,
     height: playerHeight,
     speed: 5
 };

 let bullets = [];
 let enemies = [];
 let score = 0;
 let gameOver = false;
 let gameInterval;
 let bulletSpeed = 4;
 let enemySpeed = 1;

 // Função para desenhar o jogador (nave)
 function drawPlayer() {
     ctx.fillStyle = "green";
     ctx.fillRect(player.x, player.y, player.width, player.height);
 }

 // Função para desenhar as balas
 function drawBullets() {
     ctx.fillStyle = "red";
     bullets.forEach(bullet => {
         ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
     });
 }

 // Função para desenhar os inimigos
 function drawEnemies() {
     ctx.fillStyle = "yellow";
     enemies.forEach(enemy => {
         ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
     });
 }

 // Função para atualizar a posição das balas
 function updateBullets() {
     bullets.forEach((bullet, index) => {
         bullet.y -= bulletSpeed;
         if (bullet.y < 0) {
             bullets.splice(index, 1); // Remove a bala se sair da tela
         }
     });
 }

 // Função para atualizar a posição dos inimigos
 function updateEnemies() {
     enemies.forEach(enemy => {
         enemy.y += enemySpeed;
         if (enemy.y > canvas.height - playerHeight) {
             gameOver = true;
             document.getElementById("game-over").style.display = "block";
             clearInterval(gameInterval);
         }
     });

     // Verifica colisões entre as balas e inimigos
     bullets.forEach((bullet, bulletIndex) => {
         enemies.forEach((enemy, enemyIndex) => {
             if (
                 bullet.x < enemy.x + enemy.width &&
                 bullet.x + bullet.width > enemy.x &&
                 bullet.y < enemy.y + enemy.height &&
                 bullet.y + bullet.height > enemy.y
             ) {
                 // Se colidiu, remove o inimigo e a bala
                 enemies.splice(enemyIndex, 1);
                 bullets.splice(bulletIndex, 1);
                 score += 10;
             }
         });
     });
 }

 // Função para gerar novos inimigos
 function generateEnemies() {
     if (Math.random() < 0.02) {
         let x = Math.random() * (canvas.width - 50);
         enemies.push({ x, y: 0, width: 50, height: 50 });
     }
 }

 // Função para desenhar a pontuação
 function drawScore() {
     document.getElementById("score").textContent = `Pontuação: ${score}`;
 }

 // Função para mover o jogador
 function movePlayer() {
     if (keys[37] && player.x > 0) { // seta esquerda
         player.x -= player.speed;
     }
     if (keys[39] && player.x < canvas.width - player.width) { // seta direita
         player.x += player.speed;
     }
 }

 // Função para disparar balas
 function shoot() {
     if (!gameOver) {
         bullets.push({
             x: player.x + player.width / 2 - 2.5,
             y: player.y,
             width: 5,
             height: 10
         });
     }
 }

 // Função para atualizar o jogo
 function update() {
     if (gameOver) return;

     ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpa o canvas

     movePlayer();
     updateBullets();
     updateEnemies();
     drawPlayer();
     drawBullets();
     drawEnemies();
     generateEnemies();
     drawScore();
 }

 // Função de reinício do jogo
 function resetGame() {
     gameOver = false;
     score = 0;
     bullets = [];
     enemies = [];
     document.getElementById("game-over").style.display = "none";
     gameInterval = setInterval(update, 1000 / 60);
 }

 // Controle de teclas
 const keys = {};
 document.addEventListener("keydown", (e) => {
     keys[e.keyCode] = true;
     if (e.keyCode === 32) {
         shoot();
     }
 });

 document.addEventListener("keyup", (e) => {
     keys[e.keyCode] = false;
 });

 // Começa o jogo
 gameInterval = setInterval(update, 1000 / 60);

 // Reiniciar o jogo quando clicar na tela
 document.getElementById("game-over").addEventListener("click", resetGame);