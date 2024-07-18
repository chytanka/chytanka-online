import { HttpClient, HttpParams } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CatalogService {

  total = signal(0)

  page = signal(1);

  offset = computed(() => this.limit() * (this.page() - 1))
  limit = signal(30)


  //#region filters

  //#endregion

  protected http: HttpClient = inject(HttpClient)

  getTitles(lg: string = 'uk'): Observable<any> {

    return this.http.get<any>(`https://proxy-seven-xi.vercel.app/api?url=https://api.mangadex.org/manga?limit=${this.limit()}&offset=${this.offset()}&includes[]=cover_art&contentRating[]=safe&contentRating[]=suggestive&contentRating[]=erotica&availableTranslatedLanguage[]=${lg}&includedTagsMode=AND&excludedTagsMode=OR`);
  }
}
