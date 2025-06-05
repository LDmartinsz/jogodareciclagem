const item = document.getElementById("item");
const bins = document.querySelectorAll(".bin");
const scoreDisplay = document.getElementById("score");

const trashTypes = ["papel", "metal", "vidro", "plastico"];
const trashImages = {
  papel: "papel_amassado.png",
  metal: "lata_refrigerante.png",
  vidro: "pote_vidro.png",
  plastico: "garrafa_plastica.png"
};

let currentType = "";
let score = 0;
let errors = 0;

function newItem() {
  currentType = trashTypes[Math.floor(Math.random() * trashTypes.length)];
  item.style.backgroundImage = `url(${trashImages[currentType]})`;
  item.style.backgroundSize = "cover";
}
newItem();

item.addEventListener("dragstart", (e) => {
  e.dataTransfer.setData("text/plain", currentType);
});

bins.forEach((bin) => {
  bin.addEventListener("dragover", (e) => {
    e.preventDefault();
  });

  bin.addEventListener("drop", (e) => {
    e.preventDefault();
    const droppedType = e.dataTransfer.getData("text/plain");
    if (droppedType === bin.dataset.type) {
      score++;
    } else {
      errors++;
    }

    if (errors >= 5) {
      alert("Você perdeu! Pontuação final: " + score);
      score = 0;
      errors = 0;
    }

    scoreDisplay.textContent = `Pontuação: ${score} | Erros: ${errors}/5`;
    newItem();
  });
});

// Suporte para toque em celulares
let touchOffsetX = 0;
let touchOffsetY = 0;

item.addEventListener("touchstart", function (e) {
  const touch = e.touches[0];
  const rect = item.getBoundingClientRect();
  touchOffsetX = touch.clientX - rect.left;
  touchOffsetY = touch.clientY - rect.top;
  item.style.position = "absolute";
  item.style.zIndex = 1000;
});

item.addEventListener("touchmove", function (e) {
  e.preventDefault();
  const touch = e.touches[0];
  item.style.left = touch.clientX - touchOffsetX + "px";
  item.style.top = touch.clientY - touchOffsetY + "px";
}, { passive: false });

item.addEventListener("touchend", function () {
  const itemCenter = {
    x: item.offsetLeft + item.offsetWidth / 2,
    y: item.offsetTop + item.offsetHeight / 2
  };

  let matched = false;
  bins.forEach(bin => {
    const rect = bin.getBoundingClientRect();
    if (
      itemCenter.x > rect.left &&
      itemCenter.x < rect.right &&
      itemCenter.y > rect.top &&
      itemCenter.y < rect.bottom
    ) {
      if (bin.dataset.type === currentType) {
        score++;
      } else {
        errors++;
      }
      matched = true;
    }
  });

  if (!matched) {
    errors++;
  }

  if (errors >= 5) {
    alert("Você perdeu! Pontuação final: " + score);
    score = 0;
    errors = 0;
  }

  scoreDisplay.textContent = `Pontuação: ${score} | Erros: ${errors}/5`;

  item.style.left = "";
  item.style.top = "";
  item.style.position = "";
  item.style.zIndex = "";

  newItem();
});
