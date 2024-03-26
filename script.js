let currentScores = {};
let currentPlayer = 'A'; 
let totalPlayers = 0;
let currentRound = 1;
let totalRounds = 0;
let hasRolledThisRound = false;

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('rollButton').addEventListener('click', rollDice);
    document.getElementById('nextPlayerButton').addEventListener('click', nextPlayer);
    document.getElementById('quitButton').addEventListener('click', resetGame);
});


function setupPlayers() {
    totalPlayers = parseInt(document.getElementById('playerCount').value, 10);
    totalRounds = parseInt(document.getElementById('roundCount').value, 10);

    if (isNaN(totalPlayers) || totalPlayers < 2 || totalPlayers > 5 || isNaN(totalRounds) || totalRounds < 2 || totalRounds > 5) {
        alert("Please enter valid numbers for players (2-5) and rounds (2-5).");
        return;
    }

    currentScores = {};
    for (let i = 0; i < totalPlayers; i++) {
        currentScores[String.fromCharCode(65 + i)] = 0; 
    }

    currentPlayer = 'A';
    currentRound = 1;
    hasRolledThisRound = false;

    document.getElementById('playerSetup').style.display = 'none';
    document.getElementById('gameContainer').style.display = 'flex';
    document.getElementById('roundCounter').textContent = `Round ${currentRound}`;
    document.getElementById('rollButton').disabled = false;
    document.getElementById('nextPlayerButton').disabled = false;

    updateStatusMessage();
    initializeScoreBoard();
    highlightCurrentPlayer();
    displayScores();
}
  

function rollDice() {
    if (hasRolledThisRound) {
        alert("You have already rolled this round. Please pass to the next player.");
        return;
    }
    

    document.getElementById('statusMessage').textContent = `Player ${currentPlayer} is rolling`;

    
    document.getElementById('dice1').classList.add('dice1-animation');
    document.getElementById('dice2').classList.add('dice2-animation');
    document.getElementById('dice3').classList.add('dice3-animation');

    setTimeout(() => stopDiceAndDisplayValue(1, 'dice1-animation'), 500); 
    setTimeout(() => stopDiceAndDisplayValue(2, 'dice2-animation'), 1500); 
    setTimeout(() => stopDiceAndDisplayValue(3, 'dice3-animation'), 2500); 
}

function stopDiceAndDisplayValue(diceNumber, animationClass) {
    const diceValues = ['D', 'D', 'D', '-', '-', 'W'];
    const value = diceValues[Math.floor(Math.random() * diceValues.length)];
    const diceElem = document.getElementById(`dice${diceNumber}`);
    diceElem.classList.remove(animationClass); 
    diceElem.textContent = value; 

   
    if (diceNumber === 3) {
        hasRolledThisRound = true;
        calculateAndApplyScore(currentPlayer === totalPlayers && currentRound === totalRounds);
    }
}




function calculateAndApplyScore(isFinalRoll) {
    let dScore = 0;
    let wScore = 0;
    const goldDiceValue = document.getElementById('dice3').textContent;

    for (let i = 1; i <= 2; i++) {
        const value = document.getElementById(`dice${i}`).textContent;
        if (value === 'D') {
            dScore += 1;
        } else if (value === 'W') {
            wScore -= 1;
        }
    }

    if (goldDiceValue === 'D') {
        dScore *= 2;
    } else if (goldDiceValue === 'W') {
        wScore *= 2;
    }

    const totalScore = dScore + wScore;
    updateScore(totalScore);
    document.getElementById('statusMessage').textContent = `Player ${currentPlayer} has rolled. Score: ${totalScore}`;
    let isLastPlayer = (currentPlayer.charCodeAt(0) - 65) === totalPlayers - 1;
    if (isLastPlayer && currentRound === totalRounds) {
        setTimeout(() => {
            document.getElementById('rollButton').disabled = true;
            document.getElementById('nextPlayerButton').disabled = true;
            announceWinner(); 
            }, 1000);     }
}



 



function applyAnimationAndScore(score) {
   
    for (let i = 1; i <= 3; i++) {
        const diceElem = document.getElementById(`dice${i}`);
        diceElem.classList.add('roll-animation');
    }
    
    
    setTimeout(() => {
        for (let i = 1; i <= 3; i++) {
            const diceElem = document.getElementById(`dice${i}`);
            diceElem.classList.remove('roll-animation');
        }
        updateScore(score);
        document.getElementById('statusMessage').textContent = `Player ${currentPlayer} has rolled`;
    }, 1000); 
}

