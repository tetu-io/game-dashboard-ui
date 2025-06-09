import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DestroyService } from '../../services/destroy.service';
import { SubgraphService } from '../../services/subgraph.service';
import { ApiService } from '../../services/api.service';
import { ItemMintStoryStatModel } from '../../models/item-mint-story-stat.model';
import { getChainId } from '../../shared/constants/network.constant';
import { takeUntil } from 'rxjs';
import { saveAs } from 'file-saver';
import { format } from 'date-fns';

@Component({
  selector: 'app-table-item-mint-story-stat',
  templateUrl: './table-item-mint-story-stat.component.html',
  styleUrls: ['./table-item-mint-story-stat.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableItemMintStoryStatComponent implements OnInit {

  columns = [
    {
      title: 'Story ID',
      compare: (a: ItemMintStoryStatModel, b: ItemMintStoryStatModel) => a.storyId.localeCompare(b.storyId),
    },
    {
      title: 'Total Items',
      compare: (a: ItemMintStoryStatModel, b: ItemMintStoryStatModel) => a.totalItems - b.totalItems,
    },
    {
      title: 'Items Per Story',
      compare: (a: ItemMintStoryStatModel, b: ItemMintStoryStatModel) => a.itemsPerStory - b.itemsPerStory,
    },
    {
      title: 'Total Passed Story',
      compare: (a: ItemMintStoryStatModel, b: ItemMintStoryStatModel) => a.totalPassedStory - b.totalPassedStory,
    },
    {
      title: 'Percent Items',
      compare: (a: ItemMintStoryStatModel, b: ItemMintStoryStatModel) => +a.percentItems - +b.percentItems,
    },
  ]
  isLoading = false;
  network: string = '';
  chainId: number = 0;
  tableData: ItemMintStoryStatModel[] = [];
  date: string = '';

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
    this.apiService.getItemsMintInStory(this.chainId)
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe(response => {
        this.isLoading = false;
        const data = response?.data ?? [];
        this.date = response?.time ?? '';
        this.tableData = data;
        this.mins = [];
        this.maxs = [];

        // storyId
        this.mins.push(0);
        this.maxs.push(0);

        this.mins.push(Math.min(...data.map(item => item.totalItems)));
        this.maxs.push(Math.max(...data.map(item => item.totalItems)));
        this.mins.push(Math.min(...data.map(item => item.itemsPerStory)));
        this.maxs.push(Math.max(...data.map(item => item.itemsPerStory)));
        this.mins.push(Math.min(...data.map(item => item.totalPassedStory)));
        this.maxs.push(Math.max(...data.map(item => item.totalPassedStory)));

        // percentItems
        this.mins.push(0);
        this.maxs.push(100);

        this.changeDetectorRef.detectChanges();
      });
  }

  getStyle(value: number, index: number) {
    const color = this.getColor(value, this.mins[index], this.maxs[index]);
    let baseColor = '255, 165, 0';

    if (index === 2 || index === 3) {
      baseColor = '76, 123, 80';
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
    return max / 100 * value / 100;
  }

  exportToCsv() {
    const csvData = this.tableData.map(item => {
      return {
        'Story ID': item.storyId,
        'Total Items': item.totalItems,
        'Items Per Story': item.itemsPerStory,
        'Total Passed Story': item.totalPassedStory,
        'Percent Items': item.percentItems,
      }
    });
    const csvContent = this.convertToCSV(csvData);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `${this.chainId}-${format(new Date(), 'yyyy-MM-dd_HH:mm:ss')}-item-mint-in-story.csv`);
  }


  convertToCSV(objArray: any[]): string {
    const array = [Object.keys(objArray[0])].concat(objArray);
    return array.map(it => {
      return Object.values(it).toString();
    }).join('\n');
  }
}
