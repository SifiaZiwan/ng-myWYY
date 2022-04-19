import { WyScrollComponent } from './../wy-scroll/wy-scroll.component';
import { Song } from './../../../../services/data-types/common.types';
import { Component, Input, OnInit, OnChanges, SimpleChanges, Output, EventEmitter, ViewChildren, QueryList, Inject } from '@angular/core';
import { findIndex } from 'src/app/until/array';
import { timer } from 'rxjs';
import { WINDOW } from 'src/app/services/services.module';

@Component({
  selector: 'app-wy-player-panel',
  templateUrl: './wy-player-panel.component.html',
  styleUrls: ['./wy-player-panel.component.less']
})
export class WyPlayerPanelComponent implements OnInit, OnChanges {
  @Input() songList: Song[];
  @Input() currentSong: Song;
  currentIndex: number;
  @Input() show: boolean;

  @Output() onClose = new EventEmitter<void>();
  @Output() onChangeSong = new EventEmitter<Song>();

  @ViewChildren(WyScrollComponent) private wyScroll: QueryList<WyScrollComponent>;

  scrollY = 0;

  constructor(@Inject(WINDOW) private win: Window) { }

  ngOnInit(): void {
  }


  ngOnChanges(changes: SimpleChanges): void {
    if (changes['songList']) {
      // console.log("songlist", this.songList);
      this.currentIndex = 0;
    }

    if (changes['currentSong']) {
      if (this.currentSong) {
        this.currentIndex = findIndex(this.songList, this.currentSong);
        if (this.show) {
          this.scrollToCurrent()
        }
      } else {

      }
    }

    if (changes['show']) {
      if (!changes['show'].firstChange && this.show) {
        this.wyScroll.first.refreshScroll();
        // timer(1000, 2000); // 1s后发射一个流， 每隔2s再发射流

        // timer(80).subscribe(() => {
        //   if (this.currentSong) {
        //     this.scrollToCurrent(0);
        //   }
        // });

        // this.win.setTimeout(() => {
        //   if (this.currentSong) {
        //     this.scrollToCurrent(0);
        //   }
        // }, 80);

      }
    }
  }

  private scrollToCurrent(speed = 300) {
    const songListRefs = this.wyScroll.first.el.nativeElement.querySelectorAll('ul li');
    if (songListRefs.length) {
      const currentLi = <HTMLElement>songListRefs[this.currentIndex || 0];
      const offsetTop = currentLi.offsetTop; //可视区的高度
      const offsetHeight = currentLi.offsetHeight; // 当前播放歌曲的li的高度
      if ((offsetTop - Math.abs(this.scrollY) > offsetHeight * 5) || (offsetTop < Math.abs(this.scrollY))) {
        this.wyScroll.first.scrollToElement(currentLi, speed, false, false);
      }
    }
  }

}
