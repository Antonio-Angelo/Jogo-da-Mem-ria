document.addEventListener("DOMContentLoaded", () => {
    const startScreen = document.getElementById("startScreen");
    const gameContainer = document.getElementById("gameContainer");
    const winScreen = document.getElementById("winScreen");

    const startButton = document.getElementById("startGame");
    const restartButton = document.getElementById("restartGame");

    const gameBoard = document.getElementById("gameBoard");
    const message = document.getElementById("message");
    const scoreDisplay = document.getElementById("score");
    const finalScoreDisplay = document.getElementById("finalScore");
    const highScoresList = document.getElementById("highScores");

    let playerName = "";
    let gridSize = 4;
    let cards = [];
    let flippedCards = [];
    let matchedCards = 0;
    let score = 0;

    async function fetchImages(totalPairs) {
        const urls = [];
        while (urls.length < totalPairs) {
            const randomId = Math.floor(Math.random() * 1000);
            const imgUrl = `https://picsum.photos/id/${randomId}/100`;
            if (!urls.includes(imgUrl)) {
                urls.push(imgUrl);
            }
        }
        return urls;
    }

    function shuffle(array) {
        return array.sort(() => Math.random() - 0.5);
    }

    function createCard(imageUrl) {
        const card = document.createElement("div");
        card.classList.add("card");
        card.dataset.image = imageUrl;

        const img = document.createElement("img");
        img.src = imageUrl;
        card.appendChild(img);

        card.addEventListener("click", () => onCardClick(card));

        return card;
    }

    function onCardClick(card) {
        if (flippedCards.length < 2 && !card.classList.contains("flipped") && !card.classList.contains("matched")) {
            card.classList.add("flipped");
            flippedCards.push(card);

            if (flippedCards.length === 2) {
                checkMatch();
            }
        }
    }

    function checkMatch() {
        const [card1, card2] = flippedCards;

        if (card1.dataset.image === card2.dataset.image) {
            card1.classList.add("matched");
            card2.classList.add("matched");
            matchedCards += 2;
            score += 5;
        } else {
            score -= 3;
            setTimeout(() => {
                card1.classList.remove("flipped");
                card2.classList.remove("flipped");
            }, 800);
        }

        scoreDisplay.textContent = score;
        flippedCards = [];

        if (matchedCards === cards.length) {
            endGame();
        }
    }

    async function initGame() {
        message.textContent = "";
        score = 0;
        matchedCards = 0;
        flippedCards = [];
        cards = [];

        scoreDisplay.textContent = score;
        gameBoard.innerHTML = "";

        const totalPairs = (gridSize * gridSize) / 2;
        const images = await fetchImages(totalPairs);
        const allImages = shuffle([...images, ...images]);

        allImages.forEach(imgUrl => {
            const card = createCard(imgUrl);
            cards.push(card);
        });

        gameBoard.style.gridTemplateColumns = `repeat(${gridSize}, 80px)`;
        cards.forEach(card => gameBoard.appendChild(card));
    }

    function endGame() {
        finalScoreDisplay.textContent = score;
        saveHighScore(playerName, score);
        showHighScores();
        gameContainer.classList.add("hidden");
        winScreen.classList.remove("hidden");
    }

    function saveHighScore(name, points) {
        let scores = JSON.parse(localStorage.getItem("memoryGameScores")) || [];
        scores.push({ name, points });
        scores.sort((a, b) => b.points - a.points);
        scores = scores.slice(0, 5);
        localStorage.setItem("memoryGameScores", JSON.stringify(scores));
    }

    function showHighScores() {
        let scores = JSON.parse(localStorage.getItem("memoryGameScores")) || [];
        highScoresList.innerHTML = "";
        scores.forEach(s => {
            const li = document.createElement("li");
            li.textContent = `${s.name} - ${s.points} pts`;
            highScoresList.appendChild(li);
        });
    }

    startButton.addEventListener("click", () => {
        const nameInput = document.getElementById("playerName").value.trim();
        const difficultySelect = document.getElementById("difficulty").value;

        if (!nameInput) {
            alert("Digite seu nome!");
            return;
        }

        playerName = nameInput;
        gridSize = parseInt(difficultySelect);

        document.getElementById("welcomeMessage").textContent = `Boa sorte, ${playerName}!`;

        startScreen.classList.add("hidden");
        gameContainer.classList.remove("hidden");
        initGame();
    });

    restartButton.addEventListener("click", () => {
        winScreen.classList.add("hidden");
        startScreen.classList.remove("hidden");
    });
});
