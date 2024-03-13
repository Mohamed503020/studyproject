import { Component, OnInit , AfterViewInit } from '@angular/core';
import { Router, NavigationEnd, ActivatedRouteSnapshot, ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs';
import { get } from 'scriptjs';

@Component({
  selector: 'app-features',
  templateUrl: './features.component.html',
  styleUrls: ['./features.component.scss']
})
export class FeaturesComponent implements OnInit , AfterViewInit {
  pageTitle: string = '';

  constructor(private _Router: Router, private _ActivatedRoute: ActivatedRoute) { }
  ngAfterViewInit(): void {
    get("./assets/js/inspinia.js", () => { });
  }

  ngOnInit() {
    if (this._Router.navigated) {
      var currentRoute = this.getCurrentRouteInf(this._ActivatedRoute.snapshot);
      this.pageTitle = currentRoute.data['pageTitle'];
    }

    this._Router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((route) => {
      var currentRoute = this.getCurrentRouteInf(this._ActivatedRoute.snapshot);
      this.pageTitle = currentRoute.data['pageTitle'];
    });
  }

  private getCurrentRouteInf(currentRoute: ActivatedRouteSnapshot): ActivatedRouteSnapshot {
    if (currentRoute.firstChild == null) {
      return currentRoute;
    } else {
      return this.getCurrentRouteInf(currentRoute.firstChild);
    }
  }
}
