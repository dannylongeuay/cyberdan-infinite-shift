import { OBSTACLE_SIZE, OBSTACLE_WARNING_DURATION, OBSTACLE_ACTIVE_DURATION, OBSTACLE_SPIN_SPEED } from "./types";
import type { Vec2, ShapeKind } from "./types";

const OBSTACLE_SHAPES: ShapeKind[] = ["circle", "square", "hexagon", "octagon"];

export type ObstaclePhase = "warning" | "active" | "expired";

export class Obstacle {
  pos: Vec2;
  shape: ShapeKind;
  size: number = OBSTACLE_SIZE;
  phase: ObstaclePhase = "warning";
  elapsed: number = 0;
  rotation: number = 0;

  constructor(x: number, y: number) {
    this.pos = { x, y };
    this.shape = OBSTACLE_SHAPES[Math.floor(Math.random() * OBSTACLE_SHAPES.length)];
  }

  update(dt: number) {
    this.elapsed += dt;

    if (this.elapsed < OBSTACLE_WARNING_DURATION) {
      this.phase = "warning";
    } else if (this.elapsed < OBSTACLE_WARNING_DURATION + OBSTACLE_ACTIVE_DURATION) {
      this.phase = "active";
      this.rotation += OBSTACLE_SPIN_SPEED * dt;
    } else {
      this.phase = "expired";
    }
  }

  get isCollidable(): boolean {
    return this.phase === "active";
  }

  get isExpired(): boolean {
    return this.phase === "expired";
  }
}
