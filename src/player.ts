import { PLAYER_SPEED, PLAYER_SIZE } from "./types";
import type { Vec2 } from "./types";

export class Player {
  pos: Vec2;
  target: Vec2;
  angle: number = 0;
  size: number = PLAYER_SIZE;
  private speed: number = PLAYER_SPEED;

  constructor(x: number, y: number) {
    this.pos = { x, y };
    this.target = { x, y };
  }

  setTarget(x: number, y: number) {
    this.target = { x, y };
  }

  update(dt: number, width: number, height: number) {
    const dx = this.target.x - this.pos.x;
    const dy = this.target.y - this.pos.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist > 1) {
      this.angle = Math.atan2(dy, dx);
      const step = this.speed * dt;
      if (step >= dist) {
        this.pos.x = this.target.x;
        this.pos.y = this.target.y;
      } else {
        this.pos.x += (dx / dist) * step;
        this.pos.y += (dy / dist) * step;
      }
    }

    // Clamp to screen bounds
    this.pos.x = Math.max(this.size, Math.min(width - this.size, this.pos.x));
    this.pos.y = Math.max(this.size, Math.min(height - this.size, this.pos.y));
  }

  clampToScreen(width: number, height: number) {
    this.pos.x = Math.max(this.size, Math.min(width - this.size, this.pos.x));
    this.pos.y = Math.max(this.size, Math.min(height - this.size, this.pos.y));
    this.target.x = Math.max(this.size, Math.min(width - this.size, this.target.x));
    this.target.y = Math.max(this.size, Math.min(height - this.size, this.target.y));
  }

  reset(x: number, y: number) {
    this.pos = { x, y };
    this.target = { x, y };
    this.angle = 0;
  }
}
