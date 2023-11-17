import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { SubgraphService } from '../../services/subgraph.service';
import { DestroyService } from '../../services/destroy.service';
import { takeUntil } from 'rxjs';
import { UserEntity } from '../../../../generated/gql';
import { ColumnItem } from '../../models/column-item.interface';
import { DEFAULT_TABLE_SIZE } from '../../shared/constants/table.constant';
import { UserItemInterface } from '../../models/user-item.interface';

@Component({
  selector: 'app-user-stat',
  templateUrl: './user-stat.component.html',
  styleUrls: ['./user-stat.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserStatComponent implements OnInit {

  columns: ColumnItem<UserItemInterface>[] = [
    {
      name: 'Address',
      sortFn: (a: UserItemInterface, b: UserItemInterface) => a.id.localeCompare(b.id),
      sortDirections: ['ascend', 'descend', null],
    },
    {
      name: 'Heroes count',
      sortFn: (a: UserItemInterface, b: UserItemInterface) => a.heroes.length - b.heroes.length,
      sortDirections: ['ascend', 'descend', null],
    },
    {
      name: `Items count`,
      sortFn: (a: UserItemInterface, b: UserItemInterface) => a.itemsSize - b.itemsSize,
      sortDirections: ['ascend', 'descend', null],
    },
  ];

  data: UserItemInterface[] = [];
  pageSize = DEFAULT_TABLE_SIZE;

  constructor(
    private destroy$: DestroyService,
    private changeDetectorRef: ChangeDetectorRef,
    private subgraphService: SubgraphService
  ) { }

  ngOnInit(): void {
    this.subgraphService.users$()
      .pipe(takeUntil(this.destroy$))
      .subscribe(users => {
        if (users) {
          this.data = (users as UserEntity[]).map(user => {
            const itemsSize = user.items.length + user.heroes.reduce((sum, hero) => sum + hero.items.length, 0);
            return {
              ...user,
              itemsSize
            };
          }) as UserItemInterface[];
        }

        const totalItemsSize = this.data.reduce((sum, user) => sum + user.itemsSize, 0);
        const averageItemsSize = this.data.length > 0 ? totalItemsSize / users.length : 0;


        this.columns.forEach(column => {
          if (column.name == 'Items count') {
            column.name = `Items count, (average ~ ${Math.round(averageItemsSize)})`;
          }
        })
        this.changeDetectorRef.detectChanges();
    })
  }
}
