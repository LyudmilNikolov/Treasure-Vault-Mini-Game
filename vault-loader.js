import VaultGame from './vault-game.js';

const app = new PIXI.Application({
  width: window.innerWidth,
  height: window.innerHeight,
  autoDensity: true,
  powerPreference: "high-performance",
});

app.renderer.view.style.position = "absolute";
app.renderer.view.style.display = "block";

document.body.appendChild(app.view);

function resize() {
  const width = window.innerWidth;
  const height = window.innerHeight;

  app.renderer.resize(width, height);
  app.view.width = width;
  app.view.height = height;
}

window.addEventListener('resize', resize);

const loader = new PIXI.Loader();

PIXI.Loader.shared.add([
  'assets/bg.png',
  'assets/blink.png',
  'assets/door.png',
  'assets/doorOpen.png',
  'assets/doorOpenShadow.png',
  'assets/handle.png',
  'assets/handleShadow.png',
]).load(setup);

function setup() {
  const vaultGame = new VaultGame(app);

  app.stage.addChild(vaultGame);
}