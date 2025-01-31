// DOM Elements
const playerHealthBar = document.getElementById("player-health");
const monsterHealthBar = document.getElementById("monster-health");
const logMessagesList = document.getElementById("log-messages");
const gameOverSection = document.getElementById("game-over");
const winnerMessage = document.getElementById("winner-message");
const restartButton = document.getElementById("restart-button");
const attackButton = document.getElementById("attack-button");
const specialAttackButton = document.getElementById("special-attack-button");
const healButton = document.getElementById("heal-button");
const surrenderButton = document.getElementById("surrender-button");
const controls = document.getElementById('controls');

let playerHealth = 100;
let monsterHealth = 100;
let currentRound = 0;
let logMessages = [];
let spAtt = 0;

// Utility functions
/**
 * Met à jour les barres de santé du joueur et du monstre.
 * Ajuste la largeur des barres de santé en fonction des points de vie restants,
 * en s'assurant qu'elles ne descendent pas en dessous de 0%.
 *
 * @function
 * @global
 * @returns {void} Ne retourne aucune valeur.
 */
function updateHealthBars() {
    monsterHealthBar.style.width = monsterHealth + "%" ;
    playerHealthBar.style.width = playerHealth + "%" ;
}

/**
 * Ajoute un message de log à l'historique de la bataille.
 * Le message indique qui a effectué une action (joueur ou monstre), le type d'action
 * (attaque ou soin), et la valeur associée. Le message est formaté et inséré en haut de la liste des logs.
 *
 * @function
 * @param {string} who - Indique l'entité ayant effectué l'action. Les valeurs possibles sont `'player'` ou `'monster'`.
 * @param {string} action - Le type d'action effectuée. Les valeurs possibles sont `'heal'` (pour un soin) ou autre (pour une attaque).
 * @param {number} value - La valeur associée à l'action (dégâts ou points de soin).
 * @returns {void} Ne retourne aucune valeur.
 */
function addLogMessage(who, action, value) {
    logMessages += `${who} ${action} pour ${value} HP`;
    let log = document.createElement('li');
    log.textContent = `${who} ${action} pour ${value} HP`;
    logMessagesList.prepend(log);
}

/**
 * Vérifie l'état de santé du joueur et du monstre pour déterminer le gagnant de la partie.
 *
 * La fonction évalue la vie restante du joueur et du monstre pour déterminer qui a gagné, perdu ou si c'est un match nul.
 * - Si les points de vie du joueur et du monstre sont tous deux inférieurs ou égaux à 0, la fonction déclare un "match nul".
 * - Si les points de vie du joueur sont inférieurs ou égaux à 0, la fonction déclare que le joueur a perdu.
 * - Si les points de vie du monstre sont inférieurs ou égaux à 0, la fonction déclare que le joueur a gagné.
 *
 * La fonction met également à jour l'affichage du message de fin de jeu et la section de fin de jeu en fonction du résultat.
 *
 * @function
 * @returns {void} Ne retourne aucune valeur. Modifie l'interface utilisateur en fonction du résultat du jeu.
 */
function checkWinner() {
    if(playerHealth < 0 && monsterHealth > 0){
        controls.style.display = 'none';
        gameOverSection.style.display = 'block';
        winnerMessage.innerText = "L'ennemi a gagné";
    }
    else if(playerHealth > 0 && monsterHealth < 0){
        controls.style.display = 'none';
        gameOverSection.style.display = 'block';
        winnerMessage.innerText = "Le joueur a gagné";
    }
    else if(playerHealth < 0 && monsterHealth < 0){
        controls.style.display = 'none';
        gameOverSection.style.display = 'block';
        winnerMessage.innerText = "Y'a match nul";
    }
}

/**
 * Réinitialise les données et l'interface du jeu pour commencer une nouvelle partie.
 * - Restaure les points de vie des deux combattants à leur valeur initiale.
 * - Réinitialise le nombre de rounds et vide les messages de log.
 * - Met à jour les barres de santé et masque la section de fin de jeu.
 * - Désactive le bouton d'attaque spéciale.
 *
 * @function
 * @returns {void} Ne retourne aucune valeur.
 */
function resetGame() {
    //Restaure les points de vie des deux combattants à leur valeur initiale.
    playerHealth = 100;
    monsterHealth = 100;

    //Réinitialise le nombre de rounds et vide les messages de log.
    currentRound = 0;
    logMessages.innerHTML = '';
    
    controls.style.display = 'flex';
    gameOverSection.style.display = 'none';

    //Met à jour les barres de santé et masque la section de fin de jeu.
    updateHealthBars();

    //Désactive le bouton d'attaque spéciale
    specialAttackButton.style.disable = true;
}

