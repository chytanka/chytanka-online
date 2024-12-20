import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { ProxyService } from '../../shared/data-access/proxy.service';

@Injectable({
  providedIn: 'root'
})
export class TitleService {

  total = signal(0)
  page = signal(1);
  offset = computed(() => this.limit() * (this.page() - 1))
  limit = signal(100)

  protected http: HttpClient = inject(HttpClient)
  proxy: ProxyService = inject(ProxyService)


  getTitle(id: string): Observable<any> {

    return this.http.get<any>(this.proxy.proxyUrl(`https://api.mangadex.org/manga/${id}?includes[]=cover_art&includes[]=artist&includes[]=author`));
  }

  getTitleEpisodes(id: string, lg: string = 'uk'): Observable<any> {

    return this.http.get<any>(this.proxy.proxyUrl(`https://api.mangadex.org/manga/${id}/feed?translatedLanguage[]=${lg}&limit=${this.limit()}&offset=${this.offset()}&includes[]=scanlation_group&order[volume]=asc&order[chapter]=asc&contentRating[]=safe&contentRating[]=suggestive&contentRating[]=erotica&contentRating[]=pornographic`));
  }
}


// https://api.mangadex.org/manga/49c7b586-b0a3-4776-b3f5-3bdc62d82161/feed?translatedLanguage[]=uk&translatedLanguage[]=en&limit=96&includes[]=scanlation_group&includes[]=user&order[volume]=asc&order[chapter]=asc&offset=0&contentRating[]=safe&contentRating[]=suggestive&contentRating[]=erotica&contentRating[]=pornographic