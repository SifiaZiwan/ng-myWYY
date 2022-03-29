import { NgModule, Optional, SkipSelf } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { en_US, NZ_I18N, zh_CN } from 'ng-zorro-antd/i18n';
import { AppRoutingModule } from '../app-routing.module';
import { ShareModule } from '../share/share.module';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';

registerLocaleData(en, zh_CN, en_US);

@NgModule({
  declarations: [],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ShareModule,
    AppRoutingModule,
  ],
  exports: [
    ShareModule,
    AppRoutingModule
  ],
  providers: [{ provide: NZ_I18N, useValue: en_US }]
})
export class CoreModule {

  constructor(@SkipSelf() @Optional() private parentModule: CoreModule) {
    if (parentModule) {
      throw new Error("CoreModule only be called by Appodule!")
    }
  }
}
