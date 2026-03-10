export interface Vec2 {
  x: number;
  y: number;
}

export type ShapeKind = "circle" | "square" | "hexagon" | "octagon";

// Player
export const PLAYER_SPEED = 250; // px/s
export const PLAYER_SIZE = 14; // bounding radius

// Enemy
export const ENEMY_BASE_SPEED = 120; // px/s
export const ENEMY_SPEED_GROWTH = 3; // extra px/s per second survived
export const ENEMY_SIZE = 14;
export const ENEMY_SPAWN_INTERVAL_START = 2.0; // seconds
export const ENEMY_SPAWN_INTERVAL_MIN = 0.3;
export const ENEMY_ANGULAR_SPREAD = 0.3; // radians off center

// Obstacle
export const OBSTACLE_SIZE = 24;
export const OBSTACLE_WARNING_DURATION = 1.0; // seconds
export const OBSTACLE_ACTIVE_DURATION = 2.5;
export const OBSTACLE_SPIN_SPEED = 2.0; // radians/s
export const OBSTACLE_SPAWN_INTERVAL_START = 5.0;
export const OBSTACLE_SPAWN_INTERVAL_MIN = 1.0;

// Colors
export const COLOR_BG = "#111111";
export const COLOR_PLAYER = "#44aaff";
export const COLOR_ENEMY = "#ff8844";
export const COLOR_OBSTACLE = "#ff4444";
export const COLOR_UI = "#ffffff";

// Misc
export const MAX_DT = 0.1; // cap delta time to handle tab-away
