import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DestroyService } from '../../services/destroy.service';
import { SubgraphService } from '../../services/subgraph.service';
import { ApiService } from '../../services/api.service';
import { getChainId } from '../../shared/constants/network.constant';
import { ItemGeneralStatModel } from '../../models/item-general-stat.model';
import { takeUntil } from 'rxjs';

@Component({
  selector: 'app-table-item-general-stat',
  templateUrl: './table-item-general-stat.component.html',
  styleUrls: ['./table-item-general-stat.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableItemGeneralStatComponent implements OnInit {

  columns = [
    {
      title: 'Name',
      compare: (a: ItemGeneralStatModel, b: ItemGeneralStatModel) => a.name.localeCompare(b.name),
    },
    {
      title: 'Total Items',
      compare: (a: ItemGeneralStatModel, b: ItemGeneralStatModel) => a.count - b.count,
    },
    {
      title: 'Burned Items',
      compare: (a: ItemGeneralStatModel, b: ItemGeneralStatModel) => a.burned - b.burned,
    },
    {
      title: 'Items Exists',
      compare: (a: ItemGeneralStatModel, b: ItemGeneralStatModel) => a.exist - b.exist,
    },
    {
      title: 'Burned %',
      compare: (a: ItemGeneralStatModel, b: ItemGeneralStatModel) => +a.burnedPercent - +b.burnedPercent,
    },
    {
      title: 'Items on Pawnshop',
      compare: (a: ItemGeneralStatModel, b: ItemGeneralStatModel) => a.itemsInPawnshop - b.itemsInPawnshop,
    },
    {
      title: 'Pawnshop %',
      compare: (a: ItemGeneralStatModel, b: ItemGeneralStatModel) => +a.itemsInPawnshopPercent - +b.itemsInPawnshopPercent,
    },
    {
      title: 'FLUR price',
      compare: (a: ItemGeneralStatModel, b: ItemGeneralStatModel) => a.flurPrice - b.flurPrice,
    },
    {
      title: 'Biome',
      compare: (a: ItemGeneralStatModel, b: ItemGeneralStatModel) => a.biome - b.biome,
    },
    {
      title: 'Rarity',
      compare: (a: ItemGeneralStatModel, b: ItemGeneralStatModel) => a.rarity.localeCompare(b.rarity),
    },
    {
      title: 'Total value',
      compare: (a: ItemGeneralStatModel, b: ItemGeneralStatModel) => a.sumCost - b.sumCost,
    },
    {
      title: 'Total value in Pawnshop',
      compare: (a: ItemGeneralStatModel, b: ItemGeneralStatModel) => a.sumCostPawnshop - b.sumCostPawnshop,
    }
  ]
  tableData: ItemGeneralStatModel[] = [];
  isLoading = false;
  network: string = '';
  chainId: number = 0;

  mins: number[] = [];
  maxs: number[] = [];

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
    this.apiService.getGeneralItems(this.chainId)
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe(data => {
      this.isLoading = false;
      this.tableData = data;
      this.mins = [];
      this.maxs = [];

      // name
      this.mins.push(0);
      this.maxs.push(0);

      this.mins.push(Math.min(...data.map(item => item.count)));
      this.maxs.push(Math.max(...data.map(item => item.count)));
      this.mins.push(Math.min(...data.map(item => item.burned)));
      this.maxs.push(Math.max(...data.map(item => item.burned)));
      this.mins.push(Math.min(...data.map(item => item.exist)));
      this.maxs.push(Math.max(...data.map(item => item.exist)));

      // burnedPercent
      this.mins.push(0);
      this.maxs.push(0);

      this.mins.push(Math.min(...data.map(item => item.itemsInPawnshop)));
      this.maxs.push(Math.max(...data.map(item => item.itemsInPawnshop)));

      // itemsInPawnshopPercent
      this.mins.push(0);
      this.maxs.push(0);

      this.mins.push(Math.min(...data.map(item => item.flurPrice)));
      this.maxs.push(Math.max(...data.map(item => item.flurPrice)));
      this.mins.push(Math.min(...data.map(item => item.biome)));
      this.maxs.push(Math.max(...data.map(item => item.biome)));

      // rarity
      this.mins.push(0);
      this.maxs.push(0);

      this.mins.push(Math.min(...data.map(item => item.sumCost)));
      this.maxs.push(Math.max(...data.map(item => item.sumCost)));

      this.mins.push(Math.min(...data.map(item => item.sumCostPawnshop)));
      this.maxs.push(Math.max(...data.map(item => item.sumCostPawnshop)));

      this.changeDetectorRef.detectChanges();
    });
  }

  getStyle(value: number, index: number) {
    const color = this.getColor(value, this.mins[index], this.maxs[index]);
    let baseColor = '255, 165, 0';

    if (index === 2 || index === 3) {
      baseColor = '76, 175, 80';
    } else if (index === 5 || index === 6) {
      baseColor = '244, 67, 54';
    }

    return {
      background: `rgba(${baseColor}, ${color})`,
    };
  }

  getPercentageStyle(percentage: number) {
    const color = percentage / 100;
    return {
      background: `rgba(255, 165, 0, ${color})`,
    };
  }

  getColor(value: number, min: number, max: number): number {
    // if (max === min) return 1;
    // const normalized = (value - min) / (max - min);
    // return Math.min(Math.max(normalized, 0.5), 1);

    // TODO change logic
    return max / 100 * value / 100;
  }

}
