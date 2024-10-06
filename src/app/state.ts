import { allowedPlayerNumber } from "./consts";

export type PlayerAttribution = {
  drink: number;
  egg: number;
  poop: number;
};

export class PlayerState {
  public pressStart = true;
  public score = 0;
  public attribution: PlayerAttribution = {
    drink: 0,
    egg: 0,
    poop: 0,
  };
}

export const gameState = {
  playerStates: [] as PlayerState[],
  levelNumber: 0,
  reset() {
    for (
      let playerNumber = 0;
      playerNumber < allowedPlayerNumber;
      playerNumber++
    ) {
      this.playerStates[playerNumber] = new PlayerState();
    }
  },

  nextLevel() {
    this.playerStates.forEach((state) => {
      state.attribution.egg = 0;
      state.attribution.drink = 0;
      state.attribution.poop = 0;
    });
    this.levelNumber += 1;
  },

  addScore(playerId: number, n: number) {
    if (this.playerStates[playerId]) {
      this.playerStates[playerId].score += n;
    }
  },

  attribute(playerId: number, scoreType: keyof PlayerAttribution) {
    if (this.playerStates[playerId]) {
      this.playerStates[playerId].attribution[scoreType] += 1;
    }
  },

  markJoined(playerId: number) {
    if (this.playerStates[playerId]) {
      this.playerStates[playerId].pressStart = false;
    }
  },
};


// @ts-expect-error жыж
window.gameState = gameState;