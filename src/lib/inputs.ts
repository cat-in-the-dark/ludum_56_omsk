import type { IUpdateable } from "./interfaces/updateable";

const buttonIsAxisGamepads = new Set([
  "usb gamepad            (Vendor: 0810 Product: e501)",
]);

function gpid(gp: Gamepad) {
  return `${gp.id}_${gp.index}`;
}

class ButtonsMemory {
  private pressedButtons: Map<string, Set<string>> = new Map();
  private justPressed: Map<string, Set<string>> = new Map();
  private justReleased: Map<string, Set<string>> = new Map();

  isDown(code: string, id = "keyboard") {
    return this.pressedButtons.get(id)?.has(code) || false;
  }

  isReleased(code: string, id = "keyboard") {
    return this.justReleased.get(id)?.has(code) || false;
  }

  isPressed(code: string, id = "keyboard") {
    return this.justPressed.get(id)?.has(code) || false;
  }

  connect(src: string) {
    this.pressedButtons.set(src, new Set());
    this.justPressed.set(src, new Set());
    this.justReleased.set(src, new Set());
  }

  disconnect(src: string) {
    this.pressedButtons.delete(src);
    this.justPressed.delete(src);
    this.justReleased.delete(src);
  }

  update(newPressedButtons: Map<string, Set<string>>) {
    // console.log(newPressedButtons, this.pressedButtons);

    for (const [, codes] of this.justPressed) {
      codes.clear();
    }
    for (const [, codes] of this.justReleased) {
      codes.clear();
    }

    for (const [src, codes] of newPressedButtons) {
      for (const code of codes) {
        const wasDown = this.pressedButtons.get(src)?.has(code) ?? false;
        if (!wasDown) {
          this.justPressed.get(src)?.add(code);
        }
      }
    }

    for (const [src, codes] of this.pressedButtons) {
      for (const code of codes) {
        const isDown = newPressedButtons.get(src)?.has(code) ?? false;
        if (!isDown) {
          this.justReleased.get(src)?.add(code);
        }
      }
    }

    this.pressedButtons.clear();
    for (const [src, codes] of newPressedButtons) {
      this.pressedButtons.set(src, new Set(codes));
    }
  }
}

class Inputs implements IUpdateable {
  private pressedButtons: Map<string, Set<string>> = new Map();
  private memory = new ButtonsMemory();

  connect() {
    this.pressedButtons.set("keyboard", new Set());
    this.memory.connect("keyboard");

    window.addEventListener("keyup", (ev) => {
      this.updateKeyboard(ev.code, false);
    });
    window.addEventListener("keydown", (ev) => {
      this.updateKeyboard(ev.code, true);
    });

    window.addEventListener("gamepadconnected", (event) => {
      console.log("A gamepad connected:");
      console.log(event.gamepad);

      const gid = gpid(event.gamepad);
      this.pressedButtons.set(gid, new Set());
      this.memory.connect(gid);
    });

    window.addEventListener("gamepaddisconnected", (event) => {
      console.log("A gamepad disconnected:");
      console.log(event.gamepad);

      const gid = gpid(event.gamepad);
      this.pressedButtons.delete(gid);
      this.memory.disconnect(gid);
    });
  }

  private updateKeyboard(code: string, isPressed: boolean) {
    if (isPressed) {
      this.pressedButtons.get("keyboard")?.add(code);
    } else {
      this.pressedButtons.get("keyboard")?.delete(code);
    }
  }

  isPressed(code: string, id = "keyboard") {
    return this.memory.isPressed(code, id);
  }

  isDown(code: string, id = "keyboard") {
    return this.memory.isDown(code, id);
  }

  isReleased(code: string, id = "keyboard") {
    return this.memory.isReleased(code, id);
  }

  getPressed() {
    return this.pressedButtons;
  }

  anyPressed() {
    for (const src of this.pressedButtons.values()) {
      if (src.size > 0) {
        return true;
      }
    }
    return false;
  }

  private updateGamepad(gp: Gamepad) {
    const gpState = new Map<string, boolean>();
    gpState.set("X", gp.buttons[2]?.pressed || false);
    gpState.set("Y", gp.buttons[3]?.pressed || false);
    gpState.set("B", gp.buttons[1]?.pressed || false);
    gpState.set("A", gp.buttons[0]?.pressed || false);
    gpState.set(
      "Fire",
      gpState.get("X") ||
        gpState.get("Y") ||
        gpState.get("B") ||
        gpState.get("A") ||
        false
    );

    if (buttonIsAxisGamepads.has(gp.id.trim())) {
      gpState.set("ArrowLeft", (gp.axes[0] ?? 0) < -0.5);
      gpState.set("ArrowRight", (gp.axes[0] ?? 0) > 0.5);
      gpState.set("ArrowUp", (gp.axes[1] ?? 0) < -0.5);
      gpState.set("ArrowDown", (gp.axes[1] ?? 0) > 0.5);
    } else {
      gpState.set("ArrowLeft", gp.buttons[14]?.pressed || false);
      gpState.set("ArrowRight", gp.buttons[15]?.pressed || false);
      gpState.set("ArrowUp", gp.buttons[12]?.pressed || false);
      gpState.set("ArrowDown", gp.buttons[13]?.pressed || false);
    }

    const pressed = new Set<string>();
    gpState.forEach((isPressed, code) => {
      if (isPressed) {
        pressed.add(code);
      }
    });
    const gid = gpid(gp);
    this.pressedButtons.set(gid, pressed);
  }

  update(dt: number) {
    if (!document.hasFocus()) {
      this.pressedButtons.forEach((src) => {
        src.clear();
      });
      return;
    }
    const gamepads = navigator.getGamepads();
    gamepads.forEach((gp) => {
      if (gp) {
        this.updateGamepad(gp);
      }
    });

    this.memory.update(this.pressedButtons);
  }

  debug() {
    for (const [sid, values] of this.pressedButtons) {
      if (values.size > 0) {
        console.log(sid, values);
      }
    }
  }
}

export const inputs = new Inputs();
