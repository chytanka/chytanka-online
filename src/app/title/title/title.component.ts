import { Component, inject, OnDestroy, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { TitleService } from '../data-access/title.service';
import { map, MonoTypeOperatorFunction, tap } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, Meta, Title } from '@angular/platform-browser';
import { getAverageColor } from '../../shared/utils/average-color';
import { MangadexHelper } from '../../shared/utils';
import { isPlatformBrowser } from '@angular/common';
import { MetaTagsService } from '../../shared/data-access/meta-tags.service';

@Component({
  selector: 'app-title',
  templateUrl: './title.component.html',
  styleUrl: './title.component.scss'
})
export class TitleComponent implements OnInit, OnDestroy {
  ngOnDestroy(): void {
    this.meta.removeAdult()
  }
  ngOnInit(): void {
    this.document = (isPlatformBrowser(this.platformId)) ? document?.documentElement : undefined;
  }
  Object = Object;
  MangadexHelper = MangadexHelper

  platformId = inject(PLATFORM_ID)

  document = (isPlatformBrowser(this.platformId)) ? document?.documentElement : undefined;
  titleService: TitleService = inject(TitleService);
  protected route: ActivatedRoute = inject(ActivatedRoute)

  sanitizer = inject(DomSanitizer)


  meta = inject(MetaTagsService)

  title$ = this.titleService.getTitle(this.route.snapshot.params['id']).pipe(
    map(res => res.data),
    this.tapSetMetaTags()
  )

  protected tapSetMetaTags(): MonoTypeOperatorFunction<any> {
    return tap((v) => {
      this.meta.setTitle(`Читати ${MangadexHelper.getTitle(v.attributes)} від ${MangadexHelper.getAuthor(v.relationships).attributes.name} онлайн в Читанці`)
      this.meta.setDesc(this.MangadexHelper.desc(v.attributes))

      if (MangadexHelper.isNSFW(v.attributes)) {
        this.meta.setAdult()
      }

    })
  }

  episodes$ = this.titleService.getTitleEpisodes(this.route.snapshot.params['id']).pipe(
    tap(v => this.titleService.total.set(v.total)),
    map(res => res.data),
    tap(v => this.setCurrentId(this.getCurrentId() ??  v[0]?.id))
  )


  listBlobUrl = '';

  getCurrentId() {

    return (isPlatformBrowser(this.platformId))? localStorage.getItem(this.route.snapshot.params['id']) : ''
  }

  setCurrentId( id: string) {
    this.currentId.set(id);
    if (isPlatformBrowser(this.platformId))
      localStorage.setItem(this.route.snapshot.params['id'], id);
  }
  

  currentId = signal(this.getCurrentId())

  averageColor(event: Event, element: HTMLElement | undefined) {
    if (!element) return;
    const img = event.target as HTMLImageElement

    if (!img) return;

    const avc = getAverageColor(img).hex;

    element.style.setProperty('--avarage-color', avc)
  }

  // jsonToBlobURL(obj: any) {
  //   const str = JSON.stringify(obj);
  //   const bytes = new TextEncoder().encode(str);
  //   const blob = new Blob([bytes], {
  //     type: "application/json;charset=utf-8"
  //   });

  //   return URL.createObjectURL(blob)
  // }

  // playListUrl(mangadexList: any) {
  //   const res: any[] = []

  //   mangadexList.forEach((item: any) => {
  //     res.push(`https://mangadex.org/chapter/${item.id}`)
  //   });

  //   return this.jsonToBlobURL(res)
  // }

  parseMarkdown(markdown: string): string {
    if (!markdown) return ''

    let html = markdown
      .split('\n\n')
      .map(paragraph => `<p>${paragraph.replace(/\n/g, ' ')}</p>`)
      .join('\n');

    html = html.replace(/\[([^\]]+)\]\(([^\)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');

    return html;
  }

  getFavicon(link: string) {
    const url = new URL(link)

    return url.origin + '/favicon.ico'
  }
}
