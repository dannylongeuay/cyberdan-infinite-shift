import { Enemy } from "./enemy";
import { Obstacle } from "./obstacle";
import {
  ENEMY_BASE_SPEED,
  ENEMY_SPEED_GROWTH,
  ENEMY_SPAWN_INTERVAL_START,
  ENEMY_SPAWN_INTERVAL_MIN,
  ENEMY_ANGULAR_SPREAD,
  ENEMY_SPAWN_Y_OFFSET,
  ENEMY_INTERVAL_DECAY,
  OBSTACLE_SPAWN_INTERVAL_START,
  OBSTACLE_SPAWN_INTERVAL_MIN,
  OBSTACLE_SPAWN_MARGIN,
  OBSTACLE_INTERVAL_DECAY,
} from "./types";

export class Spawner {
  private enemyTimer: number = 0;
  private obstacleTimer: number = 0;

  reset() {
    this.enemyTimer = 0;
    this.obstacleTimer = 0;
  }

  update(
    dt: number,
    elapsed: number,
    width: number,
    height: number
  ): { enemies: Enemy[]; obstacles: Obstacle[] } {
    const enemies: Enemy[] = [];
    const obstacles: Obstacle[] = [];

    // Enemy spawning
    const enemyInterval = Math.max(
      ENEMY_SPAWN_INTERVAL_MIN,
      ENEMY_SPAWN_INTERVAL_START - elapsed * ENEMY_INTERVAL_DECAY
    );
    this.enemyTimer += dt;
    if (this.enemyTimer >= enemyInterval) {
      this.enemyTimer -= enemyInterval;
      enemies.push(this.createEnemy(elapsed, width));
    }

    // Obstacle spawning
    const obstacleInterval = Math.max(
      OBSTACLE_SPAWN_INTERVAL_MIN,
      OBSTACLE_SPAWN_INTERVAL_START - elapsed * OBSTACLE_INTERVAL_DECAY
    );
    this.obstacleTimer += dt;
    if (this.obstacleTimer >= obstacleInterval) {
      this.obstacleTimer -= obstacleInterval;
      obstacles.push(this.createObstacle(width, height));
    }

    return { enemies, obstacles };
  }

  private createEnemy(elapsed: number, width: number): Enemy {
    const x = Math.random() * width;
    const speed = ENEMY_BASE_SPEED + ENEMY_SPEED_GROWTH * elapsed;
    const angle = Math.PI / 2 + (Math.random() * 2 - 1) * ENEMY_ANGULAR_SPREAD;
    const vx = Math.cos(angle) * speed;
    const vy = Math.sin(angle) * speed;
    return new Enemy(x, ENEMY_SPAWN_Y_OFFSET, vx, vy);
  }

  private createObstacle(width: number, height: number): Obstacle {
    const x = OBSTACLE_SPAWN_MARGIN + Math.random() * (width - OBSTACLE_SPAWN_MARGIN * 2);
    const y = OBSTACLE_SPAWN_MARGIN + Math.random() * (height - OBSTACLE_SPAWN_MARGIN * 2);
    return new Obstacle(x, y);
  }
}
