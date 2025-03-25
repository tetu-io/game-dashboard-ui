import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { EChartsOption } from 'echarts';
import { DestroyService } from '../../services/destroy.service';
import { SubgraphService } from '../../services/subgraph.service';
import { takeUntil } from 'rxjs';
import {
  HeroTokensVaultEntity,
  HeroTokensVaultHistoryEntity,
  PawnshopStatisticEntity,
  UserEntity,
} from '../../../../generated/gql';
import { formatUnits } from 'ethers';

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

  constructor(
    private destroy$: DestroyService,
    private changeDetectorRef: ChangeDetectorRef,
    private subgraphService: SubgraphService,
  ) { }

  ngOnInit(): void {
    this.subgraphService.networkObserver.subscribe(network => {
      this.isLoading = true;
      this.changeDetectorRef.detectChanges();
      this.prepareData();
    })
  }

  private prepareData(): void {
    this.isLoading = true;
    this.subgraphService
      .fetchAllHeroTokenVault$(this.destroy$)
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.prepareChartData(data as HeroTokensVaultHistoryEntity[]);
        this.isLoading = false;
        this.changeDetectorRef.detectChanges();
      });
  }

  private prepareChartData(data: HeroTokensVaultHistoryEntity[]) {
    const dates: string[] = [];
    const total: string[] = [];
    const sacra: string[] = [];
    const secondToken: string[] = [];

    const convertToDateString = (timestamp: string): string => {
      const date = new Date(parseInt(timestamp) * 1000);
      return date.toISOString().split('T')[0];
    };

    const heroVaultByDates: Record<string, Income> = {};

    data.forEach(item => {
      const dateString = convertToDateString(item.timestamp + '');
      if (!heroVaultByDates[dateString]) {
        heroVaultByDates[dateString] = {
          total: 0,
          sacra: 0,
          secondToken: 0
        };
      }
      let total = 0;
      if (item.token.name.includes('Sacra')) {
        const val = +formatUnits(item.toGov) * +item.token.price
        heroVaultByDates[dateString].sacra += val;
        total += val;
      } else {
        const val = +formatUnits(item.toGov) * +item.token.price;
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
