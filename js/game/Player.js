import GameManager from "./GameManager.js";
import Bomb from "./Bomb.js";

class Player {
  constructor(position, gameManager) {
    this.position = position;
    this.lives = 3;
    this.score = 0;
    this.gameManager = gameManager;
    this.direction = "down"; // Direction par défaut
    this.isMoving = false; // Indicateur de mouvement
    this.sprite = {}; // Tableau pour stocker les sprites par direction
    this.loadSprites(); // Chargement des sprites découpés
    this.element = null; // Référence à l'élément DOM du joueur
    this.currentFrameIndex = 0;
    this.frameInterval = 200; // Intervalle d'animation en ms
    this.lastFrameTime = 0;
    this.isInvulnerable = false; // Pour gérer une courte invulnérabilité après une collision
    this.invulnerabilityDuration = 2000; // 2 secondes d'invulnérabilité après une collision
    this.lastDamageTime = 0; // Temps du dernier dégât reçu
  }

  update(deltaTime) {
    if (this.isMoving) {
      this.lastFrameTime += deltaTime;
      if (this.lastFrameTime >= this.frameInterval) {
        this.currentFrameIndex =
          (this.currentFrameIndex + 1) % this.sprite[this.direction].length;
        this.updateSprite();
        this.lastFrameTime = 0;
      }
    }
    if (this.isInvulnerable) {
      this.lastDamageTime += deltaTime;
      if (this.lastDamageTime >= this.invulnerabilityDuration) {
        this.isInvulnerable = false;
        this.lastDamageTime = 0;
      }
    }
  }

  loadSprites() {
    this.sprite["down"] = [
      "assets/images/Player/bomberman_down_moove_1.png",
      "assets/images/Player/bomberman_down_moove_2.png",
      // Ajoutez tous les autres frames pour 'down' ici
    ];
    this.sprite["left"] = [
      "assets/images/Player/bomberman_left_moove_1.png",
      "assets/images/Player/bomberman_left_moove_2.png",
      "assets/images/Player/bomberman_left_moove_3.png",
      "assets/images/Player/bomberman_left_moove_4.png",
      "assets/images/Player/bomberman_left_moove_5.png",
      "assets/images/Player/bomberman_left_moove_6.png",
      "assets/images/Player/bomberman_left_moove_7.png",
      "assets/images/Player/bomberman_left_moove_8.png",
      // Ajoutez tous les autres frames pour 'left' ici
    ];
    this.sprite["right"] = [
      "assets/images/Player/bomberman_right_moove_1.png",
      "assets/images/Player/bomberman_right_moove_2.png",
      "assets/images/Player/bomberman_right_moove_3.png",
      "assets/images/Player/bomberman_right_moove_4.png",
      "assets/images/Player/bomberman_right_moove_5.png",
      "assets/images/Player/bomberman_right_moove_6.png",
      "assets/images/Player/bomberman_right_moove_7.png",
      "assets/images/Player/bomberman_right_moove_8.png",
      // Ajoutez tous les autres frames pour 'right' ici
    ];
    this.sprite["up"] = [
      "assets/images/Player/bomberman_up_moove_1.png",
      "assets/images/Player/bomberman_up_moove_2.png",
      // Ajoutez tous les autres frames pour 'up' ici
    ];
  }

  render(grid) {
    const cell = grid[this.position.y][this.position.x];
    this.element = document.createElement("div");
    this.element.classList.add("player");
    cell.element.appendChild(this.element);
    grid[this.position.y][this.position.x].containsPlayer = true;
    this.updateSprite(); // Mettre à jour le sprite initial
  }

  move(direction) {
    this.direction = direction;
    const newPosition = { ...this.position };

    switch (direction) {
      case "up":
        newPosition.y -= 1;
        break;
      case "down":
        newPosition.y += 1;
        break;
      case "left":
        newPosition.x -= 1;
        break;
      case "right":
        newPosition.x += 1;
        break;
    }

    if (this.canMoveTo(newPosition)) {
      const currentCell =
        this.gameManager.grid[this.position.y][this.position.x];
      currentCell.element.removeChild(this.element);

      this.position = newPosition;
      const newCell = this.gameManager.grid[this.position.y][this.position.x];
      newCell.element.appendChild(this.element);

      this.gameManager.grid[this.position.y][
        this.position.x
      ].containsPlayer = true;
      delete currentCell.containsPlayer;
      this.gameManager.checkWinPosition();

      this.isMoving = true;
      this.currentFrameIndex = 0; // Réinitialiser l'index de l'animation
      this.updateSprite(); // Mettre à jour le sprite pour refléter le mouvement
    } else {
      this.isMoving = false; // Arrêter le mouvement si on ne peut pas se déplacer
    }
  }

  updateSprite() {
    const frames = this.sprite[this.direction];
    this.element.style.backgroundImage = `url(${
      frames[this.currentFrameIndex]
    })`;
    this.element.style.backgroundSize = "contain"; // Ajustez la taille de l'image de fond
    this.element.style.backgroundPosition = "center"; // Centrer l'image de fond
    this.element.style.backgroundRepeat = "no-repeat"; // Empêcher la répétition de l'image de fond
  }

  canMoveTo(position) {
    const cell =
      this.gameManager.grid[position.y] &&
      this.gameManager.grid[position.y][position.x];
    return cell && cell.type === "accessible";
  }

  decreaseLife() {
    if (!this.isInvulnerable) {
      this.lives--;
      this.isInvulnerable = true; // Active l'invulnérabilité après avoir perdu une vie
      this.updateLifeDisplay();

      if (this.lives <= 0) {
        this.gameManager.endGame();
      } else {
        console.log(`Player lost a life. Remaining lives: ${this.lives}`);
      }
    }
  }

  placeBomb() {
    const cell = this.gameManager.grid[this.position.y][this.position.x];
    const bomb = new Bomb(this.position, this.gameManager);
    this.gameManager.bombs.push(bomb); // Ajouter la bombe à la liste des bombes du GameManager
    bomb.render(cell.element);
  }
  updateLifeDisplay() {
    const lifeDisplay = document.getElementById("lifeDisplay");
    if (lifeDisplay) {
      lifeDisplay.textContent = `Lives: ${this.lives}`;
    }
  }
}

export default Player;
