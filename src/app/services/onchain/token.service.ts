import { Injectable } from '@angular/core';
import { ProviderService } from './provider.service';
import { GameToken__factory } from '../../../../generated/abi';
import { catchError, from, map, Observable, retry } from 'rxjs';
import { ON_CHAIN_CALL_DELAY, ON_CHAIN_CALL_RETRY } from '../../shared/constants/network.constant';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor(
    private providerService: ProviderService,
  ) { }

  // --- FACTORIES ---

  createERC20(token: string, chainId: number, account: string = '') {
    return GameToken__factory.connect(token, this.providerService.getProviderForRead(chainId));
  }


  totalSupply$(token: string, chainId: number, block: string | number = 'latest', account: string = '') {
    return from(this.createERC20(token, chainId, account).totalSupply({blockTag: block})).pipe(
      retry({ count: ON_CHAIN_CALL_RETRY, delay: ON_CHAIN_CALL_DELAY }),
      catchError(err => {
        console.log(err)
        return err;
      })
    );
  }

  balanceOf$(token: string, chainId: number, block: string | number = 'latest', account: string = ''): Observable<bigint> {
    return from(this.createERC20(token, chainId, account).balanceOf(account, {blockTag: block})).pipe(
      retry({ count: ON_CHAIN_CALL_RETRY, delay: ON_CHAIN_CALL_DELAY }),
    );
  }

}
