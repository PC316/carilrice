// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyC_MoprpogqkUuX1rVWUnbqTpWF1YfMiS0",
    authDomain: "michelinkitchen-c18c8.firebaseapp.com",
    databaseURL: "https://michelinkitchen-c18c8-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "michelinkitchen-c18c8",
    storageBucket: "michelinkitchen-c18c8.appspot.com",
    messagingSenderId: "1043197492207",
    appId: "1:1043197492207:web:95be34e4b5bfde279b541a",
    measurementId: "G-C041NLSNXB"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const gameContainer = document.getElementById('game-container');
const startMenu = document.getElementById('start-menu');
const startGameButton = document.getElementById('start-game-button');
const gameCharacter = document.getElementById('game-character');
const scoreDisplay = document.getElementById('score');
const livesDisplay = document.getElementById('lives');
const backgroundMusic = document.getElementById('background-music');
const coinSound = document.getElementById('coin-sound');
const scamSound = document.getElementById('scam-sound');
const trendingSound = document.getElementById('trending-sound');
const spamSound = document.getElementById('spam-sound');
const gameOverSound = document.getElementById('game-over-sound');
const gameOverMenu = document.getElementById('game-over-menu');
const finalScoreDisplay = document.getElementById('final-score');
const restartButton = document.getElementById('restart-button');
const websiteButton = document.getElementById('website-button');
const websiteButtonStart = document.getElementById('website-button-start');
const gradientBg = document.querySelector('.gradient-bg');

let score = 0;
let lives = 3;
let isDragging = false;
let dragStartX = 0;
let shieldActive = false;
let gameOverFlag = false;
let difficultyLevel = 1;
let fallingInterval = 1000;

function updateScore(amount) {
    score += amount;
    scoreDisplay.textContent = `Score: ${score}`;
}

function updateLives(amount) {
    lives += amount;
    livesDisplay.textContent = `Lives: ${lives}`;
    if (lives <= 0) {
        gameOver();
    }
}

function gameOver() {
    if (!gameOverFlag) {
        gameOverFlag = true;
        backgroundMusic.pause();
        playSound(gameOverSound);
        finalScoreDisplay.textContent = `Your Score: ${score}`;
        gameOverMenu.style.display = 'flex';
    }
}

function playSound(sound) {
    const clone = sound.cloneNode();
    clone.play();
}

function createFallingObject(type) {
    if (gameOverFlag) return; // Stop creating objects when game is over

    const fallingObject = document.createElement('div');
    fallingObject.className = `falling-object ${type}`;
    fallingObject.style.left = `${Math.random() * (window.innerWidth - 50)}px`; // Ensure objects fall within the screen width
    fallingObject.style.top = '-50px'; // Start above the screen
    gameContainer.appendChild(fallingObject);

    let fallingSpeed = (2 + Math.random() * 3) * difficultyLevel;

    function fall() {
        if (parseFloat(fallingObject.style.top) >= window.innerHeight - 50) {
            gameContainer.removeChild(fallingObject);
        } else {
            fallingObject.style.top = `${parseFloat(fallingObject.style.top) + fallingSpeed}px`;
            if (checkCollision(fallingObject, gameCharacter) && !gameOverFlag) {
                if (type === 'scam') {
                    playSound(scamSound);
                    if (shieldActive) {
                        shieldActive = false;
                        gradientBg.style.display = 'none';
                        backgroundMusic.pause();
                    } else {
                        updateLives(-1);
                    }
                } else if (type === 'coin') {
                    playSound(coinSound);
                    updateScore(1);
                } else if (type === 'trending') {
                    playSound(trendingSound);
                    playSound(spamSound);
                    shieldActive = true;
                    gradientBg.style.display = 'block';
                    backgroundMusic.play();
                    updateScore(5); // Bonus points for catching the trending
                    updateLives(1); // Grant a free life
                }
                gameContainer.removeChild(fallingObject);
            } else {
                requestAnimationFrame(fall);
            }
        }
    }

    requestAnimationFrame(fall);
}

function checkCollision(obj1, obj2) {
    const rect1 = obj1.getBoundingClientRect();
    const rect2 = obj2.getBoundingClientRect();
    return !(rect1.right < rect2.left || rect1.left > rect2.right || rect1.bottom < rect2.top || rect1.top > rect2.bottom);
}

function startFallingObjects() {
    const intervalId = setInterval(() => {
        if (gameOverFlag) {
            clearInterval(intervalId); // Stop the interval when game is over
            return;
        }
        const objectType = Math.random() > (0.97 - (0.02 * (difficultyLevel - 1))) ? 'trending' : (Math.random() > 0.5 ? 'scam' : 'coin');
        createFallingObject(objectType);
    }, fallingInterval); // Use dynamic interval based on difficulty level
}

function increaseDifficulty() {
    difficultyLevel++;
    fallingInterval = 1000 / difficultyLevel; // Decrease interval to increase number of falling objects
    startFallingObjects(); // Restart falling objects with new difficulty
}

function startDifficultyTimer() {
    setInterval(increaseDifficulty, 60000); // Increase difficulty every 1 minute
}

document.addEventListener('touchstart', (e) => {
    if (!gameOverFlag) {
        isDragging = true;
        dragStartX = e.touches[0].clientX - gameCharacter.getBoundingClientRect().left;
    }
});

document.addEventListener('touchmove', (e) => {
    if (isDragging) {
        const touch = e.touches[0];
        let newLeft = touch.clientX - dragStartX;
        newLeft = Math.max(0, Math.min(newLeft, window.innerWidth - gameCharacter.offsetWidth)); // Ensure character stays within the screen
        gameCharacter.style.left = `${newLeft}px`;
    }
});

document.addEventListener('touchend', () => {
    isDragging = false;
});

document.addEventListener('mousedown', (e) => {
    if (!gameOverFlag) {
        isDragging = true;
        dragStartX = e.clientX - gameCharacter.getBoundingClientRect().left;
    }
});

document.addEventListener('mousemove', (e) => {
    if (isDragging) {
        let newLeft = e.clientX - dragStartX;
        newLeft = Math.max(0, Math.min(newLeft, window.innerWidth - gameCharacter.offsetWidth)); // Ensure character stays within the screen
        gameCharacter.style.left = `${newLeft}px`;
    }
});

document.addEventListener('mouseup', () => {
    isDragging = false;
});

restartButton.addEventListener('click', () => {
    score = 0;
    lives = 3;
    gameOverFlag = false;
    difficultyLevel = 1;
    fallingInterval = 1000;
    gameOverMenu.style.display = 'none';
    gameCharacter.style.display = 'block';
    scoreDisplay.style.display = 'block';
    livesDisplay.style.display = 'block';
    gradientBg.style.display = 'none';
    updateLives(0);  // Reset lives display
    updateScore(0);  // Reset score display
    startFallingObjects();
    startDifficultyTimer();
});

websiteButton.addEventListener('click', () => {
    window.location.href = 'index.html';
});

websiteButtonStart.addEventListener('click', () => {
    window.location.href = 'index.html';
});

startGameButton.addEventListener('click', () => {
    startMenu.style.display = 'none';
    gameCharacter.style.display = 'block';
    scoreDisplay.style.display = 'block';
    livesDisplay.style.display = 'block';
    startFallingObjects();
    startDifficultyTimer();
    updateLives(0);  // Initialize lives display
    updateScore(0);  // Initialize score display
});

function generateId() {
    const id = '_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('playerId', id);
    return id;
}
