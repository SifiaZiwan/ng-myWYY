import { DOCUMENT } from '@angular/common';
import { SetCurrentIndex, SetPlayList, SetPlayMode } from './../../../store/actions/player.actions';
import { PlayMode } from './player-types';
import { Song } from './../../../services/data-types/common.types';
import { getSongList, getPlayList, getCurrentIndex, getCurrentSong, getPlayMode, getPlayer } from './../../../store/selectors/player.selector';
import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { AppStoreModule } from 'src/app/store';
import { fromEvent, Subscription } from 'rxjs';
import { shuffle } from 'src/app/until/array';

const modeTypes: PlayMode[] = [
  {
    type: "loop",
    label: "循环"
  },
  {
    type: "random",
    label: "随机"
  },
  {
    type: "singleLoop",
    label: "单曲循环"
  },
];

@Component({
  selector: 'app-wy-player',
  templateUrl: './wy-player.component.html',
  styleUrls: ['./wy-player.component.less']
})
export class WyPlayerComponent implements OnInit {
  percent = 0;
  bufferPercent = 0;
  songList: Song[];
  playList: Song[];
  currentIndex: number;
  currentSong: Song;
  duration: number;
  playing = false; //播放状态
  songReady = false; // 是否可以播放
  volume = 60;
  showVolumePanel = false;
  selfClick = false; // 当前点击的部分是否为音量面板本身

  currentTime: number;
  currentMode: PlayMode;
  modeCount = 0;

  private winClick: Subscription;

  @ViewChild('audio', { static: true }) private audio: ElementRef;
  private audioEl: HTMLAudioElement;

  get picUrl(): string {
    return this.currentSong ? this.currentSong.al.picUrl : '//s4.music.126.net/style/web2/img/default/default_album.jpg';
  }


  constructor(
    private store$: Store<AppStoreModule>,
    @Inject(DOCUMENT) private doc: Document,
  ) {

    const appStore$ = this.store$.pipe(select(getPlayer));
    appStore$.pipe(select(getSongList)).subscribe(list => this.watchList(list, 'songList'));
    appStore$.pipe(select(getPlayList)).subscribe(list => this.watchList(list, 'playList'));
    appStore$.pipe(select(getPlayMode)).subscribe(mode => this.watchPlayMode(mode));
    appStore$.pipe(select(getCurrentIndex)).subscribe(index => this.watchCurrentIndex(index));
    appStore$.pipe(select(getCurrentSong)).subscribe(song => this.watchCurrentSong(song));
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
    console.log("mode:", mode);
    this.currentMode = mode;
    if (this.songList) {
      let list = this.songList.slice();
      if (mode.type === 'random') {
        list = shuffle(this.songList);
      }
      this.updateCurrentIndex(list, this.currentSong);
      this.store$.dispatch(SetPlayList({ playList: list }))
    }

  }

  private watchCurrentSong(song: Song) {
    // console.log('index:', song);
    if (song) {
      this.currentSong = song;
      this.duration = song.dt / 1000;
    }

  }

  private updateCurrentIndex(list: Song[], song: Song) {
    const newIndex = list.findIndex(item => item.id === song.id);
    this.store$.dispatch(SetCurrentIndex({ currentIndex: newIndex }));
  }

  onPercentChange(percent) {
    if (this.currentSong) {
      this.audioEl.currentTime = this.duration * (percent / 100);
    }
  }

  onVolumeChange(percent) {
    this.audioEl.volume = percent / 100;
  }

  toggleVolPanel(evt: MouseEvent) {
    evt.stopPropagation();
    this.togglePanel();
  }

  changeMode() {
    const newMode = modeTypes[++this.modeCount % 3];
    this.store$.dispatch(SetPlayMode({ playMode: newMode }));
  }


  private togglePanel() {
    this.showVolumePanel = !this.showVolumePanel;
    if (this.showVolumePanel) {
      this.bindDocumentClickListener();
    } else {
      this.unBindDocumentClickListener();
    }
  }

  private bindDocumentClickListener() {
    if (!this.winClick) {
      this.winClick = fromEvent(this.doc, 'click').subscribe(() => {
        if (!this.selfClick) {//说明点击了播放器以外的部分
          this.showVolumePanel = false;
          this.unBindDocumentClickListener();
        }
        this.selfClick = false;
      })
    }
  }

  private unBindDocumentClickListener() {
    if (this.winClick) {
      this.winClick.unsubscribe();
      this.winClick = null;
    }
  }

  onToggle() {
    if (!this.currentSong) {
      if (this.playList.length) {
        this.store$.dispatch(SetCurrentIndex({ currentIndex: 0 }));
        this.songReady = false;
      }
    } else if (this.songReady) {
      this.playing = !this.playing;
      if (this.playing) {
        this.audioEl.play();
      } else {
        this.audioEl.pause();
      }
    }
  }


  onPrev(index: number) {
    if (!this.songReady) return;
    if (this.playList.length === 1) {
      this.loop();
    } else {
      const newIndex = index <= 0 ? this.playList.length - 1 : index;
      this.updateIndex(newIndex);
    }
  }


  onNext(index: number) {
    if (!this.songReady) return;
    if (this.playList.length === 1) {
      this.loop();
    } else {
      const newIndex = index >= this.playList.length ? 0 : index;
      this.updateIndex(newIndex);
    }
  }


  onCanPlay() {
    this.songReady = true;
    this.play();
  }

  onTimeupdate(e: Event) {
    this.currentTime = (<HTMLAudioElement>e.target).currentTime;
    this.percent = (this.currentTime / this.duration) * 100;
    const buffered = this.audioEl.buffered;
    // buffered.end(0); // 缓冲区域结束的时间点
    if (buffered.length && this.bufferPercent < 100) {
      this.bufferPercent = (buffered.end(0) / this.duration) * 100;
    }
  }

  private loop() {
    this.audioEl.currentTime = 0;
    this.play();
  }

  private updateIndex(index: number) {
    this.store$.dispatch(SetCurrentIndex({ currentIndex: index }));
    this.songReady = false;
  }

  private play() {
    this.audioEl.play();
    this.playing = true;
  }

}
