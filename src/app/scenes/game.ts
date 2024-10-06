import { Vector2 } from "@cat_in_the_dark/math";
import { Timer } from "../../lib/coroutines/timer";
import { inputs } from "../../lib/inputs";
import { Layer } from "../../lib/interfaces/tiled-level";
import { IScene, sceneManager } from "../../lib/scene-manager";
import { am, LevelAsset } from "../assets";
import {
  canvasHeight,
  canvasWidth,
  maxPlayer,
  pigeonDamagedSpeed,
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
import { BoyaraBalloon } from "../entities/boyaraballoon";
import { Collider } from "../entities/collider";
import { Falling } from "../entities/falling";
import { Pigeon } from "../entities/pigeon";
import { Player } from "../entities/player";
import { Rock } from "../entities/rock";
import { circleRect, isCircleCollides } from "../phisics";
import { gameState } from "../state";

const fontPosition = new Vector2(128, 0);
const statusTextPosition = new Vector2(96, 24);
const levelNumberPosition = new Vector2(280, 24);

export class GameScene implements IScene {
  players = new Map<string, Player>();
  rocks = new Array<Rock>();
  pigeons = new Array<Pigeon>();
  falling = new Array<Falling>();
  colliders = new Array<Collider>();
  balloons = new Array<BoyaraBalloon>();

  nextSceneCounter = 2;

  jingleTimer = new Timer(2);
  jinglePlayed = false;

  blinkCounter = 0;

  private spawnPoses = [
    new Vector2(64, canvasHeight - 64),
    new Vector2(canvasWidth - 64, canvasHeight - 64),
  ];

  constructor(private level: LevelAsset, public readonly nextLevel: string) {}

  private setupColliders(layer: Layer) {
    for (const obj of layer.objects ?? []) {
      if (obj.width * obj.height < 0.1) {
        console.log("SKIP empty collider", obj);
        continue;
      }
      const col = new Collider(
        new Vector2(obj.x, obj.y),
        new Vector2(obj.width, obj.height)
      );
      this.colliders.push(col);
    }
  }

  private setupStaticPigeons(layer: Layer) {
    for (const obj of layer.objects ?? []) {
      const pigeon = new Pigeon(
        new Vector2(obj.x, obj.y),
        Vector2.right(),
        this,
        {
          idle: 0,
          damaged: pigeonDamagedSpeed,
        }
      );
      this.pigeons.push(pigeon);
    }
  }

  private setupBoyaraBalloons(layer: Layer) {
    for (const obj of layer.objects ?? []) {
      console.log("BALLOON LAYER", layer);
      const balloon = new BoyaraBalloon(
        new Vector2(obj.x, obj.y)
      );
      console.log(balloon);
      this.balloons.push(balloon);
    }
  }

  activate(): void {
    this.rocks = [];
    this.pigeons = [];
    this.falling = [];
    this.colliders = [];

    this.nextSceneCounter = 2;

    this.level.map.layers.forEach((layer) => {
      if (layer.name === "static-pigeons") {
        this.setupStaticPigeons(layer);
      } else if (layer.name === "colliders") {
        this.setupColliders(layer);
        console.log(layer);
      } else if (["bumpers-big", "bumpers-small", "balloons", "moving-pigeons"].includes(layer.name)) {
        this.setupBoyaraBalloons(layer);
      } else {
        console.log(layer.name);
      }
    });

    this.jingleTimer.reset();
    this.jinglePlayed = false;
    this.players = new Map();
    am.sfx.jingle.play();
    gameState.nextLevel();
  }

  draw(): void {
    this.level.background.draw(Vector2Zero);
    for (const [, player] of this.players) {
      player.draw();
    }

    for (const col of this.colliders) {
      col.draw();
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

    for (const b of this.balloons) {
      b.draw();
    }

    // am.font.drawTextPro({
    //   text: "qazwsxerdcrfv\ntgbyhyhujmik,olp;",
    //   position: fontPosition,
    //   fontSize: 10,
    // });

    gameState.playerStates.forEach((state, idx) => {
      if (
        (state.pressStart && this.blinkCounter % 1 < 0.5) ||
        !state.pressStart
      ) {
        am.font.drawTextPro({
          text: state.pressStart
            ? "PUSH START"
            : state.score.toString().padStart(6, "0"),
          position: statusTextPosition.add(new Vector2(88 * idx, 0)),
          fontSize: 10,
        });
      }
    });

    am.font.drawTextPro({
      text: `DOM${gameState.levelNumber}`,
      fontSize: 10,
      position: levelNumberPosition,
    });
  }

  update(dt: number): void {
    this.blinkCounter += dt;
    // @ts-expect-error жыж
    window.blinkCounter = this.blinkCounter;

    this.nextSceneCounter -= dt;

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

    this.balloons = this.balloons.filter((balloons) => {
      balloons.update(dt);
      return !balloons.shouldDestroy();
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
    for (const pigeon of this.pigeons) {
      if (pigeon.shouldDestroy()) {
        continue;
      }

      for (const b of this.balloons) {
        if (isCircleCollides(b, pigeon)) {
          b.popped = true;
          this.falling.push(new Falling("drink", b.pos, new Vector2(0,2)));
        }
      }

      for (const rock of this.rocks) {
        if (rock.shouldDestroy()) {
          continue;
        }
        if (isCircleCollides(rock, pigeon)) {
          rock.hit();
          pigeon.hitRock(rock);
        }
      }

      if (pigeon.state === "damaged") {
        for (const otherPigeon of this.pigeons) {
          if (
            otherPigeon.state === "idle" &&
            isCircleCollides(pigeon, otherPigeon)
          ) {
            pigeon.hittedByPigeon(otherPigeon);
            otherPigeon.hitPigeon(pigeon);
          }
        }
        for (const wall of this.colliders) {
          if (circleRect(pigeon, wall)) {
            pigeon.hitWall(wall);
          }
        }
      }
    }

    for (const player of this.players) {
      for (const falling of this.falling) {
        if (isCircleCollides(player[1], falling)) {
          falling.collected = true;
          gameState.attribute(player[1].id, falling.type);
        }
      }
    }

    if (this.pigeons.length < 1) {
      sceneManager.set(this.nextLevel);
    } else {
      this.nextSceneCounter = 3;
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
