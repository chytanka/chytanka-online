import { Component, LOCALE_ID } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';

import { registerLocaleData } from '@angular/common';
import localeUk from "@angular/common/locales/uk";

registerLocaleData(localeUk)

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule],
  providers: [{ provide: LOCALE_ID, useValue: 'uk-UA'}],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'chytanka-online';
}
