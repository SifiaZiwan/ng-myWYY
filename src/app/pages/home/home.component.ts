import { getPlayer } from './../../store/selectors/player.selector';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { map } from 'rxjs';
import { NzCarouselComponent } from 'ng-zorro-antd/carousel';

import { SetSongList, SetPlayList, SetCurrentIndex, SetPlayMode } from './../../store/actions/player.actions';
import { AppStoreModule } from './../../store/index';
import { SheetService } from './../../services/sheet.service';
import { HotTag, Singer, SongSheet } from './../../services/data-types/common.types';
import { Banner } from 'src/app/services/data-types/common.types';
import { PlayState } from 'src/app/store/reducers/player.reducer';
import { findIndex, shuffle } from 'src/app/until/array';

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
  playerState: PlayState;

  @ViewChild(NzCarouselComponent, { static: true }) private nzCarousel: NzCarouselComponent;

  constructor(
    private activeRoute: ActivatedRoute,
    private sheetService: SheetService,
    private store$: Store<AppStoreModule>) {
    this.activeRoute.data.pipe(map(res => res['homeDatas'])).subscribe(([banners, hotTags, songSheetList, singers]) => {
      this.banners = banners;
      this.hotTags = hotTags;
      this.songSheetList = songSheetList;
      this.singers = singers;
    });

    this.store$.pipe(select(getPlayer)).subscribe(res => this.playerState = res);
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
    this.sheetService.playSheet(id).subscribe(list => {
      this.store$.dispatch(SetSongList({ songList: list }));

      let trueIndex = 0;
      let trueList = list.slice();

      if (this.playerState.palyMode.type === 'random') {
        trueList = shuffle(list || []);
        trueIndex = findIndex(trueList, list[trueIndex]);
      }

      this.store$.dispatch(SetPlayList({ playList: trueList }));
      this.store$.dispatch(SetCurrentIndex({ currentIndex: trueIndex }));
    })
  }

}
