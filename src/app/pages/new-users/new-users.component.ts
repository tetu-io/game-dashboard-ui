import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { EChartsOption } from 'echarts';
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
  constructor(
    private destroy$: DestroyService,
    private subgraphService: SubgraphService,
    private changeDetectorRef: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.subgraphService.users$()
      .pipe(takeUntil(this.destroy$))
      .subscribe(users => {
        if (users) {
          this.prepareChartData(users as UserEntity[]);
        }
      this.changeDetectorRef.detectChanges();
    })
  }

  private prepareChartData(data: UserEntity[]) {

    const convertToDateString = (timestamp: string): string => {
      const date = new Date(parseInt(timestamp) * 1000);
      return date.toISOString().split('T')[0];
    };

    const dateCounts = data.reduce((acc, { lastActionTs }) => {
      const dateString = convertToDateString(lastActionTs + '');
      acc[dateString] = (acc[dateString] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const dates = Object.keys(dateCounts).sort();
    const counts = dates.map(date => dateCounts[date]);

    this.options = {
      legend: {
        data: ['New users'],
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
          name: 'New users',
          type: 'line',
          data: counts,
          emphasis: {
            focus: 'series',
          },
          animationDelay: idx => idx * 10,
        }
      ],
      animationEasing: 'elasticOut',
      animationDelayUpdate: idx => idx * 5,
    };
  }
}
