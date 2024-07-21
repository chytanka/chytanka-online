import { HttpClient, HttpParams } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { ProxyService } from '../../shared/data-access/proxy.service';


@Injectable({
  providedIn: 'root'
})
export class CatalogService {

  total = signal(0)

  page = signal(1);

  offset = computed(() => this.page() == 1 ? 0 : this.limit() * (this.page()))
  limit = signal(30)

  getPaginationPages(totalItems: number, currentPage: number, limit: number) {
    const totalPages = Math.floor(totalItems / limit);
    const paginationPages: Array<any> = [];

    // Calculate the range of pages to display
    const delta = 2; // Number of pages to show around the current page
    const rangeStart = Math.max(1, currentPage - delta);
    const rangeEnd = Math.min(totalPages, currentPage + delta);

    for (let i = rangeStart; i <= rangeEnd; i++) {
      paginationPages.push(i);
    }

    // Optionally, add ellipsis or other pagination elements as needed
    if (rangeStart > 1) {
      paginationPages.unshift(1);
      if (rangeStart > 2) {
        paginationPages.splice(1, 0, -1);
      }
    }

    if (rangeEnd < totalPages) {
      if (rangeEnd < totalPages - 1) {
        paginationPages.push(-1);
      }
      paginationPages.push(totalPages);
    }

    return paginationPages;
  }

  //#region filters

  //#endregion

  protected http: HttpClient = inject(HttpClient)
  proxy: ProxyService = inject(ProxyService)

  getTranslateTitles(q: string = '', lg: string = 'uk'): Observable<any> {
    const query = q ? `title=${q}&` : ''
    const url = `https://api.mangadex.org/manga?${query}limit=${this.limit()}&offset=${this.offset()}&includes[]=cover_art&contentRating[]=safe&contentRating[]=suggestive&contentRating[]=erotica&availableTranslatedLanguage[]=${lg}&order[relevance]=desc&includedTagsMode=AND&excludedTagsMode=OR`;

    return this.http.get<any>(this.proxy.proxyUrl(url));
  }

  getOriginalTitles(q: string = '', lg: string = 'uk'): Observable<any> {
    const query = q ? `title=${q}&` : ''
    const url = `https://api.mangadex.org/manga?${query}limit=${this.limit()}&offset=${this.offset()}&includes[]=cover_art&contentRating[]=safe&contentRating[]=suggestive&contentRating[]=erotica&originalLanguage[]=${lg}&order[relevance]=desc&includedTagsMode=AND&excludedTagsMode=OR`;

    return this.http.get<any>(this.proxy.proxyUrl(url));
  }
}

// title=${q}

// https://api.mangadex.org/manga?limit=3&offset=0&includes[]=cover_art&contentRating[]=safe&contentRating[]=suggestive&contentRating[]=erotica&title=%D0%BD%D0%B0%D1%80%D1%83%D1%82%D0%BE&availableTranslatedLanguage[]=uk&order[relevance]=desc&includedTagsMode=AND&excludedTagsMode=OR

// https://api.mangadex.org/docs/3-enumerations/
// 🔎
// Manga order options: 📜 title, 📆 year, 🆕 createdAt, 🕒updatedAt, 🆙latestUploadedChapter, 👥 followedCount, 🔍 relevance

// content rating: 🌟 safe, 🍑 suggestive, erotica, 🔞 pornographic

// Manga status: 🔄 ongoing, ✅ completed, 💤 hiatus, ⛔ cancelled