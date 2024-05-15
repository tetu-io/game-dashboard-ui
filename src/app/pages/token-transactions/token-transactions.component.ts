import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DestroyService } from '../../services/destroy.service';
import { SubgraphService } from '../../services/subgraph.service';
import { mergeMap, takeUntil } from 'rxjs';
import { TokenTransactionEntity } from '../../../../generated/gql';
import { DEFAULT_TABLE_SIZE } from '../../shared/constants/table.constant';
import { ColumnItem } from '../../models/column-item.interface';
import { formatUnits } from 'ethers';
import { TokenBalance } from '../../models/token-balance.interface';
import { GET_CORE_ADDRESSES } from '../../shared/constants/addresses.constant';
import { getChainId, getPools, getSkipAddresses } from '../../shared/constants/network.constant';

@Component({
  selector: 'app-token-transactions',
  templateUrl: './token-transactions.component.html',
  styleUrls: ['./token-transactions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TokenTransactionsComponent implements OnInit {

  columns: ColumnItem<TokenBalance>[] = [
    {
      name: 'Address',
      sortFn: (a: TokenBalance, b: TokenBalance) => a.address.localeCompare(b.address),
      sortDirections: ['ascend', 'descend', null],
    },
    {
      name: 'From pool (buy Sacra)',
      sortFn: (a: TokenBalance, b: TokenBalance) => a.fromPoolUsd - b.fromPoolUsd,
      sortDirections: ['ascend', 'descend', null],
    },
    {
      name: `To pool (sell Sacra)`,
      sortFn: (a: TokenBalance, b: TokenBalance) => a.toPoolUsd - b.toPoolUsd,
      sortDirections: ['ascend', 'descend', null],
    },
    {
      name: `Earned`,
      sortFn: (a: TokenBalance, b: TokenBalance) => a.earned - b.earned,
      sortDirections: ['ascend', 'descend', null],
    },
    {
      name: `Dungeon`,
      sortFn: (a: TokenBalance, b: TokenBalance) => a.fromDungeon - b.fromDungeon,
      sortDirections: ['ascend', 'descend', null],
    },
    {
      name: `Other`,
      sortFn: (a: TokenBalance, b: TokenBalance) => a.other - b.other,
      sortDirections: ['ascend', 'descend', null],
    },
  ];

  isLoading = false;
  tokenBalances: TokenBalance[] = [];
  pageSize = DEFAULT_TABLE_SIZE;
  network: string = '';
  chainId: number = 0;

  constructor(
    private destroy$: DestroyService,
    private changeDetectorRef: ChangeDetectorRef,
    private subgraphService: SubgraphService,
  ) { }

  ngOnInit(): void {
    this.subgraphService.networkObserver.subscribe(network => {
      this.network = network;
      this.chainId = getChainId(network);
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
        this.tokenBalances = [];
        const tokenBalanceRecord: Record<string, TokenBalance> = {};
        if (transactions) {
          for (let tx of transactions) {
            if (this.skipAddresses(tx.from) || this.skipAddresses(tx.to)) {
              continue;
            }
            const amount = parseFloat(formatUnits(tx.amount, 18));
            if (this.isPool(tx.from)) {
              if (!tokenBalanceRecord[tx.to]) {
                tokenBalanceRecord[tx.to] = {
                  address: tx.to,
                  fromPool: 0,
                  fromPoolUsd: 0,
                  fromDungeon: 0,
                  toPool: 0,
                  toPoolUsd: 0,
                  other: 0,
                  earned: 0,
                }
              }
              tokenBalanceRecord[tx.to].fromPool += amount;
              tokenBalanceRecord[tx.to].fromPoolUsd += amount * +tx.price;
              // to pool
            } else if (this.isPool(tx.to)) {
              if (!tokenBalanceRecord[tx.from]) {
                tokenBalanceRecord[tx.from] = {
                  address: tx.from,
                  fromPool: 0,
                  fromPoolUsd: 0,
                  fromDungeon: 0,
                  toPool: 0,
                  toPoolUsd: 0,
                  other: 0,
                  earned: 0,
                }
              }
              tokenBalanceRecord[tx.from].toPool += amount;
              tokenBalanceRecord[tx.from].toPoolUsd += amount * +tx.price;
            } else if (this.isDungeon(tx.from)) {
              if (!tokenBalanceRecord[tx.to]) {
                tokenBalanceRecord[tx.to] = {
                  address: tx.to,
                  fromPool: 0,
                  fromPoolUsd: 0,
                  fromDungeon: 0,
                  toPool: 0,
                  toPoolUsd: 0,
                  other: 0,
                  earned: 0,
                }
              }
              tokenBalanceRecord[tx.to].fromDungeon += amount;
            } else {
              if (!(this.isDungeon(tx.to))) {
                if (!tokenBalanceRecord[tx.from]) {
                  tokenBalanceRecord[tx.from] = {
                    address: tx.from,
                    fromPool: 0,
                    fromPoolUsd: 0,
                    fromDungeon: 0,
                    toPool: 0,
                    toPoolUsd: 0,
                    other: 0,
                    earned: 0,
                  }
                }
                tokenBalanceRecord[tx.from].other -= amount;
                if (!tokenBalanceRecord[tx.to]) {
                  tokenBalanceRecord[tx.to] = {
                    address: tx.to,
                    fromPool: 0,
                    fromPoolUsd: 0,
                    fromDungeon: 0,
                    toPool: 0,
                    toPoolUsd: 0,
                    other: 0,
                    earned: 0,
                  }
                }
                tokenBalanceRecord[tx.to].other += amount;
              }
            }
          }
        }
        Object.keys(tokenBalanceRecord).forEach(key => {
          const fromPoolUsd = +tokenBalanceRecord[key].fromPoolUsd.toFixed(1);
          const toPoolUsd = +tokenBalanceRecord[key].toPoolUsd.toFixed(1);
          this.tokenBalances.push({
            ...tokenBalanceRecord[key],
            fromPool: +tokenBalanceRecord[key].fromPool.toFixed(1),
            fromPoolUsd: fromPoolUsd,
            toPool: +tokenBalanceRecord[key].toPool.toFixed(1),
            toPoolUsd: toPoolUsd,
            fromDungeon: +tokenBalanceRecord[key].fromDungeon.toFixed(1),
            earned: +(toPoolUsd - fromPoolUsd).toFixed(1)
          })
        });
        this.isLoading = false;
        this.changeDetectorRef.detectChanges();
      })
  }

  isDungeon(address: string): boolean {
    return address.toLowerCase() === GET_CORE_ADDRESSES(this.chainId).dungeonFactory.toLowerCase();
  }

  isPool(address: string): boolean {
    return getPools(this.network).includes(address.toLowerCase());
  }

  skipAddresses(address: string): boolean {
    return getSkipAddresses(this.network).includes(address.toLowerCase());
  }
}
