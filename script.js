let currentScores = {};
let currentPlayer = 1;
let totalPlayers = 0;
let currentRound = 1;
let totalRounds = 0;
let hasRolledThisRound = false;

function setupPlayers() {
    totalPlayers = parseInt(document.getElementById('playerCount').value);
    totalRounds = parseInt(document.getElementById('roundCount').value);
    if (isNaN(totalPlayers) || totalPlayers < 2 || totalPlayers > 10 || isNaN(totalRounds) || totalRounds < 5 || totalRounds > 15) {
        alert("Please enter valid numbers for players (2-10) and rounds (5-15).");
        return;
    }
    for (let i = 1; i <= totalPlayers; i++) {
        currentScores[i] = 0;
    }
    document.getElementById('playerSetup').style.display = 'none';
    document.getElementById('gameContainer').style.display = 'flex';
    const scoreBoard = document.getElementById('scoreBoard');
    scoreBoard.innerHTML = '';
    for (let i = 1; i <= totalPlayers; i++) {
        const playerIcon = document.createElement('div');
        playerIcon.classList.add('player-icon');
        playerIcon.innerHTML = `<div class="player-score" id="scorePlayer${i}">0</div><i class="fa-solid fa-person fa-2x"></i>`;
        scoreBoard.appendChild(playerIcon);
    }
    displayScores();
    highlightCurrentPlayer();
    currentPlayer = 1;
    hasRolledThisRound = false;
}

function rollDice() {
    if (hasRolledThisRound) {
        alert("You have already rolled this round. Please pass to the next player.");
        return;
    }

    const diceValues = ['D', 'W'];
    let score = 0;
    for (let i = 1; i <= 3; i++) {
        const value = diceValues[Math.floor(Math.random() * diceValues.length)];
        document.getElementById(`dice${i}`).innerText = value;
        score += i === 1 ? (value === 'D' ? 2 : -2) : (value === 'D' ? 1 : -1);
    }
    applyAnimationAndScore(score);
    hasRolledThisRound = true;
}

function applyAnimationAndScore(score) {
    for (let i = 1; i <= 3; i++) {
        const diceElem = document.getElementById(`dice${i}`);
        diceElem.classList.add('roll-animation');
        diceElem.addEventListener('animationend', () => {
            diceElem.classList.remove('roll-animation');
        });
    }
    updateScore(score);
}

function updateScore(score) {
    currentScores[currentPlayer] = (currentScores[currentPlayer] || 0) + score;
    displayScores();
}

function displayScores() {
    for (let player in currentScores) {
        document.getElementById(`scorePlayer${player}`).innerHTML = currentScores[player];
    }
}

function nextPlayer() {
    if (!hasRolledThisRound) {
        alert("Please roll the dice before passing to the next player.");
        return;
    }

    currentPlayer = currentPlayer < totalPlayers ? currentPlayer + 1 : 1;
    hasRolledThisRound = false;

    if (currentPlayer === 1) {
        updateRound();
    }
    highlightCurrentPlayer();
}

function highlightCurrentPlayer() {
    const playerIcons = document.querySelectorAll('.player-icon');
    playerIcons.forEach(icon => {
        icon.classList.remove('active');
    });
    document.querySelector(`#scoreBoard .player-icon:nth-child(${currentPlayer})`).classList.add('active');
}

function updateRound() {
    if (currentRound < totalRounds) {
        currentRound++;
        document.getElementById('roundCounter').textContent = `Round ${currentRound}`;
    } else {
        announceWinner();
    }
}

function announceWinner() {
    const winner = Object.keys(currentScores).reduce((a, b) => currentScores[a] > currentScores[b] ? a : b);
    document.getElementById('roundCounter').textContent = `Winner: Player ${winner}`;
    document.getElementById('rollButton').disabled = true;
    document.getElementById('nextPlayerButton').disabled = true;
}

document.getElementById('rollButton').addEventListener('click', rollDice);
document.getElementById('nextPlayerButton').addEventListener('click', nextPlayer);
