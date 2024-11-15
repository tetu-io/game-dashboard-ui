import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ItemGeneralStatModel } from '../models/item-general-stat.model';
import { Observable } from 'rxjs';
import { ItemMintStoryStatModel } from '../models/item-mint-story-stat.model';
import { StoryPassedModel } from '../models/story-passed.model';
import { ReinforcementV2StatModel } from '../models/reinforcement-v2-stat.model';

@Injectable({
  providedIn: 'root',
})
export class ApiService {

  constructor(
    private http: HttpClient
  ) {

  }

  getGeneralItems(chainId: number): Observable<ItemGeneralStatModel[]> {
    return this.http.get<ItemGeneralStatModel[]>(`${this.getApiUrl()}/api/v1/items?chainId=${chainId}`);
  }

  getItemsMintInStory(chainId: number): Observable<ItemMintStoryStatModel[]> {
    return this.http.get<ItemMintStoryStatModel[]>(`${this.getApiUrl()}/api/v1/items-story-mint?chainId=${chainId}`);
  }

  getPassedStoryPage(chainId: number): Observable<StoryPassedModel[]> {
    return this.http.get<StoryPassedModel[]>(`${this.getApiUrl()}/api/v1/story-passed?chainId=${chainId}`);
  }

  getReinforcementV2(chainId: number): Observable<ReinforcementV2StatModel[]> {
    return this.http.get<ReinforcementV2StatModel[]>(`${this.getApiUrl()}/api/v1/reinforcement-v2?chainId=${chainId}`);
  }

  private getApiUrl(): string {
    return environment.API_SERVER_URL || 'no_url';
  }
}