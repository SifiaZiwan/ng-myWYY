import { Injectable } from '@angular/core';
import { SingerService } from 'src/app/services/singer.services';
import { HomeService } from '../../services/home.service';
import { HotTag, SongSheet, Singer } from '../../services/data-types/common.types';
import { Banner } from 'src/app/services/data-types/common.types';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { first, forkJoin, Observable } from 'rxjs';

type HomeDataType = [Banner[], HotTag[], SongSheet[], Singer[]];

@Injectable()

export class HomeRsolverService implements Resolve<HomeDataType>{
  constructor(private homeService: HomeService, private singerService: SingerService) { }
  resolve(): Observable<HomeDataType> {
    return forkJoin([
      this.homeService.getBanners(),
      this.homeService.getHotTags(),
      this.homeService.getPersonalSheetList(),
      this.singerService.getEnterSinger()
    ]).pipe(first());
  }
}