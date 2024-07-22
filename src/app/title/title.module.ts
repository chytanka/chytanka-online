import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TitleRoutingModule } from './title-routing.module';
import { TitleComponent } from './title/title.component';
import { SharedModule } from "../shared/shared.module";


@NgModule({
  declarations: [
    TitleComponent
  ],
  imports: [
    CommonModule,
    TitleRoutingModule,
    SharedModule
]
})
export class TitleModule { }
