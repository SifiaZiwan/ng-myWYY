import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { FormsModule } from '@angular/forms';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzCarouselModule } from 'ng-zorro-antd/carousel';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormsModule,
    NzButtonModule,
    NzLayoutModule,
    NzMenuModule,
    NzInputModule,
    NzIconModule,
    NzCarouselModule
  ],
  exports: [
    CommonModule,
    FormsModule,
    NzButtonModule,
    NzLayoutModule,
    NzMenuModule,
    NzInputModule,
    NzIconModule,
    NzCarouselModule
  ]
})
export class ShareModule { }
