import { Injectable } from '@angular/core';
import {
  HeroActionGQL, HeroActionQuery,
  HeroesDataGQL,
  HeroesDataQuery, HeroGQL, HeroQuery, ItemsActionDataGQL, ItemsActionDataQuery,
  ItemsDataGQL,
  ItemsDataQuery, StoryDataGQL, StoryDataQuery, TokenGQL, TokenQuery,
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
  ) { }

  changeNetwork(network: string): void {
    this.networkSubject.next(network);
  }

  users$(first: number, skip: number = 0): Observable<UsersDataQuery['userEntities']> {
    this.usersGQL.client = this.getClientSubgraph();
    return this.usersGQL.fetch(
      { first: first, skip: skip}
    ).pipe(
      map(x => x.data.userEntities),
      retry({ count: RETRY, delay: DELAY }),
    );
  }

  fetchAllUsers$(): Observable<UsersDataQuery['userEntities']> {
    let allUsers: UsersDataQuery['userEntities'] = [];
    let skip = 0;
    const first = 1000;

    return new Observable(observer => {
      const fetchUsers = () => {
        this.users$(first, skip).subscribe(users => {
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

  heroActions$(first: number, skip: number = 0): Observable<HeroActionQuery['heroActions']> {
    this.heroActionGQL.client = this.getClientSubgraph();
    return this.heroActionGQL.fetch(
      { first: first, skip: skip }
    ).pipe(
      map(x => x.data.heroActions),
      retry({ count: RETRY, delay: DELAY }),
    )
  }

  fetchAllHeroActions$(): Observable<HeroActionQuery['heroActions']> {
    let allHeroActions: HeroActionQuery['heroActions'] = [];
    let skip = 0;
    const first = 1000;

    return new Observable(observer => {
      const fetchHeroActions = () => {
        this.heroActions$(first, skip).subscribe(heroActions => {
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
