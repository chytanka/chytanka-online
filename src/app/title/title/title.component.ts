import { Component, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { TitleService } from '../data-access/title.service';
import { map, tap } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, Meta, Title } from '@angular/platform-browser';
import { getAverageColor } from '../../shared/utils/average-color';
import { MangadexHelper } from '../../shared/utils';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-title',
  templateUrl: './title.component.html',
  styleUrl: './title.component.scss'
})
export class TitleComponent implements OnInit {
  ngOnInit(): void {
    this.document = (isPlatformBrowser(this.platformId)) ? document?.documentElement : undefined;
  }
  Object = Object;
  MangadexHelper = MangadexHelper

  platformId = inject(PLATFORM_ID)

  document = (isPlatformBrowser(this.platformId)) ? document?.documentElement : undefined;
  titleService: TitleService = inject(TitleService);
  protected route: ActivatedRoute = inject(ActivatedRoute)
  title = inject(Title)
  meta = inject(Meta)
  sanitizer = inject(DomSanitizer)

  activeIndex = signal(0)

  title$ = this.titleService.getTitle(this.route.snapshot.params['id']).pipe(
    map(res => res.data),
    tap((v) => {
      const t = MangadexHelper.getTitle(v.attributes)
      const metaTitle = `Читати ${t} онлайн в Читанці`;
      this.title.setTitle(metaTitle)
      this.meta.updateTag({
        name: 'title',
        content: metaTitle
      })
      this.meta.updateTag({
        name: 'description',
        content: this.MangadexHelper.desc(v.attributes)
      })
    }
    )
  )

  episodes$ = this.titleService.getTitleEpisodes(this.route.snapshot.params['id']).pipe(tap(v => this.titleService.total.set(v.total)), map(res => res.data), tap(v => this.currentId.set(v[this.activeIndex()].id)))

  currentId = signal('')
  listBlobUrl = '';

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
    // Замінюємо нові рядки на HTML-теги <p> для абзаців
    let html = markdown
        .split('\n\n') // Розбиваємо текст на абзаци
        .map(paragraph => `<p>${paragraph.replace(/\n/g, ' ')}</p>`) // Заміна нових рядків в абзацах на пробіли
        .join('\n'); // Об'єднуємо абзаци назад в один рядок

    // Замінюємо Markdown посилання на HTML
    html = html.replace(/\[([^\]]+)\]\(([^\)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');

    return html;
}
}
