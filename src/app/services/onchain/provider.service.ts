import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ethers } from 'ethers';
import { getRpcUrl } from '../../shared/constants/network.constant';

@Injectable({
  providedIn: 'root'
})
export class ProviderService {

  constructor() { }


  getProviderForRead(chainId: number = 0) {
    const provider = new ethers.JsonRpcProvider(getRpcUrl(chainId), chainId, {
      // polling?: boolean;
      // staticNetwork?: null | Network;
      // batchStallTime?: number;
      // batchMaxSize?: number;
      // batchMaxCount?: number;
      // cacheTimeout?: number;
      // pollingInterval?: number;
    });

    return new ethers.JsonRpcSigner(provider, '0x4255bAc2c9dd09056efcA514Bd4D0F4D890110C2');
  }
}
