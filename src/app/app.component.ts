import { Component, LOCALE_ID } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';

import { registerLocaleData } from '@angular/common';
import localeUk from "@angular/common/locales/uk";
import { CatalogModule } from './catalog/catalog.module';
import { TitleModule } from './title/title.module';

registerLocaleData(localeUk)

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule, CatalogModule, TitleModule],
  providers: [{ provide: LOCALE_ID, useValue: 'uk-UA'}],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'chytanka-online';
}
