import { HotTag, Singer, SongSheet } from './../../services/data-types/common.types';
import { HomeService } from './../../services/home.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Banner } from 'src/app/services/data-types/common.types';
import { NzCarouselComponent } from 'ng-zorro-antd/carousel';
import { SingerService } from 'src/app/services/singer.services';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})
export class HomeComponent implements OnInit {
  carouselActiveIndex = 0;
  banners: Banner[] = [];
  hotTags: HotTag[] = [];
  songSheetList: SongSheet[] = [];
  singers: Singer[] = [];

  @ViewChild(NzCarouselComponent, { static: true }) private nzCarousel: NzCarouselComponent;

  constructor(private homeService: HomeService, private singerService: SingerService) {
    this.getBanners();
    this.getHotTags();
    this.getPersonalizedSheetList();
    this.getEnterSingers();
  }

  private getBanners() {
    this.homeService.getBanners().subscribe(banners => {
      this.banners = banners;
    })
  }
  private getHotTags() {
    this.homeService.getHotTags().subscribe(tags => {
      this.hotTags = tags;
      // console.log("tags:", this.hotTags);

    })
  }
  private getPersonalizedSheetList() {
    this.homeService.getPersonalSheetList().subscribe(sheets => {
      this.songSheetList = sheets;
      // console.log("sheets:", this.songSheetList);

    })
  }
  private getEnterSingers() {
    this.singerService.getEnterSinger().subscribe(singers => {
      this.singers = singers;
      console.log("sheets:", this.singers);

    })
  }

  ngOnInit(): void {
  }

  onBeforeChange({ to }: { to: number }) {  //可以在tsconfig.json 中"noImplicitAny": true,
    this.carouselActiveIndex = to;
  }

  onChangeSlide(type: 'pre' | 'next') {
    this.nzCarousel[type]();
  }

}
