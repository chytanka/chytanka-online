import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CatalogShellComponent } from './catalog-shell/catalog-shell.component';

const routes: Routes = [{
  path: '',
  component: CatalogShellComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CatalogRoutingModule { }
