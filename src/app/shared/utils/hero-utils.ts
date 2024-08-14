export function isTrialHero(heroCLass: number): boolean {
  return heroCLass === 5 || heroCLass === 6;
}

export function genObjectId(biome: number, subType: number, id: number) {
  return biome * 1_000_000 + subType * 10_000 + id;
}