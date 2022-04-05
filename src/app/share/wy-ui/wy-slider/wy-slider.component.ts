import { DOCUMENT } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, EventEmitter, forwardRef, Inject, Input, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { distinctUntilChanged, filter, map, pluck, takeUntil, tap, Observable, merge, fromEvent, Subscription } from 'rxjs';
import { isArray } from 'src/app/until/array';
import { getPercent, limitNumberInRange } from 'src/app/until/number';
import { getElementOffset, sliderEvent } from './wy-slider-helper';
import { SliderEventObservaberConfig, SliderValue } from './wy-slider-types';

@Component({
  selector: 'app-wy-slider',
  templateUrl: './wy-slider.component.html',
  styleUrls: ['./wy-slider.component.less'],
  encapsulation: ViewEncapsulation.None, //加上滑块才出来， 解决全局样式能进， 但是组件样式不能出去的问题
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => WySliderComponent),
    multi: true,
  }]
})

export class WySliderComponent implements OnInit, ControlValueAccessor, OnDestroy {
  @Input() wyVertical = false;
  @Input() wyMin = 0;
  @Input() wyMax = 100;
  @Input() bufferPercent: SliderValue = 0;
  @Input() wyOnAfterChange = new EventEmitter<SliderValue>();
  @ViewChild('wySlider', { static: true }) private wySlider: ElementRef;

  private sliderDom: HTMLDivElement;
  private dragStart$: Observable<number>;
  private dragMove$: Observable<number>;
  private dragEnd$: Observable<Event>;
  private dragStart_: Subscription | null;
  private dragMove_: Subscription | null;
  private dragEnd_: Subscription | null;

  private isDragging = false;
  value: SliderValue = null;
  offset: SliderValue = null;

  constructor(@Inject(DOCUMENT) private doc: Document, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.sliderDom = this.wySlider.nativeElement;
    this.createDraggingObservables();
    this.subscribeDrag(['start']);
  }

  ngOnDestroy(): void {
    this.unsubscribeDrag();
  }

  writeValue(value: SliderValue): void {
    this.setValue(value, true);
  }
  registerOnChange(fn: (value: SliderValue) => void): void {
    this.onValueChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  private onValueChange(value: SliderValue): void { }
  private onTouched(): void { };

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


  //订阅 subscribe
  private subscribeDrag(events: string[] = ['start', 'move', 'end']) {
    if (isArray(events, 'start') && this.dragStart$ && !this.dragStart_) {
      this.dragStart_ = this.dragStart$.subscribe(this.onDragStart.bind(this));
    }
    if (isArray(events, 'move') && this.dragMove$ && !this.dragMove_) {
      this.dragMove_ = this.dragMove$.subscribe(this.onDragMove.bind(this));
    }
    if (isArray(events, 'end') && this.dragEnd$ && !this.dragEnd_) {
      this.dragEnd_ = this.dragEnd$.subscribe(this.onDragEnd.bind(this));
    }
  }
  //unsunscribe
  private unsubscribeDrag(events: string[] = ['start', 'move', 'end']) {
    if (isArray(events, 'start') && this.dragStart_) {
      this.dragStart_.unsubscribe();
      this.dragStart_ = null;
    }
    if (isArray(events, 'move') && this.dragMove_) {
      this.dragMove_.unsubscribe();
      this.dragMove_ = null;
    }
    if (isArray(events, 'end') && this.dragEnd_) {
      this.dragEnd_.unsubscribe();
      this.dragEnd_ = null;
    }
  }


  private onDragStart(value: number) {
    this.toggleDragMoving(true);
    this.setValue(value);
  }

  private onDragMove(value: number) {
    if (this.isDragging) {
      this.setValue(value);
      this.cdr.markForCheck();
    }
  }

  private onDragEnd() {
    this.wyOnAfterChange.emit(this.value);
    this.toggleDragMoving(false);
    this.cdr.markForCheck();
  }


  private findClosestValue(position: number): number {
    //总长度
    const sliderLength = this.getSliderLength();

    //滑块 左 上 断点位置
    const sliderStart = this.getSliderStartPostion();

    //滑块当前位置/总长度
    const ratio = limitNumberInRange((position - sliderStart) / sliderLength, 0, 1);
    const ratioTrue = this.wyVertical ? 1 - ratio : ratio;
    return ratioTrue * (this.wyMax - this.wyMin) + this.wyMin;
  }

  private getSliderStartPostion(): number {
    const offset = getElementOffset(this.sliderDom);
    console.log("offset1:", offset);

    return this.wyVertical ? offset.top : offset.left;
  }


  private getSliderLength(): number {
    return this.wyVertical ? this.sliderDom.clientHeight : this.sliderDom.clientWidth;
  }

  private setValue(value: SliderValue, needCheck = false) {
    if (needCheck) {
      if (this.isDragging) return;
      this.value = this.formatValue(value);
      this.updateTrackAndHandles();
    } else if (!this.valueEqual(this.value, value)) {
      this.value = value;
      this.updateTrackAndHandles();
      this.onValueChange(this.value);
    }
  }

  private formatValue(value: SliderValue): SliderValue {
    let res = value;
    if (this.assertValueValid(value)) {
      res = this.wyMin;
    } else {
      res = limitNumberInRange(value, this.wyMin, this.wyMax);
    }
    return res;
  }

  private assertValueValid(value: SliderValue): boolean {
    return isNaN(typeof value !== 'number' ? parseFloat(value) : value);
  }

  private valueEqual(valA: number, valB: number) {
    if (typeof valA !== typeof valB) return false;
    return valA === valB;
  }

  private updateTrackAndHandles() {
    this.offset = this.getValueToOffset(this.value);
    console.log("offset:", this.offset);

    this.cdr.markForCheck();
  }

  private getValueToOffset(value: SliderValue): SliderValue {
    return getPercent(value, this.wyMin, this.wyMax);
  }

  private toggleDragMoving(movable: boolean) {
    this.isDragging = movable;
    if (movable) {
      this.subscribeDrag(['move', 'end']);
    } else {
      this.unsubscribeDrag(['move', 'end']);
    }
  }

}
