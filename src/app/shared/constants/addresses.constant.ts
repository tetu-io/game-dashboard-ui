/* eslint-disable */

import { CoreAddressesModel } from '../../models/core-addresses.model';
import { SONIC_CORE } from './sonic.constants';
import { FANTOM_CORE } from './fantom.constant';
import { REAL_CORE } from './real.constants';

export const ADDRESS_ZERO = '0x0000000000000000000000000000000000000000';

export type TokenInfo = {
  symbol: string;
  decimals: number;
};

const ADDRESSES_CORE_MAP = new Map<number, CoreAddressesModel>([
  [64165, SONIC_CORE],
  [250, FANTOM_CORE],
  [111188, REAL_CORE]
]);


export const GET_CORE_ADDRESSES = (chainId: number) => {
  const core = ADDRESSES_CORE_MAP.get(chainId);

  if (!core) {
    throw Error('No config for ' + chainId);
  }

  return core;
};



