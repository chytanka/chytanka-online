import { Component, inject, signal } from '@angular/core';
import { TitleService } from '../data-access/title.service';
import { map, tap } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { getAverageColor } from '../../shared/util/average-color';

@Component({
  selector: 'app-title',
  templateUrl: './title.component.html',
  styleUrl: './title.component.scss'
})
export class TitleComponent {
  Object = Object;
  document = document.documentElement;
  titleService: TitleService = inject(TitleService);
  protected route: ActivatedRoute = inject(ActivatedRoute)
  sanitizer = inject(DomSanitizer)

  activeIndex = signal(0)

  title$ = this.titleService.getTitle(this.route.snapshot.params['id']).pipe(map(res => res.data))
  episodes$ = this.titleService.getTitleEpisodes(this.route.snapshot.params['id']).pipe(tap(v => this.titleService.total.set(v.total)), map(res => res.data), tap(v => this.currentId.set(v[this.activeIndex()].id)), tap(v => this.listBlobUrl = this.playListUrl(v)
  ))

  currentId = signal('')
  listBlobUrl = '';

  getCover(relationships: any[]): any {
    return relationships?.filter((r: any) => r.type == 'cover_art')[0] ?? null
  }

  getTitle(attributes: any): any {
    return attributes?.altTitles?.filter((alt: any) => alt?.uk)[0]?.uk ?? attributes?.title.en ?? attributes?.title[attributes?.originalLanguage]
  }

  getScanlationGroup(relationships: any[]): any {
    return relationships?.filter((r: any) => r.type == 'scanlation_group')[0] ?? null
  }

  averageColor(event: Event, element: HTMLElement) {
    const img = event.target as HTMLImageElement

    if (!img) return;

    const avc = getAverageColor(img).hex;

    element.style.setProperty('--avarage-color', avc)
  }

  siteTemplates = new Map<string, { name: string, template: string }>()
    .set("al", { name: 'anilist', template: `https://anilist.co/manga/{{value}}` })
    .set("ap", { name: 'animeplanet', template: `https://www.anime-planet.com/manga/{{value}}` })
    .set("bw", { name: 'bookwalker.jp', template: `https://bookwalker.jp/{{value}}` })
    .set("mu", { name: 'mangaupdates', template: `https://www.mangaupdates.com/series.html?id={{value}}` })
    .set("nu", { name: 'novelupdates', template: `https://www.novelupdates.com/series/{{value}}` })
    .set("kt", { name: 'kitsu.io', template: `https://kitsu.io/api/edge/manga/{{value}}` })
    .set("amz", { name: 'amazon', template: `{{value}}` })
    .set("ebj", { name: 'ebookjapan', template: `{{value}}` })
    .set("mal", { name: 'myanimelist', template: `https://myanimelist.net/manga/{{value}}` })
    .set("cdj", { name: 'CDJapan', template: `{{value}}` })
    .set("raw", { name: 'RAW', template: `{{value}}` })
    .set("engtl", { name: 'English', template: `{{value}}` })


  getLink(id: string, value: string) {
    const res = this.siteTemplates.get(id);
    if (!res) return null

    return {
      name: res.name,
      template: res.template.replace('{{value}}', value)
    }
  }

  jsonToBlobURL(obj: any) {
    const str = JSON.stringify(obj);
    const bytes = new TextEncoder().encode(str);
    const blob = new Blob([bytes], {
      type: "application/json;charset=utf-8"
    });

    return URL.createObjectURL(blob)
  }

  playListUrl(mangadexList: any) {
    const res: any[] = []

    mangadexList.forEach((item: any) => {
      res.push(`https://mangadex.org/chapter/${item.id}`)
    });

    return this.jsonToBlobURL(res)
  }
}
