import { Injectable } from '@angular/core';
import { ProviderService } from './provider.service';
import { AlgebraPool__factory, GameToken__factory } from '../../../../generated/abi';
import { catchError, from, retry } from 'rxjs';
import { ON_CHAIN_CALL_DELAY, ON_CHAIN_CALL_RETRY } from '../../shared/constants/network.constant';

@Injectable({
  providedIn: 'root'
})
export class AlgebraPoolService {

  constructor(
    private providerService: ProviderService,
  ) {
  }

  // --- FACTORIES ---

  createAlgebraPool(token: string, chainId: number) {
    return AlgebraPool__factory.connect(token, this.providerService.getProviderForRead(chainId));
  }

  // --- VIEWS ---

  safelyGetStateOfAMM$(token: string, chainId: number) {
    return from(this.createAlgebraPool(token, chainId).safelyGetStateOfAMM()).pipe(
      retry({ count: ON_CHAIN_CALL_RETRY, delay: ON_CHAIN_CALL_DELAY }),
      catchError(err => {
        console.log(err)
        return err;
      })
    );
  }
}