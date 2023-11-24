import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { DEFAULT_TABLE_SIZE } from '../../shared/constants/table.constant';
import { ColumnItem } from '../../models/column-item.interface';
import { DestroyService } from '../../services/destroy.service';
import { SubgraphService } from '../../services/subgraph.service';
import { takeUntil } from 'rxjs';
import { ItemEntity } from '../../../../generated/gql';
import { ItemInterface } from '../../models/item.interface';

@Component({
  selector: 'app-item-stat',
  templateUrl: './item-stat.component.html',
  styleUrls: ['./item-stat.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemStatComponent implements OnInit {

  columns: ColumnItem<ItemInterface>[] = [
    {
      name: 'Address + ID',
      sortFn: (a: ItemInterface, b: ItemInterface) => a.id.localeCompare(b.id),
      sortDirections: ['ascend', 'descend', null],
    },
    {
      name: 'Score',
      sortFn: (a: ItemInterface, b: ItemInterface) => a.score - b.score,
      sortDirections: ['ascend', 'descend', null],
    },
    {
      name: 'Augmentation level',
      sortFn: (a: ItemInterface, b: ItemInterface) => a.augmentationLevel - b.augmentationLevel,
      sortDirections: ['ascend', 'descend', null],
    },
    {
      name: 'Rarity',
      sortFn: (a: ItemInterface, b: ItemInterface) => a.rarity - b.rarity,
      sortDirections: ['ascend', 'descend', null],
    },
    // {
    //   name: 'Augmentation count',
    //   sortFn: (a: ItemInterface, b: ItemInterface) => a.augmentedCount - b.augmentedCount,
    //   sortDirections: ['ascend', 'descend', null],
    // },
    {
      name: 'Repaired count',
      sortFn: (a: ItemInterface, b: ItemInterface) => a.repairedCount - b.repairedCount,
      sortDirections: ['ascend', 'descend', null],
    },
    // {
    //   name: 'Destroyed count',
    //   sortFn: (a: ItemInterface, b: ItemInterface) => a.destroyedCount - b.destroyedCount,
    //   sortDirections: ['ascend', 'descend', null],
    // },
    {
      name: 'Owner',
      sortFn: (a: ItemInterface, b: ItemInterface) => a.owner.localeCompare(b.owner),
      sortDirections: ['ascend', 'descend', null],
    },
  ];

  data: ItemInterface[] = [];
  isLoading = false;

  pageSize = DEFAULT_TABLE_SIZE;


  constructor(
    private destroy$: DestroyService,
    private changeDetectorRef: ChangeDetectorRef,
    private subgraphService: SubgraphService,
  ) {}

  ngOnInit(): void {

    this.subgraphService.networkObserver.subscribe(() => {
      this.isLoading = true;
      this.changeDetectorRef.detectChanges();
      this.prepareData();
    })
  }

  prepareData(): void {
    this.isLoading = true;
    this.subgraphService.items$()
      .pipe(takeUntil(this.destroy$))
      .subscribe(items => {
        if (items) {
          this.data = (items as ItemEntity[]).map(item => {

            let augmentedCount = 0;
            let repairedCount = 0;
            let destroyedCount = 0;

            if (item.actions) {
              item.actions.forEach(action => {
                if (action.action === "DESTROYED") {
                  destroyedCount += 1;
                } else if (action.action === "AUGMENTED") {
                  augmentedCount += 1;
                } else if (action.action === "REPAIRED") {
                  repairedCount += 1;
                }
              });
            }

            const owner = item.hero?.owner.id || item.user?.id || 'None';

            return {
              destroyedCount,
              repairedCount,
              augmentedCount,
              owner,
              ...item
            } as ItemInterface
          });

          const totalCounts = {
            destroyedCount: 0,
            repairedCount: 0,
            augmentedCount: 0,
          };

          this.data.forEach(item => {
            totalCounts.destroyedCount += item.destroyedCount;
            totalCounts.repairedCount += item.repairedCount;
            totalCounts.augmentedCount += item.augmentedCount;
          })

          const averages = {
            destroyedAverage: this.data.length > 0 ? totalCounts.destroyedCount / this.data.length : 0,
            repairedAverage: this.data.length > 0 ? totalCounts.repairedCount / this.data.length : 0,
            augmentedAverage: this.data.length > 0 ? totalCounts.augmentedCount / this.data.length : 0,
          };


          this.columns.forEach(column => {
            if (column.name == 'Destroyed count') {
              column.name = `Destroyed count, (average ~ ${Math.round(averages.destroyedAverage)})`;
            }
            if (column.name == 'Repaired count') {
              column.name = `Repaired count, (average ~ ${Math.round(averages.repairedAverage)})`;
            }
            if (column.name == 'Augmentation count') {
              column.name = `Augmentation count, (average ~ ${Math.round(averages.augmentedAverage)})`;
            }
          })
        }

        this.isLoading = false;
        this.changeDetectorRef.detectChanges();
      })
  }

}
