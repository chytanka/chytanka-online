import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadChildren: () => import('./catalog/catalog.module').then(m => m.CatalogModule)
    },
    {
        path: 't',
        loadChildren: () => import('./title/title.module').then(m => m.TitleModule)
    },
    {
        path: 'read',
        loadChildren: () => import('./read/read.module').then(m => m.ReadModule)
    }
];
