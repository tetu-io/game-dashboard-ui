import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { EChartsOption } from 'echarts';
import { DestroyService } from '../../services/destroy.service';
import { SubgraphService } from '../../services/subgraph.service';
import { forkJoin, of, takeUntil } from 'rxjs';
import {
  HeroTokensVaultEntity,
  HeroTokensVaultHistoryEntity,
  PawnshopStatisticEntity,
  UserEntity,
} from '../../../../generated/gql';
import { formatUnits, parseUnits } from 'ethers';
import { AlgebraPoolService } from '../../services/onchain/algebra-pool.service';
import { GET_CORE_ADDRESSES } from '../../shared/constants/addresses.constant';
import { getChainId } from '../../shared/constants/network.constant';

const SACRA_SWAPX_POOL_SONIC = '0x875819746112630cEe95aA78E4327cd4837Da70D';
const WS_USDC_SWAPX_POOL_SONIC = '0x5C4B7d607aAF7B5CDE9F09b5F03Cf3b5c923AEEa';


interface Income {
  total: number;
  sacra: number;
  secondToken: number;
}

@Component({
  selector: 'app-profit-income',
  templateUrl: './profit-income.component.html',
  styleUrls: ['./profit-income.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfitIncomeComponent implements OnInit {

  options: EChartsOption = {};
  isLoading = false;
  network: string = '';
  chainId: number = 0;

  constructor(
    private destroy$: DestroyService,
    private changeDetectorRef: ChangeDetectorRef,
    private subgraphService: SubgraphService,
    private algebraPoolService: AlgebraPoolService,
  ) { }

  ngOnInit(): void {
    this.subgraphService.networkObserver.subscribe(network => {
      this.isLoading = true;
      this.changeDetectorRef.detectChanges();
      this.prepareData();
    })
  }

  private prepareData(): void {
    this.subgraphService.networkObserver.subscribe(network => {
      this.network = network;
      this.chainId = getChainId(network);
      this.isLoading = true;
      forkJoin({
        gamePrice: this.chainId === 146 ? this.algebraPoolService.safelyGetStateOfAMM$(SACRA_SWAPX_POOL_SONIC, this.chainId) : of(undefined),
        ethPriceRes: this.chainId === 146 ?  this.algebraPoolService.safelyGetStateOfAMM$(WS_USDC_SWAPX_POOL_SONIC, this.chainId) : of(undefined),
        data: this.subgraphService
          .fetchAllHeroTokenVault$(this.destroy$)
      })
        .pipe(takeUntil(this.destroy$))
        .subscribe(({ gamePrice, ethPriceRes, data }) => {
          let sacraPrice = 0;
          let ethPrice = 0;
          if (gamePrice) {
            const sqrtSacra = (gamePrice as bigint[])[0];
            const price = (Number(sqrtSacra) / ((2) ** (96))) ** 2;
            const sqrtEth = (ethPriceRes as bigint[])[0];
            const ethPriceN = (Number(sqrtEth) / ((2) ** (96))) ** 2;
            const sacra = 1 / price * ethPriceN;
            sacraPrice = sacra * 10 ** 12
            ethPrice = ethPriceN * 10 ** 12;
          }
          this.prepareChartData(data as HeroTokensVaultHistoryEntity[], sacraPrice, ethPrice);
          this.isLoading = false;
          this.changeDetectorRef.detectChanges();
        });
    });
  }

  private prepareChartData(data: HeroTokensVaultHistoryEntity[], sacraPrice: number, ethPrice: number) {
    const dates: string[] = [];
    const total: string[] = [];
    const sacra: string[] = [];
    const secondToken: string[] = [];

    const convertToMonthString = (timestamp: string): string => {
      const date = new Date(parseInt(timestamp) * 1000);
      return date.toLocaleString('en-US', { month: 'long' });
    };


    const heroVaultByDates: Record<string, Income> = {};

    data.forEach(item => {
      const dateString = convertToMonthString(item.timestamp + '');
      if (!heroVaultByDates[dateString]) {
        heroVaultByDates[dateString] = {
          total: 0,
          sacra: 0,
          secondToken: 0
        };
      }
      let total = 0;
      if (item.token.name.includes('Sacra')) {
        const price = +item.token.price > 0 ? +item.token.price : sacraPrice;
        const val = +formatUnits(item.toGov) * price
        heroVaultByDates[dateString].sacra += val;
        total += val;
      } else {
        const price = +item.token.price > 0 ? +item.token.price : ethPrice;
        const val = +formatUnits(item.toGov) * price;
        heroVaultByDates[dateString].secondToken += val;
        total += val;
      }
      heroVaultByDates[dateString].total += total;
    });

    Object.keys(heroVaultByDates).forEach(key => {
      dates.push(key);
      total.push(heroVaultByDates[key].total.toFixed(2));
      sacra.push(heroVaultByDates[key].sacra.toFixed(2));
      secondToken.push(heroVaultByDates[key].secondToken.toFixed(2));
    });

    this.options = {
      legend: {
        data: ['Total income in USD', 'Sacra in USD', 'wS in USD'],
        align: 'left',
      },
      dataZoom: [
        {
          type: 'slider',
        },
        {
          type: 'inside',
        },
      ],
      grid: {
        left: 100,
        top: 50,
        right: 50,
        bottom: 80,
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          animation: false,
          label: {
            backgroundColor: '#505765',
          },
        },
      },
      xAxis: {
        data: dates,
        type: 'category',
        boundaryGap: false,
        axisLine: { onZero: false },
      },
      yAxis: {
        minInterval: 1
      },
      series: [
        {
          name: 'Total income in USD',
          type: 'line',
          data: total,
        },
        {
          name: 'Sacra in USD',
          type: 'line',
          data: sacra,
        },
        {
          name: 'wS in USD',
          type: 'line',
          data: secondToken,
        }
      ],
      animationEasing: 'elasticOut',
      animationDelayUpdate: idx => idx * 5,
    };
  }
}
