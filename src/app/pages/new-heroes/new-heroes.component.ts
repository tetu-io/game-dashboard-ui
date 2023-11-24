import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { EChartsOption, SeriesOption } from 'echarts';
import { DestroyService } from '../../services/destroy.service';
import { SubgraphService } from '../../services/subgraph.service';
import { takeUntil } from 'rxjs';
import { HeroEntity } from '../../../../generated/gql';
import { HEROES_CLASSES } from '../../shared/constants/heroes.constant';

@Component({
  selector: 'app-new-heroes',
  templateUrl: './new-heroes.component.html',
  styleUrls: ['./new-heroes.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NewHeroesComponent implements OnInit {

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

    this.subgraphService.heroes$(1000)
      .pipe(takeUntil(this.destroy$))
      .subscribe(heroes => {
        if (heroes) {
          this.prepareChartData(heroes as HeroEntity[]);
        }
        this.isLoading = false;
        this.changeDetectorRef.detectChanges();
      })
  }

  private prepareChartData(data: HeroEntity[]) {

    const convertToDateString = (timestamp: string): string => {
      const date = new Date(parseInt(timestamp) * 1000);
      return date.toISOString().split('T')[0];
    };

    const dateCounts = data.reduce((acc, { timestamp }) => {
      const dateString = convertToDateString(timestamp + '');
      acc[dateString] = (acc[dateString] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const dates = Object.keys(dateCounts).sort();
    const counts = dates.map(date => dateCounts[date]);

    const allDates = new Set<string>();
    data.forEach(hero => allDates.add(convertToDateString(hero.timestamp + '')));
    const sortedDates = Array.from(allDates).sort();



    // class count
    const classDateCounts: Record<string, Record<string, number>> = {};
    data.forEach(hero => {
      const dateString = convertToDateString(hero.timestamp + '');
      const heroClass = hero.meta.heroClass;

      if (!classDateCounts[heroClass]) {
        classDateCounts[heroClass] = {};
      }

      if (!classDateCounts[heroClass][dateString]) {
        classDateCounts[heroClass][dateString] = 1;
      } else {
        classDateCounts[heroClass][dateString]++;
      }
    });

    const heroSeries = Object.keys(classDateCounts).map(heroClass => {
      const dates = Object.keys(classDateCounts[heroClass]).sort();
      const classCounts = classDateCounts[heroClass];

      const counts = sortedDates.map(date => classCounts[date] || 0);
      return {
        name: HEROES_CLASSES.get(heroClass),
        type: 'line',
        data: counts
      } as SeriesOption;
    });

    // add total
    heroSeries.push({
          name: 'Total heroes',
          type: 'line',
          data: counts,
    })


    this.options = {
      legend: {
        data: ['Total heroes', 'Thrall', 'Savage', 'Mage', 'Assassin'],
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
