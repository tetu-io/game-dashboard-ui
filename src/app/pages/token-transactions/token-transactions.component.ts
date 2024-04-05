import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DestroyService } from '../../services/destroy.service';
import { SubgraphService } from '../../services/subgraph.service';
import { mergeMap, takeUntil } from 'rxjs';
import { TokenTransactionEntity } from '../../../../generated/gql';
import { DEFAULT_TABLE_SIZE } from '../../shared/constants/table.constant';
import { ColumnItem } from '../../models/column-item.interface';
import { TransactionItemInterface } from '../../models/transaction-item.interface';
import { Formatter } from '../../shared/utils/formatter';
import { formatUnits } from 'ethers';

@Component({
  selector: 'app-token-transactions',
  templateUrl: './token-transactions.component.html',
  styleUrls: ['./token-transactions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TokenTransactionsComponent implements OnInit {

  columns: ColumnItem<TokenTransactionEntity>[] = [
    {
      name: 'From',
      sortFn: (a: TokenTransactionEntity, b: TokenTransactionEntity) => a.from.localeCompare(b.from),
      sortDirections: ['ascend', 'descend', null],
    },
    {
      name: 'To',
      sortFn: (a: TokenTransactionEntity, b: TokenTransactionEntity) => a.to.localeCompare(b.to),
      sortDirections: ['ascend', 'descend', null],
    },
    {
      name: `Amount`,
      sortFn: (a: TokenTransactionEntity, b: TokenTransactionEntity) => a.amount.localeCompare(b.amount),
      sortDirections: ['ascend', 'descend', null],
    },
    {
      name: `Block`,
      sortFn: (a: TokenTransactionEntity, b: TokenTransactionEntity) => a.createdAtBlock.localeCompare(b.createdAtBlock),
      sortDirections: ['ascend', 'descend', null],
    },
  ];

  isLoading = false;
  transactions: TransactionItemInterface[] = [];
  pageSize = DEFAULT_TABLE_SIZE;

  constructor(
    private destroy$: DestroyService,
    private changeDetectorRef: ChangeDetectorRef,
    private subgraphService: SubgraphService,
  ) { }

  ngOnInit(): void {
    this.subgraphService.networkObserver.subscribe(network => {
      this.prepareData();
    });
  }

  prepareData(): void {
    this.isLoading = true;
    this.subgraphService.controller$()
      .pipe(
        mergeMap(controller => {
          if (controller.length > 0) {
            return this.subgraphService.fetchAllTokenTransactions$(controller[0].gameToken.toLowerCase())
          }
          return [];
        }),
        takeUntil(this.destroy$)
      )
      .subscribe(transactions => {
        if (transactions) {
          this.transactions = (transactions as TokenTransactionEntity[]).map(tx => {
            return {
              ...tx,
              amountFormatted: Formatter.prettyNumber(+formatUnits(tx.amount, 18)),
              // TODO add repeat
              repeat: 1
            }
          });
        }
        this.isLoading = false;
        this.changeDetectorRef.detectChanges();
      })
  }
}
