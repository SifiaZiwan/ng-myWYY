import { DOCUMENT } from '@angular/common';
import { Component, ElementRef, Inject, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { distinctUntilChanged, filter, Event, map, pluck, takeUntil, tap, Observable, merge } from 'rxjs';
import { isArray } from 'src/app/until/array';
import { sliderEvent } from './wy-slider-helper';
import { SliderEventObservaberConfig } from './wy-slider-types';

@Component({
  selector: 'app-wy-slider',
  templateUrl: './wy-slider.component.html',
  styleUrls: ['./wy-slider.component.less'],
  encapsulation: ViewEncapsulation.None //加上滑块才出来， 解决全局样式能进， 但是组件样式不能出去的问题
})
export class WySliderComponent implements OnInit {
  @Input() wyVertical;
  @ViewChild('wySlider', { static: true }) private wySlider: ElementRef;

  private sliderDom: HTMLDivElement;
  private dragStart$: Observable<number>;
  private dragMove$: Observable<number>;
  private dragEnd$: Observable<Event>;

  constructor(@Inject(DOCUMENT) private doc: Document) { }

  ngOnInit(): void {
    this.sliderDom = this.wySlider.nativeElement;
    this.createDraggingObservables();
    this.subScribeDrag(['start']);
  }

  private createDraggingObservables() {
    const orientField = this.wyVertical ? "pageY" : "pageX";
    const mouse: SliderEventObservaberConfig = {
      start: 'mousedown',
      move: 'mousemove',
      end: 'mouseup',
      filterFn: (e: MouseEvent) => e instanceof MouseEvent,
      pluckKey: [orientField],
    };
    const touch: SliderEventObservaberConfig = {
      start: 'mousestart',
      move: 'mousemove',
      end: 'mouseend',
      filterFn: (e: TouchEvent) => e instanceof TouchEvent,
      pluckKey: ['touch', '0', orientField],
    };

    [mouse, touch].forEach(source => {
      const { start, move, end, filterFn, pluckKey } = source;

      source.startPlucked$ = fromEvent(this.sliderDom, start)
        .pipe(
          filter(filterFn),
          tap(sliderEvent),
          pluck(...pluckKey),
          map((position: number) => this.findClosestValue(position))
        );

      source.end$ = fromEvent(this.doc, end);
      source.moveResolved$ = fromEvent(this.sliderDom, move)
        .pipe(
          filter(filterFn),
          tap(sliderEvent),
          pluck(...pluckKey),
          distinctUntilChanged(),
          map((position: number) => this.findClosestValue(position)),
          takeUntil(source.end$)
        );
    });

    //绑定
    this.dragStart$ = merge(mouse.startPlucked$, touch.startPlucked$);
    this.dragMove$ = merge(mouse.moveResolved$, touch.moveResolved$);
    this.dragEnd$ = merge(mouse.end$, touch.end$);
  }


  private findClosestValue(position: number) {
  }

  //订阅
  subScribeDrag(events: string[] = ['start', 'move', 'end']) {
    if (isArray(events, 'start') && this.dragStart$) {
      this.dragStart$.subscribe(this.onDragStart.bind(this));
    }
    if (isArray(events, 'move') && this.dragMove$) {
      this.dragStart$.subscribe(this.onDragMove.bind(this));
    }
    if (isArray(events, 'end') && this.dragEnd$) {
      this.dragStart$.subscribe(this.onDragEnd.bind(this));
    }
  }

  private onDragStart(value: number) {
    console.log("start value", value);

  }
  private onDragMove(value: number) {

  }
  private onDragEnd() {

  }

}
