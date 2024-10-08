import { Injectable } from '@angular/core';
import {
  AllHeroActionGQL,
  AllHeroActionQuery,
  BurnDataGQL,
  BurnDataQuery,
  ControllerDataGQL,
  ControllerDataQuery,
  DauGQL,
  DauQuery,
  HeroActionGQL,
  HeroActionQuery,
  HeroesDataGQL,
  HeroesDataQuery,
  HeroGQL,
  HeroMaxLevelDataGQL,
  HeroMaxLevelDataQuery,
  HeroQuery,
  HeroSimpleDataGQL,
  HeroSimpleDataQuery,
  HeroStatDataGQL,
  HeroStatDataQuery,
  HeroTokenEarnedDataGQL,
  HeroTokenEarnedDataQuery,
  HeroTokenVaultStatisticDataGQL,
  HeroTokenVaultStatisticDataQuery, ItemMetaDataGQL, ItemMetaDataQuery,
  ItemsActionDataGQL,
  ItemsActionDataQuery,
  ItemsDataGQL,
  ItemsDataQuery,
  OpenChamberByChambersDataGQL,
  OpenChamberByChambersDataQuery,
  OpenChamberByHeroDataGQL,
  OpenChamberDataGQL,
  OpenChamberDataQuery,
  OrderDirection,
  PawnshopDataGQL,
  PawnshopDataQuery,
  PawnshopExecuteDataGQL,
  PawnshopExecuteDataQuery, PawnshopOpenPositionDataGQL, PawnshopOpenPositionDataQuery,
  PawnshopStatDataGQL,
  PawnshopStatDataQuery,
  StoryDataGQL,
  StoryDataQuery,
  TokenEarnedGQL,
  TokenEarnedQuery,
  TokenGQL,
  TokenomicsGQL,
  TokenomicsQuery,
  TokenQuery,
  TokenTransactionsGQL,
  TokenTransactionsQuery,
  TotalSupplyHistoryGQL,
  TotalSupplyHistoryQuery,
  TransactionsGQL,
  TransactionsQuery,
  UsersDataGQL,
  UsersDataQuery,
  UsersHeroDataGQL,
  UsersHeroDataQuery,
  UsersRefCodeDataGQL,
  UsersRefCodeDataQuery,
  UsersSimpleDataGQL,
  UsersSimpleDataQuery,
  UserStatDataGQL,
  UserStatDataQuery,
  UsersTimestampDataGQL,
  UsersTimestampDataQuery,
  WauGQL,
  WauQuery,
} from '../../../generated/gql';
import { BehaviorSubject, map, Observable, retry, Subject, takeUntil } from 'rxjs';
import { defaultNetwork, NETWORKS } from '../shared/constants/network.constant';
import { DestroyService } from './destroy.service';

const RETRY = 10;
const DELAY = 10_000;


@Injectable({
  providedIn: 'root',
})
export class SubgraphService {

  private networkSubject = new BehaviorSubject(defaultNetwork());
  networkObserver = this.networkSubject.asObservable();

  constructor(
    private usersGQL: UsersDataGQL,
    private heroesGQL: HeroesDataGQL,
    private itemsGQL: ItemsDataGQL,
    private storyGQL: StoryDataGQL,
    private heroGQL: HeroGQL,
    private tokenGQL: TokenGQL,
    private itemActionGQL: ItemsActionDataGQL,
    private heroActionGQL: HeroActionGQL,
    private tokenTransactionGQL: TokenTransactionsGQL,
    private controllerGQL: ControllerDataGQL,
    private allHeroActionGQL: AllHeroActionGQL,
    private heroMaxLevelGQL: HeroMaxLevelDataGQL,
    private pawnshopGQL: PawnshopDataGQL,
    private heroTokenEarnedGQL: HeroTokenEarnedDataGQL,
    private heroTokenVaultStatisticDataGQL: HeroTokenVaultStatisticDataGQL,
    private usersRefCodeDataGQL: UsersRefCodeDataGQL,
    private usersSimpleDataGQL: UsersSimpleDataGQL,
    private dauGQL: DauGQL,
    private transactionsGQL: TransactionsGQL,
    private tokenEarnedGQL: TokenEarnedGQL,
    private heroSimpleGQL: HeroSimpleDataGQL,
    private userStatGQL: UserStatDataGQL,
    private heroStatGQL: HeroStatDataGQL,
    private tokenomicsGQL: TokenomicsGQL,
    private pawnshopExecuteGQL: PawnshopExecuteDataGQL,
    private userWithHeroGQL: UsersHeroDataGQL,
    private userTsGQL: UsersTimestampDataGQL,
    private totalSupplyHistoryGQL: TotalSupplyHistoryGQL,
    private pawnshopStatDataGQL: PawnshopStatDataGQL,
    private burnDataGQL: BurnDataGQL,
    private wauGQL: WauGQL,
    private openChamberDataGQL: OpenChamberDataGQL,
    private openChamberByChambersDataGQL: OpenChamberByChambersDataGQL,
    private openChamberByHeroGQL: OpenChamberByHeroDataGQL,
    private itemMetaDataGQL: ItemMetaDataGQL,
    private pawnshopOpenPositionDataGQL: PawnshopOpenPositionDataGQL,
  ) {
  }

