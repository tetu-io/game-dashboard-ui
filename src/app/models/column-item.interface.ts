import { NzTableSortFn, NzTableSortOrder } from 'ng-zorro-antd/table';

export interface ColumnItem<T> {
  name: string;
  sortFn: NzTableSortFn<T> | null;
  sortDirections: NzTableSortOrder[];
}