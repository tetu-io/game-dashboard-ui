import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DestroyService } from '../../services/destroy.service';
import { SubgraphService } from '../../services/subgraph.service';
import { EChartsOption, SeriesOption } from 'echarts';
import { takeUntil } from 'rxjs';
import { PawnshopPositionHistoryEntity, UserEntity } from '../../../../generated/gql';

@Component({
  selector: 'app-pawnshop-chart',
  templateUrl: './pawnshop-chart.component.html',
  styleUrls: ['./pawnshop-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PawnshopChartComponent implements OnInit {

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

    this.subgraphService.fetchAllPawnshopActions$()
      .pipe(takeUntil(this.destroy$))
      .subscribe(actions => {
        if (actions) {
          this.prepareChartData(actions as PawnshopPositionHistoryEntity[]);
        }
        this.isLoading = false;
        this.changeDetectorRef.detectChanges();
      })
  }

  private prepareChartData(data: PawnshopPositionHistoryEntity[]) {
    const convertToDateString = (timestamp: string): string => {
      const date = new Date(parseInt(timestamp) * 1000);
      return date.toISOString().split('T')[0];
    };

    const pawnshopOpenActionsByDates: Record<string, number[]> = {};
    const pawnshopExecuteActionsByDates: Record<string, number[]> = {};
    const dates: Record<string, string> = {};

    // pawnshop actions
    data.forEach(action => {
      const datePawnshopAction = convertToDateString(action.timestamp + '');
      // create empty array for users
      if (!dates[datePawnshopAction]) {
        dates[datePawnshopAction] = '';
      }

      if (action.action == 0) {
        if (pawnshopOpenActionsByDates[datePawnshopAction]) {
          pawnshopOpenActionsByDates[datePawnshopAction].push(action.action);
        } else {
          pawnshopOpenActionsByDates[datePawnshopAction] = [];
          pawnshopOpenActionsByDates[datePawnshopAction].push(action.action);
        }
      }

      if (action.action == 4) {
        if (pawnshopExecuteActionsByDates[datePawnshopAction]) {
          pawnshopExecuteActionsByDates[datePawnshopAction].push(action.action);
        } else {
          pawnshopExecuteActionsByDates[datePawnshopAction] = [];
          pawnshopExecuteActionsByDates[datePawnshopAction].push(action.action);
        }
      }
    });

    let pawnshopExecuteActions: number[] = [];
    let pawnshopOpenActions: number[] = [];
    let datesArray = Object.keys(dates);

    Object.keys(dates).forEach(date => {
      pawnshopExecuteActions.push(pawnshopExecuteActionsByDates[date] ? pawnshopExecuteActionsByDates[date].length : 0);
      pawnshopOpenActions.push(pawnshopOpenActionsByDates[date] ? pawnshopOpenActionsByDates[date].length : 0);
    });

    let series: SeriesOption[] = [];

    series.push(
      {
        name: 'Market Deals',
        type: 'line',
        data: pawnshopExecuteActions
      }
    );
    series.push(
      {
        name: 'NFTs for Sale',
        type: 'line',
        data: pawnshopOpenActions
      }
    );

    this.options = {
      legend: {
        data: ['Market Deals', 'NFTs for Sale'],
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
        data: datesArray,
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
