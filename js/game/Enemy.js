class Enemy {
    constructor(position, gameManager) {
        this.position = position;
        this.gameManager = gameManager;
        this.element = null;
        this.moveInterval = 1000; // Temps entre chaque déplacement en millisecondes
        this.lastMoveTime = 0; // Dernière fois que l'ennemi a bougé
        this.direction = 'down'; // Direction initiale
        this.currentFrameIndex = 0; // Index pour l'animation des sprites
        this.frameInterval = 200; // Intervalle entre les frames de l'animation
        this.lastFrameTime = 0; // Temps écoulé depuis le dernier changement de frame
        this.isDead = false; // Indique si l'ennemi est mort

        // Définition des sprites pour chaque direction
        this.sprites = {
            up: [
                'assets/images/Enemy/ennemy_up_1.png',  // Remplacez par les chemins réels de vos sprites "up"
                'assets/images/Enemy/ennemy_up_2.png',
                'assets/images/Enemy/ennemy_up_3.png'
            ],
            down: [
                'assets/images/Enemy/ennemy_down_1.png',  // Remplacez par les chemins réels de vos sprites "down"
                'assets/images/Enemy/ennemy_down_2.png',
                'assets/images/Enemy/ennemy_down_3.png'
            ],
            left: [
                'assets/images/Enemy/ennemy_left_1.png',  // Remplacez par les chemins réels de vos sprites "left"
                'assets/images/Enemy/ennemy_left_2.png',
                'assets/images/Enemy/ennemy_left_3.png'
            ],
            right: [
                'assets/images/Enemy/ennemy_right_1.png',  // Remplacez par les chemins réels de vos sprites "right"
                'assets/images/Enemy/ennemy_right_2.png',
                'assets/images/Enemy/ennemy_right_3.png'
            ],
            dead: 'assets/images/Enemy/ennemy_die.png' // Sprite pour la mort de l'ennemi
        };

        this.loadSprite(); // Charge le sprite initial en fonction de la direction
    }

    loadSprite() {
        if (this.element) {
            if (this.isDead) {
                // Affiche le sprite de mort si l'ennemi est mort
                this.element.style.backgroundImage = `url(${this.sprites.dead})`;
            } else {
                // Affiche le sprite correspondant à la direction actuelle et à l'index de frame
                const frames = this.sprites[this.direction];
                this.element.style.backgroundImage = `url(${frames[this.currentFrameIndex]})`;
            }
            this.element.style.backgroundSize = 'contain';
            this.element.style.backgroundRepeat = 'no-repeat';
            this.element.style.backgroundPosition = 'center';
        }
    }

    render(grid) {
        const cell = grid[this.position.y][this.position.x];
        this.element = document.createElement("div");
        this.element.classList.add("enemy");
        this.loadSprite(); // Charge le sprite lors du rendu initial
        cell.element.appendChild(this.element);
    }

    update(deltaTime) {
        this.lastMoveTime += deltaTime;
        this.lastFrameTime += deltaTime;

        if (this.lastFrameTime >= this.frameInterval) {
            this.currentFrameIndex = (this.currentFrameIndex + 1) % 3; // Passe à la frame suivante
            this.loadSprite(); // Met à jour le sprite
            this.lastFrameTime = 0; // Réinitialise le temps écoulé pour les frames
        }

        if (!this.isDead && this.lastMoveTime >= this.moveInterval) {
            this.move(); // Appelle la méthode de déplacement
            this.lastMoveTime = 0; // Réinitialise le temps écoulé pour le mouvement
        }

        if (!this.isDead) {
            this.checkCollisionWithPlayer(); // Vérifie la collision avec le joueur
        }
    }

    move() {
        const adjacentAccessibleCells = this.getAdjacentAccessibleCells();
        if (adjacentAccessibleCells.length > 0) {
            const randomCell = adjacentAccessibleCells[Math.floor(Math.random() * adjacentAccessibleCells.length)];

            const newX = randomCell.x;
            const newY = randomCell.y;
            if (newX > this.position.x) {
                this.direction = 'right';
            } else if (newX < this.position.x) {
                this.direction = 'left';
            } else if (newY > this.position.y) {
                this.direction = 'down';
            } else if (newY < this.position.y) {
                this.direction = 'up';
            }

            this.moveTo(randomCell);
        }
    }

    moveTo(cell) {
        const currentCell = this.gameManager.grid[this.position.y][this.position.x];
        currentCell.element.removeChild(this.element);

        this.position = { x: cell.x, y: cell.y };

        cell.element.appendChild(this.element);
    }

    getAdjacentAccessibleCells() {
        const { x, y } = this.position;
        const directions = [
            { x: 0, y: -1 }, // Up
            { x: 0, y: 1 },  // Down
            { x: -1, y: 0 }, // Left
            { x: 1, y: 0 },  // Right
        ];

        return directions.map(dir => {
            const newX = x + dir.x;
            const newY = y + dir.y;
            if (this.isWithinGrid(newX, newY)) {
                const cell = this.gameManager.grid[newY][newX];
                if (cell.type === 'accessible') { // Vérifie si la cellule est accessible
                    return cell;
                }
            }
            return null;
        }).filter(cell => cell !== null);
    }

    isWithinGrid(x, y) {
        return y >= 0 && y < this.gameManager.grid.length && x >= 0 && x < this.gameManager.grid[0].length;
    }

    die() {
        this.isDead = true;
        this.loadSprite(); // Affiche le sprite de mort

        setTimeout(() => {
            const currentCell = this.gameManager.grid[this.position.y][this.position.x];
            currentCell.element.removeChild(this.element);

            const index = this.gameManager.enemies.indexOf(this);
            if (index > -1) {
                this.gameManager.enemies.splice(index, 1);
            }

            this.gameManager.player.score += 100;
            this.gameManager.uiManager.updateHUD();
        }, 500); // Délai avant de retirer l'ennemi (pour que l'animation de mort soit visible)
    }

    checkCollisionWithPlayer() {
        const playerPosition = this.gameManager.player.position;
        if (this.position.x === playerPosition.x && this.position.y === playerPosition.y) {
            this.gameManager.player.decreaseLife(); // Si l'ennemi touche le joueur, il perd une vie
            console.log("Le joueur a été touché par un ennemi ! Vies restantes : " + this.gameManager.player.lives);
        }
    }
}

export default Enemy;
