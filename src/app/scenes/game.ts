import { Vector2 } from "@cat_in_the_dark/math";
import { inputs } from "../../lib/inputs";
import { ITiledLevel } from "../../lib/interfaces/tiled-level";
import { IScene, sceneManager } from "../../lib/scene-manager";
import { am, LevelAsset } from "../assets";
import { canvasHeight, canvasWidth, maxPlayer, Vector2Zero } from "../consts";
import {
  Controls,
  isArrows,
  isWASD,
  newArrowControls,
  newGampePadControls,
  newWasdControls,
} from "../controls";
import { Pigeon } from "../entities/pigeon";
import { Player } from "../entities/player";
import { Rock } from "../entities/rock";

const fontPosition = new Vector2(128, 0);

export class GameScene implements IScene {
  players = new Map<string, Player>();
  rocks = new Array<Rock>();
  pigeons = new Array<Pigeon>();

  private spawnPoses = [
    new Vector2(64, canvasHeight - 64),
    new Vector2(canvasWidth - 64, canvasHeight - 64),
  ];

  constructor(private level: LevelAsset, public readonly nextLevel: string) {
    level.map.layers.forEach((layer) => {
      if (layer.name === "static-pigeons") {
        this.setupStaticPigeons(layer);
      } else {
        console.log(layer.name, layer);
      }
    });
  }

  private setupStaticPigeons(layer: ITiledLevel["layers"][number]) {
    for (const obj of layer.objects ?? []) {
      const pigeon = new Pigeon(new Vector2(obj.x, obj.y), Vector2.right());
      this.pigeons.push(pigeon);
    }
  }

  activate(): void {
    this.players = new Map();
  }

  draw(): void {
    this.level.background.draw(Vector2Zero);
    for (const [, player] of this.players) {
      player.draw();
    }

    for (const rock of this.rocks) {
      rock.draw();
    }

    for (const pigeon of this.pigeons) {
      pigeon.draw();
    }

    // am.font.drawTextPro({
    //   text: "qazwsxerdcrfv\ntgbyhyhujmik,olp;",
    //   position: fontPosition,
    //   fontSize: 10,
    // });
  }

  update(dt: number): void {
    if (inputs.isPressed("Enter")) {
      sceneManager.set(this.nextLevel);
    }

    for (const [, player] of this.players) {
      player.update(dt);
    }

    this.rocks = this.rocks.filter((rock) => {
      rock.update(dt); // do it here just to save iterations
      return !rock.shouldDestroy();
    });

    this.pigeons = this.pigeons.filter((pigeon) => {
      pigeon.update(dt); // do it here just to save iterations
      return !pigeon.shouldDestroy();
    });

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
