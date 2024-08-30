class Timer {
    constructor() {
        this.time = 0; // Temps écoulé, initialisé à 0
        this.interval = null; // Identifiant de l'intervalle pour la gestion du temps
        this.paused = false; // Indicateur de pause, initialisé à false (non-paused)
    }

    // Démarre le timer
    start() {
        this.interval = setInterval(() => {
            if (!this.paused) { // Vérifie si le timer n'est pas en pause
                this.time++; // Incrémente le temps écoulé
                console.log(`Temps écoulé: ${this.time}s`); // Affiche le temps écoulé (optionnel)
            }
        }, 1000); // Interval d'une seconde (1000 millisecondes)
    }

    // Arrête le timer
    stop() {
        clearInterval(this.interval); // Arrête l'intervalle de mise à jour du temps
    }

    // Réinitialise le timer
    reset() {
        this.stop(); // Arrête le timer s'il est en cours
        this.time = 0; // Réinitialise le temps écoulé à 0
    }

    // Récupère le temps écoulé actuel
    getTime() {
        return this.time;
    }

    // Met en pause le timer
    pause() {
        this.paused = true; // Met l'indicateur de pause à true
    }

    // Reprend le timer
    resume() {
        this.paused = false; // Met l'indicateur de pause à false pour reprendre le timer
    }
}

export default Timer; // Exporte la classe Timer pour pouvoir l'utiliser ailleurs dans l'application
