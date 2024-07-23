import { Component, inject, OnInit } from '@angular/core';
import { BehaviorSubject, catchError, combineLatest, finalize, map, MonoTypeOperatorFunction, Observable, of, OperatorFunction, pipe, switchMap, tap } from 'rxjs';
import { CatalogService } from '../data-access/catalog.service';
import { getAverageColor } from '../../shared/utils/average-color';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
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
  }

  catalog: CatalogService = inject(CatalogService);
  title: Title = inject(Title);
  meta = inject(Meta)
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
          this.catchError(),
          this.tapSetTotalPages(),
          this.tapSetMetaTags(),
          this.tapSetRandomDeg(),
          this.finalizeLoading()
        )
      })
    )

  roundToNearest(num: number, nearest = 50) {
    return Math.round(num / nearest) * nearest;
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

  protected tapSetMetaTags(): MonoTypeOperatorFunction<any> {
    return tap((v: any) => {
      const metaTitle = `Читанка Онлайн — більше ${this.roundToNearest(v.total)} тайтлів українською`
      const metaDesc = `Читати манґу українською онлайн. Не найбільша колекція перекладів манги українською, але все ж... вже більше ${this.roundToNearest(v.total)} тайтлів українською`;

      this.title.setTitle(metaTitle)
      this.meta.updateTag({ name: 'title', content: metaTitle })
      this.meta.updateTag({ name: 'description', content: metaDesc })
    })
  }

  protected tapSetRandomDeg(): MonoTypeOperatorFunction<any> {
    return tap(v => v.data.forEach((el: any) => {
      if (!el.deg) el.deg = this.getRandomDeg()
    }))
  }

  protected tapSetTotalPages = (): MonoTypeOperatorFunction<any> => tap(v => this.catalog.total.set(v.total));

  protected finalizeLoading(): MonoTypeOperatorFunction<any> {
    return finalize(() => this.loading$.next(false))
  }

  protected catchError(): OperatorFunction<any, any> {
    return catchError(() => {
      this.error$.next('Помилка завантаження дпних. Спробуйте оновити сторінку');
      return of(null);
    })
  }

}
