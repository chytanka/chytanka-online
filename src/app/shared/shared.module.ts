import { NgModule } from '@angular/core';
import { CommonModule, IMAGE_CONFIG, PRECONNECT_CHECK_BLOCKLIST } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { LoadingComponent } from './ui/loading/loading.component';
import { SeparatorComponent } from './ui/separator/separator.component';
import { ImgRotateComponent } from './ui/img-rotate/img-rotate.component';
import { TitleCardComponent } from './ui/title-card/title-card.component';
import { MadeInUkraineComponent } from './ui/made-in-ukraine/made-in-ukraine.component';
import { SearchFormComponent } from './ui/search-form/search-form.component';
import { NgOptimizedImage } from '@angular/common';


@NgModule({
  declarations: [
    SeparatorComponent,
    LoadingComponent,
    ImgRotateComponent,
    TitleCardComponent,
    MadeInUkraineComponent,
    SearchFormComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    NgOptimizedImage
  ],
  exports: [SeparatorComponent, LoadingComponent, ImgRotateComponent, TitleCardComponent, MadeInUkraineComponent, SearchFormComponent
  ],
  providers: [

    { provide: PRECONNECT_CHECK_BLOCKLIST, useValue: 'https://proxy.chytanka.ink' }

    // {
    //   provide: IMAGE_CONFIG,
    //   useValue: {
    //     placeholderResolution: 40
    //   }
    // },
  ]
})
export class SharedModule { }
