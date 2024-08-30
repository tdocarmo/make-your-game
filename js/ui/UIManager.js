import HUD from "./HUD.js";
import PauseMenu from "./PauseMenu.js";
import GameOverMenu from "./GameOverMenu.js";
import WinMenu from "./WinMenu.js";

class UIManager {
  constructor(gameManager) {
    this.hud = new HUD();
    this.gameManager = gameManager;
    this.timer = gameManager.timer;
    this.pauseMenu = new PauseMenu(this);
    this.gameOverMenu = new GameOverMenu(this);
    this.winMenu = new WinMenu(this);

    this.updateHUD();
    this.startTimerUpdate();
  }

  updateHUD() {
    const { lives, score } = this.gameManager.player;
    const time = this.timer.getTime();
    const displayedLives = Math.max(lives, 0);

    this.hud.updateHUD(displayedLives, score, time);

    if (displayedLives <= 0) {
      this.gameManager.endGame();
      this.showGameOverMenu();
    }
  }

  startTimerUpdate() {
    setInterval(() => {
      this.updateHUD();
    }, 1000);
  }

  showPauseMenu() {
    this.pauseMenu.showPauseMenu();
  }

  hidePauseMenu() {
    this.pauseMenu.hidePauseMenu();
  }

  continueGame() {
    if (this.gameManager.isPaused) {
      this.gameManager.resumeGame();
      this.hidePauseMenu();
    }
  }

  showWinMenu() {
    this.winMenu.showWinMenu();
  }

  hideWinMenu() {
    this.winMenu.hideWinMenu();
  }

  showGameOverMenu() {
    this.gameOverMenu.showGameOverMenu();
  }

  hideGameOverMenu() {
    this.gameOverMenu.hideGameOverMenu();
  }

  // Suppression de la méthode restartGame
}

export default UIManager; 