function updateScore(score) {
    currentScores[currentPlayer] += score;
    displayScores();
}

function nextPlayer() {
    if (!hasRolledThisRound) {
        alert(`Please roll the dice for Player ${currentPlayer} before passing.`);
        return;
    }
    hasRolledThisRound = false;

    let playerIndex = currentPlayer.charCodeAt(0) - 65; 
    if (playerIndex < totalPlayers - 1) {
        currentPlayer = String.fromCharCode(currentPlayer.charCodeAt(0) + 1);
    } else if (currentRound < totalRounds) {
        currentPlayer = 'A';
        currentRound++;
    } else {
        document.getElementById('rollButton').disabled = true;
        document.getElementById('nextPlayerButton').disabled = true;
        calculateAndApplyScore(true); 
        return;
    }

    document.getElementById('roundCounter').textContent = `Round ${currentRound}`;
    updateStatusMessage();
    highlightCurrentPlayer();
    displayScores();

    for (let i = 1; i <= 3; i++) {
        document.getElementById(`dice${i}`).textContent = '';
    }
}



/*
function resetGame() {
    document.getElementById('playerSetup').style.display = 'flex';
    document.getElementById('gameContainer').style.display = 'none';
    document.getElementById('finalScoresScreen').style.display = 'none'; 
    document.getElementById('playerCount').value = '';
    document.getElementById('roundCount').value = '';
    currentScores = {};
    currentPlayer = 1;
    currentRound = 1;
    totalRounds = 0;
    hasRolledThisRound = false;
    updateStatusMessage(); 

    for (let i = 1; i <= 3; i++) {
        document.getElementById(`dice${i}`).textContent = '';
    } 

    resetInactivityTimeout();
    displayScores();
}
*/
function resetGame() {
    window.location.reload();
}



function highlightCurrentPlayer() {
    const playerIcons = document.querySelectorAll('.player-icon');
    playerIcons.forEach((icon, index) => {
        if (index + 1 === currentPlayer) {
            icon.classList.add('active');
        } else {
            icon.classList.remove('active');
        }
    });
}

function updateStatusMessage() {
    document.getElementById('statusMessage').textContent = `Player ${currentPlayer}'s turn to roll`;
}

function initializeScoreBoard() {
    const scoreBoard = document.getElementById('scoreBoard');
    scoreBoard.innerHTML = ''; 
    for (let i = 1; i <= totalPlayers; i++) {
        const playerIcon = document.createElement('div');
        playerIcon.classList.add('player-icon');
        playerIcon.innerHTML = `<div class="player-score" id="scorePlayer${i}">0</div><i class="fa-solid fa-person fa-2x"></i>`;
        scoreBoard.appendChild(playerIcon);
    }
}

function displayScores() {
    
        const scoreBoard = document.getElementById('scoreBoard');
        scoreBoard.innerHTML = ''; 
        for (let i = 0; i < totalPlayers; i++) {
            const playerLetter = String.fromCharCode(65 + i);
            const playerScore = currentScores[playerLetter];
            const playerIcon = document.createElement('div');
            playerIcon.classList.add('player-icon');
            const playerLetterDisplay = `<div class="player-letter" ${playerLetter === currentPlayer ? 'style="text-decoration: underline;"' : ''}>${playerLetter}</div>`;
            playerIcon.innerHTML = `<div class="player-score" id="scorePlayer${playerLetter}">${playerScore}</div><i class="fa-solid fa-person fa-2x"></i>${playerLetterDisplay}`;
            scoreBoard.appendChild(playerIcon);
        }
    
}

function announceWinner() {
    let maxScore = -Infinity, winner = 'A';
    for (let player in currentScores) {
        if (currentScores[player] > maxScore) {
            maxScore = currentScores[player];
            winner = player;
        }
    }

    displayFinalScores(winner, maxScore); 
}


function displayFinalScores(winner, maxScore) {
    document.getElementById('gameContainer').style.display = 'none';
    const finalScoresScreen = document.getElementById('finalScoresScreen');
    finalScoresScreen.style.display = 'flex';
    const finalScores = Object.entries(currentScores).sort((a, b) => b[1] - a[1]);
    let scoresHTML = `<h2>Winner: Player ${winner} with ${maxScore} points!</h2><h3>Final Scores</h3>`;
    finalScores.forEach(([player, score]) => {
        scoresHTML += `<p>Player ${player}: ${score} points</p>`;
    });
    document.getElementById('finalScores').innerHTML = scoresHTML;
}
