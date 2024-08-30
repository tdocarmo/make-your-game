class Bomb {
  constructor(position, gameManager) {
    this.position = position;
    this.timeoutId = null;
    this.remainingTime = 3000; // Temps initial avant explosion
    this.startTime = null;
    this.gameManager = gameManager; // Référence vers le GameManager
    this.exploded = false; // Nouvelle variable pour vérifier si la bombe a déjà explosé
    this.explosionFrames = [
      "../assets/images/bomb/bomb_3.png",
      "../assets/images/bomb/bomb_1.png",
      "../assets/images/bomb/bomb_2.png"
    ]; // Les images d'explosion
    this.currentFrame = 0; // Cadre actuel de l'animation
    this.frameInterval = 1000; // Intervalle entre les images
  }

  render(container) {
    this.element = document.createElement("div");
    this.element.classList.add("bomb");
    this.element.style.backgroundImage = `url(${this.explosionFrames[this.currentFrame]
      })`;
    this.element.style.backgroundSize = "contain";
    this.element.style.backgroundRepeat = "no-repeat";
    container.appendChild(this.element);
    this.startTimer();
  }

  startTimer() {
    this.startTime = Date.now();
    this.animateExplosion();
    this.timeoutId = setTimeout(() => {
      this.explode();
    }, this.remainingTime);
  }

  animateExplosion() {
    this.currentFrame = (this.currentFrame + 1) % this.explosionFrames.length;
    this.element.style.backgroundImage = `url(${this.explosionFrames[this.currentFrame]
      })`;
    setTimeout(() => {
      if (!this.exploded) {
        this.animateExplosion();
      }
    }, this.frameInterval);
  }

  update(deltaTime) {
    if (!this.startTime) return;
    this.remainingTime -= deltaTime;

    if (this.remainingTime <= 0) {
      this.explode();
      this.startTime = null; // S'assurer qu'on ne met pas à jour une bombe déjà explosée
    }
  }

  pause() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.remainingTime -= Date.now() - this.startTime;
    }
  }

  resume() {
    if (this.remainingTime > 0) {
      this.startTimer();
    }
  }

  explode() {
    if (this.exploded) return; // Si la bombe a déjà explosé, ne rien faire
    this.exploded = true; // Marquer la bombe comme explosée

    const { x, y } = this.position;
    const { grid, bombs, player, enemies } = this.gameManager; // Utiliser les références du GameManager

    const directions = [
      { x: 0, y: 0 },  // Position actuelle (centre de l'explosion)
      { x: 0, y: -1 }, // Up
      { x: 0, y: 1 },  // Down
      { x: -1, y: 0 }, // Left
      { x: 1, y: 0 },  // Right
    ];

    let playerHit = false;

    directions.forEach((direction) => {
      const newX = x + direction.x;
      const newY = y + direction.y;

      if (this.isWithinGrid(newX, newY, grid)) {
        this.explodeCell(grid[newY][newX]);

        // Vérifie si la bombe explose sur la position du joueur
        if (player.position.x === newX && player.position.y === newY) {
          playerHit = true;
        }

        // Vérifie si un ennemi est touché par l'explosion
        enemies.forEach(enemy => {
          if (enemy.position.x === newX && enemy.position.y === newY) {
            enemy.die(); // Appelle la méthode pour tuer l'ennemi
          }
        });
      }
    });

    if (playerHit) {
      player.decreaseLife();
    }

    // Supprimer la bombe du tableau
    const bombIndex = bombs.indexOf(this);
    if (bombIndex > -1) {
      bombs.splice(bombIndex, 1);
      console.log("Bombe enlevée");
      this.remove(grid);
      this.element = null; // Assurez-vous que l'élément DOM est détruit
    }
  }
  explodeCell(cell) {
    // Vérifier si la cellule touchée est la wincell
    const { wincell } = this.gameManager;
    console.log("wincell explose", this.gameManager.wincell);

    if (wincell && cell.x === wincell.x && cell.y === wincell.y) {
      // Si c'est la wincell, effectuer les modifications spécifiques
      cell.element.classList.remove("cassable");
      cell.element.classList.add("accessible");
      cell.element.classList.add("win"); // Ajouter la classe win
      cell.type = "accessible";
      wincell.type = "accessible"; // Mettre à jour le type de wincell à accessible
    } else {
      // Si ce n'est pas la wincell, appliquer le traitement existant pour les cellules cassables
      if (cell.type === "cassable") {
        cell.element.classList.remove("cassable");
        cell.element.classList.add("accessible");
        cell.type = "accessible";
      }
    }
  }

  remove(grid) {
    const { x, y } = this.position;
    if (this.isWithinGrid(x, y, grid)) {
      const cell = grid[y][x];
      if (cell && cell.element.contains(this.element)) {
        cell.element.removeChild(this.element);
      }
    }
  }

  isWithinGrid(x, y, grid) {
    return grid && y >= 0 && y < grid.length && x >= 0 && x < grid[0].length;
  }
}

export default Bomb;
