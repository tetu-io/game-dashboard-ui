import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DestroyService } from '../../services/destroy.service';
import { SubgraphService } from '../../services/subgraph.service';
import { DauStatisticEntity, HeroAction, UserEntity } from '../../../../generated/gql';
import { EChartsOption } from 'echarts';
import { takeUntil } from 'rxjs';

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
    this.subgraphService
      .fetchAllDau$()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.prepareChartData(data as DauStatisticEntity[]);
        this.isLoading = false;
        this.changeDetectorRef.detectChanges();
      });
  }

  private prepareChartData(data: DauStatisticEntity[]) {
    const dau: number[] = [];
    const dates: string[] = [];

    data.reverse().forEach(item => {
      dau.push(item.count);
      dates.push(item.id);
    });

    this.options = {
      legend: {
        data: ['DAU'],
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
        name: 'DAU',
        type: 'line',
        data: dau
      },
      animationEasing: 'elasticOut',
      animationDelayUpdate: idx => idx * 5,
    };
  }
}
