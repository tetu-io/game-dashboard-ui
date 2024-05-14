export interface TokenBalance {
  address: string;
  fromPool: number;
  fromPoolUsd: number;
  fromDungeon: number;
  toPool: number;
  toPoolUsd: number;
  other: number;
}