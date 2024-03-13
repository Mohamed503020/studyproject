import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeaturesComponent } from './features.component';
import { FeaturesRoutingModule } from './features.routing';
import { FooterComponent } from './layouts/footer/footer.component';
import { HeaderComponent } from './layouts/header/header.component';
import { SidebarComponent } from './layouts/sidebar/sidebar.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSortModule } from '@angular/material/sort';
import { NgSelectModule } from '@ng-select/ng-select';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { ToastrModule } from 'ngx-toastr';
import { SharedModule } from '../shared/shared.module';



@NgModule({
  declarations: [
    FeaturesComponent,  HeaderComponent, SidebarComponent, FooterComponent
  ],
  imports: [
    CommonModule , FormsModule ,FeaturesRoutingModule  , ReactiveFormsModule, SharedModule ,
    HttpClientModule,NgSelectModule  ,ToastrModule , MatSortModule ,PopoverModule 
  ]
})
export class FeaturesModule { }
