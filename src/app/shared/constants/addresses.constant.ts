/* eslint-disable */

import { CoreAddressesModel } from '../../models/core-addresses.model';
import { SONIC_CORE } from './sonic.constants';

export const ADDRESS_ZERO = '0x0000000000000000000000000000000000000000';

export type TokenInfo = {
  symbol: string;
  decimals: number;
};

const ADDRESSES_CORE_MAP = new Map<number, CoreAddressesModel>([[64165, SONIC_CORE]]);


export const GET_CORE_ADDRESSES = (chainId: number) => {
  const core = ADDRESSES_CORE_MAP.get(chainId);

  if (!core) {
    throw Error('No config for ' + chainId);
  }

  return core;
};



