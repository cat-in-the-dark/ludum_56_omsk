import { Vector2 } from '@cat_in_the_dark/math';
import { ctx, Texture } from '@cat_in_the_dark/raylib-wasm';
import { Raylib } from '@cat_in_the_dark/raylib-wasm';

function update(state: { logo: Texture; }) {
  const rl = ctx.rl;

  rl.drawing(() => {
    rl.clearBackground(rl.PINK);
    state.logo.draw(Vector2.zero());
    rl.drawFPS(10, 10);
  });
}

export async function main(rl: Raylib) {
  rl.initWindow(320, 240, 'Hello');
  rl.setTargetFPS(60);

  const logo = await rl.loadTexture('logo.png');

  rl.runLoop(() => update({ logo }));
}
