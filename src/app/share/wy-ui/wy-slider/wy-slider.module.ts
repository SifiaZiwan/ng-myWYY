import { WySliderTrackComponent } from './wy-slider-track.component';
import { WySliderHandleComponent } from './wy-slider-handle.component';
import { NgModule } from '@angular/core';
import { WySliderComponent } from './wy-slider.component';
import { CommonModule } from '@angular/common';



@NgModule({
  declarations: [
    WySliderComponent,
    WySliderHandleComponent,
    WySliderTrackComponent,
  ],
  imports: [
    CommonModule
  ],
  exports: [
    WySliderComponent
  ]
})
export class WySliderModule { }
