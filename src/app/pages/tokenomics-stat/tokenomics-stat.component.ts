import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { EChartsOption, SeriesOption } from 'echarts';
import { DestroyService } from '../../services/destroy.service';
import { SubgraphService } from '../../services/subgraph.service';
import { takeUntil } from 'rxjs';
import { HeroAction, HeroEntity } from '../../../../generated/gql';
import { HEROES_ACTIONS, HEROES_CLASSES } from '../../shared/constants/heroes.constant';

@Component({
  selector: 'app-tokenomics-stat',
  templateUrl: './tokenomics-stat.component.html',
  styleUrls: ['./tokenomics-stat.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DestroyService]
})
export class TokenomicsStatComponent implements OnInit {

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

    this.subgraphService.fetchHeroActionsByType$([0, 2], this.destroy$)
      .pipe(takeUntil(this.destroy$))
      .subscribe(heroActions => {
        if (heroActions) {
          this.prepareChartData(heroActions as HeroAction[]);
        }
        this.isLoading = false;
        this.changeDetectorRef.detectChanges();
      })
  }

  private prepareChartData(data: HeroAction[]) {
    const convertToDateString = (timestamp: string): string => {
      const date = new Date(parseInt(timestamp) * 1000);
      return date.toISOString().split('T')[0];
    };

    const dateCounts = data.reduce((acc, { timestamp }) => {
      const dateString = convertToDateString(timestamp + '');
      acc[dateString] = (acc[dateString] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);



    const allDates = new Set<string>();
    data.forEach(hero => allDates.add(convertToDateString(hero.timestamp + '')));
    const sortedDates = Array.from(allDates).sort();


    let acc: Record<string, number> = {};
    let amountOfPaymentsRecord: Record<string, number> = {};
    let amountOfPayersRecord: Record<string, Record<string, number>> = {};

    // class count
    const spentOn: Record<string, Record<string, number>> = {};
    data.forEach(heroAction => {
      const dateString = convertToDateString(heroAction.timestamp + '');
      const type = heroAction.action

      if (!spentOn[type]) {
        spentOn[type] = {};
      }

      if (!spentOn[type][dateString]) {
        spentOn[type][dateString] = (+heroAction.values[0] * +heroAction.hero.meta.feeToken.amount);
      } else {
        spentOn[type][dateString] += (+heroAction.values[0] * +heroAction.hero.meta.feeToken.amount);
      }

      if (!acc[dateString]) {
        acc[dateString] = spentOn[type][dateString];
      } else {
        acc[dateString] += (+heroAction.values[0] * +heroAction.hero.meta.feeToken.amount);
      }

      if (!amountOfPaymentsRecord[dateString]) {
        amountOfPaymentsRecord[dateString] = 1;
      } else {
        amountOfPaymentsRecord[dateString] += 1;
      }

      if (!amountOfPayersRecord[dateString]) {
        amountOfPayersRecord[dateString] = {};
      }
      if (heroAction.owner) {
        amountOfPayersRecord[dateString][heroAction.owner.id] = 1;
      }

    });

    const dates = Object.keys(acc).sort();
    const counts = dates.map(date => acc[date]);
    const amountOfPayments = dates.map(date => amountOfPaymentsRecord[date]);
    const amountOfPayers = dates.map(date => Object.values(amountOfPayersRecord[date]).length);

    const heroSeries = Object.keys(spentOn).map(type => {
      const dates = Object.keys(spentOn[type]).sort();
      const classCounts = spentOn[type];

      const counts = sortedDates.map(date => {
        return classCounts[date] || 0;
      });
      return {
        name: HEROES_ACTIONS.get(type),
        type: 'line',
        data: counts
      } as SeriesOption;
    });

    heroSeries.push({
      name: 'Total spent',
      type: 'line',
      data: counts,
    })

    heroSeries.push({
      name: 'Amount of payments',
      type: 'line',
      data: amountOfPayments,
    });
    heroSeries.push({
      name: 'Amount of payers',
      type: 'line',
      data: amountOfPayers,
    })


    this.options = {
      legend: {
        data: ['Total spent', 'Level up', 'Create hero', 'Amount of payments', 'Amount of payers'],
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
        data: sortedDates,
        type: 'category',
        boundaryGap: false,
        axisLine: { onZero: false },
      },
      yAxis: {
        minInterval: 1
      },
      series: heroSeries,
      animationEasing: 'elasticOut',
      animationDelayUpdate: idx => idx * 5,
    };
  }
}
