import { HttpClient, HttpParams } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { ProxyService } from '../../shared/data-access/proxy.service';
import { CatalogParamsService } from './catalog-params.service';
import { pairPaginationByItems } from 'pair-pagination'

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
  order = signal('latestUploadedChapter'); // relevance (best match), latestUploadedChapter (letestupdate), title, rating, followedCount, createdAt, year
  orderDirection = signal<OrderDirection>('desc');

  orderList = [
    {
      title: 'Найкраща відповідність ',
      order: 'relevance',
      orderDirection: "desc"
    },

    {
      title: 'Нові завантаження',
      order: 'latestUploadedChapter',
      orderDirection: "desc"
    },
    {
      title: 'Старі завантаження',
      order: 'latestUploadedChapter',
      orderDirection: "asc"
    },

    {
      title: 'Назва за зростанням',
      order: 'title',
      orderDirection: "desc"
    },
    {
      title: 'Назва за спаданням',
      order: 'title',
      orderDirection: "asc"
    },

    {
      title: 'Найвищий рейтинг',
      order: 'rating',
      orderDirection: "desc"
    },
    {
      title: 'Найнижчий рейтинг',
      order: 'rating',
      orderDirection: "asc"
    },

    {
      title: 'Найбільше підписок',
      order: 'followedCount',
      orderDirection: "desc"
    },
    {
      title: 'Найменше підписок',
      order: 'followedCount',
      orderDirection: "asc"
    },

    {
      title: 'Додано нещодавно',
      order: 'createdAt',
      orderDirection: "desc"
    },
    {
      title: 'Додано найдавніше',
      order: 'createdAt',
      orderDirection: "asc"
    },

    {
      title: 'Рік за зростанням',
      order: 'year',
      orderDirection: "desc"
    },
    {
      title: 'Рік за спаданням',
      order: 'year',
      orderDirection: "asc"
    },

    {
      title: 'Не сортувати',
      order: '',
      orderDirection: "desc"
    }
  ]

  // offset = computed(() => this.page() == 1 ? 0 : this.limit() * (this.page()))
  offset = computed(() => this.limit() * (this.page() - 1))
  limit = signal(32)

  pagination(totalItems: number, currentPage: number, limitItems: number, pairLimit: number = 1,
    flat: boolean = true) {

    return pairPaginationByItems({
      totalItems, currentPage, limitItems, pairLimit, flat
    })
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
    return this.contentRating.filter(v => v.active).map(v => `&contentRating[]=${v.value}`).join('');
  }

  getTranslateTitles(lg: string = 'uk'): Observable<any> {
    const query = this.query() ? `title=${this.query()}&` : ''
    const includedTags = this.tag() ? `&includedTags[]=${this.tag()}` : ''
    const group = this.group() ? `&group=${this.group()}` : ''

    const contentRating = this.getActiveContentRating();


    const url = `https://api.mangadex.org/manga?${query}limit=${this.limit()}&offset=${this.offset()}&includes[]=cover_art${contentRating}&availableTranslatedLanguage[]=${lg}&order[${this.order()}]=${this.orderDirection()}&includedTagsMode=AND&excludedTagsMode=OR${includedTags}${group}`;

    return this.http.get<any>(this.proxy.proxyUrl(url));
  }

  getByIds(ids: string[], lg: string = 'uk'): Observable<any> {
    const qIds = ids.map(id => `ids[]=${id}`)
    const contentRating = this.getActiveContentRating();

    const url = `https://api.mangadex.org/manga?${qIds.join('&')}&availableTranslatedLanguage[]=${lg}&includes[]=cover_art${contentRating}`;

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