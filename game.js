import { Display } from "./display";
import negamax from "./negamax";

const startingHands = {
  computer: [1, 1],
  player: [1, 1],
};

function mapToObj(curMap) {
  let obj = {};
  for (let [key, value] of curMap) {
    obj[key] = value;
  }
  return obj;
}

function objToMap(curObj) {
  let result = new Map();
  for (let key of Object.keys(curObj)) {
    result.set(key, curObj[key]);
  }
  return result;
}

export class Game {
  constructor(
    computerHands,
    playerHands,
    score,
    transpositionTable,
    depth,
    delay
  ) {
    this.computerHands = computerHands;
    this.playerHands = playerHands;
    this.score = score;
    this.display = new Display(this);
    this.transpositionTable = transpositionTable;
    this.depth = depth;
    this.delay = delay;
  }

  handleSelectHand(event) {
    if (this.isValid(event)) {
      const chosenHandIndex = event.index;
      switch (event.type) {
        case "computer":
          this.handleRound(chosenHandIndex);
          break;
        case "player":
          this.playerHands.forEach((hand, index) => {
            if (index === chosenHandIndex) {
              hand.selected = !hand.selected;
            } else {
              hand.selected = false;
            }
          });
          this.updateDisplay();
          break;
      }
    }
  }

  isValid(event) {
    switch (event.type) {
      case "computer":
        return (
          this.playerHands.find((hand) => hand.selected === true) &&
          this.computerHands[event.index].value != 0
        );
      case "player":
        return this.playerHands[event.index].value != 0;
    }
  }

  async handleRound(chosenHandIndex) {
    //player move
    this.selectHand("computer", chosenHandIndex);
    let tapValue = this.getTapValue(this.playerHands);
    await this.showTapText("player", tapValue);
    await this.updateHandValue(this.computerHands, chosenHandIndex, tapValue);
    this.clearHandSelect();
    this.clearTapText();
    this.updateDisplay();
    if (this.winCheck()) {
      await this.handleWin("player");
    } else {
      //computer move
      const computerMove = await this.chooseMove();
      this.selectHand("computer", computerMove.sourceIndex);
      tapValue = computerMove.sourceValue;
      await this.showTapText("computer", tapValue);
      await this.selectHand("player", computerMove.targetIndex, this.delay);
      await this.updateHandValue(
        this.playerHands,
        computerMove.targetIndex,
        tapValue
      );
      this.clearHandSelect();
      this.clearTapText();
      this.updateDisplay();
      if (this.winCheck()) {
        await this.handleWin("computer");
      }
      this.saveData();
    }
  }