  changeNetwork(network: string): void {
    this.networkSubject.next(network);
  }

  tokenomicStats$(): Observable<TokenomicsQuery['generalTokenomicsEntities']> {
    this.tokenomicsGQL.client = this.getClientSubgraph();
    return this.tokenomicsGQL.fetch().pipe(
      map(x => x.data.generalTokenomicsEntities),
      retry({ count: RETRY, delay: DELAY }),
    );
  }

  heroMaxLevel$(): Observable<HeroMaxLevelDataQuery['heroEntities']> {
    this.heroMaxLevelGQL.client = this.getClientSubgraph();
    return this.heroMaxLevelGQL.fetch().pipe(
      map(x => x.data.heroEntities),
      retry({ count: RETRY, delay: DELAY }),
    );
  }

  heroEarned$(): Observable<TokenEarnedQuery['generalHeroTokenEarneds']> {
    this.tokenEarnedGQL.client = this.getClientSubgraph();
    return this.tokenEarnedGQL.fetch().pipe(
      map(x => x.data.generalHeroTokenEarneds),
      retry({ count: RETRY, delay: DELAY }),
    );
  }

  heroStat$(first: number, skip: number, destroy$: DestroyService): Observable<HeroStatDataQuery['heroStatEntities']> {
    this.heroStatGQL.client = this.getClientSubgraph();
    return this.heroStatGQL.fetch(
      { first: first, skip: skip },
    ).pipe(
      map(x => x.data.heroStatEntities),
      retry({ count: RETRY, delay: DELAY }),
      takeUntil(destroy$),
    );
  }

  fetchAllHeroStat$(destroy$: DestroyService): Observable<HeroStatDataQuery['heroStatEntities']> {
    let allHero: HeroStatDataQuery['heroStatEntities'] = [];
    let skip = 0;
    const first = 1000;

    return new Observable<HeroStatDataQuery['heroStatEntities']>(observer => {
      const fetchHero = () => {
        this.heroStat$(first, skip, destroy$).subscribe(heroes => {
          if (heroes.length > 0) {
            allHero = allHero.concat(heroes);
            skip += first;
            fetchHero();
          } else {
            observer.next(allHero);
            observer.complete();
          }
        });
      };

      fetchHero();
    }).pipe(
      takeUntil(destroy$),
    );
  }

  openChamber$(
    first: number,
    skip: number = 0,
    orderDirection: OrderDirection = OrderDirection.Desc,
    biomes: number[] = [1, 2, 3, 4],
  ): Observable<OpenChamberDataQuery['openedChamberEntities']> {
    this.openChamberDataGQL.client = this.getClientSubgraph();
    return this.openChamberDataGQL.fetch(
      { first: first, skip: skip, orderDirection: orderDirection, biomes: biomes },
    ).pipe(
      map(x => x.data.openedChamberEntities),
      retry({ count: RETRY, delay: DELAY }),
    );
  }

  openChamberByChambers$(
    first: number,
    skip: number = 0,
    chambers: string[] = [],
    orderDirection: OrderDirection = OrderDirection.Desc,
  ): Observable<OpenChamberByChambersDataQuery['openedChamberEntities']> {
    this.openChamberByChambersDataGQL.client = this.getClientSubgraph();
    return this.openChamberByChambersDataGQL.fetch(
      { first: first, skip: skip, chambers: chambers, orderDirection: orderDirection },
    ).pipe(
      map(x => x.data.openedChamberEntities),
      retry({ count: RETRY, delay: DELAY }),
    );
  }

  openChamberByHeroes$(
    first: number,
    skip: number = 0,
    heroes: string[] = [],
    orderDirection: OrderDirection = OrderDirection.Desc,
    biomes: number[] = [1, 2, 3, 4],
  ): Observable<OpenChamberByChambersDataQuery['openedChamberEntities']> {
    this.openChamberByHeroGQL.client = this.getClientSubgraph();
    return this.openChamberByHeroGQL.fetch(
      { first: first, skip: skip, heroes: heroes, orderDirection: orderDirection, biomes: biomes },
    ).pipe(
      map(x => x.data.openedChamberEntities),
      retry({ count: RETRY, delay: DELAY }),
    );
  }

