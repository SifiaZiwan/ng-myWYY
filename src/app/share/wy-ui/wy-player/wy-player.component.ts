import { PlayMode } from './player-types';
import { Song } from './../../../services/data-types/common.types';
import { getSongList, getPlayList, getCurrentIndex, getCurrentSong, getPlayMode, getPlayer } from './../../../store/selectors/player.selector';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { AppStoreModule } from 'src/app/store';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-wy-player',
  templateUrl: './wy-player.component.html',
  styleUrls: ['./wy-player.component.less']
})
export class WyPlayerComponent implements OnInit {
  sliderValue = 30;
  bufferOffset = 70;
  songList: Song[];
  playList: Song[];
  currentIndex: number;
  currentSong: Song;
  playMode: PlayMode;

  duration: number;

  @ViewChild('audio', { static: true }) private audio: ElementRef;
  private audioEl: HTMLAudioElement;
  currentTime: number;

  get picUrl(): string {
    return this.currentSong ? this.currentSong.al.picUrl : '//s4.music.126.net/style/web2/img/default/default_album.jpg';
  }
  constructor(
    private store$: Store<AppStoreModule>
  ) {

    const appStore$ = this.store$.pipe(select(getPlayer));
    appStore$.pipe(select(getSongList)).subscribe(list => this.watchList(list, 'songList'));
    appStore$.pipe(select(getPlayList)).subscribe(list => this.watchList(list, 'playList'));
    appStore$.pipe(select(getCurrentIndex)).subscribe(index => this.watchCurrentIndex(index));
    appStore$.pipe(select(getPlayMode)).subscribe(mode => this.watchPlayMode(mode));
    appStore$.pipe(select(getCurrentSong)).subscribe(song => this.watchCurrentSong(song));

    // const stateArr = [
    //   {
    //     type: getSongList,
    //     cb: list => this.watchList(list, "songList")
    //   },
    //   {
    //     type: getPlayList,
    //     cb: list => this.watchList(list, "playList")
    //   },
    //   {
    //     type: getCurrentIndex,
    //     cb: list => this.watchCurrentIndex(list)
    //   },
    //   {
    //     type: getPlayMode,
    //     cb: list => this.watchPlayMode(list)
    //   },
    //   {
    //     type: getCurrentSong,
    //     cb: list => this.watchCurrentSong(list)
    //   }];

    // stateArr.forEach(item => {
    //   appStore$.pipe(select(item.type)).subscribe(item.cb)
    // })

  }

  ngOnInit(): void {
    this.audioEl = this.audio.nativeElement;
  }

  private watchList(list: Song[], type: string) {
    console.log("list:", list, type);
    this[type] = list;

  }
  private watchCurrentIndex(index: number) {
    console.log('index:', index);
    this.currentIndex = index;

  }
  private watchPlayMode(mode: PlayMode) {
    console.log('index:', mode);
    this.playMode = mode;

  }
  private watchCurrentSong(song: Song) {
    console.log('index:', song);
    if (song) {
      this.currentSong = song;
      this.duration = song.dt / 1000;
    }

  }

  onCanPlay() {
    this.play();
  }

  onTimeupdate(e: Event) {
    this.currentTime = (<HTMLAudioElement>e.target).currentTime;
  }
  private play() {
    this.audioEl.play();
  }

}
