import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { EChartsOption } from 'echarts';
import { DestroyService } from '../../services/destroy.service';
import { SubgraphService } from '../../services/subgraph.service';
import { forkJoin, takeUntil } from 'rxjs';
import { BurnHistoryEntity, HeroAction, TotalSupplyHistoryEntity } from '../../../../generated/gql';
import { formatUnits, parseUnits } from 'ethers';

@Component({
  selector: 'app-total-suplly-chart',
  templateUrl: './total-suplly-chart.component.html',
  styleUrls: ['./total-suplly-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TotalSupllyChartComponent implements OnInit {

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

    forkJoin({
      totalSupply: this.subgraphService.fetchAllTotalSupply$(),
      burn: this.subgraphService.fetchAllBurn$(),
    })
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ totalSupply, burn }) => {
        if (totalSupply) {
          this.prepareChartData(totalSupply as TotalSupplyHistoryEntity[], burn as BurnHistoryEntity[]);
        }
        this.isLoading = false;
        this.changeDetectorRef.detectChanges();
      })
  }

  private prepareChartData(data: TotalSupplyHistoryEntity[], burn: BurnHistoryEntity[]): void {
    const convertToDateString = (timestamp: string): string => {
      const date = new Date(parseInt(timestamp) * 1000);
      return date.toISOString().split('T')[0];
    };

    const allDates = new Set<string>();
    data.forEach(ts => allDates.add(convertToDateString(ts.timestamp + '')));
    const sortedDates = Array.from(allDates).sort();

    let record: Record<string, number> = {};
    data.forEach(ts => {
      const dateString = convertToDateString(ts.timestamp + '');
      const value = +(+formatUnits(ts.totalSupply)).toFixed(0);
      if (!record[dateString]) {
        record[dateString] = value;
      }
    })

    let recordBurn: Record<string, number> = {};
    burn.forEach(b => {
      const dateString = convertToDateString(b.timestamp + '');
      const value = +(+formatUnits(b.burn));
      if (!recordBurn[dateString]) {
        recordBurn[dateString] = value;
      } else {
        recordBurn[dateString] += value;
      }
    })

    const array: number[] = [];
    const burnArray: number[] = [];
    let prevBurn = 0;
    allDates.forEach(date => {
      array.push(record[date] || 0);
      const index = burnArray.push(+((recordBurn[date] || 0)).toFixed(2) + prevBurn);
      prevBurn = burnArray[index - 1];
    });

    this.options = {
      legend: {
        data: ['Total supply', 'Burned'],
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
      series: [
        {
          name: 'Total supply',
          type: 'line',
          data: array,
        },
        {
          name: 'Burned',
          type: 'line',
          data: burnArray,
        }
      ],
      animationEasing: 'elasticOut',
      animationDelayUpdate: idx => idx * 5,
    };
  }
}
