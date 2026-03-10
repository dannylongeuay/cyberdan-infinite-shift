export interface Vec2 {
  x: number;
  y: number;
}

export type ShapeKind = "circle" | "square" | "hexagon" | "octagon";
export const ENTITY_SHAPES: ShapeKind[] = ["circle", "square", "hexagon", "octagon"];

// Player
export const PLAYER_SIZE = 14; // bounding radius
export const PLAYER_SPAWN_Y_RATIO = 0.75; // fraction of screen height
export const PLAYER_SPEED = 250; // px/s
export const PLAYER_TRIANGLE_BACK = 0.7; // rear point ratio
export const PLAYER_TRIANGLE_HALF_WIDTH = 0.6; // half-width ratio

// Enemy
export const ENEMY_ANGULAR_SPREAD = 0.3; // radians off center
export const ENEMY_BASE_SPEED = 120; // px/s
export const ENEMY_INTERVAL_DECAY = 0.06; // interval reduction per second survived
export const ENEMY_SIZE = 14;
export const ENEMY_SPAWN_INTERVAL_MIN = 0.3;
export const ENEMY_SPAWN_INTERVAL_START = 2.0; // seconds
export const ENEMY_SPAWN_Y_OFFSET = -20; // px above top edge
export const ENEMY_SPEED_GROWTH = 3; // extra px/s per second survived

// Obstacle
export const OBSTACLE_ACTIVE_DURATION = 2.5;
export const OBSTACLE_INTERVAL_DECAY = 0.08;
export const OBSTACLE_PULSE_SPEED = 8; // radians/s for warning pulse
export const OBSTACLE_SIZE = 24;
export const OBSTACLE_SPAWN_INTERVAL_MIN = 1.0;
export const OBSTACLE_SPAWN_INTERVAL_START = 5.0;
export const OBSTACLE_SPAWN_MARGIN = 60; // px inset from screen edges
export const OBSTACLE_SPIN_SPEED = 2.0; // radians/s
export const OBSTACLE_WARNING_DURATION = 1.0; // seconds

// Colors
export const COLOR_BG = "#111111";
export const COLOR_ENEMY = "#ff8844";
export const COLOR_OBSTACLE = "#ff4444";
export const COLOR_OVERLAY = "rgba(0, 0, 0, 0.6)";
export const COLOR_PLAYER = "#44aaff";
export const COLOR_UI = "#ffffff";

// Fonts
export const FONT_HUD = "bold 24px monospace";
export const FONT_SCORE = "bold 28px monospace";
export const FONT_SUBTITLE = "20px monospace";
export const FONT_TITLE = "bold 36px monospace";

// Entity caps
export const MAX_ENEMIES = 100;
export const MAX_OBSTACLES = 20;

// Misc
export const MAX_DT = 0.1; // cap delta time to handle tab-away
