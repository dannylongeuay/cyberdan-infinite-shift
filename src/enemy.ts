import { ENEMY_SIZE } from "./types";
import type { Vec2, ShapeKind } from "./types";

const ENEMY_SHAPES: ShapeKind[] = ["circle", "square", "hexagon", "octagon"];

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
    this.shape = ENEMY_SHAPES[Math.floor(Math.random() * ENEMY_SHAPES.length)];
  }

  update(dt: number) {
    this.pos.x += this.vel.x * dt;
    this.pos.y += this.vel.y * dt;
  }

  isOffScreen(height: number): boolean {
    return this.pos.y > height + this.size * 2;
  }
}
