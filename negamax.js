const calculateSingleHands = new Map();
for (let i of [1, 2, 3, 4]) {
  for (let j of [1, 2, 3, 4]) {
    calculateSingleHands.set(`[${i}]x[${j}]`, playHands(i, j));
  }
}
function playHands(i, j) {
  let visited = new Set();
  let completed = false;
  let color = 1;
  while (!completed) {
    if (visited.has(`${i}x${j}`)) {
      return 0;
    }
    visited.add(`${i}x${j}`);
    if (color === 1) {
      j = (j + i) % 5;
      if (j === 0) {
        return color;
      }
    } else {
      i = (i + j) % 5;
      if (i === 0) {
        return color;
      }
    }
    color *= -1;
  }
}

export default function negamax(
  node,
  depth,
  alpha,
  beta,
  color,
  transpositionTable
) {
  let alphaOrig = alpha;

  let ttEntry = transpositionTable.get(getKey(node)) || {};
  if (Object.keys(ttEntry).length > 0 && ttEntry.depth >= depth) {
    if (ttEntry.flag === "EXACT") {
      return ttEntry.value;
    } else if (ttEntry.flag === "LOWERBOUND") {
      alpha = Math.max(alpha, ttEntry.value);
    } else if (ttEntry === "UPPERBOUND") {
      beta = Math.min(beta, ttEntry.value);
    }
    if (alpha >= beta) {
      return ttEntry.value;
    }
  }

  if (depth === 0 || isTerminal(node)) {
    // console.log(
    //   `checking endpoint node ${JSON.stringify(
    //     node
    //   )} color ${color}... returning ${heuristicValue(node, color)}`
    // );
    return heuristicValue(node, color);
  }

  const childNodes = generateMoves(node, color);
  let value = -Infinity;
  for (let child of childNodes) {
    value = Math.max(
      value,
      -negamax(child, depth - 1, -beta, -alpha, -color, transpositionTable)
    );
    alpha = Math.max(alpha, value);
    if (alpha >= beta) {
      // console.log("breaking on alpha/beta");
      break;
    }
  }

  ttEntry.value = value;
  if (value <= alphaOrig) {
    ttEntry.flag = "UPPERBOUND";
  } else if (value >= beta) {
    ttEntry.flag = "LOWERBOUND";
  } else {
    ttEntry.flag = "EXACT";
  }
  ttEntry.depth = depth;
  transpositionTable.set(getKey(node), ttEntry);
  return value;
}

function getKey(node) {
  return `${JSON.stringify(node[0].sort())}x${JSON.stringify(node[1].sort())}`;
}

function isTerminal(node) {
  return node[0].length === 0 || node[1].length === 0;
}

function heuristicValue(node, color) {
  const player = node[color === 1 ? 0 : 1];
  const opponent = node[color === 1 ? 1 : 0];
  if (player.length === 0) return -1;
  if (opponent.length === 0) return 1;
  if (player.length === 2 && opponent.length === 2) {
    return killingBlow(player, opponent) ? 0.5 : 0;
  }
  if (player.length === 2 && opponent.length === 1) {
    return killingBlow(player, opponent) ? 1 : 0.5;
  }
  if (player.length === 1 && opponent.length === 2) {
    return killingBlow(player, opponent) ? 0 : -0.5;
  }
  if (player.length === 1 && opponent.length === 1) {
    return calculateSingleHands.get(
      `${JSON.stringify(player)}x${JSON.stringify(opponent)}`
    );
  }
}

function killingBlow(player, opponent) {
  return player.some((playerHand) => {
    opponent.some((opponentHand) => {
      playerHand + opponentHand === 5;
    });
  });
}

function generateMoves(node, color) {
  const childNodes = [];
  const player = node[color === 1 ? 0 : 1];
  const opponent = node[color === 1 ? 1 : 0];
  player.forEach((hand) => {
    for (let i = 0; i < opponent.length; i++) {
      let newOpponentHands = opponent.slice();
      newOpponentHands[i] = (newOpponentHands[i] + hand) % 5;
      if (newOpponentHands[i] === 0) {
        newOpponentHands.splice(i, 1);
      }
      childNodes.push(
        color === 1 ? [player, newOpponentHands] : [newOpponentHands, player]
      );
    }
  });
  return childNodes;
}
