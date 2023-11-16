import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { DEFAULT_TABLE_SIZE } from '../../shared/constants/table.constant';
import { ColumnItem } from '../../models/column-item.interface';
import { DestroyService } from '../../services/destroy.service';
import { SubgraphService } from '../../services/subgraph.service';
import { takeUntil } from 'rxjs';
import { ItemEntity } from '../../../../generated/gql';

@Component({
  selector: 'app-item-stat',
  templateUrl: './item-stat.component.html',
  styleUrls: ['./item-stat.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemStatComponent implements OnInit {

  columns: ColumnItem<ItemEntity>[] = [
    {
      name: 'Address + ID',
      sortFn: (a: ItemEntity, b: ItemEntity) => a.id.localeCompare(b.id),
      sortDirections: ['ascend', 'descend', null],
    },
    {
      name: 'Score',
      sortFn: (a: ItemEntity, b: ItemEntity) => a.score - b.score,
      sortDirections: ['ascend', 'descend', null],
    },
    {
      name: 'Augmentation level',
      sortFn: (a: ItemEntity, b: ItemEntity) => a.augmentationLevel - b.augmentationLevel,
      sortDirections: ['ascend', 'descend', null],
    },
    {
      name: 'Rarity',
      sortFn: (a: ItemEntity, b: ItemEntity) => a.rarity - b.rarity,
      sortDirections: ['ascend', 'descend', null],
    },
    {
      name: 'Owner',
      sortFn: (a: ItemEntity, b: ItemEntity) => (a.user?.id || '').localeCompare((b.user?.id || '')),
      sortDirections: ['ascend', 'descend', null],
    },
  ];

  data: ItemEntity[] = [];

  pageSize = DEFAULT_TABLE_SIZE;


  constructor(
    private destroy$: DestroyService,
    private changeDetectorRef: ChangeDetectorRef,
    private subgraphService: SubgraphService,
  ) {}

  ngOnInit(): void {
    this.subgraphService.items$()
      .pipe(takeUntil(this.destroy$))
      .subscribe(items => {
        if (items) {
          this.data = items as ItemEntity[];
        }
        this.changeDetectorRef.detectChanges();
      })
  }

}
