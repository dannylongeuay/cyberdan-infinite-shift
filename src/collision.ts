import { TRIANGLE_BACK, TRIANGLE_HALF_WIDTH } from "./types";
import type { Vec2, ShapeKind } from "./types";

export type Collider =
  | { kind: "polygon"; vertices: Vec2[] }
  | { kind: "circle"; center: Vec2; radius: number };

/** Build a world-space collider matching the rendered shape exactly. */
export function getCollider(
  pos: Vec2,
  angle: number,
  size: number,
  shape: ShapeKind
): Collider {
  if (shape === "circle") {
    return { kind: "circle", center: pos, radius: size };
  }

  const local = localVertices(shape, size);
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  const vertices: Vec2[] = local.map((v) => ({
    x: pos.x + v.x * cos - v.y * sin,
    y: pos.y + v.x * sin + v.y * cos,
  }));
  return { kind: "polygon", vertices };
}

function localVertices(shape: Exclude<ShapeKind, "circle">, size: number): Vec2[] {
  switch (shape) {
    case "triangle":
      // Matches renderer.ts drawPlayer (lines 67-69)
      return [
        { x: size, y: 0 },
        { x: -size * TRIANGLE_BACK, y: -size * TRIANGLE_HALF_WIDTH },
        { x: -size * TRIANGLE_BACK, y: size * TRIANGLE_HALF_WIDTH },
      ];
    case "square":
      // Matches renderer.ts fillRect(-size, -size, size*2, size*2) (line 170)
      return [
        { x: -size, y: -size },
        { x: size, y: -size },
        { x: size, y: size },
        { x: -size, y: size },
      ];
    case "hexagon":
      return regularPolygon(6, size);
    case "octagon":
      return regularPolygon(8, size);
  }
}

/** Matches renderer.ts drawPolygon (lines 187-193). */
function regularPolygon(sides: number, size: number): Vec2[] {
  const verts: Vec2[] = [];
  for (let i = 0; i < sides; i++) {
    const a = (Math.PI * 2 * i) / sides - Math.PI / 2;
    verts.push({ x: Math.cos(a) * size, y: Math.sin(a) * size });
  }
  return verts;
}

// --- SAT collision detection ---

export function checkCollision(a: Collider, b: Collider): boolean {
  if (a.kind === "circle" && b.kind === "circle") return circleCircle(a, b);
  if (a.kind === "circle" && b.kind === "polygon") return circlePolygon(a, b.vertices);
  if (a.kind === "polygon" && b.kind === "circle") return circlePolygon(b, a.vertices);
  if (a.kind === "polygon" && b.kind === "polygon") return polygonPolygon(a.vertices, b.vertices);
  return false;
}

function circleCircle(
  a: { center: Vec2; radius: number },
  b: { center: Vec2; radius: number }
): boolean {
  const dx = a.center.x - b.center.x;
  const dy = a.center.y - b.center.y;
  const distSq = dx * dx + dy * dy;
  const radSum = a.radius + b.radius;
  return distSq < radSum * radSum;
}

function polygonPolygon(a: Vec2[], b: Vec2[]): boolean {
  return !hasSeparatingAxis(a, b) && !hasSeparatingAxis(b, a);
}

/** Returns true if any edge normal of `a` separates it from `b`. */
function hasSeparatingAxis(a: Vec2[], b: Vec2[]): boolean {
  for (let i = 0; i < a.length; i++) {
    const j = (i + 1) % a.length;
    // Edge normal (perpendicular to edge, unnormalized is fine for poly-poly)
    const nx = a[j].y - a[i].y;
    const ny = a[i].x - a[j].x;
    const [minA, maxA] = project(a, nx, ny);
    const [minB, maxB] = project(b, nx, ny);
    if (maxA <= minB || maxB <= minA) return true;
  }
  return false;
}

function circlePolygon(
  circle: { center: Vec2; radius: number },
  polygon: Vec2[]
): boolean {
  // Test each polygon edge normal
  for (let i = 0; i < polygon.length; i++) {
    const j = (i + 1) % polygon.length;
    const nx = polygon[j].y - polygon[i].y;
    const ny = polygon[i].x - polygon[j].x;
    const len = Math.sqrt(nx * nx + ny * ny);
    if (len === 0) continue;
    const ux = nx / len;
    const uy = ny / len;
    const [minP, maxP] = project(polygon, ux, uy);
    const cProj = circle.center.x * ux + circle.center.y * uy;
    const minC = cProj - circle.radius;
    const maxC = cProj + circle.radius;
    if (maxP <= minC || maxC <= minP) return false;
  }

  // Test axis from circle center to nearest polygon vertex
  let nearestDistSq = Infinity;
  let nearest = polygon[0];
  for (const v of polygon) {
    const dx = v.x - circle.center.x;
    const dy = v.y - circle.center.y;
    const dSq = dx * dx + dy * dy;
    if (dSq < nearestDistSq) {
      nearestDistSq = dSq;
      nearest = v;
    }
  }
  const ax = nearest.x - circle.center.x;
  const ay = nearest.y - circle.center.y;
  const aLen = Math.sqrt(ax * ax + ay * ay);
  if (aLen > 0) {
    const ux = ax / aLen;
    const uy = ay / aLen;
    const [minP, maxP] = project(polygon, ux, uy);
    const cProj = circle.center.x * ux + circle.center.y * uy;
    const minC = cProj - circle.radius;
    const maxC = cProj + circle.radius;
    if (maxP <= minC || maxC <= minP) return false;
  }

  return true;
}

function project(verts: Vec2[], nx: number, ny: number): [number, number] {
  let min = verts[0].x * nx + verts[0].y * ny;
  let max = min;
  for (let i = 1; i < verts.length; i++) {
    const d = verts[i].x * nx + verts[i].y * ny;
    if (d < min) min = d;
    if (d > max) max = d;
  }
  return [min, max];
}
