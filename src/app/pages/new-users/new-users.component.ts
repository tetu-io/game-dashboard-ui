import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { EChartsOption, SeriesOption } from 'echarts';
import { SubgraphService } from '../../services/subgraph.service';
import { DestroyService } from '../../services/destroy.service';
import { HeroAction, UserEntity } from '../../../../generated/gql';
import { forkJoin, from, of, takeUntil } from 'rxjs';
import { NETWORKS } from '../../shared/constants/network.constant';

@Component({
  selector: 'app-new-users',
  templateUrl: './new-users.component.html',
  styleUrls: ['./new-users.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NewUsersComponent implements OnInit {

  totalUsers: number = 0;
  network: string = '';
  options: EChartsOption = {};
  isLoading = false;

  constructor(
    private destroy$: DestroyService,
    private subgraphService: SubgraphService,
    private changeDetectorRef: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.subgraphService.networkObserver.subscribe(network => {
      this.network = network;
      this.isLoading = true;
      this.changeDetectorRef.detectChanges();
      this.prepareData();
    })
  }

  private prepareData(): void {
    this.isLoading = true;

    users: this.subgraphService.fetchAllUsersSimple$(this.destroy$)
      .pipe(takeUntil(this.destroy$))
      .subscribe(users => {
        if (users) {
          const filterUsers = users.filter(user => user.userStat.actions > 0);
          this.totalUsers = filterUsers.length;
          this.prepareChartData(filterUsers as UserEntity[]);
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

    const getLast7DaysCounts = (dateString: string) => {
      const currentDate = new Date(dateString);
      let sum = 0;
      for (let i = 0; i < 7; i++) {
        const previousDate = new Date(currentDate);
        previousDate.setDate(currentDate.getDate() - i);
        const previousDateString = previousDate.toISOString().slice(0, 10);
        if (dateCounts[previousDateString]) {
          sum += dateCounts[previousDateString];
        }
      }
      return sum;
    };

    const dates = Object.keys(dateCounts).sort();
    const counts = dates.map(date => dateCounts[date]);

    // by refCode
    let series: SeriesOption[] = [];
    let countsRef: number[] = [];
    let last7DaysCounts: number[] = [];
    Object.keys(userByDates).map(date => {
      const count = userByDates[date].filter(user => {
        if (user.heroes.filter(hero => hero.refCode !== null).length > 0) {
          return true;
        }
        return false;
      }).length;
      countsRef.push(count);

      last7DaysCounts.push(getLast7DaysCounts(date));

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

    series.push(
      {
        name: 'New users for last 7 days',
        type: 'line',
        data: last7DaysCounts
      }
    )

    const legends = ['New users', 'New users for last 7 days', 'User created by ref code'];
    this.options = {
      legend: {
        data: legends,
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

  showStat(): boolean {
    return this.network === NETWORKS.fantom;
  }
}
