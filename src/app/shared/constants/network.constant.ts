export const NETWORKS = {
  sepolia: 'sepolia',
  mumbai: 'mumbai',
}

export function isExcitingNetwork(network: string): boolean {
  return Object.values(NETWORKS).includes(network);
}