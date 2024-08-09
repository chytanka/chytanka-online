import { HttpClient, HttpParams } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { ProxyService } from '../../shared/data-access/proxy.service';
import { CatalogParamsService } from './catalog-params.service';

type OrderDirection = 'asc' | 'desc'

@Injectable({
  providedIn: 'root'
})
export class CatalogService {
  params = inject(CatalogParamsService)

  total = signal(0)

  page = signal(1);
  query = signal('');
  tag = signal('')
  group = signal('')
  order = signal('relevance');
  orderDirection = signal<OrderDirection>('asc');

  // offset = computed(() => this.page() == 1 ? 0 : this.limit() * (this.page()))
  offset = computed(() => this.limit() * (this.page() -1))
  limit = signal(32)

  getPaginationPages(totalItems: number, currentPage: number, limit: number) {
    const totalPages = Math.ceil(totalItems / limit);
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

  http: HttpClient = inject(HttpClient)
  proxy: ProxyService = inject(ProxyService)

  contentRating = [
    { value: 'safe', active: true },
    { value: 'suggestive', active: true },
    { value: 'erotica', active: true },
    { value: 'pornographic', active: true }
  ]

  getActiveContentRating() {
    return this.contentRating.filter(v=>v.active).map(v=>`&contentRating[]=${v.value}`).join('');
  }

  getTranslateTitles(lg: string = 'uk'): Observable<any> {
    const query = this.query() ? `title=${this.query()}&` : ''
    const includedTags = this.tag() ? `&includedTags[]=${this.tag()}` : ''
    const group = this.group() ? `&group=${this.group()}` : ''

    const contentRating = this.getActiveContentRating();
    

    const url = `https://api.mangadex.org/manga?${query}limit=${this.limit()}&offset=${this.offset()}&includes[]=cover_art${contentRating}&availableTranslatedLanguage[]=${lg}&order[${this.order()}]=${this.orderDirection()}&includedTagsMode=AND&excludedTagsMode=OR${includedTags}${group}`;

    return this.http.get<any>(this.proxy.proxyUrl(url));
  }

  getOriginalTitles(lg: string = 'uk'): Observable<any> {
    const query = this.query() ? `title=${this.query()}&` : ''
    const includedTags = this.tag() ? `&includedTags[]=${this.tag()}` : ''

    const url = `https://api.mangadex.org/manga?${query}limit=${this.limit()}&offset=${this.offset()}&includes[]=cover_art&contentRating[]=safe&contentRating[]=suggestive&contentRating[]=erotica&originalLanguage[]=${lg}&order[${this.order()}]=${this.orderDirection()}&includedTagsMode=AND&excludedTagsMode=OR${includedTags}`;

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

// https://api.mangadex.org/manga?limit=32&offset=0&includes[]=cover_art&contentRating[]=safe&contentRating[]=suggestive&contentRating[]=erotica&contentRating[]=pornographic&includedTags[]=4d32cc48-9f00-4cca-9b5a-a839f0764984&includedTags[]=423e2eae-a7a2-4a8b-ac03-a8351462d71d&includedTagsMode=AND&excludedTagsMode=OR


//by group
//https://api.mangadex.org/manga?limit=32&offset=0&includes[]=cover_art&contentRating[]=safe&contentRating[]=suggestive&contentRating[]=erotica&contentRating[]=pornographic&group=c0b55b53-89e8-4413-bb0e-9f363af23293

// random

// https://api.mangadex.org/manga/random?contentRating[]=safe&contentRating[]=suggestive&contentRating[]=erotica&contentRating[]=pornographic&includes[]=artist&includes[]=author&includes[]=cover_art