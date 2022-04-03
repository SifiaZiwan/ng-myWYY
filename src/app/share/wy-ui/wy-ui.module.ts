import { WyPlayerModule } from './wy-player/wy-player.module';
import { NgModule } from '@angular/core';
import { SingleSheetComponent } from './single-sheet/single-sheet.component';
import { PlayCountPipe } from '../pipes/play-count.pipe';



@NgModule({
  declarations: [
    SingleSheetComponent,
    PlayCountPipe
  ],
  imports: [
    WyPlayerModule,
  ],
  exports: [
    SingleSheetComponent,
    PlayCountPipe,
    WyPlayerModule,
  ]
})
export class WyUiModule { }
