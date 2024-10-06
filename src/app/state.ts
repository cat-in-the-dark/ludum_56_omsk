import { allowedPlayerNumber } from "./consts";

export type PlayerAttribution = {
  drink: number;
  egg: number;
};

export class PlayerState {
  public pressStart = true;
  public score = 0;
  public attribution: PlayerAttribution = {
    drink: 0,
    egg: 0,
  };
}

export const gameState = {
  playerStates: [] as PlayerState[],
  reset() {
    for (
      let playerNumber = 0;
      playerNumber < allowedPlayerNumber;
      playerNumber++
    ) {
      this.playerStates[playerNumber] = new PlayerState();
    }
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
