import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { LoadingComponent } from './ui/loading/loading.component';
import { SeparatorComponent } from './ui/separator/separator.component';
import { ImgRotateComponent } from './ui/img-rotate/img-rotate.component';



@NgModule({
  declarations: [
    SeparatorComponent,
    LoadingComponent,
    ImgRotateComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ],
  exports: [SeparatorComponent, LoadingComponent, ImgRotateComponent]
})
export class SharedModule { }
