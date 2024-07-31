import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { LoadingComponent } from './ui/loading/loading.component';
import { SeparatorComponent } from './ui/separator/separator.component';
import { ImgRotateComponent } from './ui/img-rotate/img-rotate.component';
import { TitleCardComponent } from './ui/title-card/title-card.component';



@NgModule({
  declarations: [
    SeparatorComponent,
    LoadingComponent,
    ImgRotateComponent,
    TitleCardComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ],
  exports: [SeparatorComponent, LoadingComponent, ImgRotateComponent, TitleCardComponent]
})
export class SharedModule { }
