import { Routes, RouterModule } from '@angular/router'
import { FeaturesComponent } from './features.component';

const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'admin'
    },
    {
        path: '',
        component: FeaturesComponent,
        canActivateChild: [],
        children: [
            {
                path: 'admin', loadChildren: () => import('../admin/admin.module').then(m => m.AdminModule)
            }
        ]
    }
];


export const FeaturesRoutingModule = RouterModule.forChild(routes);