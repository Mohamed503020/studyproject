import { Router } from '@angular/router';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { UserRoleEnum } from 'src/app/shared/enums/user-role.enum';
declare let $: any;

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  get userRoleEnum() {
    return UserRoleEnum;
  }

  constructor(private _Router: Router) { }

  ngOnInit() {
  }

  signout() {
    localStorage.clear();
    this._Router.navigateByUrl('/login');
  }

}
