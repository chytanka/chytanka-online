import { Routes } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { TitleComponent } from './title/title/title.component';
import { CatalogShellComponent } from './catalog/catalog-shell/catalog-shell.component';

export const routes: Routes = [
    {
        path: 'about',
        component: AboutComponent
    },
    {
        path: ':id',
        loadChildren: () => import('./title/title.module').then(m => m.TitleModule),
        pathMatch: 'full'
    },
    {
        path: '',
        loadChildren: () => import('./catalog/catalog.module').then(m => m.CatalogModule),
        pathMatch: 'full'
    }
];
