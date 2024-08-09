import { Component, inject, LOCALE_ID } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';

import { registerLocaleData } from '@angular/common';
import localeUk from "@angular/common/locales/uk";
import { CatalogModule } from './catalog/catalog.module';
import { TitleModule } from './title/title.module';
import { CatalogService } from './catalog/data-access/catalog.service';
import { SharedModule } from "./shared/shared.module";

registerLocaleData(localeUk)

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule, CatalogModule, TitleModule, SharedModule],
  providers: [{ provide: LOCALE_ID, useValue: 'uk-UA'}],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'chytanka-online';
  catalog = inject(CatalogService)
}
