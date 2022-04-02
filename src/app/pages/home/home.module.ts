import { NgModule } from '@angular/core';

import { ShareModule } from './../../share/share.module';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { WyCarouselComponent } from './components/wy-carousel/wy-carousel.component';


@NgModule({
  declarations: [
    HomeComponent,
    WyCarouselComponent
  ],
  imports: [
    ShareModule,
    HomeRoutingModule
  ],
  exports: [
    ShareModule,
    HomeRoutingModule
  ]
})
export class HomeModule { }
