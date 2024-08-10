import { Component, inject, signal } from '@angular/core';
import { BehaviorSubject, catchError, combineLatest, finalize, MonoTypeOperatorFunction, Observable, of, OperatorFunction, switchMap, tap } from 'rxjs';
import { CatalogService } from '../data-access/catalog.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { MangadexHelper } from '../../shared/utils';
import { MetaTagsService } from '../../shared/data-access/meta-tags.service';
import { CatalogParamsService } from '../data-access/catalog-params.service';

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

  catalog: CatalogService = inject(CatalogService);
  meta = inject(MetaTagsService)
  params = inject(CatalogParamsService)

  queryParams = signal<ParamMap | null>(null);

  protected route: ActivatedRoute = inject(ActivatedRoute)

  mapQueryParamsWithPage(page: number) {
    if(this.queryParams() == null) return;
    const res: any = {};
    this.queryParams()?.keys.forEach(key => {
      res[key] = this.queryParams()?.get(key)
    });
    res.page = page
    return res
  }

  list$ = this.combineQueryParamsAndRefresh()
    .pipe(
      this.tapStartLoading(),
      switchMap(([params]) => {

        this.queryParams.set(params)
        const q = params?.get('q') ?? '';
        const page: number = parseFloat(params?.get('page') ?? '1');
        const tag = params?.get('theme') ?? params?.get('format') ?? params?.get('genre') ?? '';
        const group =  params?.get('group') ?? '';
        
        this.catalog.page.set(page > 0 ? page : 1);
        this.catalog.query.set(q);
        this.catalog.tag.set(tag);
        this.catalog.group.set(group);

        const data$ = this.catalog.getTranslateTitles();

        return data$.pipe(
          this.catchError(),
          this.tapSetTotalPages(),
          this.tapSetMetaTags(),
          this.finalizeLoading()
        )
      })
    )

  roundToNearest(num: number, nearest = 50) {
    return Math.round(num / nearest) * nearest;
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
      const metaTitle = `Читанка Онлайн — більше ${this.roundToNearest(v?.total)} тайтлів українською`
      const metaDesc = `Читати манґу українською онлайн. Не найбільша колекція перекладів манги українською, але все ж... вже більше ${this.roundToNearest(v?.total)} тайтлів українською`;

      this.meta.setTitle(metaTitle)
      this.meta.setDesc(metaDesc)
    })
  }

  protected tapSetTotalPages = (): MonoTypeOperatorFunction<any> => tap(v => this.catalog.total.set(v?.total));

  protected finalizeLoading(): MonoTypeOperatorFunction<any> {
    return finalize(() => this.loading$.next(false))
  }

  protected catchError(): OperatorFunction<any, any> {
    return catchError(() => {
      this.error$.next('Помилка завантаження даних. Спробуйте оновити сторінку');
      return of(null);
    })
  }

}
