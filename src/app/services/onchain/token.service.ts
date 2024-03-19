import { Injectable } from '@angular/core';
import { ProviderService } from './provider.service';
import { GameToken__factory } from '../../../../generated/abi';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor(
    private providerService: ProviderService,
  ) { }

  // --- FACTORIES ---

  createERC20(token: string, account: string = '') {
    return GameToken__factory.connect(token, this.providerService.getProviderForRead());
  }


}
