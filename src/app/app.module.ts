import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import en from '@angular/common/locales/en';
import { CoreModule } from './core/core.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    CoreModule,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
