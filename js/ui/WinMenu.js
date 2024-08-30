class WinMenu {
  constructor(uiManager) {
    this.uiManager = uiManager; // Référence à l'UIManager pour interagir avec le jeu
    this.winMenu = document.getElementById("winMenu"); // Élément DOM du menu de victoire

    // Suppression de l'écouteur d'événement pour le bouton "Restart"
    // Écouteur d'événement sur le bouton "New Game" du menu de victoire
    document.getElementById("winNewGameButton").addEventListener("click", () => {
      this.hideWinMenu(); // Cache le menu de victoire
      window.location.reload(); // Recharge la page pour démarrer une nouvelle partie
    });
  }

  // Affiche le menu de victoire
  showWinMenu() {
    this.uiManager.timer.pause(); // Met en pause le timer du jeu via l'UIManager
    this.winMenu.style.display = "flex"; // Affiche le menu de victoire en mode "flex"
  }

  // Cache le menu de victoire
  hideWinMenu() {
    this.uiManager.timer.resume(); // Reprend le timer du jeu via l'UIManager
    this.winMenu.style.display = "none"; // Cache le menu de victoire en le rendant invisible
  }
}

export default WinMenu; // Exporte la classe WinMenu pour pouvoir l'utiliser ailleurs dans l'application
