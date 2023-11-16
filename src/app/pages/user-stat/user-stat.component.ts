import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { NzTableFilterFn, NzTableFilterList, NzTableSortFn, NzTableSortOrder } from 'ng-zorro-antd/table';
import { SubgraphService } from '../../services/subgraph.service';
import { DestroyService } from '../../services/destroy.service';
import { NGXLogger } from 'ngx-logger';
import { takeUntil } from 'rxjs';
import { UserEntity } from '../../../../generated/gql';
import { ColumnItem } from '../../models/column-item.interface';
import { DEFAULT_TABLE_SIZE } from '../../shared/constants/table.constant';

@Component({
  selector: 'app-user-stat',
  templateUrl: './user-stat.component.html',
  styleUrls: ['./user-stat.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserStatComponent implements OnInit {

  columns: ColumnItem<UserEntity>[] = [
    {
      name: 'Address',
      sortFn: (a: UserEntity, b: UserEntity) => a.id.localeCompare(b.id),
      sortDirections: ['ascend', 'descend', null],
    },
    {
      name: 'Heroes count',
      sortFn: (a: UserEntity, b: UserEntity) => a.heroes.length - b.heroes.length,
      sortDirections: ['ascend', 'descend', null],
    }
  ];

  data: UserEntity[] = [];
  pageSize = DEFAULT_TABLE_SIZE;

  constructor(
    private destroy$: DestroyService,
    private changeDetectorRef: ChangeDetectorRef,
    private subgraphService: SubgraphService) { }

  ngOnInit(): void {
    this.subgraphService.users$()
      .pipe(takeUntil(this.destroy$))
      .subscribe(users => {
        if (users) {
          this.data = users as UserEntity[];
        }
        this.changeDetectorRef.detectChanges();
    })
  }
}
