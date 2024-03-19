import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { DestroyService } from '../../services/destroy.service';
import { SubgraphService } from '../../services/subgraph.service';
import { ColumnItem } from '../../models/column-item.interface';
import { StoryPageEntity } from '../../../../generated/gql';
import { DEFAULT_TABLE_SIZE } from '../../shared/constants/table.constant';
import { takeUntil } from 'rxjs';

interface StoryPageCount {
  storyId: string,
  heroPage: string,
  count: number
}

@Component({
  selector: 'app-story-stat',
  templateUrl: './story-stat.component.html',
  styleUrls: ['./story-stat.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StoryStatComponent implements OnInit {

  columns: ColumnItem<StoryPageCount>[] = [
    {
      name: 'Story ID',
      sortFn: (a: StoryPageCount, b: StoryPageCount) => a.storyId.localeCompare(b.storyId),
      sortDirections: ['ascend', 'descend', null],
    },
    {
      name: 'Page',
      sortFn: (a: StoryPageCount, b: StoryPageCount) => +a.heroPage - +(b.heroPage),
      sortDirections: ['ascend', 'descend', null],
    },
    {
      name: 'Count',
      sortFn: (a: StoryPageCount, b: StoryPageCount) => a.count - b.count,
      sortDirections: ['ascend', 'descend', null],
    }
  ];

  preparedData: StoryPageCount[] = [];
  data: StoryPageEntity[] = [];
  pageSize = DEFAULT_TABLE_SIZE;
  isLoading = false;

  constructor(
    private destroy$: DestroyService,
    private changeDetectorRef: ChangeDetectorRef,
    private subgraphService: SubgraphService) { }

  ngOnInit(): void {
    this.subgraphService.networkObserver.subscribe(() => {
      this.isLoading = true;
      this.changeDetectorRef.detectChanges();
      this.prepareData();
    })
  }

  prepareData(): void {
    this.isLoading = true;
    this.subgraphService.fetchAllStories$()
      .pipe(takeUntil(this.destroy$))
      .subscribe(users => {
        if (users) {
          this.data = users as StoryPageEntity[];
          this.prepare();
        }
        this.isLoading = false;
        this.changeDetectorRef.detectChanges();
      })
  }

  prepare(): void {
    const countStoryIdHeroPageCombinations = (entities: StoryPageEntity[]): Record<string, number> => {
      return entities.reduce((acc, { storyId, heroPage }) => {
        const key = `${storyId}_${heroPage}`;
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
    };

    const storyIdCounts = countStoryIdHeroPageCombinations(this.data);

    this.preparedData = Object.entries(storyIdCounts).map(([combination, count]) => {
      const [storyId, heroPage] = combination.split('_');
      return { storyId, heroPage, count };
    });
  }
}
