import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { EChartsOption } from 'echarts';
import { DestroyService } from '../../services/destroy.service';
import { SubgraphService } from '../../services/subgraph.service';
import { forkJoin, takeUntil } from 'rxjs';
import { DauStatisticEntity, UserEntity } from '../../../../generated/gql';

@Component({
  selector: 'app-chunk-rate',
  templateUrl: './chunk-rate.component.html',
  styleUrls: ['./chunk-rate.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChunkRateComponent implements OnInit {

  options: EChartsOption = {};
  isLoading = false;
  title = 'Churn Rate (Inactive Users in 7 days / Total Users on that day) * 100';

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
    forkJoin({
      dau: this.subgraphService.fetchAllDau$(),
      users: this.subgraphService.fetchAllUsersTs$()
    })
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ dau,
        users
      }) => {
        this.prepareChartData(dau as DauStatisticEntity[], users as UserEntity[]);
        this.isLoading = false;
        this.changeDetectorRef.detectChanges();
      });
  }

  private prepareChartData(dauData: DauStatisticEntity[], users: UserEntity[]) {
    const activeUsersArray: number[] = [];
    const dates: string[] = [];

    const wau = this.calculateWAU(dauData);
    wau.forEach(val => {
      activeUsersArray.push(val.count);
      dates.push(val.date);
    });
    dauData.reverse().forEach(item => {

    });

    const convertToDateString = (timestamp: string): string => {
      const date = new Date(parseInt(timestamp) * 1000);
      return date.toISOString().split('T')[0];
    };

    const userByDates: Record<string, UserEntity[]> = {};
    const userCounts = users.reduce((acc, data) => {
      const dateString = convertToDateString(data.timestamp + '');
      acc[dateString] = (acc[dateString] || 0) + 1;
      if (userByDates[dateString]) {
        userByDates[dateString].push(data);
      } else {
        userByDates[dateString] = []
        userByDates[dateString].push(data);
      }

      return acc;
    }, {} as Record<string, number>);


    let prevCount = 0;
    const churnRateArray: string[] = [];
    for (let i = 0; i < dates.length; i++) {
      const date = dates[i];
      const count = userCounts[date] || 0;
      prevCount = count + prevCount;
      churnRateArray.push(((1 - (activeUsersArray[i] / prevCount)) * 100).toFixed(2));
    }
    this.options = {
      legend: {
        data: [this.title],
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
        minInterval: 0.1
      },
      series: {
        name: this.title,
        type: 'line',
        data: churnRateArray
      },
      animationEasing: 'elasticOut',
      animationDelayUpdate: idx => idx * 5,
    };
  }

  private calculateWAU(data: DauStatisticEntity[]): { date: string, count: number }[] {

    const dateCounts: { [key: string]: Set<string> } = {};

    data.forEach(entry => {
      const date = entry.id;
      if (!dateCounts[date]) {
        dateCounts[date] = new Set<string>();
      }
      entry.users.forEach(user => dateCounts[date].add(user.id));
    });

    const result: { date: string, count: number }[] = [];
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

      result.push({ date: dates[i], count: activeUsers.size });
    }

    return result;
  }
}
