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

function getRandomItem() {
  return items[Math.floor(Math.random() * items.length)];
}

function loadNewItem() {
  currentItem = getRandomItem();
  trashItem.style.backgroundImage = `url(${currentItem.image})`;
}

trashItem.addEventListener("dragstart", e => {
  e.dataTransfer.setData("text/plain", currentItem.type);
});

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