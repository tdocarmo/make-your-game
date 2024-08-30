class GameOverMenu {
    constructor(uiManager) {
        this.uiManager = uiManager;
        this.gameOverMenu = document.getElementById('gameOverMenu');

        // Suppression du code lié au bouton "Restart"
        document.getElementById('newGameButton').addEventListener('click', () => {
            this.hideGameOverMenu();
            window.location.reload(); // Charge une nouvelle partie
        });
    }

    showGameOverMenu() {
        this.uiManager.timer.pause(); // Bloquer le timer
        this.gameOverMenu.style.display = 'flex';
    }

    hideGameOverMenu() {
        this.uiManager.timer.resume();
        this.gameOverMenu.style.display = 'none';
    }
}

export default GameOverMenu;
