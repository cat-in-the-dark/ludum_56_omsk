import { Vector2 } from "@cat_in_the_dark/math";
import { inputs } from "../../lib/inputs";
import { IScene } from "../../lib/scene-manager";
import { am } from "../assets";
import { canvasHeight, canvasWidth, maxPlayer } from "../consts";
import {
  Controls,
  isArrows,
  isWASD,
  newArrowControls,
  newGampePadControls,
  newWasdControls,
} from "../controls";
import { Player } from "../entities/player";
import { Rock } from "../entities/rock";

const fontPosition = new Vector2(128, 0);

export class GameScene implements IScene {
  players: Map<string, Player> = new Map();
  private spawnPoses = [
    new Vector2(64, canvasHeight - 64),
    new Vector2(canvasWidth - 64, canvasHeight - 64),
  ];

  rocks = new Array<Rock>();

  constructor() {}

  activate(): void {
    this.players = new Map();
  }

  draw(): void {
    am.logo.draw(Vector2.zero(), 0, 6);
    for (const [, player] of this.players) {
      player.draw();
    }

    for (const rock of this.rocks) {
      rock.draw();
    }

    am.font.drawTextPro({
      text: "qazwsxerdcrfv\ntgbyhyhujmik,olp;",
      position: fontPosition,
      fontSize: 10,
    });
  }

  update(dt: number): void {
    for (const [, player] of this.players) {
      player.update(dt);
    }

    for (const rock of this.rocks) {
      rock.update(dt);
    }

    this.handleNewPlayer();
  }

  exit(): void {
    // ?
  }

  private trySpawn(id: string, keys: Set<string>) {
    if (id === "keyboard" && !this.players.has("wasd") && isWASD(keys)) {
      console.log("Spawn WASD");
      this.players.set("wasd", this.spawnPlayer(newWasdControls()));
    } else if (
      id === "keyboard" &&
      !this.players.has("arrows") &&
      isArrows(keys)
    ) {
      console.log("Spawn ARROWS");
      this.players.set("arrows", this.spawnPlayer(newArrowControls()));
    } else if (id !== "keyboard" && !this.players.has(id)) {
      console.log("Spawn: ", id);
      this.players.set(id, this.spawnPlayer(newGampePadControls(id)));
    }
  }

  private spawnPlayer(controls: Controls): Player {
    const playerID = this.players.size;
    const pos = this.spawnPoses[playerID];
    if (!pos) {
      throw new Error(`Unknown spawnPoses for playerID=${playerID}`);
    }
    const playerAssets = am.player[playerID];
    if (!playerAssets) {
      throw new Error(`Unknown playerData for playerID=${playerID}`);
    }

    return new Player(playerID, pos, playerAssets, controls, this);
  }

  private handleNewPlayer() {
    if (this.players.size >= maxPlayer) {
      return;
    }

    for (const [id, keys] of inputs.getPressed()) {
      if (keys.size !== 0) {
        this.trySpawn(id, keys);
      }
    }
  }
}
