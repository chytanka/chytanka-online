import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CatalogRoutingModule } from './catalog-routing.module';
import { CatalogShellComponent } from './catalog-shell/catalog-shell.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    CatalogShellComponent
  ],
  imports: [
    CommonModule,
    CatalogRoutingModule,
    SharedModule
  ]
})
export class CatalogModule { }
