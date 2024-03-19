import { Injectable } from '@angular/core';
import { ProviderService } from './provider.service';
import { DungeonFactory__factory } from '../../../../generated/abi';
import { GET_CORE_ADDRESSES } from '../../shared/constants/addresses.constant';
import { catchError, from, retry } from 'rxjs';
import { ON_CHAIN_CALL_DELAY, ON_CHAIN_CALL_RETRY } from '../../shared/constants/network.constant';

@Injectable({
  providedIn: 'root'
})
export class DungeonFactoryService {

  constructor(private providerService: ProviderService) { }

  // --- FACTORIES ---

  private createDungeonFactory(chainId: number, account: string = '') {
    return DungeonFactory__factory.connect(
      GET_CORE_ADDRESSES(chainId).dungeonFactory,
      this.providerService.getProviderForRead(chainId),
    );
  }

  // --- VIEWS ---

  getDungeonTreasuryAmount$(chainId: number, tokenAdr: string, heroLvl: number, biome: number)  {
    return from(this.createDungeonFactory(chainId).getDungeonTreasuryAmount(tokenAdr, heroLvl, biome)).pipe(
      retry({ count: ON_CHAIN_CALL_RETRY, delay: ON_CHAIN_CALL_DELAY }),
      catchError(err => {
        console.log(err)
        return err;
      }),
    );
  }
}
