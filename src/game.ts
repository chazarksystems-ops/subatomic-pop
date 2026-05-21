import { RunState, GamePhase } from './models/state';
import { createParticle } from './models/particle';
import { WaveNumber } from './models/ids';
import { applyMetaUpgrades, onWaveComplete, onRunEnd } from './systems/upgrades';
import { runSimulationStep } from './systems/simulation';

export function startNewRun(startingWave: WaveNumber = 1 as WaveNumber): RunState {
  return {
    runId: crypto.randomUUID() as any,
    startedAt: Date.now(),
    currentWave: startingWave,
    score: 0,
    chaos: 0,
    shotsRemaining: 10,
    particles: [],
    activeClusters: [],
    activeRunUpgrades: [],
    activeMetaUpgrades: [],
    physicsModifiers: {
      strongForceMultiplier: 1,
      electromagneticMultiplier: 1,
      coreRepulsionMultiplier: 1,
      shockwaveStrengthMultiplier: 1,
    },
  };
}

export function prepareNextWave(runState: RunState, nextWave: WaveNumber): RunState {
  const afterCleanup = onWaveComplete(runState, runState.currentWave);
  return {
    ...afterCleanup,
    currentWave: nextWave,
    shotsRemaining: 10,
    particles: [],
    activeClusters: [],
  };
}

// Demo: Run a headless simulation
export function runSimulationDemo(steps: number = 120) {
  console.log('\n=== Starting Headless Simulation Demo ===\n');

  let run = startNewRun();

  // Spawn some initial particles
  for (let i = 0; i < 12; i++) {
    const charge = i % 2 === 0 ? 'proton' : 'neutron';
    const p = createParticle({
      id: i,
      charge,
      x: Math.random() * 400,
      y: Math.random() * 400,
      vx: (Math.random() - 0.5) * 40,
      vy: (Math.random() - 0.5) * 40,
    });
    run.particles.push(p);
  }

  console.log(`Initial particles: ${run.particles.length}`);

  for (let step = 0; step < steps; step++) {
    runSimulationStep(run);

    if (step % 30 === 0) {
      console.log(
        `Step ${step}: Particles=${run.particles.length}, Clusters=${run.activeClusters.length}, Score=${run.score}, Chaos=${run.chaos.toFixed(1)}`
      );
    }
  }

  console.log('\n=== Simulation Complete ===');
  console.log(`Final Score: ${run.score}`);
  console.log(`Final Chaos: ${run.chaos}`);
  console.log(`Remaining Particles: ${run.particles.length}`);
}