  usersStat$(first: number, skip: number, destroy$: DestroyService): Observable<UserStatDataQuery['userStatEntities']> {
    this.userStatGQL.client = this.getClientSubgraph();
    return this.userStatGQL.fetch(
      { first: first, skip: skip },
    ).pipe(
      map(x => x.data.userStatEntities),
      retry({ count: RETRY, delay: DELAY }),
      takeUntil(destroy$),
    );
  }

  fetchAllUsersStat$(destroy$: DestroyService): Observable<UserStatDataQuery['userStatEntities']> {
    let allUsers: UserStatDataQuery['userStatEntities'] = [];
    let skip = 0;
    const first = 1000;

    return new Observable<UserStatDataQuery['userStatEntities']>(observer => {
      const fetchUsers = () => {
        this.usersStat$(first, skip, destroy$).subscribe(users => {
          if (users.length > 0) {
            allUsers = allUsers.concat(users);
            skip += first;
            fetchUsers();
          } else {
            observer.next(allUsers);
            observer.complete();
          }
        });
      };

      return fetchUsers();
    }).pipe(
      takeUntil(destroy$),
    );
  }

  usersSimple$(
    first: number,
    skip: number = 0,
    destroy$: DestroyService,
  ): Observable<UsersSimpleDataQuery['userEntities']> {
    this.usersSimpleDataGQL.client = this.getClientSubgraph();
    return this.usersSimpleDataGQL.fetch(
      { first: first, skip: skip },
    ).pipe(
      map(x => x.data.userEntities),
      retry({ count: RETRY, delay: DELAY }),
      takeUntil(destroy$),
    );
  }

  fetchAllUsersSimple$(destroy$: DestroyService): Observable<UsersSimpleDataQuery['userEntities']> {
    let allUsers: UsersSimpleDataQuery['userEntities'] = [];
    let skip = 0;
    const first = 1000;

    return new Observable<UsersSimpleDataQuery['userEntities']>(observer => {
      const fetchUsers = () => {
        this.usersSimple$(first, skip, destroy$).subscribe(users => {
          if (users.length > 0) {
            allUsers = allUsers.concat(users);
            skip += first;
            fetchUsers();
          } else {
            observer.next(allUsers);
            observer.complete();
          }
        });
      };

      return fetchUsers();
    })
      .pipe(
        takeUntil(destroy$),
      );
  }

  usersWithHero$(
    first: number,
    skip: number,
    destroy$: DestroyService,
  ): Observable<UsersHeroDataQuery['userEntities']> {
    this.userWithHeroGQL.client = this.getClientSubgraph();
    return this.userWithHeroGQL.fetch(
      { first: first, skip: skip },
    ).pipe(
      map(x => x.data.userEntities),
      retry({ count: RETRY, delay: DELAY }),
      takeUntil(destroy$),
    );
  }

  fetchAllUsersWithHero$(destroy$: DestroyService): Observable<UsersHeroDataQuery['userEntities']> {
    let allUsers: UsersHeroDataQuery['userEntities'] = [];
    let skip = 0;
    const first = 1000;

    return new Observable<UsersHeroDataQuery['userEntities']>(observer => {
      const fetchUsers = () => {
        this.usersWithHero$(first, skip, destroy$).subscribe(users => {
          if (users.length > 0) {
            allUsers = allUsers.concat(users);
            skip += first;
            fetchUsers();
          } else {
            observer.next(allUsers);
            observer.complete();
          }
        });
      };

      return fetchUsers();
    })
      .pipe(takeUntil(destroy$));
  }

  heroSimple$(first: number, skip: number, destroy$: DestroyService): Observable<HeroSimpleDataQuery['heroEntities']> {
    this.heroSimpleGQL.client = this.getClientSubgraph();
    return this.heroSimpleGQL.fetch(
      { first: first, skip: skip },
    ).pipe(
      map(x => x.data.heroEntities),
      retry({ count: RETRY, delay: DELAY }),
      takeUntil(destroy$),
    );
  }

  fetchAllHeroesSimple$(destroy$: DestroyService): Observable<HeroSimpleDataQuery['heroEntities']> {
    let allHero: HeroSimpleDataQuery['heroEntities'] = [];
    let skip = 0;
    const first = 1000;

    return new Observable<HeroSimpleDataQuery['heroEntities']>(observer => {
      const fetchHeroes = () => {
        this.heroSimple$(first, skip, destroy$).subscribe(users => {
          if (users.length > 0) {
            allHero = allHero.concat(users);
            skip += first;
            fetchHeroes();
          } else {
            observer.next(allHero);
            observer.complete();
          }
        });
      };

      return fetchHeroes();
    })
      .pipe(takeUntil(destroy$));
  }

