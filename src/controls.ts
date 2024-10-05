import { Vector2 } from "@cat_in_the_dark/math";
import { inputs } from "./lib/inputs";
import type { IUpdateable } from "./lib/interfaces/updateable";

type Mapping = {
  left: string;
  right: string;
  up: string;
  down: string;
  fire: string;
};

export type Dirs = "LEFT" | "RIGHT" | "UP" | "DOWN" | "";

export class Controls implements IUpdateable {
  constructor(private mapping: Mapping, public id: string) {}

  dir(): [Vector2, Dirs] {
    if (inputs.isPressed(this.mapping.left, this.id)) {
      return [new Vector2(-1, 0), "LEFT"];
    }
    if (inputs.isPressed(this.mapping.right, this.id)) {
      return [new Vector2(1, 0), "RIGHT"];
    }
    if (inputs.isPressed(this.mapping.up, this.id)) {
      return [new Vector2(0, -1), "UP"];
    }
    if (inputs.isPressed(this.mapping.down, this.id)) {
      return [new Vector2(0, 1), "DOWN"];
    }
    return [new Vector2(0, 0), ""];
  }
  dash() {
    // TODO: it must be CLICK not pressed
    return inputs.isPressed(this.mapping.fire, this.id);
  }

  update(_dt: number) {
    //
  }
}

export function newWasdControls() {
  return new Controls(
    {
      left: "KeyA",
      right: "KeyD",
      up: "KeyW",
      down: "KeyS",
      fire: "KeyE",
    },
    "keyboard"
  );
}

export function newArrowControls() {
  return new Controls(
    {
      left: "ArrowLeft",
      right: "ArrowRight",
      up: "ArrowUp",
      down: "ArrowDown",
      fire: "ShiftRight",
    },
    "keyboard"
  );
}

export function newGampePadControls(id: string) {
  return new Controls(
    {
      left: "ArrowLeft",
      right: "ArrowRight",
      up: "ArrowUp",
      down: "ArrowDown",
      fire: "Fire",
    },
    id
  );
}

export function isArrows(keys: Set<string>) {
  return (
    keys.has("ArrowLeft") ||
    keys.has("ArrowRight") ||
    keys.has("ArrowUp") ||
    keys.has("ArrowDown") ||
    keys.has("ShiftRight")
  );
}

export function isWASD(keys: Set<string>) {
  return (
    keys.has("KeyA") ||
    keys.has("KeyS") ||
    keys.has("KeyD") ||
    keys.has("KeyW") ||
    keys.has("KeyE")
  );
}
