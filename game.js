import { Display } from "./display";

export class Game {
  constructor(playerHands, computerHands, score) {
    this.playerHands = playerHands;
    this.computerHands = computerHands;
    this.score = score;
    this.display = new Display(this);
  }
}
