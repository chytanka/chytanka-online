import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { LoadingComponent } from './ui/loading/loading.component';
import { SeparatorComponent } from './ui/separator/separator.component';
import { ImgRotateComponent } from './ui/img-rotate/img-rotate.component';
import { TitleCardComponent } from './ui/title-card/title-card.component';
import { MadeInUkraineComponent } from './ui/made-in-ukraine/made-in-ukraine.component';



@NgModule({
  declarations: [
    SeparatorComponent,
    LoadingComponent,
    ImgRotateComponent,
    TitleCardComponent,
    MadeInUkraineComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ],
  exports: [SeparatorComponent, LoadingComponent, ImgRotateComponent, TitleCardComponent, MadeInUkraineComponent]
})
export class SharedModule { }
