document.getElementById('start-trending-button').addEventListener('click', function() {
    startTrending();
});

function startTrending() {
    var backgroundMusic = document.getElementById('background-music');
    var colorfulBackground = document.getElementById('colorful-background');
    var startTrendingButton = document.getElementById('start-trending-button');
    var stopTrendingButton = document.getElementById('stop-trending-button');
    
    // Transition effect
    colorfulBackground.style.clipPath = 'circle(100% at 50% 50%)';

    // Show the home page after the transition completes
    setTimeout(() => {
        document.getElementById('welcome-page').style.display = 'none';
        var homePage = document.createElement('div');
        homePage.id = 'home-page';
        homePage.innerHTML = `
            <a id="telegram-button" class="button" href="https://t.me/your_telegram_channel" target="_blank">TELEGRAM</a>
            <button id="stop-trending-button" class="button" onclick="toggleTrending()">STOP TRENDING</button>
            <div class="character-container">
                <img src="character.png" alt="WEN TRENDING SER" class="character wiggle" id="home-character">
            </div>
            <div class="chat-container" id="chat-container"></div>
        `;
        document.body.appendChild(homePage);
        document.getElementById('home-page').style.display = 'flex';

        // Show contract address
        document.getElementById('contract-container').style.display = 'block';

        // Add chat bubbles dynamically
        var chatContainer = document.getElementById('chat-container');
        var messages = new Array(24).fill("WEN TRENDING SER?");
        
        messages.forEach(function(message, index) {
            setTimeout(function() {
                var chatBubble = document.createElement('div');
                chatBubble.className = 'chat-bubble';
                message.split('').forEach(char => {
                    var span = document.createElement('span');
                    span.textContent = char;
                    chatBubble.appendChild(span);
                });
                chatContainer.appendChild(chatBubble);
            }, index * 1500); // delay between messages
        });

        // Start Matrix effect
        document.getElementById('matrix').style.display = 'block';
        createMatrixEffect();

        // Remove start trending button and show stop trending button
        startTrendingButton.style.display = 'none';
        stopTrendingButton.style.display = 'block';

        // Start wiggle animation and background music
        var homeCharacter = document.getElementById('home-character');
        homeCharacter.classList.add('wiggle');
        backgroundMusic.play();

        // Make the character a link to game.html
        homeCharacter.addEventListener('click', function() {
            window.location.href = 'game.html';
        });
    }, 2000); // Ensure transition timing
}

function typeMessage(element, message) {
    let index = 0;
    function type() {
        if (index < message.length) {
            element.textContent += message.charAt(index);
            index++;
            setTimeout(type, 50); // delay between letters
        }
    }
    type();
}

// Copy contract address to clipboard
document.getElementById('contract-address').addEventListener('click', function() {
    var tempInput = document.createElement('input');
    tempInput.value = this.textContent;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
    alert('Contract address copied to clipboard');
});

function createMatrixEffect() {
    const matrixContainer = document.getElementById('matrix');
    const characters = '01';
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    setInterval(() => {
        const matrixChar = document.createElement('div');
        matrixChar.className = 'matrix-char';
        matrixChar.style.left = Math.random() * screenWidth + 'px';
        matrixChar.style.top = Math.random() * -screenHeight + 'px'; // Start from top beyond view
        matrixChar.textContent = characters.charAt(Math.floor(Math.random() * characters.length));
        matrixContainer.appendChild(matrixChar);

        // Remove characters that have fallen beyond view to prevent memory leaks
        setTimeout(() => {
            matrixChar.remove();
        }, 5000); // Match the duration of the animation
    }, 100); // Adjust interval to control density of the falling characters
}

// Adjust Matrix effect on window resize
window.addEventListener('resize', () => {
    const matrixContainer = document.getElementById('matrix');
    while (matrixContainer.firstChild) {
        matrixContainer.removeChild(matrixContainer.firstChild);
    }
    createMatrixEffect();
});

// Mouse move event to make characters avoid the cursor
document.addEventListener('mousemove', function(e) {
    const chatBubbles = document.querySelectorAll('.chat-bubble span');
    chatBubbles.forEach(char => {
        const rect = char.getBoundingClientRect();
        const dx = e.clientX - (rect.left + rect.width / 2);
        const dy = e.clientY - (rect.top + rect.height / 2);
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxDistance = 100;

        if (distance < maxDistance) {
            const angle = Math.atan2(dy, dx);
            const moveX = Math.cos(angle) * maxDistance;
            const moveY = Math.sin(angle) * maxDistance;
            char.style.transform = `translate(${moveX}px, ${moveY}px)`;
        } else {
            char.style.transform = '';
        }
    });
});

// Toggle Trending functionality
function toggleTrending() {
    var audio = document.getElementById('audio');
    var backgroundMusic = document.getElementById('background-music');
    var colorfulBackground = document.getElementById('colorful-background');
    var homePage = document.getElementById('home-page');
    var matrixContainer = document.getElementById('matrix');
    var homeCharacter = document.getElementById('home-character');
    var startTrendingButton = document.getElementById('start-trending-button');
    var stopTrendingButton = document.getElementById('stop-trending-button');

    if (stopTrendingButton.style.display === 'block') {
        // Stop the background music and audio
        backgroundMusic.pause();
        backgroundMusic.currentTime = 0;
        audio.play(); // Play the audio when STOP TRENDING is pressed

        // Stop the wiggle animation
        homeCharacter.classList.remove('wiggle');

        // Hide stop trending button and show start trending button
        stopTrendingButton.style.display = 'none';
        startTrendingButton.style.display = 'block';

        // Reset background and hide home page
        colorfulBackground.style.clipPath = 'circle(0% at 50% 50%)';
        homePage.style.display = 'none';
        matrixContainer.style.display = 'none';
        document.getElementById('welcome-page').style.display = 'flex';
    } else {
        // Start the wiggle animation
        homeCharacter.classList.add('wiggle');

        // Start the background music
        backgroundMusic.play();

        // Hide start trending button and show stop trending button
        startTrendingButton.style.display = 'none';
        stopTrendingButton.style.display = 'block';

        // Show home page again
        colorfulBackground.style.clipPath = 'circle(100% at 50% 50%)';
        homePage.style.display = 'flex';
        matrixContainer.style.display = 'block';
    }
}
