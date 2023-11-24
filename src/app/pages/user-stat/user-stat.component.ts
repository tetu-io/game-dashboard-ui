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
  changeDetection: ChangeDetectionStrategy.OnPush,
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
    {
      name: `User earned`,
      sortFn: (a: UserItemInterface, b: UserItemInterface) => a.earn - b.earn,
      sortDirections: ['ascend', 'descend', null],
    },
  ];

  data: UserItemInterface[] = [];
  pageSize = DEFAULT_TABLE_SIZE;
  isLoading = false;

  constructor(
    private destroy$: DestroyService,
    private changeDetectorRef: ChangeDetectorRef,
    private subgraphService: SubgraphService,
  ) {
  }

  ngOnInit(): void {
    this.subgraphService.networkObserver.subscribe(() => {
      this.isLoading = true;
      this.changeDetectorRef.detectChanges();
      this.prepareData();
    })
  }

  prepareData(): void {
    this.isLoading = true;
    this.subgraphService.users$()
      .pipe(takeUntil(this.destroy$))
      .subscribe(users => {
        const tokenSumCounts: { [key: string]: { sum: number } } = {};

        if (users) {

          this.data = (users as UserEntity[]).map(user => {
            const itemsSize = user.items.length + user.heroes.reduce((sum, hero) => sum + hero.items.length, 0);

            const earn = +(user.heroes.map(hero => {
                return +hero.earned.map(val => {
                  if (+val.amount > 0) {
                    if (val.reinforcementStakedFee > 0) {
                      return +val.amount / (10 ** 18) * ((100 - val.reinforcementStakedFee) / 100);
                    }
                    return +val.amount / (10 ** 18);
                  }
                  return 0;
                }).reduce((accumulator, currentValue) => {
                  return accumulator + currentValue;
                }, 0);
              }).reduce((accumulator, currentValue) => {
                return accumulator + currentValue;
              }, 0)
            ).toFixed(2);

            const tokenSums: { [key: string]: number } = {};

            user.heroes.forEach(hero => {
              hero.earned.forEach((item) => {
                let amount = 0;
                const token = item.token;
                if (+item.amount > 0) {
                  if (item.reinforcementStakedFee > 0) {
                    amount = +item.amount / (10 ** 18) * ((100 - item.reinforcementStakedFee) / 100);
                  }
                  amount = +item.amount / (10 ** 18)
                }
                const tokenName = token.name;
                if (tokenSums[tokenName]) {
                  tokenSums[tokenName] += amount;
                } else {
                  tokenSums[tokenName] = amount;
                }

                // average logic
                if (tokenSumCounts[tokenName]) {
                  tokenSumCounts[tokenName].sum += amount;
                } else {
                  tokenSumCounts[tokenName] = { sum: amount };
                }
              });
            })

            const tokenList = Object.keys(tokenSums);
            const earnedList = Object.values(tokenSums);


            return {
              ...user,
              itemsSize,
              earn,
              tokenList,
              earnedList,
              tokenSums
            };
          }) as UserItemInterface[];
        }

        const totalItemsSize = this.data.reduce((sum, user) => sum + user.itemsSize, 0);
        const totalEarned = this.data.reduce((sum, user) => sum + user.earn, 0);
        const averageItemsSize = this.data.length > 0 ? totalItemsSize / users.length : 0;
        const averageEarned = this.data.length > 0 ? totalEarned / users.length : 0;

        // earn average logic
        const tokenAverages: { [key: string]: number } = {};
        for (const token in tokenSumCounts) {
          if (tokenSumCounts.hasOwnProperty(token)) {
            const { sum } = tokenSumCounts[token];
            tokenAverages[token] = +(sum / this.data.filter(a => a.earn > 0).length).toFixed(2);
          }
        }

        let tokenAverageColumn = '';
        for (const token in tokenAverages) {
          if (tokenAverages.hasOwnProperty(token)) {
            tokenAverageColumn = tokenAverageColumn + `average ~ ${tokenAverages[token]} ${token}\n`;
          }
        }


        this.columns.forEach(column => {
          if (column.name == 'Items count') {
            column.name = `Items count, (average ~ ${Math.round(averageItemsSize)})`;
          }
          if (column.name == 'User earned') {
            column.name = `User earned, (${tokenAverageColumn})`;
          }
        });
        this.isLoading = false;
        this.changeDetectorRef.detectChanges();
      });
  }
}
