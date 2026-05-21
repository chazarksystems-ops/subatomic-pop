import { ClusterId, ParticleId, createClusterId } from './ids';
import { Particle } from './particle';

export interface AlphaCluster {
  readonly id: ClusterId;
  readonly particleIds: readonly ParticleId[];
  readonly center: { x: number; y: number };
  readonly radius: number;
  readonly formedAt: number;
}

function isValidAlphaComposition(particles: Particle[]): boolean {
  if (particles.length !== 4) return false;
  const protonCount = particles.filter(p => p.charge === 'proton').length;
  const neutronCount = particles.filter(p => p.charge === 'neutron').length;
  return protonCount === 2 && neutronCount === 2;
}

export interface CreateClusterParams {
  id: number;
  particles: Particle[];
  center: { x: number; y: number };
  radius?: number;
  formedAt?: number;
}

export function createAlphaCluster(params: CreateClusterParams): AlphaCluster {
  if (!isValidAlphaComposition(params.particles)) {
    throw new Error('AlphaCluster must contain exactly 2 protons and 2 neutrons');
  }

  const particleIds = params.particles.map(p => p.id);

  return {
    id: createClusterId(params.id),
    particleIds,
    center: { ...params.center },
    radius: params.radius ?? 20,
    formedAt: params.formedAt ?? Date.now(),
  };
}