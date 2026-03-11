import { PLAYER_SPEED, PLAYER_SIZE } from "./types";
import type { Vec2, ShapeKind } from "./types";

export class Player {
  pos: Vec2;
  target: Vec2;
  shape: ShapeKind = "triangle";
  angle: number = 0;
  size: number = PLAYER_SIZE;
  private speed: number = PLAYER_SPEED;

  constructor(x: number, y: number) {
    this.pos = { x, y };
    this.target = { x, y };
  }

  setTarget(x: number, y: number) {
    this.target.x = x;
    this.target.y = y;
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

    this.clampVec(this.pos, width, height);
  }

  clampToScreen(width: number, height: number) {
    this.clampVec(this.pos, width, height);
    this.clampVec(this.target, width, height);
  }

  private clampVec(v: Vec2, width: number, height: number) {
    v.x = Math.max(this.size, Math.min(width - this.size, v.x));
    v.y = Math.max(this.size, Math.min(height - this.size, v.y));
  }

  stop() {
    this.target.x = this.pos.x;
    this.target.y = this.pos.y;
  }

  reset(x: number, y: number) {
    this.pos.x = x;
    this.pos.y = y;
    this.target.x = x;
    this.target.y = y;
    this.angle = 0;
  }
}
