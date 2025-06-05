const items = [
  { type: "papel", image: "papel_amassado.png" },
  { type: "plastico", image: "garrafa_plastica.png" },
  { type: "metal", image: "lata_refrigerante.png" },
  { type: "vidro", image: "pote_vidro.png" }
];

let score = 0;
let errors = 0;
let correctStreak = 0;
let currentItem = null;

const trashItem = document.getElementById("trash-item");
const scoreDisplay = document.getElementById("score");
const errorDisplay = document.getElementById("errors");
const gameOverDisplay = document.getElementById("gameOverDisplay");
const finalScore = document.getElementById("finalScore");
const restartButton = document.getElementById("restartButton");

// Função para escolher item aleatório
function getRandomItem() {
  return items[Math.floor(Math.random() * items.length)];
}

// Função para carregar novo item
function loadNewItem() {
  currentItem = getRandomItem();
  trashItem.style.backgroundImage = `url(${currentItem.image})`;
  trashItem.style.position = "relative";
  trashItem.style.left = "auto";
  trashItem.style.top = "auto";
  trashItem.style.zIndex = "auto";
}

// Mostrar pontos flutuantes
function showFloatingPoints(text) {
  const float = document.getElementById("points-float");
  float.textContent = text;
  float.style.left = trashItem.offsetLeft + 30 + "px";
  float.style.top = trashItem.offsetTop - 10 + "px";
  float.style.display = "block";
  float.style.animation = "none";
  void float.offsetWidth;
  float.style.animation = "floatUp 1s ease-out forwards";

  setTimeout(() => {
    float.style.display = "none";
  }, 1000);
}

// Drag and drop com mouse - já existente
trashItem.addEventListener("dragstart", e => {
  e.dataTransfer.setData("text/plain", currentItem.type);
});

document.querySelectorAll(".bin").forEach(bin => {
  bin.addEventListener("dragover", e => e.preventDefault());

  bin.addEventListener("drop", e => {
    e.preventDefault();
    const droppedType = e.dataTransfer.getData("text/plain");
    const binType = bin.getAttribute("data-type");

    if (droppedType === binType) {
      score += 100;
      correctStreak++;
      showFloatingPoints("100");
      if (correctStreak % 5 === 0) {
        score += 200;
        showFloatingPoints("Bônus! +200");
      }
      scoreDisplay.textContent = score;
    } else {
      errors++;
      correctStreak = 0;
      errorDisplay.textContent = errors;

      if (errors >= 5) {
        trashItem.style.display = "none";
        finalScore.textContent = `Sua pontuação: ${score} pontos`;
        gameOverDisplay.style.display = "block";
        return;
      }
    }

    loadNewItem();
  });
});

// Variáveis para controle do toque
let isTouchDragging = false;
let touchOffsetX = 0;
let touchOffsetY = 0;

// Função para detectar se o ponto (x, y) está dentro de um elemento
function isPointInsideElement(x, y, element) {
  const rect = element.getBoundingClientRect();
  return (
    x >= rect.left &&
    x <= rect.right &&
    y >= rect.top &&
    y <= rect.bottom
  );
}

// Eventos para touch drag no #trash-item
trashItem.addEventListener("touchstart", e => {
  e.preventDefault();
  isTouchDragging = true;

  const touch = e.touches[0];
  const rect = trashItem.getBoundingClientRect();
  touchOffsetX = touch.clientX - rect.left;
  touchOffsetY = touch.clientY - rect.top;

  trashItem.style.position = "absolute";
  trashItem.style.zIndex = 1000;
});

trashItem.addEventListener("touchmove", e => {
  if (!isTouchDragging) return;
  e.preventDefault();

  const touch = e.touches[0];
  trashItem.style.left = (touch.clientX - touchOffsetX) + "px";
  trashItem.style.top = (touch.clientY - touchOffsetY) + "px";
});

trashItem.addEventListener("touchend", e => {
  if (!isTouchDragging) return;
  e.preventDefault();
  isTouchDragging = false;

  let droppedOnBin = false;
  const touch = e.changedTouches[0];

  document.querySelectorAll(".bin").forEach(bin => {
    if (isPointInsideElement(touch.clientX, touch.clientY, bin)) {
      droppedOnBin = true;
      const binType = bin.getAttribute("data-type");

      if (currentItem.type === binType) {
        score += 100;
        correctStreak++;
        showFloatingPoints("100");
        if (correctStreak % 5 === 0) {
          score += 200;
          showFloatingPoints("Bônus! +200");
        }
        scoreDisplay.textContent = score;
      } else {
        errors++;
        correctStreak = 0;
        errorDisplay.textContent = errors;

        if (errors >= 5) {
          trashItem.style.display = "none";
          finalScore.textContent = `Sua pontuação: ${score} pontos`;
          gameOverDisplay.style.display = "block";
          return;
        }
      }
      loadNewItem();
    }
  });

  if (!droppedOnBin) {
    trashItem.style.position = "relative";
    trashItem.style.left = "auto";
    trashItem.style.top = "auto";
    trashItem.style.zIndex = "auto";
  }
});

// Reiniciar jogo
restartButton.addEventListener("click", () => {
  score = 0;
  errors = 0;
  correctStreak = 0;
  scoreDisplay.textContent = score;
  errorDisplay.textContent = errors;
  trashItem.style.display = "block";
  gameOverDisplay.style.display = "none";
  loadNewItem();
});

loadNewItem();
