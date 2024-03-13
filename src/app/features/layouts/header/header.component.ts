import { Component, OnInit, AfterViewInit, HostListener } from '@angular/core';
declare let $: any;
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, AfterViewInit {
 
  constructor(private _Router: Router) { }

  ngOnInit() {
  }

  ngAfterViewInit(): void {

    $('.navbar-minimalize').on('click',  (event : Event) =>{
      event.preventDefault();
      $("body").toggleClass("mini-navbar");
      SmoothlyMenu();
    });

    function SmoothlyMenu() {
      if (!$('body').hasClass('mini-navbar') || $('body').hasClass('body-small')) {
        // Hide menu in order to smoothly turn on when maximize menu
        $('#side-menu').hide();
        // For smoothly turn on menu
        setTimeout(
          function () {
            $('#side-menu').fadeIn(400);
          }, 200);
      } else if ($('body').hasClass('fixed-sidebar')) {
        $('#side-menu').hide();
        setTimeout(
          function () {
            $('#side-menu').fadeIn(400);
          }, 100);
      } else {
        // Remove all inline style from jquery fadeIn function to reset menu state
        $('#side-menu').removeAttr('style');
      }
    }
  }

  signout() {
    localStorage.clear();
    this._Router.navigateByUrl('/login');
  }

}
