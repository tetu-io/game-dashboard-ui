import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DestroyService } from '../../services/destroy.service';
import { TokenService } from '../../services/onchain/token.service';
import { EChartsOption } from 'echarts';
import { SubgraphService } from '../../services/subgraph.service';
import { getChainId, NETWORKS } from '../../shared/constants/network.constant';
import { forkJoin, takeUntil } from 'rxjs';
import { GET_CORE_ADDRESSES } from '../../shared/constants/addresses.constant';
import { formatUnits } from 'ethers';

@Component({
  selector: 'app-treasury-history',
  templateUrl: './treasury-history.component.html',
  styleUrls: ['./treasury-history.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TreasuryHistoryComponent implements OnInit {
  network: string = '';
  chainId: number = 0;

  options: EChartsOption = {};
  isLoading = false;

  startBlockByNetwork: Record<string, number> = {
    'fantom': 80026087,
    'sonic': 531549,
  };

  rangeBlockByNetwork: Record<string, number> = {
    'fantom': 1026087,
    'sonic': 1031549,
  };

  constructor(
    private destroy$: DestroyService,
    private changeDetectorRef: ChangeDetectorRef,
    private tokenService: TokenService,
    private subgraphService: SubgraphService,
  ) {
  }

  ngOnInit(): void {
    this.subgraphService.networkObserver.subscribe(network => {
      this.network = network;
      this.chainId = getChainId(network);
      this.isLoading = true;
      this.changeDetectorRef.detectChanges();
      this.prepareData();
    });
  }

  private prepareData(): void {
    this.isLoading = true;
    this.subgraphService.graphData$()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data) {
          const blocks: number[] = [];
          const targetBlock = data.block.number;
          let currentBlock = this.startBlockByNetwork[this.network];


          while (currentBlock < targetBlock) {
            blocks.push(currentBlock);
            currentBlock += this.rangeBlockByNetwork[this.network];
          }

          forkJoin({
            game: forkJoin(blocks.map(block => this.tokenService.balanceOf$(
              GET_CORE_ADDRESSES(this.chainId).gameToken,
              this.chainId,
              block,
              GET_CORE_ADDRESSES(this.chainId).treasury,
            ))),
            magic: forkJoin(blocks.map(block => this.tokenService.balanceOf$(
              GET_CORE_ADDRESSES(this.chainId).magicToken,
              this.chainId,
              block,
              GET_CORE_ADDRESSES(this.chainId).treasury,
            )))
          })
            .pipe(takeUntil(this.destroy$))
            .subscribe(({game, magic}) => {
              this.prepareChartData(blocks, game.map(i => +formatUnits(i)), magic.map(i => +formatUnits(i)));
              this.isLoading = false;
              this.changeDetectorRef.detectChanges();
            });
        }
      });
  }

  private prepareChartData(blocks: number[], game: number[], magic: number[]) {

    this.options = {
      legend: {
        data: ['Sacra', 'wFTM'],
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
        data: blocks,
        type: 'category',
        boundaryGap: false,
        axisLine: { onZero: false },
      },
      yAxis: {
        minInterval: 1
      },
      series: [
        {
          name: 'Sacra',
          type: 'line',
          data: game,
        },
        {
          name: 'wFTM',
          type: 'line',
          data: magic,
        },
      ],
      animationEasing: 'elasticOut',
      animationDelayUpdate: idx => idx * 5,
    };
  }

}
