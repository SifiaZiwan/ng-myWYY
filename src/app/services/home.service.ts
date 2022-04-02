import { HttpClient } from '@angular/common/http';
import { API_CONFIG, ServicesModule } from './services.module';
import { Inject, Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
// import { map } from 'rxjs/operators'
import { Banner, HotTag, SongSheet } from './data-types/common.types';

@Injectable({
  providedIn: ServicesModule // 可以在servicesModule 使用 providers:[HomeService]
})
export class HomeService {

  constructor(private http: HttpClient, @Inject(API_CONFIG) private uri: string) { }

  getBanners(): Observable<Banner[]> {
    let resp$ = this.http.get(this.uri + 'banner')
      .pipe(map((res: { banners: Banner[] }) => res.banners));
    return resp$;
  }

  getHotTags(): Observable<HotTag[]> {
    let resp$ = this.http.get(this.uri + 'playlist/hot')
      .pipe(map((res: { tags: HotTag[] }) => {
        return res.tags.sort((x: HotTag, y: HotTag) => x.position - y.position).slice(0, 5);
      }));
    return resp$;
  }

  getPersonalSheetList(): Observable<SongSheet[]> {
    let resp$ = this.http.get(this.uri + 'personalized')
      .pipe(map((res: { result: SongSheet[] }) => res.result.slice(0, 16)));
    return resp$;
  }

}
