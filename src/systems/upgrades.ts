import { RunState } from '../models/state';
import { RunUpgrade, MetaUpgrade, UpgradeChoice } from '../models/upgrades';
import { WaveNumber } from '../models/ids';

export const DEFAULT_PHYSICS_MODIFIERS = {
  strongForceMultiplier: 1,
  electromagneticMultiplier: 1,
  coreRepulsionMultiplier: 1,
  shockwaveStrengthMultiplier: 1,
};

export function applyRunUpgrade(
  runState: RunState,
  upgrade: RunUpgrade,
  currentWave: WaveNumber
): RunState {
  if (runState.activeRunUpgrades.some(u => u.upgrade.id === upgrade.id)) {
    return runState;
  }

  const newState = upgrade.apply(runState);

  return {
    ...newState,
    activeRunUpgrades: [
      ...newState.activeRunUpgrades,
      { upgrade, appliedAtWave: currentWave },
    ],
  };
}

export function onWaveComplete(runState: RunState, currentWave: WaveNumber): RunState {
  let newState = { ...runState };

  const toRemove = newState.activeRunUpgrades.filter(
    active => active.upgrade.duration === 'wave'
  );

  for (const active of toRemove) {
    if (active.upgrade.remove) {
      newState = active.upgrade.remove(newState);
    }
  }

  newState.activeRunUpgrades = newState.activeRunUpgrades.filter(
    active => active.upgrade.duration !== 'wave'
  );

  return newState;
}

export function onRunEnd(runState: RunState): RunState {
  let newState = { ...runState };

  for (const active of newState.activeRunUpgrades) {
    if (active.upgrade.remove) {
      newState = active.upgrade.remove(newState);
    }
  }

  return {
    ...newState,
    activeRunUpgrades: [],
    physicsModifiers: DEFAULT_PHYSICS_MODIFIERS,
  };
}

export function applyMetaUpgrades(
  runState: RunState,
  metaUpgrades: MetaUpgrade[]
): RunState {
  return metaUpgrades.reduce((state, upgrade) => {
    const level = 1; // Simplified
    return upgrade.applyToRun(state, level);
  }, runState);
}