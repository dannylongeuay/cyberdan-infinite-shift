import { ENEMY_SIZE, ENTITY_SHAPES } from "./types";
import type { Vec2, ShapeKind } from "./types";

export class Enemy {
  pos: Vec2;
  vel: Vec2;
  angle: number;
  shape: ShapeKind;
  size: number = ENEMY_SIZE;

  constructor(x: number, y: number, vx: number, vy: number) {
    this.pos = { x, y };
    this.vel = { x: vx, y: vy };
    this.angle = Math.atan2(vy, vx);
    this.shape = ENTITY_SHAPES[Math.floor(Math.random() * ENTITY_SHAPES.length)];
  }

  update(dt: number) {
    this.pos.x += this.vel.x * dt;
    this.pos.y += this.vel.y * dt;
  }

  isOffScreen(width: number, height: number): boolean {
    const margin = this.size * 2;
    return (
      this.pos.x < -margin ||
      this.pos.x > width + margin ||
      this.pos.y < -margin ||
      this.pos.y > height + margin
    );
  }
}
