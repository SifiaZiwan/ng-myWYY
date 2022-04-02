import { HomeService } from './../../services/home.service';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { Banner } from 'src/app/services/data-types/common.types';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})
export class HomeComponent implements OnInit {
  banners: Banner[] | undefined;
  constructor(private homeService: HomeService) {
    this.homeService.getBanners().subscribe(banners => {
      console.log("banners:", banners);
      this.banners = banners;

    })
  }

  ngOnInit(): void {
  }

}
