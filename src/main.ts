import "./style.css";
import { Game } from "./game";

const canvas = document.getElementById("game") as HTMLCanvasElement;

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
