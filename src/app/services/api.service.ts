import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ItemGeneralStatModel } from '../models/item-general-stat.model';
import { Observable } from 'rxjs';
import { ItemMintStoryStatModel } from '../models/item-mint-story-stat.model';

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

  private getApiUrl(): string {
    return environment.API_SERVER_URL || 'no_url';
  }
}