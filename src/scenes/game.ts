import { Vector2 } from "@cat_in_the_dark/math";
import { AssetsManager } from "../assets";
import { isArrows, isWASD } from "../controls";
import { Player } from "../entities/player";
import { inputs } from "../lib/inputs";
import { IScene } from "../lib/scene-manager";

const position = new Vector2(128, 128);

export class GameScene implements IScene {
  players: Map<string, Player> = new Map();
  private spawnPoses = [new Vector2(16, 16), new Vector2(64, 16)];

  constructor(private am: AssetsManager) {}

  activate(): void {
    this.players = new Map();
  }

  draw(): void {
    this.am.logo.draw(Vector2.zero(), 0, 6);
    for (const [, player] of this.players) {
      player.draw();
    }
    this.am.font.drawTextPro({
      text: "qazwsxerdcrfv\ntgbyhyhujmik,olp;",
      position,
      fontSize: 12,
    });
  }

  update(dt: number): void {
    for (const [, player] of this.players) {
      player.update(dt);
    }

    this.handleNewPlayer();
  }

  exit(): void {
    // ?
  }

  private trySpawn(id: string, keys: Set<string>) {
    if (id === "keyboard" && !this.players.has("wasd") && isWASD(keys)) {
      console.log("Spawn WASD");
      this.players.set("wasd", this.spawnPlayer());
    } else if (
      id === "keyboard" &&
      !this.players.has("arrows") &&
      isArrows(keys)
    ) {
      console.log("Spawn ARROWS");
      this.players.set("arrows", this.spawnPlayer());
    } else if (id !== "keyboard" && !this.players.has(id)) {
      console.log("Spawn: ", id);
      this.players.set(id, this.spawnPlayer());
    }
  }

  private spawnPlayer(): Player {
    const playerID = this.players.size;
    const pos = this.spawnPoses[playerID];
    if (!pos) {
      throw new Error(`Unknown spawnPoses for playerID=${playerID}`);
    }
    const playerAssets = this.am.player[playerID];
    if (!playerAssets) {
      throw new Error(`Unknown playerData for playerID=${playerID}`);
    }

    return new Player(playerID, pos, playerAssets);
  }

  private handleNewPlayer() {
    if (this.players.size >= 4) {
      console.warn("Players limit already reached");
      return;
    }

    for (const [id, keys] of inputs.getPressed()) {
      if (keys.size !== 0) {
        this.trySpawn(id, keys);
      }
    }
  }
}
