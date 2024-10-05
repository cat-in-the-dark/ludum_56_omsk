import { ctx, Texture } from "@cat_in_the_dark/raylib-wasm";

export type AssetsManager = {
  logo: Texture;
};

export async function loadAssets(): Promise<AssetsManager> {
  const rl = ctx.rl;

  const logo = await rl.loadTexture("logo.png");

  return {
    logo,
  };
}
