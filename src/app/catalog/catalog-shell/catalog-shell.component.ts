import { Component, inject } from '@angular/core';
import { BehaviorSubject, map, pipe, switchMap, tap } from 'rxjs';
import { CatalogService } from '../data-access/catalog.service';

@Component({
  selector: 'chtnk-catalog-shell',
  templateUrl: './catalog-shell.component.html',
  styleUrl: './catalog-shell.component.scss'
})
export class CatalogShellComponent {

  /**
   *
   */
  constructor() {
    this.initStatusMap();
    this.initContentRatingMap();
  }

  statusMap = new Map<string, string>()
  contentRatingMap = new Map<string, string>()

  catalog: CatalogService = inject(CatalogService);

  list$ = this.catalog.getTitles().pipe(map(res => res), tap(v => this.catalog.total.set(v.total)))

  getCover(relationships: any[]): any {
    return relationships.filter((r: any) => r.type == 'cover_art')[0] ?? null
  }

  getTitle(attributes: any): any {
    return attributes.altTitles.filter((alt: any) => alt?.uk)[0]?.uk ?? attributes.title.en ?? attributes.title[attributes.originalLanguage]
  }

  initStatusMap() {
    this.statusMap.set('ongoing', '📝')
    this.statusMap.set('completed', '✅')
  }

  initContentRatingMap() {
    this.contentRatingMap.set('safe', '🎈')
    this.contentRatingMap.set('suggestive', '😏')
    this.contentRatingMap.set('erotica', '👙')
    this.contentRatingMap.set('pornographic', '🔞')

    
  }

}
