import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TitleRoutingModule } from './title-routing.module';
import { TitleComponent } from './title/title.component';


@NgModule({
  declarations: [
    TitleComponent
  ],
  imports: [
    CommonModule,
    TitleRoutingModule
  ]
})
export class TitleModule { }
