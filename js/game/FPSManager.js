// Classe FPSManager pour gérer le calcul et l'affichage des FPS
class FPSManager {
  constructor() {
    // Initialisation des propriétés de la classe
    this.lastFrameTime = 0;  // Temps de la dernière frame en millisecondes
    this.frameCount = 0;     // Nombre de frames écoulées dans la dernière seconde
    this.fps = 0;            // Nombre de FPS calculé
    this.fpsElement = document.createElement("div");  // Création d'un élément div pour afficher les FPS
    this.fpsElement.id = "fps-display";  // Attribution d'un ID à l'élément div créé
    document.body.appendChild(this.fpsElement);  // Ajout de l'élément div au corps du document HTML
  }

  // Méthode pour calculer et mettre à jour les FPS
  calculateFPS(now) {
    const deltaTime = now - this.lastFrameTime;  // Calcul du temps écoulé depuis la dernière frame
    this.frameCount++;  // Incrémentation du nombre de frames

    // Si une seconde s'est écoulée depuis la dernière mise à jour des FPS
    if (deltaTime >= 1000) {
      this.fps = this.frameCount;  // Mise à jour du nombre de FPS avec le nombre de frames écoulées
      this.frameCount = 0;  // Réinitialisation du compteur de frames
      this.lastFrameTime = now;  // Mise à jour du temps de la dernière frame

      // Mise à jour du contenu textuel de l'élément div pour afficher les FPS calculés
      this.fpsElement.textContent = `FPS: ${this.fps}`;
    }
  }
}

export default FPSManager;  // Export de la classe FPSManager pour l'utiliser dans d'autres fichiers
