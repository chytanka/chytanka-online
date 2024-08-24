import { inject, Injectable } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { Base64 } from '../utils/base64';

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

  setImage(src: string, text: string) {
    const metaImageHost = `https://chytanka-meta-image.onrender.com`
    this.meta.updateTag({
      property: 'og:image',
      content: `${metaImageHost}/generate-image?imageSrc=${Base64.toBase64(src)}&text=${text}`
    })
  }
}
