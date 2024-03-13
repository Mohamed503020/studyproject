import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '', loadChildren: () => import('./features/features.module').then(m => m.FeaturesModule)
  }
];

export const AppRoutingModule = RouterModule.forRoot(routes);
