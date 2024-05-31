import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { EChartsOption } from 'echarts';
import { DestroyService } from '../../services/destroy.service';
import { SubgraphService } from '../../services/subgraph.service';
import { forkJoin, takeUntil } from 'rxjs';
import { DauStatisticEntity, HeroAction, UserEntity } from '../../../../generated/gql';
import { differenceInDays, parseISO } from 'date-fns';

@Component({
  selector: 'app-chunk-rate-v2',
  templateUrl: './chunk-rate-v2.component.html',
  styleUrls: ['./chunk-rate-v2.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChunkRateV2Component implements OnInit {

  options: EChartsOption = {};
  isLoading = false;
  title = 'Churn Rate (Inactive Users in 7 days / Active users on date) * 100';

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
      .subscribe(({ dau, users
      }) => {
        this.prepareChartData(dau as DauStatisticEntity[], users as UserEntity[]);
        this.isLoading = false;
        this.changeDetectorRef.detectChanges();
      });
  }


  private prepareChartData(data: DauStatisticEntity[], users: UserEntity[]) {
    data.reverse();
    const dates: string[] = [];
    const chunkRates: number[] = [];
    const usersByDate: Record<string, string[]> = {};

    const lastUserActions: Record<string, number> = {};
    const maxInactiveDays = 7;
    let index = 1;
    let allUsers: Set<string> = new Set();

    data.forEach(dau => {
      dates.push(dau.id);
      let activeUsers = 0;
      let inactiveUsers = 0;
      dau.users.forEach(user => {
        lastUserActions[user.id] = index;
        allUsers.add(user.id);
      });
      allUsers.forEach(user => {
        const userLastAction = lastUserActions[user] || 0;
        if (userLastAction > 0) {
          if (index - userLastAction > maxInactiveDays) {
            inactiveUsers++;
            lastUserActions[user] = 0;
            allUsers.delete(user);
          } else {
            activeUsers++;
          }
        }
      });
      chunkRates.push(+((inactiveUsers / (activeUsers + inactiveUsers)) * 100).toFixed(2));
      index++;
    });

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
        data: chunkRates
      },
      animationEasing: 'elasticOut',
      animationDelayUpdate: idx => idx * 5,
    };
  }
}
