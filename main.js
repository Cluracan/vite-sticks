import "./style.css";
import { Game } from "./game.js";
import negamax from "./negamax.js";

const transpositionTable = new Map();

const game = new Game(
  [
    { value: 1, selected: false },
    { value: 1, selected: false },
  ],
  [
    { value: 1, selected: false },
    { value: 1, selected: false },
  ],
  { computer: 0, player: 0 },
  transpositionTable,
  10
);
