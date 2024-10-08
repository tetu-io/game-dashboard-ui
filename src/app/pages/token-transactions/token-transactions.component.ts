import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DestroyService } from '../../services/destroy.service';
import { SubgraphService } from '../../services/subgraph.service';
import { forkJoin, mergeMap, takeUntil } from 'rxjs';
import { DEFAULT_TABLE_SIZE } from '../../shared/constants/table.constant';
import { ColumnItem } from '../../models/column-item.interface';
import { formatUnits } from 'ethers';
import { TokenBalance } from '../../models/token-balance.interface';
import { GET_CORE_ADDRESSES } from '../../shared/constants/addresses.constant';
import { CHAIN_ID, getChainId, getPools, getSkipAddresses } from '../../shared/constants/network.constant';
import { UserEntity } from '../../../../generated/gql';

@Component({
  selector: 'app-token-transactions',
  templateUrl: './token-transactions.component.html',
  styleUrls: ['./token-transactions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DestroyService]
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
      name: `Reinforcement`,
      sortFn: (a: TokenBalance, b: TokenBalance) => a.reinforcement - b.reinforcement,
      sortDirections: ['ascend', 'descend', null],
    },
    {
      name: `From pawnshop (sell smth)`,
      sortFn: (a: TokenBalance, b: TokenBalance) => a.fromPawnshop - b.fromPawnshop,
      sortDirections: ['ascend', 'descend', null],
    },
    {
      name: `To pawnshop (buy smth)`,
      sortFn: (a: TokenBalance, b: TokenBalance) => a.toPawnshop - b.toPawnshop,
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
  totalUsers = 0;
  totalPlayers = 0;
  totalProfitPlayers = 0;
  usersNotFinishDung = 0;
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
    const gameToken = GET_CORE_ADDRESSES(this.chainId).gameToken.toLowerCase();
    forkJoin({
      pawnshopActions: this.subgraphService.fetchAllPawnshopExecuteActions$(this.destroy$),
      transactions: this.subgraphService.fetchAllTokenTransactions$(gameToken, this.destroy$),
      users: this.subgraphService.fetchAllUsersWithHero$(this.destroy$)
    })
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe(({ transactions, pawnshopActions, users }) => {
        this.tokenBalances = [];
        const tokenBalanceRecord: Record<string, TokenBalance> = {};
        if (transactions) {
          for (let tx of transactions) {
            let price = +tx.price;
            if (this.skipAddresses(tx.from) || this.skipAddresses(tx.to)) {
              continue;
            }
            const amount = parseFloat(formatUnits(tx.amount, 18));
            if (this.isPool(tx.from)) {
              if (!tokenBalanceRecord[tx.to]) {
                tokenBalanceRecord[tx.to] = this.createTokenBalance(tx.to, users as UserEntity[])
              }
              tokenBalanceRecord[tx.to].fromPool += amount;
              tokenBalanceRecord[tx.to].fromPoolUsd += amount * price;
              // to pool
            } else if (this.isPool(tx.to)) {
              if (!tokenBalanceRecord[tx.from]) {
                tokenBalanceRecord[tx.from] = this.createTokenBalance(tx.from, users as UserEntity[]);
              }
              tokenBalanceRecord[tx.from].toPool += amount;
              tokenBalanceRecord[tx.from].toPoolUsd += amount * price;
            } else if (this.isDungeon(tx.from)) {
              if (!tokenBalanceRecord[tx.to]) {
                tokenBalanceRecord[tx.to] = this.createTokenBalance(tx.to, users as UserEntity[]);
              }
              tokenBalanceRecord[tx.to].fromDungeon += amount;
            } else if (this.isReinforcement(tx.from)) {
              if (!tokenBalanceRecord[tx.to]) {
                tokenBalanceRecord[tx.to] = this.createTokenBalance(tx.to, users as UserEntity[]);
              }
              tokenBalanceRecord[tx.to].reinforcement += amount;
            } else {
              if (!(this.isDungeon(tx.to) || this.isReinforcement(tx.to))) {
                if (!tokenBalanceRecord[tx.from]) {
                  tokenBalanceRecord[tx.from] = this.createTokenBalance(tx.from, users as UserEntity[]);
                }
                tokenBalanceRecord[tx.from].other -= amount;
                if (!tokenBalanceRecord[tx.to]) {
                  tokenBalanceRecord[tx.to] = this.createTokenBalance(tx.to, users as UserEntity[])
                }
                tokenBalanceRecord[tx.to].other += amount;
              }
            }
          }
        }

        if (pawnshopActions) {
          for (let pawnshopAction of pawnshopActions) {
            if (pawnshopAction.values.length > 0) {
              const borrower = pawnshopAction.values[0]
              const buyer = pawnshopAction.user.id;
              const amount = pawnshopAction.position.acquiredAmount;
              if (!tokenBalanceRecord[borrower]) {
                tokenBalanceRecord[borrower] = this.createTokenBalance(borrower, users as UserEntity[]);
              }
              tokenBalanceRecord[borrower].fromPawnshop += +amount;

              if (!tokenBalanceRecord[buyer]) {
                tokenBalanceRecord[buyer] = this.createTokenBalance(buyer, users as UserEntity[]);
              }
              tokenBalanceRecord[buyer].toPawnshop += +amount;
            }
          }
        }

        let totalPlayers = 0;
        let totalProfitPlayers = 0;
        let usersNotFinishDung = 0;
        Object.keys(tokenBalanceRecord).forEach(key => {
          const fromPoolUsd = +tokenBalanceRecord[key].fromPoolUsd.toFixed(1);
          const toPoolUsd = +tokenBalanceRecord[key].toPoolUsd.toFixed(1);
          const fromDungeon = tokenBalanceRecord[key].fromDungeon;
          const isPlayer = tokenBalanceRecord[key].isPlayer;
          const hasHero = tokenBalanceRecord[key].hasHero;
          if (isPlayer) {
            totalPlayers++;
            if (toPoolUsd > fromPoolUsd) {
              totalProfitPlayers++;
            }
          }
          if (!hasHero && fromDungeon === 0) {
            usersNotFinishDung++;
          }
          this.tokenBalances.push({
            ...tokenBalanceRecord[key],
            fromPool: +tokenBalanceRecord[key].fromPool.toFixed(1),
            fromPoolUsd: fromPoolUsd,
            toPool: +tokenBalanceRecord[key].toPool.toFixed(1),
            toPoolUsd: toPoolUsd,
            fromDungeon: +tokenBalanceRecord[key].fromDungeon.toFixed(1),
            earned: +(toPoolUsd - fromPoolUsd).toFixed(1),
            reinforcement: +tokenBalanceRecord[key].reinforcement.toFixed(1),
            other: +tokenBalanceRecord[key].other.toFixed(1),
            fromPawnshop: +tokenBalanceRecord[key].fromPawnshop.toFixed(1),
            toPawnshop: +tokenBalanceRecord[key].toPawnshop.toFixed(1),
          })
        });

        this.totalUsers = users.length;
        this.totalPlayers = totalPlayers;
        this.totalProfitPlayers = totalProfitPlayers;
        this.usersNotFinishDung = usersNotFinishDung;
        this.isLoading = false;
        this.changeDetectorRef.detectChanges();
      })
  }

  createTokenBalance(user: string, users: UserEntity[]): TokenBalance {
    return {
      address: user,
      fromPool: 0,
      fromPoolUsd: 0,
      fromDungeon: 0,
      toPool: 0,
      toPoolUsd: 0,
      other: 0,
      earned: 0,
      fromPawnshop: 0,
      toPawnshop: 0,
      reinforcement: 0,
      isPlayer: users.some(u => u.id === user.toLowerCase() && u.heroes.length > 0 && u.heroes.some(h => h.earnedTokens.length > 0)),
      hasHero: users.some(u => u.id === user.toLowerCase() && u.heroes.length > 0)
    }
  }

  isDungeon(address: string): boolean {
    return address.toLowerCase() === GET_CORE_ADDRESSES(this.chainId).dungeonFactory.toLowerCase();
  }

  isPool(address: string): boolean {
    return getPools(this.network).includes(address.toLowerCase());
  }

  isReinforcement(address: string): boolean {
    return address.toLowerCase() === GET_CORE_ADDRESSES(this.chainId).reinforcementController.toLowerCase();
  }

  skipAddresses(address: string): boolean {
    return getSkipAddresses(this.network).includes(address.toLowerCase());
  }
}
