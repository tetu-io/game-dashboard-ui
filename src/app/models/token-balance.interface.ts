export interface TokenBalance {
  address: string;
  fromPool: number;
  fromPoolUsd: number;
  fromDungeon: number;
  earned: number;
  toPool: number;
  toPoolUsd: number;
  fromPawnshop: number;
  toPawnshop: number;
  other: number;
  reinforcement: number;
}