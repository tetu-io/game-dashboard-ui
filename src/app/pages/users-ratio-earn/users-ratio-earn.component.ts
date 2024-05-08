import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { EChartsOption, SeriesOption } from 'echarts';
import { DestroyService } from '../../services/destroy.service';
import { SubgraphService } from '../../services/subgraph.service';
import { forkJoin, takeUntil } from 'rxjs';
import { HeroAction, HeroTokenEarned, ItemActionEntity, UserEntity } from '../../../../generated/gql';
import { parseUnits, formatUnits } from 'ethers';

@Component({
  selector: 'app-users-ratio-earn',
  templateUrl: './users-ratio-earn.component.html',
  styleUrls: ['./users-ratio-earn.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UsersRatioEarnComponent implements OnInit {

  options: EChartsOption = {};
  isLoading = false;


  constructor(
    private destroy$: DestroyService,
    private subgraphService: SubgraphService,
    private changeDetectorRef: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.subgraphService.networkObserver.subscribe(() => {
      this.isLoading = true;
      this.changeDetectorRef.detectChanges();
      this.prepareData();
    })
  }

  private prepareData(): void {
    this.isLoading = true;

    forkJoin(
      {
        spentOnHero: this.subgraphService.fetchHeroActionsByType$([0, 2]),
        earned: this.subgraphService.fetchAllHeroTokenEarned$(),
        spentOnItem: this.subgraphService.fetchAllItemActions$()
      }
    ).pipe(takeUntil(this.destroy$))
      .subscribe(({ spentOnHero, earned, spentOnItem }) => {
        if (spentOnHero) {
          this.prepareChartData(spentOnHero as HeroAction[], earned as HeroTokenEarned[], spentOnItem as ItemActionEntity[]);
        }
        this.isLoading = false;
        this.changeDetectorRef.detectChanges();
      })

  }

  private prepareChartData(actions: HeroAction[], earned: HeroTokenEarned[], itemActions: ItemActionEntity[]) {
    const convertToDateString = (timestamp: string): string => {
      const date = new Date(parseInt(timestamp) * 1000);
      return date.toISOString().split('T')[0];
    };

    const heroActionsByDates: Record<string, number> = {};
    const heroEarnedByDates: Record<string, number> = {};
    const itemActionsByDates: Record<string, number> = {};

    const dateCounts = actions.reduce((acc, data) => {
      const dateString = convertToDateString(data.timestamp + '');
      acc[dateString] = (acc[dateString] || 0) + 1;
      const value = +data.values[0] * +data.hero.meta.feeToken.amount;
      if (heroActionsByDates[dateString]) {
        heroActionsByDates[dateString] = heroActionsByDates[dateString] + value;
      } else {
        heroActionsByDates[dateString] = 0
        heroActionsByDates[dateString] = heroActionsByDates[dateString] + value;
      }

      return acc;
    }, {} as Record<string, number>);


    earned.forEach(data => {
      const dateString = convertToDateString(data.timestamp + '');
      if (!dateCounts[dateString]) {
        dateCounts[dateString] = 1;
      }

      if (!heroEarnedByDates[dateString]) {
        heroEarnedByDates[dateString] = 0
      }
      heroEarnedByDates[dateString] = heroEarnedByDates[dateString] + +(+formatUnits(data.amount)).toFixed(2);
    });

    itemActions.forEach(data => {
      const dateString = convertToDateString(data.timestamp + '');
      const value = data.values.length > 0 ? +data.values[0] : 1;
      if (!dateCounts[dateString]) {
        dateCounts[dateString] = 1;
      }

      if (!itemActionsByDates[dateString]) {
        itemActionsByDates[dateString] = 0
      }
      itemActionsByDates[dateString] = itemActionsByDates[dateString] + (+data.item.meta.feeToken.amount * value);
    });

    const dates = Object.keys(dateCounts).sort();
    const spentOnHero = dates.map(date => {
      return heroActionsByDates[date] ? heroActionsByDates[date] : 0;
    });
    const spentOnItems = dates.map(date => {
      return itemActionsByDates[date] ? itemActionsByDates[date] : 0;
    });
    const earnedByHero = dates.map(date => {
      return heroEarnedByDates[date] ? heroEarnedByDates[date] : 0;
    });
    const ratio: string[] = [];
    for (let i = 0; i < dates.length; i++) {
      const spent = spentOnHero[i] + spentOnItems[i];
      const earned = earnedByHero[i];
      if (spent === 0 || earned === 0) {
        ratio.push('0');
      } else {
        ratio.push((spent / earned).toFixed(3));
      }
    }


    let series: SeriesOption[] = [];

    series.push(
      {
        name: 'Spent on items',
        type: 'line',
        data: spentOnItems,
        emphasis: {
          focus: 'series',
        },
        animationDelay: idx => idx * 10,
      }
    )

    series.push(
      {
        name: 'Spent on hero',
        type: 'line',
        data: spentOnHero,
        emphasis: {
          focus: 'series',
        },
        animationDelay: idx => idx * 10,
      }
    )

    series.push(
      {
        name: 'Earned',
        type: 'line',
        data: earnedByHero,
        emphasis: {
          focus: 'series',
        },
        animationDelay: idx => idx * 10,
      }
    )

    series.push(
      {
        name: 'Ratio',
        type: 'line',
        data: ratio,
        emphasis: {
          focus: 'series',
        },
        animationDelay: idx => idx * 10,
      }
    )

    this.options = {
      legend: {
        data: ['Earned', 'Spent on hero', 'Spent on items', 'Ratio'],
        align: 'left',
        selected: {
          'Earned': false,
          'Spent on hero': false,
          'Spent on items': false,
          'Ratio': true,
        }
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
      series: series,
      animationEasing: 'elasticOut',
      animationDelayUpdate: idx => idx * 5,
    };

  }
}
