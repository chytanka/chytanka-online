import { Component, inject } from '@angular/core';
import { TitleService } from '../data-access/title.service';
import { map, tap } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-title',
  templateUrl: './title.component.html',
  styleUrl: './title.component.scss'
})
export class TitleComponent {
  titleService: TitleService = inject(TitleService);
  protected route: ActivatedRoute = inject(ActivatedRoute)


  title$ = this.titleService.getTitle(this.route.snapshot.params['id']).pipe(map(res => res.data))
  episodes$ = this.titleService.getTitleEpisodes(this.route.snapshot.params['id']).pipe( tap(v=> this.titleService.total.set(v.total)), map(res => res.data))


  getCover(relationships: any[]): any {
    return relationships?.filter((r: any) => r.type == 'cover_art')[0] ?? null
  }

  getTitle(attributes: any): any {
    return attributes?.altTitles?.filter((alt: any) => alt?.uk)[0]?.uk ?? attributes?.title.en ?? attributes?.title[attributes?.originalLanguage]
  }


  getScanlationGroup(relationships: any[]): any {
    return relationships?.filter((r: any) => r.type == 'scanlation_group')[0] ?? null
  }
}
