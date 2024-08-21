import {
  handImagesLight,
  handImagesDark,
  handImagesSelected,
} from "./hand_images";

export class Display {
  constructor(game) {
    this.handImages =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
        ? handImagesDark
        : handImagesLight;
    const gameScreenElements = this.generateGameScreen(
      game,
      game.computerHands,
      game.playerHands
    );
    this.gameScreenElements = gameScreenElements;
    this.refreshHands(game.computerHands, game.playerHands);
  }

  generateGameScreen(game) {
    //Game Content
    const computerElements = [
      document.getElementById("computer-left"),
      document.getElementById("computer-right"),
    ];
    computerElements.forEach((element, index) => {
      element.addEventListener("click", (e) => {
        game.handleSelectHand({ type: "computer", index });
      });
    });

    const playerElements = [
      document.getElementById("player-left"),
      document.getElementById("player-right"),
    ];
    playerElements.forEach((element, index) => {
      element.addEventListener("click", (e) => {
        game.handleSelectHand({ type: "player", index });
      });
    });

    const tapText = document.getElementById("tap-text");
    tapText.textContent = "Testing tap info";

    //Menu Options
    const depthSlider = document.getElementById("depth-slider");
    depthSlider.addEventListener("change", (e) =>
      game.handleDepthChange(e.target.value)
    );

    const depthValue = document.getElementById("depth-value");

    const restart = document.getElementById("restart");
    restart.addEventListener("click", (e) => game.restartRound());

    const reset = document.getElementById("reset");
    reset.addEventListener("click", (e) => game.resetRound());

    //Scoreboard
    const computerScore = document.getElementById("computer-score");
    const playerScore = document.getElementById("player-score");

    return {
      computerElements,
      playerElements,
      tapText,
      depthSlider,
      depthValue,
      computerScore,
      playerScore,
    };
  }

  refreshHands(computerHands, playerHands) {
    this.gameScreenElements.computerElements.forEach((element, index) => {
      if (computerHands[index].selected) {
        element.src = handImagesSelected[computerHands[index].value];
        element.classList = "selected";
      } else {
        element.src = this.handImages[computerHands[index].value];
        element.classList = "";
      }
    });

    this.gameScreenElements.playerElements.forEach((element, index) => {
      if (playerHands[index].selected) {
        element.src = handImagesSelected[playerHands[index].value];
        element.classList = "selected";
      } else {
        element.src = this.handImages[playerHands[index].value];
        element.classList = "";
      }
    });
  }
}
