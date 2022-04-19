import { isPlatformBrowser } from '@angular/common';
import { Injectable, InjectionToken, NgModule, PLATFORM_ID } from '@angular/core';
import { window } from 'rxjs';

export const API_CONFIG = new InjectionToken('ApiConfigToken');
export const WINDOW = new InjectionToken('WindowToken');

@NgModule({
  declarations: [],
  imports: [
  ],
  exports: [
  ],
  providers: [
    { provide: API_CONFIG, useValue: "http://localhost:3000/" },
    {
      provide: WINDOW,
      useFactory(platfromId: Object): Window | Object { //浏览器环境下给个对象
        return isPlatformBrowser(platfromId) ? window : {};
      },
      deps: [PLATFORM_ID]
    }
  ]
})
export class ServicesModule { }
