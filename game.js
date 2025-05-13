
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const gridSize = 20;
const tileCountX = canvas.width / gridSize;
const tileCountY = canvas.height / gridSize;

let snake = [{ x: 10, y: 10 }];
let velocity = { x: 1, y: 0 };
let food = spawnFood();
let enemies = [];
let score = 0;

function spawnFood() {
  return {
    x: Math.floor(Math.random() * tileCountX),
    y: Math.floor(Math.random() * tileCountY),
  };
}

function spawnEnemy() {
  return {
    x: Math.floor(Math.random() * tileCountX),
    y: Math.floor(Math.random() * tileCountY),
    dir: Math.random() < 0.5 ? { x: 1, y: 0 } : { x: 0, y: 1 },
  };
}

function draw() {
  ctx.fillStyle = "#222";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "lime";
  for (let segment of snake) {
    ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize);
  }

  ctx.fillStyle = "red";
  ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);

  ctx.fillStyle = "orange";
  for (let e of enemies) {
    ctx.fillRect(e.x * gridSize, e.y * gridSize, gridSize, gridSize);
  }

  ctx.fillStyle = "#fff";
  ctx.fillText("Score: " + score, 10, 10);
}

function update() {
  const head = { x: snake[0].x + velocity.x, y: snake[0].y + velocity.y };

  if (head.x < 0 || head.x >= tileCountX || head.y < 0 || head.y >= tileCountY) {
    return reset();
  }

  for (let s of snake) {
    if (s.x === head.x && s.y === head.y) return reset();
  }

  for (let e of enemies) {
    if (e.x === head.x && e.y === head.y) return reset();
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    score++;
    food = spawnFood();
    if (Math.random() < 0.3) enemies.push(spawnEnemy());
  } else {
    snake.pop();
  }

  for (let e of enemies) {
    e.x += e.dir.x;
    e.y += e.dir.y;
    if (e.x < 0 || e.x >= tileCountX) e.dir.x *= -1;
    if (e.y < 0 || e.y >= tileCountY) e.dir.y *= -1;
  }
}

function reset() {
  snake = [{ x: 10, y: 10 }];
  velocity = { x: 1, y: 0 };
  food = spawnFood();
  enemies = [];
  score = 0;
}

document.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "ArrowUp":
      if (velocity.y === 0) velocity = { x: 0, y: -1 };
      break;
    case "ArrowDown":
      if (velocity.y === 0) velocity = { x: 0, y: 1 };
      break;
    case "ArrowLeft":
      if (velocity.x === 0) velocity = { x: -1, y: 0 };
      break;
    case "ArrowRight":
      if (velocity.x === 0) velocity = { x: 1, y: 0 };
      break;
  }
});

function loop() {
  update();
  draw();
}

setInterval(loop, 150);
