import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { EChartsOption } from 'echarts';
import { DestroyService } from '../../services/destroy.service';
import { SubgraphService } from '../../services/subgraph.service';
import { takeUntil } from 'rxjs';
import { TotalTxStatisticEntity } from '../../../../generated/gql';

@Component({
  selector: 'app-total-tx',
  templateUrl: './total-tx.component.html',
  styleUrls: ['./total-tx.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TotalTxComponent implements OnInit {

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
    this.subgraphService
      .fetchTransactions$()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.prepareChartData(data as TotalTxStatisticEntity[]);
        this.isLoading = false;
        this.changeDetectorRef.detectChanges();
      });
  }

  private prepareChartData(data: TotalTxStatisticEntity[]) {
    const tx: number[] = [];
    const dates: string[] = [];

    data.forEach(item => {
      tx.push(item.count);
      dates.push(item.id);
    });

    this.options = {
      legend: {
        data: ['Total transactions'],
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
      series: {
        name: 'Total transactions',
        type: 'line',
        data: tx
      },
      animationEasing: 'elasticOut',
      animationDelayUpdate: idx => idx * 5,
    };
  }

}
