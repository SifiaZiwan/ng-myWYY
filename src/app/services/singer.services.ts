import { HttpClient, HttpParams } from '@angular/common/http';
import { API_CONFIG, ServicesModule } from './services.module';
import { Inject, Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Singer } from './data-types/common.types';
import * as queryString from 'query-string';

// const queryString = require('query-string');

interface SingerParams {
  offset: number;
  limit: number;
  cat?: string;
}

const defaultParams: SingerParams = {
  offset: 0,
  limit: 9,
  cat: '5001',
}

@Injectable({
  providedIn: ServicesModule // 可以在servicesModule 使用 providers:[HomeService]
})
export class SingerService {

  constructor(private http: HttpClient, @Inject(API_CONFIG) private uri: string) { }

  getEnterSinger(args: SingerParams = defaultParams): Observable<Singer[]> {
    const params = new HttpParams({ fromString: queryString.stringify(args) });
    let resp$ = this.http.get(this.uri + 'artist/list', { params })
      .pipe(map((res: { artists: Singer[] }) => res.artists));
    return resp$;
  }

}
