import { Vector2 } from "@cat_in_the_dark/math";
import { Timer } from "../../lib/coroutines/timer";
import { inputs } from "../../lib/inputs";
import { ITiledLevel } from "../../lib/interfaces/tiled-level";
import { IScene, sceneManager } from "../../lib/scene-manager";
import { am, LevelAsset } from "../assets";
import {
  canvasHeight,
  canvasWidth,
  maxPlayer,
  pigeonDamagedSpeed,
  pigeonIdleSpeed,
  Vector2Zero,
} from "../consts";
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
import { gameState } from "../state";
import { Falling } from "../entities/falling";
import { isCircleCollides } from "../phisics";

const fontPosition = new Vector2(128, 0);
const statusTextPosition = new Vector2(96, 24);

export class GameScene implements IScene {
  players = new Map<string, Player>();
  rocks = new Array<Rock>();
  pigeons = new Array<Pigeon>();
  falling = new Array<Falling>();

  jingleTimer = new Timer(2);
  jinglePlayed = false;

  blinkCounter = 0;

  private spawnPoses = [
    new Vector2(64, canvasHeight - 64),
    new Vector2(canvasWidth - 64, canvasHeight - 64),
  ];

  constructor(private level: LevelAsset, public readonly nextLevel: string) {
    level.map.layers.forEach((layer) => {
      if (layer.name === "static-pigeons") {
        this.setupStaticPigeons(layer);
      } else {
        // console.log(layer.name, layer);
      }
    });

  }

  private setupStaticPigeons(layer: ITiledLevel["layers"][number]) {
    for (const obj of layer.objects ?? []) {
      const pigeon = new Pigeon(new Vector2(obj.x, obj.y), Vector2.right(), this, {
        idle: 0,
        damaged: pigeonDamagedSpeed,
      });
      this.pigeons.push(pigeon);
    }
  }

  activate(): void {
    this.jingleTimer.reset();
    this.jinglePlayed = false;
    this.players = new Map();
    am.sfx.jingle.play();
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

    for (const falling of this.falling) {
      falling.draw();
    }

    // am.font.drawTextPro({
    //   text: "qazwsxerdcrfv\ntgbyhyhujmik,olp;",
    //   position: fontPosition,
    //   fontSize: 10,
    // });

    gameState.playerStates.forEach((state, idx) => {
      if ((state.pressStart && this.blinkCounter % 1 < 0.5) || (!state.pressStart)) {
        am.font.drawTextPro({
          text: state.pressStart ? "PUSH START" : state.score.toString().padStart(6, "0"),
          position: statusTextPosition.add( new Vector2( 88 * idx, 0 )) ,
          fontSize: 10,
        });
      }
    });
  }

  update(dt: number): void {
    this.blinkCounter += dt;
    // @ts-expect-error жыж
    window.blinkCounter = this.blinkCounter;

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

    this.falling = this.falling.filter((falling) => {
      falling.update(dt);
      return !falling.shouldDestroy();
    });

    this.updatePhysics();

    this.handleNewPlayer();

    this.jingleTimer.update(dt);

    if (this.jingleTimer.isPassed && !this.jinglePlayed) {
      this.jinglePlayed = true;
      am.sfx.jingle.stop();
      am.sfx.gameMusic.play();
    }
  }

  private updatePhysics() {
    for (const rock of this.rocks) {
      for (const pigeon of this.pigeons) {
        if (isCircleCollides(rock, pigeon)) {
          console.log("AAAA");
          rock.hit();
          pigeon.hit(rock.playerID, rock.pos);
        }
      }
    }
  }

  exit(): void {
    am.sfx.gameMusic.stop();
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
