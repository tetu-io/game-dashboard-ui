import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DestroyService } from '../../services/destroy.service';
import { SubgraphService } from '../../services/subgraph.service';
import { ApiService } from '../../services/api.service';
import { getChainId } from '../../shared/constants/network.constant';
import { ReinforcementV2StatModel } from '../../models/reinforcement-v2-stat.model';
import { takeUntil } from 'rxjs';

@Component({
  selector: 'app-reinforcement-v2',
  templateUrl: './reinforcement-v2.component.html',
  styleUrls: ['./reinforcement-v2.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReinforcementV2Component implements OnInit {

  columns = [
    {
      title: 'Biome',
      compare: (a: ReinforcementV2StatModel, b: ReinforcementV2StatModel) => a.biome - (b.biome),
    },
    {
      title: 'Call count',
      compare: (a: ReinforcementV2StatModel, b: ReinforcementV2StatModel) => a.callCount - (b.callCount),
    },
    {
      title: 'Call on the same count',
      compare: (a: ReinforcementV2StatModel, b: ReinforcementV2StatModel) => a.sameAccountCount - (b.sameAccountCount),
    },
    {
      title: 'Total yearn',
      compare: (a: ReinforcementV2StatModel, b: ReinforcementV2StatModel) => a.yearn - (b.yearn),
    },
    {
      title: 'Min',
      compare: (a: ReinforcementV2StatModel, b: ReinforcementV2StatModel) => a.min - (b.min),
    },
    {
      title: 'Max',
      compare: (a: ReinforcementV2StatModel, b: ReinforcementV2StatModel) => a.max - (b.max),
    }
  ]

  isLoading = false;
  network: string = '';
  chainId: number = 0;
  tableData: ReinforcementV2StatModel[] = [];

  constructor(
    private destroy$: DestroyService,
    private changeDetectorRef: ChangeDetectorRef,
    private subgraphService: SubgraphService,
    private apiService: ApiService
  ) { }

  ngOnInit(): void {
    this.subgraphService.networkObserver.subscribe(network => {
      this.network = network;
      this.chainId = getChainId(network);
      this.prepareData();
    });
  }

  prepareData() {
    this.isLoading = true;
    this.apiService.getReinforcementV2(this.chainId)
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe(data => {
        this.isLoading = false;
        this.tableData = data;

        this.changeDetectorRef.detectChanges();
      });
  }

}
