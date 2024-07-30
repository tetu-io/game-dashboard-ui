import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DestroyService } from '../../services/destroy.service';
import { SubgraphService } from '../../services/subgraph.service';
import { DauStatisticEntity, HeroAction, UserEntity, WauStatisticEntity } from '../../../../generated/gql';
import { EChartsOption } from 'echarts';
import { forkJoin, takeUntil } from 'rxjs';

@Component({
  selector: 'app-dau-chart',
  templateUrl: './dau-chart.component.html',
  styleUrls: ['./dau-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DauChartComponent implements OnInit {

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
    forkJoin([
      this.subgraphService.fetchAllDau$(),
      this.subgraphService.fetchAllWau$()
    ])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([dau, wau]) => {
        this.prepareChartData(dau as DauStatisticEntity[], wau as WauStatisticEntity[]);
        this.isLoading = false;
        this.changeDetectorRef.detectChanges();
      });
  }

  private prepareChartData(dauArray: DauStatisticEntity[], wauArray: WauStatisticEntity[]) {
    const dau: number[] = [];
    const dates: string[] = [];
    // const wau = this.calculateWAU(dauArray);
    const wau: number[] = [];

    dauArray.reverse().forEach(item => {
      dau.push(item.count);
      dates.push(item.id);
    });

    wauArray.reverse().forEach(item => {
      wau.push(item.count);
    });

    this.options = {
      legend: {
        data: ['DAU', 'WAU'],
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
          name: 'DAU',
          type: 'line',
          data: dau,
        },
        {
          name: 'WAU',
          type: 'line',
          data: wau,
        },
      ],
      animationEasing: 'elasticOut',
      animationDelayUpdate: idx => idx * 5,
    };
  }

  private calculateWAU(data: DauStatisticEntity[]): number[] {

    const dateCounts: { [key: string]: Set<string> } = {};

    data.forEach(entry => {
      const date = entry.id;
      if (!dateCounts[date]) {
        dateCounts[date] = new Set<string>();
      }
      entry.users.forEach(user => dateCounts[date].add(user.id));
    });

    const result: number[] = [];
    const dates = Object.keys(dateCounts).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

    for (let i = 0; i < dates.length; i++) {
      const endDate = new Date(dates[i]);
      const startDate = new Date(endDate);
      startDate.setDate(endDate.getDate() - 6);

      const activeUsers = new Set<string>();
      dates.forEach(date => {
        const currentDate = new Date(date);
        if (currentDate >= startDate && currentDate <= endDate) {
          dateCounts[date].forEach(user => activeUsers.add(user));
        }
      });

      result.push(activeUsers.size);
    }

    return result;
  }
}
