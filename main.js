import "./style.css";
import { Game } from "./game.js";

const hasLoaded = sessionStorage.getItem("hasLoaded") || false;

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
  new Map(),
  5,
  1000
);
if (!hasLoaded) {
  game.updateDisplay();
} else {
  game.handleRefreshContent(JSON.parse(sessionStorage.getItem("gameData")));
}
