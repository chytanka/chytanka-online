import { inject, Injectable } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class MetaTagsService {
  title = inject(Title)
  meta = inject(Meta)

  constructor() { }

  setTitle(title: string) {
    this.title.setTitle(title)

    this.meta.updateTag({
      name: 'title',
      content: title
    })
  }

  setDesc(desc: string) {
    this.meta.updateTag({
      name: 'description',
      content: desc
    })
  }

  removeAdult() {
    this.meta.removeTag(`name='rating'`)
  }

  setAdult() {
    this.removeAdult();
    this.meta.addTag({ name: 'rating', content: 'adult' })
  }
}
