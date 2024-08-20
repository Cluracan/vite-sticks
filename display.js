import {
  handImagesLight,
  handImagesDark,
  handImagesSelected,
} from "./hand_images";

export class Display {
  constructor(game) {
    this.colorScheme =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    console.log(this.colorScheme);
    const gameScreenElements = this.generateGameScreen(
      game.computerHands,
      game.playerHands
    );
    this.gameScreenElements = gameScreenElements;
  }

  generateGameScreen(computerHands, playerHands) {
    const computerLeft = document.getElementById("computer-left");
    const computerRight = document.getElementById("computer-right");
    const playerLeft = document.getElementById("player-left");
    const playerRight = document.getElementById("player-right");
    computerLeft.src = handImagesDark[computerHands[0]];
    computerRight.src = handImagesDark[computerHands[1]];
    playerLeft.src = handImagesDark[playerHands[0]];
    playerRight.src = handImagesSelected[playerHands[1]];
    // move src paths into 'refreshHands(computerHands, playerHands)
    const tapText = document.getElementById("tapText");

    return { computerLeft, computerRight, playerLeft, playerRight, tapText };
  }
}