  users$(
    first: number,
    skip: number,
    actions: number[],
    destroy$: DestroyService,
  ): Observable<UsersDataQuery['userEntities']> {
    this.usersGQL.client = this.getClientSubgraph();
    return this.usersGQL.fetch(
      { first: first, skip: skip, actions: actions },
    ).pipe(
      map(x => x.data.userEntities),
      retry({ count: RETRY, delay: DELAY }),
      takeUntil(destroy$),
    );
  }

  fetchAllUsers$(actions: number[], destroy$: DestroyService): Observable<UsersDataQuery['userEntities']> {
    let allUsers: UsersDataQuery['userEntities'] = [];
    let skip = 0;
    const first = 1000;

    return new Observable<UsersDataQuery['userEntities']>(observer => {
      const fetchUsers = () => {
        this.users$(first, skip, actions, destroy$).subscribe(users => {
          if (users.length > 0) {
            allUsers = allUsers.concat(users);
            skip += first;
            fetchUsers();
          } else {
            observer.next(allUsers);
            observer.complete();
          }
        });
      };

      return fetchUsers();
    })
      .pipe(takeUntil(destroy$));
  }

  usersTs$(first: number, skip: number, destroy$: DestroyService): Observable<UsersTimestampDataQuery['userEntities']> {
    this.userTsGQL.client = this.getClientSubgraph();
    return this.userTsGQL.fetch(
      { first: first, skip: skip },
    ).pipe(
      map(x => x.data.userEntities),
      retry({ count: RETRY, delay: DELAY }),
      takeUntil(destroy$),
    );
  }

  fetchAllUsersTs$(destroy$: DestroyService): Observable<UsersTimestampDataQuery['userEntities']> {
    let allUsers: UsersTimestampDataQuery['userEntities'] = [];
    let skip = 0;
    const first = 1000;

    return new Observable<UsersTimestampDataQuery['userEntities']>(observer => {
      const fetchUsers = () => {
        this.usersTs$(first, skip, destroy$).subscribe(users => {
          if (users.length > 0) {
            allUsers = allUsers.concat(users);
            skip += first;
            fetchUsers();
          } else {
            observer.next(allUsers);
            observer.complete();
          }
        });
      };

      return fetchUsers();
    })
      .pipe(takeUntil(destroy$));
  }

  totalSupply$(
    first: number,
    skip: number = 0,
    timestamp: string = '0',
    order: OrderDirection = OrderDirection.Desc,
  ): Observable<TotalSupplyHistoryQuery['totalSupplyHistoryEntities']> {
    this.totalSupplyHistoryGQL.client = this.getClientSubgraph();
    return this.totalSupplyHistoryGQL.fetch(
      { first: first, skip: skip, timestamp: timestamp, orderDirection: order },
    ).pipe(
      map(x => x.data.totalSupplyHistoryEntities),
      retry({ count: RETRY, delay: DELAY }),
    );
  }

  burn$(
    first: number,
    skip: number = 0,
    timestamp: string = '0',
    order: OrderDirection = OrderDirection.Desc,
  ): Observable<BurnDataQuery['burnHistoryEntities']> {
    this.burnDataGQL.client = this.getClientSubgraph();
    return this.burnDataGQL.fetch(
      { first: first, skip: skip, timestamp: timestamp, orderDirection: order },
    ).pipe(
      map(x => x.data.burnHistoryEntities),
      retry({ count: RETRY, delay: DELAY }),
    );
  }

  pawnshopStat$(
    first: number,
    skip: number = 0,
    destroy$: DestroyService,
  ): Observable<PawnshopStatDataQuery['pawnshopStatisticEntities']> {
    this.pawnshopStatDataGQL.client = this.getClientSubgraph();
    return this.pawnshopStatDataGQL.fetch(
      { first: first, skip: skip },
    ).pipe(
      map(x => x.data.pawnshopStatisticEntities),
      retry({ count: RETRY, delay: DELAY }),
      takeUntil(destroy$),
    );
  }

  fetchAllPawnshopStat$(destroy$: DestroyService): Observable<PawnshopStatDataQuery['pawnshopStatisticEntities']> {
    let allData: PawnshopStatDataQuery['pawnshopStatisticEntities'] = [];
    let skip = 0;
    const first = 1000;

    return new Observable<PawnshopStatDataQuery['pawnshopStatisticEntities']>(observer => {
      const fetchData = () => {
        this.pawnshopStat$(first, skip, destroy$).subscribe(data => {
          if (data.length > 0) {
            allData = allData.concat(data);
            skip += first;
            fetchData();
          } else {
            observer.next(allData);
            observer.complete();
          }
        });
      };

      return fetchData();
    })
      .pipe(takeUntil(destroy$));
  }