// Actions
/**
 * Gère l'attaque du joueur contre le monstre.
 * - Incrémente le nombre de rounds.
 * - Calcule une valeur aléatoire pour l'attaque et réduit la santé du monstre.
 * - Ajoute un message de log pour l'action du joueur.
 * - Déclenche une contre-attaque par le monstre.
 * - Vérifie si un gagnant peut être déterminé.
 * - Met à jour l'état du bouton d'attaque spéciale.
 *
 * @function
 * @returns {void} Ne retourne aucune valeur.
 */
function attackMonster() {
    let degat = Math.ceil(Math.random() * 9);
    monsterHealth -= degat;
    addLogMessage('Monstre', 'attaque', degat);
    monsterHealthBar.style.width = `${monsterHealth}%`;
    console.log(monsterHealth);
    attackPlayer();
    checkWinner();
}

/**
 * Gère l'attaque du monstre contre le joueur.
 * - Calcule une valeur aléatoire pour l'attaque et réduit la santé du joueur.
 * - Ajoute un message de log pour l'action du monstre.
 * - Vérifie si un gagnant peut être déterminé.
 * - Met à jour les barres de santé à l'écran.
 *
 * @function
 * @returns {void} Ne retourne aucune valeur.
 */
function attackPlayer() {
    let degat = Math.round(Math.random() * 5) + 10;
    playerHealth -= degat;
    addLogMessage('Joueur', 'attaque', degat);
    playerHealthBar.style.width = `${playerHealth}%`;
    console.log(playerHealth);
    updateSpecialAttackButton();
    checkWinner();
}

/**
 * Gère l'attaque spéciale du joueur contre le monstre.
 * - Augmente le compteur de rounds.
 * - Calcule une valeur d'attaque spéciale aléatoire et réduit la santé du monstre.
 * - Ajoute un message de log pour l'attaque spéciale du joueur.
 * - Déclenche une contre-attaque du monstre.
 * - Vérifie si un gagnant peut être déterminé.
 * - Met à jour l'état du bouton d'attaque spéciale.
 *
 * @function
 * @returns {void} Ne retourne aucune valeur.
 */
function specialAttackMonster() {
    currentRound ++;
    let log = document.createElement('li');
    log.textContent = "Le joueur utilise son attaque spéciaaaaale";
    logMessagesList.prepend(log);
    let damage = Math.floor(Math.random()*15) + 10;
    monsterHealth -= damage;
    attackMonster();
    checkWinner();
    spAtt = -3;
    updateSpecialAttackButton();
}

/**
 * Permet au joueur de se soigner.
 * - Augmente le compteur de rounds.
 * - Calcule une valeur de soin aléatoire et augmente la santé du joueur, sans dépasser 100.
 * - Ajoute un message de log pour l'action de soin.
 * - Déclenche une attaque du monstre en réponse.
 * - Vérifie si un gagnant peut être déterminé.
 * - Met à jour les barres de santé affichées.
 *
 * @function
 * @returns {void} Ne retourne aucune valeur.
 */
function healPlayer() {
    
    updateSpecialAttackButton();
}

/**
 * Permet au joueur d'abandonner la partie.
 * - Déclare le monstre comme gagnant en affichant un message de défaite.
 * - Affiche la section de fin de jeu.
 *
 * @function
 * @returns {void} Ne retourne aucune valeur.
 */
function surrenderGame() {

}

// Special attack availability
/**
 * Met à jour l'état du bouton d'attaque spéciale en fonction du nombre de rounds.
 * - Le bouton d'attaque spéciale est activé tous les 3 tours.
 * - Si le tour courant n'est pas un multiple de 3, le bouton est désactivé.
 *
 * @function
 * @returns {void} Ne retourne aucune valeur.
 */
function updateSpecialAttackButton() {
if( spAtt >= 0 ){
    specialAttackButton.disabled = false;
}
else{
    specialAttackButton.disabled = true;
}
spAtt++;
}

// Event Listeners
attackButton.addEventListener("click", attackMonster);
specialAttackButton.addEventListener("click", specialAttackMonster);
healButton.addEventListener("click", healPlayer);
surrenderButton.addEventListener("click", surrenderGame);
restartButton.addEventListener("click", resetGame);

// Initialize Game
resetGame();
