# Infinite Shift

A top-down dodging game built from scratch with HTML5 Canvas and TypeScript. No frameworks, no game engines — just the browser.

## Gameplay

Survive as long as possible by dodging enemies and obstacles. Your score is how many seconds you stay alive.

- **Enemies** (orange shapes) rain down from the top of the screen, getting faster and more frequent over time
- **Obstacles** (red shapes) spawn at random positions on the field — a pulsing outline warns you before they become solid and deadly
- **You** (blue triangle) move toward wherever you click or tap

Click or tap anywhere to start. Click or tap again to move. That's it.

## Controls

| Input | Action |
|---|---|
| Mouse click | Move player toward cursor |
| Touch / tap | Move player toward touch point |

## Tech Stack

- **HTML5 Canvas** — all rendering
- **TypeScript** — game logic
- **Vite** — dev server and bundler
- **Bun** — package manager and runtime

Zero runtime dependencies.

## Getting Started

### Prerequisites

Either:
- [Bun](https://bun.sh) installed globally, **or**
- [Nix](https://nixos.org) with flakes enabled (the repo includes a `flake.nix` that provides Bun)

### Install and run

```sh
bun install
bun run dev
```

### Build for production

```sh
bun run build    # type-check + bundle into dist/
bun run preview  # serve the production build locally
```

## Project Structure

```
src/
  main.ts        Entry point — sets up canvas, handles resize
  game.ts        Game loop, state machine (ready/playing/gameover)
  player.ts      Player movement and clamping
  enemy.ts       Enemy entity (position, velocity, shape)
  obstacle.ts    Obstacle entity (warning → active → expired lifecycle)
  spawner.ts     Spawn timing and difficulty scaling
  collision.ts   Circle-based collision detection
  renderer.ts    All Canvas 2D drawing (entities, HUD, screens)
  input.ts       Mouse and touch input handling
  types.ts       Shared types, constants, and tuning values
  style.css      Minimal page styles
public/
  favicon.svg    Site icon
```
