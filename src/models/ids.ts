// Branded ID types for type safety
export type ParticleId = number & { readonly __brand: 'ParticleId' };
export type ClusterId = number & { readonly __brand: 'ClusterId' };
export type WaveNumber = number & { readonly __brand: 'WaveNumber' };
export type RunId = string & { readonly __brand: 'RunId' };

export function createParticleId(value: number): ParticleId {
  if (!Number.isInteger(value) || value < 0) {
    throw new Error(`Invalid ParticleId: ${value}`);
  }
  return value as ParticleId;
}

export function createClusterId(value: number): ClusterId {
  if (!Number.isInteger(value) || value < 0) {
    throw new Error(`Invalid ClusterId: ${value}`);
  }
  return value as ClusterId;
}

export function createWaveNumber(value: number): WaveNumber {
  if (!Number.isInteger(value) || value < 1) {
    throw new Error(`Invalid WaveNumber: ${value}`);
  }
  return value as WaveNumber;
}