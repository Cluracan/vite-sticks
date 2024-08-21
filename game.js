import { Display } from "./display";
import negamax from "./negamax";

export class Game {
  constructor(computerHands, playerHands, score, transpositionTable, depth) {
    this.computerHands = computerHands;
    this.playerHands = playerHands;
    this.score = score;
    this.display = new Display(this);
    this.transpositionTable = transpositionTable;
    this.depth = depth;
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
    //computer move
    const computerMove = await this.chooseMove();
    console.log(computerMove);
    this.selectHand("computer", computerMove.sourceIndex);
    tapValue = this.getTapValue(this.computerHands);
    await this.showTapText("computer", tapValue);
    await this.selectHand("player", computerMove.targetIndex, 2000);
    await this.updateHandValue(
      this.playerHands,
      computerMove.targetIndex,
      tapValue
    );
    this.clearHandSelect();
    this.clearTapText();
    this.updateDisplay();
  }

  //player turn

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
    console.log(source);
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
      }, 800);
    });
  }

  async updateHandValue(targetHands, targetIndex, tapValue) {
    targetHands[targetIndex].value =
      (targetHands[targetIndex].value + tapValue) % 5;
    this.updateDisplay();
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 800);
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

        computerInput.forEach((sourceValue) => {
          playerInput.forEach((targetValue, targetIndex, targetArray) => {
            let newPlayerInput = targetArray.slice();
            newPlayerInput[targetIndex] = (targetValue + sourceValue) % 5;
            if (newPlayerInput[targetIndex] === 0) {
              newPlayerInput.splice(targetIndex, 1);
            }
            console.log(
              `tapping ${sourceValue} on ${JSON.stringify(
                targetArray
              )} to get ${JSON.stringify(newPlayerInput)}`
            );
            let evaluateMove = -negamax(
              [newPlayerInput, computerInput],
              this.depth,
              -Infinity,
              Infinity,
              1,
              this.transpositionTable
            );
            console.log(`scores ${evaluateMove}`);
            if (evaluateMove > bestEvaluation) {
              bestEvaluation = evaluateMove;
              bestMove = { sourceValue, targetValue };
            }
          });
        });
        console.log(`best move is ${JSON.stringify(bestMove)}`);
        let sourceValue = bestMove.sourceValue;
        let sourceIndex = this.computerHands.findIndex(
          (hand) => hand.value === sourceValue
        );
        let targetValue = bestMove.targetValue;
        let targetIndex = this.playerHands.findIndex(
          (hand) => hand.value === targetValue
        );

        resolve({ sourceValue, sourceIndex, targetValue, targetIndex });
      }, 2200);
    });
  }

  handleDepthChange(depth) {
    this.display.gameScreenElements.depthSlider.value = 2;
    this.display.gameScreenElements.depthValue.textContent = 2;
  }

  restartGame() {
    console.log("restarting");
  }

  updateDisplay() {
    this.display.refreshHands(this.computerHands, this.playerHands);
  }
}
