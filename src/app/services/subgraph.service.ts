import { Injectable } from '@angular/core';
import {
  AllHeroActionGQL,
  AllHeroActionQuery,
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
  HeroSimpleDataQuery, HeroStatDataGQL, HeroStatDataQuery,
  HeroTokenEarnedDataGQL,
  HeroTokenEarnedDataQuery,
  HeroTokenVaultStatisticDataGQL,
  HeroTokenVaultStatisticDataQuery,
  ItemsActionDataGQL,
  ItemsActionDataQuery,
  ItemsDataGQL,
  ItemsDataQuery,
  PawnshopDataGQL,
  PawnshopDataQuery, PawnshopExecuteDataGQL, PawnshopExecuteDataQuery,
  StoryDataGQL,
  StoryDataQuery,
  TokenEarnedGQL,
  TokenEarnedQuery,
  TokenGQL, TokenomicsGQL, TokenomicsQuery,
  TokenQuery,
  TokenTransactionsGQL,
  TokenTransactionsQuery,
  TransactionsGQL,
  TransactionsQuery,
  UsersDataGQL,
  UsersDataQuery, UsersHeroDataGQL, UsersHeroDataQuery,
  UsersRefCodeDataGQL,
  UsersRefCodeDataQuery,
  UsersSimpleDataGQL,
  UsersSimpleDataQuery,
  UserStatDataGQL,
  UserStatDataQuery,
} from '../../../generated/gql';
import { BehaviorSubject, map, Observable, retry } from 'rxjs';
import { defaultNetwork, NETWORKS } from '../shared/constants/network.constant';

const RETRY = 10;
const DELAY = 10_000;


