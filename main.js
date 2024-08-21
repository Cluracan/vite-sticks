import "./style.css";
import { Game } from "./game.js";
import negamax from "./negamax.js";

const transpositionTable = new Map();

const game = new Game(
  [
    { value: 2, selected: false },
    { value: 3, selected: false },
  ],
  [
    { value: 1, selected: false },
    { value: 2, selected: false },
  ],
  { computer: 3, player: 2 },
  transpositionTable,
  10
);

// console.log(
//   negamax(
//     [
//       [3, 3],
//       [2, 1],
//     ],
//     10,
//     -Infinity,
//     Infinity,
//     1,
//     transpositionTable
//   )
// );
// console.log("---------------------------------------------------------");

console.log(
  negamax(
    [
      [1, 0],
      [3, 3],
    ],
    3,
    -Infinity,
    Infinity,
    1,
    transpositionTable
  )
);