  //Game helper functions
  async selectHand(target, index, sleep = 0) {
    if (target === "computer") {
      this.computerHands[index].selected = true;
    } else {
      this.playerHands[index].selected = true;
    }
    this.updateDisplay();
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, sleep);
    });
  }

  getTapValue(source) {
    let sourceIndex = source.findIndex((hand) => hand.selected === true);
    return source[sourceIndex].value;
  }

  showTapText(source, value) {
    this.display.gameScreenElements.tapText.textContent = `${
      source === "player" ? "You tap" : "The computer taps"
    } for ${value}`;
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, this.delay);
    });
  }

  async updateHandValue(targetHands, targetIndex, tapValue) {
    targetHands[targetIndex].value =
      (targetHands[targetIndex].value + tapValue) % 5;
    this.updateDisplay();
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, this.delay);
    });
  }

  clearHandSelect() {
    for (let hand of this.playerHands) {
      hand.selected = false;
    }
    for (let hand of this.computerHands) {
      hand.selected = false;
    }
  }

  clearTapText() {
    this.display.gameScreenElements.tapText.textContent = "";
  }

  winCheck() {
    return (
      this.computerHands.every((hand) => hand.value === 0) ||
      this.playerHands.every((hand) => hand.value === 0)
    );
  }

  async handleWin(target) {
    await new Promise((resolve) => {
      this.display.gameScreenElements.tapText.textContent = `${
        target === "computer" ? "The computer has" : " You have"
      } won!`;
      this.score[target]++;
      this.updateScore();
      setTimeout(() => {
        this.clearTapText();
        this.restartRound();
        resolve();
      }, 1.5 * this.delay);
    });
  }

  //computer turn
  chooseMove() {
    return new Promise((resolve) => {
      setTimeout(() => {
        let bestMove;
        let bestEvaluation = -Infinity;

        let computerInput = this.computerHands
          .map((hand) => hand.value)
          .filter((value) => value != 0);

        let playerInput = this.playerHands
          .map((hand) => hand.value)
          .filter((value) => value != 0);

        computerInput.forEach((sourceValue, index, array) => {
          playerInput.forEach((targetValue, targetIndex, targetArray) => {
            let newPlayerInput = targetArray.slice();
            newPlayerInput[targetIndex] = (targetValue + sourceValue) % 5;
            if (newPlayerInput[targetIndex] === 0) {
              newPlayerInput.splice(targetIndex, 1);
            }

            let evaluateMove = -negamax(
              [newPlayerInput, computerInput.slice()],
              this.depth,
              -Infinity,
              Infinity,
              1,
              this.transpositionTable
            );

            if (evaluateMove > bestEvaluation) {
              bestEvaluation = evaluateMove;
              bestMove = { sourceValue, targetValue };
            }
          });
        });

        let sourceValue = bestMove.sourceValue;
        let sourceIndex = this.computerHands.findIndex(
          (hand) => hand.value === sourceValue
        );
        let targetValue = bestMove.targetValue;
        let targetIndex = this.playerHands.findIndex(
          (hand) => hand.value === targetValue
        );

        resolve({ sourceValue, sourceIndex, targetValue, targetIndex });
      }, 1.5 * this.delay);
    });
  }

  updateDisplay() {
    this.display.refreshHands(this.computerHands, this.playerHands);
    this.updateScore();
  }

  //Menu helper functions
  handleDepthChange(depth) {
    this.depth = depth;
  }

  handleSpeedChange(speed) {
    this.delay = (10 - speed) * 200;
  }

  restartRound() {
    this.computerHands.forEach(
      (hand, index) => (hand.value = startingHands.computer[index])
    );
    this.playerHands.forEach(
      (hand, index) => (hand.value = startingHands.player[index])
    );
    this.clearHandSelect();
    this.updateDisplay();
  }

  resetRound() {
    this.score.computer = 0;
    this.score.player = 0;
    this.updateScore();
    this.clearTapText();
    this.restartRound();
    sessionStorage.clear();
  }

  //ScoreBoard functions
  updateScore() {
    this.display.gameScreenElements.computerScore.textContent =
      this.score.computer;
    this.display.gameScreenElements.playerScore.textContent = this.score.player;
  }

  //Save functions
  saveData() {
    let gameData = {
      computerHands: this.computerHands,
      playerHands: this.playerHands,
      score: this.score,
      transpositionTable: JSON.stringify(mapToObj(this.transpositionTable)),
      depth: this.depth,
      delay: this.delay,
    };
    sessionStorage.setItem("gameData", JSON.stringify(gameData));
    sessionStorage.setItem("hasLoaded", true);
  }

  handleRefreshContent(gameData) {
    this.computerHands = gameData.computerHands;
    this.playerHands = gameData.playerHands;
    this.score = gameData.score;
    this.transpositionTable = objToMap(JSON.parse(gameData.transpositionTable));
    this.depth = gameData.depth;
    this.delay = gameData.delay;
    this.updateScore();
    this.updateDisplay();
    this.display.gameScreenElements.depthSlider.value = this.depth;
    this.display.gameScreenElements.depthValue.value = this.depth;
    this.display.gameScreenElements.speedSlider.value = 10 - this.delay / 200;
    this.display.gameScreenElements.speedValue.textContent =
      10 - this.delay / 200;
  }
}
