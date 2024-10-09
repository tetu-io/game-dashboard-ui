import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { DestroyService } from '../../services/destroy.service';
import { SubgraphService } from '../../services/subgraph.service';
import { DungeonFactoryService } from '../../services/onchain/dungeon-factory.service';
import { GET_CORE_ADDRESSES } from '../../shared/constants/addresses.constant';
import { getChainId } from '../../shared/constants/network.constant';
import { forkJoin, takeUntil } from 'rxjs';
import { formatUnits, parseUnits } from 'ethers';
import { Formatter } from '../../shared/utils/formatter';
import { TokenService } from '../../services/onchain/token.service';

@Component({
  selector: 'app-tokenomics',
  templateUrl: './tokenomics.component.html',
  styleUrls: ['./tokenomics.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DestroyService]
})
export class TokenomicsComponent implements OnInit {

  symbol = '';
  totalSupply = '0';
  users = 0;
  payerUsers = 0;
  rewardFirstBiome = 0;
  rewardSecondBiome = 0;
  rewardThirdBiome = 0;
  rewardFourthBiome = 0;
  totalUsersEarned = '0';
  spentOnItems = '0';
  spentOnHeroes = '0';
  spentOnHeroLvlUp = '0';
  arpu = '0';
  arppu = '0';
  ltv = '0';
  lifetime = '0';
  toBurn = '0';
  treasuryBalance = '0';
  controllerBalance = '0';
  dungeonFactoryBalance = '0';

  network = '';
  chainId = 0;
  isLoading = false;

  constructor(
    private destroy$: DestroyService,
    private changeDetectorRef: ChangeDetectorRef,
    private subgraphService: SubgraphService,
    private dungeonFactoryService: DungeonFactoryService,
    private tokenService: TokenService
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
    const controller = GET_CORE_ADDRESSES(this.chainId).controller.toLowerCase();
    const treasury = GET_CORE_ADDRESSES(this.chainId).treasury.toLowerCase();
    const dungeonFactory = GET_CORE_ADDRESSES(this.chainId).dungeonFactory.toLowerCase();
    forkJoin({
      tokenData: this.subgraphService.tokenByAddress$(gameToken),
      userStats: this.subgraphService.fetchAllUsersStat$(this.destroy$),
      treasuryAmount1: this.dungeonFactoryService.getDungeonTreasuryAmount$(this.chainId, gameToken, this.getHeroLvlByBiome(1), 1),
      treasuryAmount2: this.dungeonFactoryService.getDungeonTreasuryAmount$(this.chainId, gameToken, this.getHeroLvlByBiome(2), 2),
      treasuryAmount3: this.dungeonFactoryService.getDungeonTreasuryAmount$(this.chainId, gameToken, this.getHeroLvlByBiome(3), 3),
      treasuryAmount4: this.dungeonFactoryService.getDungeonTreasuryAmount$(this.chainId, gameToken, this.getHeroLvlByBiome(4), 4),
      // heroVaultStat: this.subgraphService.heroTokenVaultStatistic$(),
      earned: this.subgraphService.heroEarned$(),
      dauStats: this.subgraphService.dau$(30, 0, this.destroy$),
      stat: this.subgraphService.tokenomicStats$(),
      controllerBalance: this.tokenService.balanceOf$(gameToken, this.chainId, controller),
      treasuryBalance: this.tokenService.balanceOf$(gameToken, this.chainId, treasury),
      dungeonFactoryBalance: this.tokenService.balanceOf$(gameToken, this.chainId, dungeonFactory),
    })
      .pipe(takeUntil(this.destroy$))
      .subscribe(({
        tokenData,
        userStats,
        treasuryAmount1,
        treasuryAmount2,
        treasuryAmount3,
        treasuryAmount4,
        // heroes, itemActions,
        // heroVaultStat,
        earned,
        dauStats,
        stat,
        controllerBalance,
        treasuryBalance,
        dungeonFactoryBalance
      }) => {
        let mau = 0;
        let dau = 0;
        const usersInMau: Record<string, number> = {};

        if (dauStats.length > 0) {
          dau = dauStats[0].count;
        }
        dauStats.forEach(stat => {
          stat.users.forEach(user => {
            if (!usersInMau[user.id]) {
              usersInMau[user.id] = 1;
              mau++;
            }
          })
        });
        this.users = userStats.length;
        this.payerUsers = userStats.filter(user => user.actions > 0).length;
        this.lifetime = (1 / ((mau - dau) / 30)).toFixed(2);
        if (tokenData && tokenData.length > 0) {
          this.symbol = tokenData[0].symbol;
          this.totalSupply = (+formatUnits(tokenData[0].totalSupply, tokenData[0].decimals)).toFixed(4);
          // @ts-ignore
          this.rewardFirstBiome = (+formatUnits(treasuryAmount1[1] + treasuryAmount1[2], tokenData[0].decimals)).toFixed(4);
          // @ts-ignore
          this.rewardSecondBiome = (+formatUnits(treasuryAmount2[1] + treasuryAmount2[2], tokenData[0].decimals)).toFixed(4);
          // @ts-ignore
          this.rewardThirdBiome = (+formatUnits(treasuryAmount3[1] + treasuryAmount3[2], tokenData[0].decimals)).toFixed(4);
          // @ts-ignore
          // this.rewardFourthBiome = `${(+formatUnits(treasuryAmount4[1], tokenData[0].decimals)).toFixed(4)} + ${(+formatUnits(treasuryAmount4[2], tokenData[0].decimals)).toFixed(4)} = ${(+formatUnits(treasuryAmount4[2], tokenData[0].decimals)).toFixed(4)}`
          this.rewardFourthBiome = `${(+formatUnits(treasuryAmount4[1], tokenData[0].decimals)).toFixed(4)} + ${(+formatUnits(treasuryAmount4[2], tokenData[0].decimals)).toFixed(4)} = ${(+formatUnits(treasuryAmount4[2], tokenData[0].decimals)).toFixed(4)}`

          if (earned && earned.length > 0) {
            this.totalUsersEarned = (+formatUnits(earned[0].totalAmount)).toFixed(4);
          }

          if (stat && stat.length > 0) {
            this.spentOnHeroes = stat[0].spentOnHero;
            this.spentOnItems = stat[0].spentOnItems;
            this.toBurn = (+formatUnits(stat[0].totalBurned, 18)).toFixed(4);
          }
          this.treasuryBalance = (+formatUnits(treasuryBalance, tokenData[0].decimals)).toFixed(4);
          this.controllerBalance = (+formatUnits(controllerBalance, tokenData[0].decimals)).toFixed(4);
          this.dungeonFactoryBalance = (+formatUnits(dungeonFactoryBalance, tokenData[0].decimals)).toFixed(4);
          // this.spentOnItems = (
          //   itemActions.reduce((total, action) => {
          //     return total + +action.item.meta.feeToken.amount
          //   }, 0)
          // ).toFixed(4);
          //
          // this.spentOnHeroes = (
          //   heroes.reduce((total, hero) => +hero.meta.feeToken.amount + total, 0)
          // ).toFixed(4);
          //
          // this.spentOnHeroLvlUp = (
          //   heroes.reduce((total, hero) => {
          //     if (hero.stats.level > 1) {
          //       for (let i = 2; i <= hero.stats.level; i++) {
          //         total += i * +hero.meta.feeToken.amount;
          //       }
          //     }
          //     return total;
          //   }, 0)
          // ).toFixed(4);

          this.arpu = ((+this.spentOnItems + +this.spentOnHeroes + +this.spentOnHeroLvlUp) / this.users).toFixed(2);
          this.arppu = ((+this.spentOnItems + +this.spentOnHeroes + +this.spentOnHeroLvlUp) / this.payerUsers).toFixed(2);
          this.ltv = (+this.arpu * +this.lifetime).toFixed(2);
        }

        this.isLoading = false;
        this.changeDetectorRef.detectChanges();
      })

  }

  getHeroLvlByBiome(biome: number): number {
    return biome * 5 - 4;
  }

  prepareSeconds(days: number): number {
    const now = new Date();
    now.setDate(now.getDate() - days);
    return Math.floor(now.getTime() / 1000);
  }
}
