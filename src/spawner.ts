import { Enemy } from "./enemy";
import { Obstacle } from "./obstacle";
import {
  ENEMY_BASE_SPEED,
  ENEMY_SPEED_GROWTH,
  ENEMY_SPAWN_INTERVAL_START,
  ENEMY_SPAWN_INTERVAL_MIN,
  ENEMY_ANGULAR_SPREAD,
  OBSTACLE_SPAWN_INTERVAL_START,
  OBSTACLE_SPAWN_INTERVAL_MIN,
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
    height: number,
    enemies: Enemy[],
    obstacles: Obstacle[]
  ) {
    // Enemy spawning
    const enemyInterval = Math.max(
      ENEMY_SPAWN_INTERVAL_MIN,
      ENEMY_SPAWN_INTERVAL_START - elapsed * 0.06
    );
    this.enemyTimer += dt;
    if (this.enemyTimer >= enemyInterval) {
      this.enemyTimer -= enemyInterval;
      this.spawnEnemy(elapsed, width, enemies);
    }

    // Obstacle spawning
    const obstacleInterval = Math.max(
      OBSTACLE_SPAWN_INTERVAL_MIN,
      OBSTACLE_SPAWN_INTERVAL_START - elapsed * 0.08
    );
    this.obstacleTimer += dt;
    if (this.obstacleTimer >= obstacleInterval) {
      this.obstacleTimer -= obstacleInterval;
      this.spawnObstacle(width, height, obstacles);
    }
  }

  private spawnEnemy(elapsed: number, width: number, enemies: Enemy[]) {
    const x = Math.random() * width;
    const speed = ENEMY_BASE_SPEED + ENEMY_SPEED_GROWTH * elapsed;
    const angle = Math.PI / 2 + (Math.random() * 2 - 1) * ENEMY_ANGULAR_SPREAD;
    const vx = Math.cos(angle) * speed;
    const vy = Math.sin(angle) * speed;
    enemies.push(new Enemy(x, -20, vx, vy));
  }

  private spawnObstacle(width: number, height: number, obstacles: Obstacle[]) {
    const margin = 60;
    const x = margin + Math.random() * (width - margin * 2);
    const y = margin + Math.random() * (height - margin * 2);
    obstacles.push(new Obstacle(x, y));
  }
}
