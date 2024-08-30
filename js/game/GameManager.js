import Player from "./Player.js";
import Bomb from "./Bomb.js";
import Timer from "../utils/Timer.js";
import FPSManager from "./FPSManager.js";
import Enemy from './Enemy.js';

class GameManager {
  constructor(gridSize) {
    this.gridSize = gridSize;
    this.initialGrid = null;
    this.player = new Player(this.getStartingPosition(), this);
    this.bombs = [];
    this.enemies = [];
    this.gameStarted = false;
    this.isPaused = false;
    this.timer = new Timer();
    this.fpsManager = new FPSManager();
    this.wincell = null;
    this.grid = this.createGrid();
    this.lastFrameTime = 0;
  }

  createGrid() {
    const gridContainer = document.getElementById("game-container");
    gridContainer.innerHTML = "";

    const grid = [];
    const destructibleCells = [];

    for (let i = 0; i < this.gridSize; i++) {
      const row = [];
      const rowElement = document.createElement("div");
      rowElement.classList.add("row");

      for (let j = 0; j < this.gridSize; j++) {
        const cellElement = document.createElement("div");
        cellElement.classList.add("cell");

        const isWall =
          i === 0 ||
          i === this.gridSize - 1 ||
          j === 0 ||
          j === this.gridSize - 1 ||
          (i % 2 === 0 && j % 2 === 0);
        const isDestructible = Math.random() > 0.7 && !isWall;
        const isAccessible =
          (i === 1 && (j === 1 || j === 2)) ||
          (i === 2 && j === 1) ||
          (!isWall && !isDestructible);
        const cellType = isWall
          ? "incassable"
          : isAccessible
            ? "accessible"
            : "cassable";

        cellElement.classList.add(cellType);
        rowElement.appendChild(cellElement);

        const cell = { type: cellType, element: cellElement, x: j, y: i };
        row.push(cell);

        if (cellType === "cassable" &&
          (i >= this.gridSize / 2 || j >= this.gridSize / 2)) {
          destructibleCells.push(cell);
        }
      }

      gridContainer.appendChild(rowElement);
      grid.push(row);
    }

    if (destructibleCells.length > 0) {
      const randomIndex = Math.floor(Math.random() * destructibleCells.length);
      this.wincell = destructibleCells[randomIndex];
    }

    if (!this.initialGrid) {
      this.initialGrid = this.cloneGrid(grid);
    }

    console.log(this.wincell);
    return grid;
  }

  cloneGrid(grid) {
    return grid.map((row) =>
      row.map((cell) => ({ ...cell, element: cell.element.cloneNode(true) }))
    );
  }

  getStartingPosition() {
    return { x: 1, y: 1 };
  }

  gameLoop(timestamp) {
    if (!this.lastFrameTime) {
      this.lastFrameTime = timestamp;
    }

    const deltaTime = timestamp - this.lastFrameTime;
    this.lastFrameTime = timestamp;

    if (this.gameStarted && !this.isPaused) {
      this.update(deltaTime);
    }

    this.render();
    this.fpsManager.calculateFPS(timestamp);

    requestAnimationFrame(this.gameLoop.bind(this));
  }

  startGame() {
    if (!this.gameStarted) {
      console.log("Le jeu démarre !");
      this.player.render(this.grid);
      this.initializeEnemies();
      this.gameStarted = true;
      this.timer.start();
      requestAnimationFrame(this.gameLoop.bind(this));
    } else {
      console.log("Le jeu est déjà en cours !");
    }
  }

  update(deltaTime) {
    this.bombs.forEach(bomb => bomb.update(deltaTime));
    this.player.update(deltaTime);
    this.enemies.forEach(enemy => enemy.update(deltaTime));
  }

  render() {
    this.renderGrid();
  }

  pauseGame() {
    if (this.gameStarted && !this.isPaused) {
      this.isPaused = true;
      console.log("Le jeu est en pause !");
      this.bombs.forEach((bomb) => bomb.pause());
      this.timer.pause();
    } else {
      console.log("Le jeu n'est pas encore démarré ou est déjà en pause !");
    }
  }

  resumeGame() {
    if (this.gameStarted && this.isPaused) {
      this.isPaused = false;
      console.log("Le jeu reprend !");
      this.bombs.forEach((bomb) => bomb.resume());
      this.timer.resume();
    }
  }

  clearPlayerPosition() {
    const playerElement = document.querySelector(".player");
    if (playerElement) {
      playerElement.remove();
    }
  }

  renderGrid() {
    const gridContainer = document.getElementById("game-container");
    gridContainer.innerHTML = "";

    this.grid.forEach((row) => {
      const rowElement = document.createElement("div");
      rowElement.classList.add("row");

      row.forEach((cell) => {
        rowElement.appendChild(cell.element);
      });

      gridContainer.appendChild(rowElement);
    });
  }

  checkWinPosition() {
    const { x, y } = this.player.position;
    if (this.wincell && x === this.wincell.x && y === this.wincell.y) {
      this.endGame();
      this.uiManager.showWinMenu();
    }
  }

  endGame() {
    this.gameStarted = false;
    this.isPaused = true;
    this.bombs.forEach((bomb) => bomb.pause());
    this.timer.pause();
  }

  initializeEnemies() {
    for (let i = 0; i < 2; i++) {
      const enemyPosition = this.getRandomPositionInLowerHalf();
      const enemy = new Enemy(enemyPosition, this);
      this.enemies.push(enemy);
      enemy.render(this.grid);
    }
  }

  getRandomPositionInLowerHalf() {
    let x, y, cell;
    do {
      x = Math.floor(Math.random() * this.gridSize);
      y = Math.floor(Math.random() * (this.gridSize / 2) + this.gridSize / 2);
      cell = this.grid[y][x];
    } while (cell.type !== 'accessible');

    return { x, y };
  }
}

export default GameManager;  
