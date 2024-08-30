class HUD {
    constructor() {
        this.hud = this.createHUD();  // Appel de la méthode createHUD() lors de l'instanciation de la classe pour créer l'interface utilisateur
    }

    // Méthode pour créer l'interface utilisateur du HUD
    createHUD() {
        const hud = document.createElement('div');  // Création d'un élément <div> pour le HUD
        hud.id = 'hud';  // Attribution de l'identifiant 'hud' à l'élément <div>
        document.body.appendChild(hud);  // Ajout du HUD à la fin du corps du document HTML
        return hud;  // Retourne l'élément <div> HUD nouvellement créé
    }

    // Méthode pour mettre à jour le contenu du HUD avec les vies, le score et le temps passés en paramètres
    updateHUD(lives, score, time) {
        this.hud.innerHTML = `Timer: ${time}s | Score: ${score} | Lives: ${lives} `;  // Mise à jour du contenu HTML du HUD avec les informations fournies
    }
}

export default HUD;  // Export de la classe HUD pour pouvoir l'importer et l'utiliser dans d'autres fichiers JavaScript
