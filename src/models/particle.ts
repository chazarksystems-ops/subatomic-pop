import { ParticleId, createParticleId } from './ids';

export type ParticleCharge = 'proton' | 'neutron';

export interface Particle {
  readonly id: ParticleId;
  readonly charge: ParticleCharge;
  position: { x: number; y: number };
  velocity: { x: number; y: number };
  readonly radius: number;
  readonly mass: number;
}

export interface CreateParticleParams {
  id: number;
  charge: ParticleCharge;
  x: number;
  y: number;
  vx?: number;
  vy?: number;
  radius?: number;
  mass?: number;
}

export function createParticle(params: CreateParticleParams): Particle {
  return {
    id: createParticleId(params.id),
    charge: params.charge,
    position: { x: params.x, y: params.y },
    velocity: { x: params.vx ?? 0, y: params.vy ?? 0 },
    radius: params.radius ?? 5,
    mass: params.mass ?? (params.charge === 'proton' ? 1.007 : 1.008),
  };
}