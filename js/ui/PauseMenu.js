class PauseMenu {
    constructor(uiManager) {
        this.uiManager = uiManager;  // Stocke une référence à l'UIManager pour gérer les interactions avec le jeu
        this.pauseMenu = document.getElementById('pauseMenu');  // Obtient une référence à l'élément du menu de pause dans le DOM

        // Écouteur d'événement pour le bouton "Continuer"
        document.getElementById('continueButton').addEventListener('click', () => {
            this.hidePauseMenu();  // Appelle la méthode pour cacher le menu de pause
            this.uiManager.continueGame();  // Appelle la méthode de l'UIManager pour continuer le jeu
        });

        // Écouteur d'événement pour le bouton "Redémarrer"
        document.getElementById('restartButton').addEventListener('click', () => {
            this.hidePauseMenu();  // Appelle la méthode pour cacher le menu de pause
            setTimeout(() => {
                window.location.reload();  // Recharge la page après un court délai pour redémarrer le jeu
            }, 100);  // Délai de 100 millisecondes avant de recharger la page
        });
    }

    // Méthode pour afficher le menu de pause
    showPauseMenu() {
        this.pauseMenu.style.display = 'flex';  // Affiche le menu de pause en changeant son style pour 'flex'
    }

    // Méthode pour cacher le menu de pause
    hidePauseMenu() {
        this.pauseMenu.style.display = 'none';  // Cache le menu de pause en changeant son style pour 'none'
    }
}

export default PauseMenu;  // Exporte la classe PauseMenu pour pouvoir l'importer et l'utiliser dans d'autres fichiers JavaScript
