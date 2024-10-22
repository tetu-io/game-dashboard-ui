import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DestroyService } from '../../services/destroy.service';
import { SubgraphService } from '../../services/subgraph.service';
import { ApiService } from '../../services/api.service';
import { getChainId } from '../../shared/constants/network.constant';
import { StoryPassedModel } from '../../models/story-passed.model';
import { takeUntil } from 'rxjs';
import { saveAs } from 'file-saver';
import { format } from 'date-fns';

@Component({
  selector: 'app-table-passed-story-page',
  templateUrl: './table-passed-story-page.component.html',
  styleUrls: ['./table-passed-story-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TablePassedStoryPageComponent implements OnInit {

  columns = [
    {
      title: 'Story ID',
      compare: (a: StoryPassedModel, b: StoryPassedModel) => a.storyId - (b.storyId),
    },
    {
      title: 'Page ID',
      compare: (a: StoryPassedModel, b: StoryPassedModel) => a.pageId - (b.pageId),
    },
  ]

  isLoading = false;
  network: string = '';
  chainId: number = 0;
  tableData: StoryPassedModel[] = [];

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
    this.apiService.getPassedStoryPage(this.chainId)
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe(data => {
        this.isLoading = false;
        this.tableData = data;

        this.changeDetectorRef.detectChanges();
      });
  }

  exportToCsv() {
    const csvData = this.tableData.map(story => {
      return {
        'Story ID': story.storyId,
        'Page ID': story.pageId,
      }
    });
    const csvContent = this.convertToCSV(csvData);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `${this.chainId}-${format(new Date(), 'yyyy-MM-dd_HH:mm:ss')}-story-page-not-passed.csv`);
  }


  convertToCSV(objArray: any[]): string {
    const array = [Object.keys(objArray[0])].concat(objArray);
    return array.map(it => {
      return Object.values(it).toString();
    }).join('\n');
  }
}
