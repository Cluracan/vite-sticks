import "./style.css";

import negamax from "./negamax.js";

const transpositionTable = new Map();

const gameContent = document.getElementById("content");

gameContent.innerText = "TESTING testing";

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
