import { FANTOM_POOLS, FANTOM_SKIP_ADDRESSES } from './fantom.constant';

export const NETWORKS = {
  // sepolia: 'sepolia',
  // mumbai: 'mumbai',
  sonic: 'sonic',
  fantom: 'fantom',
}

export function defaultNetwork(): string {
  return NETWORKS.fantom;
}

export function isExcitingNetwork(network: string): boolean {
  return Object.values(NETWORKS).includes(network);
}

export function getRpcUrl(chainId: number): string {
  return RPC_URLS.get(chainId) || '';
}

export function getChainId(network: string): number {
  return CHAIN_ID.get(network) || 0;
}

export function getPools(network: string): string[] {
  if (network === 'fantom') {
    return FANTOM_POOLS;
  }
  return [];
}

export function getSkipAddresses(network: string): string[] {
  if (network === 'fantom') {
    return FANTOM_SKIP_ADDRESSES;
  }
  return [];
}

export const CHAIN_ID = new Map<string, number>([
  ['sonic', 64165],
  ['fantom', 250],
]);

export const NETWORKS_URLS = new Map<string, string>([
  ['sepolia', 'https://sepolia.sacra.cc'],
  ['mumbai', 'https://mumbai.sacra.cc'],
  ['sonic', 'https://sonic-beta.sacra.game'],
  ['fantom', 'https://fantom.sacra.game']
]);

export const RPC_URLS = new Map<number, string>([
  [64165, 'https://rpc.sonic.fantom.network/'],
  [250, 'https://rpc.ftm.tools/'],
]);

export const ON_CHAIN_CALL_RETRY = 3;
export const ON_CHAIN_CALL_DELAY = 3000;