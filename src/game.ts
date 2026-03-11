import { Player } from "./player";
import { Renderer } from "./renderer";
import { Input } from "./input";
import { Spawner } from "./spawner";
import { checkCollision, getCollider } from "./collision";
import { MAX_DT, MAX_ENEMIES, MAX_OBSTACLES, PLAYER_SPAWN_Y_RATIO } from "./types";
import type { Enemy } from "./enemy";
import type { Obstacle } from "./obstacle";

type GameState = "ready" | "playing" | "gameover";

export class Game {
  private renderer: Renderer;
  private input: Input;
  private spawner: Spawner;
  private player: Player;
  private enemies: Enemy[] = [];
  private obstacles: Obstacle[] = [];
  private state: GameState = "ready";
  private elapsedTime: number = 0;
  private lastTime: number = 0;
  private width: number;
  private height: number;

  constructor(canvas: HTMLCanvasElement) {
    const dpr = window.devicePixelRatio || 1;
    this.width = canvas.width / dpr;
    this.height = canvas.height / dpr;
    this.renderer = new Renderer(canvas);
    this.input = new Input(canvas);
    this.spawner = new Spawner();
    this.player = new Player(this.width / 2, this.height * PLAYER_SPAWN_Y_RATIO);

    this.input.onPress((x, y) => this.handlePress(x, y));
    this.input.onMove((x, y) => this.handleMove(x, y));
    this.input.onRelease(() => this.handleRelease());
  }

  resize(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.renderer.updateDpr();
    this.player.clampToScreen(width, height);
  }

  start() {
    this.lastTime = performance.now();
    this.scheduleFrame();
  }

  destroy() {
    this.input.destroy();
  }

  private scheduleFrame() {
    requestAnimationFrame((t) => this.loop(t));
  }

  private loop(time: number) {
    const rawDt = (time - this.lastTime) / 1000;
    const dt = Math.min(rawDt, MAX_DT);
    this.lastTime = time;

    if (this.state === "playing") {
      this.update(dt);
    }

    this.render();
    this.scheduleFrame();
  }

  private update(dt: number) {
    this.elapsedTime += dt;

    this.player.update(dt, this.width, this.height);

    const spawned = this.spawner.update(dt, this.elapsedTime, this.width, this.height);
    if (this.enemies.length < MAX_ENEMIES) {
      this.enemies.push(...spawned.enemies);
    }
    if (this.obstacles.length < MAX_OBSTACLES) {
      this.obstacles.push(...spawned.obstacles);
    }

    // Update enemies
    for (const enemy of this.enemies) {
      enemy.update(dt);
    }

    // Update obstacles
    for (const obstacle of this.obstacles) {
      obstacle.update(dt);
    }

    // Cleanup off-screen enemies (reverse-iterate to avoid index shifting)
    for (let i = this.enemies.length - 1; i >= 0; i--) {
      if (this.enemies[i].isOffScreen(this.width, this.height)) {
        this.enemies.splice(i, 1);
      }
    }

    // Cleanup expired obstacles
    for (let i = this.obstacles.length - 1; i >= 0; i--) {
      if (this.obstacles[i].isExpired) {
        this.obstacles.splice(i, 1);
      }
    }

    // Collision: player vs enemies
    const playerCollider = getCollider(this.player.pos, this.player.angle, this.player.size, "triangle");

    for (const enemy of this.enemies) {
      const ec = getCollider(enemy.pos, enemy.angle, enemy.size, enemy.shape);
      if (checkCollision(playerCollider, ec)) {
        this.gameOver();
        return;
      }
    }

    // Collision: player vs active obstacles
    for (const obstacle of this.obstacles) {
      if (obstacle.isCollidable) {
        const oc = getCollider(obstacle.pos, obstacle.rotation, obstacle.size, obstacle.shape);
        if (checkCollision(playerCollider, oc)) {
          this.gameOver();
          return;
        }
      }
    }
  }

  private render() {
    this.renderer.clear();

    if (this.state === "ready") {
      this.renderer.drawReadyScreen();
      return;
    }

    // Draw game entities
    for (const obstacle of this.obstacles) {
      this.renderer.drawObstacle(obstacle);
    }
    for (const enemy of this.enemies) {
      this.renderer.drawEnemy(enemy);
    }
    this.renderer.drawPlayer(this.player);
    this.renderer.drawHUD(this.elapsedTime);

    if (this.state === "gameover") {
      this.renderer.drawGameOverScreen(this.elapsedTime);
    }
  }

  private handlePress(x: number, y: number) {
    switch (this.state) {
      case "ready":
        this.state = "playing";
        break;
      case "playing":
        this.player.setTarget(x, y);
        break;
      case "gameover":
        this.restart();
        break;
    }
  }

  private handleMove(x: number, y: number) {
    if (this.state !== "playing") return;
    this.player.setTarget(x, y);
  }

  private handleRelease() {
    if (this.state !== "playing") return;
    if (this.input.hasMoved) {
      this.player.stop();
    }
  }

  private gameOver() {
    this.state = "gameover";
  }

  private restart() {
    this.state = "playing";
    this.elapsedTime = 0;
    this.enemies = [];
    this.obstacles = [];
    this.spawner.reset();
    this.player.reset(this.width / 2, this.height * PLAYER_SPAWN_Y_RATIO);
  }
}
