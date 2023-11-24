export const NETWORKS = {
  sepolia: 'sepolia',
  mumbai: 'mumbai',
}

export function isExcitingNetwork(network: string): boolean {
  return Object.values(NETWORKS).includes(network);
}

export const NETWORKS_URLS = new Map<string, string>([
  ['sepolia', 'https://sepolia.sacra.cc'],
  ['mumbai', 'https://mumbai.sacra.cc']
]);