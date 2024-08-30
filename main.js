import GameManager from "./js/game/GameManager.js";
import UIManager from "./js/ui/UIManager.js";
import Timer from "./js/utils/Timer.js";

document.addEventListener("DOMContentLoaded", (event) => {
  // Création d'une instance de GameManager avec une taille de grille de 9
  const gameManager = new GameManager(9);

  // Création d'une instance de UIManager liée au GameManager
  const uiManager = new UIManager(gameManager);

  // Attribution de l'UIManager créé au GameManager
  gameManager.uiManager = uiManager;

  // Gestionnaire d'événement pour le bouton "Continue"
  document.getElementById("continueButton").addEventListener("click", () => {
    // Vérifie si le jeu n'est pas en pause, puis démarre le jeu
    if (!gameManager.isPaused) {
      gameManager.startGame();
    }
  });

  // Gestionnaire d'événement pour le bouton "Restart"
  document.getElementById("restartButton").addEventListener("click", () => {
    gameManager.restartGame(); // Redémarre le jeu
  });

  // Gestionnaire d'événements pour les touches du clavier
  document.addEventListener("keydown", (event) => {
    switch (event.key) {
      case "ArrowUp":
        // Déplacement vers le haut si le jeu n'est pas en pause
        if (!gameManager.isPaused)
          gameManager.player.move("up", gameManager.grid);
        break;
      case "ArrowDown":
        // Déplacement vers le bas si le jeu n'est pas en pause
        if (!gameManager.isPaused)
          gameManager.player.move("down", gameManager.grid);
        break;
      case "ArrowLeft":
        // Déplacement vers la gauche si le jeu n'est pas en pause
        if (!gameManager.isPaused)
          gameManager.player.move("left", gameManager.grid);
        break;
      case "ArrowRight":
        // Déplacement vers la droite si le jeu n'est pas en pause
        if (!gameManager.isPaused)
          gameManager.player.move("right", gameManager.grid);
        break;
      case " ":
        // Placement d'une bombe avec la barre d'espace si le jeu n'est pas en pause
        if (!gameManager.isPaused) gameManager.player.placeBomb();
        break;
      case "p":
        // Gestion de la pause avec la touche 'p'
        if (gameManager.isPaused) {
          gameManager.resumeGame(); // Reprendre le jeu
          uiManager.hidePauseMenu(); // Cacher le menu de pause via l'UIManager
        } else {
          gameManager.pauseGame(); // Mettre le jeu en pause
          uiManager.showPauseMenu(); // Afficher le menu de pause via l'UIManager
        }
        break;
      case "r":
        gameManager.restartGame(); // Redémarre le jeu avec la touche 'r'
        uiManager.hidePauseMenu(); // Cacher le menu de pause via l'UIManager
        break;
    }
  });
});
