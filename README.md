# Alpha Pop - TypeScript Skeleton

This is a clean TypeScript project skeleton based on the redesigned architecture for Alpha Pop.

## Structure

- `src/models/` — Core data models (Particle, AlphaCluster, State, Upgrades)
- `src/systems/` — Game systems (Physics, Upgrade handling)
- `src/game.ts` — High-level game state and loop logic
- `src/index.ts` — Entry point

## How to Run

```bash
npm install
npm run dev
```

## Current State

This skeleton includes:
- Branded ID types
- Particle and AlphaCluster models with validation
- Explicit GamePhase + RunState
- Upgrade system with physics modifiers
- Basic game loop structure

This is intended as a foundation for further development.