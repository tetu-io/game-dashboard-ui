import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { EChartsOption } from 'echarts';
import { DestroyService } from '../../services/destroy.service';
import { SubgraphService } from '../../services/subgraph.service';
import { takeUntil } from 'rxjs';
import { DauStatisticEntity, PawnshopStatisticEntity } from '../../../../generated/gql';

@Component({
  selector: 'app-pawnshop-stat-chart',
  templateUrl: './pawnshop-stat-chart.component.html',
  styleUrls: ['./pawnshop-stat-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PawnshopStatChartComponent implements OnInit {

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
      .fetchAllPawnshopStat$(this.destroy$)
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.prepareChartData(data as PawnshopStatisticEntity[]);
        this.isLoading = false;
        this.changeDetectorRef.detectChanges();
      });
  }

  private prepareChartData(data: PawnshopStatisticEntity[]) {
    const dates: string[] = [];
    const volumes: string[] = [];
    const totalTrades: number[] = [];
    const fees: string[] = [];
    const items: number[] = [];
    const heroes: number[] = [];
    const avgs: string[] = [];
    const mins: string[] = [];
    const maxs: string[] = [];

    data.forEach(item => {
      dates.push(item.id);
      volumes.push(item.volume);
      totalTrades.push(item.totalPosition);
      fees.push(item.fees);
      items.push(item.items);
      heroes.push(item.heroes);
      avgs.push(item.avgClosePrice);
      mins.push(item.minClosePrice);
      maxs.push(item.maxClosePrice);
    });

    this.options = {
      legend: {
        data: ['Volume', 'Total trades', 'Fees', 'Items trades', 'Heroes trades', 'Avg close price', 'Min close price', 'Max close price'],
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
          name: 'Volume',
          type: 'line',
          data: volumes,
        },
        {
          name: 'Total trades',
          type: 'line',
          data: totalTrades,
        },
        {
          name: 'Fees',
          type: 'line',
          data: fees,
        },
        {
          name: 'Items trades',
          type: 'line',
          data: items,
        },
        {
          name: 'Heroes trades',
          type: 'line',
          data: heroes,
        },
        {
          name: 'Avg close price',
          type: 'line',
          data: avgs,
        },
        {
          name: 'Min close price',
          type: 'line',
          data: mins,
        },
        {
          name: 'Max close price',
          type: 'line',
          data: maxs,
        },
      ],
      animationEasing: 'elasticOut',
      animationDelayUpdate: idx => idx * 5,
    };
  }
}
