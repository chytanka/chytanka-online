import { Component, inject } from '@angular/core';
import { BehaviorSubject, catchError, combineLatest, finalize, map, MonoTypeOperatorFunction, Observable, of, OperatorFunction, pipe, switchMap, tap } from 'rxjs';
import { CatalogService } from '../data-access/catalog.service';
import { getAverageColor } from '../../shared/utils/average-color';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { MangadexHelper } from '../../shared/utils';

@Component({
  selector: 'chtnk-catalog-shell',
  templateUrl: './catalog-shell.component.html',
  styleUrl: './catalog-shell.component.scss'
})
export class CatalogShellComponent {
  MangadexHelper = MangadexHelper

  protected refresh$: BehaviorSubject<null> = new BehaviorSubject<null>(null);
  error$: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);
  loading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

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
  title: Title = inject(Title);
  protected route: ActivatedRoute = inject(ActivatedRoute)

  list$ = this.combineQueryParamsAndRefresh()
    .pipe(
      this.tapStartLoading(),
      switchMap(([params]) => {

        const q = params?.get('q') ?? '';
        const page: number = parseFloat(params?.get('page') ?? '1');

        this.catalog.page.set(page > 0 ? page : 1);

        const data$ = this.catalog.getTranslateTitles(q);

        return data$.pipe(
          map(res => res),
          this.catchError(),
          tap(v => v.data.forEach((el: any) => {
            el.deg = this.getRandomDeg()
          })),
          tap(v => this.catalog.total.set(v.total)),
          tap(v => this.title.setTitle(`Читанка Онлайн — більше ${this.roundToNearest(v.total)} тайтлів українською`)),
          this.finalizeLoading()
        )
      })
    )

  // getCover(relationships: any[]): any {
  //   return relationships.filter((r: any) => r.type == 'cover_art')[0] ?? null
  // }

  // getTitle(attributes: any): any {
  //   return attributes?.altTitles?.filter((alt: any) => alt?.uk)[0]?.uk ?? attributes?.title.en ?? attributes?.title[attributes?.originalLanguage]
  // }

  roundToNearest(num: number, nearest = 50) {
    return Math.round(num / nearest) * nearest;
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

  getRandomDeg(min: number = -1, max: number = 1) {
    return (Math.random() * (max - min) + min);
  }

  averageColor(event: Event, element: HTMLElement) {
    const img = event.target as HTMLImageElement

    if (!img) return;

    const avc = getAverageColor(img).hex;

    element.style.setProperty('--avarage-color', avc)
  }

  protected combineQueryParamsAndRefresh(): Observable<[ParamMap, null]> {
    return combineLatest([this.route.queryParamMap, this.refresh$])
  }

  public refreshData() {
    this.refresh$.next(null);
  }

  protected tapStartLoading(): MonoTypeOperatorFunction<[ParamMap, null]> {
    return tap(() => {
      this.loading$.next(true);   // Sets the loading flag to `true`
      this.error$.next(null);     // Resets any previous errors to `null`
    })
  }


  protected finalizeLoading(): MonoTypeOperatorFunction<any> {
    return finalize(() => this.loading$.next(false))
  }

  protected catchError(): OperatorFunction<any, any> {
    return catchError(() => {
      this.error$.next('this.lang.ph().dataLoadErr');
      return of(null);
    })
  }

}
