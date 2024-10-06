import type { IUpdateable } from "./interfaces/updateable";

export interface IScene {
  activate(): void;
  update(dt: number): void;
  draw(): void;
  exit(): void;
}

export class SceneManager implements IUpdateable {
  private current = "";
  private next = "";
  private scenes = new Map<string, IScene>();

  get currentName() {
    return this.current;
  }

  update(dt: number) {
    if (this.current !== this.next) {
      console.log(`Transition from '${this.current}' to '${this.next}'`);
      this.scenes.get(this.current)?.exit();
      this.current = this.next;
      this.scenes.get(this.current)?.activate();
    }

    const sc = this.scenes.get(this.current);
    if (sc) {
      sc.update(dt);
      return true;
    }
    console.error(`[SceneManager.update] unknown scene '${this.current}'`);
    return false;
  }

  draw() {
    const sc = this.scenes.get(this.current);
    if (sc) {
      sc.draw();
      return true;
    }
    return false;
  }

  put(name: string, scene: IScene) {
    this.scenes.set(name, scene);
  }

  set(scene: string) {
    this.next = scene;
  }
}

export const sceneManager = new SceneManager();
