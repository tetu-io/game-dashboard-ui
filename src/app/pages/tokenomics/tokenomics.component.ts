import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { DestroyService } from '../../services/destroy.service';
import { SubgraphService } from '../../services/subgraph.service';
import { DungeonFactoryService } from '../../services/onchain/dungeon-factory.service';
import { GET_CORE_ADDRESSES } from '../../shared/constants/addresses.constant';
import { getChainId } from '../../shared/constants/network.constant';
import { forkJoin, takeUntil } from 'rxjs';
import { formatUnits, parseUnits } from 'ethers';
import { Formatter } from '../../shared/utils/formatter';

@Component({
  selector: 'app-tokenomics',
  templateUrl: './tokenomics.component.html',
  styleUrls: ['./tokenomics.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TokenomicsComponent implements OnInit {

  symbol = '';
  totalSupply = '0';
  users = 0;
  rewardFirstBiome = 0;
  rewardSecondBiome = 0;
  rewardThirdBiome = 0;
  rewardFourthBiome = 0;
  totalUsersEarned = '0';
  spentOnItems = '0';
  spentOnHeroes = '0';

  network = '';
  chainId = 0;
  isLoading = false;

  constructor(
    private destroy$: DestroyService,
    private changeDetectorRef: ChangeDetectorRef,
    private subgraphService: SubgraphService,
    private dungeonFactoryService: DungeonFactoryService,
  ) { }

  ngOnInit(): void {
    this.subgraphService.networkObserver.subscribe(network => {
      this.network = network;
      this.chainId = getChainId(network);
      this.isLoading = true;
      this.changeDetectorRef.detectChanges();
      this.prepareData();
    })
  }

  prepareData(): void {
    const gameToken = GET_CORE_ADDRESSES(this.chainId).gameToken.toLowerCase();
    forkJoin({
      tokenData: this.subgraphService.tokenByAddress$(gameToken),
      allUsers: this.subgraphService.fetchAllUsers$(),
      treasuryAmount1: this.dungeonFactoryService.getDungeonTreasuryAmount$(this.chainId, gameToken, this.getHeroLvlByBiome(1), 1),
      treasuryAmount2: this.dungeonFactoryService.getDungeonTreasuryAmount$(this.chainId, gameToken, this.getHeroLvlByBiome(2), 2),
      treasuryAmount3: this.dungeonFactoryService.getDungeonTreasuryAmount$(this.chainId, gameToken, this.getHeroLvlByBiome(3), 3),
      treasuryAmount4: this.dungeonFactoryService.getDungeonTreasuryAmount$(this.chainId, gameToken, this.getHeroLvlByBiome(4), 4),
      heroes: this.subgraphService.fetchAllHeroes$(),
      itemActions: this.subgraphService.fetchAllItemActions$(),
    })
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ tokenData, allUsers, treasuryAmount1, treasuryAmount2, treasuryAmount3, treasuryAmount4, heroes, itemActions }) => {
        if (tokenData && tokenData.length > 0) {
          this.symbol = tokenData[0].symbol;
          this.totalSupply = Formatter.formatCurrency(+formatUnits(tokenData[0].totalSupply, tokenData[0].decimals));
          // @ts-ignore
          this.rewardFirstBiome = Formatter.formatCurrency(+formatUnits(treasuryAmount1[1] + treasuryAmount1[2], tokenData[0].decimals));
          // @ts-ignore
          this.rewardSecondBiome = Formatter.formatCurrency(+formatUnits(treasuryAmount2[1] + treasuryAmount2[2], tokenData[0].decimals));
          // @ts-ignore
          this.rewardThirdBiome = Formatter.formatCurrency(+formatUnits(treasuryAmount3[1] + treasuryAmount3[2], tokenData[0].decimals));
          // @ts-ignore
          this.rewardFourthBiome = Formatter.formatCurrency(+formatUnits(treasuryAmount4[1] + treasuryAmount4[2], tokenData[0].decimals));

          this.totalUsersEarned = Formatter.formatCurrency(heroes.reduce((total, hero) => {
            const earnedSum = hero.earnedTokens.reduce((sum, earned) => {
              const val = +formatUnits(earned.amount, tokenData[0].decimals);
              return sum + val
            }, 0);
            return total + earnedSum;
          }, 0));

          this.spentOnItems = Formatter.formatCurrency(
            itemActions.reduce((total, action) => {
              return total + +action.item.meta.feeToken.amount
            }, 0)
          );

          this.spentOnHeroes = Formatter.formatCurrency(
            heroes.reduce((total, hero) => +hero.meta.feeToken.amount + total, 0)
          );
        }
        if (allUsers) {
          this.users = allUsers.length;
        }


        this.isLoading = false;
        this.changeDetectorRef.detectChanges();
      })

  }

  getHeroLvlByBiome(biome: number): number {
    return biome * 5 - 4;
  }
}