  dau$(first: number, skip: number, destroy$: DestroyService): Observable<DauQuery['daustatisticEntities']> {
    this.dauGQL.client = this.getClientSubgraph();
    return this.dauGQL.fetch(
      { first: first, skip: skip },
    ).pipe(
      map(x => x.data.daustatisticEntities),
      retry({ count: RETRY, delay: DELAY }),
      takeUntil(destroy$),
    );
  }

  fetchAllDau$(destroy$: DestroyService): Observable<DauQuery['daustatisticEntities']> {
    let allDau: DauQuery['daustatisticEntities'] = [];
    let skip = 0;
    const first = 1000;

    return new Observable<DauQuery['daustatisticEntities']>(observer => {
      const fetchDau = () => {
        this.dau$(first, skip, destroy$).subscribe(users => {
          if (users.length > 0) {
            allDau = allDau.concat(users);
            skip += first;
            fetchDau();
          } else {
            observer.next(allDau);
            observer.complete();
          }
        });
      };

      return fetchDau();
    })
      .pipe(takeUntil(destroy$));
  }

  wau$(first: number, skip: number = 0, destroy$: DestroyService): Observable<WauQuery['waustatisticEntities']> {
    this.wauGQL.client = this.getClientSubgraph();
    return this.wauGQL.fetch(
      { first: first, skip: skip },
    ).pipe(
      map(x => x.data.waustatisticEntities),
      retry({ count: RETRY, delay: DELAY }),
      takeUntil(destroy$),
    );
  }

  fetchAllWau$(destroy$: DestroyService): Observable<WauQuery['waustatisticEntities']> {
    let allWau: WauQuery['waustatisticEntities'] = [];
    let skip = 0;
    const first = 1000;

    return new Observable<WauQuery['waustatisticEntities']>(observer => {
      const fetchDau = () => {
        this.wau$(first, skip, destroy$).subscribe(data => {
          if (data.length > 0) {
            allWau = allWau.concat(data);
            skip += first;
            fetchDau();
          } else {
            observer.next(allWau);
            observer.complete();
          }
        });
      };

      return fetchDau();
    })
      .pipe(takeUntil(destroy$));
  }

  transaction$(
    first: number,
    skip: number = 0,
    destroy$: DestroyService,
  ): Observable<TransactionsQuery['totalTxStatisticEntities']> {
    this.transactionsGQL.client = this.getClientSubgraph();
    return this.transactionsGQL.fetch(
      { first: first, skip: skip },
    ).pipe(
      map(x => x.data.totalTxStatisticEntities),
      retry({ count: RETRY, delay: DELAY }),
      takeUntil(destroy$),
    );
  }

  fetchTransactions$(destroy$: DestroyService): Observable<TransactionsQuery['totalTxStatisticEntities']> {
    let allTransaction: TransactionsQuery['totalTxStatisticEntities'] = [];
    let skip = 0;
    const first = 1000;

    return new Observable<TransactionsQuery['totalTxStatisticEntities']>(observer => {
      const fetchTx = () => {
        this.transaction$(first, skip, destroy$).subscribe(data => {
          if (data.length > 0) {
            allTransaction = allTransaction.concat(data);
            skip += first;
            fetchTx();
          } else {
            observer.next(allTransaction);
            observer.complete();
          }
        });
      };

      return fetchTx();
    })
      .pipe(takeUntil(destroy$));
  }

  tokenTransactions$(
    token: string,
    first: number,
    skip: number = 0,
    destroy$: DestroyService,
  ): Observable<TokenTransactionsQuery['tokenTransactionEntities']> {
    this.tokenTransactionGQL.client = this.getClientSubgraph();
    return this.tokenTransactionGQL.fetch(
      { token: token, first: first, skip: skip },
    ).pipe(
      map(x => x.data.tokenTransactionEntities),
      retry({ count: RETRY, delay: DELAY }),
      takeUntil(destroy$),
    );
  }

  fetchAllTokenTransactions$(
    token: string,
    destroy$: DestroyService,
  ): Observable<TokenTransactionsQuery['tokenTransactionEntities']> {
    let allTx: TokenTransactionsQuery['tokenTransactionEntities'] = [];
    let skip = 0;
    const first = 1000;

    return new Observable<TokenTransactionsQuery['tokenTransactionEntities']>(observer => {
      const fetchTx = () => {
        this.tokenTransactions$(token, first, skip, destroy$).subscribe(tx => {
          if (tx.length > 0) {
            allTx = allTx.concat(tx);
            skip += first;
            fetchTx();
          } else {
            observer.next(allTx);
            observer.complete();
          }
        });
      };

      fetchTx();
    })
      .pipe(takeUntil(destroy$));
  }

