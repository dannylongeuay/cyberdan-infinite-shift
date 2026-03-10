import type { Vec2 } from "./types";

export function checkCollision(
  a: Vec2,
  aRadius: number,
  b: Vec2,
  bRadius: number
): boolean {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  const distSq = dx * dx + dy * dy;
  const radSum = aRadius + bRadius;
  return distSq < radSum * radSum;
}
