import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { LoadingComponent } from './ui/loading/loading.component';
import { SeparatorComponent } from './ui/separator/separator.component';



@NgModule({
  declarations: [
    SeparatorComponent,
    LoadingComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ],
  exports: [SeparatorComponent, LoadingComponent]
})
export class SharedModule { }
