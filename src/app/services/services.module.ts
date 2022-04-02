import { InjectionToken, NgModule } from '@angular/core';

export const API_CONFIG = new InjectionToken('ApConfigToken');
@NgModule({
  declarations: [],
  imports: [
  ],
  exports: [

  ],
  providers: [
    { provide: API_CONFIG, useValue: "http://localhost:3000" }
  ]
})
export class ServicesModule { }
