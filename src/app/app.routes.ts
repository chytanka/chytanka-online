import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: ':id',
        loadChildren: () => import('./title/title.module').then(m => m.TitleModule),
        pathMatch: 'full'
    },
    {
        path: '',
        loadChildren: () => import('./catalog/catalog.module').then(m => m.CatalogModule),
        pathMatch: 'full'
    },
];
