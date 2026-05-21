import { RunState } from './state';

export type UpgradeRarity = 'common' | 'rare' | 'epic' | 'legendary';
export type UpgradeCategory = 'Core' | 'Playstyle' | 'Volatile';

export interface BaseUpgrade {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly rarity: UpgradeRarity;
}

export interface RunUpgrade extends BaseUpgrade {
  readonly type: 'run';
  readonly duration: 'wave' | 'run';
  readonly category: UpgradeCategory;
  apply(runState: RunState): RunState;
  remove?(runState: RunState): RunState;
}

export interface MetaUpgrade extends BaseUpgrade {
  readonly type: 'meta';
  readonly maxLevel: number;
  applyToRun(runState: RunState, level: number): RunState;
}

export interface UpgradeChoice {
  options: [RunUpgrade, RunUpgrade, RunUpgrade];
  chosen?: RunUpgrade;
}