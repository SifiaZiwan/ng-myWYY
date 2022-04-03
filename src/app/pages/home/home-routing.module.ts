import { HomeComponent } from './home.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeRsolverService } from './home.resolver.services';

const routes: Routes = [
  { path: 'home', component: HomeComponent, data: { title: '发现' }, resolve: { homeDatas: HomeRsolverService } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [HomeRsolverService]
})
export class HomeRoutingModule { }
