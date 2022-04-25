import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy, ViewChild, ElementRef, AfterViewInit, Input, OnChanges, SimpleChanges, Output, EventEmitter, Inject } from '@angular/core';
import BScroll from '@better-scroll/core';
import ScrollBar from '@better-scroll/scroll-bar';
import MouseWheel from '@better-scroll/mouse-wheel'
import { timer } from 'rxjs';
import { WINDOW } from 'src/app/services/services.module';

BScroll.use(ScrollBar);
BScroll.use(MouseWheel);

// const BScroll = require('@better-scroll/scroll')

@Component({
  selector: 'app-wy-scroll',
  template: `
    <div class="wy-scroll" #wrap>
      <ng-content></ng-content>
    </div>
  `,
  styles: [`.wy-scroll{width: 100%; height: 100%; overflow: hidden;}`],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WyScrollComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() data: any[];
  @Input() refreshDelay = 50;
  @Output() onScrollEnd = new EventEmitter<number>();
  private bs: BScroll;

  @ViewChild('wrap', { static: true }) private wrapRef: ElementRef;
  constructor(readonly el: ElementRef, @Inject(WINDOW) private win: Window) { }
  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.bs = new BScroll(this.wrapRef.nativeElement, {
      scrollbar: {
        fade: true,
        interactive: true,
      },
      mouseWheel: {},
    });
    this.bs.on('scrollEnd', ({ y }) => this.onScrollEnd.emit(y)); //滚动条的高度
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      this.refreshScroll();
    }
  }

  scrollToElement(...args) {
    this.bs.scrollToElement.apply(this.bs, args);
  }

  private refresh() {
    this.bs.refresh();
  }

  refreshScroll() {
    //方法一
    timer(this.refreshDelay).subscribe(() => {
      this.refresh();
    })

    //方法二, 浏览器使用setTimeout时
    // this.win.setTimeout(() => {
    //   this.refresh();
    // }, this.refreshDelay);

  }

}
