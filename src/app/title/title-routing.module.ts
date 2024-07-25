import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TitleComponent } from './title/title.component';

const routes: Routes = [
  {
    path: '',
    component: TitleComponent,
    pathMatch: 'full'
  },
];
// RouterModule.forChild(routes)
@NgModule({
  imports: [],
  exports: [RouterModule]
})
export class TitleRoutingModule { }
