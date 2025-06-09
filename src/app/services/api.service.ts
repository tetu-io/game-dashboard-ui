import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ItemGeneralStatInfoModel } from '../models/item-general-stat-info.model';
import { ItemMintStoryStatInfoModel } from '../models/item-mint-story-stat-info';
import { StoryPassedInfoModel } from '../models/story-passed-info.model';
import { ReinforcementV2StatInfoModel } from '../models/reinforcement-v2-stat-info.model';

@Injectable({
  providedIn: 'root',
})
export class ApiService {

  constructor(
    private http: HttpClient
  ) {

  }

  getGeneralItems(chainId: number): Observable<ItemGeneralStatInfoModel> {
    return this.http.get<ItemGeneralStatInfoModel>(`${this.getApiUrl()}/api/v1/items?chainId=${chainId}`);
  }

  getItemsMintInStory(chainId: number): Observable<ItemMintStoryStatInfoModel> {
    return this.http.get<ItemMintStoryStatInfoModel>(`${this.getApiUrl()}/api/v1/items-story-mint?chainId=${chainId}`);
  }

  getPassedStoryPage(chainId: number): Observable<StoryPassedInfoModel> {
    return this.http.get<StoryPassedInfoModel>(`${this.getApiUrl()}/api/v1/story-passed?chainId=${chainId}`);
  }

  getReinforcementV2(chainId: number): Observable<ReinforcementV2StatInfoModel> {
    return this.http.get<ReinforcementV2StatInfoModel>(`${this.getApiUrl()}/api/v1/reinforcement-v2?chainId=${chainId}`);
  }

  private getApiUrl(): string {
    return environment.API_SERVER_URL || 'no_url';
  }
}