  items$(first: number, skip: number = 0, destroy$: DestroyService): Observable<ItemsDataQuery['itemEntities']> {
    this.itemsGQL.client = this.getClientSubgraph();
    return this.itemsGQL.fetch(
      { first: first, skip: skip },
    ).pipe(
      map(x => x.data.itemEntities),
      retry({ count: RETRY, delay: DELAY }),
      takeUntil(destroy$),
    );
  }

  itemsAction$(
    first: number,
    skip: number = 0,
    destroy$: DestroyService,
  ): Observable<ItemsActionDataQuery['itemActionEntities']> {
    this.itemActionGQL.client = this.getClientSubgraph();
    return this.itemActionGQL.fetch(
      { first: first, skip: skip },
    ).pipe(
      map(x => x.data.itemActionEntities),
      retry({ count: RETRY, delay: DELAY }),
      takeUntil(destroy$),
    );
  }

  fetchAllItemActions$(destroy$: DestroyService): Observable<ItemsActionDataQuery['itemActionEntities']> {
    let allItems: ItemsActionDataQuery['itemActionEntities'] = [];
    let skip = 0;
    const first = 1000;

    return new Observable<ItemsActionDataQuery['itemActionEntities']>(observer => {
      const fetchItems = () => {
        this.itemsAction$(first, skip, destroy$).subscribe(items => {
          if (items.length > 0) {
            allItems = allItems.concat(items);
            skip += first;
            fetchItems();
          } else {
            observer.next(allItems);
            observer.complete();
          }
        });
      };

      fetchItems();
    })
      .pipe(takeUntil(destroy$));
  }

  fetchAllItems$(destroy$: DestroyService): Observable<ItemsDataQuery['itemEntities']> {
    let allItems: ItemsDataQuery['itemEntities'] = [];
    let skip = 0;
    const first = 1000;

    return new Observable<ItemsDataQuery['itemEntities']>(observer => {
      const fetchItems = () => {
        this.items$(first, skip, destroy$).subscribe(items => {
          if (items.length > 0) {
            allItems = allItems.concat(items);
            skip += first;
            fetchItems();
          } else {
            observer.next(allItems);
            observer.complete();
          }
        });
      };

      fetchItems();
    })
      .pipe(takeUntil(destroy$));
  }

  stories$(first: number, skip: number = 0, destroy$: DestroyService): Observable<StoryDataQuery['storyPageEntities']> {
    this.storyGQL.client = this.getClientSubgraph();
    return this.storyGQL.fetch(
      { first: first, skip: skip },
    ).pipe(
      map(x => x.data.storyPageEntities),
      retry({ count: RETRY, delay: DELAY }),
      takeUntil(destroy$),
    );
  }

  heroById$(id: string): Observable<HeroQuery['heroEntity']> {
    this.heroGQL.client = this.getClientSubgraph();
    return this.heroGQL.fetch({
      id: id,
    }).pipe(
      map(x => x.data.heroEntity),
      retry({ count: RETRY, delay: DELAY }),
    );
  }

  tokenByAddress$(address: string): Observable<TokenQuery['tokenEntities']> {
    this.tokenGQL.client = this.getClientSubgraph();
    return this.tokenGQL.fetch({
      tokenAdr: address,
    }).pipe(
      map(x => x.data.tokenEntities),
      retry({ count: RETRY, delay: DELAY }),
    );
  }

  fetchAllStories$(destroy$: DestroyService): Observable<StoryDataQuery['storyPageEntities']> {
    let allStories: StoryDataQuery['storyPageEntities'] = [];
    let skip = 0;
    const first = 1000;

    return new Observable<StoryDataQuery['storyPageEntities']>(observer => {
      const fetchStories = () => {
        this.stories$(first, skip, destroy$).subscribe(stories => {
          if (stories.length > 0) {
            allStories = allStories.concat(stories);
            skip += first;
            fetchStories();
          } else {
            observer.next(allStories);
            observer.complete();
          }
        });
      };

      fetchStories();
    })
      .pipe(takeUntil(destroy$));
  }

  heroActions$(
    first: number,
    skip: number = 0,
    actions: number[],
    destroy$: DestroyService,
  ): Observable<HeroActionQuery['heroActions']> {
    this.heroActionGQL.client = this.getClientSubgraph();
    return this.heroActionGQL.fetch(
      { first: first, skip: skip, actions: actions },
    ).pipe(
      map(x => x.data.heroActions),
      retry({ count: RETRY, delay: DELAY }),
      takeUntil(destroy$),
    );
  }

