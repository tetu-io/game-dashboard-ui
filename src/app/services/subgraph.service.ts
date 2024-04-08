import { Injectable } from '@angular/core';
import {
  AllHeroActionGQL,
  AllHeroActionQuery,
  ControllerDataGQL,
  ControllerDataQuery,
  HeroActionGQL,
  HeroActionQuery,
  HeroesDataGQL,
  HeroesDataQuery,
  HeroGQL,
  HeroMaxLevelDataGQL,
  HeroMaxLevelDataQuery,
  HeroQuery,
  ItemsActionDataGQL,
  ItemsActionDataQuery,
  ItemsDataGQL,
  ItemsDataQuery,
  StoryDataGQL,
  StoryDataQuery,
  TokenGQL,
  TokenQuery,
  TokenTransactionsGQL,
  TokenTransactionsQuery,
  UsersDataGQL,
  UsersDataQuery,
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
  ) { }

  changeNetwork(network: string): void {
    this.networkSubject.next(network);
  }

  heroMaxLevel$(): Observable<HeroMaxLevelDataQuery['heroEntities']> {
    this.heroMaxLevelGQL.client = this.getClientSubgraph();
    return this.heroMaxLevelGQL.fetch().pipe(
      map(x => x.data.heroEntities),
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
      default:
        return '';
    }
  }
}
