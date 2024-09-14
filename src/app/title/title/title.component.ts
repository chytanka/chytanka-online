import { AfterViewInit, ChangeDetectionStrategy, Component, computed, ElementRef, inject, OnDestroy, OnInit, PLATFORM_ID, signal, ViewChild } from '@angular/core';
import { TitleService } from '../data-access/title.service';
import { map, MonoTypeOperatorFunction, tap } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { getAverageColor } from '../../shared/utils/average-color';
import { MangadexHelper } from '../../shared/utils';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { MetaTagsService } from '../../shared/data-access/meta-tags.service';
import { CatalogService } from '../../catalog/data-access/catalog.service';

@Component({
  selector: 'app-title',
  templateUrl: './title.component.html',
  styleUrl: './title.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TitleComponent implements OnInit, OnDestroy, AfterViewInit {
  ngAfterViewInit(): void {
    this.initChtnkFrameEvents()

  }

  ngOnDestroy(): void {
    this.meta.removeAdult()
  }

  ngOnInit(): void {
    this.document = (isPlatformBrowser(this.platformId)) ? document?.documentElement : undefined;
  }

  Object = Object;
  MangadexHelper = MangadexHelper

  // @ViewChild('#chtnkFrame', { static: true }) chtnkFrameRef!: ElementRef<HTMLIFrameElement>;

  @ViewChild('chtnkFrame') chtnkFrameRef!: ElementRef<HTMLIFrameElement>;

  eventHandler = new Map<string, Function>()
    .set('changepage', this.onchangepage)
    .set("nsfwchoice", this.onnsfwchoice)
    .set("listrequest", this.onlistrequest)

  initChtnkFrameEvents() {

    if (isPlatformServer(this.platformId)) return

    window.addEventListener('message', (event) => {
      if (![...this.eventHandler.keys()].includes(event.data.type)) return;

      const msg = event.data.message
      const method = this.eventHandler.get(event.data.type)

      if (!msg || !method) return;

      method(msg, this)

    }, false);


  }

  private onlistrequest(msg: any, that: TitleComponent) {
    if (msg.id) {
      that.saveCurrentIdToStorage(msg.id);
    }

    const res = {
      event: 'listresponse',
      data: that.listResponce
    };

    that.chtnkFrameRef.nativeElement.contentWindow?.postMessage(res, "*")
  }

  private onchangepage(msg: any, that: any) {
    // outTotal.value = msg.total;
    // outCurrent.value = msg.current.join(', ')
    // console.log(msg);

  }

  private onnsfwchoice(msg: any, that: any) {
    // console.log("NSFW Choise: ", msg);
  }

  listResponce = []

  platformId = inject(PLATFORM_ID)

  document = (isPlatformBrowser(this.platformId)) ? document?.documentElement : undefined;
  titleService: TitleService = inject(TitleService);
  catalog = inject(CatalogService)
  protected route: ActivatedRoute = inject(ActivatedRoute)

  sanitizer = inject(DomSanitizer)


  meta = inject(MetaTagsService)

  title$ = this.titleService.getTitle(this.route.snapshot.params['id']).pipe(
    map(res => res.data),
    this.tapSetMetaTags()
  )

  protected tapSetMetaTags(): MonoTypeOperatorFunction<any> {
    return tap((v) => {

      const t = MangadexHelper.getTitle(v.attributes);
      const author = MangadexHelper.getAuthor(v.relationships).attributes.name;
      const coverSrc = 'https://mangadex.org/covers/'+v.id+'/'+MangadexHelper.getCover(v.relationships).attributes?.fileName+'.512.jpg'
      this.meta.setOg();
      this.meta.setTwiter()
      this.meta.setTitle(`Читати ${t} від ${author} онлайн в Читанці`)
      this.meta.setDesc(MangadexHelper.desc(v.attributes))
      this.meta.setImage(coverSrc, t, author)
      this.meta.setOgUrl(`https://chtnk.online/${v.id}/${MangadexHelper.getAlias(v.attributes)}`)

      if (MangadexHelper.isNSFW(v.attributes)) {
        this.meta.setAdult()
      }

      this.catalog.query.set(MangadexHelper.getTitle(v.attributes))

    })
  }

  episodes$ = this.titleService.getTitleEpisodes(this.route.snapshot.params['id']).pipe(
    tap(v => this.titleService.total.set(v.total)),
    map(res => res.data),
    tap(v => this.setCurrentId(this.getCurrentId() ?? v[0]?.id)),
    tap(v => {
      this.listResponce = v.map((ep: any) => {
        return {
          id: ep.id,
          site: "mangadex",
          title: ep.attributes?.title ?? undefined
        }
      })

    })
  )

  getCurrentId() {
    const titleId = this.route.snapshot.params['id'];
    const res = (isPlatformBrowser(this.platformId)) ? localStorage.getItem(titleId) : ''

    return res;
  }

  setCurrentId(id: string) {
    this.currentId.set(id);
    this.saveCurrentIdToStorage(id);
  }

  saveCurrentIdToStorage(id: string) {
    const titleID = this.route.snapshot.params['id'];
    if (isPlatformBrowser(this.platformId))
      localStorage.setItem(titleID, id);
  }

  currentId = signal('')

  averageColor(event: Event, element: HTMLElement | undefined) {
    if (!element) return;
    const img = event.target as HTMLImageElement

    if (!img) return;

    const avc = getAverageColor(img).hex;

    element.style.setProperty('--avarage-color', avc)
  }

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
