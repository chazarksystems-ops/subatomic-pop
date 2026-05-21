import { Particle } from '../models/particle';
import { RunState } from '../models/state';

export function calculateForces(
  p1: Particle,
  p2: Particle,
  runState: RunState
): { fx: number; fy: number } {
  const dx = p2.position.x - p1.position.x;
  const dy = p2.position.y - p1.position.y;
  const distance = Math.sqrt(dx * dx + dy * dy) || 0.001;

  const mods = runState.physicsModifiers;
  let fx = 0;
  let fy = 0;

  // Strong Nuclear Force
  if (
    (p1.charge === 'proton' && p2.charge === 'neutron') ||
    (p1.charge === 'neutron' && p2.charge === 'proton')
  ) {
    const strength = (mods.strongForceMultiplier ?? 1) * 120;
    const force = strength / (distance * distance);
    fx += (dx / distance) * force;
    fy += (dy / distance) * force;
  }

  // Electromagnetic Repulsion
  if (p1.charge === 'proton' && p2.charge === 'proton') {
    const strength = (mods.electromagneticMultiplier ?? 1) * 80;
    const force = strength / (distance * distance);
    fx -= (dx / distance) * force;
    fy -= (dy / distance) * force;
  }

  // Core Repulsion
  if (distance < 12) {
    const strength = (mods.coreRepulsionMultiplier ?? 1) * 300;
    const force = strength / (distance * distance);
    fx -= (dx / distance) * force;
    fy -= (dy / distance) * force;
  }

  return { fx, fy };
}

export function applyShockwave(
  particles: Particle[],
  center: { x: number; y: number },
  baseStrength: number,
  runState: RunState
): Particle[] {
  const strengthMultiplier = runState.physicsModifiers.shockwaveStrengthMultiplier ?? 1;
  const finalStrength = baseStrength * strengthMultiplier;

  return particles.map(particle => {
    const dx = particle.position.x - center.x;
    const dy = particle.position.y - center.y;
    const dist = Math.sqrt(dx * dx + dy * dy) || 0.001;
    const impulse = finalStrength / (dist * dist + 1);

    return {
      ...particle,
      velocity: {
        x: particle.velocity.x + (dx / dist) * impulse,
        y: particle.velocity.y + (dy / dist) * impulse,
      },
    };
  });
}