import { Injectable } from '@angular/core';
import {
  HeroesDataGQL,
  HeroesDataQuery,
  ItemsDataGQL,
  ItemsDataQuery, StoryDataGQL, StoryDataQuery,
  UsersDataGQL,
  UsersDataQuery,
} from '../../../generated/gql';
import { map, Observable, retry } from 'rxjs';

const RETRY = 10;
const DELAY = 10_000;


@Injectable({
  providedIn: 'root'
})
export class SubgraphService {

  constructor(
    private usersGQL: UsersDataGQL,
    private heroesGQL: HeroesDataGQL,
    private itemsGQL: ItemsDataGQL,
    private storyGQL: StoryDataGQL,
  ) { }

  users$(): Observable<UsersDataQuery['userEntities']> {
    return this.usersGQL.fetch().pipe(
      map(x => x.data.userEntities),
      retry({ count: RETRY, delay: DELAY }),
    );
  }

  heroes$(first: number): Observable<HeroesDataQuery['heroEntities']> {
    return this.heroesGQL.fetch({
      first: first
    }).pipe(
      map(x => x.data.heroEntities),
      retry({ count: RETRY, delay: DELAY }),
    )
  }

  items$(): Observable<ItemsDataQuery['itemEntities']> {
    return this.itemsGQL.fetch().pipe(
      map(x => x.data.itemEntities),
      retry({ count: RETRY, delay: DELAY }),
    )
  }

  stories$(): Observable<StoryDataQuery['storyPageEntities']> {
    return this.storyGQL.fetch().pipe(
      map(x => x.data.storyPageEntities),
      retry({ count: RETRY, delay: DELAY }),
    )
  }
}
