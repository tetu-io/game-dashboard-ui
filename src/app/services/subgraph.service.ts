import { Injectable } from '@angular/core';
import {
  HeroesDataGQL,
  HeroesDataQuery, HeroGQL, HeroQuery,
  ItemsDataGQL,
  ItemsDataQuery, StoryDataGQL, StoryDataQuery,
  UsersDataGQL,
  UsersDataQuery,
} from '../../../generated/gql';
import { BehaviorSubject, map, Observable, retry } from 'rxjs';
import { NETWORKS } from '../shared/constants/network.constant';

const RETRY = 10;
const DELAY = 10_000;


@Injectable({
  providedIn: 'root'
})
export class SubgraphService {

  private networkSubject = new BehaviorSubject(NETWORKS.sepolia);
  networkObserver = this.networkSubject.asObservable();

  constructor(
    private usersGQL: UsersDataGQL,
    private heroesGQL: HeroesDataGQL,
    private itemsGQL: ItemsDataGQL,
    private storyGQL: StoryDataGQL,
    private heroGQL: HeroGQL,
  ) { }

  changeNetwork(network: string): void {
    this.networkSubject.next(network);
  }

  users$(): Observable<UsersDataQuery['userEntities']> {
    this.usersGQL.client = this.getClientSubgraph();
    return this.usersGQL.fetch().pipe(
      map(x => x.data.userEntities),
      retry({ count: RETRY, delay: DELAY }),
    );
  }

  // ignore first parameter
  heroes$(first: number): Observable<HeroesDataQuery['heroEntities']> {
    this.heroesGQL.client = this.getClientSubgraph();
    return this.heroesGQL.fetch(
      { first: 1000 }
    ).pipe(
      map(x => x.data.heroEntities),
      retry({ count: RETRY, delay: DELAY }),
    )
  }

  items$(): Observable<ItemsDataQuery['itemEntities']> {
    this.itemsGQL.client = this.getClientSubgraph();
    return this.itemsGQL.fetch().pipe(
      map(x => x.data.itemEntities),
      retry({ count: RETRY, delay: DELAY }),
    )
  }

  stories$(): Observable<StoryDataQuery['storyPageEntities']> {
    this.storyGQL.client = this.getClientSubgraph();
    return this.storyGQL.fetch().pipe(
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

  private getClientSubgraph(): string {
    if (this.networkSubject.value === NETWORKS.mumbai) {
      return 'MUMBAI_GAME_SUBGRAPH'
    }
    return 'SEPOLIA_GAME_SUBGRAPH'
  }
}
