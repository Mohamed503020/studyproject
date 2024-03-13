import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LocationStrategy, HashLocationStrategy, CommonModule } from '@angular/common';
import { ToastrModule } from 'ngx-toastr';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { SharedModule } from './shared/shared.module';
import { share } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSortModule } from '@angular/material/sort';
import { NgSelectModule } from '@ng-select/ng-select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ModalModule } from 'ngx-bootstrap/modal';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { CoreModule } from './core/core.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
     CommonModule, BrowserModule, AppRoutingModule, ToastrModule.forRoot(), PopoverModule.forRoot() ,
    FormsModule, ReactiveFormsModule , HttpClientModule  , NgSelectModule  , MatSortModule ,
    BrowserAnimationsModule ,PaginationModule.forRoot() ,ModalModule.forRoot() ,
    BrowserAnimationsModule, ToastrModule.forRoot(), 
    StoreModule.forRoot(), 
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: true,
    }), EffectsModule.forRoot() ,
    CoreModule
  ],
  providers: [
    { provide: LocationStrategy, useClass: HashLocationStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
