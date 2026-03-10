import { COLOR_BG, COLOR_PLAYER, COLOR_ENEMY, COLOR_OBSTACLE, COLOR_UI } from "./types";
import type { Player } from "./player";
import type { Enemy } from "./enemy";
import type { Obstacle } from "./obstacle";
import type { ShapeKind } from "./types";

export class Renderer {
  private ctx: CanvasRenderingContext2D;

  constructor(private canvas: HTMLCanvasElement) {
    this.ctx = canvas.getContext("2d")!;
  }

  clear() {
    this.ctx.fillStyle = COLOR_BG;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  drawPlayer(player: Player) {
    const { x, y } = player.pos;
    const size = player.size;
    const angle = player.angle;
    const ctx = this.ctx;

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.beginPath();
    // Triangle: front point at +size, two rear points
    ctx.moveTo(size, 0);
    ctx.lineTo(-size * 0.7, -size * 0.6);
    ctx.lineTo(-size * 0.7, size * 0.6);
    ctx.closePath();
    ctx.fillStyle = COLOR_PLAYER;
    ctx.fill();
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
      const pulse = 0.5 + 0.5 * Math.sin(obstacle.elapsed * 8);
      ctx.strokeStyle = COLOR_OBSTACLE;
      ctx.globalAlpha = 0.3 + 0.7 * pulse;
      ctx.lineWidth = 2;
      this.drawShapeStroke(obstacle.shape, obstacle.size);
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
    ctx.font = "bold 24px monospace";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText(score.toFixed(1), 16, 16);
  }

  drawReadyScreen() {
    const ctx = this.ctx;
    const cx = this.canvas.width / 2;
    const cy = this.canvas.height / 2;

    ctx.fillStyle = COLOR_UI;
    ctx.font = "bold 36px monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("INFINITE SHIFT", cx, cy - 40);

    ctx.font = "20px monospace";
    ctx.globalAlpha = 0.6;
    ctx.fillText("Click or Tap to Start", cx, cy + 20);
    ctx.globalAlpha = 1;
  }

  drawGameOverScreen(score: number) {
    const ctx = this.ctx;
    const cx = this.canvas.width / 2;
    const cy = this.canvas.height / 2;

    ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    ctx.fillStyle = COLOR_UI;
    ctx.font = "bold 36px monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("GAME OVER", cx, cy - 50);

    ctx.font = "bold 28px monospace";
    ctx.fillText(score.toFixed(1) + "s", cx, cy);

    ctx.font = "20px monospace";
    ctx.globalAlpha = 0.6;
    ctx.fillText("Click or Tap to Restart", cx, cy + 50);
    ctx.globalAlpha = 1;
  }

  private drawShape(shape: ShapeKind, size: number) {
    const ctx = this.ctx;
    switch (shape) {
      case "circle":
        ctx.beginPath();
        ctx.arc(0, 0, size, 0, Math.PI * 2);
        ctx.fill();
        break;
      case "square":
        ctx.fillRect(-size, -size, size * 2, size * 2);
        break;
      case "hexagon":
        this.drawPolygon(6, size);
        ctx.fill();
        break;
      case "octagon":
        this.drawPolygon(8, size);
        ctx.fill();
        break;
    }
  }

  private drawShapeStroke(shape: ShapeKind, size: number) {
    const ctx = this.ctx;
    switch (shape) {
      case "circle":
        ctx.beginPath();
        ctx.arc(0, 0, size, 0, Math.PI * 2);
        ctx.stroke();
        break;
      case "square":
        ctx.strokeRect(-size, -size, size * 2, size * 2);
        break;
      case "hexagon":
        this.drawPolygon(6, size);
        ctx.stroke();
        break;
      case "octagon":
        this.drawPolygon(8, size);
        ctx.stroke();
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
