import "./style.css";
import { Game } from "./game.js";
import negamax from "./negamax.js";

const transpositionTable = new Map();

const game = new Game([1, 1], [2, 4], [3, 2]);

console.log(
  negamax(
    [
      [1, 1],
      [1, 1],
    ],
    10,
    -Infinity,
    Infinity,
    1,
    transpositionTable
  )
);
console.log("---------------------------------------------------------");

console.log(
  negamax(
    [
      [2, 3],
      [2, 1],
    ],
    10,
    -Infinity,
    Infinity,
    1,
    transpositionTable
  )
);
