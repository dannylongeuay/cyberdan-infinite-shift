import "./style.css";
import { Game } from "./game";

const el = document.querySelector<HTMLCanvasElement>("#game");
if (!el) throw new Error("Canvas element #game not found");
const canvas = el;

function resize() {
  const dpr = window.devicePixelRatio || 1;
  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;
}

resize();

const game = new Game(canvas);
game.start();

window.addEventListener("resize", () => {
  resize();
  game.resize(window.innerWidth, window.innerHeight);
});