  fetchHeroActionsByType$(actions: number[], destroy$: DestroyService): Observable<HeroActionQuery['heroActions']> {
    let allHeroActions: HeroActionQuery['heroActions'] = [];
    let skip = 0;
    const first = 1000;

    return new Observable<HeroActionQuery['heroActions']>(observer => {
      const fetchHeroActions = () => {
        this.heroActions$(first, skip, actions, destroy$).subscribe(heroActions => {
          if (heroActions.length > 0) {
            allHeroActions = allHeroActions.concat(heroActions);
            skip += first;
            fetchHeroActions();
          } else {
            observer.next(allHeroActions);
            observer.complete();
          }
        });
      };

      fetchHeroActions();
    })
      .pipe(takeUntil(destroy$));
  }

  pawnshopActions$(
    first: number,
    skip: number = 0,
    destroy$: DestroyService,
  ): Observable<PawnshopDataQuery['pawnshopPositionHistoryEntities']> {
    this.pawnshopGQL.client = this.getClientSubgraph();
    return this.pawnshopGQL.fetch(
      { first: first, skip: skip },
    ).pipe(
      map(x => x.data.pawnshopPositionHistoryEntities),
      retry({ count: RETRY, delay: DELAY }),
      takeUntil(destroy$),
    );
  }

  fetchAllPawnshopActions$(destroy$: DestroyService): Observable<PawnshopDataQuery['pawnshopPositionHistoryEntities']> {
    let pawnshopAllActions: PawnshopDataQuery['pawnshopPositionHistoryEntities'] = [];
    let skip = 0;
    const first = 1000;

    return new Observable<PawnshopDataQuery['pawnshopPositionHistoryEntities']>(observer => {
      const pawnshopActions$ = () => {
        this.pawnshopActions$(first, skip, destroy$).subscribe(pawnshopActions => {
          if (pawnshopActions.length > 0) {
            pawnshopAllActions = pawnshopAllActions.concat(pawnshopActions);
            skip += first;
            pawnshopActions$();
          } else {
            observer.next(pawnshopAllActions);
            observer.complete();
          }
        });
      };

      pawnshopActions$();
    })
      .pipe(takeUntil(destroy$));
  }

  pawnshopExecuteActions$(
    first: number,
    skip: number = 0,
    destroy$: DestroyService,
  ): Observable<PawnshopExecuteDataQuery['pawnshopPositionHistoryEntities']> {
    this.pawnshopExecuteGQL.client = this.getClientSubgraph();
    return this.pawnshopExecuteGQL.fetch(
      { first: first, skip: skip },
    ).pipe(
      map(x => x.data.pawnshopPositionHistoryEntities),
      retry({ count: RETRY, delay: DELAY }),
      takeUntil(destroy$),
    );
  }

  fetchAllPawnshopExecuteActions$(destroy$: DestroyService): Observable<PawnshopExecuteDataQuery['pawnshopPositionHistoryEntities']> {
    let pawnshopAllActions: PawnshopExecuteDataQuery['pawnshopPositionHistoryEntities'] = [];
    let skip = 0;
    const first = 1000;

    return new Observable<PawnshopExecuteDataQuery['pawnshopPositionHistoryEntities']>(observer => {
      const pawnshopActions$ = () => {
        this.pawnshopExecuteActions$(first, skip, destroy$).subscribe(pawnshopActions => {
          if (pawnshopActions.length > 0) {
            pawnshopAllActions = pawnshopAllActions.concat(pawnshopActions);
            skip += first;
            pawnshopActions$();
          } else {
            observer.next(pawnshopAllActions);
            observer.complete();
          }
        });
      };

      pawnshopActions$();
    })
      .pipe(takeUntil(destroy$));
  }

  itemsMeta$(
    first: number,
    skip: number = 0,
    destroy$: DestroyService,
  ): Observable<ItemMetaDataQuery['itemMetaEntities']> {
    this.itemMetaDataGQL.client = this.getClientSubgraph();
    return this.itemMetaDataGQL.fetch(
      { first: first, skip: skip },
    ).pipe(
      map(x => x.data.itemMetaEntities),
      retry({ count: RETRY, delay: DELAY }),
      takeUntil(destroy$),
    );
  }

  fetchAllItemsMeta$(destroy$: DestroyService): Observable<ItemMetaDataQuery['itemMetaEntities']> {
    let allData: ItemMetaDataQuery['itemMetaEntities'] = [];
    let skip = 0;
    const first = 1000;

    return new Observable<ItemMetaDataQuery['itemMetaEntities']>(observer => {
      const action$ = () => {
        this.itemsMeta$(first, skip, destroy$).subscribe(data => {
          if (data.length > 0) {
            allData = allData.concat(data);
            skip += first;
            action$();
          } else {
            observer.next(allData);
            observer.complete();
          }
        });
      };

      action$();
    })
      .pipe(takeUntil(destroy$));
  }

