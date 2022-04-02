import { HttpClient, HttpClientModule } from '@angular/common/http';
import { API_CONFIG, ServicesModule } from './services.module';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators'
import { Banner } from './data-types/common.types';

@Injectable({
  providedIn: ServicesModule // 可以在servicesModule 使用 providers:[HomeService]
})
export class HomeService {

  constructor(private http: HttpClient, @Inject(API_CONFIG) private uri: string) { }

  getBanners(): Observable<Banner[]> {
    return this.http.get(this.uri + '/banner')
      .pipe(map((res: { banners: Banner[] }) => res.banners));
  }
}
