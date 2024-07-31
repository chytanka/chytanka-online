import { AfterContentInit, AfterViewInit, Component, computed, HostBinding, inject, input, signal } from '@angular/core';
import { getAverageColor, MangadexHelper } from '../../utils';
import { CatalogService } from '../../../catalog/data-access/catalog.service';

@Component({
  selector: 'title-card',
  templateUrl: './title-card.component.html',
  styleUrl: './title-card.component.scss'
})
export class TitleCardComponent {
  item = input.required<any>();

  @HostBinding('class.nsfw') get nsfw() : boolean {
    return MangadexHelper.isNSFW(this.item()?.attributes)
  }
  

  MangadexHelper = MangadexHelper;


  catalog = inject(CatalogService)

  @HostBinding('style.--avarage-color')
  avarageColor: string = ''

  @HostBinding('style.--deg')
  deg = signal(this.getRandomDeg() + 'deg')();

  getRandomDeg(min: number = -1, max: number = 1) {
    const r = Math.random();
    return r * (max - min) + min;
  }

  averageColor(event: Event) {
    const img = event.target as HTMLImageElement

    if (!img) return;

    const avc = getAverageColor(img).hex;

    this.avarageColor = avc;
  }
}
