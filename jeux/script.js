const cards = document.querySelectorAll('.memory-card');
let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
let score = 0;
let timeLeft = 60;
const scoreDisplay = document.getElementById('score');
const timerDisplay = document.getElementById('timer');
const gameOverMessage = document.getElementById('game-over-message');
const endMessage = document.getElementById('end-message');
const restartButton = document.getElementById('restart-button');

// Sons
const flipSound = document.getElementById('flip-sound');
const matchSound = document.getElementById('match-sound');
const noMatchSound = document.getElementById('no-match-sound');

// Fonction pour retourner une carte
function flipCard() {
    if (lockBoard || this === firstCard) return;

    flipSound.play();
    this.classList.add('flip');

    if (!hasFlippedCard) {
        hasFlippedCard = true;
        firstCard = this;
    } else {
        secondCard = this;
        checkForMatch();
    }
}

// Vérifie si les cartes correspondent
function checkForMatch() {
    let isMatch = firstCard.dataset.framework === secondCard.dataset.framework;
    isMatch ? matchCards() : unflipCards();
}

// Désactive les cartes correspondantes
function matchCards() {
    matchSound.play();
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);
    score++;
    scoreDisplay.textContent = `Score: ${score}`;
    resetBoard();

    if (score === cards.length / 2) {
        endGame(true);
    }
}

// Retourne les cartes non correspondantes
function unflipCards() {
    lockBoard = true;
    noMatchSound.play();

    setTimeout(() => {
        firstCard.classList.remove('flip');
        secondCard.classList.remove('flip');
        resetBoard();
    }, 1500);
}

// Réinitialise le tableau
function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}

// Mélange les cartes au début du jeu
(function shuffle() {
    cards.forEach(card => {
        let randomPos = Math.floor(Math.random() * cards.length);
        card.style.order = randomPos;
    });
})();

// Minuteur
function startTimer() {
    const timerInterval = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = `Temps restant: ${timeLeft}`;

        if (timeLeft === 0 || score === cards.length / 2) {
            clearInterval(timerInterval);
            endGame(score === cards.length / 2);
        }
    }, 1000);
}

// Terminer le jeu
function endGame(won) {
    const gameMessage = won ? "Félicitations! Vous avez gagné!" : "Temps écoulé! Essayez encore.";
    endMessage.textContent = gameMessage;
    gameOverMessage.classList.remove('hidden');
    document.querySelector('.memory-game').classList.add('hidden');
}

// Réinitialise le jeu
function resetGame() {
    window.location.reload(); // Recharge la page pour un redémarrage simple
}

// Démarrer le minuteur au chargement de la page
window.onload = startTimer;

// Ajoute un écouteur d'événements de clic à chaque carte
cards.forEach(card => card.addEventListener('click', flipCard));

// Ajoute un écouteur d'événements pour redémarrer le jeu
restartButton.addEventListener('click', resetGame);
