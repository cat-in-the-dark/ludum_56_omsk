import { Vector2 } from "@cat_in_the_dark/math";
import { IDrawable, IUpdateable } from "../../lib/interfaces/updateable";
import { am, PlayerAssets } from "../assets";
import { defaultPlayerSpeed, defaultRockSpeed } from "../consts";
import { Controls } from "../controls";
import { type GameScene } from "../scenes/game";
import { gameState } from "../state";
import { Rock } from "./rock";

export class Player implements IUpdateable, IDrawable {
  speed = defaultPlayerSpeed;
  rockSpeed = defaultRockSpeed;
  dir = Vector2.right();

  radius = 16;
  isWalking = false;

  constructor(
    public readonly id: number,
    public readonly pos: Vector2,
    public readonly assets: PlayerAssets,
    public readonly controls: Controls,
    public readonly game: GameScene
  ) {
    am.sfx.spawn.play();
    gameState.markJoined(id);
  }

  draw(): void {
    const playerPosOffset = new Vector2(
      this.assets.walkAnim.frame.width / 2,
      0
    );

    this.assets.walkAnim.frame.drawRec(
      this.assets.footRect.flipped(this.dir),
      this.assets.footRect.moved(this.pos.minus(playerPosOffset)),
      Vector2.zero()
    );

    this.assets.shootAnim.frame.drawRec(
      this.assets.headRect.flipped(this.dir),
      this.assets.headRect.moved(this.pos.minus(playerPosOffset)),
      Vector2.zero()
    );
  }

  update(dt: number): void {
    if (this.controls.fire()) {
      if (this.assets.shootAnim.finished) {
        this.assets.shootAnim.reset();
        this.spawnRock();
      }
    }

    const [dir, dirName] = this.controls.dir();
    if (dirName !== "") {
      this.dir = dir; // save only changed dir
      this.isWalking = true;
    } else {
      this.isWalking = false;
    }
    this.pos.x += dir.x * this.speed * dt;

    if (this.isWalking) {
      // TODO: should end the animation? In this case we need animation state manager, but we don't have one
      this.assets.walkAnim.update(dt);
    }
    this.assets.shootAnim.update(dt);
  }

  private spawnRock(): void {
    am.sfx.throw.play();
    this.game.rocks.push(
      new Rock(this.id, this.pos.clone(), Vector2.down(), this.rockSpeed)
    );
  }
}
