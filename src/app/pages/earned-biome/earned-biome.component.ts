import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { EChartsOption } from 'echarts';
import { DestroyService } from '../../services/destroy.service';
import { SubgraphService } from '../../services/subgraph.service';
import { forkJoin, takeUntil } from 'rxjs';
import { DauStatisticEntity, DungeonEntity, WauStatisticEntity } from '../../../../generated/gql';
import { formatUnits } from 'ethers';

@Component({
  selector: 'app-earned-biome',
  templateUrl: './earned-biome.component.html',
  styleUrls: ['./earned-biome.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DestroyService]
})
export class EarnedBiomeComponent implements OnInit {

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
    const currentDate = new Date();
    const tenDaysAgo = new Date(currentDate.getTime() - (10 * 24 * 60 * 60 * 1000));

    this.subgraphService.fetchAllEarnedByBiome$(Math.floor(tenDaysAgo.getTime() / 1000) + '', this.destroy$)
      .pipe(takeUntil(this.destroy$))
      .subscribe(val => {
        this.prepareChartData(val as DungeonEntity[]);
        this.isLoading = false;
        this.changeDetectorRef.detectChanges();
      });
  }

  private prepareChartData(value: DungeonEntity[]) {
    const convertToDateString = (timestamp: string): string => {
      const date = new Date(parseInt(timestamp) * 1000);
      return date.toISOString().split('T')[0];
    };

    const earnedByBiome: Record<string, Record<number, number>> = {};

    value.forEach(dungeon => {
      const biome = dungeon.logic.biome;
      const amount = dungeon.claimedTokens.length > 0 ? +formatUnits(dungeon.claimedTokens[0].amount) : 0;
      const timestamp = dungeon.claimedTokens.length > 0 ? dungeon.claimedTokens[0].timestamp : '0';
      const date = convertToDateString(timestamp);
      if (!earnedByBiome[date]) {
        earnedByBiome[date] = {};
      }
      if (!earnedByBiome[date][biome]) {
        earnedByBiome[date][biome] = 0;
      }
      earnedByBiome[date][biome] += amount;
    });

    const dates = Object.keys(earnedByBiome).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

    const biomes = Object.keys(earnedByBiome[dates[0]]).sort();

    const series: any[] = biomes.map(biome => {
      return {
        name: biome,
        type: 'line',
        data: dates.map(val => +(earnedByBiome[val][+biome] || 0).toFixed(2)),
      }
    })

    this.options = {
      legend: {
        data: biomes,
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
