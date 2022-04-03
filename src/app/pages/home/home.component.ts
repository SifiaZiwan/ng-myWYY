import { SheetService } from './../../services/sheet.service';
import { HomeRsolverService } from './home.resolver.services';
import { HotTag, Singer, SongSheet } from './../../services/data-types/common.types';
import { HomeService } from './../../services/home.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Banner } from 'src/app/services/data-types/common.types';
import { NzCarouselComponent } from 'ng-zorro-antd/carousel';
import { SingerService } from 'src/app/services/singer.services';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';

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

  constructor(private activeRoute: ActivatedRoute, private sheetService: SheetService) {
    this.activeRoute.data.pipe(map(res => res['homeDatas'])).subscribe(([banners, hotTags, songSheetList, singers]) => {
      this.banners = banners;
      this.hotTags = hotTags;
      this.songSheetList = songSheetList;
      this.singers = singers;
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

  onPlaySheet(id: number) {
    this.sheetService.playSheet(id).subscribe(res => {
      console.log("song url:", res);

    })
  }

}
