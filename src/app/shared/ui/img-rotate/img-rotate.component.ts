import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'img-rotate',
  templateUrl: './img-rotate.component.html',
  styleUrl: './img-rotate.component.scss'
})
export class ImgRotateComponent {
  @Input() src: string = '';
  @Input() alt: string = '';

  @Output() load = new EventEmitter()

  onLoad(event: Event) {
    this.load.emit(event)
  }
}