@Injectable({
  providedIn: 'root'
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
  ) { }

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

  heroTokenVaultStatistic$(): Observable<HeroTokenVaultStatisticDataQuery['heroTokensVaultStatisticEntities']> {
    this.heroTokenVaultStatisticDataGQL.client = this.getClientSubgraph();
    return this.heroTokenVaultStatisticDataGQL.fetch().pipe(
      map(x => x.data.heroTokensVaultStatisticEntities),
      retry({ count: RETRY, delay: DELAY }),
    );
  }

  controller$(): Observable<ControllerDataQuery['controllerEntities']> {
    this.controllerGQL.client = this.getClientSubgraph();
    return this.controllerGQL.fetch().pipe(
      map(x => x.data.controllerEntities),
      retry({ count: RETRY, delay: DELAY }),
    );
  }

  heroStat$(first: number, skip: number = 0): Observable<HeroStatDataQuery['heroStatEntities']> {
    this.heroStatGQL.client = this.getClientSubgraph();
    return this.heroStatGQL.fetch(
      { first: first, skip: skip}
    ).pipe(
      map(x => x.data.heroStatEntities),
      retry({ count: RETRY, delay: DELAY }),
    );
  }

  fetchAllHeroStat$(): Observable<HeroStatDataQuery['heroStatEntities']> {
    let allHero: HeroStatDataQuery['heroStatEntities'] = [];
    let skip = 0;
    const first = 1000;

    return new Observable(observer => {
      const fetchHero = () => {
        this.heroStat$(first, skip).subscribe(heroes => {
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

      return fetchHero();
    });
  }

  usersStat$(first: number, skip: number = 0): Observable<UserStatDataQuery['userStatEntities']> {
    this.userStatGQL.client = this.getClientSubgraph();
    return this.userStatGQL.fetch(
      { first: first, skip: skip}
    ).pipe(
      map(x => x.data.userStatEntities),
      retry({ count: RETRY, delay: DELAY }),
    );
  }

  fetchAllUsersStat$(): Observable<UserStatDataQuery['userStatEntities']> {
    let allUsers: UserStatDataQuery['userStatEntities'] = [];
    let skip = 0;
    const first = 1000;

    return new Observable(observer => {
      const fetchUsers = () => {
        this.usersStat$(first, skip).subscribe(users => {
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
    });
  }

  usersSimple$(first: number, skip: number = 0): Observable<UsersSimpleDataQuery['userEntities']> {
    this.usersSimpleDataGQL.client = this.getClientSubgraph();
    return this.usersSimpleDataGQL.fetch(
      { first: first, skip: skip}
    ).pipe(
      map(x => x.data.userEntities),
      retry({ count: RETRY, delay: DELAY }),
    );
  }

  fetchAllUsersSimple$(): Observable<UsersSimpleDataQuery['userEntities']> {
    let allUsers: UsersSimpleDataQuery['userEntities'] = [];
    let skip = 0;
    const first = 1000;

    return new Observable(observer => {
      const fetchUsers = () => {
        this.usersSimple$(first, skip).subscribe(users => {
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
    });
  }

  usersWithHero$(first: number, skip: number = 0): Observable<UsersHeroDataQuery['userEntities']> {
    this.userWithHeroGQL.client = this.getClientSubgraph();
    return this.userWithHeroGQL.fetch(
      { first: first, skip: skip}
    ).pipe(
      map(x => x.data.userEntities),
      retry({ count: RETRY, delay: DELAY }),
    );
  }

  fetchAllUsersWithHero$(): Observable<UsersHeroDataQuery['userEntities']> {
    let allUsers: UsersHeroDataQuery['userEntities'] = [];
    let skip = 0;
    const first = 1000;

    return new Observable(observer => {
      const fetchUsers = () => {
        this.usersWithHero$(first, skip).subscribe(users => {
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
    });
  }

  heroSimple$(first: number, skip: number = 0): Observable<HeroSimpleDataQuery['heroEntities']> {
    this.heroSimpleGQL.client = this.getClientSubgraph();
    return this.heroSimpleGQL.fetch(
      { first: first, skip: skip}
    ).pipe(
      map(x => x.data.heroEntities),
      retry({ count: RETRY, delay: DELAY }),
    );
  }

  fetchAllHeroesSimple$(): Observable<HeroSimpleDataQuery['heroEntities']> {
    let allHero: HeroSimpleDataQuery['heroEntities'] = [];
    let skip = 0;
    const first = 1000;

    return new Observable(observer => {
      const fetchHeroes = () => {
        this.heroSimple$(first, skip).subscribe(users => {
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
    });
  }

  users$(first: number, skip: number = 0, actions: number[]): Observable<UsersDataQuery['userEntities']> {
    this.usersGQL.client = this.getClientSubgraph();
    return this.usersGQL.fetch(
      { first: first, skip: skip, actions: actions}
    ).pipe(
      map(x => x.data.userEntities),
      retry({ count: RETRY, delay: DELAY }),
    );
  }

  fetchAllUsers$(actions: number[] = [1]): Observable<UsersDataQuery['userEntities']> {
    let allUsers: UsersDataQuery['userEntities'] = [];
    let skip = 0;
    const first = 1000;

    return new Observable(observer => {
      const fetchUsers = () => {
        this.users$(first, skip, actions).subscribe(users => {
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
    });
  }

  dau$(first: number, skip: number = 0): Observable<DauQuery['daustatisticEntities']> {
    this.dauGQL.client = this.getClientSubgraph();
    return this.dauGQL.fetch(
      { first: first, skip: skip}
    ).pipe(
      map(x => x.data.daustatisticEntities),
      retry({ count: RETRY, delay: DELAY }),
    );
  }

  fetchAllDau$(): Observable<DauQuery['daustatisticEntities']> {
    let allDau: DauQuery['daustatisticEntities'] = [];
    let skip = 0;
    const first = 1000;

    return new Observable(observer => {
      const fetchDau = () => {
        this.dau$(first, skip).subscribe(users => {
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
    });
  }

  transaction$(first: number, skip: number = 0): Observable<TransactionsQuery['totalTxStatisticEntities']> {
    this.transactionsGQL.client = this.getClientSubgraph();
    return this.transactionsGQL.fetch(
      { first: first, skip: skip}
    ).pipe(
      map(x => x.data.totalTxStatisticEntities),
      retry({ count: RETRY, delay: DELAY }),
    );
  }

  fetchTransactions$(): Observable<TransactionsQuery['totalTxStatisticEntities']> {
    let allTransaction: TransactionsQuery['totalTxStatisticEntities'] = [];
    let skip = 0;
    const first = 1000;

    return new Observable(observer => {
      const fetchTx = () => {
        this.transaction$(first, skip).subscribe(data => {
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
    });
  }

  heroes$(first: number, skip: number = 0): Observable<HeroesDataQuery['heroEntities']> {
    this.heroesGQL.client = this.getClientSubgraph();
    return this.heroesGQL.fetch(
      { first: first, skip: skip}
    ).pipe(
      map(x => x.data.heroEntities),
      retry({ count: RETRY, delay: DELAY }),
    )
  }

  fetchAllHeroes$(): Observable<HeroesDataQuery['heroEntities']> {
    let allHeroes: HeroesDataQuery['heroEntities'] = [];
    let skip = 0;
    const first = 1000;

    return new Observable(observer => {
      const fetchHeroes = () => {
        this.heroes$(first, skip).subscribe(heroes => {
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
    });
  }

  tokenTransactions$(token: string, first: number, skip: number = 0): Observable<TokenTransactionsQuery['tokenTransactionEntities']> {
    this.tokenTransactionGQL.client = this.getClientSubgraph();
    return this.tokenTransactionGQL.fetch(
      { token: token, first: first, skip: skip}
    ).pipe(
      map(x => x.data.tokenTransactionEntities),
      retry({ count: RETRY, delay: DELAY }),
    )
  }

  fetchAllTokenTransactions$(token: string): Observable<TokenTransactionsQuery['tokenTransactionEntities']> {
    let allTx: TokenTransactionsQuery['tokenTransactionEntities'] = [];
    let skip = 0;
    const first = 1000;

    return new Observable(observer => {
      const fetchTx = () => {
        this.tokenTransactions$(token, first, skip).subscribe(tx => {
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
    });
  }

  items$(first: number, skip: number = 0): Observable<ItemsDataQuery['itemEntities']> {
    this.itemsGQL.client = this.getClientSubgraph();
    return this.itemsGQL.fetch(
      { first: first, skip: skip }
    ).pipe(
      map(x => x.data.itemEntities),
      retry({ count: RETRY, delay: DELAY }),
    )
  }

  itemsAction$(first: number, skip: number = 0): Observable<ItemsActionDataQuery['itemActionEntities']> {
    this.itemActionGQL.client = this.getClientSubgraph();
    return this.itemActionGQL.fetch(
      { first: first, skip: skip }
    ).pipe(
      map(x => x.data.itemActionEntities),
      retry({ count: RETRY, delay: DELAY }),
    )
  }

  fetchAllItemActions$(): Observable<ItemsActionDataQuery['itemActionEntities']> {
    let allItems: ItemsActionDataQuery['itemActionEntities'] = [];
    let skip = 0;
    const first = 1000;

    return new Observable(observer => {
      const fetchItems = () => {
        this.itemsAction$(first, skip).subscribe(items => {
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
    });
  }

  fetchAllItems$(): Observable<ItemsDataQuery['itemEntities']> {
    let allItems: ItemsDataQuery['itemEntities'] = [];
    let skip = 0;
    const first = 1000;

    return new Observable(observer => {
      const fetchItems = () => {
        this.items$(first, skip).subscribe(items => {
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
    });
  }

  stories$(first: number, skip: number = 0): Observable<StoryDataQuery['storyPageEntities']> {
    this.storyGQL.client = this.getClientSubgraph();
    return this.storyGQL.fetch(
      { first: first, skip: skip }
    ).pipe(
      map(x => x.data.storyPageEntities),
      retry({ count: RETRY, delay: DELAY }),
    )
  }

  heroById$(id: string): Observable<HeroQuery['heroEntity']> {
    this.heroGQL.client = this.getClientSubgraph();
    return this.heroGQL.fetch({
      id: id
    }).pipe(
      map(x => x.data.heroEntity),
      retry({ count: RETRY, delay: DELAY })
    )
  }

  tokenByAddress$(address: string): Observable<TokenQuery['tokenEntities']> {
    this.tokenGQL.client = this.getClientSubgraph();
    return this.tokenGQL.fetch({
      tokenAdr: address
    }).pipe(
      map(x => x.data.tokenEntities),
      retry({ count: RETRY, delay: DELAY })
    )
  }

  fetchAllStories$(): Observable<StoryDataQuery['storyPageEntities']> {
    let allStories: StoryDataQuery['storyPageEntities'] = [];
    let skip = 0;
    const first = 1000;

    return new Observable(observer => {
      const fetchStories = () => {
        this.stories$(first, skip).subscribe(stories => {
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
    });
  }

  heroActions$(first: number, skip: number = 0, actions: number[]): Observable<HeroActionQuery['heroActions']> {
    this.heroActionGQL.client = this.getClientSubgraph();
    return this.heroActionGQL.fetch(
      { first: first, skip: skip, actions: actions }
    ).pipe(
      map(x => x.data.heroActions),
      retry({ count: RETRY, delay: DELAY }),
    )
  }

  fetchHeroActionsByType$(actions: number[]): Observable<HeroActionQuery['heroActions']> {
    let allHeroActions: HeroActionQuery['heroActions'] = [];
    let skip = 0;
    const first = 1000;

    return new Observable(observer => {
      const fetchHeroActions = () => {
        this.heroActions$(first, skip, actions).subscribe(heroActions => {
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
    });
  }

  pawnshopActions$(first: number, skip: number = 0): Observable<PawnshopDataQuery['pawnshopPositionHistoryEntities']> {
    this.pawnshopGQL.client = this.getClientSubgraph();
    return this.pawnshopGQL.fetch(
      { first: first, skip: skip }
    ).pipe(
      map(x => x.data.pawnshopPositionHistoryEntities),
      retry({ count: RETRY, delay: DELAY }),
    )
  }

  fetchAllPawnshopActions$(): Observable<PawnshopDataQuery['pawnshopPositionHistoryEntities']> {
    let pawnshopAllActions: PawnshopDataQuery['pawnshopPositionHistoryEntities'] = [];
    let skip = 0;
    const first = 1000;

    return new Observable(observer => {
      const pawnshopActions$ = () => {
        this.pawnshopActions$(first, skip).subscribe(pawnshopActions => {
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
    });
  }

  pawnshopExecuteActions$(first: number, skip: number = 0): Observable<PawnshopExecuteDataQuery['pawnshopPositionHistoryEntities']> {
    this.pawnshopExecuteGQL.client = this.getClientSubgraph();
    return this.pawnshopExecuteGQL.fetch(
      { first: first, skip: skip }
    ).pipe(
      map(x => x.data.pawnshopPositionHistoryEntities),
      retry({ count: RETRY, delay: DELAY }),
    )
  }

  fetchAllPawnshopExecuteActions$(): Observable<PawnshopExecuteDataQuery['pawnshopPositionHistoryEntities']> {
    let pawnshopAllActions: PawnshopExecuteDataQuery['pawnshopPositionHistoryEntities'] = [];
    let skip = 0;
    const first = 1000;

    return new Observable(observer => {
      const pawnshopActions$ = () => {
        this.pawnshopExecuteActions$(first, skip).subscribe(pawnshopActions => {
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
    });
  }

  heroTokenEarned$(first: number, skip: number = 0): Observable<HeroTokenEarnedDataQuery['heroTokenEarneds']> {
    this.heroTokenEarnedGQL.client = this.getClientSubgraph();
    return this.heroTokenEarnedGQL.fetch(
      { first: first, skip: skip }
    ).pipe(
      map(x => x.data.heroTokenEarneds),
      retry({ count: RETRY, delay: DELAY }),
    )
  }

  fetchAllHeroTokenEarned$(): Observable<HeroTokenEarnedDataQuery['heroTokenEarneds']> {
    let allEarned: HeroTokenEarnedDataQuery['heroTokenEarneds'] = [];
    let skip = 0;
    const first = 1000;

    return new Observable(observer => {
      const heroTokenEarned$ = () => {
        this.heroTokenEarned$(first, skip).subscribe(earned => {
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
    });
  }

  heroesWithRefCode$(first: number, skip: number = 0): Observable<UsersRefCodeDataQuery['heroEntities']> {
    this.usersRefCodeDataGQL.client = this.getClientSubgraph();
    return this.usersRefCodeDataGQL.fetch(
      { first: first, skip: skip}
    ).pipe(
      map(x => x.data.heroEntities),
      retry({ count: RETRY, delay: DELAY }),
    )
  }

  fetchHeroesWithRefCode$(): Observable<UsersRefCodeDataQuery['heroEntities']> {
    let allHeroes: UsersRefCodeDataQuery['heroEntities'] = [];
    let skip = 0;
    const first = 1000;

    return new Observable(observer => {
      const fetchHeroes = () => {
        this.heroesWithRefCode$(first, skip).subscribe(heroes => {
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
    });
  }

  allHeroActions$(first: number, skip: number = 0): Observable<AllHeroActionQuery['heroActions']> {
    console.log(first, skip);
    this.allHeroActionGQL.client = this.getClientSubgraph();
    return this.allHeroActionGQL.fetch(
      { first: first, skip: skip }
    ).pipe(
      map(x => x.data.heroActions),
      retry({ count: RETRY, delay: DELAY }),
    )
  }

  fetchAllHeroActions$(): Observable<AllHeroActionQuery['heroActions']> {
    let allHeroActions: AllHeroActionQuery['heroActions'] = [];
    let skip = 0;
    const first = 1000;

    return new Observable(observer => {
      const fetchHeroActions = () => {
        this.allHeroActions$(first, skip).subscribe(heroActions => {
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
    });
  }


  private getClientSubgraph(): string {
    switch (this.networkSubject.value) {
      case NETWORKS.sonic:
        return 'SONIC_GAME_SUBGRAPH';
      case NETWORKS.fantom:
        return 'FANTOM_GAME_SUBGRAPH';
      default:
        return '';
    }
  }
}
