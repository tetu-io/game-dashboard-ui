import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { EChartsOption, SeriesOption } from 'echarts';
import { SubgraphService } from '../../services/subgraph.service';
import { DestroyService } from '../../services/destroy.service';
import { UserEntity } from '../../../../generated/gql';
import { takeUntil } from 'rxjs';

@Component({
  selector: 'app-new-users',
  templateUrl: './new-users.component.html',
  styleUrls: ['./new-users.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NewUsersComponent implements OnInit {

  options: EChartsOption = {};
  isLoading = false;

  constructor(
    private destroy$: DestroyService,
    private subgraphService: SubgraphService,
    private changeDetectorRef: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.subgraphService.networkObserver.subscribe(() => {
      this.isLoading = true;
      this.changeDetectorRef.detectChanges();
      this.prepareData();
    })
  }

  private prepareData(): void {
    this.isLoading = true;

    this.subgraphService.fetchAllUsers$()
      .pipe(takeUntil(this.destroy$))
      .subscribe(users => {
        if (users) {
          this.prepareChartData(users as UserEntity[]);
        }
        this.isLoading = false;
        this.changeDetectorRef.detectChanges();
      })
  }


  private prepareChartData(data: UserEntity[]) {

    const convertToDateString = (timestamp: string): string => {
      const date = new Date(parseInt(timestamp) * 1000);
      return date.toISOString().split('T')[0];
    };

    const userByDates: Record<string, UserEntity[]> = {};
    const dateCounts = data.reduce((acc, data) => {
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

    const dates = Object.keys(dateCounts).sort();
    const counts = dates.map(date => dateCounts[date]);

    // by refCode
    let series: SeriesOption[] = [];
    let countsRef: number[] = [];
    Object.keys(userByDates).map(date => {
      const count = userByDates[date].filter(user => {
        if (user.heroes.filter(hero => hero.refCode !== null).length > 0) {
          return true;
        }
        return false;
      }).length;

      countsRef.push(count);
    });

    series.push(
      {
        name: 'User created by ref code',
        type: 'line',
        data: countsRef
      }
    );

    series.push(
      {
        name: 'New users',
        type: 'line',
        data: counts,
        emphasis: {
          focus: 'series',
        },
        animationDelay: idx => idx * 10,
      }
    )

    this.options = {
      legend: {
        data: ['New users', 'User created by ref code'],
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
      series: series,
      animationEasing: 'elasticOut',
      animationDelayUpdate: idx => idx * 5,
    };
  }
}
