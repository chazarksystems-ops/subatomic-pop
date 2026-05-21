import { Particle } from '../models/particle';
import { AlphaCluster } from '../models/cluster';
import { RunState } from '../models/state';
import { calculateForces, applyShockwave } from './physics';
import { createAlphaCluster } from '../models/cluster';
import { createClusterId } from '../models/ids';

const CLUSTER_FORMATION_DISTANCE = 25;
const POP_DISTANCE = 18;

export function updateParticles(runState: RunState, deltaTime: number): void {
  const particles = runState.particles;

  for (let i = 0; i < particles.length; i++) {
    let fx = 0;
    let fy = 0;

    for (let j = 0; j < particles.length; j++) {
      if (i === j) continue;
      const force = calculateForces(particles[i], particles[j], runState);
      fx += force.fx;
      fy += force.fy;
    }

    // Simple Euler integration
    particles[i].velocity.x += fx * deltaTime;
    particles[i].velocity.y += fy * deltaTime;

    particles[i].position.x += particles[i].velocity.x * deltaTime;
    particles[i].position.y += particles[i].velocity.y * deltaTime;

    // Very basic damping
    particles[i].velocity.x *= 0.995;
    particles[i].velocity.y *= 0.995;
  }
}

export function detectAndFormClusters(runState: RunState): AlphaCluster[] {
  const newClusters: AlphaCluster[] = [];
  const particles = [...runState.particles]; // work on copy
  const usedIndices = new Set<number>();

  for (let i = 0; i < particles.length; i++) {
    if (usedIndices.has(i)) continue;

    const group: Particle[] = [particles[i]];

    for (let j = i + 1; j < particles.length; j++) {
      if (usedIndices.has(j)) continue;

      const dx = particles[i].position.x - particles[j].position.x;
      const dy = particles[i].position.y - particles[j].position.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < CLUSTER_FORMATION_DISTANCE) {
        group.push(particles[j]);
      }
    }

    // Check if we have exactly 4 particles and they form a valid alpha (2p + 2n)
    if (group.length >= 4) {
      // Take first 4 for simplicity in demo
      const candidate = group.slice(0, 4);

      try {
        const cluster = createAlphaCluster({
          id: Date.now() + i,
          particles: candidate,
          center: getCenter(candidate),
        });

        newClusters.push(cluster);
        // Mark these 4 as used
        candidate.forEach(p => {
          const idx = particles.findIndex(pp => pp.id === p.id);
          if (idx !== -1) usedIndices.add(idx);
        });
      } catch (e) {
        // Not a valid alpha composition, skip
      }
    }
  }

  // Remove used particles from state
  runState.particles = particles.filter((_, index) => !usedIndices.has(index));
  runState.activeClusters.push(...newClusters);

  return newClusters;
}

function getCenter(particles: Particle[]): { x: number; y: number } {
  const sumX = particles.reduce((sum, p) => sum + p.position.x, 0);
  const sumY = particles.reduce((sum, p) => sum + p.position.y, 0);
  return {
    x: sumX / particles.length,
    y: sumY / particles.length,
  };
}

export function processClusterPops(runState: RunState): void {
  const toPop: AlphaCluster[] = [];

  for (const cluster of runState.activeClusters) {
    // Pop with increasing probability over time or randomly for demo
    if (Math.random() < 0.25) {
      toPop.push(cluster);
    }
  }

  for (const cluster of toPop) {
    // Apply shockwave to remaining particles
    runState.particles = applyShockwave(
      runState.particles,
      cluster.center,
      140,
      runState
    );

    // Score and chaos update
    runState.score += 150;
    runState.chaos = Math.max(0, runState.chaos - 15);

    // Remove the cluster
    runState.activeClusters = runState.activeClusters.filter(c => c.id !== cluster.id);
  }
}

export function runSimulationStep(runState: RunState, deltaTime: number = 0.016): void {
  updateParticles(runState, deltaTime);
  detectAndFormClusters(runState);
  processClusterPops(runState);
}