  pawnshopOpenPositions$(
    item: string,
    first: number,
    skip: number = 0,
    destroy$: DestroyService,
  ): Observable<PawnshopOpenPositionDataQuery['pawnshopPositionEntities']> {
    this.pawnshopOpenPositionDataGQL.client = this.getClientSubgraph();
    return this.pawnshopOpenPositionDataGQL.fetch(
      { item: item, first: first, skip: skip },
    ).pipe(
      map(x => x.data.pawnshopPositionEntities),
      retry({ count: RETRY, delay: DELAY }),
      takeUntil(destroy$),
    );
  }

  fetchAllPawnshopOpenPositions$(
    item: string,
    destroy$: DestroyService,
  ): Observable<PawnshopOpenPositionDataQuery['pawnshopPositionEntities']> {
    let allData: PawnshopOpenPositionDataQuery['pawnshopPositionEntities'] = [];
    let skip = 0;
    const first = 1000;

    return new Observable<PawnshopOpenPositionDataQuery['pawnshopPositionEntities']>(observer => {
      const action$ = () => {
        this.pawnshopOpenPositions$(item, first, skip, destroy$).subscribe(data => {
          if (data.length > 0) {
            allData = allData.concat(data);
            skip += first;
            action$();
          } else {
            observer.next(allData);
            observer.complete();
          }
        });
      };

      action$();
    })
      .pipe(takeUntil(destroy$));
  }

  heroTokenEarned$(
    first: number,
    skip: number = 0,
    destroy$: DestroyService,
  ): Observable<HeroTokenEarnedDataQuery['heroTokenEarneds']> {
    this.heroTokenEarnedGQL.client = this.getClientSubgraph();
    return this.heroTokenEarnedGQL.fetch(
      { first: first, skip: skip },
    ).pipe(
      map(x => x.data.heroTokenEarneds),
      retry({ count: RETRY, delay: DELAY }),
      takeUntil(destroy$),
    );
  }

  fetchAllHeroTokenEarned$(destroy$: DestroyService): Observable<HeroTokenEarnedDataQuery['heroTokenEarneds']> {
    let allEarned: HeroTokenEarnedDataQuery['heroTokenEarneds'] = [];
    let skip = 0;
    const first = 1000;

    return new Observable<HeroTokenEarnedDataQuery['heroTokenEarneds']>(observer => {
      const heroTokenEarned$ = () => {
        this.heroTokenEarned$(first, skip, destroy$).subscribe(earned => {
          if (earned.length > 0) {
            allEarned = allEarned.concat(earned);
            skip += first;
            heroTokenEarned$();
          } else {
            observer.next(allEarned);
            observer.complete();
          }
        });
      };

      heroTokenEarned$();
    })
      .pipe(takeUntil(destroy$));
  }

  heroesWithRefCode$(
    first: number,
    skip: number = 0,
    destroy$: DestroyService,
  ): Observable<UsersRefCodeDataQuery['heroEntities']> {
    this.usersRefCodeDataGQL.client = this.getClientSubgraph();
    return this.usersRefCodeDataGQL.fetch(
      { first: first, skip: skip },
    ).pipe(
      map(x => x.data.heroEntities),
      retry({ count: RETRY, delay: DELAY }),
      takeUntil(destroy$),
    );
  }

  fetchHeroesWithRefCode$(destroy$: DestroyService): Observable<UsersRefCodeDataQuery['heroEntities']> {
    let allHeroes: UsersRefCodeDataQuery['heroEntities'] = [];
    let skip = 0;
    const first = 1000;

    return new Observable<UsersRefCodeDataQuery['heroEntities']>(observer => {
      const fetchHeroes = () => {
        this.heroesWithRefCode$(first, skip, destroy$).subscribe(heroes => {
          if (heroes.length > 0) {
            allHeroes = allHeroes.concat(heroes);
            skip += first;
            fetchHeroes();
          } else {
            observer.next(allHeroes);
            observer.complete();
          }
        });
      };

      fetchHeroes();
    })
      .pipe(takeUntil(destroy$));
  }

  private getClientSubgraphByNetwork(network: string): string {
    switch (network) {
      case NETWORKS.fantom:
        return 'FANTOM_GAME_SUBGRAPH';
      case NETWORKS.real:
        return 'REAL_GAME_SUBGRAPH';
      default:
        return '';
    }
  }

  private getClientSubgraph(): string {
    return this.getClientSubgraphByNetwork(this.networkSubject.value);
  }
}
