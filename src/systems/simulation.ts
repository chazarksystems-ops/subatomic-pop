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
  const particles = runState.particles;
  const used = new Set<number>();

  for (let i = 0; i < particles.length; i++) {
    if (used.has(i)) continue;

    const closeParticles: Particle[] = [particles[i]];

    for (let j = i + 1; j < particles.length; j++) {
      if (used.has(j)) continue;

      const dx = particles[i].position.x - particles[j].position.x;
      const dy = particles[i].position.y - particles[j].position.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < CLUSTER_FORMATION_DISTANCE) {
        closeParticles.push(particles[j]);
      }
    }

    if (closeParticles.length === 4) {
      try {
        const cluster = createAlphaCluster({
          id: Date.now(),
          particles: closeParticles,
          center: getCenter(closeParticles),
        });

        newClusters.push(cluster);
        closeParticles.forEach((_, idx) => {
          const originalIndex = particles.indexOf(closeParticles[idx]);
          used.add(originalIndex);
        });
      } catch (e) {
        // Not a valid alpha composition, ignore
      }
    }
  }

  // Remove used particles
  runState.particles = particles.filter((_, index) => !used.has(index));
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
    // Simple rule: pop if particles are still close
    const stillClose = cluster.particleIds.every(id => {
      const p = runState.particles.find(p => p.id === id);
      return p !== undefined; // In real version we'd check distances
    });

    if (!stillClose || Math.random() < 0.3) { // Temporary random popping for demo
      toPop.push(cluster);
    }
  }

  for (const cluster of toPop) {
    // Apply shockwave
    runState.particles = applyShockwave(
      runState.particles,
      cluster.center,
      120,
      runState
    );

    // Reward
    runState.score += 100;
    runState.chaos = Math.max(0, runState.chaos - 10);

    // Remove cluster
    runState.activeClusters = runState.activeClusters.filter(c => c.id !== cluster.id);
  }
}

export function runSimulationStep(runState: RunState, deltaTime: number = 0.016): void {
  updateParticles(runState, deltaTime);
  detectAndFormClusters(runState);
  processClusterPops(runState);
}