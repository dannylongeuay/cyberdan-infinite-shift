import {
  COLOR_BG,
  COLOR_PLAYER,
  COLOR_ENEMY,
  COLOR_OBSTACLE,
  COLOR_OVERLAY,
  COLOR_UI,
  TRIANGLE_BACK,
  TRIANGLE_HALF_WIDTH,
  OBSTACLE_PULSE_SPEED,
  FONT_HUD,
  FONT_TITLE,
  FONT_SCORE,
  FONT_SUBTITLE,
} from "./types";
import type { Player } from "./player";
import type { Enemy } from "./enemy";
import type { Obstacle } from "./obstacle";
import type { ShapeKind } from "./types";

export class Renderer {
  private ctx: CanvasRenderingContext2D;
  private dpr: number;

  constructor(private canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Failed to get 2D rendering context");
    this.ctx = ctx;
    this.dpr = window.devicePixelRatio || 1;
  }

  updateDpr() {
    this.dpr = window.devicePixelRatio || 1;
  }

  /** CSS-pixel width (what the user actually sees). */
  private get cssWidth() {
    return this.canvas.width / this.dpr;
  }

  /** CSS-pixel height (what the user actually sees). */
  private get cssHeight() {
    return this.canvas.height / this.dpr;
  }

  clear() {
    const ctx = this.ctx;
    // Reset transform and fill the full physical canvas
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = COLOR_BG;
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    // Scale so all subsequent drawing is in CSS-pixel coordinates
    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
  }

  drawPlayer(player: Player) {
    const { x, y } = player.pos;
    const ctx = this.ctx;

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(player.angle);
    ctx.fillStyle = COLOR_PLAYER;
    this.drawShape(player.shape, player.size);
    ctx.restore();
  }

  drawEnemy(enemy: Enemy) {
    const { x, y } = enemy.pos;
    const ctx = this.ctx;

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(enemy.angle);
    ctx.fillStyle = COLOR_ENEMY;
    this.drawShape(enemy.shape, enemy.size);
    ctx.restore();
  }

  drawObstacle(obstacle: Obstacle) {
    const { x, y } = obstacle.pos;
    const ctx = this.ctx;

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(obstacle.rotation);

    if (obstacle.phase === "warning") {
      // Pulsing outline
      const pulse = 0.5 + 0.5 * Math.sin(obstacle.elapsed * OBSTACLE_PULSE_SPEED);
      ctx.strokeStyle = COLOR_OBSTACLE;
      ctx.globalAlpha = 0.3 + 0.7 * pulse;
      ctx.lineWidth = 2;
      this.drawShape(obstacle.shape, obstacle.size, "stroke");
      ctx.globalAlpha = 1;
    } else if (obstacle.phase === "active") {
      ctx.fillStyle = COLOR_OBSTACLE;
      this.drawShape(obstacle.shape, obstacle.size);
    }

    ctx.restore();
  }

  drawHUD(score: number) {
    const ctx = this.ctx;
    ctx.fillStyle = COLOR_UI;
    ctx.font = FONT_HUD;
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText(score.toFixed(1), 16, 16);
  }

  drawReadyScreen() {
    const ctx = this.ctx;
    const cx = this.cssWidth / 2;
    const cy = this.cssHeight / 2;

    ctx.fillStyle = COLOR_UI;
    ctx.font = FONT_TITLE;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("INFINITE SHIFT", cx, cy - 40);

    ctx.font = FONT_SUBTITLE;
    ctx.globalAlpha = 0.6;
    ctx.fillText("Click or Tap to Start", cx, cy + 20);
    ctx.globalAlpha = 1;
  }

  drawGameOverScreen(score: number) {
    const ctx = this.ctx;
    const cx = this.cssWidth / 2;
    const cy = this.cssHeight / 2;

    ctx.fillStyle = COLOR_OVERLAY;
    ctx.fillRect(0, 0, this.cssWidth, this.cssHeight);

    ctx.fillStyle = COLOR_UI;
    ctx.font = FONT_TITLE;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("GAME OVER", cx, cy - 50);

    ctx.font = FONT_SCORE;
    ctx.fillText(score.toFixed(1) + "s", cx, cy);

    ctx.font = FONT_SUBTITLE;
    ctx.globalAlpha = 0.6;
    ctx.fillText("Click or Tap to Restart", cx, cy + 50);
    ctx.globalAlpha = 1;
  }

  private drawShape(shape: ShapeKind, size: number, mode: "fill" | "stroke" = "fill") {
    const ctx = this.ctx;
    switch (shape) {
      case "triangle":
        ctx.beginPath();
        ctx.moveTo(size, 0);
        ctx.lineTo(-size * TRIANGLE_BACK, -size * TRIANGLE_HALF_WIDTH);
        ctx.lineTo(-size * TRIANGLE_BACK, size * TRIANGLE_HALF_WIDTH);
        ctx.closePath();
        ctx[mode]();
        break;
      case "circle":
        ctx.beginPath();
        ctx.arc(0, 0, size, 0, Math.PI * 2);
        ctx[mode]();
        break;
      case "square":
        if (mode === "fill") ctx.fillRect(-size, -size, size * 2, size * 2);
        else ctx.strokeRect(-size, -size, size * 2, size * 2);
        break;
      case "hexagon":
        this.drawPolygon(6, size);
        ctx[mode]();
        break;
      case "octagon":
        this.drawPolygon(8, size);
        ctx[mode]();
        break;
    }
  }

  private drawPolygon(sides: number, size: number) {
    const ctx = this.ctx;
    ctx.beginPath();
    for (let i = 0; i < sides; i++) {
      const a = (Math.PI * 2 * i) / sides - Math.PI / 2;
      const px = Math.cos(a) * size;
      const py = Math.sin(a) * size;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
  }
}
