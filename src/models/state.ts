import { RunId, WaveNumber } from './ids';
import { Particle } from './particle';
import { AlphaCluster } from './cluster';
import { RunUpgrade, MetaUpgrade } from './upgrades';

export type GameOverReason = 'ChaosOverflow' | 'NoShotsRemaining' | 'PlayerQuit';

export type GamePhase =
  | { type: 'MainMenu' }
  | { type: 'RunActive'; run: RunState }
  | { type: 'BetweenWaves'; run: RunState; nextWave: WaveNumber }
  | { type: 'GameOver'; run: RunState; reason: GameOverReason }
  | { type: 'RunComplete'; run: RunState };

export interface PhysicsModifiers {
  strongForceMultiplier: number;
  electromagneticMultiplier: number;
  coreRepulsionMultiplier: number;
  shockwaveStrengthMultiplier: number;
  chaosGainMultiplier?: number;
}

export const DEFAULT_PHYSICS_MODIFIERS: PhysicsModifiers = {
  strongForceMultiplier: 1,
  electromagneticMultiplier: 1,
  coreRepulsionMultiplier: 1,
  shockwaveStrengthMultiplier: 1,
};

export interface RunState {
  readonly runId: RunId;
  readonly startedAt: number;
  currentWave: WaveNumber;
  score: number;
  chaos: number;
  shotsRemaining: number;
  particles: Particle[];
  activeClusters: AlphaCluster[];
  activeRunUpgrades: { upgrade: RunUpgrade; appliedAtWave: WaveNumber }[];
  activeMetaUpgrades: MetaUpgrade[];
  physicsModifiers: PhysicsModifiers;
}